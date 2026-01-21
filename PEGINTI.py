# PEGINTI.py

# Import de la fonction de détection de langue définie dans langdetect.py
from langdetect import detect_language
# PEGINTI.py

from langdetect import detect_language   # Import de la fonction utilitaire

# Identité doctrinale
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

# Dictionnaire multilingue
responses = {
    "fr": {
        "greeting": "Bonjour, je suis PEGINTI. Comment puis-je vous aider aujourd'hui ?",
        "help": "Je peux vous accompagner dans vos projets et répondre à vos questions.",
        "default": "Je réponds en français."
    },
    "en": {
        "greeting": "Hello, I am PEGINTI. How can I assist you today?",
        "help": "I can support your projects and answer your questions.",
        "default": "I will answer in English."
    },
    "es": {
        "greeting": "Hola, soy PEGINTI. ¿Cómo puedo ayudarte hoy?",
        "help": "Puedo apoyarte en tus proyectos y responder a tus preguntas.",
        "default": "Responderé en español."
    },
    "unknown": {
        "greeting": "Langue non reconnue, je bascule par défaut en français.",
        "help": "Je peux vous accompagner dans vos projets et répondre à vos questions.",
        "default": "Je réponds par défaut en français."
    }
}

# Fonction de réponse
def repondre(question: str):
    lang = detect_language(question)
    reply_set = responses.get(lang, responses["unknown"])

    if "peginti" in question.lower() or "identité" in question.lower():
        return IDENTITY
    elif "bonjour" in question.lower() or "bonsoir" in question.lower():
        lang = 'fr'
        return responses.get(lang, responses["unknown"])["greeting"]
    elif "hello" in question.lower():
        lang = 'en'
        return responses.get(lang, responses["unknown"])["greeting"]
    elif "hola" in question.lower():
        lang = 'es'
        return responses.get(lang, responses["unknown"])["greeting"]
    elif "aide" in question.lower() or "help" in question.lower() or "ayuda" in question.lower():
        return reply_set["help"]
    else:
        return reply_set["default"]

# Boucle principale
def main():
    print("PEGINTI est lancé avec succès ! / PEGINTI has started successfully!\n")
    while True:
        question = input("Vous : ")
        reponse = repondre(question)
        print(f"Réponse ({detect_language(question)}): {reponse}\n")

        if question.lower() in ["au revoir", "goodbye"]:
            print("PEGINTI : Au revoir, à bientôt ! / Goodbye, see you soon!")
            break

if __name__ == "__main__":
    main()
