import React from 'react';
import { AnalysisResult, Severity } from '../types';
import RootCauseCard from './RootCauseCard';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Props {
  data: AnalysisResult;
  onReset: () => void;
}

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6']; // Red, Amber, Blue

const Dashboard: React.FC<Props> = ({ data, onReset }) => {
  const criticalCount = data.rootCauses.filter(c => c.severity === Severity.CRITICAL).length;
  const moderateCount = data.rootCauses.filter(c => c.severity === Severity.MODERATE).length;
  
  // Prepare data for charts
  const severityData = [
    { name: 'Critical', value: criticalCount },
    { name: 'Moderate', value: moderateCount },
    { name: 'Low', value: data.rootCauses.length - criticalCount - moderateCount },
  ].filter(d => d.value > 0);

  // Simple distribution data for bar chart - assume equal weight for now or count affected types
  const rootCauseDistribution = data.rootCauses.map(rc => ({
      name: rc.title.length > 15 ? rc.title.substring(0, 15) + '...' : rc.title,
      fullTitle: rc.title,
      count: rc.affectedWarningTypes.length
  }));

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Analysis Report</h2>
           <p className="text-slate-500 mt-1">Generated at {new Date(data.analyzedAt).toLocaleTimeString()}</p>
        </div>
        <button 
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Analyze New File
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-slate-500 text-sm font-medium">Total Warnings Processed</p>
           <p className="text-4xl font-bold text-slate-800 mt-2">{data.totalWarnings}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-red-500 text-sm font-medium">Critical Root Causes</p>
           <p className="text-4xl font-bold text-slate-800 mt-2">{criticalCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-indigo-500 text-sm font-medium">Systemic Issues Found</p>
           <p className="text-4xl font-bold text-slate-800 mt-2">{data.rootCauses.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Charts Column */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-slate-800 font-semibold mb-6">Severity Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 text-xs text-slate-500">
                 {severityData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1">
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                       {entry.name}
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hidden md:block">
             <h3 className="text-slate-800 font-semibold mb-4">Warning Diversity</h3>
             <p className="text-sm text-slate-500 mb-4">Number of unique warning types per root cause.</p>
             <div className="h-48">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={rootCauseDistribution}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
                   <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} />
                   <YAxis hide />
                   <Tooltip cursor={{fill: 'transparent'}} />
                   <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-slate-800">Identified Root Causes & Solutions</h3>
          {data.rootCauses.map((cause, index) => (
            <RootCauseCard key={index} cause={cause} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
