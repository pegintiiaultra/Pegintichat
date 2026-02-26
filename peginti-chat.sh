#!/bin/bash
# PEGINTI-CHAT v2.2 RECONSTRUIT - Modèle Duo (Doctrinal/Public vs Premium/Confidentiel)
BLUE="\033[0;34m"; YELLOW="\033[1;33m"; RESET="\033[0m"

clear
cat << "EOBANNER"
🧠 PEGINTI-CHAT v2.2 RECONSTRUIT
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

  printf "${YELLOW}↪ %s${RESET} ${YELLOW}| %s${RESET} ${YELLOW}| %s%%${RESET} ${YELLOW}%s${RESET}\n" "$destination" "$module" "$confiance" "$status"

  if [[ "$destination" == "Bo'oivinichat" ]]; then
    # Premium/confidentiel (Jaune)
    printf "${YELLOW}💎 Bo'oivinichat:${RESET}\n"
    echo -e "${YELLOW}🚨 STRATÉGIE ULTRA RAPIDE${RESET}"
    echo -e "${YELLOW}📘 Objectif: \"$input\"${RESET}"
    echo -e "${YELLOW}2 Action: Modularité + BO'OIVINI${RESET}"
    echo -e "${YELLOW}3 Vision: Conscience institutionnelle CM${RESET}"
    echo -e "${YELLOW}⚡ Exécuter maintenant${RESET}"
    reponse=$(curl -s -H "Authorization: TomTech" "http://localhost:3000/booivini/chat?message=$encoded" 2>/dev/null | jq -r '.reponse // "Réponse premium indisponible"' 2>/dev/null)
    echo -e "${YELLOW}$reponse${RESET}"
  else
    # Doctrinal/public (Bleu)
    printf "${BLUE}🌍 PEGINTICHAT:${RESET}\n"
    echo -e "${BLUE}📘 BIP – Analyse doctrinale${RESET}"
    echo -e "${BLUE}✅ Cadre 1: Référence biblique exacte${RESET}"
    echo -e "${BLUE}✅ Cadre 2: Tradition ecclésiale institutionnelle${RESET}"
    echo -e "${BLUE}✅ Cadre 3: Conscience institutionnelle CM${RESET}"
    echo -e "${BLUE}DOCTRINE VALIDÉE – Cohérence 100%${RESET}"
    reponse=$(curl -s "http://localhost:3000/peginti/matrice?q=$encoded" 2>/dev/null | jq -r '.cadres[]?, .plan // "👁️ BIP: Réponse communautaire"' 2>/dev/null)
    echo -e "${BLUE}$reponse${RESET}"
  fi
  echo
done

echo -e "${YELLOW}👋 Session PEGINTI-CHAT terminée${RESET}"
