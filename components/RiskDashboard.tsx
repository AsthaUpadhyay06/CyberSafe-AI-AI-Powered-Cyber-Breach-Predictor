import React from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { AlertTriangle, CheckCircle, AlertOctagon, Info } from 'lucide-react';

interface Props {
  data: AnalysisResult;
}

const RiskDashboard: React.FC<Props> = ({ data }) => {
  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.CRITICAL: return '#ef4444'; // Red
      case RiskLevel.HIGH: return '#f97316'; // Orange
      case RiskLevel.MEDIUM: return '#f59e0b'; // Amber
      case RiskLevel.LOW: return '#10b981'; // Green
      default: return '#3b82f6';
    }
  };

  const COLORS = ['#0ea5e9', '#ef4444', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertOctagon size={64} />
          </div>
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Overall Risk Score</h3>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className={`text-4xl font-bold`} style={{ color: getRiskColor(data.riskLevel) }}>
              {data.riskScore}
            </span>
            <span className="text-gray-500">/ 100</span>
          </div>
          <div className="mt-4 text-sm font-semibold px-2 py-1 rounded bg-opacity-20 inline-block" style={{ backgroundColor: getRiskColor(data.riskLevel), color: getRiskColor(data.riskLevel) }}>
            {data.riskLevel.toUpperCase()}
          </div>
        </div>

        <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Anomalies</h3>
          <div className="mt-2 text-3xl font-bold text-white">{data.anomalies.length}</div>
          <p className="text-xs text-gray-500 mt-1">Detected events requiring attention</p>
        </div>

        <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Actions Needed</h3>
          <div className="mt-2 text-3xl font-bold text-cyber-accent">
            {data.suggestions.filter(s => s.priority === 'Immediate' || s.priority === 'High').length}
          </div>
          <p className="text-xs text-gray-500 mt-1">High priority mitigations</p>
        </div>

        <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 shadow-lg">
             <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Status</h3>
             <div className="mt-2 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-white font-medium">Monitoring Active</span>
             </div>
             <p className="text-xs text-gray-500 mt-1">Real-time analysis complete</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Distribution Chart */}
        <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-6">Threat Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.threatDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.threatDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Bar Chart */}
        <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-6">Anomalies by Severity</h3>
          <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart
                 data={[
                   { name: 'Low', count: data.anomalies.filter(a => a.severity === RiskLevel.LOW).length },
                   { name: 'Medium', count: data.anomalies.filter(a => a.severity === RiskLevel.MEDIUM).length },
                   { name: 'High', count: data.anomalies.filter(a => a.severity === RiskLevel.HIGH).length },
                   { name: 'Critical', count: data.anomalies.filter(a => a.severity === RiskLevel.CRITICAL).length },
                 ]}
                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
               >
                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                 <XAxis dataKey="name" stroke="#94a3b8" />
                 <YAxis stroke="#94a3b8" />
                 <Tooltip 
                    cursor={{fill: '#334155', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                 />
                 <Bar dataKey="count" fill="#3b82f6">
                    {
                        [
                           { name: 'Low', color: '#10b981' },
                           { name: 'Medium', color: '#f59e0b' },
                           { name: 'High', color: '#f97316' },
                           { name: 'Critical', color: '#ef4444' },
                        ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))
                    }
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Anomalies Table */}
      <div className="bg-cyber-800 rounded-xl border border-cyber-700 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-cyber-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Suspicious Events Log</h3>
            <span className="text-xs text-gray-400 bg-cyber-900 px-2 py-1 rounded border border-cyber-700">Live View</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-cyber-900 text-gray-200 uppercase font-medium text-xs">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Event Type</th>
                <th className="px-6 py-3">Severity</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Source IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-700">
              {data.anomalies.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No anomalies detected in the current dataset.
                    </td>
                 </tr>
              ) : (
                data.anomalies.map((anomaly, idx) => (
                    <tr key={idx} className="hover:bg-cyber-700/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-white">{anomaly.timestamp}</td>
                    <td className="px-6 py-4 text-white font-medium">{anomaly.eventType}</td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                            anomaly.severity === RiskLevel.CRITICAL ? 'bg-red-500/20 text-red-500' :
                            anomaly.severity === RiskLevel.HIGH ? 'bg-orange-500/20 text-orange-500' :
                            anomaly.severity === RiskLevel.MEDIUM ? 'bg-amber-500/20 text-amber-500' :
                            'bg-emerald-500/20 text-emerald-500'
                        }`}>
                        {anomaly.severity}
                        </span>
                    </td>
                    <td className="px-6 py-4">{anomaly.description}</td>
                    <td className="px-6 py-4 font-mono text-cyber-accent">{anomaly.sourceIp || 'N/A'}</td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RiskDashboard;