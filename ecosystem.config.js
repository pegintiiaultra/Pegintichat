module.exports = {
  apps: [
    {
      name: "peginti",
      script: "./src/server.js",
      cwd: "/data/data/com.termux/files/home/PEGINTICHAT",
      instances: 1,
      exec_mode: "fork",
      env: {
        PORT: 3000,
        PEGINTIBOTAPIKEY: "cf45431a25092794652301c05d5a81f66bff2892b9f35f6dc74d15f30bd6add0",
        PEGINTINEWSAPIKEY: "pub_67708b6864e8452d860b98423a5e5fd6",
        WOUNANET_API_KEY: "pub_67708b6864e8452d860b98423a5e5fd6",
        NEWSDATA_APIKEY: "pub_67708b6864e8452d860b98423a5e5fd6"
      }
    },
    {
      name: "peginti-chat",
      script: "./src/server.js",
      cwd: "/data/data/com.termux/files/home/PEGINTICHAT",
      instances: "max",
      exec_mode: "cluster",
      env: {
        PORT: 4000
      }
    },
    {
      name: "peginti-ultra",
      script: "./src/server.js",
      cwd: "/data/data/com.termux/files/home/PEGINTI-ULTRA",
      instances: 1,
      exec_mode: "fork",
      env: {
        PORT: 5000
      }
    }
  ]
};
