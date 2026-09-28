Configuration is split between the native React Native app and Python Firebase Functions.

- Root `.env`: public mobile configuration, Firebase registrations, endpoint names, request timeouts, upload limits and API logging. `.env.example` lists the keys. Existing project values have been preserved in the local `.env`.
- `backend/functions/.env`: backend API keys, AI models/tuning, CORS, function region/resources, validation limits, state/grade settings, scoring, XP, collection names and service metadata. See `backend/functions/.env.example`. Existing secrets are preserved.

UI styles, lesson content, protocol field names and algorithms remain source code. Environment variables configure deployment and application settings; they are not a replacement for content or localization files.

For a fresh checkout, copy both `.env.example` files to `.env` and fill in the Firebase registrations and backend keys. `APP_ANDROID_FIREBASE_JSON` is the complete downloaded `google-services.json`, compacted to one line inside single quotes. `APP_IOS_FIREBASE_JSON` is a JSON object containing every key/value from the downloaded `GoogleService-Info.plist`, also on one line inside single quotes. Preserve boolean values as JSON booleans. Both registrations must belong to `APP_PROJECT_ID` and match the native application's registered package/bundle ID.

Run `npm run env:generate` after changing root `.env`. Android, iOS and Metro also run this automatically. Restart Metro and rebuild the native app after changing Firebase registrations or public settings. An already installed app does not fetch `.env` remotely. Node 20.12+ is required for dotenv parsing.

The generator writes the public TypeScript configuration, Android Google Services JSON, both iOS Firebase plists and `backend/.firebaserc`. Only the explicit public allowlist enters the JavaScript bundle. Never store server credentials in root `.env`. Generated files are ignored for new files; previously tracked native registration files remain tracked until explicitly removed from the Git index.

Use `ENVFILE` to select a different root env file. Process environment values override that file, so CI can inject values without writing credentials to disk.

Mobile photo size, PSSA grade options/defaults, difficulty and question count also come from root env. Keep the corresponding backend `PSSA_*` settings aligned. Game reward rules are in backend `GAME_XP_RULES`; Boss Battle awards use `BOSS_BASE_XP` and `BOSS_PERSONAL_BEST_XP`. Streak calculations honor `STREAK_TIMEZONE`.

Root `APP_ESSAY_CATEGORIES` mirrors backend `ESSAY_CATEGORIES`, and `APP_MAX_STREAK_DAYS` mirrors `MAX_STREAK_DAYS`. They drive the editor's initial state, category-specific validation, progress labels and reset labels. Both active and legacy editor hooks use the env settings.

Android release signing values use `BUILD_RELEASE_STORE_FILE`, `BUILD_RELEASE_KEY_ALIAS`, `BUILD_RELEASE_STORE_PASSWORD` and `BUILD_RELEASE_KEY_PASSWORD` in root env. They generate an ignored signing properties file and never enter the JavaScript bundle. Existing local signing values were preserved. A release build fails with the missing key name when signing values are absent; debug builds do not require them. Existing repository history is unchanged.

Firebase setup:

1. Keep `APP_FUNCTION_REGION` and backend `NB_FUNCTION_REGION` identical, and explicitly set `APP_API_BASE_URL` to the matching Firebase Functions URL. The URL is never synthesized as a fallback.
2. Install the Firebase CLI (`npm install -g firebase-tools`) and authenticate with `firebase login`.
3. Deploy with `npm run firebase:deploy`, which explicitly selects `APP_PROJECT_ID`.
4. For direct CLI use, run `npm run env:generate`, then run Firebase commands from `backend/`.

Firestore rules/indexes are now declared in `backend/firebase.json`. Their predeploy hook generates collection paths from backend env; a Functions-only deployment does not deploy these resources. For the one-time rules/index setup, review the generated rules (client writes are denied; writes go through authenticated backend routes), then run from `backend/`:

```powershell
firebase deploy --only "firestore:rules,firestore:indexes"
```

Production diagnostic endpoints return 404, including when `NB_DEBUG=True`. In nonproduction they require `NB_DEBUG=True`. Endpoint names are retained to avoid breaking deployment discovery. Normal essay/game/auth/file paths remain available.

Reward updates and progress counters use Firestore transactions. New app POST requests carry an idempotency key; reward-event receipts prevent the same request key from awarding XP twice. Legacy clients without this header remain supported. This does not make client-reported mini-game scores authoritative or eliminate AI calls made before a reward retry is detected. Reward receipts are removed on account deletion.

Firebase loads `backend/functions/.env` and `.env.<project-id>` for deployment; `.env.local` overrides emulator values. The Python loader also supports these files for standalone commands and keeps process/runtime values authoritative. Firebase-owned names such as `FIREBASE_*` and `X_GOOGLE_*` must not be added as custom backend variables. Function options use the `NB_FUNCTION_*` names. See [Firebase environment configuration](https://firebase.google.com/docs/functions/config-env).

For emulator testing, set `APP_API_BASE_URL` to the complete Functions emulator prefix, such as `http://10.0.2.2:5001/<project-id>/<region>/` for Android Emulator, then rebuild. `npm run firebase:emulators` starts the backend emulator. This changes the Functions endpoint; native Firebase Authentication continues to use the registered project. HTTP emulator access may require native debug transport settings.

Numeric and boolean backend settings use plain values; list/dictionary settings use single-quoted JSON. Configuration code contains types and validation, with no fallback setting values. Every listed backend variable must exist in the selected env files or Firebase runtime environment; missing or invalid values stop initialization with the variable name. Unused PSSA API-key rotation slots may explicitly be blank, but their keys must still exist. `PSSA_GROQ_MODEL` and `NB_DEBUG` must be provided explicitly. Example files are setup templates, never runtime fallbacks. Keep `APP_MAX_FILE_SIZE` and backend `MAX_FILE_SIZE` aligned. Changing collection names requires migrating existing data and updating corresponding Firestore rules/indexes. Changing supported states or scoring settings also requires compatible rubric/content data.

Validation commands:

```text
npm run test:env
cd backend/functions
venv/Scripts/python.exe -m unittest config.test_environment config.test_functionality
```

Use `venv/bin/python` on macOS/Linux. Seed content from the functions directory with `python -m pssa.seed_content` so it shares the same env loader.
