
import React, { useState, useEffect } from 'react';
import { ChatInstance, ModelId, AVAILABLE_MODELS } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatPane from './components/ChatPane';
import { Plus, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [chats, setChats] = useState<ChatInstance[]>([]);
  const [syncInput, setSyncInput] = useState<string | undefined>(undefined);

  // Initialize with the 6 specific requested bots on startup
  useEffect(() => {
    const initialBots: ChatInstance[] = AVAILABLE_MODELS.map((model, index) => ({
      id: `bot-${index}`,
      modelId: model.id,
      name: model.name,
      messages: [],
      isThinking: false,
      thinkingBudget: 4000,
      systemInstruction: model.defaultSystemInstruction,
      brandColor: model.color
    }));
    setChats(initialBots);
  }, []);

  const addChat = (modelId: ModelId) => {
    if (chats.length >= 6) return;
    
    const model = AVAILABLE_MODELS.find(m => m.id === modelId) || AVAILABLE_MODELS[0];
    const newChat: ChatInstance = {
      id: Math.random().toString(36).substr(2, 9),
      modelId,
      name: `${model.name} ${chats.length + 1}`,
      messages: [],
      isThinking: false,
      thinkingBudget: 4000,
      systemInstruction: model.defaultSystemInstruction,
      brandColor: model.color
    };
    
    setChats(prev => [...prev, newChat]);
  };

  const updateChat = (id: string, updates: Partial<ChatInstance>) => {
    setChats(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteChat = (id: string) => {
    setChats(prev => prev.filter(c => c.id !== id));
  };

  const handleGlobalSync = (text: string) => {
    setSyncInput(text);
  };

  const getGridClass = () => {
    const count = chats.length;
    if (count <= 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 lg:grid-cols-2';
    if (count === 3) return 'grid-cols-1 md:grid-cols-3';
    if (count === 4) return 'grid-cols-1 md:grid-cols-2';
    return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
  };

  return (
    <div className="flex h-screen w-full bg-[#0b0e14] text-slate-200 overflow-hidden">
      <Sidebar onAddChat={addChat} activeChatsCount={chats.length} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <Header onSyncBroadcast={handleGlobalSync} />
        
        <div className="flex-1 overflow-hidden p-6 relative">
          {chats.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-[100px] opacity-20 rounded-full animate-pulse"></div>
                <div className="relative bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
                  <Zap size={64} className="text-blue-500 mx-auto mb-6" fill="currentColor" />
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    OmniChat Dashboard
                  </h1>
                  <p className="mt-4 text-slate-400 leading-relaxed">
                    No active instances. Choose a bot to get started.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {AVAILABLE_MODELS.map((model) => (
                  <button
                    key={model.name}
                    onClick={() => addChat(model.id)}
                    className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all group"
                  >
                    <div className={`p-3 rounded-xl ${model.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <Plus size={20} />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-xs text-slate-200">{model.name}</h3>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{model.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className={`grid ${getGridClass()} gap-4 h-full auto-rows-fr overflow-y-auto pr-2`}>
              {chats.map((chat) => (
                <ChatPane 
                  key={chat.id} 
                  chat={chat} 
                  onUpdate={updateChat} 
                  onDelete={deleteChat}
                  syncInput={syncInput}
                  onSyncComplete={() => setSyncInput(undefined)}
                />
              ))}
              {chats.length < 6 && (
                <button 
                  onClick={() => addChat('gemini-3-flash-preview')}
                  className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl hover:border-slate-700 hover:bg-slate-900/30 transition-all text-slate-500 hover:text-slate-400 group h-full min-h-[300px]"
                >
                  <div className="p-3 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors">
                    <Plus size={24} />
                  </div>
                  <span className="mt-3 text-sm font-medium">Add Instance</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Dashboard Footer */}
        {chats.length > 0 && (
          <footer className="px-8 py-2.5 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                Omni Mode Active
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                {chats.length} Models Synced
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-600">OmniChat v2.1 - Enhanced Grid</span>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
};

export default App;
