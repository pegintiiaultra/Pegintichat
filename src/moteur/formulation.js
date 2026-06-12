'use strict';

function formuler({ question, intention, contexte, plan }) {
  const lignes = [];
  lignes.push(`QUESTION : ${question}`);
  lignes.push('');
  lignes.push(`Intention : ${intention.type}`);
  lignes.push(`Confiance : ${Math.round((intention.confiance || 0) * 100)}%`);

  if (contexte.doctrineTexte) {
    lignes.push('');
    lignes.push(`Contexte doctrine : ${contexte.doctrineTexte}`);
  }

  if (contexte.memoirePertinente?.length) {
    lignes.push('');
    lignes.push('Mémoire pertinente :');
    for (const item of contexte.memoirePertinente) {
      lignes.push(`- ${item.sujet}`);
    }
  }

  if (contexte.sourceTitles?.length) {
    lignes.push('');
    lignes.push('Sources :');
    for (const t of contexte.sourceTitles) {
      lignes.push(`- ${t}`);
    }
  }

  lignes.push('');
  lignes.push('Plan de réponse :');
  for (const step of plan) {
    lignes.push(`- ${step}`);
  }

  lignes.push('');
  lignes.push('Réponse finale : le serveur relie l’intention, le contexte et les sources pour produire une sortie adaptée en temps réel.');
  return lignes.join('\n');
}

module.exports = { formuler };
