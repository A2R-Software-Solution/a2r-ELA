# Production audit — remediation status

Updated after the fixes on September 15, 2026. The original findings are retained below as history; they are not the current failure list.

| Area | Current status |
| --- | --- |
| Env loading | Required typed values, no setting defaults in the loader/schema; actual root and backend env files are updated and their shared limits/defaults match. |
| Env consumers | API endpoints, timeouts, Firebase registrations, upload/photo limits, essay category limits, state/grade defaults, PSSA options, game/Boss XP and streak calendar settings are connected. Essay category changes recompute submission validity. UI styles and educational/rubric content remain source data. |
| Production diagnostic endpoints | Disabled in production with HTTP 404. Normal endpoints retain their exported names. |
| Auth and CORS | JSON auth errors verified; response helpers no longer bypass configured origin restrictions. |
| Rewards/progress | Firestore transactions replace read/overwrite updates. Reward receipts deduplicate requests carrying the same idempotency key. Boss personal best and highest-level saturation are covered by tests. Receipts are removed during account deletion. |
| PSSA key rotation | Blank slots are excluded; no usable key produces a clear error. |
| Photo size | Backend limit matches the existing smaller mobile limit and validates UTF-8 bytes. |
| Configuration validation | Nested category/level/reward settings, timezone and relevant cross-setting relationships are checked before function discovery. |
| Firestore setup | Rules and indexes are configured in firebase.json; a predeploy generator uses env collection names and keeps the historical copies consistent. These resources have not been deployed. |
| Android signing | Current signing values moved out of tracked Gradle properties into local env and an ignored generated properties file. Repository history was not rewritten and credentials were not rotated. |
| TypeScript and lint | TypeScript check passes; full-project ESLint reports no errors. Vendor virtualenv files are excluded. |
| Regression tests | 17 backend tests, 5 public-env tests and 3 Jest tests pass. Backend tests mock external AI/auth and use an in-memory transaction test double. |
| Firebase checks | Installed Python dependencies are consistent, actual env loads, and SDK discovery/manifest serialization identifies all 26 endpoints. |
| Android checks | Debug APK build, release signing validation and production JavaScript/Hermes bundle tasks pass. A full release APK/AAB and an iOS build were not produced. |

Remaining verification is environmental: authenticated end-to-end requests against the deployed Firebase project, actual cloud indexes/rules/IAM, AI key quotas, and an iOS build on macOS. No cloud deployment, real user data mutations or external AI calls were made during these fixes.

Compatibility limits: legacy clients without an idempotency key still work; they do not gain request deduplication. Mini-game scores remain client-reported, so this is not a server-authoritative anti-cheat implementation. AI evaluation can run again before a duplicate reward is detected. Changing supported grade lists still requires matching Firestore content. These limitations are not hidden by a passing local build.

Deployment and configuration instructions are in [ENVIRONMENT.md](ENVIRONMENT.md). A functions-only deployment does not deploy the newly wired Firestore rules/indexes. The generated rules deny direct client writes; application writes use authenticated backend routes.

<details>
<summary>Original audit before fixes</summary>

Scope: local source review, installed Python dependency check, TypeScript/Jest/ESLint checks, and isolated Python route checks. No live deployment, real user data writes, external AI calls, Android/iOS compilation, or cloud IAM/billing verification was performed. This is not a claim that every possible defect has been found.

The previous checks established that the production env loads and Firebase discovers the functions. They did not establish that all production request paths are correct. The env conversion also remains incomplete at some consumers, as detailed below.

| Priority | Finding and evidence | Impact / correction |
| --- | --- | --- |
| High | `essay/essay_routes.py:401` exports `submit_essay_no_auth` without an auth or production guard. Local production request with the service mocked reached `submit_essay` and returned HTTP 200. `test_essay_evaluator` and `test_llm_connection` are also exported without authentication. `NB_DEBUG=False` does not disable them. | Unauthenticated AI spending and, for the essay route, writes under a shared debug user. Disable these request paths in production or protect them explicitly. Remove traceback-bearing diagnostic responses from public paths. Actual external reachability additionally depends on deployed IAM. |
| High | `auth/auth_service.py:86` passes a Python dictionary directly as the HTTP response body. Reproduction: missing auth returns status 401, body `error`, and JSON parsing returns `None`. The other auth error branches do the same. | Clients lose error details and may fail to parse responses. Serialize using the standard JSON response builder. Keep token verification errors separate from errors thrown by the protected handler. |
| High | `utils/responses.py:25` and related helpers always emit `Access-Control-Allow-Origin: *`; `file/file_routes.py` also has literal wildcard headers. Isolated process configured with only `https://allowed.example` still returned `*` to `https://blocked.example`. | The env CORS allowlist is ineffective on these responses. Centralize origin handling and remove competing wildcard headers. CORS is not a substitute for authentication. |
| High | `gamification/game_routes.py:88` reads current XP, adds client-reported score rewards, then saves an absolute total at line 113. Other game and progress paths use the same nontransactional pattern. No replay/session identity check exists on this path. | Parallel requests can lose updates; repeated submissions can award the same game repeatedly. Use transactions and a server-validated, single-use game/session result identifier. This is a code-path finding, not a live load-test result. |
| High | `backend/firebase.json` contains Functions configuration only. The actual essay composite indexes are in `backend/functions/firestore.indexes.json`; the root indexes file has no configured indexes. `essay_service.py:389` queries by user and orders by submission time. | Required indexes are not provisioned by this repository's current deployment setup. On a project without them, history queries can fail. Wire a canonical rules/indexes configuration and verify existing cloud indexes before deploying them. A functions-only deployment does not deploy indexes. |
| High | `android/gradle.properties:49` and line 50 contain non-empty release signing password values in a Git-tracked file. Values were not printed. | Move signing credentials to untracked local configuration or CI secrets. Assess repository access/history before deciding whether credentials need rotation. The configured keystore exists locally; a release build was not attempted. |
| Medium | `reward_engine.py:431` defaults to level 1 when no finite XP range matches. Verified with actual env: 99,999 XP returns level 5; 100,000 XP returns level 1. | Long-running users regress to beginner. Saturate at the highest configured level and validate ranges. |
| Medium | `user/user_routes.py:175` permits a photo string up to the configured 2,097,152 characters. `user_service.py:125` stores it inside a Firestore document. | The route accepts payloads larger than Firestore's 1 MiB document limit, resulting in a write failure. The current mobile picker applies a smaller limit, but direct API callers can hit this. Store photos in object storage or enforce a UTF-8 document-size budget. [Official limit](https://firebase.google.com/docs/firestore/quotas). |
| Medium | `backend/firestore.rules:14` is a dated test rule whose cutoff was February 24, 2026. Another, different rules file exists inside `functions/`. Neither is referenced by `firebase.json`. | The checked-in rules are inconsistent. If the dated version is deployed, direct client access is denied after its cutoff. This does not establish the current live rules and does not mean Admin SDK routes are denied: server libraries bypass those rules. [Official server-library behavior](https://firebase.google.cn/docs/firestore/security/rules-structure). Consolidate and verify the intended rules. |
| Medium | `llm/llm_client.py:515` always rotates across three key slots even though the env schema allows unused slots to be explicitly blank. | With one/two configured keys, some requests use an empty bearer token. Current local env has all three populated, so this is a configuration-dependent defect. Filter inactive slots and fail clearly when none remain. No key validity or provider quota checks were performed. |
| Medium | Env settings are not fully respected by consumers: `STREAK_TIMEZONE` is declared, while `progress_service.py:96` and line 199 use UTC directly; `useProfile.ts:49` hardcodes the photo limit; `useExamPrep.ts:47` hardcodes grade 4; `reward_engine.py:278` hardcodes game XP rules; prompt defaults still hardcode state/grade. | Changing env values does not consistently change behavior. Finish wiring these consumers and distinguish app configuration from rubric/content data. The earlier blanket statement that everything was env-driven was too broad. |
| Medium | `config/environment.py` checks top-level JSON types but not nested configuration schemas or relationships. | For example, malformed level ranges or category maps can load but fail later. Validate shapes, supported defaults, range ordering, positive limits, and consistent scoring relationships at startup. Current successful import is not proof that arbitrary env edits are safe. |
| Medium | PSSA seed script populates only grades 3 and 4 (`seed_content.py:354`), while settings support more grades. Content lookup returns an error for absent documents. | A new project seeded only from this script cannot serve all supported grades. Verify cloud content coverage or expose only grades with content. Existing cloud contents were not read. |
| Medium | TypeScript compilation reports four errors: missing `react-native-document-picker` at `src/hooks/useEssayEditor.ts:7`; wrong argument count at line 296; missing `ExamSection` and `SectionStatus` exports at `ExamSectionRow.tsx:10`. | The repository does not pass its type check. The active essay screen imports a different hook, so the old-hook errors alone do not prove that current navigation crashes. Remove/migrate stale code and correct types. |
| Medium | Jest: one suite passes, `App.test.tsx` fails to parse Firebase's ESM export. ESLint across `src` and `App.tsx`: 26 errors in 18 files. | This was the original failing baseline. Firebase mocks and lint fixes have since restored passing checks; the temporary lint dump has been removed. |

Passing checks: installed Python requirements have no dependency conflicts; five backend env tests pass; prior four public-env tests passed; production `ENVIRONMENT` and `NB_DEBUG` values are set correctly; app/backend project and region agree; Firebase's strict dotenv parser accepts the backend env; Firebase manifest generation discovered 26 endpoints; the local production health route returned HTTP 200.

Reproduce isolated route findings without network calls:

```powershell
backend/functions/venv/Scripts/python.exe scripts/audit_backend.py
```

Recommended order: close unauthenticated diagnostic routes; fix auth JSON and CORS; protect rewards updates; verify Firestore deployment configuration; then correct remaining functional/configuration bugs and restore passing app checks. After fixes, run authenticated end-to-end tests against a staging project before relying on production readiness.

</details>
