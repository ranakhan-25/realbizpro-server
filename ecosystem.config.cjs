module.exports = {
  apps: [
    {
      name: 'realbiz_pro_api',
      script: 'cmd.exe',
      args: '/c bun run start',
      cwd: 'D:/projects/hrm_api',

      instances: 1,
      exec_mode: 'fork',

      autorestart: true,
      watch: false,
      max_memory_restart: '1G',

      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
