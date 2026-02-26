#!/bin/bash
GREEN="\033[0;32m"; BLUE="\033[0;34m"; RESET="\033[0m"
echo -e "🧠 PEGINTI-CHAT ${GREEN}(GAUCHE)${RESET} / ${BLUE}Bo'oivinichat (DROIT)${RESET}"
echo "Tape 'exit' pour quitter."
while true; do
  read -p "Vous: " input
  [ "$input" = "exit" ] && break
  echo -e "${GREEN}↪ PEGINTICHAT (public):${RESET}"
  curl -s "http://localhost:3000/?chat=$input" | jq -r .reponse
  echo -e "${BLUE}↪ Bo'oivinichat (premium):${RESET}"
  curl -s -H "Authorization: TomTech" "http://localhost:3000/booivini/chat?message=$input" | jq -r .reponse
  echo -e "${GREEN}↪ Analyse doctrinale:${RESET}"
  curl -s "http://localhost:3000/peginti/analyse?q=$input" | jq -r .doctrine
  echo -e "${BLUE}↪ Stratégie:${RESET}"
  curl -s "http://localhost:3000/peginti/strategie?obj=$input" | jq -r .status
done
