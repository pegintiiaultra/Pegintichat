# langdetect.py
# Utilitaire pour détecter automatiquement la langue d'un texte utilisateur

from langdetect import detect
from langdetect import DetectorFactory

# Fixe la graine pour rendre les résultats reproductibles
DetectorFactory.seed = 0

def detect_language(text: str) -> str:
    """
    Détecte la langue principale d'un texte.
    Retourne un code de langue ISO (ex: 'fr', 'en', 'es').
    """
    try:
        return detect(text)
    except Exception:
        return "unknown"
