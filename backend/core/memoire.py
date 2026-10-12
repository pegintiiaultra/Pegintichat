"""Mémoire continue : historique persistant par utilisateur et par vitrine (SQLite)."""
from __future__ import annotations

from ..db import get_db, maintenant

MAX_PAR_FIL = 200


def contexte(utilisateur_id: int, vitrine: str, n: int = 8) -> list[dict]:
    rows = get_db().execute(
        "SELECT role, contenu FROM memoire WHERE utilisateur_id=? AND vitrine=? ORDER BY id DESC LIMIT ?",
        (utilisateur_id, vitrine, n)).fetchall()
    return [{"role": r["role"], "contenu": r["contenu"]} for r in reversed(rows)]


def ajouter(utilisateur_id: int, vitrine: str, role: str, contenu: str) -> None:
    db = get_db()
    db.execute("INSERT INTO memoire(utilisateur_id, vitrine, role, contenu, ts) VALUES (?,?,?,?,?)",
               (utilisateur_id, vitrine, role, contenu[:6000], maintenant()))
    db.execute("DELETE FROM memoire WHERE utilisateur_id=? AND vitrine=? AND id NOT IN "
               "(SELECT id FROM memoire WHERE utilisateur_id=? AND vitrine=? ORDER BY id DESC LIMIT ?)",
               (utilisateur_id, vitrine, utilisateur_id, vitrine, MAX_PAR_FIL))
    db.commit()


def effacer(utilisateur_id: int, vitrine: str) -> None:
    db = get_db()
    db.execute("DELETE FROM memoire WHERE utilisateur_id=? AND vitrine=?", (utilisateur_id, vitrine))
    db.commit()


def nettoyer_historique_client(brut) -> list[dict]:
    """Historique envoyé par un visiteur anonyme : borné, rôles forcés, contenu tronqué."""
    if not isinstance(brut, list):
        return []
    out = []
    for m in brut[-6:]:
        if isinstance(m, dict) and isinstance(m.get("contenu"), str):
            role = "assistant" if m.get("role") == "assistant" else "user"
            out.append({"role": role, "contenu": m["contenu"][:2000]})
    return out
