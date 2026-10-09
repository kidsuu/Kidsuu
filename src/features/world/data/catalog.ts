import raw from './packages.json';
import { parseWorldCatalog } from '../domain/worldPackage';
export const worldCatalog = parseWorldCatalog(raw);
