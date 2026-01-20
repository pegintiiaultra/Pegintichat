#PEGINTI.py

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
