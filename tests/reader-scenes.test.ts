import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import rawPack from '../src/features/content/data/demo/scenePack.json';
import manifest from '../src/features/content/data/demo/manifest.json';
import oldRaw from '../docs/content-archive/readerPilots-v1.json';
import oldManifest from '../docs/content-archive/readerManifest-v1.json';
import { pilotCatalog } from '../src/features/content/data/demo/catalog';
import {
  editionKey,
  parseReaderCatalog,
  parseReaderPackage,
} from '../src/features/content/domain/contentPackage';
import {
  chooseSceneFrame,
  parseSceneFrames,
  parseScenePack,
  validateReaderSceneRefs,
} from '../src/features/content/domain/scenePack';
import {
  exploreUnit,
  progressMatches,
  resumeEdition,
} from '../src/features/content/domain/editionProgress';
const pack = parseScenePack(rawPack);
const old = parseReaderCatalog(oldRaw);
const sha = (data: string | Buffer) => createHash('sha256').update(data).digest('hex');
const hash = (data: unknown) => sha(JSON.stringify(data));
const root = 'src/features/content/assets/demo/';
const clone = <T>(v: T): T => structuredClone(v);
describe('illustrated readers, immutable old editions and draft boundaries', () => {
  it('retains valid byte-hashed v1 scripts while using v2 editions with unchanged story words', () => {
    expect(old).toHaveLength(4);
    for (const [i, p] of old.entries()) {
      const { contentHash, ...payload } = p;
      expect(hash(payload)).toBe(contentHash);
      expect(oldManifest.packages[i].editionKey).toBe(editionKey(p));
      expect(oldManifest.packages[i].contentHash).toBe(contentHash);
      expect(p.assetStatus).toBe('text-only-preview');
      expect(p.contentVersion).toBe(1);
      expect(pilotCatalog[i].contentVersion).toBe(2);
      expect(
        pilotCatalog[i].pages.map(({ id, text, optional }) => ({ id, text, optional })),
      ).toEqual(p.pages);
      expect(editionKey(pilotCatalog[i])).not.toBe(editionKey(p));
      const row = exploreUnit(p, undefined, p.pages[0].id, 'explore');
      expect(progressMatches(pilotCatalog[i], row)).toBe(false);
      expect(resumeEdition(pilotCatalog[i], row)).toBe(0);
    }
  });
  it('binds every illustration, localized frame label and description into the new package hash', () => {
    expect(hash(rawPack)).toBe(manifest.scenePackHash);
    for (const p of pilotCatalog) {
      expect(p.scenePackHash).toBe(manifest.scenePackHash);
      expect(() => validateReaderSceneRefs(p, pack, manifest.scenePackHash)).not.toThrow();
      const { contentHash, ...payload } = clone(p);
      expect(hash(payload)).toBe(contentHash);
      payload.pages[0].scenes![0].description += ' altered';
      expect(hash(payload)).not.toBe(contentHash);
      for (const page of p.pages)
        if (p.locale === 'hi-IN') expect(page.scenes![0].description).toMatch(/[\u0900-\u097f]/u);
    }
  });
  it('keeps six chronological object scenes and only two distinct manual rhyme pictures', () => {
    for (const p of pilotCatalog) {
      if (p.kind === 'story')
        expect(p.pages.map((page) => page.scenes![0].assetId)).toEqual(
          Array.from({ length: 6 }, (_, i) => `story-0${i + 1}`),
        );
      else {
        expect(p.pages.map((page) => page.scenes!.length)).toEqual([1, 2, 2, 1]);
        expect(new Set(p.pages.flatMap((page) => page.scenes!.map((f) => f.assetId)))).toEqual(
          new Set(['rhyme-rest', 'rhyme-up']),
        );
        expect(p.pages[0].scenes![0].assetId).toBe('rhyme-rest');
        expect(p.pages[3].scenes![0].assetId).toBe('rhyme-rest');
      }
    }
    expect(pack.assets.some((a) => a.id === 'rhyme-down')).toBe(false);
  });
  it('rejects mixed text-only/illustrated fields and malformed frame metadata', () => {
    const p = clone(pilotCatalog[0]);
    const { scenePackHash, ...noHash } = p;
    expect(scenePackHash).toHaveLength(64);
    for (const value of [
      noHash,
      { ...p, scenePackHash: 'bad' },
      { ...p, assetStatus: 'text-only-preview' },
      { ...old[0], scenePackHash: p.scenePackHash },
      { ...p, pages: [{ ...p.pages[0], scenes: undefined }] },
    ])
      expect(() => parseReaderPackage(value)).toThrow();
    const f = p.pages[0].scenes![0];
    for (const frames of [
      [],
      [f, f],
      [f, f, f],
      [{ ...f, assetId: 'https://example.com/x.png' }],
      [{ ...f, label: '' }],
      [{ ...f, description: 'x'.repeat(601) }],
      [{ ...f, description: '\u0000' }],
      [{ ...f, approved: true }],
    ])
      expect(() => parseSceneFrames(frames)).toThrow();
  });
  it('rejects unresolved, cast-as-action and mismatched-pack references', () => {
    const p = clone(pilotCatalog[0]);
    expect(() => validateReaderSceneRefs(p, pack, '0'.repeat(64))).toThrow();
    for (const assetId of ['unknown-picture', 'cast-reference']) {
      p.pages[0].scenes![0].assetId = assetId;
      expect(() => validateReaderSceneRefs(p, pack, manifest.scenePackHash)).toThrow();
    }
  });
  it('never represents human/rights approval, network paths or unbounded images', () => {
    for (const patch of [
      { publication: 'approved' },
      { humanReview: 'approved' },
      { rightsReview: 'approved' },
      { schemaVersion: 2 },
      { token: 'secret' },
      { compositionScriptHash: 'bad' },
      { sources: [] },
      { assets: [] },
    ])
      expect(() => parseScenePack({ ...rawPack, ...patch })).toThrow();
    const a = rawPack.assets[0];
    for (const patch of [
      { file: '../secret.png' },
      { file: 'https://example.com/a.png' },
      { width: 1281 },
      { height: 961 },
      { bytes: 1500001 },
      { origin: 'human-approved' },
      { sourceIds: ['missing'] },
      { sourceIds: [] },
      { sha256: 'bad' },
    ])
      expect(() => parseScenePack({ ...rawPack, assets: [{ ...a, ...patch }] })).toThrow();
    expect(() => parseScenePack({ ...rawPack, assets: [a, a] })).toThrow();
    expect(() =>
      parseScenePack({ ...rawPack, sources: [...rawPack.sources, rawPack.sources[0]] }),
    ).toThrow();
  });
  it('matches all nine PNG byte hashes, dimensions, original reference and composition script', () => {
    expect(pack.assets).toHaveLength(9);
    expect(readdirSync(root).sort()).toEqual(pack.assets.map((a) => a.file).sort());
    let total = 0;
    for (const a of pack.assets) {
      const bytes = readFileSync(root + a.file);
      expect(sha(bytes)).toBe(a.sha256);
      expect(bytes.length).toBe(a.bytes);
      expect(bytes.readUInt32BE(16)).toBe(a.width);
      expect(bytes.readUInt32BE(20)).toBe(a.height);
      total += bytes.length;
    }
    expect(total).toBeLessThanOrEqual(8 * 1024 * 1024);
    expect(pack.assets.find((a) => a.id === 'cast-reference')!.sha256).toBe(
      pack.sources.find((s) => s.id === 'approved-pair')!.sha256,
    );
    expect(sha(readFileSync('scripts/compose-reader-scenes.py'))).toBe(pack.compositionScriptHash);
  });
  it('registers exactly the manifested local pictures without rejected character drafts', () => {
    const source = readFileSync('src/features/content/data/demo/sceneAssets.ts', 'utf8');
    const files = [
      ...source.matchAll(/require\(['"]\.\.\/\.\.\/assets\/demo\/([a-z0-9-]+\.png)['"]\)/g),
    ].map((m) => m[1]);
    expect(files.sort()).toEqual(pack.assets.map((a) => a.file).sort());
    for (const rejected of ['bench-01.png', 'cloth-rest.png', 'bench-paper.png'])
      expect(files).not.toContain(rejected);
  });
  it('selects still frames without mutating content/edition state and refuses invalid indexes', () => {
    const frames = clone(pilotCatalog[0].pages[1].scenes!);
    const before = JSON.stringify(frames);
    expect(chooseSceneFrame(frames, 1).assetId).toBe('rhyme-up');
    expect(chooseSceneFrame(frames, 0).assetId).toBe('rhyme-rest');
    for (const index of [-1, 2, 0.5, NaN, Infinity])
      expect(() => chooseSceneFrame(frames, index)).toThrow();
    expect(JSON.stringify(frames)).toBe(before);
  });
});
