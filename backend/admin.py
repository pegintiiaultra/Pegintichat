"""Administration : profil de charge, état, tableau d'activité, équipe, utilisateurs, audit, maintenance.

Chaque route exige une permission précise (permissions.py). Les actions sur l'équipe exigent en plus un code
de double authentification frais (ré-authentification) : une session volée ne suffit pas.
"""
from __future__ import annotations

import os
import secrets
import time
from datetime import datetime, timezone

from flask import Blueprint, current_app, g, jsonify, request

from . import courriel, permissions as perm, security as sec
from .services import llm
from .activite import VITRINES
from .auth import _jeton_courriel, journaliser
from .commun import (ErreurAPI, cfg, corps_json, exiger_connexion, exiger_permission, reauth_totp, texte)
from .config import VERSION
from .db import get_db, maintenant

bp = Blueprint("admin", __name__, url_prefix="/api/admin")
DEMARRE = time.time()
ROLES_CREABLES = ("technique", "admin")


def _borne(valeur, defaut: int, mini: int, maxi: int) -> int:
    try:
        return max(mini, min(maxi, int(valeur)))
    except (TypeError, ValueError):
        return defaut


def _echappe_like(q: str) -> str:
    return q.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


# --------------------------------------------------------------------------- profil de charge
@bp.get("/moi")
@exiger_connexion(*perm.ROLES_EQUIPE)
def moi():
    d = perm.DESCRIPTIONS[g.user["role"]]
    return jsonify({"role": g.user["role"], "nom": d["nom"], "charge": g.user["charge"] or d["charge"],
                    "peut": d["peut"], "ne_peut_pas": d["ne_peut_pas"],
                    "permissions": sorted(perm.permissions_de(g.user["role"]))})


# --------------------------------------------------------------------------- état du système
@bp.get("/etat")
@exiger_permission("systeme.etat")
def etat():
    c, db = cfg(), get_db()
    now = maintenant()
    data = {
        "version": VERSION, "environnement": c.env, "adresse": c.base_url,
        "demarre_le": datetime.fromtimestamp(DEMARRE, timezone.utc).isoformat(),
        "duree_s": int(time.time() - DEMARRE),
        "wounanet": current_app.extensions["wounanet"].etat(),
        "moteur_configure": bool(c.gemini_keys), "moteur": llm.etat_moteur(c), "smtp_configure": bool(c.smtp["hote"]),
        "taille_base_mo": round(os.path.getsize(c.db_path) / 1048576, 2),
        "sessions_actives": db.execute("SELECT COUNT(*) FROM sessions WHERE expire_le>?", (now,)).fetchone()[0],
    }
    if perm.a_permission(g.user["role"], "utilisateurs.lire"):
        data["utilisateurs"] = {r["role"]: r["n"] for r in
                                db.execute("SELECT role, COUNT(*) n FROM utilisateurs GROUP BY role")}
    return jsonify(data)


# --------------------------------------------------------------------------- activité de toutes les chaînes
@bp.get("/tableau")
@exiger_permission("activite.toutes")
def tableau():
    jours = _borne(request.args.get("jours"), 7, 1, 90)
    now = maintenant()
    debut, db = now - jours * 86400, get_db()
    unique = "COUNT(DISTINCT COALESCE('u'||utilisateur_id, 'a'||anonyme))"
    chaines = {}
    for v in VITRINES:
        tot = db.execute(f"SELECT COUNT(*) n, {unique} u FROM activite WHERE vitrine=? AND ts>=?", (v, debut)).fetchone()
        dernier = db.execute("SELECT COUNT(*) FROM activite WHERE vitrine=? AND ts>=?", (v, now - 86400)).fetchone()[0]
        chaines[v] = {
            "total": tot["n"], "visiteurs_distincts": tot["u"], "dernieres_24h": dernier,
            "par_type": {r[0]: r[1] for r in db.execute(
                "SELECT type, COUNT(*) FROM activite WHERE vitrine=? AND ts>=? GROUP BY type", (v, debut))},
            "par_mode": {r[0]: r[1] for r in db.execute(
                "SELECT mode, COUNT(*) FROM activite WHERE vitrine=? AND ts>=? AND type='requete' AND mode IS NOT NULL "
                "GROUP BY mode", (v, debut))},
            "intentions": [{"intention": r[0], "n": r[1]} for r in db.execute(
                "SELECT intention, COUNT(*) n FROM activite WHERE vitrine=? AND ts>=? AND intention IS NOT NULL "
                "GROUP BY intention ORDER BY n DESC LIMIT 5", (v, debut))],
        }
    serie = {v: {} for v in VITRINES}
    for r in db.execute("SELECT ts/86400 j, vitrine, COUNT(*) n FROM activite WHERE ts>=? GROUP BY j, vitrine", (debut,)):
        if r["vitrine"] in serie:
            serie[r["vitrine"]][r["j"]] = r["n"]
    jour0 = now // 86400
    jours_liste = [jour0 - i for i in range(jours - 1, -1, -1)]
    courbe = {"jours": [datetime.fromtimestamp(j * 86400, timezone.utc).strftime("%Y-%m-%d") for j in jours_liste],
              **{v: [serie[v].get(j, 0) for j in jours_liste] for v in VITRINES}}
    ventes = db.execute("SELECT COUNT(*) n, COALESCE(SUM(total_xaf),0) ca FROM commandes WHERE statut='validee' AND "
                        "cree_le>=?", (debut,)).fetchone()
    derniers = [dict(r) for r in db.execute(
        "SELECT a.ts, a.vitrine, a.type, a.intention, a.mode, a.detail, u.pseudo FROM activite a "
        "LEFT JOIN utilisateurs u ON u.id=a.utilisateur_id ORDER BY a.id DESC LIMIT 25")]
    return jsonify({
        "jours": jours, "chaines": chaines, "courbe": courbe, "derniers": derniers,
        "utilisateurs": {r["role"]: r["n"] for r in db.execute("SELECT role, COUNT(*) n FROM utilisateurs GROUP BY role")},
        "nouveaux_utilisateurs": db.execute("SELECT COUNT(*) FROM utilisateurs WHERE cree_le>=?", (debut,)).fetchone()[0],
        "commandes_en_attente": db.execute("SELECT COUNT(*) FROM commandes WHERE statut='en_attente'").fetchone()[0],
        "ventes": {"commandes_validees": ventes["n"], "chiffre_affaires_xaf": ventes["ca"]},
        "note": "Métadonnées uniquement : le contenu des messages n'est jamais journalisé ni affiché.",
    })


# --------------------------------------------------------------------------- équipe (super administrateur)
def _ligne_equipe(r) -> dict:
    return {"id": r["id"], "email": r["email"], "pseudo": r["pseudo"], "role": r["role"], "charge": r["charge"],
            "actif": bool(r["actif"]), "totp_actif": bool(r["totp_actif"]), "email_verifie": bool(r["email_verifie"]),
            "cree_le": r["cree_le"], "derniere_connexion": r["derniere_connexion"], "cree_par": r["cree_par"]}


def _cible_equipe(uid: int):
    u = get_db().execute("SELECT * FROM utilisateurs WHERE id=?", (uid,)).fetchone()
    if not u or not perm.est_equipe(u["role"]):
        raise ErreurAPI("Compte d'équipe introuvable.", 404)
    if u["role"] == "superadmin":
        raise ErreurAPI("Le compte super administrateur ne se gère que depuis le terminal (manage.py).", 403, "superadmin")
    return u


def _lien_invitation(uid: int) -> str:
    jeton = _jeton_courriel(uid, "reset_mdp", 72 * 3600)
    return f"{cfg().base_url}/jeton?type=reset&jeton={jeton}"


def _envoyer_invitation(u, lien: str) -> bool:
    return courriel.envoyer(u["email"], "PEGINTI IA — votre compte équipe TOMTECH.INC",
                            f"Bonjour {u['pseudo']},\n\nUn compte « {perm.DESCRIPTIONS[u['role']]['nom']} » vous a été créé.\n"
                            f"Définissez votre mot de passe (lien valable 72 h) :\n{lien}\n\n"
                            "À votre première connexion, vous devrez activer la double authentification : "
                            "elle est obligatoire pour l'équipe.")


@bp.get("/equipe")
@exiger_permission("staff.gerer")
def equipe_liste():
    rows = get_db().execute("SELECT * FROM utilisateurs WHERE role IN ('technique','admin','superadmin') "
                            "ORDER BY CASE role WHEN 'superadmin' THEN 0 WHEN 'admin' THEN 1 ELSE 2 END, id").fetchall()
    return jsonify({"equipe": [_ligne_equipe(r) for r in rows],
                    "roles": {r: {"nom": perm.DESCRIPTIONS[r]["nom"], "charge": perm.DESCRIPTIONS[r]["charge"],
                                  "peut": perm.DESCRIPTIONS[r]["peut"], "ne_peut_pas": perm.DESCRIPTIONS[r]["ne_peut_pas"]}
                              for r in perm.ROLES_EQUIPE}})


@bp.post("/equipe")
@exiger_permission("staff.gerer")
def equipe_creer():
    d = corps_json()
    reauth_totp(d)
    email = sec.normaliser_email(d.get("email"))
    pseudo = texte(d, "pseudo", 32, 3)
    role = d.get("role")
    if not sec.email_valide(email) or not sec.pseudo_valide(pseudo):
        raise ErreurAPI("Adresse e-mail ou pseudo invalide.", 400)
    if role not in ROLES_CREABLES:
        raise ErreurAPI("Rôle d'équipe invalide : « technique » ou « admin ».", 400)
    charge = (d.get("charge") or "").strip() or perm.DESCRIPTIONS[role]["charge"]
    if len(charge) > 200:
        raise ErreurAPI("Charge : 200 caractères maximum.", 400)
    db = get_db()
    if db.execute("SELECT 1 FROM utilisateurs WHERE email=?", (email,)).fetchone():
        raise ErreurAPI("Cette adresse est déjà utilisée par un compte.", 409)
    inutilisable = sec.hasher_mot_de_passe(secrets.token_urlsafe(32), cfg().pepper)
    cur = db.execute("INSERT INTO utilisateurs(email, pseudo, mdp_hash, role, charge, cree_par, cree_le) "
                     "VALUES (?,?,?,?,?,?,?)", (email, pseudo.strip(), inutilisable, role, charge, g.user["id"], maintenant()))
    db.commit()
    u = db.execute("SELECT * FROM utilisateurs WHERE id=?", (cur.lastrowid,)).fetchone()
    lien = _lien_invitation(u["id"])
    envoye = _envoyer_invitation(u, lien)
    journaliser("equipe_creee", g.user["id"], f"cible={email} role={role}")
    return jsonify({"utilisateur": _ligne_equipe(u), "lien_invitation": lien, "e_mail_envoye": envoye,
                    "message": "Compte créé. Transmettez le lien d'invitation (affiché une seule fois, valable 72 h) "
                               "à la personne concernée."}), 201


@bp.patch("/equipe/<int:uid>")
@exiger_permission("staff.gerer")
def equipe_modifier(uid: int):
    d = corps_json()
    reauth_totp(d)
    u = _cible_equipe(uid)
    if u["id"] == g.user["id"]:
        raise ErreurAPI("Vous ne pouvez pas modifier votre propre compte ici.", 400)
    db = get_db()
    changements = []
    if "role" in d:
        if d["role"] not in ROLES_CREABLES:
            raise ErreurAPI("Rôle d'équipe invalide.", 400)
        db.execute("UPDATE utilisateurs SET role=? WHERE id=?", (d["role"], uid))
        changements.append(f"role={u['role']}→{d['role']}")
    if "charge" in d:
        charge = str(d["charge"] or "").strip()[:200]
        db.execute("UPDATE utilisateurs SET charge=? WHERE id=?", (charge or None, uid))
        changements.append("charge")
    if "actif" in d:
        actif = 1 if d["actif"] else 0
        db.execute("UPDATE utilisateurs SET actif=? WHERE id=?", (actif, uid))
        if not actif:
            db.execute("DELETE FROM sessions WHERE utilisateur_id=?", (uid,))
        changements.append(f"actif={actif}")
    if not changements:
        raise ErreurAPI("Aucune modification demandée.", 400)
    db.commit()
    journaliser("equipe_modifiee", g.user["id"], f"cible={u['email']} " + " ".join(changements))
    return jsonify({"utilisateur": _ligne_equipe(db.execute("SELECT * FROM utilisateurs WHERE id=?", (uid,)).fetchone())})


@bp.delete("/equipe/<int:uid>")
@exiger_permission("staff.gerer")
def equipe_supprimer(uid: int):
    reauth_totp(corps_json())
    u = _cible_equipe(uid)
    if u["id"] == g.user["id"]:
        raise ErreurAPI("Vous ne pouvez pas supprimer votre propre compte.", 400)
    db = get_db()
    journaliser("equipe_supprimee", g.user["id"], f"cible={u['email']} role={u['role']}")
    db.execute("UPDATE activite SET utilisateur_id=NULL WHERE utilisateur_id=?", (uid,))
    db.execute("DELETE FROM utilisateurs WHERE id=?", (uid,))  # sessions, mémoire, codes de secours : en cascade
    db.commit()
    return jsonify({"message": "Compte supprimé."})


@bp.post("/equipe/<int:uid>/reinit-2fa")
@exiger_permission("staff.gerer")
def equipe_reinit_2fa(uid: int):
    reauth_totp(corps_json())
    u = _cible_equipe(uid)
    db = get_db()
    db.execute("UPDATE utilisateurs SET totp_actif=0, totp_secret=NULL, totp_dernier_pas=0 WHERE id=?", (uid,))
    db.execute("DELETE FROM codes_secours WHERE utilisateur_id=?", (uid,))
    db.execute("DELETE FROM sessions WHERE utilisateur_id=?", (uid,))
    db.commit()
    journaliser("equipe_2fa_reinitialisee", g.user["id"], f"cible={u['email']}")
    return jsonify({"message": "Double authentification réinitialisée. La personne devra la réactiver à sa prochaine "
                               "connexion (obligatoire)."})


@bp.post("/equipe/<int:uid>/invitation")
@exiger_permission("staff.gerer")
def equipe_invitation(uid: int):
    reauth_totp(corps_json())
    u = _cible_equipe(uid)
    lien = _lien_invitation(uid)
    envoye = _envoyer_invitation(u, lien)
    journaliser("equipe_invitation_renouvelee", g.user["id"], f"cible={u['email']}")
    return jsonify({"lien_invitation": lien, "e_mail_envoye": envoye})


# --------------------------------------------------------------------------- utilisateurs (admin, super administrateur)
def _ligne_utilisateur(r) -> dict:
    now = maintenant()
    return {"id": r["id"], "email": r["email"], "pseudo": r["pseudo"],
            "role": perm.role_effectif(r["role"], r["premium_jusqua"], now), "premium_jusqua": r["premium_jusqua"],
            "actif": bool(r["actif"]), "email_verifie": bool(r["email_verifie"]), "totp_actif": bool(r["totp_actif"]),
            "verrouille": r["verrou_jusqua"] > now, "cree_le": r["cree_le"], "derniere_connexion": r["derniere_connexion"]}


@bp.get("/utilisateurs")
@exiger_permission("utilisateurs.lire")
def utilisateurs_liste():
    q = (request.args.get("q") or "").strip()[:80]
    limite, decalage = _borne(request.args.get("limite"), 50, 1, 200), _borne(request.args.get("decalage"), 0, 0, 10**7)
    # Les comptes de l'équipe ne figurent jamais ici : ils se gèrent dans la section « Équipe ».
    sql, params = "FROM utilisateurs WHERE role IN ('gratuit','premium')", []
    if q:
        sql += " AND (email LIKE ? ESCAPE '\\' OR pseudo LIKE ? ESCAPE '\\')"
        params += [f"%{_echappe_like(q)}%"] * 2
    db = get_db()
    total = db.execute("SELECT COUNT(*) " + sql, params).fetchone()[0]
    rows = db.execute("SELECT * " + sql + " ORDER BY id DESC LIMIT ? OFFSET ?", params + [limite, decalage]).fetchall()
    return jsonify({"total": total, "utilisateurs": [_ligne_utilisateur(r) for r in rows]})


ACTIONS_MODERATION = ("activer", "desactiver", "debloquer", "verifier_email")
ACTIONS_PREMIUM = ("accorder_premium", "retirer_premium")


@bp.post("/utilisateurs/<int:uid>/action")
@exiger_permission("utilisateurs.moderer")
def utilisateur_action(uid: int):
    d = corps_json()
    action = d.get("action")
    if action not in ACTIONS_MODERATION + ACTIONS_PREMIUM:
        raise ErreurAPI("Action inconnue.", 400)
    if action in ACTIONS_PREMIUM and not perm.a_permission(g.user["role"], "utilisateurs.premium"):
        raise ErreurAPI("Autorisation insuffisante pour cette action.", 403, "permission")
    db = get_db()
    u = db.execute("SELECT * FROM utilisateurs WHERE id=?", (uid,)).fetchone()
    if not u:
        raise ErreurAPI("Utilisateur introuvable.", 404)
    if perm.est_equipe(u["role"]):
        raise ErreurAPI("Les comptes de l'équipe se gèrent dans la section Équipe (super administrateur).", 403, "equipe")
    detail = f"cible={u['email']} action={action}"
    if action == "activer":
        db.execute("UPDATE utilisateurs SET actif=1 WHERE id=?", (uid,))
    elif action == "desactiver":
        db.execute("UPDATE utilisateurs SET actif=0 WHERE id=?", (uid,))
        db.execute("DELETE FROM sessions WHERE utilisateur_id=?", (uid,))
    elif action == "debloquer":
        db.execute("UPDATE utilisateurs SET echecs=0, verrou_jusqua=0 WHERE id=?", (uid,))
    elif action == "verifier_email":
        db.execute("UPDATE utilisateurs SET email_verifie=1 WHERE id=?", (uid,))
    elif action == "accorder_premium":
        jours = _borne(d.get("jours"), 30, 1, 3650)
        now = maintenant()
        base = max(now, u["premium_jusqua"] or 0)
        db.execute("UPDATE utilisateurs SET role='premium', premium_jusqua=? WHERE id=?", (base + jours * 86400, uid))
        detail += f" jours={jours}"
    else:  # retirer_premium
        db.execute("UPDATE utilisateurs SET role='gratuit', premium_jusqua=NULL WHERE id=?", (uid,))
    db.commit()
    journaliser("admin_" + action, g.user["id"], detail)
    return jsonify({"utilisateur": _ligne_utilisateur(db.execute("SELECT * FROM utilisateurs WHERE id=?", (uid,)).fetchone())})


# --------------------------------------------------------------------------- journal d'audit
@bp.get("/audit")
@exiger_connexion(*perm.ROLES_EQUIPE)
def audit():
    limite = _borne(request.args.get("limite"), 100, 1, 500)
    q = (request.args.get("q") or "").strip()[:60]
    sql, params = "FROM audit a LEFT JOIN utilisateurs u ON u.id=a.utilisateur_id WHERE 1=1", []
    if not perm.a_permission(g.user["role"], "audit.tout"):
        sql += " AND a.utilisateur_id=?"  # hors super administrateur : seulement ses propres actions
        params.append(g.user["id"])
    if q:
        sql += " AND a.evenement LIKE ? ESCAPE '\\'"
        params.append(f"{_echappe_like(q)}%")
    rows = get_db().execute("SELECT a.id, a.ts, a.evenement, a.ip, a.detail, u.pseudo, u.email " + sql
                            + " ORDER BY a.id DESC LIMIT ?", params + [limite]).fetchall()
    return jsonify({"portee": "tout" if perm.a_permission(g.user["role"], "audit.tout") else "propre",
                    "evenements": [dict(r) for r in rows]})


# --------------------------------------------------------------------------- maintenance
@bp.post("/maintenance/purger")
@exiger_permission("systeme.maintenance")
def purger():
    db, now = get_db(), maintenant()
    r = {
        "audit": db.execute("DELETE FROM audit WHERE ts<?", (now - 365 * 86400,)).rowcount,
        "activite": db.execute("DELETE FROM activite WHERE ts<?", (now - 90 * 86400,)).rowcount,
        "sessions": db.execute("DELETE FROM sessions WHERE expire_le<?", (now,)).rowcount,
        "jetons": db.execute("DELETE FROM jetons WHERE expire_le<? OR utilise=1", (now,)).rowcount,
    }
    db.commit()
    journaliser("maintenance_purge", g.user["id"], str(r))
    return jsonify({"supprime": r, "message": "Purge terminée (audit > 12 mois, activité > 90 jours, sessions et jetons périmés)."})


@bp.post("/maintenance/wounanet")
@exiger_permission("systeme.maintenance")
def relancer_wounanet():
    n = current_app.extensions["wounanet"].rafraichir()
    journaliser("maintenance_wounanet", g.user["id"], f"{n} dépêches")
    return jsonify({"depeches_collectees": n})
