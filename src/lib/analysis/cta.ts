import { CTA_KEYWORDS } from './constants';
import type { CtaAnalysis } from './types';

export function analyzeCta(post: string): CtaAnalysis {
  const lowerCasePost = post.toLowerCase();
  const lines = post.split('\n');
  const endOfPost = lines.slice(Math.max(lines.length - 3, 0)).join(' ').toLowerCase();

  let ctaExists = false;
  let score = 0;
  const suggestions: string[] = [];

  for (const keyword of CTA_KEYWORDS) {
    if (lowerCasePost.includes(keyword)) {
      ctaExists = true;
      break;
    }
  }

  if (!ctaExists) {
    score = 10;
    suggestions.push('No clear Call to Action (CTA) found. A CTA encourages engagement and tells your audience what to do next.');
    suggestions.push('Consider adding a question or prompting for comments.');
  } else {
    score = 60;
    // Check position
    let ctaInEnd = false;
    for (const keyword of CTA_KEYWORDS) {
        if (endOfPost.includes(keyword)) {
            ctaInEnd = true;
            break;
        }
    }

    if (ctaInEnd) {
        score += 40;
    } else {
        score += 10; // CTA in middle is better than none
        suggestions.push('Your CTA appears in the middle of the post. For maximum impact, place it at the end.');
    }
  }

  return {
    ctaExists,
    score,
    suggestions,
  };
}
