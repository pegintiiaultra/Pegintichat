const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// --- Interface publique ---
app.get('/', (req, res) => {
  res.send(`
    <h1>PEGINTICHAT — vitrine publique</h1>
    <button onclick="window.location.href='/wounanet'">WOUNANET</button>
    <div id="chat" style="position:fixed;bottom:20px;right:20px;border:1px solid #ccc;padding:10px;background:#fff;">
      <h3>Chat flottant</h3>
      <input id="msg" placeholder="Votre message..." />
      <button onclick="sendChat()">Envoyer</button>
      <div id="reply"></div>
      <script>
        async function sendChat(){
          const message = document.getElementById('msg').value;
          const res = await fetch('/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message})});
          const data = await res.json();
          document.getElementById('reply').innerText = data.reply;
        }
      </script>
    </div>
  `);
});

// --- Bouton WOUNANET ---
app.get('/wounanet', async (req, res) => {
  const result = await axios.post('http://localhost:5000/wounanet',{query:"exemple"});
  res.send(`<h2>${result.data.result}</h2>`);
});

// --- Chat flottant ---
app.post('/chat', async (req, res) => {
  const { message } = req.body;
  const result = await axios.post('http://localhost:5000/chat',{message});
  res.json(result.data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`PEGINTICHAT running on port ${PORT}`));
