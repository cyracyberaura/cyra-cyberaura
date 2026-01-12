
import React, { useState } from 'react';

interface ProfileViewProps {
  username: string;
  setUsername: (name: string) => void;
  settings: {
    notifications: boolean;
    realtimeShield: boolean;
    anonymousMode: boolean;
  };
  setSettings: React.Dispatch<React.SetStateAction<{
    notifications: boolean;
    realtimeShield: boolean;
    anonymousMode: boolean;
  }>>;
}

const ProfileView: React.FC<ProfileViewProps> = ({ username, setUsername, settings, setSettings }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(username);

  const stats = [
    { label: 'Threats Blocked', value: '18' },
    { label: 'Safe Links', value: '106' },
    { label: 'Device Score', value: '98%' },
  ];

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveName = () => {
    if (tempName.trim()) setUsername(tempName);
    setIsEditing(false);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <header className="flex flex-col items-center mb-8 relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-1 mb-4">
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-4xl shadow-inner">
            👤
          </div>
        </div>
        
        {isEditing ? (
          <div className="flex flex-col items-center gap-2">
            <input 
              type="text" 
              value={tempName} 
              onChange={(e) => setTempName(e.target.value)}
              className="bg-slate-800 border border-cyan-500/50 rounded-lg px-4 py-2 text-center text-lg font-black text-white outline-none"
              autoFocus
              onBlur={handleSaveName}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
            />
            <p className="text-[8px] text-cyan-400 uppercase font-black">Press Enter to Save</p>
          </div>
        ) : (
          <div className="flex flex-col items-center group cursor-pointer" onClick={() => { setIsEditing(true); setTempName(username); }}>
            <h2 className="text-xl font-black flex items-center gap-2 group-hover:text-cyan-400 transition-colors">
              {username}
              <svg className="w-4 h-4 opacity-30 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            </h2>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Tier: Pro Shield</span>
          </div>
        )}
      </header>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-center">
            <div className="text-lg font-black text-cyan-400">{stat.value}</div>
            <div className="text-[8px] text-slate-500 uppercase font-bold mt-1 tracking-tighter leading-tight">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Settings & Privacy</h3>
        <ProfileItem 
          icon="🔔" 
          label="Push Notifications" 
          active={settings.notifications} 
          onToggle={() => handleToggle('notifications')} 
        />
        <ProfileItem 
          icon="🛡️" 
          label="Social Link Shield" 
          active={settings.realtimeShield} 
          onToggle={() => handleToggle('realtimeShield')} 
        />
        <ProfileItem 
          icon="🕵️" 
          label="Anonymous Ghost Mode" 
          active={settings.anonymousMode} 
          onToggle={() => handleToggle('anonymousMode')} 
        />
      </div>

      <div className="mt-12 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 text-center">
        <p className="text-[10px] text-slate-500 font-bold uppercase mb-4 tracking-widest">Danger Zone</p>
        <button className="text-xs font-black text-rose-500/50 hover:text-rose-500 transition-colors">Wipe All Scan History</button>
      </div>
    </div>
  );
};

const ProfileItem: React.FC<{ icon: string; label: string; active: boolean; onToggle: () => void }> = ({ icon, label, active, onToggle }) => (
  <div 
    onClick={onToggle}
    className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 cursor-pointer active:scale-[0.98] transition-all"
  >
    <div className="flex items-center gap-3">
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-bold text-slate-200">{label}</span>
    </div>
    <div className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${active ? 'bg-cyan-500' : 'bg-slate-700'}`}>
      <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-300 transform ${active ? 'translate-x-5' : 'translate-x-0'}`}></div>
    </div>
  </div>
);

export default ProfileView;
