# Cloudflare — tunnel `peginti-server` → `www.pegintichat.online` → port 4000

Tout passe par **une seule adresse : `https://www.pegintichat.online`**, servie par Termux sur `127.0.0.1:4000`.
Seul le tunnel l'expose à Internet. Le domaine nu `pegintichat.online` **reste sur l'hébergement distant
Google AI Studio** (ancienne application, port 3000 côté AI Studio) : rien n'y est modifié.

| Adresse | Où elle va |
|---|---|
| `www.pegintichat.online` | Tunnel `peginti-server` → Termux, `http://127.0.0.1:4000` (application, API, sessions) |
| `wounanet.pegintichat.online` | Tunnel → Termux ; le serveur redirige vers `www…/wounanet` |
| `premium.pegintichat.online` | Tunnel → Termux ; le serveur redirige vers `www…/premium` |
| `pegintichat.online` | **Inchangé** : Google AI Studio (CNAME `ais-pre-…run.app`) |
| `api.pegintichat.online` | **Supprimé** (voir ci-dessous) |

## 1. Supprimer `api.pegintichat.online` (à faire dans Cloudflare)

1. **Zero Trust → Networks → Tunnels → `peginti-server` → Public Hostnames** : supprimer la ligne `api.pegintichat.online`.
2. **DNS → Enregistrements** : supprimer l'enregistrement `api` (type Tunnel). S'il reste, il ne mène plus nulle part.

## 2. Pointer les hôtes vers le port 4000

Même page *Public Hostnames* : pour `www`, `wounanet` et `premium`, **Service : `HTTP` — `127.0.0.1:4000`**
(remplacer l'ancien `localhost:3000`). Enregistrer.

## 3. Jeton et lancement

Onglet **Vue d'ensemble → Installer et exécuter un connecteur** : copier le jeton (valeur après `--token`) dans `.env` :
```
CLOUDFLARE_TUNNEL_TOKEN=eyJhIjoi…
```
Puis `./lancer.sh` (serveur + tunnel dans tmux). Test : `curl https://www.pegintichat.online/api/sante`

## Variante : tunnel géré par fichier local (`~/.cloudflared/config.yml`)

```yaml
tunnel: peginti-server
credentials-file: /data/data/com.termux/files/home/.cloudflared/<UUID>.json
ingress:
  - hostname: www.pegintichat.online
    service: http://127.0.0.1:4000
  - hostname: wounanet.pegintichat.online
    service: http://127.0.0.1:4000
  - hostname: premium.pegintichat.online
    service: http://127.0.0.1:4000
  - service: http_status:404
```

## Réglages recommandés (zone `pegintichat.online`)

- **SSL/TLS → Mode « Full »** et **Always Use HTTPS** activé.
- **Security → WAF → Rate limiting** sur `/api/auth/*` (en plus du limiteur interne).
- **E-mail** : Cloudflare signale l'absence d'enregistrements SPF, DKIM et DMARC. À ajouter chez votre fournisseur
  d'envoi si vous utilisez `no-reply@pegintichat.online`.
