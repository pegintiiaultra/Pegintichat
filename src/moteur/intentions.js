'use strict';

const intentions = {
  generaliste: { mode: 'generaliste', priorite: 1 },
  doctrinale: { mode: 'doctrinale', priorite: 10 },
  souverainete: { mode: 'souverainete', priorite: 9 },
  coherence_sociale: { mode: 'coherence_sociale', priorite: 8 },
  identite_culturelle: { mode: 'identite_culturelle', priorite: 8 },
  spirituel: { mode: 'spirituel', priorite: 7 },
  sensible: { mode: 'sensible', priorite: 10 }
};

function choisirIntention(categorie) {
  return intentions[categorie] || intentions.generaliste;
}

module.exports = {
  intentions,
  choisirIntention
};
