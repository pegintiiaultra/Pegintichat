#!/bin/bash
# PEGINTI-CHAT v2.2 PROPRE - Couleurs corrigées
BLUE="\033[0;34m"; YELLOW="\033[1;33m"; RESET="\033[0m"

clear
cat << "EOBANNER"
🧠 PEGINTI-CHAT v2.2 PROPRE
🌍 PEGINTICHAT (GAUCHE | Public/doctrinal - Bleu) | 💎 Bo'oivinichat (DROIT | Premium/confidentiel - Jaune)
Toutes les réponses passent par le cerveau Bo'oivini
Tape 'exit' pour quitter
EOBANNER

while true; do
  echo -n "Vous: "
  read input
  [[ "$input" == "exit" || "$input" == "q" ]] && break

  encoded=$(echo "$input" | sed 's/ /+/g')

  # Routage via Bo'oivini
  route=$(curl -s --max-time 5 "http://localhost:3000/peginti/router?q=$encoded" 2>/dev/null)
  destination=$(echo "$route" | jq -r '.destination // "PEGINTICHAT"' 2>/dev/null)
  module=$(echo "$route" | jq -r '.module // "BIP"' 2>/dev/null)
  confiance=$(echo "$route" | jq -r '.confiance // 80' 2>/dev/null)
  status=$(echo "$route" | jq -r '.status // "✅ Routage déterminé"' 2>/dev/null)

  # Affichage métriques (toujours en jaune)
  printf "${YELLOW}↪ %s${RESET} ${BLUE}| %s${RESET} ${YELLOW}| %s%%${RESET} ${BLUE}%s${RESET}\n" "$destination" "$module" "$confiance" "$status"

  if [[ "$destination" == "Bo'oivinichat" ]]; then
    # Premium ultra rapide (Jaune)
    printf "${YELLOW}💎 Bo'oivinichat:${RESET} "
    reponse=$(curl -s -H "Authorization: TomTech" "http://localhost:3000/booivini/chat?message=$encoded" 2>/dev/null | jq -r '.reponse // "Réponse premium indisponible"' 2>/dev/null)
    echo "$reponse"
  else
    # PEGINTICHAT vitrine communautaire (Bleu)
    printf "${BLUE}🌍 PEGINTICHAT:${RESET} "
    reponse=$(curl -s "http://localhost:3000/peginti/matrice?q=$encoded" 2>/dev/null | jq -r '.cadres[]?, .plan // "👁️ BIP: Réponse communautaire"' 2>/dev/null)
    echo "$reponse"
  fi
  echo
done

echo -e "${YELLOW}👋 Session PEGINTI-CHAT terminée${RESET}"
