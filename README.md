# PEGINTI IA 4.0

Plateforme IA souveraine de **TOMTECH.INC** — reconstruite de zéro : backend **Python** (Flask), frontend **JavaScript**, comptes utilisateurs et sécurité renforcée. Conçue pour tourner sur **Termux**, port **4000**, derrière un tunnel Cloudflare sur **www.pegintichat.online** (et `pegintichat.online`).

## Fonctionnement (votre schéma, fidèlement)

```
Interface web (Wounanet / Chat interactif / Vitrine premium)
        │  HTTPS (Cloudflare) → 127.0.0.1:4000
Server ─ backend/app.py + core/orchestrateur.py   (orchestrateur 1)
        │
BIP ──── core/bip.py + core/modules/              (intention, identité, scan des MODULES → filtres)
        │
Matrice ─ core/matrice.py                         (Bo'oivini : raisonnement comparatif / dialectique / herméneutique)
   ┌────┴─────┐
Wounanet   Mémoire continue
services/wounanet.py   core/memoire.py
   └────┬─────┘
Narration ─ core/narration.py                     (niveaux factuel / enrichi / stratégique)
        │
Interface web (réponse dans la vitrine concernée)
```

| Vitrine | Accès | Point d'entrée |
|---|---|---|
| Chat interactif | public, gratuit, **sans quota** (garde anti-rafale seule : 30 requêtes / 10 s / client, `CHAT_ANTIFLOOD`) | `POST /api/chat` |
| Wounanet | fil des dépêches **public** ; recherche et synthèse : **compte requis** | `GET /api/wounanet/actualites`, `POST /api/wounanet/rechercher` |
| Premium (boutique + studio SDK) | catalogue public ; demandes = compte ; studio = **rôle premium** | `/api/premium/*` |

Le **BIP** détecte l'intention et signale les filtres (modules : identité, philosophie africaine, rigueur factuelle, prudence sensible, développeur) ; la **Matrice** les applique, appelle **Wounanet** quand c'est utile, puis la **Narration** met en forme. La vitrine est fixée **côté serveur** par la route, jamais par le corps de la requête.

## Installation sur Termux

```bash
# 1. Récupérer le projet (archive ou git), puis :
cd peginti
./setup_termux.sh                       # paquets, venv, .env avec poivre aléatoire, tests

nano .env                               # GEMINI_API_KEY, NEWSDATA_API_KEY (facultatif), SMTP_* (facultatif)

. .venv/bin/activate
python manage.py creer-admin vous@exemple.com VotrePseudo    # votre compte administrateur

# 2. Tunnel Cloudflare : suivre deploy/CLOUDFLARE.md (une seule fois)
./lancer.sh                             # serveur + tunnel dans tmux  |  ./arreter.sh pour stopper
curl https://www.pegintichat.online/api/sante
```

Administration (`python manage.py …`) : `purger` (audit > 12 mois, sessions et jetons expirés), `lister`, `role <email> premium|admin|gratuit`, `commandes`, `valider-commande <id>` (accorde le premium), `debloquer`, `desactiver`, `verifier`, `produit`, `audit`.

## Sécurité mise en place

**Comptes**
- Mots de passe : **scrypt** (sel unique) + **poivre** serveur hors base ; politique : 12 caractères minimum, 3 types de caractères, pas de mot courant, ni e-mail ni pseudo.
- Connexion : limitation de débit par IP et par compte, **verrouillage progressif** (5 échecs → 15 min, puis 30, 60… max 24 h), messages identiques que le compte existe ou non, temps de calcul égalisé (anti-énumération).
- **Double authentification TOTP** (RFC 6238, rejeu bloqué), secret chiffré au repos.
- Réinitialisation par lien à usage unique (1 h) ; elle ferme toutes les sessions. Changement de mot de passe : ferme les autres sessions.
- Sessions serveur : jeton aléatoire, **seul le hash est stocké**, expiration 7 jours / inactivité 12 h, nouveau jeton à chaque connexion, liste et fermeture des sessions.
- Suppression de compte avec effacement en cascade (historique inclus).

**Application**
- Cookie `__Host-peginti_session` : `HttpOnly`, `Secure`, `SameSite=Lax`.
- Anti-CSRF : vérification de l'`Origin` + jeton `X-CSRF-Token` lié à la session.
- **CSP stricte** (aucun script ni style inline), HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy: no-referrer`, `Cache-Control: no-store` sur l'API.
- Pas de CORS ouvert (l'ancien `cors()` autorisait tout le monde) ; corps de requête limité à 128 Ko ; erreurs sans détail technique.
- Serveur lié à `127.0.0.1` : seul le tunnel Cloudflare est exposé. `CF-Connecting-IP` n'est cru que s'il vient du tunnel local.
- Rendu côté navigateur uniquement par `textContent` (pas de `innerHTML`) : pas de XSS via les réponses de l'IA ou les flux d'actualités ; liens limités à `http(s)`.
- Les contenus externes (dépêches, historique) sont transmis au modèle comme **données non fiables** (défense contre l'injection de prompt). Clé Gemini envoyée en en-tête, jamais dans l'URL ni les journaux.

## Ce qui a changé par rapport à l'ancienne version (et pourquoi)

- Plus de **fausses données** : les indicateurs « 99.9 % / 184 flux » et les « dépêches en direct » écrites en dur sont supprimés. Sans moteur ou sans source, la plateforme **le dit** au lieu d'inventer une analyse.
- `/api/sante` ne divulgue plus l'état de la mémoire.
- Un seul dépôt, un seul langage backend, plus de mélange `require`/`import`.

## Limites connues (à traiter ensuite)

- **Paiement** : les demandes premium sont enregistrées et validées à la main (`manage.py valider-commande`) ; aucune passerelle de paiement n'est branchée.
- **E-mails** : sans `SMTP_HOST`, les liens (vérification, mot de passe oublié) sont écrits dans les journaux du serveur — pratique en démarrage, à remplacer par un SMTP en production.
- **Limiteur de débit en mémoire** : remis à zéro au redémarrage et valable pour un seul processus ; le verrouillage de compte, lui, est persistant. Complétez avec une règle de rate limiting Cloudflare sur `/api/auth/*`.
- **Sauvegardes** : copiez régulièrement `data/peginti.db` (et `.env`, séparément et en lieu sûr — perdre `PEGINTI_PEPPER` rend les mots de passe inutilisables).
- Le **studio SDK** est pour l'instant un assistant conversationnel premium ; la génération/déploiement automatique d'applications est une étape suivante.

## Tests

```bash
python -m unittest discover -s tests -v     # 33 tests : sécurité des comptes, CSRF, 2FA, pipeline…
```

## v4.1 — équipe, 2FA obligatoire, boutique, installateur
- **Rôles** : gratuit, premium, technique, admin, superadmin (matrice dans `backend/permissions.py`). Seul le superadmin voit l'activité de toutes les chaînes, gère l'équipe, les prix, le catalogue, les logiciels et les instructions de paiement.
- **2FA par application** obligatoire pour l'équipe et toute adresse `@tomtech.inc` (`PEGINTI_DOMAINE_EQUIPE`), proposée aux autres ; codes de secours ; actions sensibles = code 2FA frais.
- **Compte fondateur** : `python manage.py creer-superadmin EMAIL PSEUDO` (terminal uniquement). Perte de 2FA : `manage.py reinit-2fa EMAIL`.
- **Console** : `/admin` (onglets selon permissions). **Boutique** : `/premium` (catalogue, panier, commande, historique, téléchargements). Paiement non automatisé : validation manuelle des commandes.
- **PWA** : installable Android/PC, navigation basse sur mobile. **Zip « Peginti IA 237 »** : voir LISEZMOI.txt.
