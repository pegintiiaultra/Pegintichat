"""Configuration centralisée de PEGINTI IA.

Lecture de l'environnement et du fichier .env (sans dépendance externe).
"""
from __future__ import annotations

import os
import secrets
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlparse

BASE_DIR = Path(__file__).resolve().parent.parent
VERSION = "4.1.0"

DOMAINE = "pegintichat.online"
SOUS_DOMAINE = "www.pegintichat.online"
PORT_DEFAUT = 4000


def charger_env(chemin: Path) -> None:
    """Charge un fichier .env minimal (CLE=valeur). L'environnement réel garde la priorité."""
    if not chemin.exists():
        return
    for ligne in chemin.read_text(encoding="utf-8").splitlines():
        ligne = ligne.strip()
        if not ligne or ligne.startswith("#") or "=" not in ligne:
            continue
        cle, valeur = ligne.split("=", 1)
        os.environ.setdefault(cle.strip(), valeur.strip().strip('"').strip("'"))


def _bool(valeur, defaut: bool) -> bool:
    if valeur is None or valeur == "":
        return defaut
    return str(valeur).strip().lower() in ("1", "true", "oui", "yes", "on")


@dataclass
class Config:
    env: str
    host: str
    port: int
    base_url: str
    pepper: bytes
    db_path: str
    cookie_secure: bool
    trust_cloudflare: bool
    origines_autorisees: frozenset
    gemini_key: str
    gemini_model: str
    newsdata_key: str
    verification_email_requise: bool
    smtp: dict
    wounanet_pilote: bool
    equipe_domaine: str = "tomtech.inc"  # adresses de ce domaine : 2FA obligatoire
    dossier_logiciels: str = ""
    upload_max_mo: int = 95  # limite Cloudflare gratuit : 100 Mo
    chat_antiflood: int = 30  # requêtes max par 10 s et par client ; 0 = désactivé
    session_duree: int = 7 * 86400
    session_inactivite: int = 12 * 3600

    @property
    def nom_cookie(self) -> str:
        # Le préfixe __Host- impose Secure + Path=/ + pas de Domain : protège contre l'injection de cookie.
        return "__Host-peginti_session" if self.cookie_secure else "peginti_session"


def charger_config(overrides: dict | None = None) -> Config:
    charger_env(BASE_DIR / ".env")
    e = dict(os.environ)
    if overrides:
        e.update({k: str(v) for k, v in overrides.items()})

    env = e.get("PEGINTI_ENV", "production").lower()
    port = int(e.get("PORT", PORT_DEFAUT))
    base_url = e.get("PEGINTI_BASE_URL") or (
        f"https://{SOUS_DOMAINE}" if env == "production" else f"http://127.0.0.1:{port}"
    )

    pepper = e.get("PEGINTI_PEPPER", "")
    if len(pepper) < 32:
        if env == "production":
            raise RuntimeError(
                "PEGINTI_PEPPER absent ou trop court (32 caractères minimum). "
                "Lancez ./setup_termux.sh ou définissez-le dans .env."
            )
        pepper = secrets.token_hex(32)  # éphémère : acceptable uniquement hors production

    origines = {urlparse(base_url).scheme + "://" + urlparse(base_url).netloc}
    # Le domaine nu et le sous-domaine www sont tous deux acceptés comme origines légitimes.
    if env == "production":
        origines.add(f"https://{SOUS_DOMAINE}")  # le domaine nu reste sur Google AI Studio
    for extra in filter(None, (x.strip() for x in e.get("PEGINTI_ORIGINES", "").split(","))):
        origines.add(extra.rstrip("/"))
    if env != "production":
        origines.update({f"http://127.0.0.1:{port}", f"http://localhost:{port}"})

    smtp = {
        "hote": e.get("SMTP_HOST", ""),
        "port": int(e.get("SMTP_PORT", "587") or 587),
        "utilisateur": e.get("SMTP_USER", ""),
        "mot_de_passe": e.get("SMTP_PASSWORD", ""),
        "expediteur": e.get("SMTP_FROM", f"no-reply@{DOMAINE}"),
    }

    return Config(
        env=env,
        host=e.get("HOST", "127.0.0.1"),  # écoute locale uniquement : seul le tunnel Cloudflare est exposé
        port=port,
        base_url=base_url.rstrip("/"),
        pepper=pepper.encode("utf-8"),
        db_path=e.get("PEGINTI_DB", str(BASE_DIR / "data" / "peginti.db")),
        cookie_secure=_bool(e.get("COOKIE_SECURE"), base_url.startswith("https")),
        trust_cloudflare=_bool(e.get("TRUST_CLOUDFLARE"), env == "production"),
        origines_autorisees=frozenset(origines),
        gemini_key=e.get("GEMINI_API_KEY", ""),
        gemini_model=e.get("GEMINI_MODEL", "gemini-2.5-flash"),
        newsdata_key=e.get("NEWSDATA_API_KEY") or e.get("PEGINTINEWSAPIKEY", ""),
        verification_email_requise=_bool(e.get("VERIFICATION_EMAIL_REQUISE"), bool(smtp["hote"])),
        smtp=smtp,
        wounanet_pilote=_bool(e.get("WOUNANET_PILOTE"), env == "production"),
        chat_antiflood=int(e.get("CHAT_ANTIFLOOD", "30") or 0),
        equipe_domaine=e.get("PEGINTI_DOMAINE_EQUIPE", "tomtech.inc").strip().lower().lstrip("@"),
        dossier_logiciels=e.get("PEGINTI_LOGICIELS", str(BASE_DIR / "data" / "logiciels")),
        upload_max_mo=int(e.get("UPLOAD_MAX_MO", "95") or 95),
    )
