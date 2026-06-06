'use strict';

function normaliser(texte) {
  return String(texte || '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function interpreterSujet(sujet) {
  const q = normaliser(sujet);

  if (q.includes('religion')) return 'spirituel';
  if (q.includes('homosexualite')) return 'sensible';
  if (q.includes('identite africaine')) return 'identite_culturelle';
  if (q.includes('souverainete') || q.includes('colonialisme numerique')) return 'souverainete';
  if (q.includes('paix') || q.includes('cohesion')) return 'coherence_sociale';

  return 'generaliste';
}

module.exports = {
  interpreterSujet,
  normaliser
};
