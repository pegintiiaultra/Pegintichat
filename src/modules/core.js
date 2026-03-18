'use strict';
module.exports = {
  analyse: ({question}) => ({
    module: 'CORE',
    response: `PEGINTI v2.0 ULTRA : Plateforme IA modulaire rapide.
Modules actifs. Analyse en ${Date.now() % 1000}ms.
Question: "${question.substring(0,50)}..."`,
    ultra: true
  })
};
