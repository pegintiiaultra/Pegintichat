nano utils.py
# utils.py

from datetime import datetime

def heure() -> str:
    """
    Retourne l'heure actuelle au format HH:MM:SS.
    """
    return datetime.now().strftime("%H:%M:%S")

def salutation_personnalisee(nom: str) -> str:
    """
    Retourne une salutation personnalisée.
    """
    return f"Bonjour {nom}, ravi de vous voir aujourd'hui !"
