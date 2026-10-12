/**
 * BIP - SCANNER ET REDIRECTION (PEGINTI IA)
 * Conçu par Tomo Ombede Barnabé Bertrand (TOMTECH.INC)
 * 
 * Rôles clés :
 * 1. Détecte l’intention de la requête.
 * 2. Interprète le besoin et l’identité.
 * 3. Scanne les MODULES (et non la matrice) pour signaler automatiquement
 *    quel filtre doctrinal ou logique doit s’appliquer.
 * 4. Redirige le paquet contextualisé vers la MATRICE (cerveau Bo’oivini).
 */

import { scannerModulesPourRequete, PENSEE_DOCTRINALE } from '../modules/filtresDoctrinaux.js';

export function scannerEtRedirigerBIP(requeteBrute, vitrineEmettrice = 'CHAT_INTERACTIF', options = {}) {
  const texte = String(requeteBrute || '').trim();
  const texteNorm = texte.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 1. Détection de l'intention avec sensibilité au contexte conversationnel
  let intention = "CONVERSATION_GENERALE";
  let typeBesoin = "EXPLICATION";
  let besoinWounanet = false;

  const hasHistory = (Array.isArray(options.history) && options.history.length > 0) || 
                     (options.sessionId && options.sessionId !== 'default');

  const isExplicitFollowUp = texteNorm.includes('precedent') || 
                             texteNorm.includes('question precedente') || 
                             texteNorm.includes('plus concret') || 
                             texteNorm.includes('pas concret') || 
                             texteNorm.includes('tu disais') || 
                             texteNorm.includes('au sujet de') ||
                             texteNorm.startsWith("c'est vrai") ||
                             texteNorm.startsWith("en effet") ||
                             texteNorm.startsWith("d'accord") ||
                             texteNorm.startsWith("exactement") ||
                             texteNorm.startsWith("mais encore") ||
                             (texteNorm.length < 50 && (texteNorm.startsWith('pourquoi') || texteNorm.startsWith('et pour') || texteNorm.startsWith('comment') || texteNorm.startsWith('que penses-tu')));

  const isFollowUp = hasHistory || isExplicitFollowUp;

  if (vitrineEmettrice === 'WOUNANET' || (!isFollowUp && (
    texteNorm.includes('depeche') || 
    texteNorm.includes('wounanet') || 
    texteNorm.includes('iviok') ||
    texteNorm.includes('actualite') || 
    texteNorm.includes('actualité') || 
    texteNorm.includes('derniere heure') || 
    texteNorm.includes('dernière heure') || 
    texteNorm.includes('fil info') || 
    texteNorm.includes('revue de presse') ||
    texteNorm.includes('reseaux sociaux') ||
    texteNorm.includes('réseaux sociaux') ||
    texteNorm.includes('tiktok') ||
    texteNorm.includes('twitter') ||
    texteNorm.includes('facebook') ||
    texteNorm.includes('instagram')
  ))) {
    intention = "RECHERCHE_STRATEGIQUE_ACTUALITE";
    typeBesoin = "ANALYSE_GEOPOLITIQUE_TEMPS_REEL";
    besoinWounanet = true;
  } else if (vitrineEmettrice === 'VITRINE_PREMIUM' || (!isFollowUp && (texteNorm.includes('prix') || (texteNorm.includes('code source') && !isFollowUp) || texteNorm.includes('dsk') || texteNorm.includes('acheter') || texteNorm.includes('momo') || texteNorm.includes('licence')))) {
    intention = "EXPERTISE_PREMIUM_OU_CODE";
    typeBesoin = "DEVELOPPEMENT_OU_TRANSACTION";
  } else if (!isFollowUp && (texteNorm.includes('qui es tu') || texteNorm.includes('concepteur') || texteNorm.includes('tomo') || texteNorm.includes('tomtech') || texteNorm.includes('qui a cree'))) {
    intention = "IDENTITE_DOCTRINALE";
    typeBesoin = "ATTRIBUTION_SOUVERAINE";
  } else if (!isFollowUp && (texteNorm.includes('techno-eecoc') || texteNorm.includes('frugal') || texteNorm.includes('calcul matriciel'))) {
    intention = "ALGORITHME_TECHNO_EECOC";
    typeBesoin = "INGENIERIE_FRUGALE";
  } else if (isFollowUp) {
    intention = "SUIVI_CONVERSATIONNEL_CONTINU";
    typeBesoin = "APPROFONDISSEMENT_CONTEXTUEL";
  }

  // 2. Scan des MODULES (⚠️ pas la matrice) pour identifier les filtres doctrinaux/logiques
  const modulesScannes = scannerModulesPourRequete(texte);

  // 3. Paquet de redirection vers la MATRICE (Bo'oivini)
  const paquetMatrice = {
    bipId: `BIP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    vitrineEmettrice,
    requeteOriginale: texte,
    analyseIntention: {
      intention,
      typeBesoin,
      prioriteWounanet: besoinWounanet || vitrineEmettrice === 'WOUNANET',
      axeDoctrinal: PENSEE_DOCTRINALE.axiomeCentral
    },
    modulesSignales: modulesScannes,
    filtresActifs: modulesScannes.map(m => m.filtreApplique),
    reglesSignalees: modulesScannes.map(m => m.regleActive),
    redirection: "MATRICE_BOOIVINI"
  };

  return paquetMatrice;
}

export function traiterScannerBIP(options = {}) {
  const message = options.message || options.requete || '';
  const vitrine = options.vitrine || 'CHAT_INTERACTIF';
  return scannerEtRedirigerBIP(message, vitrine, options);
}

export default {
  scannerEtRedirigerBIP,
  traiterScannerBIP
};

