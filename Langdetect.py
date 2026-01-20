from langdetect import detect

user_input = "Je préfère qu'on discute en français"
lang = detect(user_input)   # renvoie 'fr'
if lang == 'fr':
    # répondre uniquement en français
elif lang == 'en':
    # répondre uniquement en anglais
else:
    # fallback bilingue
