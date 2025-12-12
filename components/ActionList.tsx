import React from 'react';
import { Suggestion } from '../types';
import { Shield, Server, FileWarning, ArrowRight, AlertTriangle } from 'lucide-react';

interface Props {
  suggestions: Suggestion[];
}

const ActionList: React.FC<Props> = ({ suggestions }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Immediate': return 'border-l-4 border-red-500 bg-red-500/5';
      case 'High': return 'border-l-4 border-orange-500 bg-orange-500/5';
      default: return 'border-l-4 border-blue-500 bg-blue-500/5';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Network': return <Server className="text-blue-400" size={20} />;
      case 'Policy': return <FileWarning className="text-yellow-400" size={20} />;
      case 'System': return <Shield className="text-green-400" size={20} />;
      default: return <Shield className="text-gray-400" size={20} />;
    }
  };

  if (suggestions.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-12 text-gray-500">
            <Shield size={64} className="mb-4 opacity-20" />
            <p>No actionable suggestions available at this time.</p>
        </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h2 className="text-2xl font-bold text-white">Mitigation Strategies</h2>
            <p className="text-gray-400">Recommended actions based on detected threats.</p>
        </div>
        <div className="bg-cyber-800 px-4 py-2 rounded-lg border border-cyber-700 flex items-center space-x-2">
            <AlertTriangle className="text-orange-500" size={18} />
            <span className="text-sm font-medium text-white">{suggestions.length} Actions Identified</span>
        </div>
      </div>

      <div className="grid gap-4">
        {suggestions.map((suggestion, idx) => (
          <div 
            key={idx} 
            className={`relative p-6 rounded-r-lg bg-cyber-800 border border-cyber-700 shadow-md transition-all hover:bg-cyber-700/50 ${getPriorityColor(suggestion.priority)}`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="mt-1 p-2 bg-cyber-900 rounded-lg border border-cyber-700">
                    {getTypeIcon(suggestion.type)}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-white">{suggestion.action}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold tracking-wider 
                        ${suggestion.priority === 'Immediate' ? 'bg-red-500 text-white' : 
                          suggestion.priority === 'High' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'}`}>
                        {suggestion.priority}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{suggestion.reason}</p>
                </div>
              </div>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-cyber-900 hover:bg-black border border-cyber-600 rounded-md text-sm text-cyber-accent transition-colors whitespace-nowrap">
                <span>Execute Protocol</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionList;