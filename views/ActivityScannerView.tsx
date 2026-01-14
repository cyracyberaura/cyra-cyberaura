
import React, { useState, useEffect } from 'react';
import { AppActivity } from '../types';

interface ActivityScannerViewProps {
  onBack: () => void;
}

interface AppInfo extends AppActivity {
  permissions: string[];
}

const ActivityScannerView: React.FC<ActivityScannerViewProps> = ({ onBack }) => {
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching installed apps with detailed permission data
    const timer = setTimeout(() => {
      setApps([
        { name: 'WhatsApp', permissionCount: 12, lastActive: '2m ago', riskScore: 10, isUnknownSource: false, permissions: ['Contacts', 'Microphone', 'Camera', 'Storage'] },
        { name: 'X (Twitter)', permissionCount: 8, lastActive: '10m ago', riskScore: 15, isUnknownSource: false, permissions: ['Location', 'Camera', 'Microphone'] },
        { name: 'FastCleaner Pro', permissionCount: 22, lastActive: 'Just now', riskScore: 78, isUnknownSource: true, permissions: ['SMS', 'Call Logs', 'Files', 'Location', 'Storage'] },
        { name: 'PDF Master', permissionCount: 5, lastActive: '1h ago', riskScore: 45, isUnknownSource: true, permissions: ['Storage', 'Location'] },
      ]);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="animate-in slide-in-from-right duration-300 pb-20">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-cyan-400 font-bold text-sm">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        <span>Back</span>
      </button>

      <h1 className="text-2xl font-black mb-2 uppercase tracking-tight">App Check</h1>
      <p className="text-sm text-slate-400 mb-8 font-medium">Detailed list of permissions used by your installed apps.</p>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-black tracking-widest uppercase">Fetching Permissions...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {apps.sort((a, b) => b.riskScore - a.riskScore).map((app, i) => (
            <div key={i} className={`p-5 rounded-3xl border flex flex-col gap-4 transition-all ${
              app.riskScore > 60 ? 'bg-rose-500/5 border-rose-500/20' : 'bg-slate-800/30 border-slate-700/50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                    app.riskScore > 60 ? 'bg-rose-500/20' : 'bg-slate-800'
                  }`}>
                    {app.isUnknownSource ? '🚨' : '✅'}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-100">{app.name}</h3>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{app.lastActive}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-black ${
                    app.riskScore > 60 ? 'text-rose-500' : app.riskScore > 30 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {app.riskScore}%
                  </div>
                  <div className="text-[8px] text-slate-500 uppercase tracking-widest font-black">Risk Score</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/30">
                <h4 className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Allowed Permissions</h4>
                <div className="flex flex-wrap gap-2">
                  {app.permissions.map((perm, pi) => (
                    <span key={pi} className="px-3 py-1 bg-slate-800 text-cyan-400 text-[10px] font-black rounded-lg border border-slate-700 uppercase tracking-tighter">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>

              {app.riskScore > 60 && (
                <div className="mt-2 p-3 bg-rose-500/10 rounded-xl flex items-center gap-3">
                  <span className="text-rose-500">⚠️</span>
                  <p className="text-[10px] text-rose-400/80 font-bold uppercase">Sensitive permissions detected. Consider removing if not needed.</p>
                </div>
              )}
            </div>
          ))}
          
          <div className="mt-8 p-6 rounded-3xl bg-cyan-500/5 border border-cyan-500/20 flex gap-4">
             <span className="text-2xl">💡</span>
             <p className="text-[11px] text-slate-400 italic leading-relaxed font-medium">
               Applications with access to <span className="text-cyan-400 font-bold">SMS</span> or <span className="text-cyan-400 font-bold">Location</span> should be monitored closely. Cyra found 2 apps from unknown stores.
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityScannerView;
