/**
 * MOTEUR INTENTIONS ULTRA - PEGINTI IA
 * Conçu par Tomo Ombede Barnabé Bertrand (TOMTECH.INC)
 */

export const intentions = {
  generaliste: { mode: 'generaliste', priorite: 1 },
  doctrinale: { mode: 'doctrinale', priorite: 10 },
  souverainete: { mode: 'souverainete', priorite: 9 },
  coherence_sociale: { mode: 'coherence_sociale', priorite: 8 },
  identite_culturelle: { mode: 'identite_culturelle', priorite: 8 },
  spirituel: { mode: 'spirituel', priorite: 7 },
  sensible: { mode: 'sensible', priorite: 10 }
};

export function choisirIntention(categorie) {
  return intentions[categorie] || intentions.generaliste;
}

export function classifierIntention(texte) {
  const t = String(texte || '').toLowerCase();
  if (t.includes('code') || t.includes('script') || t.includes('fonction') || t.includes('bug')) {
    return 'INGENIERIE_LOGICIELLE';
  }
  if (t.includes('actualité') || t.includes('guerre') || t.includes('nouvelle') || t.includes('wounanet')) {
    return 'VEILLE_STRATEGIQUE';
  }
  if (t.includes('qui es tu') || t.includes('identite') || t.includes('peginti')) {
    return 'IDENTITE_SOUVERAINE';
  }
  return 'REFLEXION_GENERALE';
}

export default {
  intentions,
  choisirIntention,
  classifierIntention
};
