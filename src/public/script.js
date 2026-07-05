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

    // 🔄 Lire la réponse comme texte pur
    const texte = await res.text();

    // Afficher directement le texte herméneutique
    addMessage('bot', texte || 'Réponse indisponible.');
  } catch (err) {
    addMessage('bot', '⚠️ Erreur serveur : ' + err.message);
  }
});

// Action du bouton Wounanet (préparé, même si la route n’est pas encore activée)
wounanetBtn.addEventListener('click', async () => {
  const sujet = chatInput.value.trim();
  if (!sujet) {
    addMessage('bot', '⚠️ Veuillez entrer un sujet avant de lancer Wounanet.');
    return;
  }

  addMessage('user', '[Wounanet] ' + sujet);
  chatInput.value = '';

  try {
    const res = await fetch('/api/wounanet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sujet })
    });

    const texte = await res.text();
    addMessage('bot', texte || 'Réponse Wounanet indisponible.');
  } catch (err) {
    addMessage('bot', '⚠️ Erreur Wounanet : ' + err.message);
  }
});
