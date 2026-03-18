module.exports = {
  apps: [
    // 🧠 HÉMISPHÈRE DROIT (Privé)
    {
      name: 'peginti-ultra',
      script: '/data/data/com.termux/files/home/Peginti-ultra/peginti.js',
      instances: 1,
      exec_mode: 'fork',
      env: { NODE_ENV: 'premium' }
    },
    // 🌍 HÉMISPHÈRE GAUCHE (Public)  
    {
      name: 'pegintichat-public',
      script: '/data/data/com.termux/files/home/PEGINTICHAT/peginti-public.js',
      instances: 1,
      exec_mode: 'fork',
      env: { NODE_ENV: 'community' }
    }
  ]
};
