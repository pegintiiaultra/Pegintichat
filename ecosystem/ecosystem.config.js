module.exports = {
  apps: [
    {
      name: "PEGINTI-Server",
      script: "./server.js",
      cwd: "/data/data/com.termux/files/home/PEGINTICHAT",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      env: {
        NODE_ENV: "production",
        PORT: 4000,
        NEWSAPIKEY: process.env.NEWSAPIKEY // clé API injectée
      }
    },
    {
      name: "PEGINTI-Tunnel",
      script: "cloudflared",
      args: "tunnel run peginti-tunnel",
      cwd: "/data/data/com.termux/files/home/PEGINTICHAT",
      instances: 1,
      exec_mode: "fork",
      autorestart: true
    }
  ]
};
