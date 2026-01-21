import type { ReadabilityAnalysis } from './types';

// Advanced readability analysis with multiple metrics
export function analyzeReadability(post: string): ReadabilityAnalysis {
  const sentences = post.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = post.split(/\s+/).filter(w => w.length > 0);
  const characters = post.replace(/\s/g, '').length;
  
  if (sentences.length === 0 || words.length === 0) {
    return {
      fleschKincaidScore: 0,
      averageSentenceLength: 0,
      averageWordLength: 0,
      sentenceVariety: 0,
      complexityScore: 0,
      readabilityLevel: 'very_difficult',
      insights: ['Text is too short to analyze.'],
      suggestions: ['Add more content to enable readability analysis.'],
    };
  }

  // Basic metrics
  const averageSentenceLength = words.length / sentences.length;
  const averageWordLength = characters / words.length;

  // Flesch-Kincaid Reading Ease (simplified)
  // Higher score = easier to read (0-100 scale)
  const avgWordsPerSentence = averageSentenceLength;
  const avgSyllablesPerWord = estimateSyllables(words);
  
  const fleschKincaidScore = Math.max(0, Math.min(100,
    206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
  ));

  // Sentence variety (standard deviation of sentence lengths)
  const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
  const meanLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - meanLength, 2), 0) / sentenceLengths.length;
  const stdDev = Math.sqrt(variance);
  const sentenceVariety = Math.min(100, (stdDev / meanLength) * 100);

  // Complexity score (based on multiple factors)
  let complexityScore = 0;
  
  // Long sentences increase complexity
  const longSentences = sentenceLengths.filter(len => len > 20).length;
  complexityScore += longSentences * 10;
  
  // Long words increase complexity
  const longWords = words.filter(w => w.length > 7).length;
  complexityScore += (longWords / words.length) * 50;
  
  // Passive voice detection (simplified)
  const passiveIndicators = ['is', 'was', 'are', 'were', 'been', 'being'].filter(indicator => {
    const regex = new RegExp(`\\b${indicator}\\b`, 'gi');
    return regex.test(post);
  });
  complexityScore += passiveIndicators.length * 5;
  
  complexityScore = Math.min(100, complexityScore);

  // Determine readability level
  let readabilityLevel: 'very_easy' | 'easy' | 'fairly_easy' | 'standard' | 'fairly_difficult' | 'difficult' | 'very_difficult';
  
  if (fleschKincaidScore >= 80) readabilityLevel = 'very_easy';
  else if (fleschKincaidScore >= 70) readabilityLevel = 'easy';
  else if (fleschKincaidScore >= 60) readabilityLevel = 'fairly_easy';
  else if (fleschKincaidScore >= 50) readabilityLevel = 'standard';
  else if (fleschKincaidScore >= 30) readabilityLevel = 'fairly_difficult';
  else if (fleschKincaidScore >= 10) readabilityLevel = 'difficult';
  else readabilityLevel = 'very_difficult';

  // Generate insights
  const insights: string[] = [];
  
  if (fleschKincaidScore >= 70) {
    insights.push('Text is easy to read. Great for broad audience engagement.');
  } else if (fleschKincaidScore < 50) {
    insights.push('Text is complex. Consider simplifying for better engagement.');
  }

  if (sentenceVariety > 50) {
    insights.push('Good sentence variety detected. This keeps readers engaged.');
  } else if (sentenceVariety < 20) {
    insights.push('Low sentence variety. Mix short and long sentences for better rhythm.');
  }

  if (averageSentenceLength > 20) {
    insights.push(`Average sentence length is ${averageSentenceLength.toFixed(1)} words. Consider shorter sentences (15-20 words ideal).`);
  }

  const suggestions: string[] = [];

  if (fleschKincaidScore < 60) {
    suggestions.push('Simplify vocabulary and shorten sentences to improve readability.');
  }

  if (sentenceVariety < 30) {
    suggestions.push('Vary sentence lengths. Mix short punchy sentences with longer explanatory ones.');
  }

  if (longSentences > sentences.length * 0.3) {
    suggestions.push('Break up long sentences. Aim for 15-20 words per sentence on average.');
  }

  if (complexityScore > 60) {
    suggestions.push('Reduce complexity by using simpler words and active voice.');
  }

  return {
    fleschKincaidScore: Math.round(fleschKincaidScore),
    averageSentenceLength: Math.round(averageSentenceLength * 10) / 10,
    averageWordLength: Math.round(averageWordLength * 10) / 10,
    sentenceVariety: Math.round(sentenceVariety),
    complexityScore: Math.round(complexityScore),
    readabilityLevel,
    insights,
    suggestions,
  };
}

// Estimate syllables in a word (simplified)
function estimateSyllables(words: string[]): number {
  let totalSyllables = 0;
  
  for (const word of words) {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord.length === 0) continue;
    
    // Simple syllable estimation
    let syllables = 1;
    const vowels = cleanWord.match(/[aeiouy]+/g);
    if (vowels) {
      syllables = vowels.length;
      // Adjust for silent e
      if (cleanWord.endsWith('e')) syllables--;
      // Minimum 1 syllable
      if (syllables < 1) syllables = 1;
    }
    
    totalSyllables += syllables;
  }
  
  return totalSyllables / words.length;
}
