module.exports = {
  apps: [{
    name: 'PEGINTICHAT',
    script: 'index.js',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    log_file: './logs/peginti.log',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    instances: 1,
    autorestart: true,
    watch: false
  }]
};
