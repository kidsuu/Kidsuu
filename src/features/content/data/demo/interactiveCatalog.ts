import raw from './interactivePilots.json';
import rawRecipes from './interactiveRecipes.json';
import { parseInteractiveCatalog, parseRecipes } from '../../domain/interactivePackage';
export const interactiveCatalog = parseInteractiveCatalog(raw);
export const interactiveRecipes = parseRecipes(rawRecipes);
