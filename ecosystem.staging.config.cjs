module.exports = {
  apps: [
    {
      name: 'realbiz_pro_api',

      script: 'bun',
      args: 'run start',

      cwd: '/var/www/projects/hrm_api',

      instances: 1,
      exec_mode: 'fork',

      autorestart: true,
      watch: false,
      max_memory_restart: '1G',

      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
