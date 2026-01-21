# utils.py
# Fonctions utilitaires pour PEGINTI

import datetime

def saluer_utilisateur(nom: str) -> str:
    """
    Retourne une salutation personnalisée.
    """
    return f"Bonjour {nom}, ravi de vous voir aujourd'hui !"

def donner_heure() -> str:
    """
    Retourne l'heure actuelle formatée HH:MM:SS.
    """
    maintenant = datetime.datetime.now()
    return f"Il est actuellement {maintenant.strftime('%H:%M:%S')}."

def aide() -> str:
    """
    Retourne la liste des commandes disponibles.
    """
    return (
        "Commandes disponibles :\n"
        "- Bonjour\n"
        "- Quel est votre nom ?\n"
        "- Heure\n"
        "- Au revoir\n"
    )
