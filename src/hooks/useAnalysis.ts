import { useState } from 'react';
import { analyzeClause } from '../api/claude';
import type { ClauseAnalysis, HistoryItem } from '../types';

export function useAnalysis() {
  const [analysis, setAnalysis] = useState<ClauseAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const analyze = async (clauseText: string) => {
    if (!clauseText.trim()) {
      setError('Please paste a legal clause to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeClause(clauseText);
      setAnalysis(result);
      setHistory(prev => [
        {
          id: Date.now().toString(),
          clause: clauseText,
          analysis: result,
          timestamp: new Date(),
        },
        ...prev.slice(0, 9),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setAnalysis(null);
    setError(null);
  };

  return { analysis, isLoading, error, history, analyze, reset };
}
