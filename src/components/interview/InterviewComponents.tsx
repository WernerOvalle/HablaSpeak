'use client';

import { Loader2, Mic, MicOff, Send, Volume2 } from 'lucide-react';

export type ChatMessage = { role: 'ai' | 'user'; text: string };

interface ChatBubbleProps {
  message: ChatMessage;
  onRepeat: (text: string) => void;
}

export function ChatBubble({ message, onRepeat }: ChatBubbleProps) {
  const isAI = message.role === 'ai';
  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[85%] p-5 rounded-[26px] relative group shadow-sm ${
          isAI
            ? 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-700/50'
            : 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-500/10'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap pr-6">{message.text}</p>
        {isAI && (
          <button
            onClick={() => onRepeat(message.text)}
            className="absolute right-3 top-3 text-slate-500 hover:text-indigo-400 transition-colors"
            title="Repetir audio"
            aria-label="Repetir mensaje de Alex"
          >
            <Volume2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

interface InterviewInputProps {
  value: string;
  isListening: boolean;
  isLoading: boolean;
  hasApiKey: boolean;
  onChange: (v: string) => void;
  onMic: () => void;
  onSend: () => void;
}

export function InterviewInput({
  value,
  isListening,
  isLoading,
  hasApiKey,
  onChange,
  onMic,
  onSend,
}: InterviewInputProps) {
  return (
    <div className="bg-slate-800/60 p-4 rounded-[32px] border border-slate-700 backdrop-blur-xl">
      <div className="flex gap-3">
        <button
          id="mic-btn"
          onClick={onMic}
          aria-label={isListening ? 'Detener grabación' : 'Iniciar grabación de voz'}
          className={`p-4 rounded-2xl transition-all ${
            isListening
              ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/30'
              : 'bg-slate-700 hover:bg-slate-600 border border-slate-600'
          }`}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        <input
          id="chat-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !isLoading && onSend()}
          placeholder={isListening ? 'Escuchando tu voz...' : 'Escribe tu respuesta...'}
          className="flex-grow bg-slate-900/50 rounded-2xl px-6 py-4 text-sm outline-none border border-transparent focus:border-indigo-500/50 transition-all placeholder:text-slate-600 text-slate-100"
        />

        <button
          id="send-btn"
          onClick={onSend}
          disabled={isLoading}
          aria-label="Enviar respuesta"
          className="bg-indigo-600 p-4 rounded-2xl hover:bg-indigo-500 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>

      <p className="text-[10px] text-slate-500 mt-4 text-center font-bold tracking-[0.2em] uppercase italic opacity-60">
        {hasApiKey ? 'Gemini AI Conectada' : 'Modo Demo – Sin API Key'}
      </p>
    </div>
  );
}

interface AIStatusBadgeProps {
  isSpeaking: boolean;
}

export function AIStatusBadge({ isSpeaking }: AIStatusBadgeProps) {
  return (
    <div
      className={`px-4 py-2 rounded-full border border-slate-700 flex items-center gap-3 transition-all duration-300 ${
        isSpeaking
          ? 'bg-indigo-500/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
          : 'bg-slate-800'
      }`}
    >
      <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-indigo-400 animate-pulse' : 'bg-slate-500'}`} />
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
        {isSpeaking ? 'Alex Hablando' : 'IA Lista'}
      </span>
    </div>
  );
}

interface LoadingBubbleProps {}

export function LoadingBubble({}: LoadingBubbleProps) {
  return (
    <div className="flex justify-start">
      <div className="bg-slate-800/80 p-4 rounded-2xl w-16 flex justify-center border border-slate-700 animate-pulse">
        <Loader2 className="animate-spin text-indigo-400" size={18} />
      </div>
    </div>
  );
}
