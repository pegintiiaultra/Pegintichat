# utils.py
import datetime

def saluer_utilisateur(nom):
    return f"Bonjour {nom}, ravi de vous voir aujourd'hui !"

def donner_heure():
    maintenant = datetime.datetime.now()
    return f"Il est actuellement {maintenant.strftime('%H:%M:%S')}."

def aide():
    return (
        "Commandes disponibles :\n"
        "- Bonjour\n"
        "- Quel est votre nom ?\n"
        "- Heure\n"
        "- Au revoir\n"
    )
