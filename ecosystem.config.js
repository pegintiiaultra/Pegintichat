module.exports = {
  apps: [
    {
      name: "peginti-chat",
      script: "./server.js",
      instances: 2,
      exec_mode: "cluster",
      watch: true,
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    },
    {
      name: "peginti-ultra",
      script: "./ultra.js",
      instances: 1,
      exec_mode: "fork",
      watch: true,
      env: {
        NODE_ENV: "production",
        PORT: 4000
      }
    }
  ]
};
