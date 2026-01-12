
import React, { useState } from 'react';

interface PasswordGeneratorViewProps {
  onBack: () => void;
}

const PasswordGeneratorView: React.FC<PasswordGeneratorViewProps> = ({ onBack }) => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setPassword(retVal);
    setCopied(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-in slide-in-from-right duration-300">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-cyan-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        <span>Back</span>
      </button>

      <h1 className="text-2xl font-black mb-2">Key Generator</h1>
      <p className="text-sm text-slate-400 mb-8 font-medium">Create cryptographically strong passwords locally on your device.</p>

      <div className="space-y-6">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 relative group overflow-hidden">
          <p className="text-xs text-slate-500 uppercase font-black mb-2 tracking-widest">Generated Password</p>
          <div className="text-xl font-mono text-cyan-400 break-all min-h-[1.5em]">
            {password || '••••••••••••••••'}
          </div>
          {password && (
            <button onClick={copy} className="mt-4 text-[10px] font-black uppercase bg-slate-700 px-3 py-1 rounded-lg hover:bg-slate-600 transition-colors">
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          )}
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
           <div className="flex justify-between mb-4">
             <span className="text-xs font-bold text-slate-300">Password Length</span>
             <span className="text-xs font-black text-cyan-400">{length}</span>
           </div>
           <input 
             type="range" min="8" max="64" value={length} 
             onChange={(e) => setLength(parseInt(e.target.value))}
             className="w-full accent-cyan-400 mb-6"
           />
           <button 
             onClick={generate}
             className="w-full py-4 bg-cyan-500 text-slate-950 font-black rounded-xl hover:bg-cyan-400 transition-all active:scale-95 shadow-lg"
           >
             GENERATE NEW KEY
           </button>
        </div>

        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-3">
          <span className="text-lg">🛡️</span>
          <p className="text-[10px] text-blue-300 leading-relaxed font-medium">Cyra keys are generated using local entropy and are never sent to any server.</p>
        </div>
      </div>
    </div>
  );
};

export default PasswordGeneratorView;
