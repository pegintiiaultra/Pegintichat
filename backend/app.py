"""Fabrique de l'application Flask : sécurité transversale, API, pages statiques."""
from __future__ import annotations

import hmac
import logging
import time
from pathlib import Path
from urllib.parse import urlparse

from flask import Flask, g, jsonify, redirect, request, send_from_directory

from . import admin, admin_boutique, auth, boutique, db, permissions as perm, routes_api, security as sec
from .commun import ErreurAPI
from .config import BASE_DIR, DOMAINE, charger_config
from .services.wounanet import ServiceWounanet

FRONTEND = BASE_DIR / "frontend"
PAGES = {"/": "index.html", "/wounanet": "wounanet.html", "/premium": "premium.html",
         "/connexion": "connexion.html", "/compte": "compte.html", "/jeton": "jeton.html", "/admin": "admin.html"}
ROUTES_2FA_OBLIGATOIRE = {  # seules routes ouvertes à un compte d'équipe tant que sa 2FA n'est pas active
    "/api/sante", "/api/auth/moi", "/api/auth/2fa/initier", "/api/auth/2fa/activer", "/api/auth/deconnexion",
    "/api/auth/sessions", "/api/auth/mot-de-passe"}
ROUTES_SANS_CSRF = {"/api/auth/connexion", "/api/auth/inscription", "/api/auth/mot-de-passe-oublie",
                    "/api/auth/reinitialiser", "/api/auth/verifier-email"}  # avant session ; Origin vérifiée


def create_app(overrides: dict | None = None) -> Flask:
    cfg = charger_config(overrides)
    app = Flask(__name__, static_folder=None)
    app.config["PEGINTI"] = cfg
    app.config["MAX_CONTENT_LENGTH"] = 128 * 1024
    app.config["JSON_AS_ASCII"] = False
    app.json.ensure_ascii = False
    app.extensions["limiteur"] = sec.LimiteurDebit()
    app.extensions["wounanet"] = ServiceWounanet(cfg.newsdata_key)
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

    db.init_app(app)
    app.register_blueprint(auth.bp)
    app.register_blueprint(routes_api.bp)
    app.register_blueprint(boutique.bp)
    app.register_blueprint(admin.bp)
    app.register_blueprint(admin_boutique.bp)

    if cfg.wounanet_pilote:
        app.extensions["wounanet"].demarrer_pilote()

    # ----------------------------------------------------------------- garde-fous avant chaque requête
    hote_canonique = urlparse(cfg.base_url).hostname

    @app.before_request
    def garde():
        g.user = g.session = None
        # Tout passe par www. Les anciens sous-domaines (wounanet., premium.) redirigent vers www ; le domaine
        # nu pegintichat.online reste sur l'hébergement Google AI Studio et n'est pas géré ici.
        hote = request.host.split(":")[0].lower()
        if hote != hote_canonique and hote.endswith("." + DOMAINE):
            chemin = {"wounanet." + DOMAINE: "/wounanet", "premium." + DOMAINE: "/premium"}.get(hote)
            cible = cfg.base_url + (chemin if chemin and request.path == "/" else request.full_path.rstrip("?"))
            return redirect(cible, 308 if request.path.startswith("/api/") else 301)
        if not request.path.startswith("/api/"):
            return
        methode_sure = request.method in ("GET", "HEAD", "OPTIONS")

        if not methode_sure:
            # Anti-CSRF navigateur : l'origine de la requête doit être celle du site.
            origine = request.headers.get("Origin")
            if origine:
                if origine.rstrip("/") not in cfg.origines_autorisees:
                    raise ErreurAPI("Origine refusée.", 403, "origine")
            elif request.headers.get("Sec-Fetch-Site") not in ("same-origin", "none"):
                ref = request.headers.get("Referer", "")
                p = urlparse(ref)
                if f"{p.scheme}://{p.netloc}" not in cfg.origines_autorisees:
                    raise ErreurAPI("Origine refusée.", 403, "origine")

        _charger_session()

        if (g.user and not g.user["totp_actif"] and request.path not in ROUTES_2FA_OBLIGATOIRE
                and perm.double_auth_obligatoire(g.user, cfg.equipe_domaine)):
            raise ErreurAPI("La double authentification est obligatoire pour votre compte : activez-la "
                            "depuis « Mon compte » pour continuer.", 403, "2fa_obligatoire")

        if not methode_sure and g.session and request.path not in ROUTES_SANS_CSRF:
            fourni = request.headers.get("X-CSRF-Token", "")
            if not hmac.compare_digest(fourni, g.session["csrf"]):
                raise ErreurAPI("Jeton CSRF invalide.", 403, "csrf")

    def _charger_session():
        jeton = request.cookies.get(cfg.nom_cookie)
        if not jeton or len(jeton) > 200:
            return
        base = db.get_db()
        r = base.execute(
            "SELECT s.id AS sid, s.csrf, s.expire_le, s.derniere_activite, u.id, u.email, u.pseudo, "
            "u.role, u.charge, u.premium_jusqua, u.email_verifie, u.actif, u.totp_actif FROM sessions s "
            "JOIN utilisateurs u ON u.id=s.utilisateur_id WHERE s.jeton_hash=?",
            (sec.hash_jeton(jeton),)).fetchone()
        if not r:
            return
        now = int(time.time())
        if (r["expire_le"] <= now or now - r["derniere_activite"] > cfg.session_inactivite
                or not r["actif"]):
            base.execute("DELETE FROM sessions WHERE id=?", (r["sid"],))
            base.commit()
            return
        if now - r["derniere_activite"] > 60:
            base.execute("UPDATE sessions SET derniere_activite=? WHERE id=?", (now, r["sid"]))
            base.commit()
        g.session = {"id": r["sid"], "csrf": r["csrf"]}
        g.user = {k: r[k] for k in ("id", "email", "pseudo", "charge", "premium_jusqua", "email_verifie",
                                    "actif", "totp_actif")}
        g.user["role"] = perm.role_effectif(r["role"], r["premium_jusqua"], now)

    # ----------------------------------------------------------------- en-têtes de sécurité
    @app.after_request
    def entetes(rep):
        rep.headers["Content-Security-Policy"] = (
            "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; "
            "connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; "
            "frame-ancestors 'none'")
        rep.headers["X-Content-Type-Options"] = "nosniff"
        rep.headers["X-Frame-Options"] = "DENY"
        rep.headers["Referrer-Policy"] = "no-referrer"
        rep.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=(), payment=()"
        rep.headers["Cross-Origin-Opener-Policy"] = "same-origin"
        rep.headers["Cross-Origin-Resource-Policy"] = "same-origin"
        if cfg.cookie_secure:
            rep.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        if request.path.startswith("/api/"):
            rep.headers["Cache-Control"] = "no-store"
        return rep

    # ----------------------------------------------------------------- erreurs en JSON
    @app.errorhandler(ErreurAPI)
    def erreur_api(e: ErreurAPI):
        corps = {"erreur": e.message, **({"code": e.code} if e.code else {}), **e.extra}
        rep = jsonify(corps)
        rep.status_code = e.statut
        for k, v in e.entetes.items():
            rep.headers[k] = v
        return rep

    @app.errorhandler(404)
    def non_trouve(_e):
        return jsonify({"erreur": "Introuvable."}), 404

    @app.errorhandler(405)
    def methode(_e):
        return jsonify({"erreur": "Méthode non autorisée."}), 405

    @app.errorhandler(413)
    def trop_gros(_e):
        return jsonify({"erreur": "Requête trop volumineuse."}), 413

    @app.errorhandler(Exception)
    def inattendue(e):
        if hasattr(e, "code") and isinstance(e.code, int) and e.code < 500:
            return jsonify({"erreur": getattr(e, "name", "Erreur")}), e.code
        app.logger.exception("Erreur interne")
        return jsonify({"erreur": "Erreur interne du serveur."}), 500  # aucun détail technique exposé

    # ----------------------------------------------------------------- pages et ressources statiques
    @app.get("/assets/<path:chemin>")
    def assets(chemin):
        return send_from_directory(FRONTEND / "assets", chemin, max_age=300)

    def _page(nom):
        def vue():
            rep = send_from_directory(FRONTEND, nom, max_age=0)
            rep.headers["Cache-Control"] = "no-cache"
            return rep
        return vue

    @app.get("/manifest.webmanifest")
    def manifeste():
        rep = send_from_directory(FRONTEND, "manifest.webmanifest", max_age=3600)
        rep.headers["Content-Type"] = "application/manifest+json"
        return rep

    @app.get("/sw.js")
    def service_worker():
        rep = send_from_directory(FRONTEND, "sw.js", max_age=0)
        rep.headers["Cache-Control"] = "no-cache"
        rep.headers["Content-Type"] = "text/javascript; charset=utf-8"
        return rep

    for route, fichier in PAGES.items():
        app.add_url_rule(route, endpoint=f"page_{fichier}", view_func=_page(fichier))

    return app
