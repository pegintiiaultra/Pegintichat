const sendBtn = document.getElementById('sendBtn');
const chatInput = document.getElementById('chatInput');
const chatFeed = document.getElementById('chatFeed');
const wounanetBtn = document.getElementById('wounanetBtn');
const wounanetInput = document.getElementById('wounanetInput');

async function envoyerMessage() {
  const sujet = chatInput.value.trim();
  if (!sujet) return;

  const userCard = document.createElement('div');
  userCard.className = 'feed-entry';
  userCard.innerHTML = `<div class="feed-card"><strong>👤 Vous :</strong> ${sujet}</div>`;
  chatFeed.appendChild(userCard);

  try {
    const res = await fetch('https://pegintichat.online/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sujet })
    });
    const data = await res.json();

    const aiCard = document.createElement('div');
    aiCard.className = 'feed-entry';
    aiCard.innerHTML = `
      <div class="feed-card">
        <strong>🤖 PEGINTI :</strong><br>
        <b>Réponse :</b> ${data.narration.reponse}<br>
        <b>Développement :</b> ${data.narration.developpement}<br>
        <b>Conclusion :</b> ${data.narration.conclusion}
      </div>`;
    chatFeed.appendChild(aiCard);
  } catch (err) {
    const errorCard = document.createElement('div');
    errorCard.className = 'feed-entry';
    errorCard.innerHTML = `<div class="feed-card">❌ Erreur interne : ${err.message}</div>`;
    chatFeed.appendChild(errorCard);
  }
}

async function lancerWounanet() {
  const sujet = wounanetInput.value.trim();
  if (!sujet) return;

  try {
    const res = await fetch('https://pegintichat.online/api/wounanet?sujet=' + encodeURIComponent(sujet));
    const data = await res.json();

    const wnCard = document.createElement('div');
    wnCard.className = 'feed-entry';
    wnCard.innerHTML = `<div class="feed-card"><strong>🌍 WOUNANET :</strong> ${JSON.stringify(data)}</div>`;
    chatFeed.appendChild(wnCard);
  } catch (err) {
    const errorCard = document.createElement('div');
    errorCard.className = 'feed-entry';
    errorCard.innerHTML = `<div class="feed-card">❌ Erreur WOUNANET : ${err.message}</div>`;
    chatFeed.appendChild(errorCard);
  }
}

sendBtn.addEventListener('click', envoyerMessage);
wounanetBtn.addEventListener('click', lancerWounanet);
