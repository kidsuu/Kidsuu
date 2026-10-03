import { AGE_GROUPS, type AgeGroup } from '../../../../packages/contracts/src';
export interface Question {
  prompt: string;
  options: string[];
  answer: number;
}
export const PRACTICE_IDS = ['colours', 'count', 'shapes', 'pairs'] as const;
export type PracticeId = (typeof PRACTICE_IDS)[number];
export const isPractice = (id: string): id is PracticeId => PRACTICE_IDS.some((v) => v === id);
/** Original text-only practice samples, five checkpoints per activity at every age.
 * Progress is navigation/completion, not a learning assessment or time measurement. */
export function questionsFor(id: PracticeId, age: AgeGroup): Question[] {
  const level = AGE_GROUPS.indexOf(age);
  if (id === 'count')
    return Array.from({ length: 5 }, (_, i) => {
      const a = level < 2 ? (i % 3) + 1 : i + 2,
        b = level < 2 ? 0 : level === 2 ? 2 : i + 3;
      return {
        prompt: b ? `What is ${a} + ${b}?` : `How many stars? ${'★ '.repeat(a)}`,
        options: [String(a + b + 1), String(a + b), String(a + b + 2)],
        answer: 1,
      };
    });
  if (id === 'colours')
    return level < 2
      ? [
          {
            prompt: 'A ripe strawberry is usually…',
            options: ['Red', 'Blue', 'Purple'],
            answer: 0,
          },
          { prompt: 'A clear daytime sky looks…', options: ['Green', 'Blue', 'Yellow'], answer: 1 },
          { prompt: 'A ripe banana is usually…', options: ['Pink', 'Blue', 'Yellow'], answer: 2 },
          { prompt: 'Fresh grass is usually…', options: ['Green', 'Orange', 'Red'], answer: 0 },
          { prompt: 'An orange fruit is…', options: ['Blue', 'Orange', 'Purple'], answer: 1 },
        ]
      : [
          { prompt: 'Which word rhymes with cat?', options: ['Hat', 'Sun', 'Moon'], answer: 0 },
          {
            prompt: 'Which word begins with the same sound as ball?',
            options: ['Cat', 'Bear', 'Dog'],
            answer: 1,
          },
          { prompt: 'Finish the word: s _ n', options: ['a', 'e', 'u'], answer: 2 },
          {
            prompt: 'Which word means the opposite of big?',
            options: ['Small', 'Tall', 'Wide'],
            answer: 0,
          },
          {
            prompt: 'Choose the name of an animal.',
            options: ['Table', 'Puppy', 'Cloud'],
            answer: 1,
          },
        ];
  if (id === 'shapes')
    return level < 2
      ? [
          {
            prompt: 'Which shape has no corners?',
            options: ['Circle', 'Square', 'Triangle'],
            answer: 0,
          },
          {
            prompt: 'Which shape has three sides?',
            options: ['Circle', 'Triangle', 'Square'],
            answer: 1,
          },
          {
            prompt: 'Which shape has four equal sides?',
            options: ['Circle', 'Triangle', 'Square'],
            answer: 2,
          },
          {
            prompt: 'A round plate looks like a…',
            options: ['Circle', 'Triangle', 'Square'],
            answer: 0,
          },
          {
            prompt: 'Find the shape with corners.',
            options: ['Circle', 'Triangle', 'Oval'],
            answer: 1,
          },
        ]
      : Array.from({ length: 5 }, (_, i) => ({
          prompt: `What comes next? ${i + 1}, ${i + 3}, ${i + 5}, …`,
          options: [String(i + 6), String(i + 7), String(i + 8)],
          answer: 1,
        }));
  return [
    {
      prompt: 'Which pair belongs together?',
      options: ['Shoe and sock', 'Shoe and cloud', 'Sock and moon'],
      answer: 0,
    },
    {
      prompt: 'Which is smaller than an elephant?',
      options: ['A mountain', 'A mouse', 'A house'],
      answer: 1,
    },
    {
      prompt: 'Which pair helps us draw?',
      options: ['Cup and plate', 'Hat and coat', 'Paper and pencil'],
      answer: 2,
    },
    {
      prompt: 'Find the matching pair.',
      options: ['Star and star', 'Star and moon', 'Moon and sun'],
      answer: 0,
    },
    {
      prompt: 'Which belongs with a toothbrush?',
      options: ['A shoe', 'Toothpaste', 'A pencil'],
      answer: 1,
    },
  ];
}
