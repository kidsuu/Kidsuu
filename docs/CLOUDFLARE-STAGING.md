# Cloudflare staging handoff

## Status and scope

The backend is implemented and locally tested. A live deployment is **not** implied by a commit or a passing `/health` test. The mobile UI still uses the existing development fixture adapter unless live auth and the Family API client are deliberately integrated.

The initial target is **Cloudflare Workers Free + D1**, using `workers.dev` without a purchased domain. Keep real child data out of staging. Provider SMS, paid storage/media and future plan upgrades are not included or assumed free. No Cloudflare resources or paid plans are created by installing dependencies or running tests.

## Configured staging target

The account owner supplied these non-secret identifiers:

- Account ID: `094a6f6e25a127dfb82c7f9168c4d241`
- D1 database ID: `a75ed321-9e8f-4f77-8974-cd53addedff5`
- Worker: `kidsuu-api-staging`
- Database binding: `DB` (configuration name `kidsuu-staging`)

These defaults are stored in `backend/wrangler.jsonc`. Cloudflare account authorization and remote database access have **not** been verified just by adding these identifiers. No migration or deployment has been performed by this configuration change.

## One-time account setup (by the account owner)

1. Open Cloudflare Workers & Pages and activate the account's `workers.dev` subdomain if needed.
2. The owner has supplied the D1 database UUID and account ID above; database creation does not need to be repeated for this target. These IDs are identifiers, not credentials.
3. Decide the parent identity provider. Until that is chosen, leave all three `AUTH_*` settings empty; only health is public and private endpoints fail closed. Real mobile/password sign-in and SMS recovery are not implemented by this API.
4. Authorize deployment securely on your own machine with `npx wrangler login`, or configure a narrowly scoped Cloudflare API token as a GitHub Actions secret. Do **not** paste that token into a chat, `.env.example`, screenshots or Git history.

## Deploy from your own terminal

```sh
npm install --global npm@11.21.0
cd backend
npm ci
npx wrangler login
```

The staging account/database IDs are already configured. Set `CLOUDFLARE_ACCOUNT_ID` and `D1_DATABASE_ID` only if deliberately overriding the target with another staging account/database; do not point this workflow at production. Optionally set all of `AUTH_ISSUER`, `AUTH_AUDIENCE`, and `AUTH_JWKS_URL` to the actual provider's public settings. Set `ALLOWED_ORIGINS` only for exact HTTPS browser/admin origins; leave it empty for a native-only test.

```sh
npm run check
npm run dry-run
npm run db:migrate:staging
npm run deploy:staging
```

Wrangler prints the actual HTTPS Worker URL. This document does not invent an account-specific URL. Visit `<printed-url>/health`; without auth configuration, `/v1/children` must return `503 AUTH_NOT_CONFIGURED`.

Dry-run does not deploy, create a database, send SMS or validate account permissions. A real deploy and remote migration require your explicit account authorization.

## Optional GitHub Actions deployment

Once reviewed and merged into `main`, `.github/workflows/deploy-cloudflare-staging.yml` exposes a **manual** `workflow_dispatch` job. It does not automatically deploy feature branches or PRs, and has no production target. Review branch protection and deployment permissions before making secrets available to workflows.

Repository secret:

- `CLOUDFLARE_API_TOKEN`: limited to the intended account and necessary Workers Scripts/D1 write permissions; add only additional account-read permissions explicitly required by your Cloudflare policy. Do not use a global API key.

Repository variables:

- `CLOUDFLARE_ACCOUNT_ID` (optional; defaults to the committed staging account)
- `D1_DATABASE_ID` (optional; defaults to the committed staging database)
- `AUTH_ISSUER`, `AUTH_AUDIENCE`, `AUTH_JWKS_URL` (all configured, or all blank)
- `ALLOWED_ORIGINS` (optional comma-separated exact HTTPS origins)

The manual workflow tests, applies reviewed D1 migrations to staging, then deploys. It deliberately does not create databases, seed accounts or enable a billing plan. Future destructive migrations require backups and review; a Git rollback does not roll back database changes.

## Tablet integration still to do

1. Implement the selected real auth provider in `AuthGateway`, including secure token storage/refresh and genuine parent reauthentication.
2. Supply its current token to `createFamilyApiClient({baseUrl, getAccessToken})`. Read the API origin from a central non-secret configuration such as `EXPO_PUBLIC_API_BASE_URL`; never hardcode it into screens.
3. Connect profile/settings/progress UI to those APIs, with loading/empty/error states. Handle `PARENT_REAUTH_REQUIRED`, `VERSION_CONFLICT`, `401`, `429`, timeout and offline failure explicitly. Do not silently retry destructive changes.
4. Then generate the Android test build and test real tablets. No APK/native-device testing is included in this backend phase.

## Later custom domain

Attach `api.<your-domain>` to the **same Worker** and keep the same D1 binding. Domain addition alone should not require copying the database. Update central app API configuration and relevant provider/browser-origin settings. Keep the old Worker URL serving the same API while old test builds are still installed; do not rely on redirecting authenticated mutations. Native clients do not need browser CORS origins.

Use a separate Worker, database and auth audience for production. Do not promote staging child records or test identity fixtures into production.

## Security/release boundary

The initial release checklist remains applicable. Recent signed `auth_time` is not verified parental consent. JWTs cannot be immediately revoked here without a provider-backed revocation mechanism. Learning progress is client-reported, not a validated educational outcome. Free-tier CPU/requests/database limits need monitoring and real workload measurements. Dependency advisories and native device QA must be reviewed before launch.
