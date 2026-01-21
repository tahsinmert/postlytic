import { clamp } from './scoring';
import type { StructureAnalysis } from './types';

function countWords(text: string): number {
    return text.trim().split(/\s+/).length;
}

function countSentences(text: string): number {
    return text.split(/[.!?]+/).filter(Boolean).length;
}

// Simplified Flesch-like Readability Score
function calculateReadability(text: string): number {
    const words = countWords(text);
    const sentences = countSentences(text);

    if (words === 0 || sentences === 0) return 100;

    const averageSentenceLength = words / sentences;

    // The score is inverted: lower is better (easier to read)
    // We'll scale it later. A good ASL is around 10-15.
    const score = averageSentenceLength;
    return score;
}


export function analyzeStructure(post: string): StructureAnalysis {
  const lines = post.split('\n').filter(line => line.trim() !== '');
  const paragraphs = post.split('\n\n').filter(p => p.trim() !== '');
  let score = 100;
  const problems: string[] = [];
  const fixes: string[] = [];

  // Paragraph count
  if (paragraphs.length < 2 && lines.length > 5) {
    score -= 20;
    problems.push('The post is one large block of text.');
    fixes.push('Break the post into smaller paragraphs (2-3 lines each) by adding empty lines.');
  }

  // Line length
  const longLines = lines.filter(line => line.length > 120);
  if (longLines.length > 2) {
    score -= longLines.length * 5;
    problems.push(`${longLines.length} lines are very long, making them hard to read on mobile.`);
    fixes.push('Keep lines short and punchy. Edit long lines to be more concise.');
  }

  // Wall of text
  const averageLineLength = lines.reduce((sum, line) => sum + line.length, 0) / (lines.length || 1);
  if (averageLineLength > 80) {
    score -= 20;
    problems.push('Lines are too long on average (wall of text effect).');
    fixes.push('Increase the use of line breaks to create more white space.');
  }

  // Readability
  const readabilityScore = calculateReadability(post);
  if (readabilityScore > 20) {
      score -= (readabilityScore - 20) * 2;
      problems.push('Sentences are complex and long, making the post hard to read quickly.');
      fixes.push('Simplify sentences and use more common words.');
  }
  
  // Use of lists
  const listItems = lines.filter(line => /^\s*[-*•]/.test(line) || /^\s*\d+\./.test(line)).length;
  if(listItems > 2) {
      score += 15;
  } else {
      fixes.push('Consider using a bulleted or numbered list to present key points.');
  }
  

  return {
    score: clamp(score, 0, 100),
    problems,
    fixes,
    readabilityScore: clamp(100 - (readabilityScore * 4), 0, 100),
  };
}
