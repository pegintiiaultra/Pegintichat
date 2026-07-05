'use strict';

const fs = require('fs');
const path = require('path');

const MEMOIRE_FILE = path.join(__dirname, '..', 'data', 'memoire.json');
const MODULES_DIR = path.join(__dirname, '..', 'plugins');

function lireJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function normaliserMemoire(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

function chargerModule(filePath) {
  try {
    const resolved = require.resolve(filePath);
    delete require.cache[resolved];
    return require(resolved);
  } catch {
    return null;
  }
}

function scannerModules() {
  const hits = [];
  if (!fs.existsSync(MODULES_DIR)) return hits;

  const files = fs.readdirSync(MODULES_DIR).filter(f => f.endsWith('.js'));

  for (const file of files) {
    const filePath = path.join(MODULES_DIR, file);
    const contenu = chargerModule(filePath);

    hits.push({
      nom: path.basename(file, '.js'),
      file,
      contenu
    });
  }

  return hits;
}

function scannerMemoire(intention) {
  const data = lireJson(MEMOIRE_FILE, { version: 1, updatedAt: null, items: [] });
  const memoire = normaliserMemoire(data);
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
  const modules = scannerModules();
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
      ? `Modules: ${modules.length} chargé(s)`
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
