#!/data/data/com.termux/files/usr/bin/bash
# Démarre le serveur (port 4000) et le tunnel Cloudflare dans une session tmux nommée « peginti ».
# Commandes utiles :  tmux attach -t peginti   |   ./arreter.sh
cd "$(dirname "$0")"
command -v termux-wake-lock >/dev/null && termux-wake-lock   # empêche la mise en veille du téléphone

if tmux has-session -t peginti 2>/dev/null; then
  echo "Déjà lancé. Voir : tmux attach -t peginti"; exit 0
fi

tmux new-session -d -s peginti -n serveur ". .venv/bin/activate && python serve.py"
TOKEN="$(grep -E '^CLOUDFLARE_TUNNEL_TOKEN=' .env 2>/dev/null | cut -d= -f2-)"
if [ -n "$TOKEN" ]; then
  # Tunnel géré depuis le tableau de bord Cloudflare (Zero Trust) : les hôtes publics s'y configurent.
  tmux new-window -t peginti -n tunnel "cloudflared tunnel --no-autoupdate run --token $TOKEN"
elif [ -f "$HOME/.cloudflared/config.yml" ]; then
  tmux new-window -t peginti -n tunnel "cloudflared tunnel run peginti-server"
else
  echo "⚠ Pas de ~/.cloudflared/config.yml : serveur seul (local). Voir deploy/CLOUDFLARE.md"
fi
sleep 2
curl -s http://127.0.0.1:4000/api/sante && echo
echo "Journaux : tmux attach -t peginti   (Ctrl+b puis d pour quitter sans arrêter)"
