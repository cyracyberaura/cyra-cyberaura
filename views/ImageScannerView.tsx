
import React, { useState } from 'react';
import { scanImage } from '../services/geminiService';
import { ScanResult, SafetyStatus } from '../types';

interface ImageScannerViewProps {
  onBack: () => void;
}

const ImageScannerView: React.FC<ImageScannerViewProps> = ({ onBack }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        setPreview(event.target?.result as string);
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-300 pb-10">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-cyan-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        <span>Back</span>
      </button>

      <h1 className="text-2xl font-black mb-2">Image Scanner</h1>
      <p className="text-sm text-slate-400 mb-8 font-medium">Detect phishing screenshots, fraudulent messages, and suspicious graphics using AI Vision.</p>

      {!preview ? (
        <div className="border-2 border-dashed border-slate-700 rounded-3xl p-16 flex flex-col items-center justify-center text-center gap-4 bg-slate-800/20 relative group hover:border-cyan-500/50 transition-all">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-3xl">🖼️</div>
          <p className="text-sm font-bold text-slate-400">Upload Screenshot or Image</p>
          <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative rounded-3xl overflow-hidden border border-slate-700">
            <img src={preview} alt="Scan Target" className="w-full object-cover max-h-64" />
            <button onClick={() => setPreview(null)} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white backdrop-blur-md">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          {loading && (
            <div className="p-6 rounded-2xl bg-slate-800 animate-pulse text-center">
               <p className="text-cyan-400 font-black text-sm uppercase tracking-widest">AI Vision Scanning...</p>
            </div>
          )}

          {result && (
            <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-700 animate-in zoom-in-95">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${result.status === SafetyStatus.SAFE ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                   {result.status === SafetyStatus.SAFE ? '✅' : '🚨'}
                </div>
                <div>
                   <h2 className={`font-black ${result.status === SafetyStatus.SAFE ? 'text-emerald-400' : 'text-rose-500'}`}>{result.status.toUpperCase()}</h2>
                   <p className="text-[10px] text-slate-500 uppercase font-black">Risk: {result.riskLevel}</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">{result.explanation}</p>
              <div className="pt-4 border-t border-slate-700 space-y-2">
                {result.recommendations.map((r, i) => (
                  <p key={i} className="text-xs text-slate-500 flex gap-2"><span>•</span> {r}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageScannerView;
