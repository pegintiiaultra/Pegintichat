module.exports = {
  apps: [
    {
      name: "pegintichat",
      cwd: "/data/data/com.termux/files/home/PEGINTICHAT",
      script: "src/server.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    },
    {
      name: "peginti-ultra",
      cwd: "/data/data/com.termux/files/home/PEGINTI-ULTRA",
      script: "src/server.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 4000
      }
    }
  ]
}
