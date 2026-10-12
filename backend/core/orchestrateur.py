"""SERVER (orchestrateur 1) — enchaîne BIP → Matrice (↔ Wounanet + Mémoire) → Narration."""
from __future__ import annotations

from .. import activite
from . import bip, matrice, memoire, narration


def traiter(message: str, vitrine: str, utilisateur: dict | None, historique_client=None) -> dict:
    paquet = bip.scanner(message, vitrine, utilisateur)
    if utilisateur:
        historique = memoire.contexte(utilisateur["id"], vitrine)
    else:
        historique = memoire.nettoyer_historique_client(historique_client)
    resultat = matrice.raisonner(paquet, historique)
    reponse = narration.narrer(resultat, paquet)
    activite.enregistrer(vitrine, "requete", utilisateur, paquet["intention"], resultat["mode"],
                         f"{len(message)} car., {len(reponse['sources'])} sources")
    if utilisateur and resultat["mode"] in ("llm", "local"):
        memoire.ajouter(utilisateur["id"], vitrine, "user", message)
        memoire.ajouter(utilisateur["id"], vitrine, "assistant", reponse["texte"])
    return reponse
