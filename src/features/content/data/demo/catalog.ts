import raw from './readerPilots.json';
import { parseReaderCatalog } from '../../domain/contentPackage';
/** Loaded only through the __DEV__ parent-lab boundary. */
export const pilotCatalog = parseReaderCatalog(raw);
