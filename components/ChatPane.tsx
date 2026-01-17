
import React, { useState, useRef, useEffect } from 'react';
import { ChatInstance, Message, AVAILABLE_MODELS } from '../types';
import { createGeminiChat, sendMessageToGemini } from '../services/gemini';
import { Send, Bot, User, Loader2, Trash2, Settings2, BrainCircuit } from 'lucide-react';

interface ChatPaneProps {
  chat: ChatInstance;
  onUpdate: (id: string, updates: Partial<ChatInstance>) => void;
  onDelete: (id: string) => void;
  syncInput?: string;
  onSyncComplete?: () => void;
}

const ChatPane: React.FC<ChatPaneProps> = ({ chat, onUpdate, onDelete, syncInput, onSyncComplete }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    chatRef.current = createGeminiChat(chat.modelId, chat.thinkingBudget, chat.systemInstruction);
  }, [chat.modelId, chat.thinkingBudget, chat.systemInstruction]);

  useEffect(() => {
    if (syncInput && !isLoading) {
      handleSend(syncInput);
      if (onSyncComplete) onSyncComplete();
    }
  }, [syncInput, isLoading, onSyncComplete]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat.messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const newMessages = [...chat.messages, userMsg];
    onUpdate(chat.id, { messages: newMessages });
    setInputValue('');
    setIsLoading(true);

    const responseText = await sendMessageToGemini(chatRef.current, text);

    const modelMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: responseText,
      timestamp: Date.now(),
    };

    onUpdate(chat.id, { messages: [...newMessages, modelMsg] });
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-sm transition-all hover:border-slate-600/50">
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b border-slate-700/50 ${chat.brandColor.replace('bg-', 'bg-opacity-10 bg-')}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${chat.brandColor} text-white shadow-lg`}>
            <Bot size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">{chat.name}</h3>
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-medium">Powered by Gemini</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onUpdate(chat.id, { thinkingBudget: chat.thinkingBudget > 0 ? 0 : 4000 })}
            className={`p-1.5 rounded-md transition-colors ${chat.thinkingBudget > 0 ? 'text-purple-400 bg-purple-400/10' : 'text-slate-400 hover:text-slate-200'}`}
            title="Toggle Thinking Mode"
          >
            <BrainCircuit size={16} />
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-700/50 transition-colors"
          >
            <Settings2 size={16} />
          </button>
          <button 
            onClick={() => onDelete(chat.id)}
            className="p-1.5 text-slate-400 hover:text-red-400 rounded-md hover:bg-red-400/10 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-3 bg-slate-800 border-b border-slate-700 text-[10px] space-y-2 animate-in slide-in-from-top duration-200">
          <div className="flex justify-between items-center">
            <label className="text-slate-400">Persona Instruction</label>
            <input 
              type="text" 
              value={chat.systemInstruction}
              onChange={(e) => onUpdate(chat.id, { systemInstruction: e.target.value })}
              className="bg-slate-900 w-2/3 border border-slate-700 rounded px-2 py-1 outline-none text-slate-200"
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-slate-400">Thinking (tokens)</label>
            <input 
              type="number" 
              value={chat.thinkingBudget}
              onChange={(e) => onUpdate(chat.id, { thinkingBudget: parseInt(e.target.value) || 0 })}
              className="bg-slate-900 w-20 border border-slate-700 rounded px-2 py-1 outline-none text-slate-200"
            />
          </div>
        </div>
      )}

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {chat.messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2 opacity-50">
            <Bot size={40} className={chat.brandColor.replace('bg-', 'text-')} />
            <p className="text-xs font-medium uppercase tracking-tighter">Instance: {chat.name}</p>
          </div>
        )}
        {chat.messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`mt-1 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white ${msg.role === 'user' ? 'bg-slate-700' : chat.brandColor}`}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={`max-w-[88%] rounded-2xl px-3.5 py-2 text-[13px] ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-900/20' : 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-700/50'}`}>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              <div className="text-[9px] mt-1 opacity-40 font-mono">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className={`mt-1 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${chat.brandColor}`}>
              <Loader2 size={14} className="animate-spin text-white" />
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 text-slate-400 rounded-2xl rounded-tl-none px-4 py-2 text-xs italic animate-pulse">
              Generating response...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-700/50 bg-slate-900/30">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
          className="relative group"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Ask ${chat.name}...`}
            disabled={isLoading}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-1 focus:ring-slate-600 focus:border-slate-600 transition-all disabled:opacity-50 placeholder:text-slate-600"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${inputValue.trim() ? chat.brandColor + ' text-white' : 'text-slate-600'}`}
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPane;
