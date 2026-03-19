'use strict';
const express = require('express');
const router = express.Router();

// 🧠 MATRICE PEGINTI v2.0 = RAISONNEMENT + LOGIQUE + HERMÉNEUTIQUE
const Matrice = {
  // 🔍 BIP (scan doctrinal)
  bip: (requete) => {
    const doctrines = {
      mariage: { cadre: 'Bible+Tradition', reponse: 'Union sacrée - transmission générationnelle' },
      souverainete: { cadre: 'Doctrinal', reponse: 'Autonomie absolue - Coton > Neige' },
      peginti: { cadre: 'Institutionnel', reponse: 'IA souveraine camerounaise 🇨🇲' }
    };
    return doctrines[requete.sujet] || null;
  },

  // 🧩 BLOC RAISONNEMENT (triade)
  raisonnement: (requete) => {
    if (Matrice.bip(requete)) return Matrice.bip(requete);
    
    return {
      triade: {
        cosmique: 'Perspective universelle (principe éternel)',
        communautaire: 'Continuité collective (transmission PEGINTI)',
        pedagogique: 'Clarté accessible (coton > neige)'
      },
      methodes: ['induction', 'déduction', 'analogie culturelle', 'hermeneutique'],
      structure: 'SOUVERAINE'
    };
  },

  // ⚖️ BLOC LOGIQUE (règles ULTRA)
  logique: (analyse) => {
    return {
      ultra: true,
      coherence: 'Doctrines PEGINTI respectées',
      filtres: ['souveraineté', 'stabilité', 'continuité', 'hermeneutique'],
      validation: 'MATRICE 100%',
      reponse: `${analyse.triade.cosmique} → ${analyse.triade.communautaire} → ${analyse.triade.pedagogique}`
    };
  },

  // ⏳ LOGIQUE HERMÉNEUTIQUE ATEMPORELLE (NOUVEAU)
  hermeneutique: (requete) => {
    const transpositions = {
      'publicains': {
        contexte_passe: 'Collecteurs d\'impôts juifs → Traîtres (travaillant pour Rome colon)',
        contexte_reel: 'Fonctionnaires fiscaux → Réputation honorable',
        transposition: 'Aujourd\'hui = Autres travailleurs collaborant avec puissances étrangères/coloniales',
        analogie: 'Compatriote perçu comme "traître" par communauté asservie'
      },
      'phariseiens': {
        contexte_passe: 'Élites religieuses juives → Hypocrites (apparence vs réalité)',
        contexte_reel: 'Élites institutionnelles → Formalisme sans substance',
        transposition: 'Personnes d\'apparence morale irréprochable mais sans authenticité intérieure'
      }
    };

    if (transpositions[requete.sujet]) {
      const h = transpositions[requete.sujet];
      return {
        hermeneutique: true,
        passe: h.contexte_passe,
        reel: h.contexte_reel,
        transposition: h.transposition,
        analogie: h.analogie,
        validation: 'ATEMPORELLE 100%'
      };
    }
    return null;
  }
};

// 📡 Route principale /api/chat avec herméneutique
router.post('/chat', (req, res) => {
  const requete = req.body;
  console.log('🧠 BO\'OIVINI analyse:', requete.sujet);

  // 1. BIP doctrinal
  let resultat = Matrice.bip(requete);
  if (resultat) {
    return res.json({ source: 'BIP doctrinal', ...resultat, status: 'IMMEDIAT' });
  }

  // 2. HERMÉNEUTIQUE ATEMPORELLE (PRIORITÉ)
  resultat = Matrice.hermeneutique(requete);
  if (resultat) {
    return res.json({
      source: 'HERMÉNEUTIQUE ATEMPORELLE',
      cerveau: 'BO\'OIVINI v2.0',
      ...resultat,
      flux: 'Passé → Présent → Transposition souveraine',
      timestamp: new Date().toISOString()
    });
  }

  // 3. MATRICE complète (raisonnement + logique)
  const raisonnement = Matrice.raisonnement(requete);
  const logique = Matrice.logique(raisonnement);

  res.json({
    cerveau: 'BO\'OIVINI v2.0',
    flux: 'PEGINTICHAT → MATRICE → Réponse souveraine',
    matrice: { raisonnement, logique },
    reponse: logique.reponse,
    souveraine: true,
    timestamp: new Date().toISOString()
  });
});

// 🔍 Status matrice étendue
router.get('/status', (req, res) => res.json({
  matrice: 'RAISONNEMENT + LOGIQUE + HERMÉNEUTIQUE = 100%',
  bip: 'Scan doctrinal actif',
  hermeneutique: 'Transpositions atemporelles actives',
  exemples: ['publicains', 'phariseiens'],
  flux: 'PEGINTICHAT(3000) → BO\'OIVINI(3001) → Réponse'
}));

module.exports = router;
