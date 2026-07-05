module.exports = {
  apps: [
    {
      name: "pegintichat-server",
      script: "server.js",
      cwd: "/data/data/com.termux/files/home/PEGINTICHAT",
      env: {
        WOUNANET_API_KEY: "pub_67708b6864e8452d860b98423a5e5fd6",
        PEGINTINEWSAPIKEY: "pub_67708b6864e8452d860b98423a5e5fd6",
        PEGINTIBOTAPIKEY: "cf45431a25092794652301c05d5a81f66bff2892b9f35f6dc74d15f30bd6add0",
        PORT: 3000,
        HOST: "localhost"
      }
    },
    {
      name: "pegintichat-tunnel",
      script: "cloudflared",
      args: "tunnel run pegintichat --config ~/.cloudflared/config.yml"
    }
  ]
}
