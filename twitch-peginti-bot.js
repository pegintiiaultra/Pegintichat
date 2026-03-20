const tmi = require('tmi.js');
const fetch = require('node-fetch');

const client = new tmi.Client({
  options: { debug: true },
  connection: { reconnect: true },
  identity: {
    username: 'Peginti237', // ton pseudo Twitch
    password: 'oauth:6dwqnfdf5rjzqhfpwgawy9tlc7y383' // ton access token
  },
  channels: ['peginti237'] // ton nom de chaîne Twitch
});

async function pegintiReponse(sujet) {
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sujet: sujet.toLowerCase() })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { source: 'ERREUR', reponse: 'BO\'OIVINI réfléchit...' };
  }
}

client.on('message', async (channel, tags, message, self) => {
  if (self) return;

  // !peginti commande
  if (message.toLowerCase().startsWith('!peginti')) {
    const sujet = message.slice(9).trim();

    if (!sujet) {
      return client.say(channel, `@${tags.username} !peginti <sujet> (ex: mariage, publicai)`);
    }

    const data = await pegintiReponse(sujet);
    client.say(channel, `@${tags.username} ${data.reponse}`);
  }
});

client.connect();
// !hello commande
if (message.toLowerCase() === '!hello') {
  client.say(channel, `Bienvenue dans l'univers Peginti IA ✅ @${tags.username}`);
}
