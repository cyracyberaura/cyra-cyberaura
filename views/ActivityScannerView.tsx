
import React, { useState, useEffect } from 'react';
import { AppActivity } from '../types';

interface ActivityScannerViewProps {
  onBack: () => void;
}

const ActivityScannerView: React.FC<ActivityScannerViewProps> = ({ onBack }) => {
  const [apps, setApps] = useState<AppActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching installed apps
    const timer = setTimeout(() => {
      setApps([
        { name: 'WhatsApp', permissionCount: 12, lastActive: '2m ago', riskScore: 10, isUnknownSource: false },
        { name: 'X (Twitter)', permissionCount: 8, lastActive: '10m ago', riskScore: 15, isUnknownSource: false },
        { name: 'FastCleaner Pro', permissionCount: 22, lastActive: 'Just now', riskScore: 78, isUnknownSource: true },
        { name: 'Unknown PDF Reader', permissionCount: 5, lastActive: '1h ago', riskScore: 45, isUnknownSource: true },
      ]);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="animate-in slide-in-from-right duration-300">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-cyan-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        <span>Back</span>
      </button>

      <h1 className="text-2xl font-black mb-2">App Activities</h1>
      <p className="text-sm text-slate-400 mb-8 font-medium">Monitoring permissions and background services for anomalies.</p>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-bold tracking-widest">SCANNING INSTALLED PACKAGES...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {apps.sort((a, b) => b.riskScore - a.riskScore).map((app, i) => (
            <div key={i} className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
              app.riskScore > 60 ? 'bg-rose-500/5 border-rose-500/20' : 'bg-slate-800/30 border-slate-700/50'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                  app.riskScore > 60 ? 'bg-rose-500/20' : 'bg-slate-800'
                }`}>
                  {app.isUnknownSource ? '⚠️' : '📱'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-100">{app.name}</h3>
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">{app.lastActive}</span>
                    <span className="text-slate-700">•</span>
                    <span className="text-[10px] text-cyan-400/70 font-bold">{app.permissionCount} Perms</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-black ${
                  app.riskScore > 60 ? 'text-rose-500' : app.riskScore > 30 ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {app.riskScore}%
                </div>
                <div className="text-[8px] text-slate-500 uppercase tracking-widest font-black">Risk Score</div>
              </div>
            </div>
          ))}
          
          <div className="mt-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
             <span className="text-xl">💡</span>
             <p className="text-xs text-amber-200/70 italic leading-relaxed">
               Cyra detected 2 apps from unknown sources. High risk scores indicate potential spyware or excessive data collection.
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityScannerView;
