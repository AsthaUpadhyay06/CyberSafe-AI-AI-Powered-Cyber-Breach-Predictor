import React, { useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, Cpu, Play } from 'lucide-react';

interface Props {
  onAnalyze: (logFile: File | null, imageFiles: File[], textData: string | null) => void;
  isAnalyzing: boolean;
  onUseSample: () => void;
}

const FileUpload: React.FC<Props> = ({ onAnalyze, isAnalyzing, onUseSample }) => {
  const [logFile, setLogFile] = React.useState<File | null>(null);
  const [images, setImages] = React.useState<File[]>([]);
  const logInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleLogChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogFile(e.target.files[0]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleAnalyzeClick = () => {
    if (!logFile && images.length === 0) return;
    
    if (logFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            onAnalyze(logFile, images, text);
        };
        reader.readAsText(logFile);
    } else {
        // Just images
        onAnalyze(null, images, "");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">System Breach Analysis</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Upload your server logs (TXT, CSV) and network topology diagrams (PNG, JPG). 
          Our AI will analyze patterns to detect potential cyber threats.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Log Upload Area */}
        <div 
            onClick={() => logInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group
            ${logFile ? 'border-cyber-accent bg-cyber-accent/5' : 'border-cyber-700 hover:border-cyber-500 hover:bg-cyber-800'}`}
        >
            <input 
                type="file" 
                ref={logInputRef} 
                className="hidden" 
                accept=".txt,.csv,.log" 
                onChange={handleLogChange} 
            />
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${logFile ? 'bg-cyber-accent text-white' : 'bg-cyber-800 text-gray-400 group-hover:bg-cyber-700'}`}>
                <FileText size={32} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Upload System Logs</h3>
            <p className="text-sm text-gray-500 text-center">
                {logFile ? logFile.name : "Drag & drop or click to upload .txt, .csv, .log"}
            </p>
        </div>

        {/* Image Upload Area */}
        <div 
            onClick={() => imageInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group
            ${images.length > 0 ? 'border-cyber-accent bg-cyber-accent/5' : 'border-cyber-700 hover:border-cyber-500 hover:bg-cyber-800'}`}
        >
            <input 
                type="file" 
                ref={imageInputRef} 
                className="hidden" 
                accept="image/*" 
                multiple 
                onChange={handleImageChange} 
            />
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${images.length > 0 ? 'bg-cyber-accent text-white' : 'bg-cyber-800 text-gray-400 group-hover:bg-cyber-700'}`}>
                <ImageIcon size={32} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Upload Diagrams</h3>
            <p className="text-sm text-gray-500 text-center">
                {images.length > 0 ? `${images.length} file(s) selected` : "Network topology, Architecture diagrams"}
            </p>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4 pt-4">
        <button
            onClick={handleAnalyzeClick}
            disabled={(!logFile && images.length === 0) || isAnalyzing}
            className={`
                px-8 py-4 rounded-lg font-bold text-lg flex items-center space-x-3 shadow-lg shadow-cyber-accent/20 transition-all
                ${(!logFile && images.length === 0) || isAnalyzing 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-cyber-accent to-blue-600 text-white hover:scale-105 hover:shadow-cyber-accent/40'}
            `}
        >
            {isAnalyzing ? (
                <>
                    <Cpu className="animate-spin" />
                    <span>Analyzing Neural Patterns...</span>
                </>
            ) : (
                <>
                    <Cpu />
                    <span>Run Security Analysis</span>
                </>
            )}
        </button>

        <div className="flex items-center space-x-2 text-gray-500">
            <span className="text-sm">Or try without files:</span>
            <button 
                onClick={onUseSample}
                className="text-sm text-cyber-accent hover:underline flex items-center space-x-1"
            >
                <Play size={14} />
                <span>Load Sample Data Demo</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;