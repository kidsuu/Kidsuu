import type { ImageSourcePropType } from 'react-native';
import raw from './scenePack.json';
import { parseScenePack } from '../../domain/scenePack';
/** Static requires only. This registry must stay behind the development Content Lab boundary. */
const sources: Record<string, ImageSourcePropType> = {
  'cast-reference': require('../../assets/demo/cast-reference.png'),
  'rhyme-rest': require('../../assets/demo/rhyme-rest.png'),
  'rhyme-up': require('../../assets/demo/rhyme-up.png'),
  'story-01': require('../../assets/demo/story-01.png'),
  'story-02': require('../../assets/demo/story-02.png'),
  'story-03': require('../../assets/demo/story-03.png'),
  'story-04': require('../../assets/demo/story-04.png'),
  'story-05': require('../../assets/demo/story-05.png'),
  'story-06': require('../../assets/demo/story-06.png'),
};
const pack = parseScenePack(raw);
export function sceneAsset(id: string) {
  const record = pack.assets.find((a) => a.id === id);
  if (!record || !Object.hasOwn(sources, id)) return undefined;
  return { source: sources[id], width: record.width, height: record.height };
}
