/**
 * LOADER INTERNE BO'OIVINI
 * Chargement automatique de toute la police privée, filtres, matrices et règles ULTRA.
 * Strictement interne. Non documenté. Non exposé.
 */

const matriceInterne = require('./matrice-interne');
const filtresPrives = require('../logique/filtres-prives');
const comportementNoyau = require('../preferences/comportement-noyau.json');
const reglesUltra = require('../systeme/regles-ultra');
const traductionConceptuelle = require('../systeme/traduction-conceptuelle');

module.exports = {
  charger() {
    return {
      matriceInterne,
      filtresPrives,
      comportementNoyau,
      reglesUltra,
      traductionConceptuelle
    };
  }
};
