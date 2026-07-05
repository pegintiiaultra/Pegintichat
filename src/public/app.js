const responseDiv = document.getElementById('response');
const wounanetResponse = document.getElementById('wounanetResponse');
const chatOverlay = document.getElementById('chatOverlay');
const chatFeed = document.getElementById('chatFeed');

function escapeHTML(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderResponse(data) {
  // Fallback si le backend renvoie une chaîne brute
  if (typeof data === 'string') {
    return `<div class="answer">${escapeHTML(data)}</div>`;
  }

  const reponse = data.narration?.reponse || data.texte || '';
  const developpement = data.narration?.developpement || '';
  const conclusion = data.narration?.conclusion || '';

  return `
    <div class="answer">${escapeHTML(reponse)}</div>
    <div class="develop">${escapeHTML(developpement)}</div>
    <div class="conclusion">${escapeHTML(conclusion)}</div>
  `;
}

function addToFeed(question, data) {
  chatFeed.insertAdjacentHTML(
    'beforeend',
    `<div class="question">${escapeHTML(question)}</div>
     ${renderResponse(data)}`
  );
  chatFeed.scrollTop = chatFeed.scrollHeight;
}

async function send() {
  const input = document.getElementById('msg');
  const sujet = input.value.trim();
  if (!sujet) return;

  responseDiv.innerHTML = '🧠 PEGINTI analyse...';

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sujet })
    });

    const data = await res.json();
    responseDiv.innerHTML = renderResponse(data);
    addToFeed(sujet, data);
    input.value = '';
  } catch (err) {
    responseDiv.innerHTML = '❌ Erreur serveur: ' + escapeHTML(err.message);
    console.error(err);
  }
}

async function runWounanet() {
  const sujet = document.getElementById('wounanetMsg').value.trim();
  if (!sujet) return;

  wounanetResponse.innerHTML = '🌍 Recherche...';

  try {
    const res = await fetch('/api/wounanet?sujet=' + encodeURIComponent(sujet));
    const data = await res.json();

    wounanetResponse.innerHTML =
      '<pre>' + escapeHTML(JSON.stringify(data, null, 2)) + '</pre>';
  } catch (err) {
    wounanetResponse.innerHTML = '❌ Erreur WOUNANET: ' + escapeHTML(err.message);
    console.error(err);
  }
}

// Gestion des événements
document.getElementById('sendBtn').onclick = send;
document.getElementById('wounanetBtn').onclick = runWounanet;

document.getElementById('msg').addEventListener('keydown', e => {
  if (e.key === 'Enter') send();
});

document.getElementById('wounanetMsg').addEventListener('keydown', e => {
  if (e.key === 'Enter') runWounanet();
});

document.getElementById('chatOpen').onclick = () => {
  chatOverlay.setAttribute('aria-hidden', 'false');
};

document.getElementById('chatClose').onclick = () => {
  chatOverlay.setAttribute('aria-hidden', 'true');
};

document.getElementById('refreshBtn').onclick = () => {
  location.reload();
};
