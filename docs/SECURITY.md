# Security notes

## Current behavior

- Production authentication is intentionally unavailable; it fails closed. The development shortcut is gated with the Metro `__DEV__` constant and an explicit non-secret environment opt-in.
- No real SMS, password database, backend keys, analytics SDK, session persistence or provider integration is shipped.
- Demo passwords and OTPs are fictitious in-memory fixtures. Never enter real personal information into demo mode.
- `.env`, signing material, private keys, generated builds and dependency folders are ignored. `.env.example` contains only a public development-mode selector.
- The error boundary does not print exceptions or personal information into UI/logs. A real observability integration needs its own redaction/consent review.

## Dependency baseline — 2026-10-03

The previous Expo 54 baseline was upgraded to Expo **57.0.26**, with SDK-compatible React Native **0.86.3**, React **19.2.3** and TypeScript **6**. Node **22.13+** is required. `expo install --check` passes; compatible `npm audit fix` was attempted without forcing major downgrades.

`npm audit --omit=dev` still reports **24 transitive advisories: 16 high, 8 moderate, 0 critical** at this snapshot. The report includes inherited vulnerability chains in the Expo/Metro/native build ecosystem, including `braces`, `node-forge`, and `uuid`. Counts and advisory data can change independently of this commit. Re-run `npm run audit:dependencies` for the current details.

No claim is made that those findings are harmless or fixed. Do not blindly use `npm audit fix --force`: the observed suggestion included downgrading Expo to 44, which is not a safe resolution. Upstream patches/SDK updates or reviewed compatible overrides need testing, including native builds. Avoid untrusted build inputs while this is unresolved. This baseline is blocked from production release pending review/remediation.

CI reports the audit in a clearly labelled advisory step without masking its command output. Application checks remain mandatory. A production pipeline must gate on the reviewed security policy, not simply reuse this foundation CI.

## Access and reporting

Repository deployment keys are not part of the app and must never be committed. Remove the temporary write-enabled deploy key after this initial delivery. Use least-privilege service accounts and branch protection for ongoing development.

Report vulnerabilities privately to the repository owner. Do not include live tokens, passwords, private keys or child data in public issues or screenshots.

## Cloudflare staging backend

The isolated `backend/` runtime dependency audit currently reports **zero known advisories** (`npm audit --omit=dev`, 2026-10-03). That does not resolve the existing Expo/native dependency findings above; the app audit remains 16 high / 8 moderate at this checkpoint.

The backend is not an identity provider. It accepts only configured issuer/audience/asymmetric-JWKS tokens, scopes database access to the verified identity, requires recent signed authentication for sensitive parent operations, and fails closed when configuration is missing. Password hashing/SMS are not improvised inside a Free-tier Worker. Browser origin allowlisting is not a replacement for authorization. Rate limiting is per-edge-location and is not a hard global abuse/billing cap.

Staging uses minimal, fictitious child data. Profiles share the parent account's authorization scope; separate child-session capabilities and verified legal guardianship/consent are still production design work. Revocation, account deletion at the identity provider, log retention, backups and provider/mobile integration need review before real users.
