# configure.py
# Fichier de configuration central pour PEGINTI

# Paramètres généraux
APP_NAME = "PEGINTI"
VERSION = "1.0.0"
AUTHOR = "Tomo Ombede Barnabé Bertrand"

# Messages par défaut
DEFAULT_LANGUAGE = "fr"
DEFAULT_GREETING = "Bonjour, je suis PEGINTI. Comment puis-je vous aider aujourd'hui ?"
DEFAULT_HELP = "Je peux vous accompagner dans vos projets et répondre à vos questions."
DEFAULT_FALLBACK = "Je réponds par défaut en français."

# Dictionnaire multilingue
RESPONSES = {
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

# Liste des mots-clés pour les réponses spéciales
KEYWORDS = {
    "identity": ["peginti", "identité"],
    "greeting_fr": ["bonjour", "bonsoir"],
    "greeting_en": ["hello"],
    "greeting_es": ["hola"],
    "help_fr": ["aide"],
    "help_en": ["help"],
    "help_es": ["ayuda"],
    "positive": ["bravo", "merci", "félicitations"]
}

# Réponse spéciale pour les encouragements
POSITIVE_REPLY = "Merci beaucoup pour vos encouragements ! / Thank you very much for your encouragement!"
