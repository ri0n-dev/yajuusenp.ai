import { normalystemPrompt } from './normal';
import { yajuuSystemPrompt } from './yajuu';
import { konaSystemPrompt } from './kona';

export type PromptType = ['normal', 'yajuu', 'kona'][number];

export function getSystemPrompt(prompt: PromptType): string {
  switch (prompt) {
    case 'normal':
      return normalystemPrompt;
    case 'yajuu':
      return yajuuSystemPrompt;
    case 'kona':
      return konaSystemPrompt;
    default:
      throw new Error(`Unknown prompt: ${prompt}`);
  }
}

export { yajuuSystemPrompt };
