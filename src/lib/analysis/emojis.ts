import type { EmojiAnalysis } from './types';

const EMOJI_REGEX = /[\p{Emoji}\u{200d}]/gu;

export function analyzeEmojis(post: string): EmojiAnalysis {
  const notes: string[] = [];
  const suggestions: string[] = [];
  
  const emojiMatches = post.match(EMOJI_REGEX) || [];
  const emojiCount = emojiMatches.length;
  const charCount = post.length;
  const lines = post.split('\n');

  const densityRatio = charCount > 0 ? emojiCount / charCount : 0;
  let density: EmojiAnalysis['density'] = 'Good';

  if (densityRatio > 0.02) {
    density = 'High';
    notes.push('Emoji usage is high.');
    suggestions.push('Consider reducing the number of emojis to maintain a professional tone.');
  } else if (densityRatio < 0.005 && emojiCount > 0) {
    density = 'Low';
    notes.push('Emoji usage is low.');
    suggestions.push('You can add a few more relevant emojis to break up text and add visual interest.');
  } else if (emojiCount === 0) {
    notes.push('No emojis used.');
    suggestions.push('Consider adding a few emojis to increase visual appeal and engagement.');
  }

  let consecutiveEmojis = 0;
  for (let i = 0; i < post.length - 1; i++) {
    if (EMOJI_REGEX.test(post[i]) && EMOJI_REGEX.test(post[i+1])) {
      consecutiveEmojis++;
    }
  }
  if (consecutiveEmojis > 0) {
    notes.push('Detected consecutive emojis.');
    suggestions.push('Avoid using multiple emojis in a row. Space them out for better readability.');
  }

  const linesStartingWithEmoji = lines.filter(line => line.trim().match(EMOJI_REGEX)?.index === 0).length;
  if (linesStartingWithEmoji > 5) {
    notes.push('Many lines start with emojis.');
    suggestions.push('Using emojis to start lines is great for lists, but overusing it can look spammy. Use them strategically.');
  }

  return {
    density,
    notes,
    suggestions,
  };
}
