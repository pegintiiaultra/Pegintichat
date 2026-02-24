#!/bin/bash

echo "🚀 PEGINTI DEPLOY — Initialisation"

# 1. Assurer la présence des modules
mkdir -p modules/bip
mkdir -p modules/mirap

# 2. Installer BIP si présent dans ~/peginti_modules
if [ -f ~/peginti_modules/matrice_bip.sh ]; then
    cp ~/peginti_modules/matrice_bip.sh modules/bip/bip.sh
    echo "📦 Module BIP synchronisé"
else
    echo "⚠️ Aucun module BIP trouvé dans ~/peginti_modules"
fi

# 3. Vérifier MIRAP
if [ -d modules/mirap ]; then
    echo "📦 Module MIRAP détecté"
else
    echo "⚠️ Module MIRAP manquant"
fi

# 4. Ajouter à Git
git add modules/bip modules/mirap

# 5. Commit premium PEGINTI
git commit -m "Déploiement PEGINTI : synchronisation BIP + MIRAP (v1.0) — Architecture doctrinale harmonisée"

# 6. Push vers GitHub
git push

# 7. Reload PM2 proprement
pm2 reload pegintichat --update-env

echo "🎉 Déploiement PEGINTI terminé avec succès"
