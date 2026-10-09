# Kidsuu staging API

Cloudflare Workers + D1 (relational database) + R2 (`kidsuu-storage` object storage), served initially on `workers.dev`. No purchased domain is required. This is a **staging backend**, not a completed production launch or an auth provider.

## Implemented

- **D1 Relational Database (`DB`):** Parent preferences (`parents`), up to five child profiles (`child_profiles`), and per-activity progress (`activity_progress`).
- **R2 Object Storage (`STORAGE` → `kidsuu-storage`):** Parent-scoped snapshots (`parents/{parentId}/snapshot.json` for selected profile, saved bookmarks and edition progress ledger), versioned content packages (`content/packages/{key}.json`), and media assets (`content/assets/{key}`).
- D1 migrations, owner-scoped SQL, foreign-key cascade deletion plus automatic R2 storage cleanup when a child profile or parent record is deleted.
- Asymmetric provider JWT verification (issuer, audience, signature, expiry and lifetime), recent account reauthentication for sensitive parent operations, strict JSON validation, payload limits, allowlisted browser origins, rate limiting and no-store responses.
- Tests run the bundled Worker against a real local workerd/D1 simulator, with generated test-only signing keys and no external identity service.
- A typed, separately tested tablet HTTP client lives in `src/shared/api/FamilyApiClient.ts` at the repository root. It is **not yet wired into the app screens or AuthGateway**.

## Local setup

Node 22.13+ is required. Use **npm 11.21.0**, as pinned by `packageManager`. npm 10 encounters upstream optional-peer/lockfile compatibility issues with this toolchain. Both backend CI jobs install the pinned npm version before `npm ci`.

```sh
npm install --global npm@11.21.0
cd backend
npm ci
npm run db:migrate:local
npm run dev
```

`GET /health` works without authentication. Private endpoints return `503 AUTH_NOT_CONFIGURED` until a compatible real identity provider is configured. There is no developer-token bypass, password table, fixed-OTP endpoint, or fake production session.

If configuring a provider locally, copy `.dev.vars.example` to `.dev.vars` and set the public issuer/audience/JWKS settings. Those local files must not be committed.

```sh
npm run check
npm run dry-run
npm audit --omit=dev
```

## Authentication contract

This Worker does not issue tokens, register identity accounts, send SMS or reset passwords. A selected provider must produce a signed **RS256 or ES256 JWT** with `sub`, `iss`, `aud`, `iat`, and `exp`. Maximum token lifetime/age is one hour. Issuer and JWKS URLs must be HTTPS and are configured by the deployer, never the caller. No unverified token claim can choose the key source.

Sensitive operations additionally require a provider-signed `auth_time` from within five minutes. A silent token refresh must **not** count as reauthentication. Missing/stale `auth_time` returns `403 PARENT_REAUTH_REQUIRED`. The mobile UI must prompt the parent through the actual provider, obtain a new verified token, and retry only after explicit user action.

This is recent **account** authentication, not proof of adulthood or legal guardianship. Production consent/parent verification remains a release blocker. The Worker cannot revoke sessions by itself; provider configuration, short token lifetimes and a revocation strategy need to be decided before release.

## Routes

All `/v1` routes require Bearer authentication. `Recent` means the extra recent-authentication check.

| Method | Path                                    | Recent | Purpose                                                         |
| ------ | --------------------------------------- | ------ | --------------------------------------------------------------- |
| GET    | `/health`                               | No     | Public liveness; not database/auth readiness                    |
| POST   | `/v1/parents/me`                        | Yes    | Idempotent parent-data initialization, body `{}`                |
| GET    | `/v1/parents/me`                        | Yes    | Parent settings and version                                     |
| PATCH  | `/v1/parents/me/settings`               | Yes    | `{version, soundEnabled, dailyGoalMinutes}`                     |
| DELETE | `/v1/parents/me`                        | Yes    | Delete this parent's D1 data, not the external identity account |
| GET    | `/v1/children`                          | No     | Own child profiles                                              |
| POST   | `/v1/children`                          | Yes    | `{nickname, ageGroup, avatar}`                                  |
| GET    | `/v1/children/:id`                      | No     | Own single profile                                              |
| PATCH  | `/v1/children/:id`                      | Yes    | Changed profile fields plus `version`                           |
| DELETE | `/v1/children/:id`                      | Yes    | Delete profile and its progress                                 |
| GET    | `/v1/children/:id/progress`             | No     | Current per-activity progress                                   |
| PUT    | `/v1/children/:id/progress/:activityId` | No     | `{completedSteps, totalSteps}`                                  |
| GET    | `/v1/children/:id/summary`              | Yes    | Parent-facing summary of stored progress                        |
| GET    | `/v1/parents/me/snapshot`               | No     | Read parent-scoped snapshot (bookmarks/edition ledger) from R2  |
| PUT    | `/v1/parents/me/snapshot`               | No     | Save parent-scoped snapshot to R2 with optimistic concurrency   |
| DELETE | `/v1/parents/me/snapshot`               | Yes    | Delete parent-scoped snapshot from R2                           |
| GET    | `/v1/storage/packages/:key`             | No     | Fetch versioned content package JSON from R2                    |
| PUT    | `/v1/storage/packages/:key`             | Yes    | Store versioned content package JSON in R2                      |
| GET    | `/v1/storage/assets/:key`               | No     | Stream verified media asset (PNG/WebP/audio) from R2            |
| PUT    | `/v1/storage/assets/:key`               | Yes    | Upload verified media asset (PNG/WebP/audio, <= 2 MiB) to R2    |

Deletion requires `If-Match: "<version>"`; deleting family data also requires `X-Confirm-Delete: delete-my-data`. Patch operations take `version` in JSON. Stale edits return `409 VERSION_CONFLICT`, not last-write-wins overwrites. Another parent's child ID returns `404`, even for mutations.

Profile fields are intentionally minimal: nickname, age group (`2–3`, `4–5`, `6–7`, `8–9`), and an avatar ID (`explorer`, `puppy`, `star`, `moon`). Do not use real child data in staging. No exact date of birth, photos, address or parent mobile number is stored in D1.

Progress is **client-reported navigation progress**, not verified learning, time spent, grades or assessment. Total steps must stay consistent for an activity; retries/older writes never reduce completed steps or change completion time. Replay/reset semantics and weekly history are not implemented. Activity IDs currently match the eight app catalog concepts; their real players are not built. No sample progress is seeded in D1.

The rate binding allows 120 requests/minute per IP bucket and per parent bucket. Cloudflare's rate-limiting binding is per-location/eventually consistent, not a global billing/security counter. DDoS/abuse protection and free-tier quota monitoring need operational review. Database indexes, bounded profile/activity counts and no polling are used to limit reads/writes.

## Deploy

See [`docs/CLOUDFLARE-STAGING.md`](../docs/CLOUDFLARE-STAGING.md). The owner-provided staging account and database identifiers are configured in `wrangler.jsonc`. They are not credentials, and their presence does not verify account authorization or database access. `prepare:staging` uses those defaults when environment overrides are absent/empty and still refuses missing/placeholder identifiers, invalid explicit overrides and incomplete auth configuration.

`deploy:staging` and `db:migrate:staging` generate an ignored `.wrangler/staging.json` from the committed staging target plus optional environment overrides. The Cloudflare API token stays in the shell/CI secret store, never in generated JSON or app code. Remote migrations are a separate deliberate operation: inspect/back up data before applying later migrations.
