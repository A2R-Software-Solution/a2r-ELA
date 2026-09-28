// Generate deploy-time Firestore resource paths from the backend environment.
const fs = require('node:fs');
const path = require('node:path');
const { parseEnv } = require('node:util');
const backend = path.resolve(__dirname, '../backend');
const read = filename => fs.existsSync(filename) ? parseEnv(fs.readFileSync(filename, 'utf8')) : {};
function generate() {
  const project = process.env.GCLOUD_PROJECT || JSON.parse(fs.readFileSync(path.join(backend, '.firebaserc'), 'utf8')).projects.default;
  const env = { ...read(path.join(backend, 'functions/.env')), ...read(path.join(backend, `functions/.env.${project}`)), ...process.env };
  const collection = key => {
    const value = env[key];
    if (!value || !/^[A-Za-z0-9_-]+$/.test(value)) throw new Error(`Invalid ${key} for Firestore configuration`);
    return value;
  };
  const submissions = collection('COLLECTION_ESSAY_SUBMISSIONS');
  const owners = ['COLLECTION_USERS', 'COLLECTION_USER_PROGRESS', 'COLLECTION_USER_PREFERENCES', 'COLLECTION_GAMIFICATION'].map(collection);
  const rules = `// Generated from backend env. All writes go through authenticated Functions.
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function owns(userId) { return request.auth != null && request.auth.uid == userId; }
${owners.map(name => `    match /${name}/{userId} { allow read: if owns(userId); allow write: if false; }`).join('\n')}
    match /${submissions}/{id} {
      allow read: if request.auth != null && resource.data.user_id == request.auth.uid;
      allow write: if false;
    }
    match /{document=**} { allow read, write: if false; }
  }
}
`;
  const indexes = {
    indexes: [
      ['user_id', 'submitted_at'],
      ['user_id', 'category', 'submitted_at'],
    ].map(fields => ({ collectionGroup: submissions, queryScope: 'COLLECTION', fields: fields.map(fieldPath => ({ fieldPath, order: fieldPath === 'submitted_at' ? 'DESCENDING' : 'ASCENDING' })) })),
    fieldOverrides: [],
  };
  fs.writeFileSync(path.join(backend, 'firestore.rules'), rules);
  fs.writeFileSync(path.join(backend, 'firestore.indexes.json'), JSON.stringify(indexes, null, 2) + '\n');
  // Keep the historical copies identical for users with older CLI configurations.
  fs.writeFileSync(path.join(backend, 'functions/firestore.rules'), rules);
  fs.writeFileSync(path.join(backend, 'functions/firestore.indexes.json'), JSON.stringify(indexes, null, 2) + '\n');
}
module.exports = { generate };
if (require.main === module) generate();
