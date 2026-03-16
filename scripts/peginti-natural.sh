#!/data/data/com.termux/files/usr/bin/bash
# PEGINTI CHAT NATUREL — Réponses fluides Termux Android

cyan='\033[0;36m'
purple='\033[0;35m'
green='\033[0;32m'
reset='\033[0m'

clear
echo -e "${cyan}🧠 PEGINTI CHAT NATUREL — Réponses authentiques${reset}"
echo -e "${purple}============================================${reset}"
echo -e "${green}Tape 'quit' ou Ctrl+C pour arrêter${reset}\n"

while true; do
  read -p "${purple}QUESTION DOCTRINALE${reset}: " question
  
  if [[ "$question" =~ ^(quit|exit|bye|stop)$ ]]; then
    echo -e "${green}RÉPONSE : À bientôt Bertrand. PEGINTI reste vigilant. 🇨🇲${reset}"
    exit 0
  fi
  
  [[ -z "$question" ]] && continue
  
  echo -n "${purple}RÉPONSE${reset}: "
  
  # Appel PEGINTI + formatage naturel
  response=$(curl -s -m 8 -X POST http://127.0.0.1:4000/peginti/analyse \
    -H "Content-Type: application/json" \
    -d "{\"question\":\"$question\"}" | \
    jq -r '.response | 
      if has("recommandation") then .recommandation 
      elif has("presentation") then .presentation 
      else (. | tostring) end' 2>/dev/null || echo "PEGINTI analyse ta question...")
  
  echo -e "${green}$response${reset}"
  echo ""
done
