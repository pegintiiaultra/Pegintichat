#!/bin/bash
# PEGINTI-CHAT v2.2 FINAL - Routage intelligent modulaire et scalable
BLUE="\033[0;34m"; GREEN="\033[0;32m"; YELLOW="\033[1;33m"; RED="\033[0;31m"; CYAN="\033[0;36m"; RESET="\033[0m"

echo -e "${YELLOW}🧠 PEGINTI-CHAT v2.2 FINAL - Routage intelligent modulaire${RESET}"
echo -e "${CYAN}┌─ ${BLUE}PEGINTICHAT${RESET} (GAUCHE | Public | 80%) ${CYAN}─┼─ ${GREEN}Bo'oivinichat${RESET} (DROIT | Premium | 20%) ─┐${RESET}"
echo -e "${CYAN}│ Tape 'exit' pour quitter. Questions générales → PEGINTICHAT │${RESET}"
echo

while true; do
  read -p "${CYAN}Vous${RESET}: " input
  [[ "$input" == "exit" || "$input" == "quit" || "$input" == "q" ]] && break

  # Encodage URL sécurisé
  encoded_input=$(echo "$input" | sed 's/ /+/g' | sed 's/é/e/g' | sed 's/è/e/g' | sed 's/à/a/g')

  # Routage intelligent
  route=$(curl -s --max-time 5 "http://localhost:3000/peginti/router?q=$encoded_input" 2>/dev/null)
  if [[ -z "$route" || "$route" == "null" ]]; then
    echo -e "${RED}❌ Erreur routage - Bo'oivini HS${RESET}"
    continue
  fi

  # Extraction JSON sécurisée
  destination=$(echo "$route" | jq -r '.destination // "PEGINTICHAT"' 2>/dev/null)
  status=$(echo "$route" | jq -r '.status // "Inconnu"' 2>/dev/null)
  module=$(echo "$route" | jq -r '.module // "BIP"' 2>/dev/null)
  confiance=$(echo "$route" | jq -r '.confiance // 50' 2>/dev/null)

  # Affichage routage
  printf "${YELLOW}↪ %s${RESET} ${CYAN}| %s${RESET} ${GREEN}| %s%%${RESET} ${YELLOW}%s${RESET}\n" "$destination" "$module" "$confiance" "$status"

  # Réponse selon destination
  if [[ "$destination" == "Bo'oivinichat" ]]; then
    printf "${GREEN}💎 %s${RESET}: " "Bo'oivinichat"
    reponse=$(curl -s --max-time 5 -H "Authorization: TomTech" "http://localhost:3000/booivini/chat?message=$encoded_input" 2>/dev/null | jq -r '.reponse // "Réponse premium indisponible"' 2>/dev/null)
    echo -e "$reponse"
  else
    printf "${BLUE}🌍 %s${RESET}: " "PEGINTICHAT"
    reponse=$(curl -s --max-time 5 "http://localhost:3000/?chat=$encoded_input" 2>/dev/null | jq -r '.reponse // "Réponse publique indisponible"' 2>/dev/null)
    echo -e "$reponse"
  fi
  echo
done

echo -e "${YELLOW}👋 Session PEGINTI-CHAT terminée${RESET}"
