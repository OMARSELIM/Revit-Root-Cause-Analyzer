import React, { useState } from 'react';
import { WarningGroup, AnalysisResult } from './types';
import { analyzeRootCauses } from './services/geminiService';
import WarningInput from './components/WarningInput';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (warnings: WarningGroup[]) => {
    setAnalyzing(true);
    try {
      const data = await analyzeRootCauses(warnings);
      setResult(data);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Something went wrong during analysis. Please check your API key or try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800">
              Revit <span className="text-indigo-600">Root Cause</span> Analyzer
            </h1>
          </div>
          <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Powered by Gemini 3
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-8">
        {!result ? (
          <div className="max-w-4xl mx-auto mt-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
                Stop Counting Warnings.<br/>Start Fixing Systems.
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                AI-driven analysis that groups Revit warnings by their 
                <span className="font-semibold text-indigo-600"> root cause</span> and suggests 
                <span className="font-semibold text-indigo-600"> radical solutions </span> 
                to prevent them from returning.
              </p>
            </div>
            
            <WarningInput onAnalyze={handleAnalyze} isLoading={analyzing} />
            
            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
               <div className="p-4 text-center">
                 <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                   </svg>
                 </div>
                 <h3 className="font-semibold text-slate-800">Deep Analysis</h3>
                 <p className="text-sm text-slate-500 mt-1">Understand the "Why", not just the "What".</p>
               </div>
               <div className="p-4 text-center">
                 <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-600">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.001 6.001 0 00-5.304-7.618M12 12.75a6.001 6.001 0 005.477-4.63M12 12.75v5.25m0-5.25l-3-3m3 3l3-3" />
                   </svg>
                 </div>
                 <h3 className="font-semibold text-slate-800">Workflow Fixes</h3>
                 <p className="text-sm text-slate-500 mt-1">Actionable steps to change how your team models.</p>
               </div>
               <div className="p-4 text-center">
                 <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                   </svg>
                 </div>
                 <h3 className="font-semibold text-slate-800">Model Health</h3>
                 <p className="text-sm text-slate-500 mt-1">Keep your Revit models light and crash-free.</p>
               </div>
            </div>
          </div>
        ) : (
          <Dashboard data={result} onReset={reset} />
        )}
      </main>
    </div>
  );
};

export default App;
