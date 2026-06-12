'use strict';

function normaliser(texte) {
  return String(texte || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function detecterIntention(question) {
  const q = normaliser(question);

  if (!q) {
    return { type: 'general', sousType: 'vide', confiance: 0.1 };
  }

  const regles = [
    { type: 'procedure', mots: /(comment|etapes|procedure|mode d'emploi|faire)/, confiance: 0.92 },
    { type: 'analyse', mots: /(pourquoi|cause|raison|analyse|explique)/, confiance: 0.9 },
    { type: 'comparaison', mots: /(compare|difference|vs|contre|comparaison)/, confiance: 0.9 },
    { type: 'definition', mots: /(defini|definition|c'est quoi|qu'est ce que)/, confiance: 0.88 },
    { type: 'synthese', mots: /(resume|resumer|synthese|bref)/, confiance: 0.86 },
    { type: 'conseil', mots: /(avis|conseil|recommande|meilleur|choisir)/, confiance: 0.84 },
    { type: 'salutation', mots: /^(bonjour|bonsoir|salut|hello|hey)\b/, confiance: 0.99 },
    { type: 'politique', mots: /(pays|gouvernement|president|election|etat|politique)/, confiance: 0.7 }
  ];

  const regle = regles.find(r => r.mots.test(q));
  if (regle) {
    return { type: regle.type, sousType: regle.type, confiance: regle.confiance };
  }

  return { type: 'general', sousType: 'general', confiance: 0.5 };
}

module.exports = { detecterIntention, normaliser };
