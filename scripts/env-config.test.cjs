const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseEnv } = require('node:util');
const fs = require('node:fs');
const path = require('node:path');
const { publicConfig } = require('./env-config.cjs');
const base = parseEnv(fs.readFileSync(path.join(__dirname, '../.env.example'), 'utf8'));

test('API URL must be explicitly supplied by env', () => {
  assert.equal(publicConfig({ ...base, APP_API_BASE_URL: 'https://configured.example/' }).API_BASE_URL,
    'https://configured.example/');
  const missing = { ...base };
  delete missing.APP_API_BASE_URL;
  assert.throws(() => publicConfig(missing), /APP_API_BASE_URL/);
  assert.throws(() => publicConfig({ ...base, APP_API_BASE_URL: '' }), /APP_API_BASE_URL/);
});
test('emulator/custom API URL is normalized', () => {
  assert.equal(publicConfig({ ...base, APP_API_BASE_URL: 'http://10.0.2.2:5001/demo/us-central1///' }).API_BASE_URL,
    'http://10.0.2.2:5001/demo/us-central1/');
});
test('public allowlist excludes secrets and native registration objects', () => {
  const config = publicConfig({ ...base, NB_GROQ_API_KEY: 'secret', APP_UNKNOWN: 'secret', BUILD_RELEASE_STORE_PASSWORD: 'secret' });
  assert.equal(JSON.stringify(config).includes('secret'), false);
  assert.equal('ANDROID_FIREBASE_JSON' in config, false);
});

test('essay limits are read from env and invalid ranges fail', () => {
  const categories = JSON.parse(base.APP_ESSAY_CATEGORIES);
  categories.ela = { min: 80, max: 600 };
  assert.deepEqual(publicConfig({ ...base, APP_ESSAY_CATEGORIES: JSON.stringify(categories) }).ESSAY_CATEGORIES.ela, { min: 80, max: 600 });
  categories.ela = { min: 600, max: 80 };
  assert.throws(() => publicConfig({ ...base, APP_ESSAY_CATEGORIES: JSON.stringify(categories) }), /APP_ESSAY_CATEGORIES/);
});
test('invalid limits, booleans, URLs and endpoints fail early', () => {
  for (const invalid of [
    { APP_MAX_FILE_SIZE: '-1' }, { APP_READ_TIMEOUT_MS: 'abc' },
    { APP_API_LOGGING: 'yes' }, { APP_API_BASE_URL: 'file:///bad' },
    { APP_ENDPOINT_SUBMIT_ESSAY: 'https://unexpected.example' },
  ]) assert.throws(() => publicConfig({ ...base, ...invalid }));
});
