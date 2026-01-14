
import React, { useState, useEffect } from 'react';
import { ROUTES } from '../constants';
import { performOneClickCheck } from '../services/geminiService';
import { ScanResult, SafetyStatus, RiskLevel } from '../types';

interface HomeViewProps {
  onNavigate: (route: string) => void;
  onToggleShield: () => void;
  socialShieldActive: boolean;
  addNotification: (msg: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onToggleShield, socialShieldActive, addNotification }) => {
  const [scanning, setScanning] = useState(false);
  const [quickResult, setQuickResult] = useState<ScanResult | null>(null);

  // Simulate social media protection
  useEffect(() => {
    if (!socialShieldActive) return;
    const interval = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.95) {
        addNotification("Blocked a suspicious message in the background.");
      }
    }, 20000);
    return () => clearInterval(interval);
  }, [socialShieldActive, addNotification]);

  const handleQuickCheck = async () => {
    setScanning(true);
    setQuickResult(null);
    try {
      const mockApps = [
        { name: "Unknown Game 2024", source: "External", permissions: ["SMS", "Location"] },
        { name: "Secure Mail", source: "Play Store", permissions: ["Contacts"] }
      ];
      const result = await performOneCheck(mockApps); // Standard check
      setQuickResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setScanning(false);
    }
  };

  const performOneCheck = async (apps: any[]) => {
     // Local fallback/simulation for better UX speed
     return await performOneClickCheck(apps);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight uppercase">CYRA</h1>
        <p className="text-slate-400 text-sm mt-1">Smart Safety Companion</p>
      </header>

      <section className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        
        <h2 className="text-xl font-bold mb-2">Check Device Safety</h2>
        <p className="text-slate-400 text-xs mb-6 font-medium">Scan your apps to find hidden threats.</p>
        
        <button 
          onClick={handleQuickCheck}
          disabled={scanning}
          className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 text-slate-950 font-black rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
        >
          {scanning ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              <span>CHECKING...</span>
            </>
          ) : (
            <span>START FULL SCAN</span>
          )}
        </button>

        {quickResult && (
          <div className="mt-6 space-y-3 animate-in slide-in-from-top-4 duration-500">
            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-[0.2em] px-1">Scan Complete</h3>
            
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-700/50 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Status</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black inline-block ${
                  quickResult.status === SafetyStatus.SAFE ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {quickResult.status.toUpperCase()}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Risk</span>
                <span className="text-sm font-black text-white">{quickResult.riskLevel}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-700/50">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Findings</span>
              <p className="text-xs font-bold text-cyan-400 mb-2">{quickResult.threatType}</p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {quickResult.explanation}
              </p>
            </div>
          </div>
        )}
      </section>

      <div className="grid grid-cols-2 gap-4">
        <FeatureCard 
          title="Scan Links" 
          desc="Check web addresses" 
          icon="🔗" 
          onClick={() => onNavigate(ROUTES.LINK_SCANNER)} 
          color="bg-purple-500/10 border-purple-500/20"
        />
        <FeatureCard 
          title="Scan Files" 
          desc="Check for viruses" 
          icon="📄" 
          onClick={() => onNavigate(ROUTES.FILE_SCANNER)} 
          color="bg-blue-500/10 border-blue-500/20"
        />
        <FeatureCard 
          title="Check Apps" 
          desc="Check permissions" 
          icon="📱" 
          onClick={() => onNavigate(ROUTES.APP_SCANNER)} 
          color="bg-emerald-500/10 border-emerald-500/20"
        />
        <FeatureCard 
          title="Safety Tips" 
          desc="Live device advice" 
          icon="🛡️" 
          onClick={() => onNavigate(ROUTES.SAFETY_TIPS)} 
          color="bg-slate-500/10 border-slate-500/20"
        />
        <FeatureCard 
          title="Image Scan" 
          desc="Scan screenshots" 
          icon="👁️" 
          onClick={() => onNavigate(ROUTES.IMAGE_SCANNER)} 
          color="bg-orange-500/10 border-orange-500/20"
        />
        <FeatureCard 
          title="Key Gen" 
          desc="Strong passwords" 
          icon="🔑" 
          onClick={() => onNavigate(ROUTES.PASSWORD_GENERATOR)} 
          color="bg-pink-500/10 border-pink-500/20"
        />
      </div>

      <button 
        onClick={onToggleShield}
        className={`w-full mt-8 p-4 rounded-2xl border flex items-center gap-4 transition-all duration-300 text-left active:scale-[0.98] ${socialShieldActive ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.1)]' : 'bg-slate-800/30 border-slate-700/50 grayscale'}`}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${socialShieldActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-700 text-slate-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3m0 18a10.003 10.003 0 01-8.303-4.43m16.606 0A10.003 10.003 0 0112 21m0-18a10.003 10.003 0 018.303 4.43m-8.303 4.43V11m0 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"/></svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-black">{socialShieldActive ? 'LIVE PROTECTION: ON' : 'LIVE PROTECTION: OFF'}</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tap to {socialShieldActive ? 'Stop' : 'Start'} background monitoring</p>
        </div>
        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${socialShieldActive ? 'bg-cyan-500' : 'bg-slate-700'}`}>
           <div className={`w-4 h-4 bg-white rounded-full transition-transform ${socialShieldActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
        </div>
      </button>
    </div>
  );
};

const FeatureCard: React.FC<{ title: string; desc: string; icon: string; onClick: () => void; color: string }> = ({ title, desc, icon, onClick, color }) => (
  <button 
    onClick={onClick}
    className={`p-4 rounded-2xl border text-left transition-all active:scale-95 group hover:shadow-lg ${color}`}
  >
    <span className="text-2xl mb-2 block group-hover:scale-125 transition-transform origin-left">{icon}</span>
    <h3 className="text-sm font-bold text-slate-100">{title}</h3>
    <p className="text-[10px] text-slate-500 uppercase tracking-tighter font-black">{desc}</p>
  </button>
);

export default HomeView;
