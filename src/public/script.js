// Gestion du chat PEGINTICHAT V3

const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const wounanetBtn = document.getElementById('wounanet-btn');

// Fonction pour ajouter un message dans le chat
function addMessage(sender, text) {
  const msg = document.createElement('div');
  msg.className = sender === 'user' ? 'user-message' : 'bot-message';
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Envoi du message utilisateur
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage('user', text);
  chatInput.value = '';

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sujet: text })
    });
    const data = await res.json();
    addMessage('bot', data.narration || data.reponse || 'Réponse indisponible.');
  } catch (err) {
    addMessage('bot', '⚠️ Erreur serveur : ' + err.message);
  }
});

// Bouton Wounanet
wounanetBtn.addEventListener('click', async () => {
  addMessage('user', '🔎 Recherche Wounanet...');
  try {
    const res = await fetch('/api/wounanet?sujet=Afrique');
    const data = await res.json();
    addMessage('bot', JSON.stringify(data, null, 2));
  } catch (err) {
    addMessage('bot', '⚠️ Erreur Wounanet : ' + err.message);
  }
});
