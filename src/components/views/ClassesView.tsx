'use client';

import { BookOpen, Crown, Loader2, Send } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Navbar from '../Navbar';
import type { LessonSummary, UserPlan, View } from '@/types/app';
import { GENERAL_CURRICULUM } from '@/lib/general-curriculum';
import { CALLCENTER_CURRICULUM } from '@/lib/callcenter-curriculum';

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
  const [showMobileLessonDetail, setShowMobileLessonDetail] = useState(false);

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

  useEffect(() => {
    setShowMobileLessonDetail(false);
  }, [moduleType]);

  const lessonDocs = useMemo<Record<string, LessonDoc>>(
    () => ({
      ...CALLCENTER_CURRICULUM,
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
    }),
    []
  );

  const selectedLessonDoc = useMemo(
    () => (selectedLesson ? lessonDocs[selectedLesson.slug] || buildFallbackLessonDoc(selectedLesson) : null),
    [lessonDocs, selectedLesson]
  );

  const selectedGeneralTopic = useMemo(() => {
    if (!selectedLesson || selectedLesson.category !== 'GENERAL') return null;
    for (const section of GENERAL_CURRICULUM) {
      const topic = section.topics.find(t => t.slug === selectedLesson.slug);
      if (topic) return topic;
    }
    return null;
  }, [selectedLesson]);

  const canPreviewLesson = (lesson: LessonSummary) =>
    lesson.category === 'GENERAL' && lesson.level === 'BEGINNER';

  const canOpenLesson = (lesson: LessonSummary) =>
    userPlan === 'premium' || canPreviewLesson(lesson);

  const quickSuggestions =
    moduleType === 'GENERAL'
      ? ['Give me examples for this exercise', 'Create a quiz for this topic', 'Summarize this lesson']
      : ['Give me examples for this call center scenario', 'Create a short quiz for this topic', 'Summarize this as a call script'];

  const handleAskLessonAssistant = async (suggestedQuestion?: string) => {
    if (!selectedLesson) {
      return;
    }

    if (userPlan !== 'premium') {
      onNavigate('pricing');
      return;
    }

    const question = (suggestedQuestion || lessonQuestion).trim();
    if (!question) {
      return;
    }

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
          setShowMobileLessonDetail(true);
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
            <aside className={`lg:col-span-3 space-y-4 ${showMobileLessonDetail ? 'hidden lg:block' : 'block'}`}>
              <div className="rounded-2xl p-4 bg-white dark:bg-slate-800/80 border border-slate-900/20 dark:border-slate-700">
                <h2 className="font-black text-sm uppercase tracking-[0.2em] text-slate-500 mb-3">
                  {moduleType === 'GENERAL' ? 'Lecciones generales' : 'Lecciones call center'}
                </h2>
                <div className="space-y-3">
                  {filteredLessons.map(renderLessonItem)}
                </div>
              </div>
            </aside>

            <article className={`lg:col-span-5 rounded-[24px] sm:rounded-[28px] border border-slate-900/20 dark:border-slate-700 bg-white dark:bg-slate-800/80 p-4 sm:p-6 ${showMobileLessonDetail ? 'block' : 'hidden lg:block'}`}>
              {selectedLesson ? (
                <>
                  <button
                    onClick={() => setShowMobileLessonDetail(false)}
                    className="mb-4 lg:hidden text-indigo-600 dark:text-indigo-300 text-sm font-bold"
                  >
                    ← Volver a temas
                  </button>
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

                  {moduleType === 'GENERAL' ? (
                    <>
                      {selectedGeneralTopic ? (
                        <div className="space-y-4">
                          <div className="rounded-2xl border border-slate-900/20 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/60">
                            <p className="text-xs uppercase tracking-[0.2em] font-black text-slate-400 mb-1">Explicacion</p>
                            <p className="text-sm text-slate-700 dark:text-slate-200">{selectedGeneralTopic.explanation}</p>
                          </div>
                          <div className="rounded-2xl border border-indigo-200 dark:border-indigo-500/30 p-4 bg-indigo-50 dark:bg-indigo-500/10">
                            <p className="text-xs uppercase tracking-[0.2em] font-black text-indigo-500 mb-1">Ejemplo</p>
                            <p className="text-sm text-indigo-700 dark:text-indigo-200 font-medium">{selectedGeneralTopic.example}</p>
                          </div>
                          <div className="rounded-2xl border border-dashed border-slate-900/30 dark:border-slate-600 p-4 bg-white dark:bg-slate-900/40">
                            <p className="text-xs uppercase tracking-[0.2em] font-black text-slate-400 mb-1">Ejercicio</p>
                            <p className="text-sm text-slate-700 dark:text-slate-200">{selectedGeneralTopic.exercise}</p>
                          </div>
                          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-500/30 p-4 bg-emerald-50 dark:bg-emerald-500/10">
                            <p className="text-xs uppercase tracking-[0.2em] font-black text-emerald-600 mb-1">Tip</p>
                            <p className="text-sm text-emerald-700 dark:text-emerald-200">{selectedGeneralTopic.tip}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {selectedLesson.syllabus.map(item => (
                            <div key={item} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                              <BookOpen size={14} className="text-indigo-500 shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
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
                  )}
                </>
              ) : null}
            </article>

            <aside className={`lg:col-span-4 rounded-[24px] sm:rounded-[28px] border border-slate-900/20 dark:border-slate-700 bg-white dark:bg-slate-800/80 p-4 sm:p-6 flex-col min-h-[520px] lg:min-h-[650px] ${showMobileLessonDetail ? 'flex' : 'hidden lg:flex'}`}>
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

              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-2">
                  Sugerencias
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => handleAskLessonAssistant(suggestion)}
                      disabled={userPlan !== 'premium' || loadingAssistant || !selectedLesson}
                      className="px-3 py-2 rounded-full text-xs bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-grow rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-900/20 dark:border-slate-700 p-4 space-y-3 overflow-y-auto min-h-[300px] sm:min-h-[420px]">
                {(selectedLesson && lessonChats[selectedLesson.id]?.length
                  ? lessonChats[selectedLesson.id]
                  : [{ role: 'assistant' as const, text: 'I am ready to help you with this lesson. Ask for rules, examples, or exercises.' }]
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
                  placeholder={userPlan === 'premium' ? 'Ask something about this lesson...' : 'Available in premium'}
                  disabled={userPlan !== 'premium' || loadingAssistant || !selectedLesson}
                  className="flex-grow rounded-2xl px-4 py-3 text-sm bg-slate-100 dark:bg-slate-900/60 border border-slate-900/20 dark:border-slate-700 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 disabled:opacity-60"
                />
                <button
                  onClick={() => handleAskLessonAssistant()}
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
