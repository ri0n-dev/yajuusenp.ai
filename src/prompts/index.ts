import { yajuuSystemPrompt } from './yajuu';
import { konaSystemPrompt } from './kona';

export type PromptType = ['yajuu', 'kona'][number];

export function getSystemPrompt(prompt: PromptType): string {
  switch (prompt) {
    case 'yajuu':
      return yajuuSystemPrompt;
    case 'kona':
      return konaSystemPrompt;
    default:
      throw new Error(`Unknown prompt: ${prompt}`);
  }
}

export { yajuuSystemPrompt };
