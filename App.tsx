
import React, { useState, useEffect } from 'react';
import { ROUTES } from './constants';
import HomeView from './views/HomeView';
import LinkScannerView from './views/LinkScannerView';
import FileScannerView from './views/FileScannerView';
import ImageScannerView from './views/ImageScannerView';
import PasswordGeneratorView from './views/PasswordGeneratorView';
import ActivityScannerView from './views/ActivityScannerView';
import SafetyTipsView from './views/SafetyTipsView';
import CommentsView from './views/CommentsView';
import ProfileView from './views/ProfileView';

const HomeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
);
const ChatIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
);
const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
);

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>(ROUTES.HOME);
  const [username, setUsername] = useState('Secure User #721');
  const [settings, setSettings] = useState({
    notifications: true,
    realtimeShield: true,
    anonymousMode: true,
  });
  const [notifications, setNotifications] = useState<string[]>([]);

  const addNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev].slice(0, 3));
    setTimeout(() => {
      setNotifications(prev => prev.filter(m => m !== msg));
    }, 5000);
  };

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  };

  const toggleShield = () => {
    setSettings(prev => ({ ...prev, realtimeShield: !prev.realtimeShield }));
    addNotification(settings.realtimeShield ? "Live protection turned off." : "Live protection activated.");
  };

  const renderView = () => {
    switch (currentRoute) {
      case ROUTES.HOME: return <HomeView onNavigate={navigate} onToggleShield={toggleShield} socialShieldActive={settings.realtimeShield} addNotification={addNotification} />;
      case ROUTES.LINK_SCANNER: return <LinkScannerView onBack={() => navigate(ROUTES.HOME)} />;
      case ROUTES.FILE_SCANNER: return <FileScannerView onBack={() => navigate(ROUTES.HOME)} />;
      case ROUTES.IMAGE_SCANNER: return <ImageScannerView onBack={() => navigate(ROUTES.HOME)} />;
      case ROUTES.PASSWORD_GENERATOR: return <PasswordGeneratorView onBack={() => navigate(ROUTES.HOME)} />;
      case ROUTES.APP_SCANNER: return <ActivityScannerView onBack={() => navigate(ROUTES.HOME)} />;
      case ROUTES.SAFETY_TIPS: return <SafetyTipsView onBack={() => navigate(ROUTES.HOME)} />;
      case ROUTES.COMMENTS: return <CommentsView anonymousMode={settings.anonymousMode} currentUsername={username} />;
      case ROUTES.PROFILE: return (
        <ProfileView 
          username={username} 
          setUsername={setUsername} 
          settings={settings} 
          setSettings={setSettings} 
        />
      );
      default: return <HomeView onNavigate={navigate} onToggleShield={toggleShield} socialShieldActive={settings.realtimeShield} addNotification={addNotification} />;
    }
  };

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto shadow-2xl bg-slate-900 border-x border-slate-800 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
      
      {/* Toast Notifications */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[320px] space-y-2 pointer-events-none">
        {notifications.map((note, i) => (
          <div key={i} className="bg-rose-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 pointer-events-auto">
            <span className="text-lg">🛡️</span>
            <p className="text-xs font-bold leading-tight">{note}</p>
          </div>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto pt-4 px-4">
        {renderView()}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md glass border-t border-slate-700/50 px-6 py-4 flex justify-around items-center z-50 rounded-t-2xl">
        <button onClick={() => navigate(ROUTES.HOME)} className={`flex flex-col items-center gap-1 transition-all ${[ROUTES.HOME, ROUTES.LINK_SCANNER, ROUTES.FILE_SCANNER, ROUTES.IMAGE_SCANNER, ROUTES.PASSWORD_GENERATOR, ROUTES.APP_SCANNER, ROUTES.SAFETY_TIPS].includes(currentRoute) ? 'text-cyan-400' : 'text-slate-500'}`}>
          <HomeIcon />
          <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
        </button>
        <button onClick={() => navigate(ROUTES.COMMENTS)} className={`flex flex-col items-center gap-1 transition-all ${currentRoute === ROUTES.COMMENTS ? 'text-cyan-400' : 'text-slate-500'}`}>
          <ChatIcon />
          <span className="text-[10px] font-bold uppercase tracking-widest">Feed</span>
        </button>
        <button onClick={() => navigate(ROUTES.PROFILE)} className={`flex flex-col items-center gap-1 transition-all ${currentRoute === ROUTES.PROFILE ? 'text-cyan-400' : 'text-slate-500'}`}>
          <UserIcon />
          <span className="text-[10px] font-bold uppercase tracking-widest">Account</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
