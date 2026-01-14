
import React, { useState } from 'react';
import { analyzeLink } from '../services/geminiService';
import { ScanResult, SafetyStatus } from '../types';

interface LinkScannerViewProps {
  onBack: () => void;
}

const LinkScannerView: React.FC<LinkScannerViewProps> = ({ onBack }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null);
    try {
      const scanResult = await analyzeLink(url);
      setResult(scanResult);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-300">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-cyan-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        <span>Back</span>
      </button>

      <h1 className="text-2xl font-black mb-2">Link Scanner</h1>
      <p className="text-sm text-slate-400 mb-8 font-medium">Instantly detect phishing, malware, and fraudulent redirects.</p>

      <div className="space-y-4">
        <div className="relative">
          <input 
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste URL (e.g., https://pay-verify.me)"
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
          />
        </div>

        <button 
          onClick={handleScan}
          disabled={loading || !url}
          className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              <span>CHECKING LINK...</span>
            </>
          ) : (
            <span>SCAN LINK</span>
          )}
        </button>

        {result && (
          <div className="mt-8 p-6 rounded-3xl bg-slate-800/50 border border-slate-700 animate-in zoom-in-95">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                result.status === SafetyStatus.SAFE ? 'bg-emerald-500/20' : 'bg-rose-500/20'
              }`}>
                {result.status === SafetyStatus.SAFE ? '🛡️' : '🚨'}
              </div>
              <div>
                <h2 className={`text-xl font-black ${
                  result.status === SafetyStatus.SAFE ? 'text-emerald-400' : 'text-rose-500'
                }`}>
                  {result.status.toUpperCase()}
                </h2>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Risk Level: {result.riskLevel}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Threat Type</h4>
                <p className="text-sm text-slate-200 font-medium">{result.threatType}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Detailed Report</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{result.explanation}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Action Steps</h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-2 text-xs text-slate-400">
                      <span className="text-cyan-400">▹</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkScannerView;
