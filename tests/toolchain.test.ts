import { createRequire } from 'node:module';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
const require = createRequire(import.meta.url);
describe('scoped xcode UUID compatibility override', () => {
  it('retains CommonJS UUID generation and PBX parse/write behavior', () => {
    const xcode = require('xcode');
    const fromXcode = createRequire(require.resolve('xcode'));
    expect(fromXcode('uuid/package.json').version).toBe('11.1.1');
    const dir = mkdtempSync(join(tmpdir(), 'kidsuu-pbx-'));
    try {
      const file = join(dir, 'project.pbxproj');
      writeFileSync(
        file,
        '// !$*UTF8*$!\n{ archiveVersion = 1; classes = {}; objectVersion = 56; objects = {}; rootObject = 0123456789ABCDEF01234567; }\n',
      );
      const project = xcode.project(file).parseSync();
      const ids = new Set(Array.from({ length: 100 }, () => project.generateUuid()));
      expect(ids.size).toBe(100);
      for (const id of ids) expect(id).toMatch(/^[A-F0-9]{24}$/);
      writeFileSync(file, project.writeSync());
      expect(xcode.project(file).parseSync().hash.project.rootObject).toBe(
        '0123456789ABCDEF01234567',
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
