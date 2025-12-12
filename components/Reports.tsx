import React from 'react';
import { AnalysisResult } from '../types';
import { FileText, Download, Share2, Printer } from 'lucide-react';

interface Props {
  data: AnalysisResult;
}

const Reports: React.FC<Props> = ({ data }) => {
  const handleExportCSV = () => {
    // Simple CSV export logic
    const headers = "Timestamp,EventType,Severity,Description,SourceIP\n";
    const rows = data.anomalies.map(a => 
      `${a.timestamp},${a.eventType},${a.severity},"${a.description}",${a.sourceIp || 'N/A'}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyber_report_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-white">Security Report Generation</h2>
        <p className="text-gray-400">Export findings for compliance and audit trails.</p>
      </div>

      <div className="bg-cyber-800 rounded-xl border border-cyber-700 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-cyber-700 bg-white text-black">
           {/* Mock PDF Header style */}
           <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">CyberSafe AI Analysis Report</h1>
                    <p className="text-slate-500 text-sm mt-1">Generated: {new Date().toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <div className="text-sm font-bold uppercase text-slate-400 tracking-widest">Risk Assessment</div>
                    <div className={`text-2xl font-bold ${
                        data.riskLevel === 'Critical' || data.riskLevel === 'High' ? 'text-red-600' : 'text-green-600'
                    }`}>
                        {data.riskLevel.toUpperCase()}
                    </div>
                </div>
           </div>

           <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-bold uppercase text-slate-400 border-b border-slate-200 pb-1 mb-2">Executive Summary</h3>
                    <p className="text-slate-700 leading-relaxed">{data.summary}</p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-sm font-bold uppercase text-slate-400 border-b border-slate-200 pb-1 mb-2">Metrics</h3>
                        <ul className="text-sm text-slate-700 space-y-1">
                            <li className="flex justify-between"><span>Risk Score:</span> <span className="font-mono font-bold">{data.riskScore}/100</span></li>
                            <li className="flex justify-between"><span>Total Anomalies:</span> <span className="font-mono font-bold">{data.anomalies.length}</span></li>
                            <li className="flex justify-between"><span>Critical Events:</span> <span className="font-mono font-bold">{data.anomalies.filter(a => a.severity === 'Critical').length}</span></li>
                        </ul>
                    </div>
                    <div>
                         <h3 className="text-sm font-bold uppercase text-slate-400 border-b border-slate-200 pb-1 mb-2">Top Recommendation</h3>
                         <p className="text-sm text-slate-700 italic">
                            {data.suggestions[0]?.action || "No immediate actions required."}
                         </p>
                    </div>
                </div>
           </div>
        </div>

        {/* Action Bar */}
        <div className="p-6 bg-cyber-800 flex justify-between items-center">
            <span className="text-gray-400 text-sm">Preview Mode</span>
            <div className="flex space-x-3">
                <button 
                    onClick={handleExportCSV}
                    className="flex items-center space-x-2 px-4 py-2 bg-cyber-700 hover:bg-cyber-600 text-white rounded-lg transition-colors"
                >
                    <FileText size={18} />
                    <span>Download CSV</span>
                </button>
                 <button 
                    onClick={() => alert("PDF Export functionality would be implemented here using a library like jsPDF.")}
                    className="flex items-center space-x-2 px-4 py-2 bg-cyber-accent hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                    <Download size={18} />
                    <span>Download PDF</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;