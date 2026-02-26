#!/bin/bash
# PEGINTI-CHAT v2.2 - Routage intelligent avec confiance et couleurs
BLUE="\033[0;34m"; GREEN="\033[0;32m"; YELLOW="\033[1;33m"; RED="\033[0;31m"; CYAN="\033[0;36m"; RESET="\033[0m"

echo -e "${YELLOW}🧠 PEGINTI-CHAT v2.2 - Système de routage intelligent${RESET}"
echo -e "${CYAN}┌─ ${BLUE}PEGINTICHAT${RESET} (GAUCHE | Public | 80%) ${CYAN}─┼─ ${GREEN}Bo'oivinichat${RESET} (DROIT | Premium | 20%) ─┐${RESET}"
echo -e "${CYAN}│ Tape 'exit' pour quitter. Questions générales → PEGINTICHAT │${RESET}"
echo

while true; do
  read -p "${CYAN}Vous${RESET}: " input
  [[ "$input" == "exit" || "$input" == "quit" || "$input" == "q" ]] && break

  # Encodage URL sécurisé
  encoded_input=$(echo "$input" | sed 's/ /+/g' | sed 's/é/e/g' | sed 's/è/e/g' | sed 's/à/a/g')

  # Routage intelligent avec gestion d'erreur robuste
  route=$(curl -s --max-time 5 "http://localhost:3000/peginti/router?q=$encoded_input" 2>/dev/null)
  
  if [[ -z "$route" || "$route" == "null" || "$route" == "" ]]; then
    echo -e "${RED}❌ Erreur routage - Bo'oivini HS${RESET}"
    continue
  fi

  # Extraction JSON sécurisée avec valeurs par défaut
  destination=$(echo "$route" | jq -r '.destination // "PEGINTICHAT"' 2>/dev/null || echo "PEGINTICHAT")
  status=$(echo "$route" | jq -r '.status // "Inconnu"' 2>/dev/null || echo "Inconnu")
  module=$(echo "$route" | jq -r '.module // "BIP"' 2>/dev/null || echo "BIP")
  confiance=$(echo "$route" | jq -r '.confiance // 50' 2>/dev/null || echo "50")

  # Affichage routage avec métriques
  printf "${YELLOW}↪ %s${RESET} ${CYAN}| %s${RESET} ${GREEN}| %s%%${RESET} ${YELLOW}%s${RESET}\n" "$destination" "$module" "$confiance" "$status"

  # Réponse selon destination
  if [[ "$destination" == "Bo'oivinichat" ]]; then
    printf "${GREEN}💎 %s${RESET}: " "Bo'oivinichat"
    reponse=$(curl -s --max-time 5 -H "Authorization: TomTech" "http://localhost:3000/booivini/chat?message=$encoded_input" 2>/dev/null | jq -r '.reponse // "Réponse premium indisponible"' 2>/dev/null || echo "Erreur premium")
    echo -e "$reponse"
  else
    printf "${BLUE}🌍 %s${RESET}: " "PEGINTICHAT"
    reponse=$(curl -s --max-time 5 "http://localhost:3000/?chat=$encoded_input" 2>/dev/null | jq -r '.reponse // "Réponse publique indisponible"' 2>/dev/null || echo "Erreur publique")
    echo -e "$reponse"
  fi
  echo
done

echo -e "${YELLOW}👋 Session PEGINTI-CHAT terminée${RESET}"
