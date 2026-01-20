from langdetect import detect_language  # si tu gardes le nom langdetect.py
# ou
from langdetect import detect_language
user_input = input("Vous : ")

lang = detect_language(user_input)

if lang == "fr":
    response = "Réponse uniquement en français..."
elif lang == "en":
    response = "Response only in English..."
else:
    response = "Réponse bilingue par défaut (FR/EN)..."

print(response)
# langdetect.py
# Utilitaire pour détecter automatiquement la langue d'un texte utilisateur

from langdetect import detect, DetectorFactory

# Fixe la graine pour rendre les résultats reproductibles
DetectorFactory.seed = 0

def detect_language(text: str) -> str:
    """
    Détecte la langue principale d'un texte.
    Retourne le code ISO (ex: 'fr', 'en', 'es', 'de').
    """
    try:
        return detect(text)
    except Exception:
        return "unknown"

# Exemple d'utilisation directe
if __name__ == "__main__":
    sample_texts = [
        "Je préfère qu'on discute en français",
        "I would like to continue in English",
        "Hola, ¿cómo estás?"
    ]
    for txt in sample_texts:
        print(f"Texte: {txt}")
        print(f"Langue détectée: {detect_language(txt)}\n")
