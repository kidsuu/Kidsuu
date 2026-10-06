import raw from './readerPilots.json';
import scenePack from './scenePack.json';
import manifest from './manifest.json';
import { parseScenePack, validateReaderSceneRefs } from '../../domain/scenePack';
import { parseReaderCatalog } from '../../domain/contentPackage';
/** Loaded only through the __DEV__ parent-lab boundary. */
export const pilotCatalog = parseReaderCatalog(raw);

const pack = parseScenePack(scenePack);
for (const content of pilotCatalog) validateReaderSceneRefs(content, pack, manifest.scenePackHash);
