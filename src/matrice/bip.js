'use strict';

const fs = require('fs');
const path = require('path');

const MEMOIRE_FILE = path.join(__dirname, '..', 'data', 'memoire.json');
const MODULES_DIR = path.join(__dirname, '..', 'plugins');

function lireJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function scannerModules(intention) {
  const sujet = String(intention?.sujet || intention?.original || '').toLowerCase();
  const hits = [];

  const map = [
    { key: 'afrique', file: 'afrique.js' },
    { key: 'identite', file: 'identite.js' },
    { key: 'paix', file: 'paix.js' },
    { key: 'peginti', file: 'peginti.js' },
    { key: 'religion', file: 'religion.js' },
    { key: 'souverainete', file: 'souverainete.js' },
    { key: 'vision', file: 'vision.js' }
  ];

  for (const mod of map) {
    if (sujet.includes(mod.key)) {
      const filePath = path.join(MODULES_DIR, mod.file);
      let contenu = null;

      try {
        delete require.cache[require.resolve(filePath)];
        contenu = require(filePath);
      } catch {
        contenu = null;
      }

      hits.push({ ...mod, contenu });
    }
  }

  return hits;
}

function scannerMemoire(intention) {
  const memoire = lireJson(MEMOIRE_FILE, []);
  const sujet = String(intention?.sujet || intention?.original || '').toLowerCase();

  const matches = memoire.filter(entry => {
    const text = JSON.stringify(entry || {}).toLowerCase();
    return sujet && text.includes(sujet);
  });

  return {
    total: memoire.length,
    matches,
    resume: matches.length
      ? `Mémoire: ${matches.length} correspondance(s)`
      : 'Mémoire: aucune correspondance'
  };
}

async function collecteWounanet(sujet) {
  const texte = String(sujet || '').trim();

  return {
    source: 'wounanet',
    sujet: texte,
    resume: texte ? `Recherche Wounanet sur: ${texte}` : 'Recherche Wounanet vide',
    details: []
  };
}

async function rechercher(intention) {
  const modules = scannerModules(intention);
  const memoire = scannerMemoire(intention);
  const sujet = String(intention?.sujet || intention?.original || '').trim();

  let wounanet = null;

  if (!modules.length && !memoire.matches.length) {
    wounanet = await collecteWounanet(sujet);
  }

  return {
    modules,
    memoire,
    wounanet,
    resume: modules.length
      ? `Modules: ${modules.length} trouvé(s)`
      : memoire.matches.length
        ? memoire.resume
        : (wounanet?.resume || 'Aucune donnée utile')
  };
}

module.exports = {
  scannerModules,
  scannerMemoire,
  collecteWounanet,
  rechercher
};
