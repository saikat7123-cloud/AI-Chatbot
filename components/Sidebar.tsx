
import React from 'react';
import { LayoutDashboard, Plus, MessageSquare, ShieldCheck, Zap, Layers } from 'lucide-react';
import { AVAILABLE_MODELS, ChatInstance } from '../types';

interface SidebarProps {
  onAddChat: (modelId: any) => void;
  activeChatsCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddChat, activeChatsCount }) => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
      <div className="p-6">
        <div className="flex items-center gap-3 text-blue-500 mb-8">
          <div className="bg-blue-500/10 p-2 rounded-xl">
            <Zap size={24} fill="currentColor" />
          </div>
          <span className="font-bold text-xl tracking-tight">OmniChat</span>
        </div>

        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-slate-800 text-white">
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all">
            <MessageSquare size={18} />
            Global Chat
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all">
            <Layers size={18} />
            Workspaces
          </button>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="px-2 flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Add New Model</h3>
          <span className="text-[10px] text-slate-600 font-mono">{activeChatsCount}/6</span>
        </div>
        
        <div className="space-y-2">
          {AVAILABLE_MODELS.map((model) => (
            <button
              key={model.name}
              onClick={() => onAddChat(model.id)}
              disabled={activeChatsCount >= 6}
              className="w-full group flex items-start gap-2 p-2.5 text-left rounded-xl border border-slate-800 bg-slate-800/30 hover:bg-slate-800 hover:border-slate-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${model.color}`} />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-200 group-hover:text-blue-400 transition-colors truncate">{model.name}</p>
                <p className="text-[9px] text-slate-500 mt-0.5 leading-tight line-clamp-1">{model.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 bg-slate-900/50 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-xl border border-slate-800">
          <ShieldCheck size={18} className="text-emerald-500" />
          <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">API Status</p>
            <p className="text-xs text-slate-200 font-medium truncate">Gemini Live</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
