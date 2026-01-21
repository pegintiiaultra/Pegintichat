principal PEGINTI.Py# PEGINTI.py

from langdetect import detect_language
from config import responses, IDENTITY
import utils

def repondre(question: str):
    q = question.lower()
    lang = detect_language(question)
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
    elif "aide" in q or "help" in q or "ayuda" in q:
        return reply_set["help"]
    elif "bravo" in q or "merci" in q or "félicitations" in q:
        return "Merci beaucoup pour vos encouragements ! / Thank you very much for your encouragement!"
    else:
        return reply_set["default"]

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
