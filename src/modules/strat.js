'use strict';
module.exports = {
  analyse: ({question}, {user_view = 'institutionnelle 🇨🇲'}) => ({
    module: 'STRAT',
    response: `🎯 STRATÉGIE ULTRA RAPIDE
1️⃣ Objectif: "${question.substring(0,30)}..."
2️⃣ Action: Modularité + BO'OIVINI
3️⃣ Vision: ${user_view}
⚡ Exécuter maintenant`,
    ultra: true
  })
};
