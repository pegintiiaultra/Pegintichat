"""Vitrine premium en boutique en ligne : catalogue, fiche produit, panier chiffré par le serveur, commande,
historique, logiciels achetés. Les prix viennent toujours de la base : jamais du navigateur."""
from __future__ import annotations

import os
import re

from flask import Blueprint, g, jsonify, request, send_file

from . import activite, permissions as perm
from .commun import ErreurAPI, cfg, corps_json, exiger_connexion, ip_client, limiter, texte
from .db import definir_parametre, get_db, maintenant, parametre, reference_commande  # noqa: F401

bp = Blueprint("boutique", __name__, url_prefix="/api")

TYPES = ("abonnement", "logiciel", "service")
PLATEFORMES = ("android", "windows", "linux", "macos", "termux", "toutes")
MODES_PAIEMENT = {"orange_money": "Orange Money", "mtn_momo": "MTN Mobile Money",
                  "carte": "Carte bancaire", "virement": "Virement bancaire"}
MAX_LIGNES, MAX_QUANTITE, MAX_EN_ATTENTE = 20, 24, 5


# --------------------------------------------------------------------------- sérialisation
def _versions_publiques(db, produit_id: int, tout: bool = False) -> list[dict]:
    sql = ("SELECT id, version, plateforme, taille, sha256, notes, publie_le FROM logiciels WHERE produit_id=?"
           + ("" if tout else " AND publie=1") + " ORDER BY id DESC")
    return [dict(r) for r in db.execute(sql, (produit_id,))]


def produit_public(db, r, avec_versions: bool = True) -> dict:
    p = {"id": r["id"], "nom": r["nom"], "description": r["description"], "details": r["details"],
         "categorie": r["categorie"], "type": r["type"], "duree_jours": r["duree_jours"],
         "prix_xaf": r["prix_xaf"], "image": r["image"], "disponible": r["prix_xaf"] is not None}
    if avec_versions and r["type"] == "logiciel":
        p["versions"] = _versions_publiques(db, r["id"])
        p["plateformes"] = sorted({v["plateforme"] for v in p["versions"]})
    return p


def _lignes_commande(db, commande_id: int) -> list[dict]:
    return [dict(r) for r in db.execute(
        "SELECT produit_id, nom, quantite, prix_unitaire, quantite*prix_unitaire AS sous_total "
        "FROM commande_lignes WHERE commande_id=? ORDER BY id", (commande_id,))]


def commande_publique(db, c) -> dict:
    return {"id": c["id"], "reference": c["reference"], "statut": c["statut"], "total_xaf": c["total_xaf"],
            "mode_paiement": MODES_PAIEMENT.get(c["mode_paiement"], c["mode_paiement"]), "note": c["note"],
            "cree_le": c["cree_le"], "lignes": _lignes_commande(db, c["id"])}


# --------------------------------------------------------------------------- catalogue
@bp.get("/premium/catalogue")
def catalogue():
    db = get_db()
    q = (request.args.get("q") or "").strip()[:80]
    sql, params = "FROM produits WHERE actif=1", []
    if q:
        sql += " AND (nom LIKE ? ESCAPE '\\' OR description LIKE ? ESCAPE '\\' OR categorie LIKE ? ESCAPE '\\')"
        motif = "%" + q.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%"
        params += [motif] * 3
    cat, typ = (request.args.get("categorie") or "").strip(), (request.args.get("type") or "").strip()
    if cat:
        sql += " AND categorie=?"
        params.append(cat)
    if typ in TYPES:
        sql += " AND type=?"
        params.append(typ)
    if request.args.get("disponibles") == "1":
        sql += " AND prix_xaf IS NOT NULL"
    ordre = {"prix_asc": "prix_xaf IS NULL, prix_xaf ASC", "prix_desc": "prix_xaf IS NULL, prix_xaf DESC",
             "nom": "nom COLLATE NOCASE ASC"}.get(request.args.get("tri"), "ordre ASC, id ASC")
    rows = db.execute("SELECT * " + sql + f" ORDER BY {ordre} LIMIT 200", params).fetchall()
    categories = [r[0] for r in db.execute("SELECT DISTINCT categorie FROM produits WHERE actif=1 ORDER BY categorie")]
    activite.enregistrer("PREMIUM", "consultation", g.user, detail=f"catalogue q={q[:30]}" if q else "catalogue")
    return jsonify({"produits": [produit_public(db, r) for r in rows], "categories": categories,
                    "types": list(TYPES)})


@bp.get("/premium/produits/<int:pid>")
def produit(pid: int):
    db = get_db()
    r = db.execute("SELECT * FROM produits WHERE id=? AND actif=1", (pid,)).fetchone()
    if not r:
        raise ErreurAPI("Produit introuvable.", 404)
    activite.enregistrer("PREMIUM", "consultation", g.user, detail=f"produit {pid}")
    similaires = db.execute("SELECT * FROM produits WHERE actif=1 AND categorie=? AND id<>? ORDER BY ordre LIMIT 4",
                            (r["categorie"], pid)).fetchall()
    return jsonify({"produit": produit_public(db, r), "similaires": [produit_public(db, s, False) for s in similaires]})


@bp.get("/premium/paiement")
def infos_paiement():
    return jsonify({"instructions": parametre("paiement_instructions"),
                    "modes": [{"id": k, "nom": v} for k, v in MODES_PAIEMENT.items()], "devise": "FCFA"})


# --------------------------------------------------------------------------- panier et commande
def _valider_lignes(db, brut) -> tuple[list[dict], list[str]]:
    """Normalise les lignes envoyées par le navigateur et les chiffre d'après la base."""
    if not isinstance(brut, list) or not brut or len(brut) > MAX_LIGNES:
        raise ErreurAPI(f"Le panier doit contenir entre 1 et {MAX_LIGNES} lignes.", 400)
    cumul: dict[int, int] = {}
    for ligne in brut:
        pid, qte = (ligne or {}).get("produit_id"), (ligne or {}).get("quantite", 1)
        if (not isinstance(pid, int) or isinstance(pid, bool) or not isinstance(qte, int) or isinstance(qte, bool)
                or not 1 <= qte <= MAX_QUANTITE):
            raise ErreurAPI(f"Ligne invalide (quantité de 1 à {MAX_QUANTITE}).", 400)
        cumul[pid] = min(MAX_QUANTITE, cumul.get(pid, 0) + qte)
    lignes, indisponibles = [], []
    for pid, qte in cumul.items():
        r = db.execute("SELECT id, nom, prix_xaf, type FROM produits WHERE id=? AND actif=1", (pid,)).fetchone()
        if not r:
            indisponibles.append(f"Produit {pid} introuvable")
        elif r["prix_xaf"] is None:
            indisponibles.append(f"« {r['nom']} » : tarif à venir")
        else:
            lignes.append({"produit_id": r["id"], "nom": r["nom"], "type": r["type"], "quantite": qte,
                           "prix_unitaire": r["prix_xaf"], "sous_total": r["prix_xaf"] * qte})
    return lignes, indisponibles


@bp.post("/premium/panier")
def panier():
    limiter(f"panier:{ip_client()}", 120, 60)
    lignes, indisponibles = _valider_lignes(get_db(), corps_json().get("lignes"))
    return jsonify({"lignes": lignes, "indisponibles": indisponibles,
                    "total_xaf": sum(x["sous_total"] for x in lignes), "devise": "FCFA"})


def appliquer_effets(db, commande_id: int) -> None:
    """Commande validée : prolonge l'accès premium pour chaque abonnement acheté."""
    c = db.execute("SELECT * FROM commandes WHERE id=?", (commande_id,)).fetchone()
    u = db.execute("SELECT * FROM utilisateurs WHERE id=?", (c["utilisateur_id"],)).fetchone()
    jours = db.execute(
        "SELECT COALESCE(SUM(l.quantite * COALESCE(p.duree_jours, 30)), 0) FROM commande_lignes l "
        "JOIN produits p ON p.id=l.produit_id WHERE l.commande_id=? AND p.type='abonnement'",
        (commande_id,)).fetchone()[0]
    if not jours or perm.est_equipe(u["role"]):
        return
    if u["role"] == "premium" and u["premium_jusqua"] is None:
        return  # accès premium accordé sans échéance : rien à prolonger
    base = max(maintenant(), u["premium_jusqua"] or 0)
    db.execute("UPDATE utilisateurs SET role='premium', premium_jusqua=? WHERE id=?",
               (base + jours * 86400, u["id"]))


@bp.post("/premium/commande")
@exiger_connexion()
def commander():
    limiter(f"cmd:{g.user['id']}", 10, 3600)
    d = corps_json()
    db = get_db()
    lignes, indisponibles = _valider_lignes(db, d.get("lignes"))
    if indisponibles:
        raise ErreurAPI("Certains articles ne sont pas disponibles.", 400, "indisponible", {"details": indisponibles})
    total = sum(x["sous_total"] for x in lignes)
    mode = d.get("mode_paiement")
    if total > 0 and mode not in MODES_PAIEMENT:
        raise ErreurAPI("Choisissez un mode de paiement.", 400, "mode_paiement")
    note = str(d.get("note") or "").strip()[:300] or None
    if db.execute("SELECT COUNT(*) FROM commandes WHERE utilisateur_id=? AND statut='en_attente'",
                  (g.user["id"],)).fetchone()[0] >= MAX_EN_ATTENTE:
        raise ErreurAPI(f"Vous avez déjà {MAX_EN_ATTENTE} commandes en attente de paiement : annulez-en ou "
                        "attendez leur validation.", 409)
    statut = "validee" if total == 0 else "en_attente"
    cur = db.execute("INSERT INTO commandes(utilisateur_id, statut, total_xaf, mode_paiement, note, cree_le) "
                     "VALUES (?,?,?,?,?,?)", (g.user["id"], statut, total, mode if total else None, note, maintenant()))
    cid = cur.lastrowid
    db.execute("UPDATE commandes SET reference=? WHERE id=?", (reference_commande(cid), cid))
    db.executemany("INSERT INTO commande_lignes(commande_id, produit_id, nom, quantite, prix_unitaire) VALUES (?,?,?,?,?)",
                   [(cid, x["produit_id"], x["nom"], x["quantite"], x["prix_unitaire"]) for x in lignes])
    if statut == "validee":
        appliquer_effets(db, cid)
    db.commit()
    c = db.execute("SELECT * FROM commandes WHERE id=?", (cid,)).fetchone()
    activite.enregistrer("PREMIUM", "commande", g.user, detail=f"{c['reference']} total={total} {statut}")
    msg = ("Commande gratuite validée : vos articles sont disponibles."
           if statut == "validee" else
           "Commande enregistrée. Effectuez le paiement en suivant les instructions, en indiquant la référence. "
           "Elle sera validée par TOMTECH.INC après confirmation du paiement.")
    return jsonify({"commande": commande_publique(db, c), "message": msg,
                    "paiement": {"instructions": parametre("paiement_instructions"),
                                 "mode": MODES_PAIEMENT.get(mode)} if statut == "en_attente" else None}), 201


@bp.get("/premium/commandes")
@exiger_connexion()
def mes_commandes():
    db = get_db()
    rows = db.execute("SELECT * FROM commandes WHERE utilisateur_id=? ORDER BY id DESC LIMIT 100", (g.user["id"],))
    return jsonify({"commandes": [commande_publique(db, c) for c in rows]})


@bp.post("/premium/commandes/<int:cid>/annuler")
@exiger_connexion()
def annuler(cid: int):
    db = get_db()
    c = db.execute("SELECT * FROM commandes WHERE id=? AND utilisateur_id=?", (cid, g.user["id"])).fetchone()
    if not c:
        raise ErreurAPI("Commande introuvable.", 404)
    if c["statut"] != "en_attente":
        raise ErreurAPI("Seule une commande en attente peut être annulée.", 409)
    db.execute("UPDATE commandes SET statut='annulee', traite_le=? WHERE id=?", (maintenant(), cid))
    db.commit()
    return jsonify({"message": "Commande annulée."})


# --------------------------------------------------------------------------- logiciels achetés
def a_droit_logiciel(db, user: dict, prix, produit_id: int) -> bool:
    if perm.a_permission(user["role"], "logiciels.publier"):
        return True  # le super administrateur peut tout télécharger, pour vérifier ses publications
    if prix == 0:
        return True  # logiciel gratuit : un compte suffit
    return db.execute("SELECT 1 FROM commande_lignes l JOIN commandes c ON c.id=l.commande_id "
                      "WHERE c.utilisateur_id=? AND c.statut='validee' AND l.produit_id=? LIMIT 1",
                      (user["id"], produit_id)).fetchone() is not None


@bp.get("/premium/mes-logiciels")
@exiger_connexion()
def mes_logiciels():
    db = get_db()
    rows = db.execute("SELECT l.id, l.version, l.plateforme, l.taille, l.sha256, l.notes, l.publie_le, "
                      "p.id AS produit_id, p.nom AS produit, p.prix_xaf FROM logiciels l "
                      "JOIN produits p ON p.id=l.produit_id WHERE l.publie=1 AND p.actif=1 "
                      "ORDER BY p.nom, l.id DESC").fetchall()
    out = [{k: r[k] for k in ("id", "version", "plateforme", "taille", "sha256", "notes", "publie_le",
                              "produit_id", "produit")} for r in rows
           if a_droit_logiciel(db, g.user, r["prix_xaf"], r["produit_id"])]
    return jsonify({"logiciels": out})


@bp.get("/logiciels/<int:lid>/telecharger")
@exiger_connexion()
def telecharger(lid: int):
    limiter(f"dl:{g.user['id']}", 20, 3600)
    db = get_db()
    r = db.execute("SELECT l.*, p.prix_xaf, p.actif FROM logiciels l JOIN produits p ON p.id=l.produit_id "
                   "WHERE l.id=?", (lid,)).fetchone()
    peut_tout = perm.a_permission(g.user["role"], "logiciels.publier")
    if not r or (not peut_tout and not (r["publie"] and r["actif"])):
        raise ErreurAPI("Logiciel introuvable.", 404)
    if not a_droit_logiciel(db, g.user, r["prix_xaf"], r["produit_id"]):
        raise ErreurAPI("Achetez ce logiciel pour le télécharger : votre commande doit être validée.", 403, "achat_requis")
    chemin = os.path.join(cfg().dossier_logiciels, os.path.basename(r["fichier"]))
    if not os.path.isfile(chemin):
        raise ErreurAPI("Fichier momentanément indisponible.", 404)
    db.execute("UPDATE logiciels SET telechargements=telechargements+1 WHERE id=?", (lid,))
    db.commit()
    activite.enregistrer("PREMIUM", "telechargement", g.user, detail=f"logiciel {lid} v{r['version']}")
    rep = send_file(chemin, as_attachment=True, download_name=re.sub(r"[^\w.\- ]", "_", r["nom_original"]),
                    max_age=0, mimetype="application/octet-stream")
    rep.headers["X-SHA256"] = r["sha256"]
    return rep
