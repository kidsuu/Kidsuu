// Historical fixtures only. Removed content cannot be imported by the app.
import readerRaw from '../docs/content-archive/removed-2026-10-09/readerPilots.json';
import interactiveRaw from '../docs/content-archive/removed-2026-10-09/interactivePilots.json';
import {
  parseReaderCatalog,
  type EditionContent,
} from '../src/features/content/domain/contentPackage';
export const pilotCatalog = parseReaderCatalog(readerRaw);
export const interactiveCatalog = interactiveRaw as unknown as (EditionContent & {
  title: string;
  kind: 'game' | 'learning';
  recipeHash: string;
})[];
