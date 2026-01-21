import type { FieldValue } from 'firebase/firestore';
import type { AnalysisData as EngineAnalysisData } from './analysis/types';

export type AnalysisData = EngineAnalysisData;

// This is the type that will be stored in Firestore
export type AnalysisResult = AnalysisData & {
  userId: string;
  createdAt: FieldValue;
};

// This is the type that will be read from Firestore, where createdAt is an object
export type AnalysisResultFirestore = Omit<AnalysisResult, 'createdAt'> & {
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};
