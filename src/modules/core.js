'use strict';

module.exports = {
  analyse: (data, context = {}) => {
    const { question } = data;
    return {
      module: 'CORE',
      type: 'identite_peginti',
      question_originale: question,
      presentation: "PEGINTI est une plateforme IA modulaire d'apprentissage et de décision stratégique.",
      piliers: [
        'Plateforme modulaire (BIP, STRAT, LEA, ...)',
        'Détection intelligente de domaine',
        'Supervision PM2 éternelle',
        'GitHub pegintiiaultra/Pegintichat',
        "Architecture BO'OIVINI 🇨🇲"
      ],
      contexte: context,
      version: "v2.0"
    };
  }
};
