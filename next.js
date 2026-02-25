import React, { useState, useEffect } from 'react';
import {
    Mic, LogOut, TrendingUp, AlertCircle,
    Crown, ChevronRight, MessageSquare,
    CheckCircle2, Lock, X, Play, Info, Volume2, Sparkles, Send, Loader2, MicOff, User, LockKeyhole
} from 'lucide-react';

const API_KEY = "";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";

const App = () => {
    const [view, setView] = useState('login');
    const [userPlan, setUserPlan] = useState('free');
    const [questionsLeft, setQuestionsLeft] = useState(10);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isLoadingIA, setIsLoadingIA] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [chatHistory, setChatHistory] = useState([
        { role: 'ai', text: "Hello! I am Alex, your AI recruiter. Ready to start your practice interview? Tell me, why should we hire you?" }
    ]);

    // --- VOZ NATIVA DEL NAVEGADOR ---
    const speakWithBrowser = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.95;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    // --- RECONOCIMIENTO DE VOZ NATIVO ---
    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => {
            setUserInput(event.results[0][0].transcript);
        };
        recognition.start();
    };

    // --- LÓGICA DE IA (Gemini para Texto) ---
    const handleSendMessage = async () => {
        if (!userInput.trim() || (questionsLeft <= 0 && userPlan === 'free')) return;

        const textToSend = userInput;
        setChatHistory(prev => [...prev, { role: 'user', text: textToSend }]);
        setUserInput("");
        setIsLoadingIA(true);
        if (userPlan === 'free') setQuestionsLeft(q => q - 1);

        try {
            const prompt = `You are Alex, a professional job interviewer. 
      The user said: "${textToSend}". 
      1. Correct their English errors briefly and kindly.
      2. Ask the next logical interview question.
      Keep it short (max 40 words) and English only.`;

            const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const data = await response.json();
            const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Interesting. Let's move on.";

            setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse }]);
            speakWithBrowser(aiResponse);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingIA(false);
        }
    };

    const Navbar = () => (
        <nav className="flex justify-between items-center p-4 bg-white/70 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
                <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100"><MessageSquare size={18} /></div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight">hablaspeak</h1>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={() => setView('pricing')} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-bold text-[10px] uppercase tracking-wider hover:shadow-lg transition-all">
                    <Crown size={14} /> <span>{userPlan === 'plus' ? 'Plus Active' : 'Upgrade'}</span>
                </button>
                <button onClick={() => setView('login')} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><LogOut size={20} /></button>
            </div>
        </nav>
    );

    // --- VISTAS ---

    if (view === 'login') return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 text-center border border-slate-100">
                <div className="inline-flex p-6 bg-indigo-50 rounded-3xl mb-8 text-indigo-600 ring-8 ring-indigo-50/50"><Mic size={48} /></div>
                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">HablaSpeak</h2>
                <p className="text-slate-400 mb-10 font-medium">Domina el inglés con IA</p>

                <div className="space-y-4 text-left">
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="email" placeholder="Correo electrónico" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" defaultValue="demo@hablaspeak.com" />
                    </div>
                    <div className="relative">
                        <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="password" placeholder="Contraseña" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" defaultValue="123456" />
                    </div>
                    <button onClick={() => setView('dashboard')} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all mt-4">
                        Entrar
                    </button>
                </div>
            </div>
        </div>
    );

    if (view === 'dashboard') return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <Navbar />
            <main className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6 text-sm">
                            <AlertCircle size={16} className="text-indigo-500" /> Errores detectados
                        </h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-red-50 rounded-2xl border border-red-100 flex justify-between items-center text-[11px] font-bold text-red-700">
                                <span>Third person 's'</span><span>5x</span>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 flex justify-between items-center text-[11px] font-bold text-indigo-700">
                                <span>Pronunciation 'th'</span><span>2x</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-6 flex flex-col items-center justify-center py-10 space-y-8">
                    <div className="text-center">
                        <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">¿Listo para practicar?</h2>
                        <p className="text-slate-400 font-medium">Toca el botón y empieza a hablar</p>
                    </div>

                    <button onClick={() => setView('scenarios')} className="relative group">
                        <div className="absolute inset-0 bg-indigo-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center border-4 border-white">
                            <style>{`
                @keyframes wave-flow { from { transform: translate(-50%, -65%) rotate(0deg); } to { transform: translate(-50%, -65%) rotate(360deg); } }
                .liquid { position: absolute; width: 200%; height: 200%; top: 0; left: 50%; background: linear-gradient(45deg, #4f46e5, #818cf8); border-radius: 40%; animation: wave-flow 7s infinite linear; opacity: 0.5; }
              `}</style>
                            <div className="liquid"></div>
                            <div className="liquid" style={{ animationDuration: '5s', opacity: 0.3, borderRadius: '35%' }}></div>
                            <div className="relative z-10 flex flex-col items-center text-white text-center px-4">
                                <Mic size={54} strokeWidth={2.5} className="mb-2 drop-shadow-md" />
                                <span className="font-black tracking-[0.2em] text-lg uppercase">Speak</span>
                            </div>
                        </div>
                    </button>

                    <div className="bg-indigo-50/50 px-6 py-2 rounded-full border border-indigo-100/50">
                        <span className="text-xs font-bold text-indigo-600 italic">
                            {userPlan === 'plus' ? '✨ Acceso Ilimitado' : `${questionsLeft} preguntas gratis hoy`}
                        </span>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm text-center">
                        <TrendingUp size={24} className="text-indigo-500 mx-auto mb-4" />
                        <div className="text-4xl font-black text-slate-900">4 Días</div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Racha de estudio</p>
                        <div className="flex justify-center gap-1.5 mt-6">
                            {[1, 2, 3, 4, 5, 6, 7].map(i => <div key={i} className={`w-1.5 h-6 rounded-full ${i <= 4 ? 'bg-indigo-500' : 'bg-slate-100'}`}></div>)}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );

    if (view === 'scenarios') return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <div className="max-w-2xl mx-auto w-full p-8 pt-12">
                <button onClick={() => setView('dashboard')} className="mb-8 text-indigo-600 font-bold flex items-center gap-2">← Volver</button>
                <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Elige tu escenario</h2>
                <div className="space-y-4">
                    <div onClick={() => { setView('interview'); speakWithBrowser(chatHistory[0].text); }} className="p-6 bg-white rounded-[28px] border-2 border-transparent hover:border-indigo-500 shadow-sm transition-all cursor-pointer flex justify-between items-center group">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors"><Play size={20} fill="currentColor" /></div>
                            <div><h4 className="font-bold text-slate-800">Entrevista de Trabajo</h4><p className="text-xs text-slate-500">Practica con Alex el reclutador</p></div>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </div>

                    <div className="p-6 bg-slate-100/50 rounded-[28px] flex justify-between items-center opacity-70 border-2 border-transparent grayscale">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-slate-200 text-slate-400 rounded-2xl"><Lock size={20} /></div>
                            <div><h4 className="font-bold text-slate-500">Pedir en Restaurante</h4><p className="text-[10px] uppercase font-black text-slate-400 mt-1">Coming Soon</p></div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-100/50 rounded-[28px] flex justify-between items-center opacity-70 border-2 border-transparent grayscale">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-slate-200 text-slate-400 rounded-2xl"><Lock size={20} /></div>
                            <div><h4 className="font-bold text-slate-500">Check-in Aeropuerto</h4><p className="text-[10px] uppercase font-black text-slate-400 mt-1">Coming Soon</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (view === 'interview') return (
        <div className="min-h-screen bg-[#0F172A] text-white flex flex-col p-6">
            <div className="max-w-2xl mx-auto w-full flex-grow flex flex-col">
                <header className="flex justify-between items-center mb-8">
                    <button onClick={() => { window.speechSynthesis.cancel(); setView('scenarios'); }} className="text-slate-500 hover:text-white font-bold transition-colors">← Salir</button>
                    <div className={`px-4 py-2 rounded-full border border-slate-700 flex items-center gap-3 transition-all ${isSpeaking ? 'bg-indigo-500/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-slate-800'}`}>
                        <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-indigo-400 animate-pulse' : 'bg-slate-500'}`}></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{isSpeaking ? 'Alex Hablando' : 'IA Lista'}</span>
                    </div>
                </header>

                <div className="flex-grow overflow-y-auto space-y-6 mb-8 scrollbar-hide pr-2">
                    {chatHistory.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[85%] p-5 rounded-[26px] relative group ${msg.role === 'ai' ? 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-700/50 shadow-sm' : 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-500/10'}`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap pr-6">{msg.text}</p>
                                {msg.role === 'ai' && (
                                    <button
                                        onClick={() => speakWithBrowser(msg.text)}
                                        className="absolute right-3 top-3 text-slate-500 hover:text-indigo-400 transition-colors"
                                        title="Repetir audio"
                                    >
                                        <Volume2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoadingIA && <div className="bg-slate-800/80 p-4 rounded-2xl w-14 animate-pulse flex justify-center border border-slate-700"><Loader2 className="animate-spin text-indigo-400" size={18} /></div>}
                </div>

                <div className="bg-slate-800/60 p-4 rounded-[32px] border border-slate-700 backdrop-blur-xl">
                    <div className="flex gap-3">
                        <button
                            onClick={startListening}
                            className={`p-4 rounded-2xl transition-all ${isListening ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/30' : 'bg-slate-700 hover:bg-slate-600 border border-slate-600'}`}
                        >
                            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                        </button>
                        <input
                            value={userInput}
                            onChange={e => setUserInput(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                            placeholder={isListening ? "Escuchando tu voz..." : "Escribe tu respuesta..."}
                            className="flex-grow bg-slate-900/50 rounded-2xl px-6 py-4 text-sm outline-none border border-transparent focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                        />
                        <button onClick={() => handleSendMessage()} className="bg-indigo-600 p-4 rounded-2xl hover:bg-indigo-500 transition-all shadow-lg active:scale-95 disabled:opacity-50" disabled={isLoadingIA}>
                            <Send size={20} />
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-4 text-center font-bold tracking-[0.2em] uppercase italic opacity-60">Voz de Sistema Integrada</p>
                </div>
            </div>
        </div>
    );

    if (view === 'pricing') return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-4xl mx-auto p-12 text-center flex flex-col items-center">
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Elige tu plan</h2>
                <p className="text-slate-400 font-medium mb-16">Invierte en tu futuro hablando inglés con fluidez</p>
                <div className="grid md:grid-cols-2 gap-8 w-full">
                    <div className="bg-white p-10 rounded-[40px] border border-slate-100 text-left flex flex-col">
                        <h3 className="text-xl font-bold mb-4">Gratis</h3>
                        <div className="text-4xl font-black mb-10">$0<span className="text-sm font-medium text-slate-400">/mes</span></div>
                        <ul className="space-y-4 mb-10 flex-grow text-sm text-slate-600">
                            <li className="flex gap-3"><CheckCircle2 size={18} className="text-green-500 shrink-0" /> 10 Preguntas al día</li>
                            <li className="flex gap-3"><CheckCircle2 size={18} className="text-green-500 shrink-0" /> Modo Entrevista</li>
                            <li className="flex gap-3 text-slate-300 italic"><X size={18} shrink-0 /> Práctica de Restaurante</li>
                            <li className="flex gap-3 text-slate-300 italic"><X size={18} shrink-0 /> Corrección avanzada</li>
                        </ul>
                        <button className="w-full py-4 rounded-2xl bg-slate-100 text-slate-400 font-bold uppercase text-xs tracking-widest">Plan Actual</button>
                    </div>
                    <div className="bg-white p-10 rounded-[40px] border-2 border-indigo-500 shadow-2xl text-left scale-105 relative flex flex-col">
                        <div className="absolute -top-4 right-10 bg-indigo-500 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">Recomendado</div>
                        <h3 className="text-xl font-bold mb-4 flex gap-2">Plus <Sparkles size={18} className="text-indigo-500" /></h3>
                        <div className="text-4xl font-black mb-10">$3<span className="text-sm font-medium text-slate-400">/mes</span></div>
                        <ul className="space-y-4 mb-10 flex-grow text-sm text-slate-800 font-bold">
                            <li className="flex gap-3"><CheckCircle2 size={18} className="text-indigo-500 shrink-0" /> Chat de voz ILIMITADO</li>
                            <li className="flex gap-3"><CheckCircle2 size={18} className="text-indigo-500 shrink-0" /> Todos los escenarios futuros</li>
                            <li className="flex gap-3"><CheckCircle2 size={18} className="text-indigo-500 shrink-0" /> Análisis profundo de errores</li>
                            <li className="flex gap-3"><CheckCircle2 size={18} className="text-indigo-500 shrink-0" /> Soporte prioritario 24/7</li>
                        </ul>
                        <button onClick={() => { setUserPlan('plus'); setView('dashboard'); }} className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all uppercase text-xs tracking-widest">Suscribirse Ahora</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;