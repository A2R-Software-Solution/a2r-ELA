const fs = require('node:fs');
const path = require('node:path');
const { parseEnv } = require('node:util');

const root = path.resolve(__dirname, '..');
function readEnvironment() {
  const filename = path.resolve(root, process.env.ENVFILE || '.env');
  const file = fs.existsSync(filename) ? parseEnv(fs.readFileSync(filename, 'utf8')) : {};
  return { ...file, ...process.env };
}
function required(env, key) {
  if (!env[key]?.trim()) throw new Error(`Set ${key} in .env (see .env.example)`);
  return env[key].trim();
}
function positive(env, key) {
  const value = Number(required(env, key));
  if (!Number.isSafeInteger(value) || value <= 0) throw new Error(`${key} must be a positive integer`);
  return value;
}
function publicConfig(env) {
  required(env, 'APP_PROJECT_ID');
  required(env, 'APP_FUNCTION_REGION');
  const url = required(env, 'APP_API_BASE_URL');
  if (!/^https?:\/\//.test(url)) throw new Error('APP_API_BASE_URL must use http or https');
  const parsedUrl = new URL(url);
  if (parsedUrl.search || parsedUrl.hash || parsedUrl.username || parsedUrl.password) {
    throw new Error('APP_API_BASE_URL must not contain credentials, query parameters or fragments');
  }
  const config = { API_BASE_URL: url.replace(/\/+$/, '') + '/' };
  for (const key of ['CONNECT_TIMEOUT_MS', 'READ_TIMEOUT_MS', 'WRITE_TIMEOUT_MS', 'MAX_FILE_SIZE', 'MAX_FILES_COUNT', 'MAX_PHOTO_SIZE', 'PSSA_DEFAULT_QUESTION_COUNT', 'MAX_STREAK_DAYS']) {
    config[key] = positive(env, `APP_${key}`);
  }
  if (!['true', 'false'].includes(env.APP_API_LOGGING)) throw new Error('APP_API_LOGGING must be true or false');
  config.API_LOGGING = env.APP_API_LOGGING === 'true';
  try {
    config.ESSAY_CATEGORIES = JSON.parse(required(env, 'APP_ESSAY_CATEGORIES'));
  } catch {
    throw new Error('APP_ESSAY_CATEGORIES must be a JSON object');
  }
  for (const category of ['essay_writing', 'ela', 'math', 'science']) {
    const limits = config.ESSAY_CATEGORIES?.[category];
    if (!limits || !Number.isSafeInteger(limits.min) || !Number.isSafeInteger(limits.max) || limits.min < 0 || limits.min > limits.max || limits.max <= 0) {
      throw new Error(`Invalid APP_ESSAY_CATEGORIES limits for ${category}`);
    }
  }
  for (const key of ['DEFAULT_STATE', 'DEFAULT_GRADE', 'PSSA_DEFAULT_GRADE', 'PSSA_DEFAULT_DOMAIN', 'PSSA_DEFAULT_DIFFICULTY']) {
    config[key] = required(env, `APP_${key}`);
  }
  if (!['easy', 'medium', 'hard'].includes(config.PSSA_DEFAULT_DIFFICULTY)) {
    throw new Error('APP_PSSA_DEFAULT_DIFFICULTY must be easy, medium or hard');
  }
  try {
    config.PSSA_AVAILABLE_GRADES = JSON.parse(required(env, 'APP_PSSA_AVAILABLE_GRADES'));
  } catch {
    throw new Error('APP_PSSA_AVAILABLE_GRADES must be a JSON array');
  }
  if (!Array.isArray(config.PSSA_AVAILABLE_GRADES) || !config.PSSA_AVAILABLE_GRADES.every(g => typeof g === 'string') || !config.PSSA_AVAILABLE_GRADES.includes(config.PSSA_DEFAULT_GRADE)) {
    throw new Error('APP_PSSA_AVAILABLE_GRADES must include APP_PSSA_DEFAULT_GRADE');
  }
  // The template defines the explicit public allowlist; backend secrets are never bundled.
  const template = parseEnv(fs.readFileSync(path.join(root, '.env.example'), 'utf8'));
  for (const key of Object.keys(template).filter(k => k.startsWith('APP_ENDPOINT_'))) {
    const endpoint = required(env, key);
    if (!/^[a-zA-Z0-9_-]+$/.test(endpoint)) throw new Error(`${key} must be a function name`);
    config[key.slice(4)] = endpoint;
  }
  return config;
}
function write(relative, content) {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== content) fs.writeFileSync(target, content);
}
function xml(value) {
  return String(value).replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]));
}
function generate() {
  const env = readEnvironment();
  const config = publicConfig(env);
  let android, ios;
  try {
    android = JSON.parse(required(env, 'APP_ANDROID_FIREBASE_JSON'));
    ios = JSON.parse(required(env, 'APP_IOS_FIREBASE_JSON'));
  } catch {
    throw new Error('Set valid APP_ANDROID_FIREBASE_JSON and APP_IOS_FIREBASE_JSON registration objects in .env');
  }
  if (android.project_info?.project_id !== env.APP_PROJECT_ID || ios.PROJECT_ID !== env.APP_PROJECT_ID) {
    throw new Error('Both native Firebase registrations must match APP_PROJECT_ID');
  }
  if (!android.client?.length || !ios.GOOGLE_APP_ID || !ios.API_KEY || !ios.BUNDLE_ID) {
    throw new Error('Incomplete native Firebase registration configuration');
  }
  const plist = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0"><dict>\n' +
    Object.entries(ios).map(([key, value]) => `<key>${xml(key)}</key>` +
      (typeof value === 'boolean' ? `<${value}/>` : typeof value === 'number' ? `<integer>${value}</integer>` : `<string>${xml(value)}</string>`)).join('\n') + '\n</dict></plist>\n';
  write('src/config/env.generated.ts', '// Generated by npm run env:generate. Public settings only.\nexport const appEnv = ' + JSON.stringify(config, null, 2) + ' as const;\n');
  write('android/app/google-services.json', JSON.stringify(android, null, 2) + '\n');
  write('ios/GoogleService-Info.plist', plist);
  write('ios/NovelBound/GoogleService-Info.plist', plist);
  write('backend/.firebaserc', JSON.stringify({ projects: { default: env.APP_PROJECT_ID } }, null, 2) + '\n');
  const signingKeys = ['STORE_FILE', 'KEY_ALIAS', 'STORE_PASSWORD', 'KEY_PASSWORD'];
  const escapeProperty = value => value.replace(/\\/g, '\\\\').replace(/\r/g, '\\r').replace(/\n/g, '\\n');
  write('android/signing.generated.properties', signingKeys.filter(key => env[`BUILD_RELEASE_${key}`]).map(key =>
    `MYAPP_RELEASE_${key}=${escapeProperty(env[`BUILD_RELEASE_${key}`])}`).join('\n') + '\n');
}
module.exports = { readEnvironment, publicConfig, generate };
if (require.main === module) generate();
