import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import FileUpload from './components/FileUpload';
import RiskDashboard from './components/RiskDashboard';
import ActionList from './components/ActionList';
import Reports from './components/Reports';
import { AnalysisResult, RiskLevel, TabView } from './types';
import { SAMPLE_LOGS, EMPTY_RESULT } from './constants';
import { analyzeSecurityData } from './services/geminiService';
import { AlertTriangle, X } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>('upload');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(EMPTY_RESULT);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVoiceAlert, setShowVoiceAlert] = useState(false);

  // Voice Alert Logic
  useEffect(() => {
    if (analysisResult.riskLevel === RiskLevel.HIGH || analysisResult.riskLevel === RiskLevel.CRITICAL) {
      triggerVoiceAlert(`Alert. High risk detected. ${analysisResult.summary.substring(0, 100)}`);
    }
  }, [analysisResult]);

  const triggerVoiceAlert = (text: string) => {
    if ('speechSynthesis' in window) {
      setShowVoiceAlert(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 0.9; // Slightly lower pitch for serious tone
      utterance.onend = () => setTimeout(() => setShowVoiceAlert(false), 2000);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAnalysis = async (logFile: File | null, imageFiles: File[], textData: string | null) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      // If no textData provided but file exists, wait for reader in FileUpload component
      // In this flow, FileUpload passes the text string directly.
      
      const textToAnalyze = textData || ""; 

      const result = await analyzeSecurityData(textToAnalyze, imageFiles);
      setAnalysisResult(result);
      setActiveTab('dashboard');
    } catch (err: any) {
      setError(err.message || "Failed to analyze data. Please check your API key and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSampleData = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeSecurityData(SAMPLE_LOGS, []);
      setAnalysisResult(result);
      setActiveTab('dashboard');
    } catch (err: any) {
      // Fallback if API fails during demo (e.g., no key)
      console.warn("API failed, using fallback mock for demo", err);
      // We could set a hardcoded fallback here if we wanted to be robust against missing keys
      setError("Demo requires a valid API Key to analyze the sample text.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return <FileUpload onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} onUseSample={loadSampleData} />;
      case 'dashboard':
        return <RiskDashboard data={analysisResult} />;
      case 'actions':
        return <ActionList suggestions={analysisResult.suggestions} />;
      case 'reports':
        return <Reports data={analysisResult} />;
      default:
        return <FileUpload onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} onUseSample={loadSampleData} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* Voice Alert Visual Indicator */}
      {showVoiceAlert && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center space-x-3 animate-bounce">
          <AlertTriangle className="animate-pulse" />
          <span className="font-bold">AUDIO ALERT ACTIVE</span>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)}><X size={20} /></button>
        </div>
      )}

      {renderContent()}
    </Layout>
  );
};

export default App;