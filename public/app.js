'use strict';

// 🎨 Style PEGINTI v3 : affichage clair et dynamique
function displayResult(result) {
  const output = document.getElementById('output');
  output.innerHTML = '';

  if (!result || !result.text) {
    output.innerHTML = '<div class="error">❌ Erreur WOUNANET</div>';
    return;
  }

  // Formatage des articles
  const lines = result.text.split('\n').filter(l => l.trim() !== '');
  lines.forEach(line => {
    if (line.startsWith('-')) {
      const item = document.createElement('div');
      item.className = 'article';
      item.innerHTML = line
        .replace('-', '📰')
        .replace(/🔗 (https?:\/\/\S+)/, '<a href="$1" target="_blank">🔗 lien</a>');
      output.appendChild(item);
    }
  });
}

// 🔄 Test du serveur
async function runPing() {
  try {
    const res = await fetch('/ping');
    const data = await res.json();
    displayResult({ text: JSON.stringify(data, null, 2) });
  } catch (err) {
    displayResult({ text: '❌ Erreur serveur' });
  }
}

// 🌍 Appel WOUNANET
async function runWounanet() {
  const sujet = document.getElementById('sujet').value || 'innovation';
  try {
    const res = await fetch(`/api/wounanet?sujet=${encodeURIComponent(sujet)}`);
    const data = await res.json();
    displayResult(data);
  } catch (err) {
    displayResult({ text: '❌ Erreur WOUNANET' });
  }
}

// 🎛️ Attache les boutons
document.getElementById('pingBtn').addEventListener('click', runPing);
document.getElementById('wounanetBtn').addEventListener('click', runWounanet);
