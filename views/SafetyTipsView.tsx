
import React, { useState, useEffect } from 'react';
import { getSafetyTips } from '../services/geminiService';

interface SafetyTipsViewProps {
  onBack: () => void;
}

const SafetyTipsView: React.FC<SafetyTipsViewProps> = ({ onBack }) => {
  const [data, setData] = useState<{ title: string; tips: { text: string; urgent: boolean }[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTips = async () => {
    setLoading(true);
    try {
      const res = await getSafetyTips();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  return (
    <div className="animate-in slide-in-from-right duration-300 pb-12">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-cyan-400 font-bold text-sm uppercase">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        <span>Go Back</span>
      </button>

      <h1 className="text-2xl font-black mb-2 uppercase tracking-tight">Safety Tips</h1>
      <p className="text-sm text-slate-400 mb-8 font-medium">Follow these simple points to keep your phone safe.</p>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
          <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Looking for tips...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl">
             <div className="bg-slate-900 rounded-[22px] p-6">
               <h2 className="text-xl font-black mb-1 uppercase">{data?.title || 'What you should do'}</h2>
               <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Last Check: Just Now</p>
             </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">List of Points</h3>
            {data?.tips.map((tip, i) => (
              <div 
                key={i} 
                className={`p-5 rounded-3xl border transition-all ${
                  tip.urgent ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-800/30 border-slate-700/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-black ${
                    tip.urgent ? 'bg-rose-500 text-white' : 'bg-slate-700 text-cyan-400'
                  }`}>
                    {i + 1}
                  </div>
                  <div>
                    {tip.urgent && (
                      <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest block mb-1">Very Important!</span>
                    )}
                    <p className="text-sm text-slate-200 leading-relaxed font-bold uppercase tracking-tight">{tip.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={fetchTips}
            className="w-full py-4 bg-slate-800 border border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-colors"
          >
            Get More Tips
          </button>
        </div>
      )}
    </div>
  );
};

export default SafetyTipsView;
