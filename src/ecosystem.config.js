module.exports = {
  apps: [
    {
      name: "pegintichat",
      script: "./src/server.js",
      watch: true,
      instances: 1,
      autorestart: true,
      max_memory_restart: "200M"
    }
  ]
};
