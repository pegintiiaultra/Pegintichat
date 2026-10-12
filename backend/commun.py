"""Outils communs aux routes : erreurs JSON, validation, IP client, limitation, contrôle d'accès."""
from __future__ import annotations

from functools import wraps

from flask import current_app, g, request


class ErreurAPI(Exception):
    def __init__(self, message: str, statut: int = 400, code: str | None = None,
                 extra: dict | None = None, entetes: dict | None = None):
        super().__init__(message)
        self.message, self.statut, self.code = message, statut, code
        self.extra, self.entetes = extra or {}, entetes or {}


def cfg():
    return current_app.config["PEGINTI"]


def ip_client() -> str:
    # L'en-tête CF-Connecting-IP n'est cru que s'il vient du tunnel local (anti-usurpation).
    if cfg().trust_cloudflare and request.remote_addr in ("127.0.0.1", "::1"):
        ip = request.headers.get("CF-Connecting-IP")
        if ip:
            return ip.strip()[:45]
    return (request.remote_addr or "inconnue")[:45]


def corps_json() -> dict:
    if not request.is_json:
        raise ErreurAPI("Content-Type application/json requis.", 415)
    d = request.get_json(silent=True)
    if not isinstance(d, dict):
        raise ErreurAPI("Corps JSON invalide.", 400)
    return d


def texte(d: dict, cle: str, maxi: int, mini: int = 1) -> str:
    v = d.get(cle)
    if not isinstance(v, str):
        raise ErreurAPI(f"Champ « {cle} » invalide.", 400)
    v = v.strip() if cle not in ("mot_de_passe", "nouveau", "actuel") else v
    if len(v) < mini or len(v) > maxi:
        raise ErreurAPI(f"Champ « {cle} » : longueur invalide ({mini}–{maxi}).", 400)
    return v


def limiter(cle: str, maxi: int, fenetre: int) -> None:
    ok, attente = current_app.extensions["limiteur"].autoriser(cle, maxi, fenetre)
    if not ok:
        raise ErreurAPI("Trop de requêtes. Réessayez plus tard.", 429, "limite",
                        entetes={"Retry-After": str(attente)})


def exiger_connexion(*roles: str):
    def deco(fn):
        @wraps(fn)
        def inner(*a, **k):
            if not g.get("user"):
                raise ErreurAPI("Connexion requise.", 401, "connexion_requise")
            if roles and g.user["role"] not in roles:
                raise ErreurAPI("Accès réservé à certains types de compte (premium ou équipe).", 403, "role_insuffisant")
            return fn(*a, **k)
        return inner
    return deco


def reauth_totp(d: dict) -> None:
    """Action sensible : exige un code TOTP frais dans le corps (champ « code_totp »), même en session ouverte."""
    from . import security as sec
    from .db import get_db
    limiter(f"reauth:{g.user['id']}", 10, 900)
    db = get_db()
    u = db.execute("SELECT * FROM utilisateurs WHERE id=?", (g.user["id"],)).fetchone()
    if not u["totp_actif"]:
        raise ErreurAPI("Activez d'abord la double authentification.", 403, "2fa_obligatoire")
    secret = sec.dechiffrer_secret(u["totp_secret"] or "", cfg().pepper)
    pas = sec.totp_verifier(secret, d.get("code_totp"), u["totp_dernier_pas"]) if secret else None
    if pas is None:
        raise ErreurAPI("Code de double authentification manquant, invalide ou déjà utilisé "
                        "(attendez le prochain code, 30 s).", 403, "totp_requis")
    db.execute("UPDATE utilisateurs SET totp_dernier_pas=? WHERE id=?", (pas, u["id"]))
    db.commit()


def exiger_permission(permission: str):
    """Réserve une route aux comptes qui ont la permission (voir permissions.py). Les refus sont journalisés."""
    from . import permissions as perm

    def deco(fn):
        @wraps(fn)
        def inner(*a, **k):
            if not g.get("user"):
                raise ErreurAPI("Connexion requise.", 401, "connexion_requise")
            limiter(f"adm:{g.user['id']}", 240, 60)
            if not perm.a_permission(g.user["role"], permission):
                from .auth import journaliser
                journaliser("permission_refusee", g.user["id"], f"{request.method} {request.path} ({permission})")
                raise ErreurAPI("Autorisation insuffisante pour cette action.", 403, "permission")
            return fn(*a, **k)
        return inner
    return deco
