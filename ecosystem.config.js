module.exports = {
  apps: [
    {
      name: "peginti",
      script: "src/peginti.js",
      instances: 1,          // une seule instance pour éviter EADDRINUSE
      exec_mode: "fork",     // mode simple
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 4000
      }
    },
    {
      name: "peginti-tunnel",
      script: "cloudflared",
      args: "tunnel run peginti-net",  // tunnel nommé relié à pegintichat.online
      exec_mode: "fork",
      autorestart: true,
      watch: false
    }
  ]
};
