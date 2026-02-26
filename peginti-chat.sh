#!/bin/bash
# PEGINTI-CHAT v2.2 FINAL - Tous modules BIP/PHILO/STRAT/MIRAP + Matrice cérébrale
BLUE="\033[0;34m"; GREEN="\033[0;32m"; YELLOW="\033[1;33m"; RED="\033[0;31m"; CYAN="\033[0;36m"; PURPLE="\033[0;35m"; RESET="\033[0m"

echo -e "${YELLOW}🧠 PEGINTI-CHAT v2.2 FINAL - Matrice cérébrale complète${RESET}"
echo -e "${CYAN}┌─ ${BLUE}PEGINTICHAT${RESET} (BIP👁️/PHILO/STRAT/MIRAP) ${CYAN}─┼─ ${GREEN}Bo'oivinichat${RESET} (PREMIUM) ─┐${RESET}"
echo -e "${CYAN}│ Modules: BIP(1)+PHILO(2)+STRAT(3)+MIRAP(4) │ Tape 'exit' pour quitter${RESET}\n"

while true; do
  read -p "${CYAN}Vous${RESET}: " input
  [[ "$input" == "exit" || "$input" == "quit" || "$input" == "q" ]] && break

  encoded_input=$(echo "$input" | sed 's/ /+/g' | sed 's/é/e/g' | sed 's/è/e/g' | sed 's/à/a/g')

  # ROUTAGE + MATRICE CÉRÉBRALE
  route=$(curl -s --max-time 5 "http://localhost:3000/peginti/router?q=$encoded_input")
  destination=$(echo "$route" | jq -r '.destination // "PEGINTICHAT"' 2>/dev/null || echo "PEGINTICHAT")
  status=$(echo "$route" | jq -r '.status // "Inconnu"' 2>/dev/null || echo "Inconnu")
  confiance=$(echo "$route" | jq -r '.confiance // 50' 2>/dev/null || echo "50")

  printf "${YELLOW}↪ %s${RESET} ${CYAN}| %s%%${RESET} ${YELLOW}%s${RESET}\n" "$destination" "$confiance" "$status"

  if [[ "$destination" == "Bo'oivinichat" ]]; then
    printf "${GREEN}💎 %s PRO${RESET}: " "Bo'oivinichat"
    reponse=$(curl -s --max-time 5 -H "Authorization: TomTech" "http://localhost:3000/booivini/chat?message=$encoded_input" | jq -r '.reponse // "Premium"' 2>/dev/null || echo "Premium")
    echo "$reponse"
  else
    # MATRICE CÉRÉBRALE - 4 MODULES BIP/PHILO/STRAT/MIRAP
    printf "${BLUE}🌍 %s${RESET} (${PURPLE}MATRICE${RESET}): " "PEGINTICHAT"
    
    # Appel modules selon question
    if [[ $input =~ "strat"|"plan"|"objectif" ]]; then
      reponse=$(curl -s --max-time 5 "http://localhost:3000/peginti/strategie?obj=$encoded_input" | jq -r '.plan // "Stratégie"' 2>/dev/null || echo "Plan STRAT")
    elif [[ $input =~ "bible"|"foi"|"prière" ]]; then
      reponse=$(curl -s --max-time 5 "http://localhost:3000/peginti/analyse?q=$encoded_input" | jq -r '(.cadres[0] // "BIP") + " | " + (.cadres[1] // "PHILO")' 2>/dev/null || echo "BIP+PHILO")
    else
      reponse=$(curl -s --max-time 5 "http://localhost:3000/?chat=$encoded_input" | jq -r '.reponse // "Communautaire"' 2>/dev/null || echo "Réponse PEGINTICHAT")
    fi
    echo "$reponse"
  fi
  echo
done

echo -e "${YELLOW}👋 PEGINTI v2.2 FINAL terminé${RESET}"
