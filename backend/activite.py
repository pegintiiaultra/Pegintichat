"""Journal d'activité par chaîne (vitrine). Métadonnées uniquement : jamais le contenu des messages."""
from __future__ import annotations

import hashlib
import logging

from flask import current_app

from .commun import ip_client
from .db import get_db, maintenant

log = logging.getLogger("activite")
VITRINES = ("CHAT_INTERACTIF", "WOUNANET", "PREMIUM")


def enregistrer(vitrine: str, type_: str, utilisateur: dict | None = None, intention: str | None = None,
                mode: str | None = None, detail: str = "") -> None:
    """Ne doit jamais faire échouer une requête : toute erreur est journalisée puis ignorée."""
    try:
        anonyme = None
        if not utilisateur:  # visiteur : empreinte salée de l'adresse IP, utile pour compter les visiteurs distincts
            pepper = current_app.config["PEGINTI"].pepper
            anonyme = hashlib.sha256(pepper + ip_client().encode()).hexdigest()[:12]
        db = get_db()
        db.execute("INSERT INTO activite(ts, vitrine, type, utilisateur_id, anonyme, intention, mode, detail) "
                   "VALUES (?,?,?,?,?,?,?,?)", (maintenant(), vitrine, type_, utilisateur["id"] if utilisateur else None,
                                                anonyme, intention, mode, detail[:200]))
        db.commit()
    except Exception:
        log.exception("Journal d'activité")
