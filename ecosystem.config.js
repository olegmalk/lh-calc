// PM2 Ecosystem Configuration for LH-Calc
//
// Log files are written relative to this config file location (repo root)
// To enable log rotation, install pm2-logrotate:
//   pm2 install pm2-logrotate
//   pm2 set pm2-logrotate:max_size 10M
//   pm2 set pm2-logrotate:retain 30

module.exports = {
  apps: [
    {
      name: 'lh-calc-app',
      cwd: './excel-api',
      script: 'dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '3G',
      env: {
        NODE_ENV: 'production',
        PORT: 5555
      },
      error_file: './logs/app-error.log',
      out_file: './logs/app-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000
    },
    {
      name: 'lh-calc-watcher',
      cwd: './',
      script: './git-watcher.sh',
      interpreter: '/bin/bash',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '100M',
      error_file: './logs/watcher-error.log',
      out_file: './logs/watcher-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000
    }
  ]
};
