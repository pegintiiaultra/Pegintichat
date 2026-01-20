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
