
import React, { useState } from 'react';
import { analyzeFileMetadata } from '../services/geminiService';
import { ScanResult, SafetyStatus } from '../types';

interface FileScannerViewProps {
  onBack: () => void;
}

const FileScannerView: React.FC<FileScannerViewProps> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        let base64 = undefined;
        if (file.type.startsWith('image/')) {
           base64 = (event.target?.result as string).split(',')[1];
        }
        const scanResult = await analyzeFileMetadata(file.name, file.type || 'Unknown', base64);
        setResult(scanResult);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-300 pb-10">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-cyan-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        <span>Back</span>
      </button>

      <h1 className="text-2xl font-black mb-2">File Inspector</h1>
      <p className="text-sm text-slate-400 mb-8 font-medium">Upload documents or APKs for cross-referenced threat intelligence.</p>

      <div className="space-y-6">
        <div className="border-2 border-dashed border-slate-700 rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-4 bg-slate-800/20 group hover:border-cyan-500/50 transition-all relative">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl text-slate-500 group-hover:scale-110 transition-transform">
            📁
          </div>
          <div>
            <p className="text-sm font-bold text-slate-200">
              {file ? file.name : "Select or Drop File"}
            </p>
            <p className="text-[10px] text-slate-500 uppercase mt-1">MAX 50MB (APK, PDF, ZIP, IMG)</p>
          </div>
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={handleFileChange}
          />
        </div>

        <button 
          onClick={handleScan}
          disabled={loading || !file}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>INSPECTING FILE...</span>
            </>
          ) : (
            <span>START INSPECTION</span>
          )}
        </button>

        {result && (
          <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-700 animate-in fade-in zoom-in-95">
             <div className="flex items-center gap-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                result.status === SafetyStatus.SAFE ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-500'
              }`}>
                {result.status} Result
              </span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Risk: {result.riskLevel}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">{result.threatType}</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{result.explanation}</p>
            <div className="pt-4 border-t border-slate-700">
               <h4 className="text-[10px] font-black text-cyan-400 uppercase mb-2 tracking-widest">Safety Advice</h4>
               <ul className="space-y-2">
                 {result.recommendations.map((r, i) => (
                   <li key={i} className="text-xs text-slate-400 flex gap-2"><span>▹</span> {r}</li>
                 ))}
               </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileScannerView;
