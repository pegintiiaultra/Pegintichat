"""Point d'entrée de production : écoute sur 127.0.0.1 (le tunnel Cloudflare fait le lien public)."""
from backend.app import create_app

app = create_app()

if __name__ == "__main__":
    cfg = app.config["PEGINTI"]
    app.logger.info("PEGINTI IA %s — http://%s:%s (env=%s) — public : %s",
                    "4.1.0", cfg.host, cfg.port, cfg.env, cfg.base_url)
    try:
        from waitress import serve
        serve(app, host=cfg.host, port=cfg.port, threads=8, ident="peginti",
              max_request_body_size=(cfg.upload_max_mo + 2) * 1024 * 1024)
    except ImportError:
        app.logger.warning("waitress absent : serveur de développement Werkzeug (installez waitress).")
        app.run(host=cfg.host, port=cfg.port, threaded=True)
