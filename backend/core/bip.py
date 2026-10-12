"""BIP — scanner d'intentions et de redirection.

Détecte l'intention, interprète le besoin et l'identité, scanne les MODULES pour signaler les filtres
à appliquer, puis redirige un « paquet BIP » vers la MATRICE.
"""
from __future__ import annotations

import re
import unicodedata

from . import modules

VITRINES = ("CHAT_INTERACTIF", "WOUNANET", "PREMIUM")

_SALUTATIONS = {"bonjour", "salut", "bonsoir", "hello", "hi", "coucou", "yo", "ca va",
                "comment tu vas", "comment vas tu"}
_VEILLE = ("actualite", "actu ", "nouvelle", "dernieres", "derniers", "aujourd hui", "en ce moment",
           "recent", "news", "que se passe", "cette semaine", "ce mois", "breaking", "dernier")


def normaliser(txt: str) -> str:
    t = unicodedata.normalize("NFD", str(txt or "").lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9\s]", " ", t)).strip()


def _intention(t: str, mods: list[str]) -> str:
    if t in _SALUTATIONS:
        return "salutation"
    if t == "merci" or t.startswith("merci "):
        return "remerciement"
    if "identite" in mods:
        return "identite"
    if "philosophie_africaine" in mods:
        return "philosophie"
    if "developpeur" in mods:
        return "developpement"
    if any(m in t for m in _VEILLE):
        return "veille"
    return "generale"


def scanner(message: str, vitrine: str, utilisateur: dict | None) -> dict:
    if vitrine not in VITRINES:
        raise ValueError("Vitrine inconnue")
    t = normaliser(message)
    paquet = {
        "message": message.strip(),
        "texte_normalise": t,
        "vitrine": vitrine,
        # Identité : interprétée côté serveur depuis la session, jamais depuis le corps de la requête.
        "identite": {
            "authentifie": bool(utilisateur),
            "pseudo": utilisateur["pseudo"] if utilisateur else None,
            "role": utilisateur["role"] if utilisateur else "anonyme",
        },
    }
    # Le besoin de veille est connu avant le scan des modules (le filtre factuel en dépend).
    paquet["besoin_wounanet"] = vitrine == "WOUNANET" or any(m in t for m in _VEILLE)
    mods = modules.scanner(t, paquet)
    paquet["filtres"] = mods
    paquet["intention"] = "veille" if vitrine == "WOUNANET" else _intention(t, mods)
    if paquet["intention"] in ("salutation", "remerciement", "identite"):
        paquet["besoin_wounanet"] = False
    paquet["sujet"] = paquet["message"][:300]
    return paquet
