'use strict';

import { appliquerDoctrine } from './modules-doctrinaux.js';
import afrique from '../modules/afrique.js';
import eco from '../modules/eco.js';
import ethique from '../modules/ethique.js';
import { executerRaisonnementMatrice } from '../core/matrice.js';
import { scannerEtRedirigerBIP } from '../core/bip.js';
import { genererReponseAutonomeSouveraine } from '../core/syntheseAutonome.js';
import { gererSujetSensible } from '../modules/gestionSensible.js';

// ⚡ Fonction centrale : orchestreur matriciel
export async function orchestrer(question, { sessionId = 'default', history = [], doctrine = 'souverainete' } = {}) {
  let sortie = '';
  try {
    const paquetBIP = scannerEtRedirigerBIP(question, 'CHAT_INTERACTIF');
    
    // Application du filtre souverain pour sujets sensibles (Cameroun / Loi / Terrain / Recours)
    const sensible = gererSujetSensible(question);
    if (sensible) {
      paquetBIP.doctrineAdditionnelle = sensible.doctrine;
      paquetBIP.estSensible = true;
    }

    const resMatrice = await executerRaisonnementMatrice({ paquetBIP, sessionId, history });
    sortie = resMatrice.reponse || resMatrice.sortie || resMatrice.response || '';
  } catch (e) {
    console.error('Erreur matrice dans orchestreur :', e.message);
    try {
      sortie = genererReponseAutonomeSouveraine(question, {});
    } catch (errSyn) {
      sortie = '';
    }
  }

  if (!sortie || sortie.trim().length === 0 || sortie.startsWith('🤔 Réflexion Bo’oivini sur :')) {
    try {
      sortie = genererReponseAutonomeSouveraine(question, {});
    } catch (errSyn) {
      sortie = `bonjour, bienvenue sur Peginti IA, votre intelligence artificielle généraliste et souveraine. Comment puis-je vous éclairer aujourd'hui ?`;
    }
  }

  // Application du filtre doctrinal
  const sortieDoctrinale = appliquerDoctrine(sortie, doctrine);

  // Identité PEGINTI IA
  const identite = {
    nom: "PEGINTI IA",
    origine: "Cameroun",
    signification: "La toute sagesse (langue Beti)",
    auteur: "Tomo Ombede Barnabé Bertrand (TOMTECH.INC)",
    modules: [afrique.nom, eco.nom, ethique.nom]
  };

  // Narration stratégique
  const narration = `📜 Narration stratégique : ${sortieDoctrinale}`;

  return {
    identite,
    sortie: sortieDoctrinale,
    narration,
    response: sortieDoctrinale,
    reponse: sortieDoctrinale,
    success: true
  };
}

export default { orchestrer };
