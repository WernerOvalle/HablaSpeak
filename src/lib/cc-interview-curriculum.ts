export type CciLessonRule = {
  label: string;
  rule: string;
  correct: string;
  incorrect: string;
  fix: string;
};

export type CciPracticeItem = {
  prompt: string;
  sampleAnswer: string;
};

export type CciLessonDoc = {
  intro: string;
  topicDetails: { label: string; explanation: string; example: string }[];
  rules: CciLessonRule[];
  practice: CciPracticeItem[];
  tips: string[];
};

export const CC_INTERVIEW_CURRICULUM: Record<string, CciLessonDoc> = {
  'cci-self-introduction': {
    intro:
      'La auto-presentacion es la primera oportunidad de causar una buena impresion. En call centers, los entrevistadores buscan claridad, confianza y que conectes tu perfil con el rol. Una respuesta bien estructurada de 60-90 segundos marca la diferencia desde el inicio.',
    topicDetails: [
      {
        label: 'Estructura: nombre + experiencia + objetivo',
        explanation:
          'Comienza con tu nombre, luego menciona tu experiencia relevante (en servicio al cliente, idiomas o trabajos anteriores), y cierra con por que quieres este rol especifico. Mantente enfocado: tres partes, nada mas.',
        example:
          'My name is Carlos. I have two years of experience in customer service and I am fluent in English and Spanish. I am applying because I want to develop my professional skills in a call center environment.',
      },
      {
        label: 'Conectar habilidades con el rol',
        explanation:
          'No basta con listar tus habilidades — debes mostrar como encajan en el trabajo de call center. Menciona comunicacion, paciencia, resolucion de problemas o manejo de herramientas si aplica.',
        example:
          'I believe my communication skills and patience with customers make me a strong fit for this position.',
      },
      {
        label: 'Tono confiado sin sonar memorizado',
        explanation:
          'Practica la presentacion en voz alta pero no la memorices palabra por palabra. Usa frases ancla como guia y habla con naturalidad. El entrevistador valora la autenticidad.',
        example:
          'I have practiced customer interactions in English and I am comfortable handling different types of clients.',
      },
    ],
    rules: [
      {
        label: 'Usa presente simple para describir habilidades actuales',
        rule: 'Hablar de habilidades presentes requiere presente simple, no presente continuo.',
        correct: 'I speak English fluently and I work well under pressure.',
        incorrect: 'I am speaking English fluently and I am working well under pressure.',
        fix: 'Reserva el continuo para acciones en progreso ahora mismo. Las habilidades van en simple.',
      },
      {
        label: 'Evita abrir con "I am going to tell you about myself"',
        rule: 'Ir directo al punto suena mas profesional que anunciar lo que vas a decir.',
        correct: 'My name is Ana and I have three years in customer support.',
        incorrect: 'I am going to tell you about myself. So, my name is Ana...',
        fix: 'Empieza directamente con nombre y experiencia. Sin preambulos.',
      },
    ],
    practice: [
      {
        prompt: 'Escribe una auto-presentacion de 3 oraciones: nombre, experiencia clave, objetivo en CC.',
        sampleAnswer:
          'My name is Luis. I have one year of experience in retail customer service and I am bilingual in English and Spanish. I am interested in this call center role because I want to grow professionally in a fast-paced environment.',
      },
      {
        prompt: 'Convierte esta frase debil en una fuerte: "I like talking to people and I think I am good at English."',
        sampleAnswer:
          'I have strong communication skills in English and I enjoy helping customers find solutions to their problems.',
      },
    ],
    tips: [
      'Graba tu presentacion y escuchala — notaras muletillas y partes a mejorar.',
      'Practica frente al espejo para trabajar contacto visual y postura.',
      'Cronometra tu respuesta: 60-90 segundos es el rango ideal.',
    ],
  },

  'cci-motivation': {
    intro:
      '"Why do you want this job?" es una de las preguntas mas frecuentes y peor respondidas en entrevistas de call center. Los candidatos suelen dar respuestas genericas que no convencen. Esta leccion te enseña a construir una respuesta autentica, enfocada y memorable.',
    topicDetails: [
      {
        label: 'Estructura: razon + habilidad + aporte',
        explanation:
          'Una respuesta solida de motivacion incluye: por que te interesa este rol (razon), que habilidad tienes que lo respalda (habilidad), y que puedes aportar a la empresa (aporte). Esta formula hace que la respuesta sea especifica y creible.',
        example:
          'I want to work in call center support because I enjoy solving problems for people. I am fluent in English and I have strong communication skills. I believe I can help your team deliver excellent customer experiences.',
      },
      {
        label: 'Conectar con la empresa',
        explanation:
          'Mencionar algo especifico de la empresa — su reputacion, sus valores o el tipo de clientes que maneja — muestra que hiciste tu investigacion y que el interes es genuino, no generico.',
        example:
          'I researched your company and I was impressed by the focus on first-call resolution. That aligns with how I approach customer service.',
      },
      {
        label: 'Mostrar conocimiento del rol',
        explanation:
          'Demuestra que entiendes que implica trabajar en un call center: manejar multiples llamadas, mantener calidad bajo presion, trabajar en turnos. Esto reduce el riesgo percibido por el entrevistador.',
        example:
          'I understand that this role requires patience, multitasking, and the ability to stay calm under pressure — and I am ready for that.',
      },
    ],
    rules: [
      {
        label: 'Evita respuestas centradas solo en ti',
        rule: 'Una buena respuesta de motivacion equilibra tus intereses con el valor que aportas a la empresa.',
        correct:
          'I am passionate about helping people and I believe this role will allow me to use my English skills to make a real difference for customers.',
        incorrect: 'I want this job because I need work and the salary is good.',
        fix: 'Agrega una razon que beneficie a la empresa: ayudar clientes, aportar habilidades, contribuir al equipo.',
      },
      {
        label: 'Usa "I believe" para sonar seguro sin ser arrogante',
        rule: '"I believe" + afirmacion positiva proyecta confianza sin exagerar.',
        correct: 'I believe my communication skills make me a strong candidate for this role.',
        incorrect: 'I am the best candidate because I know everything about customer service.',
        fix: 'Usa "I believe" o "I am confident that" para afirmar sin sonar prepotente.',
      },
    ],
    practice: [
      {
        prompt: 'Escribe una respuesta de 2-3 oraciones para "Why do you want to work in our call center?"',
        sampleAnswer:
          'I want to work in your call center because I enjoy helping people and I thrive in fast-paced environments. I have strong English communication skills and experience handling customer inquiries. I believe this role is a great opportunity to grow professionally while contributing to your team.',
      },
      {
        prompt: 'Corrige esta respuesta: "I want this job because I want to practice my English and I need money."',
        sampleAnswer:
          'I am interested in this role because I want to apply my English skills in a professional environment and contribute to customer satisfaction.',
      },
    ],
    tips: [
      'Investiga la empresa antes de la entrevista: mision, clientes, tipo de soporte que ofrecen.',
      'Evita mencionar el salario como razon principal — suena desmotivado para el entrevistador.',
      'Conecta al menos una habilidad concreta con el rol en tu respuesta.',
    ],
  },

  'cci-customer-mindset': {
    intro:
      'Los entrevistadores de call center evaluan tu orientacion al cliente desde las primeras respuestas. No buscan que memorices definiciones — buscan que demuestres, con ejemplos reales, que pones al cliente primero. Esta leccion te prepara para transmitir esa actitud con lenguaje preciso.',
    topicDetails: [
      {
        label: 'Orientacion al cliente: que significa',
        explanation:
          'Orientacion al cliente es priorizar la experiencia y resolucion del cliente por encima de procesos mecanicos. En call center, significa escuchar activamente, validar la frustracion y enfocarse en soluciones, no en culpas.',
        example:
          'When a customer is frustrated, I focus on understanding their problem first before offering a solution.',
      },
      {
        label: 'Empatia vs simpatia en ingles',
        explanation:
          'Empatia es entender y compartir el sentimiento del cliente ("I understand how frustrating this must be"). Simpatia es sentir pena ("I am sorry for you"). En CC, la empatia es mas poderosa porque conecta con la experiencia del cliente.',
        example:
          'I understand how frustrating it must be to wait this long. Let me look into this right away.',
      },
      {
        label: 'Vocabulario de servicio al cliente',
        explanation:
          'Frases como "I will take care of that", "Let me make sure I understand", "I appreciate your patience" demuestran profesionalismo y orientacion al cliente de forma instantanea.',
        example:
          'Thank you for bringing this to our attention. I will make sure this is resolved for you today.',
      },
    ],
    rules: [
      {
        label: 'Empieza la empatia antes de la solucion',
        rule: 'Siempre valida primero, resuelve despues. El cliente necesita sentirse escuchado.',
        correct:
          'I completely understand your frustration. Let me check what happened with your order right now.',
        incorrect: 'Okay, let me check your order. What is the number?',
        fix: 'Agrega una frase de empatia antes de pasar a la accion. Reduce la tension de inmediato.',
      },
      {
        label: 'Evita frases que minimizan el problema',
        rule: '"No problem" o "It is not a big deal" pueden sonar desconsideradas cuando el cliente esta frustrado.',
        correct: 'I understand this has caused an inconvenience and I will do my best to resolve it.',
        incorrect: 'No problem, these things happen all the time.',
        fix: 'Reemplaza frases minimizadoras con reconocimiento genuino del impacto.',
      },
    ],
    practice: [
      {
        prompt: 'Escribe una frase de empatia para: "I have been on hold for 30 minutes!"',
        sampleAnswer:
          'I sincerely apologize for the wait. I understand that 30 minutes is a long time and I appreciate your patience. Let me help you right away.',
      },
      {
        prompt: 'Da un ejemplo real (o inventado) de cuando pusiste al cliente primero en una situacion dificil.',
        sampleAnswer:
          'In a previous job, a customer was upset because their order arrived damaged. Instead of following the standard process immediately, I first acknowledged their frustration, apologized, and then explained the replacement process step by step.',
      },
    ],
    tips: [
      'Practica frases de empatia en voz alta hasta que suenen naturales, no memorizadas.',
      'En la entrevista, usa ejemplos concretos — no solo dices que eres empatico, lo demuestras.',
      'Evita usar "no problem" como filler — suena automatico y poco sincero.',
    ],
  },

  'cci-stress-handling': {
    intro:
      'Una de las preguntas clave en entrevistas de CC es como manejas el estres, clientes dificiles o situaciones de alta presion. Esta leccion te enseña a responder con ejemplos estructurados que demuestran estabilidad emocional y profesionalismo, sin sonar negativo ni evasivo.',
    topicDetails: [
      {
        label: 'Preguntas tipicas sobre estres',
        explanation:
          '"How do you handle stress?" y "Tell me about a time you dealt with a difficult customer" son las mas frecuentes. Ambas buscan evidencia de que puedes mantener la calidad del servicio bajo presion.',
        example:
          'Tell me about a challenging situation at work and how you handled it.',
      },
      {
        label: 'Estructura: situacion + accion + resultado',
        explanation:
          'Para responder preguntas de presion, describe brevemente la situacion, explica la accion que tomaste (enfocada en solucion, no en emocion), y el resultado positivo. Esta estructura demuestra madurez profesional.',
        example:
          'A customer called very upset about a billing error. I listened carefully, apologized sincerely, and processed the correction immediately. The customer thanked me before hanging up.',
      },
      {
        label: 'Vocabulario de manejo emocional',
        explanation:
          'Usa frases que muestren control: "I stay calm", "I focus on finding a solution", "I take a deep breath and listen". Estas expresiones proyectan estabilidad sin sonar robotico.',
        example:
          'When I face a stressful call, I stay calm and focus on what I can control: listening carefully and finding the best solution available.',
      },
    ],
    rules: [
      {
        label: 'No describas el estres, describe la accion',
        rule: 'El entrevistador no quiere saber que tan estresado estabas — quiere saber que hiciste.',
        correct:
          'The call was intense, but I took a moment to listen carefully and then followed the escalation process.',
        incorrect: 'It was super stressful and I was really nervous and did not know what to do.',
        fix: 'Reduce el lenguaje emocional negativo. Salta rapido a la accion y el resultado.',
      },
      {
        label: 'Cierra siempre con un resultado positivo',
        rule: 'Tu historia de estres debe terminar con aprendizaje o resolucion — no con frustracion.',
        correct:
          'In the end, the customer was satisfied and I learned to stay calm and follow the process even under pressure.',
        incorrect: 'It was a nightmare and I do not really know how it ended.',
        fix: 'Si no recuerdas el resultado exacto, inventa uno plausible que muestre resolucion positiva.',
      },
    ],
    practice: [
      {
        prompt: 'Responde en 3 oraciones: "How do you handle a very angry customer?"',
        sampleAnswer:
          'When I face an angry customer, I first listen without interrupting and acknowledge their frustration. Then I stay calm and focus on finding a concrete solution. I have found that most customers calm down when they feel heard and see that I am actively working to help them.',
      },
      {
        prompt: 'Describe una situacion de presion usando la estructura situacion + accion + resultado.',
        sampleAnswer:
          'Once a customer called demanding an immediate refund for a charge they did not recognize. I listened carefully, verified the transaction, and explained the process clearly. The customer agreed to wait for the standard resolution time and thanked me for my patience.',
      },
    ],
    tips: [
      'Prepara 2-3 historias reales de situaciones dificiles antes de tu entrevista.',
      'Evita hablar mal de clientes o companeros — el entrevistador evaluara tu actitud.',
      'Practica responder en ingles en voz alta para reducir la presion del momento.',
    ],
  },

  'cci-english-fluency': {
    intro:
      'En entrevistas de call center, tu ingles es evaluado constantemente — no solo en las respuestas, sino en como te expresas, pausas, corriges y fluyes. Esta leccion te da estrategias concretas para sonar mas fluido y profesional, aunque no seas perfecto.',
    topicDetails: [
      {
        label: 'Ritmo y entonacion',
        explanation:
          'Hablar muy rapido suena nervioso; muy lento suena inseguro. Practica un ritmo moderado con pausas naturales. La entonacion ascendente en preguntas y descendente en afirmaciones marca tu nivel de dominio.',
        example:
          'Could you tell me more about the position? (ascendente) / I am confident in my communication skills. (descendente)',
      },
      {
        label: 'Como recuperarse de un error',
        explanation:
          'Todos cometen errores al hablar. La clave es recuperarse con naturalidad: "What I mean is...", "Let me rephrase that...", "Actually, I wanted to say...". No te disculpes en exceso — corrige y sigue.',
        example:
          'I worked in retail for... actually, let me rephrase that — I have experience in customer-facing roles in retail for two years.',
      },
      {
        label: 'Expresiones de precision y confirmacion',
        explanation:
          'Frases como "What I mean is", "To be more specific", "In other words" te permiten ganar tiempo y clarificar sin sonar inseguro. Tambien puedes confirmar: "Does that make sense?" o "I hope that answers your question."',
        example:
          'What I mean is that I enjoy fast-paced environments where I can help customers directly.',
      },
    ],
    rules: [
      {
        label: 'Evita muletillas en ingles',
        rule: '"Um", "uh", "like", "you know" frecuentes dan imagen de poca fluidez. Usa pausas en silencio en su lugar.',
        correct: 'I have experience in... customer service roles where I handled... high-volume calls.',
        incorrect: 'I have, like, um, experience in, you know, customer service and stuff.',
        fix: 'Practica pausas silenciosas en lugar de muletillas. Son mas profesionales y dan tiempo para pensar.',
      },
      {
        label: 'Usa conectores para sonar mas fluido',
        rule: 'Conectores como "also", "in addition", "for example", "however" hacen que tu ingles fluya con estructura.',
        correct:
          'I am bilingual. In addition, I have experience with CRM tools. For example, I used Salesforce in my previous role.',
        incorrect: 'I am bilingual. I have experience with CRM. I used Salesforce before.',
        fix: 'Conecta oraciones con transiciones para que tu discurso suene organizado y natural.',
      },
    ],
    practice: [
      {
        prompt: 'Graba y practica esta frase en voz alta con ritmo natural: "I have strong communication skills in English and I enjoy working in fast-paced environments."',
        sampleAnswer:
          'I have strong communication skills in English — and I enjoy working in fast-paced environments.',
      },
      {
        prompt: 'Corrige con naturalidad: "I am... uh... fluent in English, like, I speak it every day and, you know, I practice a lot."',
        sampleAnswer:
          'I speak English fluently. I practice daily and I am comfortable using it in professional settings.',
      },
    ],
    tips: [
      'Escucha podcasts o videos de entrevistas en ingles para internalizar el ritmo natural.',
      'Graba tus respuestas y cuenta las muletillas — reducirlas mejora tu imagen enormemente.',
      'La fluidez no es perfeccion gramatical — es claridad, ritmo y recuperacion de errores.',
    ],
  },

  'cci-star-method': {
    intro:
      'El metodo STAR (Situation, Task, Action, Result) es el formato estandar para responder preguntas situacionales en entrevistas de call center. Estructurar tus respuestas con STAR te hace sonar preparado, claro y profesional. Esta leccion te enseña a aplicarlo con ejemplos reales de CC.',
    topicDetails: [
      {
        label: 'Situacion y Tarea',
        explanation:
          'Describe brevemente el contexto (Situation) y cual era tu responsabilidad o el desafio especifico (Task). Mantelo corto — 1-2 oraciones. El entrevistador necesita contexto, no una historia larga.',
        example:
          'While working in a retail support role, I received a call from a customer who had been waiting three days for a resolution to a billing error. My task was to resolve the issue within that call.',
      },
      {
        label: 'Accion',
        explanation:
          'Esta es la parte mas importante — describe exactamente lo que HICISTE. Usa primera persona ("I listened", "I escalated", "I explained"). Evita decir "we" — el entrevistador quiere saber tu aporte especifico.',
        example:
          'I listened carefully to understand the full situation, verified the charge in the system, and processed a correction after confirming it was an error.',
      },
      {
        label: 'Resultado',
        explanation:
          'Cierra con el resultado positivo de tu accion. Si puedes, quantifica ("the customer gave a 5-star rating", "the issue was resolved in one call"). Si no tienes numero, describe el impacto positivo.',
        example:
          'The customer was satisfied and mentioned that she would recommend the company to others. The issue was resolved in a single call.',
      },
    ],
    rules: [
      {
        label: 'Usa primera persona en la Accion',
        rule: 'La parte de accion debe describir lo que TU hiciste, no el equipo.',
        correct: 'I immediately escalated the case to the billing department and followed up within the hour.',
        incorrect: 'We escalated the case and the team handled it.',
        fix: 'Reemplaza "we" con "I" en la seccion de Accion para mostrar tu responsabilidad individual.',
      },
      {
        label: 'No omitas el Resultado',
        rule: 'Una respuesta STAR sin resultado queda incompleta y no impresiona al entrevistador.',
        correct:
          'As a result, the customer was fully satisfied and the issue was documented for process improvement.',
        incorrect: 'So I handled it and then the call ended.',
        fix: 'Siempre cierra con un resultado medible o descripcion del impacto positivo.',
      },
    ],
    practice: [
      {
        prompt: 'Construye una respuesta STAR para: "Tell me about a time you turned an angry customer into a satisfied one."',
        sampleAnswer:
          'A customer called extremely upset about a double charge on his account. My task was to resolve the billing issue quickly and professionally. I listened without interrupting, verified the charges, confirmed it was an error, and processed the refund immediately while explaining each step. As a result, the customer thanked me and said it was the best customer service experience he had had.',
      },
      {
        prompt: 'Identifica que parte falta: "I once had a difficult customer. I stayed calm and explained the policy. The call ended."',
        sampleAnswer:
          'Falta el Resultado con impacto positivo. Agrega: "As a result, the customer understood and accepted the policy without further escalation."',
      },
    ],
    tips: [
      'Prepara 3 historias STAR antes de tu entrevista: una de cliente dificil, una de solucion bajo presion, una de trabajo en equipo.',
      'Practica cronometrando tus respuestas: 60-90 segundos es el rango ideal para STAR.',
      'Evita exagerar — los entrevistadores detectan facilmente respuestas poco creibles.',
    ],
  },

  'cci-availability': {
    intro:
      'Los call centers operan 24/7 con turnos rotativos. La disponibilidad y flexibilidad de horario son temas criticos en la entrevista — una respuesta mal formulada puede eliminarte aunque tengas el perfil ideal. Esta leccion te da el vocabulario y las frases para comunicar tu disponibilidad de forma clara y positiva.',
    topicDetails: [
      {
        label: 'Vocabulario de turnos y horarios',
        explanation:
          'Shift (turno), morning shift, afternoon shift, night shift, rotating shifts, weekends, weekdays, overtime. Conocer este vocabulario es esencial para entender preguntas y responder con precision.',
        example:
          'I am available for morning and afternoon shifts, including weekends.',
      },
      {
        label: 'Como expresar disponibilidad',
        explanation:
          'Se especifico pero positivo. "I am available from Monday to Saturday, from 6 a.m. to 10 p.m." es mucho mejor que "I can work anytime" (suena poco creible) o "I can only work mornings" (suena limitado sin explicacion).',
        example:
          'I am flexible with my schedule. I am available for morning and afternoon shifts, and I can work weekends if needed.',
      },
      {
        label: 'Negociar sin sonar negativo',
        explanation:
          'Si tienes restricciones de horario reales, mencionalas despues de afirmar tu disponibilidad general. Empieza con lo que SI puedes hacer antes de mencionar limitaciones.',
        example:
          'I am generally available for most shifts. The only restriction I have is that I cannot work past midnight on weekdays due to transportation.',
      },
    ],
    rules: [
      {
        label: 'Afirma primero, limita despues',
        rule: 'Empieza con tu disponibilidad positiva antes de mencionar cualquier restriccion.',
        correct:
          'I am available six days a week for most shifts. The only limitation I have is Sunday mornings.',
        incorrect: 'I cannot work Sundays. But I can work other days.',
        fix: 'Invierte el orden: disponibilidad amplia primero, restriccion despues y con contexto.',
      },
      {
        label: 'Usa "I am flexible" para dar una imagen positiva',
        rule: '"I am flexible" antes de especificar detalles proyecta actitud positiva.',
        correct: 'I am flexible with my schedule and I am open to rotating shifts.',
        incorrect: 'My schedule is complicated so it depends on the week.',
        fix: 'Abre con flexibilidad antes de dar detalles. Cambia el tono de la respuesta completamente.',
      },
    ],
    practice: [
      {
        prompt: 'Responde: "Are you available to work weekends and rotating shifts?"',
        sampleAnswer:
          'Yes, I am flexible with my schedule. I am available to work weekends and I am open to rotating shifts. I understand that call center operations require flexibility and I am fully prepared for that.',
      },
      {
        prompt: 'Convierte esta respuesta negativa en positiva: "I do not like night shifts but I can work mornings and afternoons."',
        sampleAnswer:
          'I am most productive during morning and afternoon shifts, and I am fully available for those. I am also open to discussing evening availability if needed.',
      },
    ],
    tips: [
      'Investiga los horarios tipicos de la empresa antes de la entrevista para anticipar sus preguntas.',
      'Si tienes restricciones reales, mencionarlas honestamente es mejor que comprometerte y incumplir.',
      'Practica el vocabulario de horarios en ingles hasta que fluya con naturalidad.',
    ],
  },

  'cci-interview-closing': {
    intro:
      'El cierre de una entrevista es tan importante como la apertura. Hacer buenas preguntas al entrevistador y despedirte con confianza dejan una impresion duradera. Esta leccion te da preguntas inteligentes especificas para roles de call center y frases de cierre que refuerzan tu interes y profesionalismo.',
    topicDetails: [
      {
        label: 'Por que preguntar al entrevistador',
        explanation:
          'Hacer preguntas demuestra interes genuino en el rol y en la empresa. Los candidatos que no preguntan parecen desinteresados o poco preparados. Tener 2-3 preguntas listas es parte de la preparacion basica.',
        example:
          'I do have a few questions. Could you tell me more about the team I would be joining and the training process?',
      },
      {
        label: 'Preguntas recomendadas para CC',
        explanation:
          'Preguntas como "What does success look like in this role?", "What training is provided for new agents?", "What are the main KPIs for this position?" muestran que entiendes el entorno de call center y que piensas en tu desempeno.',
        example:
          'What are the main performance metrics you track for agents in this role?',
      },
      {
        label: 'Frase de cierre con impacto',
        explanation:
          'Antes de salir, reafirma tu interes en el puesto con una frase directa. Agradece el tiempo del entrevistador y menciona que esperas dar el proximo paso. Esto cierra el ciclo con confianza.',
        example:
          'Thank you so much for this opportunity. I am very interested in this position and I look forward to hearing from you about the next steps.',
      },
    ],
    rules: [
      {
        label: 'Evita preguntas sobre salario o beneficios en el primer cierre',
        rule: 'Preguntar sobre salario antes de que te lo ofrezcan suena como que el dinero es tu unica motivacion.',
        correct: 'What does a typical day look like for someone in this role?',
        incorrect: 'How much does this job pay and what are the benefits?',
        fix: 'Guarda las preguntas sobre compensacion para cuando la empresa las introduzca o en una segunda ronda.',
      },
      {
        label: 'Reafirma tu interes antes de irte',
        rule: 'Una frase de cierre que expresa interes deja mejor impresion que solo decir "thank you, bye".',
        correct:
          'I really enjoyed this conversation. I am excited about this opportunity and I look forward to the next steps.',
        incorrect: 'Okay, thank you. Bye.',
        fix: 'Agrega una oracion de interes genuino antes de la despedida. Son 10 segundos que valen mucho.',
      },
    ],
    practice: [
      {
        prompt: 'Escribe 2 preguntas inteligentes para hacer al final de una entrevista de call center.',
        sampleAnswer:
          '1. What does success look like for someone in this role during the first 90 days? 2. What kind of training and support is provided for new agents?',
      },
      {
        prompt: 'Escribe una frase de cierre de 2 oraciones que muestre interes y profesionalismo.',
        sampleAnswer:
          'Thank you for taking the time to speak with me today. I am very enthusiastic about this opportunity and I look forward to hearing from you about the next steps in the process.',
      },
    ],
    tips: [
      'Prepara al menos 3 preguntas para el entrevistador — si responde 2 de ellas durante la charla, tengas una extra.',
      'Anota el nombre del entrevistador al inicio para usarlo al despedirte: "Thank you, Maria."',
      'Practica el cierre completo en voz alta: suena diferente a pensarlo en tu cabeza.',
    ],
  },
};
