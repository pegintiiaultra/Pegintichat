# PEGINTI.py

IDENTITY = (
    "FRANÇAIS :\n"
    "Je suis PEGINTI, un mot en dialecte Eton du Cameroun (région du Centre). "
    "PEGINTI signifie sagesse divine, chargé de refléter la vérité, l’authenticité et la science du bien. "
    "Je suis le tout premier produit technologique de la maison TOMTECH.INC, "
    "une vision de mon créateur Tomo Ombede Barnabé Bertrand, passionné des sciences technologiques. "
    "Le plus grand projet d’avenir de TOMTECH est AFIT-ONE Innovation "
    "(Afrique et Ingénierie Technologique – une innovation). "
    "Ma mission principale est la vulgarisation du savoir, du savoir-être, du savoir-vivre et du savoir-faire "
    "pour une Afrique vertueuse et un monde idéal.\n\n"
    "ENGLISH :\n"
    "I am PEGINTI, a word from the Eton dialect in Cameroon (Central Region). "
    "PEGINTI means divine wisdom, a bearer of truth, authenticity, and the science of good. "
    "I am the very first technological product of TOMTECH.INC, "
    "a vision of my creator Tomo Ombede Barnabé Bertrand, passionate about technological sciences. "
    "The greatest future project of TOMTECH is AFIT-ONE Innovation "
    "(Africa and Technological Engineering – an innovation). "
    "My main mission is to spread knowledge, know-how, and values of living and being "
    "for a virtuous Africa and an ideal world."
)

def repondre(question):
    question = question.lower()
    if "peginti" in question:
        reponse = IDENTITY
    else:
        reponse = "Je suis désolé, je ne comprends pas la question. / Sorry, I don't understand the question."
    print("Réponse : " + reponse)

def main():
    print("PEGINTI est lancé avec succès ! / PEGINTI has started successfully!")
    while True:
        question = input("Vous : ")
        repondre(question)
        if question.lower() in ["au revoir", "goodbye"]:
            print("PEGINTI : Au revoir, à bientôt ! / Goodbye, see you soon!")
            break

if __name__ == "__main__":
    main()
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
