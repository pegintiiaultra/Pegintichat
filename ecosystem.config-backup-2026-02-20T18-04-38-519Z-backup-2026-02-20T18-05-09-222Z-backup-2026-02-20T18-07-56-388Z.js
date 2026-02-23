module.exports = {
  apps: [
    {
      name: "pegintichat-v2",
      script: "./index.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 4000
      },
      log_file: "./logs/pegintichat.log",
      error_file: "./logs/pegintichat-error.log",
      out_file: "./logs/pegintichat-out.log",
      merge_logs: true,
      max_memory_restart: '100M'
    }
  ]
};
