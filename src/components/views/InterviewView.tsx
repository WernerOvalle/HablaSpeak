'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AIStatusBadge,
  ChatBubble,
  ChatMessage,
  InterviewInput,
  LoadingBubble,
} from '../interview/InterviewComponents';
import type { InterviewScenario } from '@/types/app';

interface InterviewViewProps {
  onExit: () => void;
  scenario: InterviewScenario;
}

export default function InterviewView({ onExit, scenario }: InterviewViewProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isLoadingIA, setIsLoadingIA] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showSendHint, setShowSendHint] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'ai', text: scenario.initialMessage },
  ]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoadingIA]);

  useEffect(() => {
    const initialMessage = { role: 'ai' as const, text: scenario.initialMessage };
    setChatHistory([initialMessage]);
    speakWithBrowser(initialMessage.text);
  }, [scenario]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      stopMediaStream();
    };
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

  const stopMediaStream = () => {
    if (!mediaStreamRef.current) return;
    mediaStreamRef.current.getTracks().forEach(track => track.stop());
    mediaStreamRef.current = null;
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    const formData = new FormData();
    const fileName = `recording-${Date.now()}.webm`;
    formData.append('audio', new File([audioBlob], fileName, { type: audioBlob.type || 'audio/webm' }));

    formData.append('language', 'en');

    const response = await fetch('/api/interview/transcribe', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'No se pudo transcribir el audio');
    }

    const text = typeof data.text === 'string' ? data.text.trim() : '';
    if (!text) {
      throw new Error('La transcripcion llego vacia');
    }

    setUserInput(text);
    setShowSendHint(true);
  };

  const toggleRecording = async () => {
    if (typeof window === 'undefined') return;

    if (isTranscribing || isLoadingIA) return;

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      alert('Tu navegador no soporta grabacion de audio con MediaRecorder.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      mediaChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : undefined;
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = event => {
        if (event.data && event.data.size > 0) {
          mediaChunksRef.current.push(event.data);
        }
      };

      recorder.onstart = () => {
        setIsRecording(true);
        setShowSendHint(false);
      };

      recorder.onstop = async () => {
        setIsRecording(false);
        mediaRecorderRef.current = null;
        const audioBlob = new Blob(mediaChunksRef.current, { type: 'audio/webm' });
        mediaChunksRef.current = [];
        stopMediaStream();

        if (!audioBlob.size) {
          return;
        }

        setIsTranscribing(true);
        try {
          await transcribeAudio(audioBlob);
        } catch (error) {
          alert(error instanceof Error ? error.message : 'No se pudo transcribir el audio');
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.onerror = () => {
        setIsRecording(false);
        mediaRecorderRef.current = null;
        stopMediaStream();
        alert('Error grabando audio. Intenta de nuevo.');
      };

      recorder.start();
    } catch {
      setIsRecording(false);
      mediaRecorderRef.current = null;
      stopMediaStream();
      alert('Debes permitir acceso al microfono en el navegador.');
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const textToSend = userInput;
    setChatHistory(prev => [...prev, { role: 'user', text: textToSend }]);
    setUserInput('');
    setShowSendHint(false);
    setIsLoadingIA(true);

    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          scenarioTitle: scenario.title,
          scenarioDescription: scenario.description,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo contactar a Groq');
      }

      const aiResponse = data.displayText || 'No se recibio respuesta valida';
      setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse }]);
      speakWithBrowser(aiResponse);
    } catch (e) {
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
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    stopMediaStream();
    onExit();
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col p-3 sm:p-6">
      <div className="max-w-2xl mx-auto w-full flex-grow flex flex-col">
        <header className="flex justify-between items-center mb-5 sm:mb-8">
          <button
            id="exit-interview-btn"
            onClick={handleExit}
            className="text-slate-500 hover:text-white font-bold transition-colors flex items-center gap-2"
          >
            ← Salir
          </button>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-[10px] uppercase tracking-[0.2em] font-black text-indigo-300">
              {scenario.title}
            </span>
            <AIStatusBadge isSpeaking={isSpeaking} />
          </div>
        </header>

        <div className="flex-grow overflow-y-auto space-y-4 sm:space-y-6 mb-4 sm:mb-8 scrollbar-hide pr-1 sm:pr-2">
          {chatHistory.map((msg, i) => (
            <ChatBubble key={i} message={msg} onRepeat={speakWithBrowser} />
          ))}
          {isLoadingIA && <LoadingBubble />}
          <div ref={bottomRef} />
        </div>

        <InterviewInput
          value={userInput}
          isListening={isRecording}
          isTranscribing={isTranscribing}
          isLoading={isLoadingIA}
          showSendHint={showSendHint}
          hasApiKey={true}
          onChange={value => {
            setUserInput(value);
            if (showSendHint) {
              setShowSendHint(false);
            }
          }}
          onMic={toggleRecording}
          onSend={handleSendMessage}
        />
      </div>
    </div>
  );
}
