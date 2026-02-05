from langdetect import detect, LangDetectException
from config import responses, IDENTITY
import utils


def detect_lang_safe(text: str) -> str:
    try:
        return detect(text)
    except LangDetectException:
        return "unknown"


def repondre(question: str, lang: str):
    q = question.lower()
    reply_set = responses.get(lang, responses["unknown"])

    if "peginti" in q or "identité" in q:
        return IDENTITY

    elif "bonjour" in q and "bertrand" in q:
        return utils.salutation_personnalisee("Bertrand")

    elif "bonjour" in q or "bonsoir" in q:
        return responses["fr"]["greeting"]

    elif "hello" in q:
        return responses["en"]["greeting"]

    elif "hola" in q:
        return responses["es"]["greeting"]

    elif "heure" in q:
        return f"Il est actuellement {utils.heure()}."

    elif any(word in q for word in ["aide", "help", "ayuda"]):
        return reply_set["help"]

    elif any(word in q for word in ["bravo", "merci", "félicitations"]):
        return "Merci beaucoup pour vos encouragements ! 🙏 / Thank you very much for your encouragement!"

    else:
        return reply_set["default"]


def main():
    print("🚀 PEGINTI est lancé avec succès ! / PEGINTI has started successfully!\n")

    while True:
        question = input("Vous : ").strip()
        if not question:
            continue

        lang = detect_lang_safe(question)

        if question.lower() in ["au revoir", "goodbye", "bye", "exit", "quit"]:
            print("PEGINTI : Au revoir, à bientôt ! / Goodbye, see you soon! 👋")
            break

        reponse = repondre(question, lang)
        print(f"PEGINTI ({lang}) : {reponse}\n")


if __name__ == "__main__":
    main()
