#!/bin/bash
echo "🚀 Installation PEGINTICHAT Ultra Stable..."

# 1. Créer .env.example
cat > ~/PEGINTICHAT/.env.example <<'EENV'
PEGINTIBOTAPIKEY=your_bot_doctrinal_key_here
PEGINTINEWSAPIKEY=your_newsdata_api_key_here
WOUNANET_API_KEY=your_bing_api_key_here
PORT=3000
EENV

# 2. Créer reset.sh
cat > ~/PEGINTICHAT/reset.sh <<'ERESET'
#!/bin/bash
echo "🔍 Nettoyage des processus Node sur port 3000..."
PID=$(lsof -ti :3000)
if [ -n "$PID" ]; then
  kill -9 $PID
  echo "✅ Port 3000 libéré (PID $PID tué)"
else
  echo "ℹ️ Aucun processus sur port 3000"
fi

echo "🔑 Chargement des clés depuis .env..."
if [ -f ~/PEGINTICHAT/.env ]; then
  set -a
  source ~/PEGINTICHAT/.env
  set +a
  echo "✅ Fichier .env chargé"
else
  echo "⚠️ Aucun fichier .env trouvé"
fi

echo "🔄 Relance PM2..."
pm2 restart pegintichat --update-env
pm2 restart bo-oivini-tunnel --update-env
pm2 save

echo "🚀 PEGINTICHAT relancé avec clés API et tunnel Cloudflare"
ERESET
chmod +x ~/PEGINTICHAT/reset.sh

# 3. Créer config.yml Cloudflare
cat > ~/.cloudflared/config.yml <<'ECONF'
tunnel: cdd9fe2e-5193-43d3-bda6-db876de77d9c
credentials-file: /data/data/com.termux/files/home/.cloudflared/cdd9fe2e-5193-43d3-bda6-db876de77d9c.json

ingress:
  - hostname: chat.pegintichat.online
    service: http://localhost:3000
  - service: http_status:404
ECONF

# 4. Créer server.js fusionné
cat > ~/PEGINTICHAT/src/server.js <<'ESERV'
'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

// ===== MODULES PEGINTI =====
let generateDoctrinalResponse = null;
let interpreterSujet = null;
let choisirIntention = null;

try { ({ generateDoctrinalResponse } = require('./chat_engine')); } catch (err) { console.log('⚠️ chat_engine non chargé:', err.message); }
try { ({ interpreterSujet } = require('./moteur/hermeneutique')); } catch (err) { console.log('⚠️ hermeneutique non chargé:', err.message); }
try { ({ choisirIntention } = require('./moteur/intentions')); } catch (err) { console.log('⚠️ intentions non chargé:', err.message); }

// ===== MÉMOIRE =====
const memFile = path.join(__dirname, 'memoire.json');
function loadMemoire() { try { if (!fs.existsSync(memFile)) return []; return JSON.parse(fs.readFileSync(memFile, 'utf8')); } catch { return []; } }
function saveMemoire(sujet, reponse, intention) {
  const data = loadMemoire();
  data.push({ sujet, reponse, intention, time: new Date().toISOString() });
  fs.writeFileSync(memFile, JSON.stringify(data, null, 2));
}

// ===== WOUNANET CONNECTOR =====
async function wounanet(query) {
  const newsKey = process.env.PEGINTINEWSAPIKEY;
  const bingKey = process.env.WOUNANET_API_KEY;
  try {
    if (newsKey) {
      const url = `https://newsdata.io/api/1/news?apikey=${newsKey}&q=${encodeURIComponent(query)}&language=fr`;
      const resp = await fetch(url);
      const data = await resp.json();
      if (data?.results?.length) {
        return data.results.slice(0, 3).map(r => `${r.title} → ${r.link}`).join("\n");
      }
    }
    if (bingKey) {
      const resp = await fetch(`https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}`, {
        headers: { 'Ocp-Apim-Subscription-Key': bingKey }
      });
      const data = await resp.json();
      return data.webPages?.value?.map(r => r.name + " → " + r.url).join("\n") || `🌐 Aucun résultat pour "${query}"`;
    }
    return `⚠️ Aucune clé API valide pour WOUNANET`;
  } catch (e) {
    console.log('❌ WOUNANET error:', e.message);
    return `Erreur WOUNANET: ${e.message}`;
  }
}

// ===== EXPRESS APP =====
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));
app.use((req, res, next) => { console.log(`[REQ] ${req.method} ${req.path}`); next(); });

// ===== ROUTES =====
app.get('/ping', (req, res) => res.json({ status: 'ONLINE', time: new Date().toISOString() }));
app.get('/memoire', (req, res) => res.json({ data: loadMemoire() }));

app.get('/api/wounanet', async (req, res) => {
  const sujet = req.query.sujet || '';
  const result = await wounanet(sujet);
  res.json({ query: sujet, result, status: 'WOUNANET READY', time: new Date().toISOString() });
});

app.post('/api/chat', async (req, res) => {
  try {
    const sujet = (req.body.sujet || req.body.question || '').trim();
    if (!sujet) return res.status(400).json({ error: 'Sujet requis' });

    const rawWeb = await wounanet(sujet);
    let reponse = rawWeb;

    if (generateDoctrinalResponse) {
      reponse = await generateDoctrinalResponse(sujet, rawWeb);
    }

    let intention = 'generaliste';
    if (interpreterSujet && choisirIntention) {
      const categorie = interpreterSujet(sujet);
      intention = (choisirIntention(categorie)?.mode || 'generaliste');
    }

    saveMemoire(sujet, reponse, intention);

    res.json({
      sujet,
      reponse,
      intention,
      peginti: {
        sujet,
        reponse,
        analyse: {
          categorie: interpreterSujet ? interpreterSujet(sujet) : 'unknown',
          filtre: 'doctrinal_peginti'
        }
      }
    });
  } catch (e) {
    console.error('❌ CHAT ERROR:', e);
    res.status(500).json({ error: 'internal error' });
  }
});

// ===== ROUTE GÉNÉRIQUE =====
app.all('*', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));

// ===== START =====
app.listen(PORT, () => {
  console.log(`🚀 PEGINTI CHAT v2.2.0 ONLINE http://0.0.0.0:${PORT}`);
  console.log('✅ CHAT PEGINTI = IA souveraine | WOUNANET = moteur recherche');
});
ESERV

echo "✅ Installation terminée. Configurez vos clés dans ~/PEGINTICHAT/.env puis lancez ~/PEGINTICHAT/reset.sh"
