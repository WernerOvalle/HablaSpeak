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
  isTranscribing: boolean;
  isLoading: boolean;
  disabled?: boolean;
  showSendHint: boolean;
  hasApiKey: boolean;
  onChange: (v: string) => void;
  onMic: () => void;
  onSend: () => void;
}

export function InterviewInput({
  value,
  isListening,
  isTranscribing,
  isLoading,
  disabled = false,
  showSendHint,
  hasApiKey,
  onChange,
  onMic,
  onSend,
}: InterviewInputProps) {
  return (
    <div className="w-full bg-slate-800/60 p-3 sm:p-4 rounded-[24px] sm:rounded-[32px] border border-slate-700 backdrop-blur-xl">
      <style>{`
        @keyframes micPulse {
          0% { transform: scale(0.9); opacity: 0.65; }
          70% { transform: scale(1.25); opacity: 0; }
          100% { transform: scale(1.25); opacity: 0; }
        }
      `}</style>
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          id="mic-btn"
          onClick={onMic}
          aria-label={isListening ? 'Detener grabacion' : 'Iniciar grabacion de voz'}
          disabled={disabled || isLoading || isTranscribing}
          className={`relative isolate overflow-hidden shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl transition-all border ${
            isListening
              ? 'bg-red-500/20 border-red-300/40 shadow-[0_8px_30px_rgba(239,68,68,0.35)]'
              : 'bg-white/10 border-white/20 hover:bg-white/15 shadow-[0_8px_30px_rgba(15,23,42,0.35)]'
          } backdrop-blur-xl disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
          {isListening ? (
            <>
              <span
                className="absolute inset-0 rounded-2xl border border-red-300/60"
                style={{ animation: 'micPulse 1.6s ease-out infinite' }}
              />
              <span
                className="absolute inset-0 rounded-2xl border border-red-300/50"
                style={{ animation: 'micPulse 1.6s ease-out infinite 0.45s' }}
              />
            </>
          ) : null}
          <span className="relative z-10 text-white flex items-center justify-center w-full h-full">
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </span>
        </button>

        <input
          id="chat-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !disabled && !isLoading && onSend()}
          placeholder={
            isListening
              ? 'Grabando tu voz...'
              : isTranscribing
              ? 'Transcribiendo audio con Whisper...'
              : showSendHint
              ? 'Transcripcion lista. Presiona Enviar para mandar tu respuesta.'
              : disabled
              ? 'Practica finalizada. Inicia un nuevo bloque para continuar.'
              : 'Escribe tu respuesta...'
          }
          disabled={disabled}
          className="min-w-0 flex-1 w-full bg-slate-900/50 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3.5 sm:py-4 text-sm outline-none border border-transparent focus:border-indigo-500/50 transition-all placeholder:text-slate-600 text-slate-100"
        />

        <button
          id="send-btn"
          onClick={onSend}
          disabled={disabled || isLoading}
          aria-label="Enviar respuesta"
          className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-indigo-600 rounded-xl sm:rounded-2xl hover:bg-indigo-500 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Send size={18} />
        </button>
      </div>

      <p className="text-[9px] sm:text-[10px] text-slate-500 mt-3 sm:mt-4 text-center font-bold tracking-[0.16em] sm:tracking-[0.2em] uppercase italic opacity-60">
        {hasApiKey
          ? showSendHint
            ? 'Transcripcion lista: presiona enviar para mandar tu audio'
            : 'Groq chat + whisper conectadas'
          : 'Modo bloqueado'}
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
