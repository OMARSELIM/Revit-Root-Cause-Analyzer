import React, { useState } from 'react';
import { RootCause, Severity } from '../types';

interface Props {
  cause: RootCause;
}

const RootCauseCard: React.FC<Props> = ({ cause }) => {
  const [expanded, setExpanded] = useState(false);

  const getSeverityColor = (s: Severity) => {
    switch (s) {
      case Severity.CRITICAL: return 'bg-red-100 text-red-700 border-red-200';
      case Severity.MODERATE: return 'bg-amber-100 text-amber-700 border-amber-200';
      case Severity.LOW: return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getIcon = (s: Severity) => {
     if (s === Severity.CRITICAL) return (
       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
         <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
       </svg>
     );
     return (
       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
         <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
       </svg>
     );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3 items-center">
             <div className={`p-2 rounded-lg ${getSeverityColor(cause.severity)} bg-opacity-20`}>
                {getIcon(cause.severity)}
             </div>
             <div>
                <h3 className="text-lg font-bold text-slate-800 leading-tight">{cause.title}</h3>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${getSeverityColor(cause.severity)}`}>
                  {cause.severity.toUpperCase()}
                </span>
             </div>
          </div>
        </div>

        <p className="text-slate-600 mb-4 text-sm leading-relaxed">
          {cause.description}
        </p>

        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4">
          <h4 className="text-indigo-900 font-semibold text-sm mb-1 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 22.5 12 13.5H3.75z" />
            </svg>
            Radical Solution
          </h4>
          <p className="text-indigo-800 text-sm leading-relaxed">
            {cause.radicalSolution}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
           <div className="text-xs text-slate-400 font-medium">
             Affects {cause.affectedWarningTypes.length} warning types
           </div>
           <button 
             onClick={() => setExpanded(!expanded)}
             className="text-sm font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition-colors"
           >
             {expanded ? 'Hide Details' : 'View Details'}
             <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
             </svg>
           </button>
        </div>
      </div>

      {expanded && (
        <div className="bg-slate-50 p-5 border-t border-slate-200">
           <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Workflow Impact</h5>
           <p className="text-sm text-slate-700 mb-4">{cause.workflowImpact}</p>
           
           <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Affected Warning Messages</h5>
           <ul className="space-y-2">
             {cause.affectedWarningTypes.map((msg, idx) => (
               <li key={idx} className="text-xs text-slate-600 bg-white border border-slate-200 p-2 rounded">
                 {msg}
               </li>
             ))}
           </ul>
        </div>
      )}
    </div>
  );
};

export default RootCauseCard;
