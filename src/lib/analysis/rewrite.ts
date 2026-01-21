import {
  REWRITE_HOOK_EXAMPLES,
  REWRITE_CTA_EXAMPLES,
  REWRITE_STRUCTURE_CHECKLIST,
} from './constants';
import type { RewriteStrategy } from './types';

export function getRewriteStrategy(): RewriteStrategy {
  return {
    hookExamples: REWRITE_HOOK_EXAMPLES,
    ctaExamples: REWRITE_CTA_EXAMPLES,
    structureChecklist: REWRITE_STRUCTURE_CHECKLIST,
  };
}
