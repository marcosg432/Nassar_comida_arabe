/** PM2 — cardápio estático na porta 3009 (sem -s para manter /delivery/, /eventos/, /admin/) */
module.exports = {
  apps: [
    {
      name: "nassar-cardapio",
      script: "node_modules/serve/build/main.js",
      args: ". -l 3009",
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
