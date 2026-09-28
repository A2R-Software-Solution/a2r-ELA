const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { readEnvironment, generate } = require('./env-config.cjs');
generate();
const env = readEnvironment();
const command = process.argv[2];
if (!['deploy', 'emulators:start'].includes(command)) throw new Error('Unsupported Firebase command');
// Node launches the Firebase JS entrypoint directly, avoiding shell interpolation.
let cli;
try {
  cli = require.resolve('firebase-tools/lib/bin/firebase.js');
} catch {
  const fs = require('node:fs');
  cli = (process.env.PATH || '').split(path.delimiter).flatMap(directory => [
    path.join(directory, 'node_modules/firebase-tools/lib/bin/firebase.js'),
    path.resolve(directory, '../lib/node_modules/firebase-tools/lib/bin/firebase.js'),
  ]).find(candidate => fs.existsSync(candidate));
  if (!cli) throw new Error('Install Firebase CLI first: npm install -g firebase-tools');
}
const result = spawnSync(process.execPath, [cli, command, '--project', env.APP_PROJECT_ID, ...process.argv.slice(3)], {
  cwd: path.resolve(__dirname, '../backend'), stdio: 'inherit', env: process.env,
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
