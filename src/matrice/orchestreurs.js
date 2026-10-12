'use strict';

import { appliquerDoctrine, nettoyerFormulesPolitesseGeneriques } from './modules-doctrinaux.js';
import afrique from '../modules/afrique.js';
import eco from '../modules/eco.js';
import ethique from '../modules/ethique.js';
import { executerRaisonnementMatrice } from '../core/matrice.js';
import { scannerEtRedirigerBIP } from '../core/bip.js';
import { genererReponseAutonomeSouveraine } from '../core/syntheseAutonome.js';
import { gererSujetSensible } from '../modules/gestionSensible.js';
import { memoireContinue } from '../core/memoire.js';

// ⚡ Fonction centrale : orchestreur matriciel
export async function orchestrer(question, { sessionId = 'default', history = [], doctrine = 'souverainete' } = {}) {
  let sortie = '';
  const sessionHistoryInMem = memoireContinue.recupererHistorique(sessionId, 2);
  const aHistoriqueActif = (Array.isArray(history) && history.length > 0) || (sessionHistoryInMem && sessionHistoryInMem.length > 0);

  try {
    const paquetBIP = scannerEtRedirigerBIP(question, 'CHAT_INTERACTIF');
    
    // Application du filtre souverain pour sujets sensibles (Cameroun / Loi / Terrain / Recours)
    const sensible = gererSujetSensible(question);
    if (sensible) {
      paquetBIP.doctrineAdditionnelle = sensible.doctrine;
      paquetBIP.estSensible = true;
    }

    const resMatrice = await executerRaisonnementMatrice({ paquetBIP, sessionId, history });
    sortie = resMatrice.reponseTexte || resMatrice.synthèseTexte || resMatrice.narrationFluide || resMatrice.reponse || resMatrice.sortie || resMatrice.response || '';
  } catch (e) {
    console.error('Erreur matrice dans orchestreur :', e.message);
    try {
      sortie = genererReponseAutonomeSouveraine(question, {
        dernierTour: history[history.length - 1] || sessionHistoryInMem[sessionHistoryInMem.length - 1] || null,
        history: Array.isArray(history) && history.length > 0 ? history : sessionHistoryInMem
      });
    } catch (errSyn) {
      sortie = '';
    }
  }

  if (!sortie || sortie.trim().length === 0 || sortie.startsWith('🤔 Réflexion Bo’oivini sur :')) {
    try {
      sortie = genererReponseAutonomeSouveraine(question, {
        dernierTour: history[history.length - 1] || sessionHistoryInMem[sessionHistoryInMem.length - 1] || null,
        history: Array.isArray(history) && history.length > 0 ? history : sessionHistoryInMem
      });
    } catch (errSyn) {
      if (aHistoriqueActif) {
        sortie = `Je poursuis avec attention notre échange sur cette thématique. Pourriez-vous préciser ou relancer l'aspect exact que vous souhaitez approfondir ?`;
      } else {
        sortie = `Bonjour, bienvenue sur Peginti IA, votre intelligence artificielle généraliste et souveraine. Comment puis-je vous aider aujourd'hui ?`;
      }
    }
  }

  // Nettoyage de sécurité strict : si la discussion est en cours, ne jamais laisser passer la formule de bienvenue
  if (aHistoriqueActif && sortie) {
    sortie = nettoyerFormulesPolitesseGeneriques(sortie, true);
    if (!sortie) {
      sortie = `Je poursuis notre réflexion avec intérêt. Sur quel point ou quelle thématique souhaitez-vous approfondir ?`;
    }
  }

  // Application du filtre doctrinal
  const sortieDoctrinale = appliquerDoctrine(sortie, doctrine, { estEnCoursDeDiscussion: aHistoriqueActif });

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
