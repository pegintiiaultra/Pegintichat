#!/data/data/com.termux/files/usr/bin/bash
# PEGINTI MATRICE — Raisonnement BO'OIVINI vivant

purple='\033[0;35m' green='\033[0;32m' cyan='\033[0;36m' reset='\033[0m'

echo -e "${cyan}🧠 PEGINTI MATRICE — BO'OIVINI vivant${reset}"
echo "=============================================="

while true; do
  read -p "$(echo -e ${purple}QUESTION${reset}: " question
  
  if [[ "$question" =~ ^quit$ ]]; then
    echo -e "${green}BO'OIVINI: Matrice désactivée. À bientôt.${reset}"
    exit 0
  fi
  
  [[ -z "$question" ]] && continue
  
  # MATRICE BO'OIVINI → Raisonnement contextuel
  echo -ne "${cyan}MATRICE${reset}: "
  
  # Contexte conversationnel + métacognition
  context="question:$(echo $question | cut -c1-50),timestamp:$(date +%H:%M),utilisateur:Bertrand,ecosysteme:PEGINTI"
  
  response=$(curl -s -X POST http://127.0.0.1:4000/peginti/analyse \
    -H "Content-Type: application/json" \
    -d "{\"question\":\"$question\",\"context\":\"$context\",\"user_view\":\"matriciel\"}" | \
    jq -r '.response | 
      if .recommandation then .recommandation 
      elif .presentation then .presentation 
      else "BO'\''OIVINI analyse en cours..." end')
  
  echo "$response"
  echo ""
done
