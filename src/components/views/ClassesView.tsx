'use client';

import { BookOpen, Crown, Loader2, Send } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Navbar from '../Navbar';
import type { LessonSummary, UserPlan, View } from '@/types/app';

interface ClassesViewProps {
  moduleType: 'GENERAL' | 'CALL_CENTER';
  userPlan: UserPlan;
  onNavigate: (view: View) => void;
}

type LessonChatMessage = { role: 'user' | 'assistant'; text: string };
type LessonChat = Record<string, LessonChatMessage[]>;
type LessonRule = {
  label: string;
  rule: string;
  correct: string;
  incorrect: string;
  fix: string;
};
type PracticeItem = {
  prompt: string;
  sampleAnswer: string;
};
type LessonDoc = {
  intro: string;
  topicDetails: { label: string; explanation: string; example: string }[];
  rules: LessonRule[];
  practice: PracticeItem[];
  tips: string[];
};

function levelLabel(level: LessonSummary['level']) {
  if (level === 'BEGINNER') return 'Principiante';
  if (level === 'INTERMEDIATE') return 'Intermedio';
  return 'Avanzado';
}

function categoryLabel(category: LessonSummary['category']) {
  return category === 'CALL_CENTER' ? 'Ingles para Call Center' : 'Ingles General';
}

function buildFallbackLessonDoc(lesson: LessonSummary): LessonDoc {
  const topicDetails = lesson.syllabus.slice(0, 4).map((item, index) => ({
    label: `Subtema ${index + 1}`,
    explanation: item,
    example: `Aplicacion practica: ${item}.`,
  }));

  const first = lesson.syllabus[0] || lesson.title;
  const second = lesson.syllabus[1] || lesson.description;

  return {
    intro: `${lesson.description} Esta leccion esta organizada en pasos cortos para que avances con claridad de concepto a practica.`,
    topicDetails,
    rules: [
      {
        label: 'Regla de estructura',
        rule: 'Construye respuestas con idea principal + detalle + cierre breve.',
        correct: `In this lesson, I can explain ${first.toLowerCase()} clearly.`,
        incorrect: `I explain ${first.toLowerCase()} clear.`,
        fix: 'Agrega estructura completa y adjetivo correcto: clearly.',
      },
      {
        label: 'Regla de precision',
        rule: 'Evita frases largas; una idea por oracion para sonar natural.',
        correct: `First, I focus on ${second.toLowerCase()}. Then, I confirm the next step.`,
        incorrect: `First I focus and then and then I explain all together without pause.`,
        fix: 'Separa en dos oraciones cortas para mayor claridad.',
      },
    ],
    practice: [
      {
        prompt: `Resume en una frase el punto: ${first}`,
        sampleAnswer: `In this class, we practice ${first.toLowerCase()} with clear examples.`,
      },
      {
        prompt: `Crea una respuesta breve usando: ${second}`,
        sampleAnswer: `I apply ${second.toLowerCase()} to communicate more clearly.`,
      },
    ],
    tips: [
      'Practica en voz alta 10 minutos y graba una respuesta corta.',
      'Repite los ejemplos modelo cambiando solo una variable por vez.',
      'Cierra cada practica con una frase de autocorreccion.',
    ],
  };
}

function renderRichText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`${part}-${index}`}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

export default function ClassesView({ moduleType, userPlan, onNavigate }: ClassesViewProps) {
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const [lessonQuestion, setLessonQuestion] = useState('');
  const [loadingAssistant, setLoadingAssistant] = useState(false);
  const [lessonChats, setLessonChats] = useState<LessonChat>({});

  useEffect(() => {
    fetch('/api/lessons')
      .then(response => response.json())
      .then(data => {
        const lessonsData = data.lessons || [];
        setLessons(lessonsData);
        if (lessonsData.length > 0) {
          setSelectedLessonId(lessonsData[0].id);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredLessons = useMemo(
    () => lessons.filter(lesson => lesson.category === moduleType),
    [lessons, moduleType]
  );

  const selectedLesson = useMemo(
    () => filteredLessons.find(lesson => lesson.id === selectedLessonId) || filteredLessons[0] || null,
    [filteredLessons, selectedLessonId]
  );

  useEffect(() => {
    if (filteredLessons.length > 0 && !filteredLessons.some(lesson => lesson.id === selectedLessonId)) {
      setSelectedLessonId(filteredLessons[0].id);
    }
  }, [filteredLessons, selectedLessonId]);

  const lessonDocs = useMemo<Record<string, LessonDoc>>(
    () => ({
      'beginner-greetings': {
        intro:
          'Aprendes la base del idioma con estructura correcta: sujeto + verbo to be + complemento. Esta clase te permite presentarte sin errores comunes.',
        topicDetails: [
          {
            label: 'Pronombres personales',
            explanation:
              'Reemplazan nombres y definen el verbo correcto: I/you/he/she/it/we/they. Elegir mal el pronombre rompe la concordancia.',
            example: 'I am a student. She is my teacher.',
          },
          {
            label: 'Verbo to be',
            explanation:
              'Se usa para identidad, estado y profesion. Cambia segun sujeto: am/is/are. Tambien forma preguntas invirtiendo orden.',
            example: 'He is tired. We are ready.',
          },
        ],
        rules: [
          {
            label: 'Concordancia sujeto + to be',
            rule: 'I am, you are, he/she/it is, we/they are.',
            correct: 'They are from Mexico.',
            incorrect: 'They is from Mexico.',
            fix: 'Usa are con they: They are from Mexico.',
          },
          {
            label: 'Preguntas con to be',
            rule: 'Mueve am/is/are al inicio de la pregunta.',
            correct: 'Are you ready?',
            incorrect: 'You are ready?',
            fix: 'Forma correcta: Are you ready?',
          },
        ],
        practice: [
          {
            prompt: 'Completa: She ___ a support agent.',
            sampleAnswer: 'She is a support agent.',
          },
          {
            prompt: 'Convierte a pregunta: You are from Peru.',
            sampleAnswer: 'Are you from Peru?',
          },
        ],
        tips: [
          'Practica 10 afirmaciones y 10 preguntas con to be.',
          'No traduzcas literal desde espanol; piensa en el sujeto primero.',
          'Usa contracciones al hablar: I am -> I\'m, we are -> we\'re.',
        ],
      },
      'beginner-daily-routines': {
        intro:
          'Dominas presente simple para hablar de habitos, horarios y rutinas diarias con estructura estable.',
        topicDetails: [
          {
            label: 'Presente simple',
            explanation:
              'Expresa rutinas y hechos generales. Con he/she/it debes agregar -s o -es al verbo principal.',
            example: 'I work every day. She works every day.',
          },
          {
            label: 'Adverbios de frecuencia',
            explanation:
              'Indican frecuencia: always, usually, often, sometimes, never. Normalmente van antes del verbo principal.',
            example: 'I usually wake up at 6 a.m.',
          },
        ],
        rules: [
          {
            label: 'Tercera persona singular',
            rule: 'Con he/she/it agrega -s o -es al verbo en afirmativo.',
            correct: 'He watches videos at night.',
            incorrect: 'He watch videos at night.',
            fix: 'Agrega -es: He watches videos at night.',
          },
          {
            label: 'Do/does para preguntas y negaciones',
            rule: 'Usa do con I/you/we/they y does con he/she/it.',
            correct: 'Does she work on weekends?',
            incorrect: 'She does work on weekends?',
            fix: 'Pregunta correcta: Does she work on weekends?',
          },
        ],
        practice: [
          {
            prompt: 'Corrige: My brother go to work at 8.',
            sampleAnswer: 'My brother goes to work at 8.',
          },
          {
            prompt: 'Haz pregunta: They study English every day.',
            sampleAnswer: 'Do they study English every day?',
          },
        ],
        tips: [
          'Si usas does en pregunta, el verbo vuelve a su forma base.',
          'Practica respuestas cortas: Yes, I do. No, he doesn\'t.',
          'Evita mezclar presente simple con continuo sin contexto.',
        ],
      },
      'intermediate-work-communication': {
        intro:
          'Unificas tiempos clave para conversar con precision: presente, pasado y futuro con preguntas bien armadas.',
        topicDetails: [
          {
            label: 'Presente simple vs continuo',
            explanation:
              'Simple para rutinas y continuo para acciones en progreso. Diferenciar esto mejora claridad en entrevistas.',
            example: 'I work from home. I am working on a report now.',
          },
          {
            label: 'Pasado y futuro funcional',
            explanation:
              'Pasado simple para experiencias cerradas. Will para decisiones al momento y going to para planes previos.',
            example: 'I solved a ticket yesterday. I am going to call the client later.',
          },
        ],
        rules: [
          {
            label: 'WH-questions completas',
            rule: 'Wh-word + auxiliar + sujeto + verbo base.',
            correct: 'Why did you call the customer?',
            incorrect: 'Why you called the customer?',
            fix: 'Incluye auxiliar: Why did you call the customer?',
          },
          {
            label: 'Will vs going to',
            rule: 'Will para decisiones espontaneas; going to para planes ya decididos.',
            correct: 'I will help you now. I am going to study tonight.',
            incorrect: 'I am going to answer now (decision instantanea).',
            fix: 'Para decision instantanea usa will: I will answer now.',
          },
        ],
        practice: [
          {
            prompt: 'Transforma al pasado: I handle customer calls.',
            sampleAnswer: 'I handled customer calls.',
          },
          {
            prompt: 'Escribe una pregunta con why + did.',
            sampleAnswer: 'Why did you escalate the case?',
          },
        ],
        tips: [
          'Responde con tiempo verbal consistente en toda la frase.',
          'Agrega conectores breves para sonar mas natural: because, so.',
          'Evita sobreexplicar; claridad primero, detalle despues.',
        ],
      },
      'advanced-problem-solving': {
        intro:
          'Consolidas estructuras avanzadas para sonar profesional, preciso y natural en escenarios exigentes.',
        topicDetails: [
          {
            label: 'Condicionales',
            explanation:
              'Permiten explicar escenarios reales o hipoteticos con logica. Son clave para proponer soluciones.',
            example: 'If the system fails, we will restart it immediately.',
          },
          {
            label: 'Pasiva y reported speech',
            explanation:
              'La pasiva enfoca proceso, y reported speech ayuda a resumir conversaciones de clientes con precision.',
            example: 'The issue was solved. The client said he needed an urgent update.',
          },
        ],
        rules: [
          {
            label: 'Second conditional',
            rule: 'If + past simple, would + verbo base.',
            correct: 'If I had more data, I would optimize the workflow.',
            incorrect: 'If I would have more data, I optimize the workflow.',
            fix: 'Estructura correcta: If I had..., I would optimize...',
          },
          {
            label: 'Voz pasiva en reportes',
            rule: 'Objeto + be + participio para enfocar resultado.',
            correct: 'The payment was processed at 10:00.',
            incorrect: 'Processed the payment at 10:00.',
            fix: 'Agrega sujeto gramatical: The payment was processed at 10:00.',
          },
        ],
        practice: [
          {
            prompt: 'Convierte a pasiva: The team solved the issue.',
            sampleAnswer: 'The issue was solved by the team.',
          },
          {
            prompt: 'Escribe un second conditional sobre productividad.',
            sampleAnswer: 'If I had a better script, I would solve tickets faster.',
          },
        ],
        tips: [
          'Usa estructuras avanzadas solo cuando aportan claridad.',
          'Evita frases excesivamente largas; separa ideas en dos oraciones.',
          'Practica una respuesta STAR diaria de 60 segundos.',
        ],
      },
      'call-center-opening-script': {
        intro:
          'Entrenas apertura profesional para dar seguridad desde el primer contacto y reducir friccion inicial.',
        topicDetails: [
          {
            label: 'Apertura profesional',
            explanation:
              'Debes incluir saludo, nombre, empresa y ofrecimiento de ayuda en menos de 15 segundos.',
            example: 'Good morning, this is Ana from HablaSpeak Support. How can I assist you today?',
          },
          {
            label: 'Verificacion de seguridad',
            explanation:
              'Verifica identidad antes de compartir informacion sensible. Explica brevemente por que lo haces.',
            example: 'Could you please confirm your full name and last 4 digits of your ID?',
          },
        ],
        rules: [
          {
            label: 'Opening en tres pasos',
            rule: 'Greeting + identification + purpose.',
            correct: 'Hello, this is Laura from Support. I am calling to help with your account request.',
            incorrect: 'Hello, account request, tell me your data.',
            fix: 'Sigue el orden y manten tono cordial.',
          },
          {
            label: 'Consentimiento de verificacion',
            rule: 'Pide datos con frase de seguridad clara.',
            correct: 'For security, may I verify your date of birth?',
            incorrect: 'Give me your date of birth now.',
            fix: 'Usa lenguaje cortés y explica motivo.',
          },
        ],
        practice: [
          {
            prompt: 'Escribe un opening de 2 lineas para soporte tecnico.',
            sampleAnswer:
              'Good afternoon, this is Marco from HablaSpeak Technical Support. I can help you with your connection issue today.',
          },
          {
            prompt: 'Redacta una pregunta de verificacion amable.',
            sampleAnswer: 'For security, could you confirm your billing zip code, please?',
          },
        ],
        tips: [
          'Sonrie al hablar; mejora entonacion y percepcion de empatia.',
          'Evita preguntas dobles en apertura; una por vez.',
          'No uses jerga interna con clientes nuevos.',
        ],
      },
      'call-center-objections': {
        intro:
          'Aprendes a responder objeciones con empatia y metodo para mantener control sin escalar tension.',
        topicDetails: [
          {
            label: 'Empatia inicial',
            explanation:
              'Antes de explicar, valida la emocion del cliente. Esto abre espacio para negociar la solucion.',
            example: 'I understand how frustrating this situation is for you.',
          },
          {
            label: 'Respuesta estructurada',
            explanation: 'Usa una secuencia clara: reconocer, aclarar, resolver y confirmar.',
            example: 'Let me check this now, and I will update you in two minutes.',
          },
        ],
        rules: [
          {
            label: 'No contradigas de inmediato',
            rule: 'Primero reconoce, luego corrige con datos.',
            correct: 'I understand your concern. Let me review the timeline and explain what happened.',
            incorrect: 'You are wrong. The system is correct.',
            fix: 'Empieza con empatia para reducir resistencia.',
          },
          {
            label: 'Cierre con siguiente paso',
            rule: 'Siempre termina la respuesta con accion y tiempo.',
            correct: 'I will reset the service now and confirm in 2 minutes.',
            incorrect: 'I will check it.',
            fix: 'Agrega accion concreta y tiempo estimado.',
          },
        ],
        practice: [
          {
            prompt: 'Responde objecion: This is too expensive.',
            sampleAnswer:
              'I understand your concern about cost. Let me explain the plan options and recommend the most affordable one for your usage.',
          },
          {
            prompt: 'Crea una frase de seguimiento en 1 linea.',
            sampleAnswer: 'I will send you a confirmation email in the next 5 minutes.',
          },
        ],
        tips: [
          'Controla velocidad de voz cuando el cliente sube tono.',
          'No prometas tiempos que no puedas cumplir.',
          'Resume la solucion en una frase final.',
        ],
      },
      'call-center-escalations': {
        intro:
          'Te prepara para escalar casos complejos con trazabilidad, claridad y confianza para el cliente.',
        topicDetails: [
          {
            label: 'Cuando escalar',
            explanation:
              'Escala solo si el caso supera tus permisos, requiere otra area o hay riesgo alto para cliente/empresa.',
            example: 'I will escalate this case to our technical specialists.',
          },
          {
            label: 'Expectativas claras',
            explanation:
              'Define tiempo estimado, canal y responsable de seguimiento para reducir incertidumbre del cliente.',
            example: 'You will receive an update by email within 24 hours.',
          },
        ],
        rules: [
          {
            label: 'Escalar con contexto completo',
            rule: 'Incluye resumen, acciones hechas y evidencia relevante.',
            correct: 'I have documented all troubleshooting steps before escalation.',
            incorrect: 'I escalated the case. Please check.',
            fix: 'Entrega contexto para evitar reprocesos.',
          },
          {
            label: 'No abandonar al cliente',
            rule: 'Explica que pasara despues y cuando volvera a tener noticias.',
            correct: 'Our specialist team will contact you by 3 PM today.',
            incorrect: 'Someone will contact you.',
            fix: 'Da plazo especifico y canal.',
          },
        ],
        practice: [
          {
            prompt: 'Escribe una frase para justificar escalacion tecnica.',
            sampleAnswer:
              'This issue requires advanced diagnostics, so I will escalate it to our technical specialists immediately.',
          },
          {
            prompt: 'Escribe cierre con SLA en una linea.',
            sampleAnswer: 'You will receive an update by email within 24 hours.',
          },
        ],
        tips: [
          'Confirma que el cliente entendio el siguiente paso.',
          'Evita lenguaje ambiguo como soon o maybe.',
          'Registra todo antes de transferir.',
        ],
      },
      'call-center-closing-followup': {
        intro:
          'Aprendes a cerrar llamadas con profesionalismo, confirmando acuerdos y reduciendo recontactos.',
        topicDetails: [
          {
            label: 'Cierre estructurado',
            explanation:
              'Un buen cierre resume solucion, confirma satisfaccion y deja claro el proximo canal de contacto.',
            example: 'Today we updated your account, and you will receive a confirmation email in 10 minutes.',
          },
          {
            label: 'Follow-up profesional',
            explanation:
              'Define responsable, medio y plazo. Sin follow-up claro, el cliente vuelve a llamar por incertidumbre.',
            example: 'If you need more help, reply to the same email and we will assist you.',
          },
        ],
        rules: [
          {
            label: 'Resumen en una frase',
            rule: 'Indica que se hizo + que sigue.',
            correct: 'We reset your password and you can log in now; I will email the steps as well.',
            incorrect: 'Okay, done, bye.',
            fix: 'Incluye accion y siguiente paso antes de despedirte.',
          },
          {
            label: 'Cierre cortes y accionable',
            rule: 'Agradece, valida y deja canal claro.',
            correct: 'Thank you for your patience. If anything else comes up, please reply to our support email.',
            incorrect: 'Call again if needed.',
            fix: 'Ofrece canal concreto y tono profesional.',
          },
        ],
        practice: [
          {
            prompt: 'Escribe un cierre de 2 lineas para caso resuelto.',
            sampleAnswer:
              'Your service is active again, and I sent a confirmation email with the details. Thank you for your time, and please reply to that email if you need any additional help.',
          },
          {
            prompt: 'Escribe una frase de agradecimiento profesional.',
            sampleAnswer: 'Thank you for your patience and for contacting HablaSpeak Support today.',
          },
        ],
        tips: [
          'Nunca cierres sin confirmar que cliente no tiene mas dudas.',
          'Menciona ticket o correo para continuidad.',
          'Usa frases cortas para evitar confusiones al final.',
        ],
      },
    }),
    []
  );

  const selectedLessonDoc = useMemo(
    () => (selectedLesson ? lessonDocs[selectedLesson.slug] || buildFallbackLessonDoc(selectedLesson) : null),
    [lessonDocs, selectedLesson]
  );

  const canPreviewLesson = (lesson: LessonSummary) =>
    lesson.category === 'GENERAL' && lesson.level === 'BEGINNER';

  const canOpenLesson = (lesson: LessonSummary) =>
    userPlan === 'premium' || canPreviewLesson(lesson);

  const handleAskLessonAssistant = async () => {
    if (!selectedLesson || !lessonQuestion.trim()) {
      return;
    }

    if (userPlan !== 'premium') {
      onNavigate('pricing');
      return;
    }

    const question = lessonQuestion.trim();
    setLessonQuestion('');
    setLoadingAssistant(true);

    setLessonChats(prev => ({
      ...prev,
      [selectedLesson.id]: [...(prev[selectedLesson.id] || []), { role: 'user', text: question }],
    }));

    try {
      const response = await fetch(`/api/lessons/${selectedLesson.id}/assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo responder la pregunta');
      }

      setLessonChats(prev => ({
        ...prev,
        [selectedLesson.id]: [...(prev[selectedLesson.id] || []), { role: 'assistant', text: data.answer || 'Sin respuesta' }],
      }));
    } catch (error) {
      setLessonChats(prev => ({
        ...prev,
        [selectedLesson.id]: [
          ...(prev[selectedLesson.id] || []),
          { role: 'assistant', text: error instanceof Error ? error.message : 'Error inesperado' },
        ],
      }));
    } finally {
      setLoadingAssistant(false);
    }
  };

  const renderLessonItem = (lesson: LessonSummary) => {
    const canOpen = canOpenLesson(lesson);
    const isSelected = lesson.id === selectedLessonId;
    return (
      <button
        key={lesson.id}
        onClick={() => {
          if (!canOpen) {
            onNavigate('pricing');
            return;
          }
          setSelectedLessonId(lesson.id);
        }}
        className={`w-full text-left rounded-2xl border p-4 transition-all ${
          isSelected
            ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-300 dark:border-indigo-500'
            : 'bg-white dark:bg-slate-800/70 border-slate-900/20 dark:border-slate-700'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-indigo-500 mb-1">
              {categoryLabel(lesson.category)} · {levelLabel(lesson.level)}
            </p>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">{lesson.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{lesson.description}</p>
          </div>
          {!canOpen ? (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] font-black text-amber-600 dark:text-amber-300">
              <Crown size={12} />
              Premium
            </span>
          ) : null}
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar userPlan={userPlan} onNavigate={onNavigate} />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:p-8 space-y-6 sm:space-y-8">
        <section className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-indigo-500 mb-3">Academia HablaSpeak</p>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {moduleType === 'GENERAL' ? 'Modulo: Ingles General' : 'Modulo: Ingles para Call Center'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-3xl">
              {moduleType === 'GENERAL'
                ? 'Aqui encuentras gramatica, verbos, pronombres y tiempos con ejemplos claros.'
                : 'Aqui encuentras guias practicas para apertura, objeciones y escalaciones en call center.'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-900/20 dark:border-slate-700 font-bold"
          >
            Volver al dashboard
          </button>
        </section>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
          </div>
        ) : (
          <section className="grid lg:grid-cols-12 gap-4 sm:gap-6">
            <aside className="lg:col-span-3 space-y-4">
              <div className="rounded-2xl p-4 bg-white dark:bg-slate-800/80 border border-slate-900/20 dark:border-slate-700">
                <h2 className="font-black text-sm uppercase tracking-[0.2em] text-slate-500 mb-3">
                  {moduleType === 'GENERAL' ? 'Lecciones generales' : 'Lecciones call center'}
                </h2>
                <div className="space-y-3">
                  {filteredLessons.map(renderLessonItem)}
                </div>
              </div>
            </aside>

            <article className="lg:col-span-5 rounded-[24px] sm:rounded-[28px] border border-slate-900/20 dark:border-slate-700 bg-white dark:bg-slate-800/80 p-4 sm:p-6">
              {selectedLesson ? (
                <>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-indigo-500">
                      {categoryLabel(selectedLesson.category)}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                      {levelLabel(selectedLesson.level)}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3">{selectedLesson.title}</h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">{selectedLesson.description}</p>

                  <div className="rounded-2xl border border-slate-900/20 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/60 mb-6">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-black text-slate-500 mb-3">Explicacion del tema</h3>
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      {selectedLessonDoc?.intro ||
                        'Tema orientado a reforzar tu comunicacion en ingles con estructura clara y practica guiada.'}
                    </p>
                  </div>

                  <h3 className="text-xs uppercase tracking-[0.2em] font-black text-slate-500 mb-3">Temario</h3>
                  <div className="space-y-2 mb-6">
                    {selectedLesson.syllabus.map(item => (
                      <div key={item} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <BookOpen size={14} className="text-indigo-500 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-xs uppercase tracking-[0.2em] font-black text-slate-500 mb-3">Explicacion por subtema</h3>
                  <div className="space-y-4 mb-6">
                    {(selectedLessonDoc?.topicDetails || []).map(detail => (
                      <div key={detail.label} className="rounded-2xl border border-slate-900/20 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/60">
                        <p className="text-sm font-black text-slate-800 dark:text-slate-100">{detail.label}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{detail.explanation}</p>
                        <p className="text-sm text-indigo-600 dark:text-indigo-300 mt-2">Ejemplo: {detail.example}</p>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-xs uppercase tracking-[0.2em] font-black text-slate-500 mb-3">Reglas clave con correcciones</h3>
                  <div className="space-y-4 mb-6">
                    {(selectedLessonDoc?.rules || []).map(rule => (
                      <div key={rule.label} className="rounded-2xl border border-slate-900/20 dark:border-slate-700 p-4 bg-white dark:bg-slate-900/40">
                        <p className="text-sm font-black text-slate-900 dark:text-slate-100">{rule.label}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{rule.rule}</p>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-2">Correcto: {rule.correct}</p>
                        <p className="text-sm text-rose-700 dark:text-rose-300 mt-1">Incorrecto: {rule.incorrect}</p>
                        <p className="text-sm text-indigo-600 dark:text-indigo-300 mt-1">Correccion: {rule.fix}</p>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-xs uppercase tracking-[0.2em] font-black text-slate-500 mb-3">Mini practica guiada</h3>
                  <div className="space-y-3 mb-6">
                    {(selectedLessonDoc?.practice || []).map((exercise, index) => (
                      <div
                        key={`${exercise.prompt}-${index}`}
                        className="rounded-2xl border border-dashed border-slate-900/30 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/50"
                      >
                        <p className="text-sm text-slate-700 dark:text-slate-200">
                          <span className="font-black">Ejercicio: </span>
                          {exercise.prompt}
                        </p>
                        <p className="text-sm text-indigo-600 dark:text-indigo-300 mt-2">
                          <span className="font-black">Respuesta modelo: </span>
                          {exercise.sampleAnswer}
                        </p>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-xs uppercase tracking-[0.2em] font-black text-slate-500 mb-3">Tips de estudio</h3>
                  <div className="space-y-2">
                    {(selectedLessonDoc?.tips || []).map(tip => (
                      <p key={tip} className="text-sm text-slate-700 dark:text-slate-300">
                        • {tip}
                      </p>
                    ))}
                  </div>
                </>
              ) : null}
            </article>

            <aside className="lg:col-span-4 rounded-[24px] sm:rounded-[28px] border border-slate-900/20 dark:border-slate-700 bg-white dark:bg-slate-800/80 p-4 sm:p-6 flex flex-col min-h-[520px] lg:min-h-[650px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-black text-sm uppercase tracking-[0.2em] text-slate-500">Chatbot de clase</h2>
                {userPlan !== 'premium' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] font-black text-amber-600 dark:text-amber-300">
                    <Crown size={12} />
                    Premium
                  </span>
                ) : null}
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Pregunta dudas del tema actual y recibe explicaciones guiadas.
              </p>

              <div className="flex-grow rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-900/20 dark:border-slate-700 p-4 space-y-3 overflow-y-auto min-h-[300px] sm:min-h-[420px]">
                {(selectedLesson && lessonChats[selectedLesson.id]?.length
                  ? lessonChats[selectedLesson.id]
                  : [{ role: 'assistant' as const, text: 'Estoy listo para ayudarte con esta clase. Puedes preguntar reglas, ejemplos y ejercicios.' }]
                ).map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white ml-4'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 mr-4 border border-slate-900/20 dark:border-slate-700'
                    }`}
                  >
                    {renderRichText(message.text)}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-3">
                <input
                  value={lessonQuestion}
                  onChange={event => setLessonQuestion(event.target.value)}
                  onKeyDown={event => event.key === 'Enter' && !loadingAssistant && handleAskLessonAssistant()}
                  placeholder={userPlan === 'premium' ? 'Pregunta algo de esta clase...' : 'Disponible en premium'}
                  disabled={userPlan !== 'premium' || loadingAssistant || !selectedLesson}
                  className="flex-grow rounded-2xl px-4 py-3 text-sm bg-slate-100 dark:bg-slate-900/60 border border-slate-900/20 dark:border-slate-700 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 disabled:opacity-60"
                />
                <button
                  onClick={handleAskLessonAssistant}
                  disabled={userPlan !== 'premium' || loadingAssistant || !selectedLesson || !lessonQuestion.trim()}
                  className="px-4 rounded-2xl bg-indigo-600 text-white disabled:opacity-50"
                >
                  {loadingAssistant ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>

              {userPlan !== 'premium' ? (
                <button
                  onClick={() => onNavigate('pricing')}
                  className="mt-3 py-3 rounded-2xl bg-amber-500 text-white text-xs uppercase tracking-widest font-black"
                >
                  Desbloquear chatbot IA
                </button>
              ) : null}
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}
