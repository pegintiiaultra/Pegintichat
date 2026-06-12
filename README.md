# PEGINTI IA Plateforme

PEGINTI IA Plateforme est une innovation technologique de **tomtech.inc**, exposée via **Cloudflare Tunnel**, et conçue pour fournir des réponses intelligentes à partir de données fraîches récupérées en temps réel par **Wounanet**, le moteur de recherche Peginti.

## Description

PEGINTI IA Plateforme combine :
- un serveur Node.js/Express.
- un moteur de recherche temps réel appelé **Wounanet**.
- des modules doctrinaux pour filtrer, structurer et orienter les réponses.
- une mémoire locale pour conserver les sujets déjà traités.
- un tunnel Cloudflare actif pour l’accès sécurisé au service.

L’objectif est de produire un assistant conversationnel capable d’analyser des requêtes utilisateur à partir de données en ligne actualisées, tout en appliquant une logique interne souveraine et contrôlée.

## Fonctionnalités

- Recherche web en temps réel via Wounanet.
- Réponses générées à partir d’actualités fraîches.
- Mémoire des requêtes déjà traitées.
- Filtres doctrinaux internes.
- Exposition du service via Cloudflare Tunnel.
- API simple pour le chat et l’analyse.

## Architecture

- `src/server.js` : point d’entrée principal du serveur.
- `services/wounanet.js` : moteur de recherche externe.
- `modules/analyse.js` : analyse initiale du sujet.
- `modules/doctrine.js` : filtrage doctrinal.
- `modules/projection.js` : évaluation ou projection du contenu.
- `modules/synthese.js` : synthèse finale.
- `modules/peginti.js` : règles doctrinales souveraines.
- `data/` : mémoire, doctrine et état du service.
- `public/` : interface web.

## Prérequis

- Node.js 18+.
- npm.
- Un tunnel Cloudflare configuré.
- Variables d’environnement dans un fichier `.env` si nécessaire.

## Installation

```bash
git clone https://github.com/votre-compte/peginti-ia-platforme.git
cd PEGINTICHAT
npm install
