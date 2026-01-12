
import React, { useState, useEffect } from 'react';
import { ROUTES } from '../constants';
import { performOneClickCheck } from '../services/geminiService';
import { ScanResult, SafetyStatus, RiskLevel } from '../types';

interface HomeViewProps {
  onNavigate: (route: string) => void;
  socialShieldActive: boolean;
  addNotification: (msg: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate, socialShieldActive, addNotification }) => {
  const [scanning, setScanning] = useState(false);
  const [quickResult, setQuickResult] = useState<ScanResult | null>(null);

  // Simulate social media protection
  useEffect(() => {
    if (!socialShieldActive) return;
    const interval = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.95) {
        addNotification("Social Shield blocked a suspicious WhatsApp link attempt.");
      }
    }, 15000);
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
      const result = await performOneClickCheck(mockApps);
      setQuickResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">CYRA</h1>
        <p className="text-slate-400 text-sm mt-1">Cyber Aura Intelligent Protection</p>
      </header>

      <section className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        
        <h2 className="text-xl font-bold mb-2">Device Shield</h2>
        <p className="text-slate-400 text-xs mb-6">Run a comprehensive health scan for apps, permissions, and network activity.</p>
        
        <button 
          onClick={handleQuickCheck}
          disabled={scanning}
          className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 text-slate-950 font-black rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
        >
          {scanning ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              <span>SCANNING CORE...</span>
            </>
          ) : (
            <span>ACTIVATE SHIELD</span>
          )}
        </button>

        {quickResult && (
          <div className="mt-6 p-4 rounded-xl bg-slate-950/50 border border-cyan-500/30 animate-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Scan Complete</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                quickResult.status === SafetyStatus.SAFE ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {quickResult.status}
              </span>
            </div>
            <p className="text-sm text-slate-200 line-clamp-2">{quickResult.explanation}</p>
          </div>
        )}
      </section>

      <div className="grid grid-cols-2 gap-4">
        <FeatureCard 
          title="Link Scan" 
          desc="Phishing URLs" 
          icon="🔗" 
          onClick={() => onNavigate(ROUTES.LINK_SCANNER)} 
          color="bg-purple-500/10 border-purple-500/20"
        />
        <FeatureCard 
          title="File Scan" 
          desc="Malware Check" 
          icon="📄" 
          onClick={() => onNavigate(ROUTES.FILE_SCANNER)} 
          color="bg-blue-500/10 border-blue-500/20"
        />
        <FeatureCard 
          title="Image Scan" 
          desc="Vision Protect" 
          icon="👁️" 
          onClick={() => onNavigate(ROUTES.IMAGE_SCANNER)} 
          color="bg-orange-500/10 border-orange-500/20"
        />
        <FeatureCard 
          title="Password Gen" 
          desc="Strong Keys" 
          icon="🔑" 
          onClick={() => onNavigate(ROUTES.PASSWORD_GENERATOR)} 
          color="bg-pink-500/10 border-pink-500/20"
        />
        <FeatureCard 
          title="App Check" 
          desc="Permission Log" 
          icon="📱" 
          onClick={() => onNavigate(ROUTES.APP_SCANNER)} 
          color="bg-emerald-500/10 border-emerald-500/20"
        />
        <FeatureCard 
          title="Security Tips" 
          desc="Stay Aware" 
          icon="🛡️" 
          onClick={() => {}} 
          color="bg-slate-500/10 border-slate-500/20"
        />
      </div>

      <div className={`mt-8 p-4 rounded-2xl border flex items-center gap-4 transition-all duration-500 ${socialShieldActive ? 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'bg-slate-800/30 border-slate-700/50 grayscale'}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${socialShieldActive ? 'bg-cyan-500/20 text-cyan-400 animate-pulse' : 'bg-slate-700 text-slate-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3m0 18a10.003 10.003 0 01-8.303-4.43m16.606 0A10.003 10.003 0 0112 21m0-18a10.003 10.003 0 018.303 4.43m-8.303 4.43V11m0 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"/></svg>
        </div>
        <div>
          <h4 className="text-sm font-bold">{socialShieldActive ? 'Social Shield: ACTIVE' : 'Social Shield: OFF'}</h4>
          <p className="text-[10px] text-slate-500">Monitoring social media links & shared files in background...</p>
        </div>
      </div>
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
    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{desc}</p>
  </button>
);

export default HomeView;
