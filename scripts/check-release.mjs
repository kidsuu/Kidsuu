// Intentionally red until the missing production implementations and reviews exist.
// Removing this guard without completing the checklist does not make a release safe.
console.error(`Production release is blocked in this foundation commit.
Required: live server-side auth/authorization, secure parent verification,
real players/content, session storage/lifecycle, privacy review and device QA.
See docs/PRODUCTION-READINESS.md. Demo mode is never a release auth provider.`);
process.exitCode = 1;
