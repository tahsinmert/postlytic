'use server';

import { runAnalysis as runDeterministicAnalysis } from '@/lib/analysis/engine';
import type { AnalysisData } from '@/lib/analysis/types';

export async function runAnalysis(
  postText: string
): Promise<{ data: AnalysisData } | { error: string }> {
  if (!postText || postText.trim().length < 50) {
    return { error: 'Post text must be at least 50 characters long.' };
  }
  if (postText.trim().length > 5000) {
    return { error: 'Post text cannot exceed 5000 characters.' };
  }

  try {
    // This is now a synchronous, deterministic function
    const data = runDeterministicAnalysis(postText);
    return { data };
  } catch (e: any) {
    console.error('Error during analysis:', e);
    return { error: 'An unexpected error occurred during analysis. Please check the post content and try again.' };
  }
}
