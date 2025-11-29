import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, User } from '../types';
import { summarizeProjectChat } from '../services/geminiService';
import { Send, Users, Sparkles, MessageSquare } from 'lucide-react';

interface CollaborationHubProps {
  currentUser: User;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

export const CollaborationHub: React.FC<CollaborationHubProps> = ({
  currentUser,
  messages,
  onSendMessage
}) => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const generateSummary = async () => {
    setLoadingSummary(true);
    const messageTexts = messages.map(m => `${m.senderId === currentUser.id ? 'Me' : 'Peer'}: ${m.text}`);
    const result = await summarizeProjectChat(messageTexts);
    setSummary(result);
    setLoadingSummary(false);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
           <div className="flex items-center gap-2">
             <MessageSquare className="text-indigo-600" size={20} />
             <h2 className="font-bold text-slate-800">Team Discussion</h2>
           </div>
           <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">History Essay Group A</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
           {messages.length === 0 ? (
             <div className="text-center py-20 text-slate-400">
               <Users size={48} className="mx-auto mb-2 opacity-50" />
               <p>Start collaborating with your team.</p>
             </div>
           ) : (
             messages.map((msg) => {
               const isMe = msg.senderId === currentUser.id;
               return (
                 <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
                     isMe 
                       ? 'bg-indigo-600 text-white rounded-br-none' 
                       : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                   }`}>
                     <p className="text-sm">{msg.text}</p>
                     <p className={`text-[10px] mt-1 ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                       {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </p>
                   </div>
                 </div>
               );
             })
           )}
           <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex gap-2">
          <input 
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* Sidebar: AI Summary */}
      <div className="w-80 border-l border-slate-200 bg-slate-50 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-4 text-indigo-900">
           <Sparkles size={18} />
           <h3 className="font-bold text-sm">AI Session Summary</h3>
        </div>
        
        <div className="flex-1 bg-white rounded-lg border border-slate-200 p-4 shadow-sm overflow-y-auto mb-4 text-sm text-slate-600">
          {summary ? (
            <div className="prose prose-sm prose-indigo">
               <p>{summary}</p>
            </div>
          ) : (
            <div className="text-center text-slate-400 py-10 text-xs">
              <p>No summary generated yet.</p>
            </div>
          )}
        </div>

        <button 
          onClick={generateSummary}
          disabled={loadingSummary || messages.length === 0}
          className="w-full py-2 bg-white border border-indigo-200 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors disabled:opacity-50"
        >
          {loadingSummary ? 'Generating...' : 'Summarize Discussion'}
        </button>
      </div>
    </div>
  );
};