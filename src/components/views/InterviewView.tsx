'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AIStatusBadge,
  ChatBubble,
  ChatMessage,
  InterviewInput,
  LoadingBubble,
} from '../interview/InterviewComponents';

// Usamos OpenRouter API
const OLLAMA_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';

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

    // Demo mode si escriben exactamente "demo"
    if (textToSend.toLowerCase() === 'demo') {
      await new Promise(r => setTimeout(r, 1200));
      const demoResponse =
        "Great answer! One quick note — use 'I have' instead of 'I has'. Keep it up! Now, what's your greatest professional strength?";
      setChatHistory(prev => [...prev, { role: 'ai', text: demoResponse }]);
      speakWithBrowser(demoResponse);
      setIsLoadingIA(false);
      return;
    }

    try {
      const prompt = `You are Alex, a professional job interviewer helping a user practice English.
The applicant said: "${textToSend}".

Structure your response EXACTLY like this (do not use markdown formatting like asterisks or bold):

Feedback: [Briefly and kindly correct any English grammar or vocabulary mistakes the applicant made. If perfect, say "Great English!"].
Next Question: [Ask ONE logical follow-up interview question].

Keep the total response under 40 words. Strictly in English.`;

      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({ 
          model: 'openrouter/free', // Auto-enruta al mejor modelo gratuito disponible sin rate-limit 
          messages: [
            { role: 'system', content: prompt }
          ],
        }),
      });
      const data = await response.json();

      if (data.error) {
        const errMsg = `OpenRouter Error: ${data.error.message || data.error}`;
        console.error('OpenRouter API error:', data.error);
        setChatHistory(prev => [...prev, { role: 'ai', text: errMsg }]);
        setIsLoadingIA(false);
        return;
      }

      const aiResponse = data.choices?.[0]?.message?.content;
      if (!aiResponse) {
        console.error('Unexpected OpenRouter response:', JSON.stringify(data));
        setChatHistory(prev => [...prev, { role: 'ai', text: `Unexpected response. Check console.` }]);
        setIsLoadingIA(false);
        return;
      }

      setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse }]);

      // Extraer el feedback para guardar posibles errores
      const feedbackMatch = aiResponse.match(/Feedback:\s*(.+?)(?=\n|Next Question:|$)/i);
      if (feedbackMatch && feedbackMatch[1]) {
        const feedbackText = feedbackMatch[1].trim();
        // Si no es un mensaje de "todo perfecto", lo guardamos
        if (!feedbackText.toLowerCase().includes('great english') && !feedbackText.toLowerCase().includes('perfect')) {
          fetch('/api/errors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ errorType: feedbackText })
          }).catch(console.error);
        }
      }

      speakWithBrowser(aiResponse);
    } catch (e) {
      console.error('Fetch error:', e);
      setChatHistory(prev => [
        ...prev,
        { role: 'ai', text: `Connection error: ${e instanceof Error ? e.message : String(e)}` },
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
          hasApiKey={true} // Siempre true con Ollama local
          onChange={setUserInput}
          onMic={startListening}
          onSend={handleSendMessage}
        />
      </div>
    </div>
  );
}
