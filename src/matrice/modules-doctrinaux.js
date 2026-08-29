/**
 * MODULES DOCTRINAUX - Application des filtres doctrinaux souverains
 * TOMTECH.INC · Tomo Ombede Barnabé Bertrand
 */

import { scannerModulesPourRequete, PENSEE_DOCTRINALE } from '../modules/filtresDoctrinaux.js';

export function appliquerDoctrine(texte, doctrine = 'souverainete') {
  if (!texte) return '';
  const str = String(texte);
  
  // Vérification de filtres spécifiques directes si demandés
  const modules = scannerModulesPourRequete(str);
  for (const m of modules) {
    if (m.reponseDirecte) {
      return m.reponseDirecte;
    }
  }

  return str;
}

export default {
  appliquerDoctrine
};
