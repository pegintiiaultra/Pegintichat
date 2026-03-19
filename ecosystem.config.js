module.exports = {
  apps: [{
    name: 'PEGINTI-bo-oivini',
    script: 'src/bo-oivini-server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: { NODE_ENV: 'production', PORT: 3000 },
    autorestart: true,
    max_memory_restart: '512M'
  }]
};
