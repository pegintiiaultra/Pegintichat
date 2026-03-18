#!/bin/bash
# PEGINTI v2.2 - Déploiement minimal + Pub percutante

set -e

echo "PEGINTI v2.2 - Déploiement rapide..."

# 1. Stop + clean PM2
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true
pm2 kill 2>/dev/null || true

# 2. Core messageHandler.js
cat > messageHandler.js << 'JS'
const processMessage = async (message, userId) => {
    // ✅ RECHERCHES PEGINTI UNIQUEMENT
    const response = await pegintiAI.search(message);
    return response;
};
module.exports = { processMessage };
JS

# 3. AdBanner.jsx moderne
cat > AdBanner.jsx << 'JSX'
import { useState } from 'react';

export default function AdBanner() {
    const [show, setShow] = useState(true);
    if (!show) return null;
    
    return (
        <div className="fixed b-4 r-4 z-9999 w-72 bg-gradient-to-r from-purple-600 to-pink-500 p-5 rounded-2xl shadow-2xl hover:scale-105 transition-all">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex-center text-lg font-bold">
                    🛒
                </div>
                <div>
                    <h3 className="font-bold text-lg bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                        Bo'oivini Chat
                    </h3>
                    <p className="text-xs opacity-90">Prix choc • Livraison rapide</p>
                </div>
                <button onClick={() => setShow(false)} 
                        className="ml-auto w-6 h-6 bg-gray-800 hover:bg-red-500 rounded-full flex-center text-white text-xs">
                    ×
                </button>
            </div>
            <button onClick={() => window.open('https://boovini.chat', '_blank')}
                    className="mt-3 w-full bg-white/20 hover:bg-white/30 py-2 px-3 rounded-xl text-xs font-bold flex-center gap-1">
                Commander →
            </button>
        </div>
    );
}
JSX

# 4. PM2 ecosystem simple
cat > ecosystem.config.js << 'JS'
module.exports = {
  apps: [{
    name: 'peginti-v2.2',
    script: 'server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    autorestart: true,
    max_memory_restart: '512M'
  }]
};
JS

# 5. CSS minimal
mkdir -p public
cat > public/ad.css << 'CSS'
.flex-center { display: flex; align-items: center; justify-content: center; }
.b-4 { bottom: 1rem; position: absolute; }
.r-4 { right: 1rem; position: absolute; }
.z-9999 { z-index: 9999; }
.w-72 { width: 18rem; }
CSS

# 6. Server.js minimal
cat > server.js << 'JS'
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('<h1>PEGINTI v2.2 — Interface institutionnelle</h1><p>Bienvenue sur TomTech.inc</p>');
});

app.listen(port, () => {
  console.log(`✅ PEGINTI v2.2 prêt sur http://localhost:${port}`);
});
JS

# 7. Déploiement
npm install express --production --no-audit --no-fund
pm2 start ecosystem.config.js --env production
pm2 save

echo "✅ PEGINTI v2.2 DÉPLOYÉ → http://localhost:3000"
echo "📊 pm2 status"
