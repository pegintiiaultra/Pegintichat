"""Administration de la boutique : commandes, catalogue et prix, instructions de paiement, logiciels Peginti.

Prix, catalogue et publication de logiciels : super administrateur uniquement, avec code de double
authentification frais à chaque modification sensible.
"""
from __future__ import annotations

import hashlib
import os
import secrets

from flask import Blueprint, g, jsonify, request

from . import activite, permissions as perm
from .auth import journaliser
from .boutique import PLATEFORMES, TYPES, appliquer_effets
from .commun import ErreurAPI, cfg, corps_json, exiger_permission, limiter, reauth_totp, texte
from .db import definir_parametre, get_db, maintenant, parametre

bp = Blueprint("admin_boutique", __name__, url_prefix="/api/admin")

EXTENSIONS_LOGICIELS = (".zip", ".apk", ".exe", ".msi", ".dmg", ".pkg", ".deb", ".rpm", ".appimage", ".tar.gz",
                        ".tgz", ".7z")
PRIX_MAX = 10_000_000


# --------------------------------------------------------------------------- commandes
@bp.get("/commandes")
@exiger_permission("commandes.lire")
def commandes_liste():
    statut = request.args.get("statut")
    sql, params = ("SELECT c.*, u.email, u.pseudo FROM commandes c JOIN utilisateurs u ON u.id=c.utilisateur_id "
                   "WHERE 1=1"), []
    if statut in ("en_attente", "validee", "refusee", "annulee"):
        sql += " AND c.statut=?"
        params.append(statut)
    q = (request.args.get("q") or "").strip()[:80]
    if q:
        sql += " AND (c.reference LIKE ? OR u.email LIKE ?)"
        params += [f"%{q}%"] * 2
    db = get_db()
    out = []
    for c in db.execute(sql + " ORDER BY c.id DESC LIMIT 200", params):
        lignes = [dict(r) for r in db.execute("SELECT nom, quantite, prix_unitaire FROM commande_lignes "
                                              "WHERE commande_id=?", (c["id"],))]
        out.append({"id": c["id"], "reference": c["reference"], "statut": c["statut"], "total_xaf": c["total_xaf"],
                    "mode_paiement": c["mode_paiement"], "note": c["note"], "cree_le": c["cree_le"],
                    "client": {"email": c["email"], "pseudo": c["pseudo"]}, "lignes": lignes})
    return jsonify({"commandes": out})


def _traiter_commande(cid: int, valider: bool):
    db = get_db()
    c = db.execute("SELECT * FROM commandes WHERE id=?", (cid,)).fetchone()
    if not c:
        raise ErreurAPI("Commande introuvable.", 404)
    if c["statut"] != "en_attente":
        raise ErreurAPI("Cette commande a déjà été traitée.", 409)
    db.execute("UPDATE commandes SET statut=?, traite_par=?, traite_le=? WHERE id=?",
               ("validee" if valider else "refusee", g.user["id"], maintenant(), cid))
    if valider:
        appliquer_effets(db, cid)
    db.commit()
    journaliser("commande_validee" if valider else "commande_refusee", g.user["id"],
                f"{c['reference']} total={c['total_xaf']}")
    return jsonify({"message": "Commande validée : accès accordé." if valider else "Commande refusée."})


@bp.post("/commandes/<int:cid>/valider")
@exiger_permission("commandes.valider")
def commande_valider(cid: int):
    return _traiter_commande(cid, True)


@bp.post("/commandes/<int:cid>/refuser")
@exiger_permission("commandes.valider")
def commande_refuser(cid: int):
    return _traiter_commande(cid, False)


# --------------------------------------------------------------------------- catalogue et prix
def _produit_admin(db, r) -> dict:
    return {**{k: r[k] for k in ("id", "nom", "description", "details", "categorie", "type", "duree_jours",
                                 "prix_xaf", "image", "ordre")}, "actif": bool(r["actif"]),
            "versions": db.execute("SELECT COUNT(*) FROM logiciels WHERE produit_id=?", (r["id"],)).fetchone()[0],
            "commandes": db.execute("SELECT COUNT(*) FROM commande_lignes WHERE produit_id=?", (r["id"],)).fetchone()[0]}


def _prix(valeur):
    if valeur is None or valeur == "":
        return None
    if not isinstance(valeur, int) or isinstance(valeur, bool) or not 0 <= valeur <= PRIX_MAX:
        raise ErreurAPI(f"Prix invalide : entier en FCFA entre 0 et {PRIX_MAX}, ou vide pour « tarif à venir ».", 400)
    return valeur


@bp.get("/produits")
@exiger_permission("catalogue.lire")
def produits_liste():
    db = get_db()
    return jsonify({"produits": [_produit_admin(db, r) for r in db.execute("SELECT * FROM produits ORDER BY ordre, id")],
                    "types": list(TYPES)})


@bp.post("/produits")
@exiger_permission("catalogue.gerer")
def produit_creer():
    d = corps_json()
    reauth_totp(d)
    typ = d.get("type", "service")
    if typ not in TYPES:
        raise ErreurAPI("Type de produit inconnu.", 400)
    duree = d.get("duree_jours")
    if typ == "abonnement" and (not isinstance(duree, int) or not 1 <= duree <= 3650):
        raise ErreurAPI("Un abonnement a une durée de 1 à 3650 jours par unité.", 400)
    db = get_db()
    cur = db.execute(
        "INSERT INTO produits(nom, description, details, categorie, type, duree_jours, prix_xaf, ordre, actif) "
        "VALUES (?,?,?,?,?,?,?,?,?)",
        (texte(d, "nom", 120, 2), texte(d, "description", 400, 2), (d.get("details") or "")[:3000] or None,
         (d.get("categorie") or "Services").strip()[:60], typ, duree if typ == "abonnement" else None,
         _prix(d.get("prix_xaf")), int(d.get("ordre", 100)) if isinstance(d.get("ordre", 100), int) else 100,
         1 if d.get("actif", True) else 0))
    db.commit()
    journaliser("produit_cree", g.user["id"], f"id={cur.lastrowid} nom={d['nom'][:60]}")
    return jsonify({"produit": _produit_admin(db, db.execute("SELECT * FROM produits WHERE id=?", (cur.lastrowid,)).fetchone())}), 201


@bp.patch("/produits/<int:pid>")
@exiger_permission("catalogue.gerer")
def produit_modifier(pid: int):
    d = corps_json()
    db = get_db()
    r = db.execute("SELECT * FROM produits WHERE id=?", (pid,)).fetchone()
    if not r:
        raise ErreurAPI("Produit introuvable.", 404)
    if "prix_xaf" in d:
        if not perm.a_permission(g.user["role"], "catalogue.prix"):
            raise ErreurAPI("Autorisation insuffisante pour modifier les prix.", 403, "permission")
        reauth_totp(d)
    champs, valeurs, trace = [], [], []
    if "prix_xaf" in d:
        nouveau = _prix(d["prix_xaf"])
        champs.append("prix_xaf=?"), valeurs.append(nouveau)
        trace.append(f"prix {r['prix_xaf']}→{nouveau}")
    for cle, maxi, mini in (("nom", 120, 2), ("description", 400, 2)):
        if cle in d:
            champs.append(f"{cle}=?"), valeurs.append(texte(d, cle, maxi, mini)), trace.append(cle)
    for cle, maxi in (("details", 3000), ("categorie", 60), ("image", 300)):
        if cle in d:
            champs.append(f"{cle}=?"), valeurs.append((str(d[cle] or "").strip()[:maxi]) or None), trace.append(cle)
    if "type" in d:
        if d["type"] not in TYPES:
            raise ErreurAPI("Type de produit inconnu.", 400)
        champs.append("type=?"), valeurs.append(d["type"]), trace.append("type")
    if "duree_jours" in d:
        v = d["duree_jours"]
        if v is not None and (not isinstance(v, int) or not 1 <= v <= 3650):
            raise ErreurAPI("Durée de 1 à 3650 jours.", 400)
        champs.append("duree_jours=?"), valeurs.append(v), trace.append("duree")
    if "ordre" in d and isinstance(d["ordre"], int):
        champs.append("ordre=?"), valeurs.append(d["ordre"]), trace.append("ordre")
    if "actif" in d:
        champs.append("actif=?"), valeurs.append(1 if d["actif"] else 0), trace.append(f"actif={int(bool(d['actif']))}")
    if not champs:
        raise ErreurAPI("Aucune modification demandée.", 400)
    db.execute(f"UPDATE produits SET {', '.join(champs)} WHERE id=?", valeurs + [pid])
    db.commit()
    journaliser("prix_modifie" if "prix_xaf" in d else "produit_modifie", g.user["id"], f"id={pid} " + ", ".join(trace))
    return jsonify({"produit": _produit_admin(db, db.execute("SELECT * FROM produits WHERE id=?", (pid,)).fetchone())})


@bp.delete("/produits/<int:pid>")
@exiger_permission("catalogue.gerer")
def produit_supprimer(pid: int):
    reauth_totp(corps_json())
    db = get_db()
    r = db.execute("SELECT * FROM produits WHERE id=?", (pid,)).fetchone()
    if not r:
        raise ErreurAPI("Produit introuvable.", 404)
    if (db.execute("SELECT 1 FROM commande_lignes WHERE produit_id=?", (pid,)).fetchone()
            or db.execute("SELECT 1 FROM logiciels WHERE produit_id=?", (pid,)).fetchone()):
        raise ErreurAPI("Ce produit a des commandes ou des logiciels : masquez-le (actif = non) plutôt que de le supprimer.", 409)
    db.execute("DELETE FROM produits WHERE id=?", (pid,))
    db.commit()
    journaliser("produit_supprime", g.user["id"], f"id={pid} nom={r['nom'][:60]}")
    return jsonify({"message": "Produit supprimé."})


# --------------------------------------------------------------------------- instructions de paiement
@bp.get("/parametres/paiement")
@exiger_permission("parametres.paiement")
def paiement_lire():
    return jsonify({"instructions": parametre("paiement_instructions")})


@bp.put("/parametres/paiement")
@exiger_permission("parametres.paiement")
def paiement_ecrire():
    d = corps_json()
    reauth_totp(d)
    texte_instructions = texte(d, "instructions", 2000, 10)
    definir_parametre("paiement_instructions", texte_instructions, g.user["id"])
    journaliser("paiement_instructions_modifiees", g.user["id"], f"{len(texte_instructions)} caractères")
    return jsonify({"message": "Instructions de paiement enregistrées."})


# --------------------------------------------------------------------------- logiciels Peginti
def _ligne_logiciel(r) -> dict:
    return {k: r[k] for k in ("id", "produit_id", "produit", "version", "plateforme", "nom_original", "sha256",
                              "taille", "notes", "cree_le", "publie_le", "telechargements")} | {"publie": bool(r["publie"])}


@bp.get("/logiciels")
@exiger_permission("logiciels.publier")
def logiciels_liste():
    rows = get_db().execute("SELECT l.*, p.nom AS produit FROM logiciels l JOIN produits p ON p.id=l.produit_id "
                            "ORDER BY l.id DESC").fetchall()
    return jsonify({"logiciels": [_ligne_logiciel(r) for r in rows], "plateformes": list(PLATEFORMES),
                    "taille_max_mo": cfg().upload_max_mo})


@bp.post("/logiciels")
@exiger_permission("logiciels.publier")
def logiciel_ajouter():
    limiter(f"upload:{g.user['id']}", 20, 3600)
    request.max_content_length = (cfg().upload_max_mo + 1) * 1024 * 1024  # autorise le fichier, uniquement ici
    form, fichier = request.form, request.files.get("fichier")
    reauth_totp({"code_totp": form.get("code_totp")})
    if not fichier or not fichier.filename:
        raise ErreurAPI("Joignez le fichier du logiciel.", 400)
    nom = fichier.filename.strip()[:200]
    ext = next((e for e in sorted(EXTENSIONS_LOGICIELS, key=len, reverse=True) if nom.lower().endswith(e)), None)
    if not ext:
        raise ErreurAPI("Type de fichier non accepté (" + ", ".join(EXTENSIONS_LOGICIELS) + ").", 400)
    version = (form.get("version") or "").strip()
    plateforme = form.get("plateforme")
    if not version or len(version) > 40 or plateforme not in PLATEFORMES:
        raise ErreurAPI("Version (40 caractères max) et plateforme valide requises.", 400)
    db = get_db()
    try:
        pid = int(form.get("produit_id", ""))
    except ValueError:
        raise ErreurAPI("Produit invalide.", 400)
    p = db.execute("SELECT * FROM produits WHERE id=?", (pid,)).fetchone()
    if not p or p["type"] != "logiciel":
        raise ErreurAPI("Choisissez un produit de type « logiciel ».", 400)
    dossier = cfg().dossier_logiciels
    os.makedirs(dossier, mode=0o700, exist_ok=True)
    stocke = secrets.token_hex(16) + ext
    chemin = os.path.join(dossier, stocke)
    fichier.save(chemin)
    try:
        h = hashlib.sha256()
        with open(chemin, "rb") as f:
            for bloc in iter(lambda: f.read(1 << 20), b""):
                h.update(bloc)
        taille = os.path.getsize(chemin)
        if taille == 0 or taille > cfg().upload_max_mo * 1024 * 1024:
            raise ErreurAPI("Fichier vide ou trop volumineux.", 400)
        publie = 1 if form.get("publie") in ("1", "true", "on") else 0
        cur = db.execute(
            "INSERT INTO logiciels(produit_id, version, plateforme, fichier, nom_original, sha256, taille, notes, "
            "publie, publie_par, cree_le, publie_le) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
            (pid, version, plateforme, stocke, nom, h.hexdigest(), taille, (form.get("notes") or "").strip()[:1000] or None,
             publie, g.user["id"] if publie else None, maintenant(), maintenant() if publie else None))
        db.commit()
    except Exception:
        os.remove(chemin)
        raise
    journaliser("logiciel_ajoute", g.user["id"], f"{p['nom'][:40]} v{version} {plateforme} sha256={h.hexdigest()[:16]} publie={publie}")
    r = db.execute("SELECT l.*, pr.nom AS produit FROM logiciels l JOIN produits pr ON pr.id=l.produit_id WHERE l.id=?",
                   (cur.lastrowid,)).fetchone()
    return jsonify({"logiciel": _ligne_logiciel(r)}), 201


@bp.patch("/logiciels/<int:lid>")
@exiger_permission("logiciels.publier")
def logiciel_modifier(lid: int):
    d = corps_json()
    reauth_totp(d)
    db = get_db()
    r = db.execute("SELECT * FROM logiciels WHERE id=?", (lid,)).fetchone()
    if not r:
        raise ErreurAPI("Logiciel introuvable.", 404)
    if "publie" in d:
        publie = 1 if d["publie"] else 0
        db.execute("UPDATE logiciels SET publie=?, publie_par=?, publie_le=? WHERE id=?",
                   (publie, g.user["id"], maintenant() if publie else None, lid))
        journaliser("logiciel_publie" if publie else "logiciel_retire", g.user["id"],
                    f"id={lid} v{r['version']} sha256={r['sha256'][:16]}")
    if "notes" in d:
        db.execute("UPDATE logiciels SET notes=? WHERE id=?", (str(d["notes"] or "").strip()[:1000] or None, lid))
    db.commit()
    row = db.execute("SELECT l.*, p.nom AS produit FROM logiciels l JOIN produits p ON p.id=l.produit_id WHERE l.id=?",
                     (lid,)).fetchone()
    return jsonify({"logiciel": _ligne_logiciel(row)})


@bp.delete("/logiciels/<int:lid>")
@exiger_permission("logiciels.publier")
def logiciel_supprimer(lid: int):
    reauth_totp(corps_json())
    db = get_db()
    r = db.execute("SELECT * FROM logiciels WHERE id=?", (lid,)).fetchone()
    if not r:
        raise ErreurAPI("Logiciel introuvable.", 404)
    db.execute("DELETE FROM logiciels WHERE id=?", (lid,))
    db.commit()
    try:
        os.remove(os.path.join(cfg().dossier_logiciels, os.path.basename(r["fichier"])))
    except OSError:
        pass
    journaliser("logiciel_supprime", g.user["id"], f"id={lid} v{r['version']}")
    return jsonify({"message": "Version supprimée."})
