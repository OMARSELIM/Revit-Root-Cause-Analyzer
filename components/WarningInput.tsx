import React, { useState, useCallback } from 'react';
import { WarningGroup } from '../types';
import { parseWarnings } from '../utils/parser';
import { DEMO_WARNINGS } from '../constants';

interface Props {
  onAnalyze: (warnings: WarningGroup[]) => void;
  isLoading: boolean;
}

const WarningInput: React.FC<Props> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const processInput = useCallback((inputStr: string) => {
    const parsed = parseWarnings(inputStr);
    if (parsed.length === 0) {
      alert("No recognizable warnings found. Please check your format.");
      return;
    }
    onAnalyze(parsed);
  }, [onAnalyze]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    processInput(text);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      processInput(content);
    };
    reader.readAsText(file);
  };

  const loadDemo = () => {
    setText(DEMO_WARNINGS.trim());
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-3xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Upload Revit Warnings</h2>
        <p className="text-slate-500 text-sm">Paste your warning report text or upload the HTML export.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            className="w-full h-48 p-4 text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
            placeholder="Paste warnings here (e.g. 'Highlighted walls overlap...')"
            value={text}
            onChange={handleTextChange}
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <label className="relative cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-lg transition-colors text-sm font-medium">
                <span>Upload File</span>
                <input type="file" className="hidden" accept=".html,.txt,.htm" onChange={handleFileUpload} disabled={isLoading} />
             </label>
             <button
               type="button"
               onClick={loadDemo}
               className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
               disabled={isLoading}
             >
               Load Demo Data
             </button>
          </div>

          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className={`px-6 py-2 rounded-lg text-white font-medium transition-all shadow-md
              ${!text.trim() || isLoading 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              'Analyze Root Causes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WarningInput;
