import { yajuuSystemPrompt } from './yajuu';

export type ModelType = 'yajuu';

export function getSystemPrompt(model: ModelType): string {
  switch (model) {
    case 'yajuu':
      return yajuuSystemPrompt;
    default:
      throw new Error(`Unknown model: ${model}`);
  }
}

export { yajuuSystemPrompt };
