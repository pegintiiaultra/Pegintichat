"""Registre des MODULES : chacun signale automatiquement un filtre doctrinal ou logique à appliquer.

Le BIP scanne ces modules (et non la matrice) ; la matrice ne fait qu'appliquer les filtres signalés.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Callable


@dataclass(frozen=True)
class Module:
    nom: str
    description: str
    declencheur: Callable[[str, dict], bool]  # (texte normalisé, paquet partiel) -> bool
    filtre: str  # consigne injectée dans le raisonnement de la matrice


def _contient(*mots):
    """Correspondance par mots entiers ou expressions (évite « api » dans « capital »)."""
    return lambda t, _p: any(f" {m} " in f" {t} " for m in mots)


MODULES: tuple[Module, ...] = (
    Module("identite", "Doctrine d'identité et de souveraineté de PEGINTI.",
           _contient("qui es tu", "qui t a cree", "qui t a concu", "ton createur", "ton concepteur",
                     "ton architecte", "c est quoi peginti"),
           "Présente l'identité de PEGINTI IA et de son créateur sans digresser."),
    Module("philosophie_africaine", "Lecture holiste et communautaire (Ubuntu, Maât, arbre à palabres).",
           lambda t, _p: any(m in t for m in ("philosophie africaine", "pensee africaine", "ubuntu", "maat",
                                              "cheikh anta diop", "gouvernance africaine",
                                              "gestion des communautes"))
           or ("philosophie" in t and "afrique" in t) or ("communaute" in t and "afrique" in t),
           "Adopte une lecture holiste : individu, communauté et environnement forment un continuum ; "
           "appuie-toi sur des références précises (Ubuntu, Maât, Cheikh Anta Diop) sans les inventer."),
    Module("rigueur_factuelle", "Exactitude et traçabilité quand des sources de veille sont mobilisées.",
           lambda _t, p: bool(p.get("besoin_wounanet")),
           "N'affirme comme fait que ce qui figure dans les SOURCES fournies ; cite la source de chaque "
           "fait ; distingue clairement fait établi, interprétation et incertitude."),
    Module("prudence_sensible", "Prudence sur santé, droit, finance.",
           _contient("medicament", "diagnostic", "symptome", "avocat", "procedure judiciaire", "investir",
                     "placement", "bourse", "credit", "traitement"),
           "Donne des informations générales exactes, signale tes limites, ne remplace pas un "
           "professionnel et évite toute recommandation individuelle définitive."),
    Module("developpeur", "Assistance développeur : code, déploiement, sécurité.",
           _contient("code", "python", "javascript", "api", "bug", "erreur", "deploy", "serveur",
                     "sdk", "docker", "git", "termux", "base de donnees", "sql", "html", "css", "deployer",
                     "deploiement", "programme", "programmer", "script", "fonction python"),
           "Fournis du code complet, testable et sûr (validation d'entrées, aucun secret en dur, "
           "requêtes paramétrées) ; explique brièvement les choix."),
)


def scanner(texte_normalise: str, paquet_partiel: dict) -> list[str]:
    return [m.nom for m in MODULES if m.declencheur(texte_normalise, paquet_partiel)]


def filtre(nom: str) -> str:
    for m in MODULES:
        if m.nom == nom:
            return m.filtre
    return ""
