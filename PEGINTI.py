import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

# Télécharger les ressources NLTK (à faire une fois)
nltk.download('punkt')
nltk.download('stopwords')

# Fonction de nettoyage
def nettoyer_texte(texte, langue="french"):
    stop_words = set(stopwords.words(langue))
    tokens = word_tokenize(texte)
    tokens = [token.lower() for token in tokens if token.isalpha()]
    tokens = [token for token in tokens if token not in stop_words]
    return tokens

# Réponses bilingues
def repondre(question):
    print("Vous avez demandé : " + question)
    reponse = "Je suis désolé, je ne comprends pas la question. / Sorry, I don't understand the question."

    if question.lower() in ["bonjour", "hello"]:
        reponse = "Bonjour, comment allez-vous ? / Hello, how are you?"
    elif question.lower() in ["quel est votre nom ?", "what is your name?"]:
        reponse = "Mon nom est PEGINTI, je suis une IA pour vous aider. / My name is PEGINTI, I am an AI created to help you."
    elif question.lower() in ["au revoir", "goodbye"]:
        reponse = "Au revoir, à bientôt ! / Goodbye, see you soon!"
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
    print("Réponse : " + reponse)

# Conversation interactive
def converser():
    print("PEGINTI : Bonjour / Hello, je suis PEGINTI. Comment puis-je vous aider aujourd'hui ?")
    while True:
        question = input("Vous : ")
        repondre(question)
        if question.lower() in ["au revoir", "goodbye"]:
            break

def main():
    print("PEGINTI est lancé avec succès ! / PEGINTI has started successfully!")
    converser()

if __name__ == "__main__":
    main()
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
from langdetect import detect

# Détection de langue
def detect_language(text: str) -> str:
    try:
        return detect(text)
    except Exception:
        return "unknown"

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

# Boucle principale
if __name__ == "__main__":
    print("PEGINTI est prêt. Tapez votre message ci-dessous :\n")
    while True:
        user_input = input("Vous: ")
        lang = detect_language(user_input)

        # Choisir la langue de réponse
        reply_set = responses.get(lang, responses["unknown"])

        # Exemple de logique : salutation si l'utilisateur dit bonjour
        if "bonjour" in user_input.lower() or "hello" in user_input.lower() or "hola" in user_input.lower():
            reply = reply_set["greeting"]
        elif "aide" in user_input.lower() or "help" in user_input.lower() or "ayuda" in user_input.lower():
            reply = reply_set["help"]
        else:
            reply = reply_set["default"]

        print(f"PEGINTI ({lang}): {reply}\n")
