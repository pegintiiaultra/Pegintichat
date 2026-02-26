#!/bin/bash
BLUE="\033[0;34m"; GREEN="\033[0;32m"; YELLOW="\033[1;33m"; RESET="\033[0m"
echo -e "🧠 PEGINTI-CHAT ${BLUE}(GAUCHE)${RESET} / ${GREEN}Bo'oivinichat (DROIT)${RESET}"
echo "Tape 'exit' pour quitter."

while true; do
  read -p "Vous: " input
  [ "$input" = "exit" ] && break

  # Récupération du routage
  route=$(curl -s "http://localhost:3000/peginti/router?q=$(echo $input | sed 's/ /+/g')")
  destination=$(echo $route | jq -r .destination)

  echo -e "${YELLOW}↪ Routage: $destination${RESET}"

  if [ "$destination" = "PEGINTICHAT" ]; then
    echo -e "${BLUE}↪ PEGINTICHAT (public):${RESET}"
    curl -s "http://localhost:3000/?chat=$input" | jq -r .reponse
    echo -e "${BLUE}↪ Analyse doctrinale:${RESET}"
    curl -s "http://localhost:3000/peginti/analyse?q=$input" | jq -r .doctrine
  else
    echo -e "${GREEN}↪ Bo'oivinichat (premium):${RESET}"
    curl -s -H "Authorization: TomTech" "http://localhost:3000/booivini/chat?message=$input" | jq -r .reponse
    echo -e "${GREEN}↪ Stratégie:${RESET}"
    curl -s "http://localhost:3000/peginti/strategie?obj=$input" | jq -r .status
  fi
done
