module.exports = {
  apps: [
    {
      name: "pegintichat-bo-oivini",
      script: "index.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        PORT: 4000,
        NODE_ENV: "production",
        BIP_ACTIVE: "true"
      },
      watch: ["index.js", "src/", "modules/"],
      max_memory_restart: "200M"
    }
  ]
};
