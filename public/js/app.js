document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-chat-home') || document.getElementById('form-home-chat');
  const input = document.getElementById('input-home-chat');
  const chatBox = document.getElementById('box-chat-flow') || document.getElementById('chat-home-result-box');
  const resetBtn = document.getElementById('btn-reset-chat-history') || document.getElementById('btn-home-reset-chat');

  // Réinitialiser le fil
  if (resetBtn && chatBox) {
    resetBtn.addEventListener('click', () => {
      chatBox.innerHTML = '<p>🧠 <strong>PEGINTI IA :</strong> bonjour, bienvenue sur Peginti IA, votre intelligence artificielle généraliste et souveraine. Comment puis-je vous aider aujourd\'hui ?</p>';
    });
  }

  // Envoyer message au backend
  if (form && input && chatBox) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const question = input.value.trim();
      if (!question) return;

      // Affiche le message utilisateur
      chatBox.innerHTML += `<div class="assistant-msg assistant-msg-user"><strong>Vous :</strong> ${question}</div>`;
      input.value = '';

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question })
        });
        const data = await res.json();

        const identiteAffichee = typeof data.identite === 'object' && data.identite !== null
          ? (data.identite.nom || 'PEGINTI IA')
          : (data.identite || '');

        // Affiche la réponse PEGINTI IA
        chatBox.innerHTML += `<div class="assistant-msg assistant-msg-bot">
          <strong>PEGINTI IA :</strong> ${identiteAffichee ? `[${identiteAffichee}] ` : ''}${data.narration || data.sortie || data.response || data.reponse || ''}
        </div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
      } catch (err) {
        chatBox.innerHTML += `<div class="assistant-msg assistant-msg-bot">
          <strong>PEGINTI IA :</strong> ⚠️ Erreur de connexion au serveur.
        </div>`;
      }
    });
  }
});
