import type {
  FamilyStorageSnapshot,
  PutFamilySnapshotInput,
  StoredFamilySnapshot,
  StoredObjectMeta,
} from '../../../packages/contracts/src';
import { ApiError } from '../errors';
import { familySnapshot } from '../domain/validation';

const MAX_SNAPSHOT_BYTES = 65_536;
const MAX_PACKAGE_BYTES = 65_536;
const MAX_ASSET_BYTES = 2_000_000;

export const ALLOWED_ASSET_MIME: Record<string, string> = {
  png: 'image/png',
  webp: 'image/webp',
  mp3: 'audio/mpeg',
  m4a: 'audio/mp4',
  ogg: 'audio/ogg',
  wav: 'audio/wav',
};

async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const buf = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buf).set(bytes);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

export function validatePackageKey(key: string): string {
  if (!/^[a-z0-9][a-z0-9:._-]{2,95}$/i.test(key) || key.includes('..'))
    throw new ApiError(400, 'INVALID_PACKAGE_KEY', 'Invalid content package key.');
  return key;
}

export function validateAssetKey(key: string): { key: string; expectedMime: string } {
  if (
    !/^[a-z0-9][a-z0-9._/-]{1,120}\.(png|webp|mp3|m4a|ogg|wav)$/i.test(key) ||
    key.includes('..') ||
    key.includes('//')
  )
    throw new ApiError(400, 'INVALID_ASSET_KEY', 'Invalid media asset key.');
  const ext = key.split('.').pop()!.toLowerCase();
  return { key, expectedMime: ALLOWED_ASSET_MIME[ext] };
}

function pruneSnapshotChildren(
  snapshot: FamilyStorageSnapshot,
  allowedChildIds: ReadonlySet<string>,
): { pruned: FamilyStorageSnapshot; changed: boolean } {
  let changed = false;
  let selectedId = snapshot.selectedId;
  if (selectedId !== null && !allowedChildIds.has(selectedId)) {
    selectedId = null;
    changed = true;
  }
  const saved: FamilyStorageSnapshot['saved'] = {};
  for (const [id, items] of Object.entries(snapshot.saved)) {
    if (allowedChildIds.has(id)) saved[id] = items;
    else changed = true;
  }
  const editions: FamilyStorageSnapshot['editions'] = {};
  for (const [id, rows] of Object.entries(snapshot.editions)) {
    if (allowedChildIds.has(id)) editions[id] = rows;
    else changed = true;
  }
  return { pruned: { selectedId, saved, editions }, changed };
}

export class R2StorageRepository {
  constructor(
    private bucket: R2Bucket,
    private owner: string,
  ) {}

  private get snapshotKey() {
    return `parents/${this.owner}/snapshot.json`;
  }

  private async readRawSnapshot(): Promise<StoredFamilySnapshot | null> {
    const obj = await this.bucket.get(this.snapshotKey);
    if (!obj) return null;
    let parsed: unknown;
    try {
      parsed = JSON.parse(await obj.text());
    } catch {
      throw new ApiError(500, 'CORRUPT_SNAPSHOT', 'Stored R2 snapshot could not be parsed.');
    }
    if (!parsed || typeof parsed !== 'object')
      throw new ApiError(500, 'CORRUPT_SNAPSHOT', 'Stored R2 snapshot is invalid.');
    const doc = parsed as Record<string, unknown>;
    const checked = familySnapshot.safeParse(doc.snapshot);
    if (
      typeof doc.version !== 'number' ||
      !Number.isSafeInteger(doc.version) ||
      doc.version < 1 ||
      typeof doc.sha256 !== 'string' ||
      typeof doc.updatedAt !== 'string' ||
      !checked.success
    )
      throw new ApiError(500, 'CORRUPT_SNAPSHOT', 'Stored R2 snapshot failed validation.');
    return {
      version: doc.version,
      sha256: doc.sha256,
      updatedAt: doc.updatedAt,
      snapshot: checked.data,
    };
  }

  private async writeSnapshotDocument(
    version: number,
    snapshot: FamilyStorageSnapshot,
  ): Promise<StoredFamilySnapshot> {
    const updatedAt = new Date().toISOString();
    const payloadBytes = new TextEncoder().encode(JSON.stringify(snapshot));
    const sha256 = await sha256Hex(payloadBytes);
    const stored: StoredFamilySnapshot = { version, sha256, updatedAt, snapshot };
    const bodyBytes = new TextEncoder().encode(JSON.stringify(stored));
    if (bodyBytes.byteLength > MAX_SNAPSHOT_BYTES)
      throw new ApiError(413, 'SNAPSHOT_TOO_LARGE', 'Snapshot exceeds 64 KiB storage limit.');
    await this.bucket.put(this.snapshotKey, bodyBytes, {
      httpMetadata: { contentType: 'application/json' },
      customMetadata: { version: String(version), sha256, updatedAt },
    });
    return stored;
  }

  async getSnapshot(allowedChildIds: ReadonlySet<string>): Promise<StoredFamilySnapshot | null> {
    const current = await this.readRawSnapshot();
    if (!current) return null;
    const { pruned, changed } = pruneSnapshotChildren(current.snapshot, allowedChildIds);
    if (!changed) return current;
    return this.writeSnapshotDocument(current.version + 1, pruned);
  }

  async putSnapshot(
    input: PutFamilySnapshotInput,
    allowedChildIds: ReadonlySet<string>,
  ): Promise<StoredFamilySnapshot> {
    const referencedIds = new Set<string>([
      ...(input.snapshot.selectedId ? [input.snapshot.selectedId] : []),
      ...Object.keys(input.snapshot.saved),
      ...Object.keys(input.snapshot.editions),
    ]);
    for (const id of referencedIds) {
      if (!allowedChildIds.has(id))
        throw new ApiError(
          400,
          'INVALID_SNAPSHOT_CHILD',
          'Snapshot references a profile that does not belong to this parent.',
        );
    }
    const current = await this.readRawSnapshot();
    const currentVersion = current?.version ?? 0;
    const expectedVersion = input.version ?? 0;
    if (expectedVersion !== currentVersion)
      throw new ApiError(409, 'VERSION_CONFLICT', 'Snapshot changed in R2. Reload and retry.');
    return this.writeSnapshotDocument(currentVersion + 1, input.snapshot);
  }

  async deleteSnapshot(expectedVersion: number): Promise<void> {
    const current = await this.readRawSnapshot();
    if (!current) throw new ApiError(404, 'SNAPSHOT_NOT_FOUND', 'No snapshot stored in R2.');
    if (current.version !== expectedVersion)
      throw new ApiError(409, 'VERSION_CONFLICT', 'Snapshot changed in R2. Reload and retry.');
    await this.bucket.delete(this.snapshotKey);
  }

  async pruneDeletedChild(childId: string, remainingChildIds: ReadonlySet<string>): Promise<void> {
    const current = await this.readRawSnapshot();
    if (current) {
      const { pruned, changed } = pruneSnapshotChildren(current.snapshot, remainingChildIds);
      if (changed) await this.writeSnapshotDocument(current.version + 1, pruned);
    }
    const childPrefix = `parents/${this.owner}/children/${childId}/`;
    const listed = await this.bucket.list({ prefix: childPrefix });
    if (listed.objects.length > 0) await this.bucket.delete(listed.objects.map((o) => o.key));
  }

  async deleteAllParentStorage(): Promise<void> {
    const prefix = `parents/${this.owner}/`;
    let cursor: string | undefined;
    do {
      const listed = await this.bucket.list({ prefix, cursor });
      if (listed.objects.length > 0) await this.bucket.delete(listed.objects.map((o) => o.key));
      cursor = listed.truncated ? listed.cursor : undefined;
    } while (cursor);
  }

  async putContentPackage(
    rawKey: string,
    payload: Record<string, unknown>,
  ): Promise<StoredObjectMeta> {
    const key = validatePackageKey(rawKey);
    const bytes = new TextEncoder().encode(JSON.stringify(payload));
    if (bytes.byteLength > MAX_PACKAGE_BYTES)
      throw new ApiError(413, 'PACKAGE_TOO_LARGE', 'Content package exceeds 64 KiB limit.');
    const sha256 = await sha256Hex(bytes);
    const updatedAt = new Date().toISOString();
    const objectKey = `content/packages/${key}.json`;
    await this.bucket.put(objectKey, bytes, {
      httpMetadata: { contentType: 'application/json' },
      customMetadata: { key, sha256, updatedAt },
    });
    return {
      key,
      contentType: 'application/json',
      size: bytes.byteLength,
      sha256,
      updatedAt,
    };
  }

  async getContentPackage(rawKey: string): Promise<{ data: unknown; meta: StoredObjectMeta }> {
    const key = validatePackageKey(rawKey);
    const obj = await this.bucket.get(`content/packages/${key}.json`);
    if (!obj) throw new ApiError(404, 'PACKAGE_NOT_FOUND', 'Content package not found in R2.');
    const text = await obj.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      throw new ApiError(500, 'CORRUPT_PACKAGE', 'Stored content package is not valid JSON.');
    }
    const sha256 = obj.customMetadata?.sha256 ?? (await sha256Hex(new TextEncoder().encode(text)));
    const updatedAt = obj.customMetadata?.updatedAt ?? obj.uploaded.toISOString();
    return {
      data,
      meta: {
        key,
        contentType: 'application/json',
        size: obj.size,
        sha256,
        updatedAt,
      },
    };
  }

  async putAsset(
    rawKey: string,
    bytes: Uint8Array,
    contentType: string,
  ): Promise<StoredObjectMeta> {
    const { key, expectedMime } = validateAssetKey(rawKey);
    if (contentType !== expectedMime)
      throw new ApiError(
        415,
        'MIME_EXTENSION_MISMATCH',
        `Asset extension requires content-type ${expectedMime}.`,
      );
    if (bytes.byteLength > MAX_ASSET_BYTES)
      throw new ApiError(413, 'ASSET_TOO_LARGE', 'Media asset exceeds 2 MiB limit.');
    const sha256 = await sha256Hex(bytes);
    const updatedAt = new Date().toISOString();
    await this.bucket.put(`content/assets/${key}`, bytes, {
      httpMetadata: { contentType: expectedMime },
      customMetadata: { key, sha256, updatedAt },
    });
    return {
      key,
      contentType: expectedMime,
      size: bytes.byteLength,
      sha256,
      updatedAt,
    };
  }

  async getAsset(rawKey: string): Promise<{ bytes: ArrayBuffer; meta: StoredObjectMeta }> {
    const { key, expectedMime } = validateAssetKey(rawKey);
    const obj = await this.bucket.get(`content/assets/${key}`);
    if (!obj) throw new ApiError(404, 'ASSET_NOT_FOUND', 'Media asset not found in R2.');
    const bytes = await obj.arrayBuffer();
    const sha256 = obj.customMetadata?.sha256 ?? (await sha256Hex(new Uint8Array(bytes)));
    const updatedAt = obj.customMetadata?.updatedAt ?? obj.uploaded.toISOString();
    return {
      bytes,
      meta: {
        key,
        contentType: obj.httpMetadata?.contentType || expectedMime,
        size: obj.size,
        sha256,
        updatedAt,
      },
    };
  }
}
