'use client';

import {
  BarChart2,
  Check,
  FileSearch,
  FileText,
  Hash,
  Lightbulb,
  Loader2,
  MessageSquare,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AnalysisData } from '@/lib/analysis/types';
import { db } from '@/lib/firebase/client';
import { ViralityScoreDisplay } from './virality-score-display';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Badge } from './ui/badge';
import { Logo } from './logo';
import Link from 'next/link';

type AnalysisResultFirestore = AnalysisData & {
  userId: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};


export function PublicResultView({ id }: { id: string }) {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultFirestore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const docRef = doc(db, 'analyses', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAnalysisResult(docSnap.data() as AnalysisResultFirestore);
        } else {
          setError('Analysis not found.');
        }
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Could not retrieve analysis.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-accent-default" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] w-full items-center justify-center">
        <Card className="w-full max-w-md bg-destructive/10 border-destructive/20">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysisResult) return null;

  const analysisItems = [
    { icon: Lightbulb, title: 'Hook', analysis: analysisResult.hook, score: analysisResult.viralityScore.breakdown.hook },
    { icon: FileText, title: 'Structure', analysis: analysisResult.structure, score: analysisResult.viralityScore.breakdown.structure },
    { icon: BarChart2, title: 'Call to Action (CTA)', analysis: analysisResult.cta, score: analysisResult.viralityScore.breakdown.cta },
    { icon: Hash, title: 'Hashtags', analysis: analysisResult.hashtags, score: analysisResult.viralityScore.breakdown.hashtags },
  ];

  const date = new Date(analysisResult.createdAt.seconds * 1000);

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="space-y-8 animate-in fade-in duration-500">

        <Card className="relative bg-accent-subtle/30 border-accent-default/20 backdrop-blur-md overflow-hidden">
          <CardHeader>
            <div className='flex justify-between items-center'>
              <CardTitle className="font-headline text-xl">Analysis Report</CardTitle>
              <Badge variant="subtle">
                Analyzed {formatDistanceToNow(date, { addSuffix: true })}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <ViralityScoreDisplay score={analysisResult.viralityScore.score} />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><MessageSquare className="h-5 w-5 text-accent-default" />Score Explanation</h3>
                <p className="text-muted-foreground">{analysisResult.viralityScore.explanation}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-bg-subtle/50">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Original Post</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground p-6 pt-0 whitespace-pre-wrap">
            {analysisResult.originalPost}
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {analysisItems.map(item => (
            <Card key={item.title} className="bg-bg-subtle/50">
              <AccordionItem value={item.title} className="border-b-0">
                <AccordionTrigger className="p-6 text-base font-semibold hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <item.icon className="h-5 w-5 text-accent-default" />
                    {item.title}
                    <div className="text-lg font-bold ml-auto">{item.score}/100</div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  {'patterns' in item.analysis && item.analysis.patterns.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Patterns Detected:</h4>
                      <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                        {item.analysis.patterns.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                  {'suggestions' in item.analysis && item.analysis.suggestions.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Suggestions:</h4>
                      <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                        {item.analysis.suggestions.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                  {'issues' in item.analysis && item.analysis.issues.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Issues Found:</h4>
                      <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                        {item.analysis.issues.map((s: string, i: number) => <li key={i} className="flex items-start"><X className="h-4 w-4 mr-2 mt-1 text-destructive shrink-0" /><span>{s}</span></li>)}
                      </ul>
                    </div>
                  )}
                  {'recommendations' in item.analysis && item.analysis.recommendations.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Recommendations:</h4>
                      <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                        {item.analysis.recommendations.map((s: string, i: number) => <li key={i} className="flex items-start"><Check className="h-4 w-4 mr-2 mt-1 text-green-400 shrink-0" /><span>{s}</span></li>)}
                      </ul>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Card>
          ))}
        </Accordion>

        <Card className="bg-bg-subtle/50">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Improvement Strategy</CardTitle>
            <CardDescription>Use these proven templates and checklists to improve your post.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Better Hook Examples</h3>
              <div className="space-y-2">
                {analysisResult.rewriteStrategy.hookExamples.map((ex, i) => (
                  <div key={i} className="text-sm text-muted-foreground border-l-2 border-accent-default pl-3 py-1 bg-background/30 rounded-r-md">{ex}</div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Stronger CTA Examples</h3>
              <div className="space-y-2">
                {analysisResult.rewriteStrategy.ctaExamples.map((ex, i) => (
                  <div key={i} className="text-sm text-muted-foreground border-l-2 border-accent-default pl-3 py-1 bg-background/30 rounded-r-md">{ex}</div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Structure Improvement Checklist</h3>
              <ul className="space-y-2">
                {analysisResult.rewriteStrategy.structureChecklist.map((item, i) => (
                  <li key={i} className="flex items-center text-sm text-muted-foreground"><Check className="h-4 w-4 mr-2 text-green-400 shrink-0" />{item}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>Want to analyze your own posts?</p>
          <Link href="/" className="text-accent-default hover:underline font-semibold flex items-center justify-center gap-2">
            Try Postlytic now <Logo />
          </Link>
        </div>
      </div>
    </div>
  );
}
