import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
if (args.some((arg) => !['--tunnel', '--localhost', '--clear'].includes(arg))) {
  console.error('Use npm run qa:start, optionally with -- --tunnel, --localhost or --clear.');
  process.exitCode = 1;
} else {
  console.log(
    'Starting development-only tablet QA. Use fictitious family data; keep this server private.',
  );
  const child = spawn(
    process.execPath,
    [require.resolve('expo/bin/cli'), 'start', '--dev-client', ...args],
    {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'development', EXPO_PUBLIC_AUTH_MODE: 'demo' },
    },
  );
  child.on('error', () => {
    console.error('Could not start Expo. Check Node/npm and run npm ci.');
    process.exitCode = 1;
  });
  child.on('exit', (code) => {
    process.exitCode = code ?? 1;
  });
}
