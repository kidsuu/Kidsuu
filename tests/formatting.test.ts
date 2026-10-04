import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { check, format, resolveConfig } from 'prettier';

describe('cross-platform formatting', () => {
  it('normalizes Windows CRLF back to the checked-in source without code changes', async () => {
    const file = 'App.tsx';
    const source = readFileSync(file, 'utf8');
    const options = { ...(await resolveConfig(file)), filepath: file };
    expect(options.endOfLine).toBe('lf');
    expect(await check(source, options)).toBe(true);
    const windowsCopy = source.replace(/\r?\n/g, '\r\n');
    expect(await check(windowsCopy, options)).toBe(false);
    expect(await format(windowsCopy, options)).toBe(source);
  });
  it('preserves locally linked Expo project metadata while formatting app.json', async () => {
    const app = JSON.parse(readFileSync('app.json', 'utf8'));
    app.expo.extra = {
      ...app.expo.extra,
      eas: { projectId: '11111111-1111-4111-8111-111111111111' },
    };
    app.expo.owner = 'formatting-test-owner';
    const options = { ...(await resolveConfig('app.json')), filepath: 'app.json' };
    const windowsCopy = JSON.stringify(app, null, 4).replace(/\n/g, '\r\n');
    const result = await format(windowsCopy, options);
    expect(JSON.parse(result)).toEqual(app);
    expect(result).not.toContain('\r');
    expect(await check(result, options)).toBe(true);
  });
  it('declares LF checkout policy while leaving binary assets unmodified', () => {
    const attributes = readFileSync('.gitattributes', 'utf8');
    expect(attributes).toContain('* text=auto eol=lf');
    expect(attributes).toContain('*.png binary');
  });
});
