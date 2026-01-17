
import React, { useState } from 'react';
import { Search, Bell, User, Zap, MessageSquareQuote } from 'lucide-react';

interface HeaderProps {
  onSyncBroadcast: (text: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSyncBroadcast }) => {
  const [globalInput, setGlobalInput] = useState('');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalInput.trim()) {
      onSyncBroadcast(globalInput);
      setGlobalInput('');
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-8 flex-1">
        <form onSubmit={handleBroadcast} className="relative w-full max-w-xl group">
          <MessageSquareQuote size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            value={globalInput}
            onChange={(e) => setGlobalInput(e.target.value)}
            placeholder="Broadcast message to all active models..."
            className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            ENTER
          </div>
        </form>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-900"></span>
        </button>
        <div className="h-8 w-px bg-slate-800 mx-2"></div>
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-200">Senior Engineer</p>
            <p className="text-[10px] text-slate-500">Free Tier</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-blue-500/20">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
