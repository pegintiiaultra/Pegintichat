"""NARRATION — transforme le résultat de la matrice en texte fluide, structuré par niveaux."""
from __future__ import annotations

TITRES = {"factuel": "Faits", "enrichi": "Analyse", "strategique": "Perspective stratégique"}


def narrer(resultat: dict, paquet: dict) -> dict:
    niveaux = resultat["niveaux"]
    sections = [{"niveau": n, "titre": TITRES[n], "texte": niveaux[n]} for n in TITRES if niveaux.get(n)]
    avec_titres = paquet["vitrine"] == "WOUNANET" and len(sections) > 1
    if avec_titres:
        texte = "\n\n".join(f"{s['titre']}\n{s['texte']}" for s in sections)
    else:
        texte = "\n\n".join(s["texte"] for s in sections)
    note = None
    if resultat["sources"] and paquet["vitrine"] == "WOUNANET" and paquet["intention"] == "veille":
        note = f"{len(resultat['sources'])} dépêche(s) collectée(s) ; les plus pertinentes d'abord."
    return {
        "texte": texte or "Aucune réponse disponible.",
        "sections": sections if avec_titres else [],
        "sources": [{k: s[k] for k in ("titre", "source", "lien", "date")} | {"resume": s["resume"][:280]}
                    for s in resultat["sources"]],
        "mode": resultat["mode"],
        "note": note,
    }
