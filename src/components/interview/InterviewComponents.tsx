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
    <div className="relative w-full mt-10 sm:mt-12">
      {/* Mic button: center fijo en el borde superior de la card */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 overflow-visible">
          {isListening && (
            <>
              <span className="absolute inset-0 rounded-full border-2 border-red-400/60 pointer-events-none origin-center animate-mic-glass-1" />
              <span className="absolute inset-0 rounded-full border-2 border-red-400/50 pointer-events-none origin-center animate-mic-glass-2" />
              <span className="absolute inset-0 rounded-full border-2 border-red-400/40 pointer-events-none origin-center animate-mic-glass-3" />
            </>
          )}
          <button
            id="mic-btn"
            onClick={onMic}
            aria-label={isListening ? 'Detener grabacion' : 'Iniciar grabacion de voz'}
            disabled={disabled || isLoading || isTranscribing}
            className={`relative z-10 overflow-hidden shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full transition-all border flex items-center justify-center ${
              isListening
                ? 'bg-red-500/30 border-red-300/50 shadow-[0_8px_30px_rgba(239,68,68,0.4)]'
                : 'bg-gradient-to-b from-blue-950/70 to-slate-900/80 border-blue-500/30 hover:border-blue-400/50 shadow-[0_8px_30px_rgba(59,130,246,0.3)]'
            } backdrop-blur-xl disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {!isListening && (
              <>
                <span
                  className="absolute -bottom-1 -left-[20%] w-[140%] h-[55%] bg-blue-500/30 pointer-events-none animate-sea-wave-1"
                  style={{ borderRadius: '45% 55% 0 0 / 40% 35% 0 0' }}
                />
                <span
                  className="absolute -bottom-1 -left-[20%] w-[140%] h-[42%] bg-cyan-400/20 pointer-events-none animate-sea-wave-2"
                  style={{ borderRadius: '55% 45% 0 0 / 30% 45% 0 0' }}
                />
              </>
            )}
            <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
            {isListening && (
              <>
                <span className="absolute inset-0 rounded-full border border-red-300/60 origin-center animate-mic-pulse" />
                <span className="absolute inset-0 rounded-full border border-red-300/50 origin-center animate-mic-pulse-delay" />
              </>
            )}
            <span className="relative z-10 text-white flex items-center justify-center">
              {isListening ? <MicOff size={24} className="sm:w-7 sm:h-7" /> : <Mic size={24} className="sm:w-7 sm:h-7" />}
            </span>
          </button>
        </div>
      </div>

      {/* Card con notch circular en el top center — no toca el botón */}
      <div
        className="w-full bg-slate-800/60 pt-10 sm:pt-12 pb-3 sm:pb-4 px-3 sm:px-4 rounded-[24px] sm:rounded-[32px] border border-slate-700 backdrop-blur-xl"
        style={{
          maskImage: 'radial-gradient(circle 38px at 50% 0, transparent 100%, black 101%)',
          WebkitMaskImage: 'radial-gradient(circle 38px at 50% 0, transparent 100%, black 101%)',
        }}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
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

        {showSendHint && (
          <p className="text-[9px] sm:text-[10px] text-slate-500 mt-3 sm:mt-4 text-center font-bold tracking-[0.16em] sm:tracking-[0.2em] uppercase italic opacity-60">
            Transcripcion lista: presiona enviar para mandar tu audio
          </p>
        )}
      </div>
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

interface TypingBubbleProps {
  /** Texto parcial ya recibido (streaming) - si hay texto, se muestra en lugar de los puntos */
  partialText?: string;
  renderRichText?: (text: string) => React.ReactNode;
  /** 'dark' para InterviewView, 'light' para ClassesView */
  variant?: 'dark' | 'light';
}

export function TypingBubble({ partialText, renderRichText, variant = 'dark' }: TypingBubbleProps) {
  const bubbleClass =
    variant === 'light'
      ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-900/20 dark:border-slate-700 mr-4 rounded-2xl rounded-tl-none'
      : 'max-w-[85%] p-5 rounded-[26px] rounded-tl-none bg-slate-800/80 text-slate-200 border border-slate-700/50 shadow-sm';
  return (
    <div className="flex justify-start">
      <div
        className={`${bubbleClass} min-h-[52px] flex items-center p-4 sm:p-5`}
        style={{ animation: 'bubblePulse 1.2s ease-in-out infinite' }}
      >
        {partialText ? (
          <span className="text-sm leading-relaxed whitespace-pre-wrap">
            {renderRichText ? renderRichText(partialText) : partialText}
          </span>
        ) : (
          <div className="flex gap-1">
            <span
              className="w-2 h-2 rounded-full bg-slate-400"
              style={{ animation: 'typingDot 1.4s ease-in-out infinite' }}
            />
            <span
              className="w-2 h-2 rounded-full bg-slate-400"
              style={{ animation: 'typingDot 1.4s ease-in-out infinite 0.2s' }}
            />
            <span
              className="w-2 h-2 rounded-full bg-slate-400"
              style={{ animation: 'typingDot 1.4s ease-in-out infinite 0.4s' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
