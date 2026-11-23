const { spawn } = require('child_process');
const path = require('path');

console.log('====================================================');
console.log(' SKSVMACET Full-Stack Portal Development Launcher');
console.log(' - Backend Express & SQLite: http://localhost:5000');
console.log(' - Frontend React & Vite:    http://localhost:5173');
console.log('====================================================\n');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// 1. Start Backend Server (Express + SQLite)
const server = spawn('node', ['server/index.js'], {
  stdio: 'inherit',
  shell: isWindows
});

// 2. Start Frontend Dev Server (Vite React)
const client = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, '../client'),
  stdio: 'inherit',
  shell: isWindows
});

const cleanup = () => {
  console.log('\nShutting down SKSVMACET portal servers...');
  try { server.kill(); } catch (e) {}
  try { client.kill(); } catch (e) {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
