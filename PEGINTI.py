# Importer les bibliothèques
import re
import random
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

# Télécharger les ressources NLTK (à faire une fois)
nltk.download('punkt')
nltk.download('stopwords')

# Définir les fonctions de traitement du langage naturel
def traiter_langue(texte):
    tokens = word_tokenize(texte)
    tokens = [token.lower() for token in tokens]
    tokens = [token for token in tokens if token.isalpha()]
    return tokens

def nettoyer_texte(texte):
    stop_words = set(stopwords.words('french'))
    tokens = traiter_langue(texte)
    tokens = [token for token in tokens if token not in stop_words]
    return tokens

# Fonction pour répondre aux questions
def repondre(question):
    print("Vous avez demandé : " + question)
    reponse = "Je suis désolé, je ne comprends pas la question."
    if question == "Bonjour":
        reponse = "Bonjour, comment allez-vous ?"
    elif question == "Quel est votre nom ?":
        reponse = "Mon nom est PEGINTI, je suis une intelligence artificielle créée pour vous aider."
    print("Réponse : " + reponse)

# Fonction pour engager des conversations interactives
def converser():
    print("PEGINTI : Bonjour, je suis PEGINTI. Comment puis-je vous aider aujourd'hui ?")
    while True:
        question = input("Vous : ")
        repondre(question)
        if question == "Au revoir":
            print("PEGINTI : Au revoir, à bientôt !")
            break

# Fonction principale
def main():
    print("PEGINTI est lancé avec succès !")
    converser()

# Point d'entrée du programme
if __name__ == "__main__":
    main()
