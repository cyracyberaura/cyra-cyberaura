
import React, { useState } from 'react';
import { scanImage } from '../services/geminiService';
import { ScanResult, SafetyStatus } from '../types';

interface ImageScannerViewProps {
  onBack: () => void;
}

const ImageScannerView: React.FC<ImageScannerViewProps> = ({ onBack }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fullDataUrl = event.target?.result as string;
        const base64 = fullDataUrl.split(',')[1];
        setPreview(fullDataUrl);
        triggerScan(base64, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerScan = async (base64: string, type: string) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await scanImage(base64, type);
      setResult(res);
    } catch (err) {
      console.error("Scan Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-300 pb-12">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        <span className="font-bold text-sm">Back to Home</span>
      </button>

      <h1 className="text-2xl font-black mb-2">Visual Threat Scanner</h1>
      <p className="text-sm text-slate-400 mb-8 leading-relaxed">Scan screenshots to find where they came from and if they contain hidden scams.</p>

      {!preview ? (
        <div className="border-2 border-dashed border-slate-700 rounded-3xl p-16 flex flex-col items-center justify-center text-center gap-4 bg-slate-800/20 relative group hover:border-cyan-500/50 transition-all">
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-4xl shadow-xl group-hover:scale-110 transition-transform">🖼️</div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-200">Tap to Upload Image</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Screenshots, Downloads, or Photos</p>
          </div>
          <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative rounded-3xl overflow-hidden border-2 border-slate-700/50 shadow-2xl bg-slate-950">
            <img src={preview} alt="Scan Target" className="w-full object-contain max-h-[300px]" />
            <button 
              onClick={() => { setPreview(null); setResult(null); }} 
              className="absolute top-4 right-4 bg-rose-600 p-2 rounded-full text-white shadow-lg active:scale-90 transition-all"
            >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            {loading && (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                <p className="text-cyan-400 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Scanning Visuals...</p>
              </div>
            )}
          </div>

          {result && (
            <div className="space-y-4 animate-in slide-in-from-bottom-6 duration-500">
              <h3 className="text-xs font-black text-cyan-400 uppercase tracking-[0.2em] px-1">Scan Results</h3>
              
              {/* Box 1: Status & Origin */}
              <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 grid grid-cols-2 gap-6">
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Safety Status</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black inline-block ${
                    result.status === SafetyStatus.SAFE ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {result.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Likely Source</span>
                  <span className="text-xs font-black text-white truncate block">{result.imageOrigin || "Unknown"}</span>
                </div>
              </div>

              {/* Box 2: Analysis & Technical Details */}
              <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-4">
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Safety Analysis</span>
                  <p className="text-xs text-slate-300 leading-relaxed italic">{result.explanation}</p>
                </div>
                <div className="pt-3 border-t border-slate-700/50">
                  <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Technical Observation</span>
                  <p className="text-[11px] text-cyan-400/80 font-mono">{result.technicalDetails}</p>
                </div>
              </div>

              {/* Box 3: Recommendations */}
              <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-700/50 shadow-inner">
                <span className="text-[10px] font-black text-slate-500 uppercase block mb-3 tracking-widest">Recommended Actions</span>
                <ul className="space-y-3">
                  {result.recommendations.map((r, i) => (
                    <li key={i} className="text-xs text-slate-400 flex gap-3 items-start">
                      <span className="text-cyan-400 font-bold">●</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => { setPreview(null); setResult(null); }}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-black rounded-2xl border border-slate-700 transition-all uppercase tracking-widest"
              >
                Scan Another Image
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageScannerView;
