module.exports = {
  apps: [
    {
      name: "pegintichat",
      script: "./src/server.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        WOUNANET_API_KEY: process.env.WOUNANET_API_KEY,
        PEGINTI_CHAT_KEY: process.env.PEGINTI_CHAT_KEY
      }
    },
    {
      name: "bo-oivini-tunnel",
      script: "cloudflared",
      args: "tunnel run bo-oivini",
      autorestart: true,
      watch: false
    }
  ]
}
