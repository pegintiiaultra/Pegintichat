"""Comptes utilisateurs : inscription, connexion, sessions, 2FA, réinitialisation, suppression."""
from __future__ import annotations

import sqlite3
from urllib.parse import quote

from flask import Blueprint, g, jsonify, make_response, request

from . import courriel, permissions as perm, security as sec
from .commun import ErreurAPI, cfg, corps_json, exiger_connexion, ip_client, limiter, texte
from .db import get_db, maintenant

bp = Blueprint("auth", __name__, url_prefix="/api/auth")

SEUIL_VERROU = 5
MSG_ECHEC = "Identifiants invalides ou compte temporairement verrouillé."


# --------------------------------------------------------------------------- utilitaires
def journaliser(evenement: str, utilisateur_id: int | None = None, detail: str = "") -> None:
    db = get_db()
    db.execute("INSERT INTO audit(ts, utilisateur_id, evenement, ip, detail) VALUES (?,?,?,?,?)",
               (maintenant(), utilisateur_id, evenement, ip_client(), detail[:400]))
    db.commit()


def profil(u) -> dict:
    role = perm.role_effectif(u["role"], u["premium_jusqua"], maintenant())
    base = {"id": u["id"], "email": u["email"], "pseudo": u["pseudo"], "role": role,
            "charge": u["charge"], "premium_jusqua": u["premium_jusqua"],
            "email_verifie": bool(u["email_verifie"]), "totp_actif": bool(u["totp_actif"])}
    base["equipe"] = perm.est_equipe(role)
    base["double_auth_obligatoire"] = perm.double_auth_obligatoire(base, cfg().equipe_domaine)
    base["restreint"] = base["double_auth_obligatoire"] and not base["totp_actif"]
    base["permissions"] = sorted(perm.permissions_de(role))
    return base


def _creer_session(utilisateur_id: int) -> tuple[str, str]:
    c = cfg()
    jeton, csrf = sec.generer_jeton(), sec.generer_jeton(24)
    now = maintenant()
    db = get_db()
    db.execute(
        "INSERT INTO sessions(utilisateur_id, jeton_hash, csrf, cree_le, expire_le, derniere_activite, ip, agent)"
        " VALUES (?,?,?,?,?,?,?,?)",
        (utilisateur_id, sec.hash_jeton(jeton), csrf, now, now + c.session_duree, now,
         ip_client(), (request.headers.get("User-Agent") or "")[:200]))
    db.commit()
    return jeton, csrf


def _poser_cookie(rep, jeton: str) -> None:
    c = cfg()
    rep.set_cookie(c.nom_cookie, jeton, max_age=c.session_duree, httponly=True,
                   secure=c.cookie_secure, samesite="Lax", path="/")


def _jeton_courriel(utilisateur_id: int, type_: str, duree: int) -> str:
    db = get_db()
    db.execute("UPDATE jetons SET utilise=1 WHERE utilisateur_id=? AND type=? AND utilise=0",
               (utilisateur_id, type_))
    jeton = sec.generer_jeton()
    db.execute("INSERT INTO jetons(utilisateur_id, type, jeton_hash, expire_le) VALUES (?,?,?,?)",
               (utilisateur_id, type_, sec.hash_jeton(jeton), maintenant() + duree))
    db.commit()
    return jeton


def _consommer_jeton(jeton: str, type_: str):
    db = get_db()
    row = db.execute("SELECT * FROM jetons WHERE jeton_hash=? AND type=? AND utilise=0 AND expire_le>?",
                     (sec.hash_jeton(jeton), type_, maintenant())).fetchone()
    if not row:
        raise ErreurAPI("Lien invalide ou expiré.", 400, "jeton_invalide")
    db.execute("UPDATE jetons SET utilise=1 WHERE id=?", (row["id"],))
    db.commit()
    return row


def _envoyer_verification(u) -> None:
    jeton = _jeton_courriel(u["id"], "verif_email", 24 * 3600)
    lien = f"{cfg().base_url}/jeton?type=verif&jeton={jeton}"
    courriel.envoyer(u["email"], "PEGINTI IA — confirmez votre adresse",
                     f"Bonjour {u['pseudo']},\n\nConfirmez votre adresse (valable 24 h) :\n{lien}\n\n"
                     "Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.")


# --------------------------------------------------------------------------- inscription / connexion
@bp.post("/inscription")
def inscription():
    ip = ip_client()
    limiter(f"ins:{ip}", 5, 3600)
    d = corps_json()
    email = sec.normaliser_email(d.get("email"))
    pseudo = texte(d, "pseudo", 32, 3)
    mdp = texte(d, "mot_de_passe", 256, 1)
    erreurs = []
    if not sec.email_valide(email):
        erreurs.append("Adresse e-mail invalide.")
    if not sec.pseudo_valide(pseudo):
        erreurs.append("Pseudo : 3 à 32 caractères (lettres, chiffres, espace, _ . -).")
    erreurs += sec.verifier_politique_mdp(mdp, email, pseudo)
    if erreurs:
        raise ErreurAPI("Inscription refusée.", 400, "validation", {"details": erreurs})

    mdp_hash = sec.hasher_mot_de_passe(mdp, cfg().pepper)  # toujours calculé : temps constant
    db = get_db()
    generique = {"message": "Demande enregistrée. Si la vérification d'e-mail est active, "
                            "consultez votre boîte de réception, puis connectez-vous."}
    try:
        cur = db.execute("INSERT INTO utilisateurs(email, pseudo, mdp_hash, cree_le) VALUES (?,?,?,?)",
                         (email, pseudo.strip(), mdp_hash, maintenant()))
        db.commit()
    except sqlite3.IntegrityError:
        journaliser("inscription_doublon", None, "email déjà utilisé")
        return jsonify(generique), 201  # réponse identique : on ne révèle pas l'existence du compte
    u = db.execute("SELECT * FROM utilisateurs WHERE id=?", (cur.lastrowid,)).fetchone()
    journaliser("inscription", u["id"])
    _envoyer_verification(u)
    return jsonify(generique), 201


@bp.post("/connexion")
def connexion():
    c = cfg()
    ip = ip_client()
    limiter(f"log:ip:{ip}", 20, 900)
    d = corps_json()
    email = sec.normaliser_email(d.get("email"))
    mdp = texte(d, "mot_de_passe", 256, 1)
    limiter(f"log:em:{email}", 8, 900)  # même clé pour comptes inexistants
    db = get_db()
    u = db.execute("SELECT * FROM utilisateurs WHERE email=?", (email,)).fetchone()
    now = maintenant()

    verrouille = bool(u and u["verrou_jusqua"] > now)
    ok = sec.verifier_mot_de_passe(mdp, u["mdp_hash"] if u else sec.faux_hash(c.pepper), c.pepper)
    if not u or not ok or verrouille or not u["actif"]:
        if u and not verrouille:
            _echec(u)
        journaliser("connexion_echec", u["id"] if u else None)
        raise ErreurAPI(MSG_ECHEC, 401, "identifiants")

    if u["totp_actif"]:
        code, secours = d.get("code_totp"), d.get("code_secours")
        if not code and not secours:
            raise ErreurAPI("Code d'authentification à deux facteurs requis.", 401, "totp_requis")
        if secours:  # un code de secours est à usage unique : il remplace le code de l'application
            ligne = db.execute("SELECT id FROM codes_secours WHERE utilisateur_id=? AND code_hash=? AND utilise=0",
                               (u["id"], sec.hash_code_secours(secours, c.pepper))).fetchone()
            if not ligne:
                _echec(u)
                journaliser("connexion_secours_echec", u["id"])
                raise ErreurAPI("Code de secours invalide ou déjà utilisé.", 401, "totp_invalide")
            db.execute("UPDATE codes_secours SET utilise=1 WHERE id=?", (ligne["id"],))
            journaliser("connexion_code_secours", u["id"])
        else:
            secret = sec.dechiffrer_secret(u["totp_secret"] or "", c.pepper)
            pas = sec.totp_verifier(secret, code, u["totp_dernier_pas"]) if secret else None
            if pas is None:
                _echec(u)
                journaliser("connexion_totp_echec", u["id"])
                raise ErreurAPI("Code à deux facteurs invalide.", 401, "totp_invalide")
            db.execute("UPDATE utilisateurs SET totp_dernier_pas=? WHERE id=?", (pas, u["id"]))

    if c.verification_email_requise and not u["email_verifie"]:
        raise ErreurAPI("Adresse e-mail non vérifiée.", 403, "email_non_verifie")

    db.execute("UPDATE utilisateurs SET echecs=0, verrou_jusqua=0, derniere_connexion=? WHERE id=?",
               (now, u["id"]))
    db.commit()
    jeton, csrf = _creer_session(u["id"])  # nouveau jeton à chaque connexion (anti-fixation)
    journaliser("connexion", u["id"])
    rep = make_response(jsonify({"utilisateur": profil(u), "csrf": csrf}))
    _poser_cookie(rep, jeton)
    return rep


def _echec(u) -> None:
    db = get_db()
    echecs = u["echecs"] + 1
    verrou = 0
    if echecs % SEUIL_VERROU == 0:  # 15 min, puis 30, 60… plafonné à 24 h
        verrou = maintenant() + min(900 * 2 ** (echecs // SEUIL_VERROU - 1), 86400)
    db.execute("UPDATE utilisateurs SET echecs=?, verrou_jusqua=MAX(verrou_jusqua, ?) WHERE id=?",
               (echecs, verrou, u["id"]))
    db.commit()


@bp.post("/deconnexion")
@exiger_connexion()
def deconnexion():
    db = get_db()
    db.execute("DELETE FROM sessions WHERE id=?", (g.session["id"],))
    db.commit()
    journaliser("deconnexion", g.user["id"])
    rep = make_response(jsonify({"message": "Déconnecté."}))
    rep.delete_cookie(cfg().nom_cookie, path="/", secure=cfg().cookie_secure, httponly=True,
                      samesite="Lax")
    return rep


@bp.get("/moi")
def moi():
    if not g.user:
        return jsonify({"utilisateur": None})
    p = profil(g.user | {"premium_jusqua": g.user.get("premium_jusqua")})
    if p["totp_actif"]:
        p["codes_secours_restants"] = get_db().execute(
            "SELECT COUNT(*) FROM codes_secours WHERE utilisateur_id=? AND utilise=0", (g.user["id"],)).fetchone()[0]
    return jsonify({"utilisateur": p, "csrf": g.session["csrf"]})


# --------------------------------------------------------------------------- e-mail / réinitialisation
@bp.post("/verifier-email")
def verifier_email():
    limiter(f"ver:{ip_client()}", 10, 3600)
    jeton = texte(corps_json(), "jeton", 200, 10)
    row = _consommer_jeton(jeton, "verif_email")
    db = get_db()
    db.execute("UPDATE utilisateurs SET email_verifie=1 WHERE id=?", (row["utilisateur_id"],))
    db.commit()
    journaliser("email_verifie", row["utilisateur_id"])
    return jsonify({"message": "Adresse confirmée. Vous pouvez vous connecter."})


@bp.post("/mot-de-passe-oublie")
def mdp_oublie():
    ip = ip_client()
    limiter(f"oubli:ip:{ip}", 5, 3600)
    email = sec.normaliser_email(corps_json().get("email"))
    limiter(f"oubli:em:{email}", 3, 3600)
    u = get_db().execute("SELECT * FROM utilisateurs WHERE email=? AND actif=1", (email,)).fetchone()
    if u:
        jeton = _jeton_courriel(u["id"], "reset_mdp", 3600)
        courriel.envoyer(u["email"], "PEGINTI IA — réinitialisation du mot de passe",
                         f"Lien valable 1 heure :\n{cfg().base_url}/jeton?type=reset&jeton={jeton}\n\n"
                         "Si vous n'avez rien demandé, ignorez ce message.")
        journaliser("reset_demande", u["id"])
    return jsonify({"message": "Si ce compte existe, un lien de réinitialisation a été envoyé."})


@bp.post("/reinitialiser")
def reinitialiser():
    limiter(f"reinit:{ip_client()}", 10, 3600)
    d = corps_json()
    jeton = texte(d, "jeton", 200, 10)
    nouveau = texte(d, "mot_de_passe", 256, 1)
    row = _consommer_jeton(jeton, "reset_mdp")
    db = get_db()
    u = db.execute("SELECT * FROM utilisateurs WHERE id=?", (row["utilisateur_id"],)).fetchone()
    erreurs = sec.verifier_politique_mdp(nouveau, u["email"], u["pseudo"])
    if erreurs:
        db.execute("UPDATE jetons SET utilise=0 WHERE id=?", (row["id"],))  # le lien reste utilisable
        db.commit()
        raise ErreurAPI("Mot de passe refusé.", 400, "validation", {"details": erreurs})
    db.execute("UPDATE utilisateurs SET mdp_hash=?, echecs=0, verrou_jusqua=0, email_verifie=1 WHERE id=?",
               (sec.hasher_mot_de_passe(nouveau, cfg().pepper), u["id"]))
    db.execute("DELETE FROM sessions WHERE utilisateur_id=?", (u["id"],))  # révoque toutes les sessions
    db.commit()
    journaliser("reset_effectue", u["id"])
    return jsonify({"message": "Mot de passe modifié. Reconnectez-vous."})


@bp.post("/mot-de-passe")
@exiger_connexion()
def changer_mdp():
    limiter(f"chmdp:{g.user['id']}", 5, 900)
    d = corps_json()
    actuel, nouveau = texte(d, "actuel", 256, 1), texte(d, "nouveau", 256, 1)
    db = get_db()
    u = db.execute("SELECT * FROM utilisateurs WHERE id=?", (g.user["id"],)).fetchone()
    if not sec.verifier_mot_de_passe(actuel, u["mdp_hash"], cfg().pepper):
        raise ErreurAPI("Mot de passe actuel incorrect.", 403, "identifiants")
    erreurs = sec.verifier_politique_mdp(nouveau, u["email"], u["pseudo"])
    if erreurs:
        raise ErreurAPI("Mot de passe refusé.", 400, "validation", {"details": erreurs})
    db.execute("UPDATE utilisateurs SET mdp_hash=? WHERE id=?",
               (sec.hasher_mot_de_passe(nouveau, cfg().pepper), u["id"]))
    db.execute("DELETE FROM sessions WHERE utilisateur_id=? AND id<>?", (u["id"], g.session["id"]))
    db.commit()
    journaliser("mdp_change", u["id"])
    return jsonify({"message": "Mot de passe modifié. Les autres sessions ont été fermées."})


# --------------------------------------------------------------------------- double authentification
@bp.post("/2fa/initier")
@exiger_connexion()
def tfa_initier():
    limiter(f"2fa:{g.user['id']}", 10, 900)
    db = get_db()
    if g.user["totp_actif"]:
        raise ErreurAPI("La double authentification est déjà active.", 409)
    secret = sec.totp_nouveau_secret()
    db.execute("UPDATE utilisateurs SET totp_secret=?, totp_actif=0, totp_dernier_pas=0 WHERE id=?",
               (sec.chiffrer_secret(secret, cfg().pepper), g.user["id"]))
    db.commit()
    uri = (f"otpauth://totp/PEGINTI%20IA:{quote(g.user['email'])}?secret={secret}"
           "&issuer=PEGINTI%20IA&digits=6&period=30")
    return jsonify({"secret": secret, "uri": uri})


@bp.post("/2fa/activer")
@exiger_connexion()
def tfa_activer():
    limiter(f"2fa:{g.user['id']}", 10, 900)
    code = texte(corps_json(), "code", 10, 6)
    db = get_db()
    u = db.execute("SELECT * FROM utilisateurs WHERE id=?", (g.user["id"],)).fetchone()
    secret = sec.dechiffrer_secret(u["totp_secret"] or "", cfg().pepper)
    pas = sec.totp_verifier(secret, code) if secret else None
    if u["totp_actif"] or pas is None:
        raise ErreurAPI("Code invalide.", 400, "totp_invalide")
    db.execute("UPDATE utilisateurs SET totp_actif=1, totp_dernier_pas=? WHERE id=?", (pas, u["id"]))
    db.commit()
    codes = _nouveaux_codes_secours(u["id"])
    journaliser("2fa_active", u["id"])
    return jsonify({"message": "Double authentification activée.", "codes_secours": codes})


def _nouveaux_codes_secours(utilisateur_id: int) -> list[str]:
    """Remplace tous les codes de secours : les anciens cessent de fonctionner. Les codes ne sont montrés qu'une fois."""
    db = get_db()
    codes = sec.generer_codes_secours(8)
    db.execute("DELETE FROM codes_secours WHERE utilisateur_id=?", (utilisateur_id,))
    db.executemany("INSERT INTO codes_secours(utilisateur_id, code_hash) VALUES (?,?)",
                   [(utilisateur_id, sec.hash_code_secours(c, cfg().pepper)) for c in codes])
    db.commit()
    return codes


@bp.post("/2fa/codes-secours")
@exiger_connexion()
def tfa_codes_secours():
    limiter(f"2fa:{g.user['id']}", 10, 900)
    d = corps_json()
    mdp, code = texte(d, "mot_de_passe", 256, 1), texte(d, "code", 10, 6)
    db = get_db()
    u = db.execute("SELECT * FROM utilisateurs WHERE id=?", (g.user["id"],)).fetchone()
    secret = sec.dechiffrer_secret(u["totp_secret"] or "", cfg().pepper)
    pas = sec.totp_verifier(secret, code, u["totp_dernier_pas"]) if secret and u["totp_actif"] else None
    if not sec.verifier_mot_de_passe(mdp, u["mdp_hash"], cfg().pepper) or pas is None:
        raise ErreurAPI("Mot de passe ou code incorrect.", 403, "identifiants")
    db.execute("UPDATE utilisateurs SET totp_dernier_pas=? WHERE id=?", (pas, u["id"]))
    db.commit()
    journaliser("2fa_codes_secours_regeneres", u["id"])
    return jsonify({"codes_secours": _nouveaux_codes_secours(u["id"])})


@bp.post("/2fa/desactiver")
@exiger_connexion()
def tfa_desactiver():
    limiter(f"2fa:{g.user['id']}", 10, 900)
    if perm.double_auth_obligatoire(g.user, cfg().equipe_domaine):
        raise ErreurAPI("La double authentification est obligatoire pour ce compte : elle ne peut pas être "
                        "désactivée. En cas de perte de l'appareil, utilisez un code de secours ou contactez "
                        "le super administrateur.", 403, "2fa_obligatoire")
    d = corps_json()
    mdp, code = texte(d, "mot_de_passe", 256, 1), texte(d, "code", 10, 6)
    db = get_db()
    u = db.execute("SELECT * FROM utilisateurs WHERE id=?", (g.user["id"],)).fetchone()
    secret = sec.dechiffrer_secret(u["totp_secret"] or "", cfg().pepper)
    if (not sec.verifier_mot_de_passe(mdp, u["mdp_hash"], cfg().pepper) or not secret
            or sec.totp_verifier(secret, code, u["totp_dernier_pas"]) is None):
        raise ErreurAPI("Mot de passe ou code incorrect.", 403, "identifiants")
    db.execute("UPDATE utilisateurs SET totp_actif=0, totp_secret=NULL WHERE id=?", (u["id"],))
    db.execute("DELETE FROM codes_secours WHERE utilisateur_id=?", (u["id"],))
    db.commit()
    journaliser("2fa_desactive", u["id"])
    return jsonify({"message": "Double authentification désactivée."})


# --------------------------------------------------------------------------- sessions / compte
@bp.get("/sessions")
@exiger_connexion()
def sessions():
    rows = get_db().execute(
        "SELECT id, cree_le, derniere_activite, ip, agent FROM sessions WHERE utilisateur_id=? "
        "ORDER BY derniere_activite DESC", (g.user["id"],)).fetchall()
    return jsonify({"sessions": [dict(r) | {"courante": r["id"] == g.session["id"]} for r in rows]})


@bp.delete("/sessions/<int:sid>")
@exiger_connexion()
def revoquer(sid: int):
    db = get_db()
    db.execute("DELETE FROM sessions WHERE id=? AND utilisateur_id=?", (sid, g.user["id"]))
    db.commit()
    return jsonify({"message": "Session fermée."})


@bp.post("/deconnexion-toutes")
@exiger_connexion()
def deconnexion_toutes():
    db = get_db()
    db.execute("DELETE FROM sessions WHERE utilisateur_id=?", (g.user["id"],))
    db.commit()
    journaliser("deconnexion_toutes", g.user["id"])
    rep = make_response(jsonify({"message": "Toutes les sessions ont été fermées."}))
    rep.delete_cookie(cfg().nom_cookie, path="/")
    return rep


@bp.delete("/compte")
@exiger_connexion()
def supprimer_compte():
    limiter(f"delcompte:{g.user['id']}", 3, 3600)
    if perm.est_equipe(g.user["role"]):
        raise ErreurAPI("Les comptes de l'équipe sont supprimés par le super administrateur.", 403, "equipe")
    mdp = texte(corps_json(), "mot_de_passe", 256, 1)
    db = get_db()
    u = db.execute("SELECT * FROM utilisateurs WHERE id=?", (g.user["id"],)).fetchone()
    if not sec.verifier_mot_de_passe(mdp, u["mdp_hash"], cfg().pepper):
        raise ErreurAPI("Mot de passe incorrect.", 403, "identifiants")
    journaliser("compte_supprime", u["id"])
    db.execute("UPDATE activite SET utilisateur_id=NULL WHERE utilisateur_id=?", (u["id"],))  # anonymise
    db.execute("DELETE FROM utilisateurs WHERE id=?", (u["id"],))  # cascade : sessions, mémoire, commandes
    db.commit()
    rep = make_response(jsonify({"message": "Compte et données supprimés."}))
    rep.delete_cookie(cfg().nom_cookie, path="/")
    return rep
