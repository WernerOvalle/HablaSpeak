'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AIStatusBadge,
  ChatBubble,
  ChatMessage,
  InterviewInput,
  LoadingBubble,
} from '../interview/InterviewComponents';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const BASE_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const INITIAL_MESSAGE: ChatMessage = {
  role: 'ai',
  text: "Hello! I am Alex, your AI recruiter. Ready to start your practice interview? Tell me, why should we hire you?",
};

interface InterviewViewProps {
  onExit: () => void;
}

export default function InterviewView({ onExit }: InterviewViewProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoadingIA, setIsLoadingIA] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoadingIA]);

  // Hablar el mensaje inicial al entrar
  useEffect(() => {
    speakWithBrowser(INITIAL_MESSAGE.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const speakWithBrowser = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      setUserInput(event.results[0][0].transcript);
    };
    recognition.start();
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const textToSend = userInput;
    setChatHistory(prev => [...prev, { role: 'user', text: textToSend }]);
    setUserInput('');
    setIsLoadingIA(true);

    // Demo mode sin API Key
    if (!API_KEY) {
      await new Promise(r => setTimeout(r, 1200));
      const demoResponse =
        "Great answer! One quick note — use 'I have' instead of 'I has'. Keep it up! Now, what's your greatest professional strength?";
      setChatHistory(prev => [...prev, { role: 'ai', text: demoResponse }]);
      speakWithBrowser(demoResponse);
      setIsLoadingIA(false);
      return;
    }

    try {
      const prompt = `You are Alex, a professional job interviewer.
The user said: "${textToSend}".
1. Correct their English errors briefly and kindly (one line max).
2. Ask the next logical interview question.
Keep it short (max 40 words) and English only.`;

      const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
      const data = await response.json();
      const aiResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "Interesting! Let's continue.";

      setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse }]);
      speakWithBrowser(aiResponse);
    } catch (e) {
      console.error(e);
      setChatHistory(prev => [
        ...prev,
        { role: 'ai', text: 'Sorry, connection issue. Please try again.' },
      ]);
    } finally {
      setIsLoadingIA(false);
    }
  };

  const handleExit = () => {
    if (typeof window !== 'undefined') window.speechSynthesis.cancel();
    onExit();
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col p-6">
      <div className="max-w-2xl mx-auto w-full flex-grow flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <button
            id="exit-interview-btn"
            onClick={handleExit}
            className="text-slate-500 hover:text-white font-bold transition-colors flex items-center gap-2"
          >
            ← Salir
          </button>
          <AIStatusBadge isSpeaking={isSpeaking} />
        </header>

        {/* Chat */}
        <div className="flex-grow overflow-y-auto space-y-6 mb-8 scrollbar-hide pr-2">
          {chatHistory.map((msg, i) => (
            <ChatBubble key={i} message={msg} onRepeat={speakWithBrowser} />
          ))}
          {isLoadingIA && <LoadingBubble />}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <InterviewInput
          value={userInput}
          isListening={isListening}
          isLoading={isLoadingIA}
          hasApiKey={!!API_KEY}
          onChange={setUserInput}
          onMic={startListening}
          onSend={handleSendMessage}
        />
      </div>
    </div>
  );
}
