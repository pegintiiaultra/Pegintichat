module.exports = {
  apps: [
    {
      name: 'bo-oivini-noyau',
      script: './bo-oivini/index.js',
      instances: 1,
      exec_mode: 'fork'
    },
    {
      name: 'nsisim-core',
      script: './bo-oivini/nsisim/index.js',
      instances: 1,
      exec_mode: 'fork'
    },
    {
      name: 'supervision-bo-oivini',
      script: './bo-oivini/supervision/index.js',
      instances: 1,
      exec_mode: 'fork'
    }
  ]
};
