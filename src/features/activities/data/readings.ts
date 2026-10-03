import { AGE_GROUPS, type AgeGroup } from '../../../../packages/contracts/src';
export const READING_IDS = ['moon', 'bear', 'clap', 'rainbow'] as const;
export type ReadingId = (typeof READING_IDS)[number];
export type FivePages = readonly [string, string, string, string, string];
export interface Reading {
  id: ReadingId;
  ageGroup: AgeGroup;
  kind: 'story' | 'rhyme';
  title: string;
  pages: FivePages;
  version: 1;
}
export const isReading = (id: string): id is ReadingId => READING_IDS.some((value) => value === id);
/** Original editorial drafts, written for Kidsuu. Not copied song lyrics or a vetted curriculum.
 * Five manually explored checkpoints per activity, independent of narration callbacks.
 * These fictional stories/rhymes make no claim about actual astronomy or animal behaviour. */
const content: Record<ReadingId, readonly [FivePages, FivePages, FivePages, FivePages]> = {
  moon: [
    [
      'Little Moon peeped through a cloud. Below, a puppy curled up on a soft mat. “Hello, Puppy,” whispered Moon.',
      'Puppy looked up. “Hello, Moon!” A small star twinkled beside the cloud. Puppy gave one slow wag.',
      'A breeze moved the leaves. Swish, swish. Puppy listened. Then the leaves grew quiet again.',
      'Moon shone above the window. Puppy rested his chin on his paws. “Good night, little star,” he said.',
      'The room was cosy. Puppy closed his eyes. Little Moon kept shining outside. It was time to rest.',
    ],
    [
      'The sleepy moon looked over a garden. Someone was still busy. Pip the puppy was searching for his favourite blanket.',
      '“Is it beside the flowerpot?” wondered Pip. He looked carefully. There was a leaf, a pebble and a little blue bucket. No blanket.',
      'Pip paused. “Where did I last use it?” He remembered a picnic beneath the apple tree. He padded over to look.',
      'There it was, folded on the picnic bench! Pip carried it home. His friend had kept it dry after their snack.',
      'Pip snuggled into his blanket and thanked his friend. Outside, the sleepy moon watched the quiet garden. The search was over.',
    ],
    [
      'Mira called her little garden the Moon Garden. She and her grown-up planted pale flowers that were easy to see at dusk. A path led around them.',
      'One evening, the path disappeared beneath fallen leaves. “We need a way to find it,” said Mira. Her grown-up brought a lamp.',
      'They looked at the path together. Mira suggested bright painted stones along the edge. First they tried just three, so they could check the idea.',
      'The stones made the turning clearer. They finished marking the path without covering any plants. Mira left a wide space for small garden creatures.',
      'When a neighbour visited, Mira showed the safe path with the lamp. “A good idea gets better when we test it,” she said. Their Moon Garden welcomed everyone.',
    ],
    [
      'At the library, Anya found a story about an imaginary starlight map. In the story, a silver line connected places where someone had helped another person.',
      'Anya decided to make a real map of kindness, not a map of the sky. Her first mark was the bench where a neighbour had helped repair her book bag.',
      'Her brother added the school gate, where a friend had waited with him. They asked people before adding their names and left private details off the map.',
      'Soon their map had more marks than they could count at a glance. Not every helpful act was large. Sharing a pencil and listening carefully deserved places too.',
      'They displayed the map without names at the library. “Our starlight is what we do for each other,” said Anya. There was room for tomorrow’s kindness.',
    ],
  ],
  bear: [
    [
      'Bear sat beside a little tree. Rabbit hopped past. Bear lifted a paw. “Hello, Rabbit!”',
      'Rabbit stopped nearby. “Hello, Bear!” They looked at a yellow flower. Bear smiled.',
      'Bird landed on a branch. “Hello, Bird,” said Bear. Bird answered with a little chirp.',
      'Bear made space beside the tree. Rabbit sat down. They watched a leaf float gently to the ground.',
      '“Goodbye for now,” said Rabbit. “See you again,” said Bear. A friendly hello had made a lovely day.',
    ],
    [
      'Bear brought a basket of paper shapes to the play table. Fox wanted to make a picture but could not find a circle.',
      '“Would you like one of mine?” asked Bear. Fox nodded. Bear offered a red circle and a blue circle so Fox could choose.',
      'Then Bear needed a long green strip. Fox had a spare one. “Here you are,” said Fox. Their pictures began to grow.',
      'Rabbit wanted to watch before joining in. Bear left a place at the table. “You can join when you feel ready,” he said.',
      'Together they made a cheerful paper garden. Every picture was different. Being kind had given everyone space to create.',
    ],
    [
      'Little Bear wanted to tell a story at the woodland club. Whenever he imagined standing at the front, his tummy felt fluttery.',
      'He told his trusted grown-up. “You can start small,” she said. Bear practised the first sentence with just her listening.',
      'Next, Bear invited one friend to listen. He forgot a word and paused. His friend waited. Bear found the word and carried on.',
      'At the club, Bear chose to sit beside his grown-up instead of standing alone. He read from his page. He did not have to rush.',
      'Bear felt proud of trying in a way that worked for him. Some days brave means speaking. Some days it means asking for help. Both were welcome at the club.',
    ],
    [
      'Bear’s class started a kindness club. At first, everyone suggested big projects. Bear wondered whether a small, useful change might be a better beginning.',
      'The class noticed that shared pencils were often hard to find. They asked classmates what would help, rather than deciding for them.',
      'They made labelled pencil pots and a clear return place. Nobody had to join the club or share personal stories to use them.',
      'After a week, the class checked the idea. The labels were too small for some people to read. They added larger words and simple shapes.',
      'Their plan improved because they listened. Bear wrote the club’s first rule: “Ask, try, listen, improve.” Kindness was not a competition. It was something they could practise together.',
    ],
  ],
  clap: [
    [
      'Clap, clap, soft and slow,\nLittle hands say hello.\nOr wave a hand and smile today,\nThere is more than one way to play.',
      'Tap, tap, on your knee,\nA gentle beat for you and me.\nKeep it quiet, keep it light,\nChoose the way that feels just right.',
      'Open hands, then let them rest,\nPick the move that you like best.\nWatch or listen, that is fine,\nYour little rhythm need not match mine.',
      'One small wave, a happy grin,\nTake a breath, then start again.\nFast or slow? We choose slow,\nSoft little movements, here we go.',
      'Clap, clap, or wave hooray,\nThanks for sharing time today.\nHands at rest, our rhyme is through,\nA quiet little cheer for you.',
    ],
    [
      'One gentle clap, then hands at rest,\nA little pause can feel the best.\nSay “one” or wave instead,\nFollow where your rhythm led.',
      'Two little taps, one and two,\nA cosy counting beat for you.\nTap your knee or count aloud,\nNo need to make the rhythm loud.',
      'Three soft beats, then stop and see,\nCan you count them? One, two, three.\nWatching quietly counts as play,\nChoose your own comfortable way.',
      'Four slow waves float through the air,\nStay seated if you like your chair.\nOne, two, three, four, now we rest,\nWhich small rhythm did you like best?',
      'Count one smile and then count two,\nOne for me and one for you.\nOur counting rhyme has reached its end,\nUntil another day, my friend.',
    ],
    [
      'Tap, tap, rest; tap, tap, rest,\nA repeating pattern for our test.\nSay the words or tap along,\nSpoken rhythm, not a song.',
      'Clap, rest, clap; clap, rest, clap,\nA space can sit inside a pattern map.\nWhat stays the same each time we go?\nTry it gently, try it slow.',
      'Short, short, long; short, short, long,\nThere is room for every beat to belong.\nSay “long” a little longer than before,\nThen take a pause before one more.',
      'Pick two sounds: “tap” and “ta”,\nMake a pattern where you are.\nTell a grown-up what comes next,\nOr point to the pattern in the text.',
      'A rhythm can include a space,\nA quiet pause can have a place.\nRest your hands; our making is through,\nWhich pattern felt the best to you?',
    ],
    [
      'A word can bounce, a word can glide,\nA little rhyme can sit beside.\nSay “light” and find a rhyming friend,\nWhich matching sound comes at the end?',
      'Bright and night can rhyme with light,\nTheir endings sound alike just right.\nTheir meanings differ, as you know,\nYet matching sounds can help lines flow.',
      'Tap a rhythm, leave a space,\nPut a short word in that place.\nChange the word, then read once more,\nDoes it feel like it did before?',
      'Make two lines about your day,\nRead them in your speaking way.\nThey may rhyme, or they may not,\nKeep the words you like a lot.',
      'Our rhyme lab closes for today,\nYour next idea can wait and stay.\nNo perfect poem do we need,\nJust words we chose and time to read.',
    ],
  ],
  rainbow: [
    [
      'A little puppy says “woof, woof”,\nNear a cosy make-believe roof.\nSay it softly, or simply smile,\nWatch our puppy for a while.',
      'A little kitten says “meow”,\nWe can listen quietly now.\nSay hello in your own way,\nYou decide how you will play.',
      'A little duck says “quack, quack, quack”,\nThen paddles gently there and back.\nCount the quacks or wave hello,\nKeep our animal voices low.',
      'A little bird says “chirp, chirp, cheep”,\nThen rests before a cosy sleep.\nOur pretend sounds float away,\nWhat sound did you like today?',
      'Puppy, kitten, duck and bird,\nFour pretend voices we have heard.\nNow a quiet pause will do,\nOur little rhyme says bye to you.',
    ],
    [
      'Red and orange start our rhyme,\nSay the colours, take your time.\nPoint or listen, either way,\nThere are many ways to play.',
      'Yellow follows, sunny-bright,\nThen green joins our colour flight.\nName a yellow thing you know,\nOr let a grown-up have a go.',
      'Blue and indigo come next,\nTwo more colours in our text.\nSpeak them slowly, side by side,\nLet the little words take a ride.',
      'Violet ends our rainbow line,\nEvery colour has a time to shine.\nChoose a favourite, if you please,\nThere is no wrong choice among these.',
      'Seven colours, rhyme complete,\nNo need to hurry, race or beat.\nRed to violet, now we rest,\nWhich colour word did you like best?',
    ],
    [
      'One, two, pause; one, two, pause,\nA counting pattern with no applause.\nTap softly or say the words,\nKeep it gentle as resting birds.',
      'One, two, three, then count no more,\nLeave a space where we might say four.\nA missing beat can still belong,\nWe are speaking, not playing a song.',
      'Two, four, six, then eight and ten,\nCount by twos and try again.\nCan you say what follows two?\nA grown-up can explore with you.',
      'Five, ten, fifteen, then we pause,\nNotice what the pattern was.\nEach new number grows by five,\nSay the next to keep it alive.',
      'Numbers, spaces, beats in line,\nYour rhythm need not copy mine.\nChoose a pattern, let it end,\nWe can count again, my friend.',
    ],
    [
      'Choose a pair of spoken sounds,\nLet a simple pattern make its rounds.\n“Ta, tum, rest” could be your start,\nOr make a pattern from your heart.',
      'Repeat it twice, then pause to hear,\nDid the same small pattern reappear?\nSay it, tap it, write it down,\nThere is no prize and no best crown.',
      'Change one sound but keep the beat,\nDoes your new pattern still repeat?\nA small adjustment, made with care,\nCan give you something new to share.',
      'Ask a willing friend to try,\nThey can say no; let that pass by.\nExplain the pattern, take it slow,\nGive them time to have a go.',
      'Keep a pause at our rhyme’s end,\nRest is useful too, my friend.\nNo microphone records your play,\nYour rhythm stays with you today.',
    ],
  ],
};
const titles: Record<ReadingId, readonly string[]> = {
  moon: ['Little moon', 'The sleepy moon', 'The moon garden', 'The starlight map'],
  bear: ['Bear says hello', 'A very kind bear', 'Brave little bear', 'The kindness club'],
  clap: ['Clap, clap, hooray!', 'Clap & count', 'Rhythm makers', 'Rhyme lab'],
  rainbow: ['Animal sounds', 'Rainbow rhythm', 'Counting beats', 'Make a rhythm'],
};
export function getReading(id: ReadingId, ageGroup: AgeGroup): Reading {
  const index = AGE_GROUPS.indexOf(ageGroup);
  if (index < 0) throw new Error('Unsupported reading age group.');
  return {
    id,
    ageGroup,
    kind: id === 'moon' || id === 'bear' ? 'story' : 'rhyme',
    title: titles[id][index],
    pages: content[id][index],
    version: 1,
  };
}
