import { useState } from 'react';
import { useAnalysis } from './hooks/useAnalysis';
import type { RiskLevel, HistoryItem } from './types';

const SAMPLE_CLAUSE = `The Employee agrees that during the term of employment and for a period of two (2) years following termination of employment for any reason, the Employee shall not, directly or indirectly, engage in, own, manage, operate, control, be employed by, or participate in any business that competes with the Company within the United States. This restriction applies regardless of whether the termination is voluntary or involuntary.`;

const riskColors: Record<RiskLevel, { bg: string; text: string; badge: string; dot: string }> = {
  high: { bg: 'risk-high', text: 'text-red-800', badge: 'bg-red-100 text-red-700 border border-red-200', dot: 'bg-red-500' },
  medium: { bg: 'risk-medium', text: 'text-amber-800', badge: 'bg-amber-100 text-amber-700 border border-amber-200', dot: 'bg-amber-500' },
  low: { bg: 'risk-low', text: 'text-green-800', badge: 'bg-green-100 text-green-700 border border-green-200', dot: 'bg-green-500' },
};

const overallRiskLabel: Record<RiskLevel, string> = {
  high: '⚠️ HIGH RISK',
  medium: '⚡ MEDIUM RISK',
  low: '✅ LOW RISK',
};

const overallRiskStyle: Record<RiskLevel, string> = {
  high: 'bg-red-900 text-white',
  medium: 'bg-amber-600 text-white',
  low: 'bg-green-800 text-white',
};

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-body text-slate-600 text-sm">Claude is analyzing your clause...</p>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="shimmer rounded-xl h-24" />
      ))}
      <div className="shimmer rounded-xl h-16 mt-4" />
    </div>
  );
}

function HistoryPanel({ history, onSelect }: { history: HistoryItem[]; onSelect: (item: HistoryItem) => void }) {
  if (history.length === 0) return null;
  return (
    <div className="mt-8 border-t border-amber-200 pt-6">
      <h3 className="font-display text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">Recent Analyses</h3>
      <div className="space-y-2">
        {history.map(item => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="w-full text-left p-3 rounded-lg bg-white border border-amber-100 hover:border-amber-300 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${overallRiskStyle[item.analysis.overallRisk]}`}>
                {item.analysis.overallRisk.toUpperCase()}
              </span>
              <span className="text-xs text-slate-400 font-body">
                {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-body line-clamp-2 group-hover:text-slate-800 transition-colors">
              {item.clause.slice(0, 120)}...
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [clauseText, setClauseText] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const { analysis, isLoading, error, history, analyze, reset } = useAnalysis();

  const handleAnalyze = () => {
    analyze(clauseText);
  };

  const handleSample = () => {
    setClauseText(SAMPLE_CLAUSE);
    reset();
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setClauseText(item.clause);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--parchment)' }}>
      {/* Header */}
      <header className="border-b border-amber-200 bg-white/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--ink)' }}>
              <span className="text-white text-sm font-display font-bold">⚖</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-tight" style={{ color: 'var(--ink)' }}>
                AI Legal Analyzer
              </h1>
              <p className="text-xs font-body" style={{ color: 'var(--muted)' }}>AI-Powered Legal Clause Review</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-body px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Contact Rithika
            </span>
            {history.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs font-body px-3 py-1 rounded-full border border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors"
              >
                History ({history.length})
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="text-center mb-10 fade-in-up">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-3" style={{ color: 'var(--ink)' }}>
            Understand What You Sign
          </h2>
          <p className="font-body text-lg max-w-xl mx-auto" style={{ color: 'var(--slate)' }}>
            Paste any legal clause and get instant AI-powered risk analysis, plain-English summary, and actionable recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Input */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-amber-100 bg-amber-50">
                <span className="font-body font-semibold text-sm" style={{ color: 'var(--ink)' }}>Legal Clause Input</span>
                <button
                  onClick={handleSample}
                  className="text-xs font-body text-amber-700 hover:text-amber-900 underline underline-offset-2 transition-colors"
                >
                  Load sample clause
                </button>
              </div>
              <textarea
                value={clauseText}
                onChange={e => setClauseText(e.target.value)}
                placeholder="Paste your legal clause, contract section, or any legal text here..."
                className="w-full p-5 font-mono text-sm resize-none bg-white text-slate-800 placeholder:text-slate-400 border-none"
                style={{ minHeight: '280px', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', lineHeight: '1.7' }}
              />
              <div className="px-5 py-3 border-t border-amber-100 bg-amber-50 flex items-center justify-between">
                <span className="text-xs font-body text-slate-400">
                  {clauseText.length} characters
                </span>
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading || !clauseText.trim()}
                  className="px-6 py-2 rounded-lg font-body font-semibold text-sm text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  style={{ background: isLoading ? 'var(--muted)' : 'var(--ink)' }}
                >
                  {isLoading ? 'Analyzing...' : 'Analyze Clause →'}
                </button>
              </div>
            </div>

            {/* How it works */}
            <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5">
              <h3 className="font-display font-bold text-sm mb-3" style={{ color: 'var(--ink)' }}>How It Works</h3>
              <div className="space-y-2">
                {['Paste any legal clause or contract section', 'Claude AI analyzes for risks and red flags', 'Get color-coded risks with plain-English summary', 'Review recommendations before signing'].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold text-white flex-shrink-0 mt-0.5" style={{ background: 'var(--gold)' }}>{i + 1}</span>
                    <p className="text-sm font-body text-slate-600">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {showHistory && <HistoryPanel history={history} onSelect={handleHistorySelect} />}
          </div>

          {/* Right: Analysis Output */}
          <div className="space-y-4">
            {!analysis && !isLoading && !error && (
              <div className="bg-white rounded-2xl border border-dashed border-amber-300 shadow-sm p-10 flex flex-col items-center justify-center text-center" style={{ minHeight: '400px' }}>
                <div className="text-5xl mb-4">⚖️</div>
                <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--ink)' }}>Ready to Analyze</h3>
                <p className="font-body text-sm text-slate-400 max-w-xs">
                  Paste a legal clause on the left and click Analyze to see risks, flags, and a plain-English summary.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6" style={{ minHeight: '400px' }}>
                <LoadingSkeleton />
              </div>
            )}

            {error && (
              <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h3 className="font-display font-bold text-red-800 mb-1">Analysis Failed</h3>
                    <p className="font-body text-sm text-red-600">{error}</p>
                    {error.includes('VITE_CLAUDE_API_KEY') && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="font-mono text-xs text-red-700">1. Create a .env file in project root<br />2. Add: VITE_CLAUDE_API_KEY=your_key<br />3. Restart dev server</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {analysis && (
              <div className="space-y-4 fade-in-up">
                {/* Overall Risk Banner */}
                <div className={`rounded-2xl p-4 flex items-center justify-between ${overallRiskStyle[analysis.overallRisk]}`}>
                  <div>
                    <p className="font-body text-xs opacity-75 uppercase tracking-widest">Overall Assessment</p>
                    <p className="font-display font-bold text-xl">{overallRiskLabel[analysis.overallRisk]}</p>
                  </div>
                  <div className="text-4xl opacity-80">
                    {analysis.overallRisk === 'high' ? '🔴' : analysis.overallRisk === 'medium' ? '🟡' : '🟢'}
                  </div>
                </div>

                {/* Plain Summary */}
                <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5">
                  <h3 className="font-display font-bold text-sm mb-2 flex items-center gap-2" style={{ color: 'var(--ink)' }}>
                    <span>📖</span> Plain English Summary
                  </h3>
                  <p className="font-body text-sm text-slate-700 leading-relaxed">{analysis.plainSummary}</p>
                </div>

                {/* Risks */}
                {analysis.risks.length > 0 && (
                  <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5">
                    <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--ink)' }}>
                      <span>🚨</span> Identified Risks ({analysis.risks.length})
                    </h3>
                    <div className="space-y-3">
                      {analysis.risks.map((risk, i) => (
                        <div key={i} className={`rounded-xl p-4 ${riskColors[risk.severity].bg}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`w-2 h-2 rounded-full ${riskColors[risk.severity].dot}`} />
                            <span className={`text-xs font-bold uppercase tracking-wide ${riskColors[risk.severity].text}`}>{risk.severity} risk</span>
                          </div>
                          <p className={`font-body font-semibold text-sm mb-1 ${riskColors[risk.severity].text}`}>{risk.issue}</p>
                          <p className="font-body text-xs text-slate-600 leading-relaxed">{risk.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Terms */}
                {analysis.missingTerms.length > 0 && (
                  <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5">
                    <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--ink)' }}>
                      <span>🔍</span> Missing Terms
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingTerms.map((term, i) => (
                        <span key={i} className="text-xs font-body px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {analysis.recommendations.length > 0 && (
                  <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5">
                    <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--ink)' }}>
                      <span>💡</span> Recommendations
                    </h3>
                    <div className="space-y-2">
                      {analysis.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                          <span className="text-green-600 font-bold text-sm mt-0.5">→</span>
                          <p className="font-body text-sm text-green-900 leading-relaxed">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-200 mt-16 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="font-body text-xs text-slate-400">© 2026 — Built by Rithika Reddy Kommidi</p>
          <p className="font-body text-xs text-slate-400">⚠️ For informational purposes only. Not legal advice.</p>
        </div>
      </footer>
    </div>
  );
}
