export type CallCenterLessonRule = {
  label: string;
  rule: string;
  correct: string;
  incorrect: string;
  fix: string;
};

export type CallCenterPracticeItem = {
  prompt: string;
  sampleAnswer: string;
};

export type CallCenterLessonDoc = {
  intro: string;
  topicDetails: { label: string; explanation: string; example: string }[];
  rules: CallCenterLessonRule[];
  practice: CallCenterPracticeItem[];
  tips: string[];
};

export const CALLCENTER_CURRICULUM: Record<string, CallCenterLessonDoc> = {
  'call-center-opening-script': {
    intro:
      'Entrenas apertura profesional para dar seguridad desde el primer contacto y reducir friccion inicial. Los primeros 15 segundos determinan el tono de toda la llamada.',
    topicDetails: [
      {
        label: 'Apertura en tres pasos',
        explanation:
          'Toda apertura profesional incluye saludo, identificacion del agente con nombre y empresa, y ofrecimiento de ayuda. Estos tres elementos establecen confianza de inmediato.',
        example:
          'Good morning, this is Ana from HablaSpeak Support. How can I assist you today?',
      },
      {
        label: 'Verificacion de seguridad',
        explanation:
          'Antes de acceder a datos de la cuenta, verifica identidad. Explica brevemente por que lo haces — esto reduce resistencia del cliente.',
        example:
          'For the security of your account, could you please confirm your date of birth and the last four digits of your account number?',
      },
      {
        label: 'Preguntas de apertura abiertas',
        explanation:
          'Una vez verificado el cliente, usa una pregunta abierta para que describa su problema con sus propias palabras. Esto da contexto y hace que el cliente se sienta escuchado.',
        example:
          'Thank you for confirming that. Could you please tell me a little more about what you are experiencing today?',
      },
    ],
    rules: [
      {
        label: 'Saludo completo antes de pedir datos',
        rule: 'Greeting + identification + purpose. Nunca empieces pidiendo datos antes de identificarte.',
        correct:
          'Good afternoon, this is Marco from Technical Support. Before I pull up your account, may I ask your name?',
        incorrect: 'Account number, please.',
        fix: 'Siempre saluda e identifícate primero. El cliente necesita saber con quién habla.',
      },
      {
        label: 'Pide verificacion con contexto',
        rule: 'Explica el motivo de la verificacion antes de solicitarla.',
        correct: 'For security, may I verify your date of birth?',
        incorrect: 'What is your date of birth?',
        fix: 'Agrega "For security" o "To protect your account" antes de pedir el dato.',
      },
    ],
    practice: [
      {
        prompt: 'Escribe un opening completo de 2 oraciones para soporte tecnico.',
        sampleAnswer:
          'Good afternoon, this is Marco from HablaSpeak Technical Support. How can I assist you today?',
      },
      {
        prompt: 'Escribe una frase de verificacion amable con contexto de seguridad.',
        sampleAnswer:
          'For the security of your account, could you confirm your registered email address and the last four digits of your ID, please?',
      },
    ],
    tips: [
      'Sonrie al hablar — mejora la entonacion y el cliente lo percibe aunque no te vea.',
      'Evita preguntas dobles en la apertura: hazlas de una en una.',
      'No uses jerga interna (ticket, case ID) con clientes que no conocen el proceso.',
    ],
  },

  'call-center-data-verification': {
    intro:
      'Verificar la identidad del cliente de forma correcta protege su cuenta y cumple con normas de privacidad. Esta leccion te da las frases exactas para pedir datos sin generar friccion, manejar al cliente que se niega y confirmar exitosamente.',
    topicDetails: [
      {
        label: 'El principio de minimo dato',
        explanation:
          'Solo pide los datos estrictamente necesarios para verificar. Pedir demasiado suena invasivo y genera desconfianza. Lo ideal es combinar un dato fijo (numero de cuenta) con un dato de conocimiento (fecha de nacimiento, zip code).',
        example:
          'For account security, could you please confirm your date of birth and the last four digits of your account number?',
      },
      {
        label: 'Cuando el cliente se niega a verificar',
        explanation:
          'Si el cliente se niega, no puedes darle acceso. Explica con calma que es una medida de proteccion para el, no un obstaculo, y ofrece una alternativa cuando exista.',
        example:
          'I completely understand your concern. Unfortunately, I am unable to access your account without verification — this protects you from unauthorized access. We could also send a verification code to your registered email if that is easier.',
      },
      {
        label: 'Transicion fluida tras verificar',
        explanation:
          'Una vez confirmada la identidad, agradece brevemente y pasa directamente al problema del cliente. Esto cierra el ciclo de verificacion con profesionalismo.',
        example:
          'Thank you for confirming that, Mr. Smith. I now have your account open. How can I help you today?',
      },
    ],
    rules: [
      {
        label: 'Contexto antes de pedir el dato',
        rule: 'Anteponer la razon reduce la resistencia del cliente y hace la solicitud mas facil de aceptar.',
        correct: 'For the security of your account, may I verify your date of birth?',
        incorrect: 'What is your date of birth?',
        fix: 'Usa siempre "For security purposes..." o "To protect your account..." antes de la pregunta.',
      },
      {
        label: 'No repitas datos sensibles en voz alta',
        rule: 'Nunca leas un numero de tarjeta, SSN o contrasena completa. Confirma solo los ultimos digitos.',
        correct:
          'I see a card ending in 7823 — is that the one you would like to use?',
        incorrect:
          'Is your card number 4532-1234-5678-7823?',
        fix: 'Menciona solo los ultimos 4 digitos y pide confirmacion. El numero completo nunca debe pronunciarse.',
      },
    ],
    practice: [
      {
        prompt:
          'Escribe una frase completa para solicitar verificacion de forma cortes y con contexto.',
        sampleAnswer:
          'For the security of your account, could you please confirm your registered email address and the last four digits of your account number?',
      },
      {
        prompt:
          'El cliente dice: "Why do you need all this information?" Responde con empatia y una explicacion clara.',
        sampleAnswer:
          'That is a great question. We verify your identity to protect your account from unauthorized access. I only need two quick pieces of information and we will be all set.',
      },
    ],
    tips: [
      'Practica el orden: contexto primero, pregunta despues. "For security, could you confirm..." nunca "What is your...?"',
      'Si el cliente falla la verificacion, usa un tono neutral: "I am unable to verify the account with that information. Could you try a different detail, such as your registered email?"',
      'Nunca repitas datos confidenciales en voz alta sin que el cliente los haya dicho primero.',
    ],
  },

  'call-center-discovery-questions': {
    intro:
      'Las preguntas de diagnostico son la herramienta mas importante de un agente: resolver el problema incorrecto cuesta mas que no resolverlo. Esta leccion te da la secuencia de sondeo y las frases exactas para identificar la causa raiz antes de actuar.',
    topicDetails: [
      {
        label: 'Preguntas abiertas vs cerradas',
        explanation:
          'Las preguntas abiertas (What, How, When, Tell me about...) recopilan contexto. Las cerradas (Yes/No, Did you...) confirman detalles especificos. Un buen diagnostico usa ambas en el orden correcto: primero abiertas para entender, luego cerradas para confirmar.',
        example:
          'Open: "Can you describe what happened when you tried to log in?" / Closed: "Are you seeing an error message on screen?"',
      },
      {
        label: 'La secuencia de diagnostico',
        explanation:
          '1. Pregunta abierta para entender el sintoma. 2. Parafrasea para confirmar que entendiste. 3. Profundiza con una segunda pregunta. 4. Resume antes de pasar a la solucion. Saltar pasos genera diagnosticos incorrectos.',
        example:
          '"Can you tell me what is happening?" → "So if I understand correctly, the charge appeared twice on the same day — is that right?" → "And this is the first time this has happened?"',
      },
      {
        label: 'Parafrasear para validar',
        explanation:
          'Repetir lo que el cliente dijo con tus propias palabras muestra que escuchas y previene malentendidos. Siempre termina con una pregunta de confirmacion: "Is that right?" o "Did I get that correctly?"',
        example:
          'Just to make sure I understand: you were charged $49.99 on the 15th, but your plan is only $24.99 per month — is that correct?',
      },
    ],
    rules: [
      {
        label: 'Haz una pregunta a la vez',
        rule:
          'Las preguntas multiples confunden al cliente y producen respuestas incompletas. Una pregunta, una respuesta, luego avanzas.',
        correct: 'When did this issue first start?',
        incorrect:
          'When did this happen and did you try restarting and is this happening on all devices?',
        fix: 'Haz una pregunta, espera la respuesta completa y luego sigue con la siguiente.',
      },
      {
        label: 'Parafrasea antes de dar la solucion',
        rule:
          'Confirmar que entendiste bien evita resolver el problema equivocado, lo que genera mas llamadas y frustracion.',
        correct:
          'So the issue is that you can receive calls but not make outgoing calls — is that right? Let me check on that for you.',
        incorrect: 'Okay, let me fix that.',
        fix: 'Resume en una frase lo que el cliente explico antes de actuar.',
      },
    ],
    practice: [
      {
        prompt:
          'El cliente dice: "My internet keeps disconnecting." Escribe tu primera pregunta de diagnostico.',
        sampleAnswer:
          'I am sorry to hear that. Can you tell me how often it disconnects — is it every few minutes, or does it happen randomly throughout the day?',
      },
      {
        prompt:
          'El cliente termino de explicar su problema. Escribe una frase de parafraseo completa para confirmar.',
        sampleAnswer:
          'Just to confirm what I understand: your service has been down since yesterday afternoon, and you have already restarted your router twice — is that correct?',
      },
    ],
    tips: [
      'Usa "Can you describe..." en vez de "What happened?" — suena mas profesional y da mas contexto.',
      'Despues de parafrasear, espera siempre la confirmacion del cliente antes de continuar.',
      'Si el cliente habla muy rapido, usa: "I want to make sure I have all the details. Let me read back what I heard..."',
    ],
  },

  'call-center-objections': {
    intro:
      'Aprendes a responder objeciones con empatia y metodo para mantener control sin escalar tension. La clave es validar primero, explicar despues.',
    topicDetails: [
      {
        label: 'Empatia inicial obligatoria',
        explanation:
          'Antes de explicar cualquier cosa, valida la emocion del cliente. Esto abre espacio para que escuche tu solucion. Sin empatia, el cliente esta en modo defensa y no escucha nada.',
        example:
          'I completely understand how frustrating this situation must be for you, and I am going to do my best to help.',
      },
      {
        label: 'La secuencia ACR: Acknowledge, Clarify, Resolve',
        explanation:
          'Acknowledge: reconoce el problema. Clarify: confirma que entiendes correctamente. Resolve: ofrece una accion concreta con tiempo. Esta secuencia reduce el tiempo de manejo y aumenta la satisfaccion.',
        example:
          '"I hear you — this charge was not what you expected." (Acknowledge) "Can I confirm the amount you were charged?" (Clarify) "I will review this now and give you an update in two minutes." (Resolve)',
      },
      {
        label: 'Cierre con siguiente paso concreto',
        explanation:
          'Cada respuesta a una objecion debe terminar con una accion especifica y un tiempo estimado. Decir "I will check it" no da confianza — "I will have an answer for you in two minutes" si la da.',
        example:
          'I will reset your service now and send you a confirmation email within 10 minutes.',
      },
    ],
    rules: [
      {
        label: 'No contradigas de inmediato',
        rule:
          'Primero reconoce, luego corrige con datos. Contradecir directamente genera resistencia.',
        correct:
          'I understand your concern. Let me review the timeline and explain exactly what happened.',
        incorrect: 'You are wrong. The system is correct.',
        fix: 'Empieza siempre con empatia antes de introducir cualquier correccion o explicacion.',
      },
      {
        label: 'Cierre con accion y tiempo',
        rule:
          'Siempre termina la respuesta con una accion especifica y un tiempo estimado. Vaguedad genera desconfianza.',
        correct:
          'I will reset the service right now and confirm in 2 minutes.',
        incorrect: 'I will check it.',
        fix: 'Agrega accion concreta ("I will reset") y tiempo ("in 2 minutes").',
      },
    ],
    practice: [
      {
        prompt: 'El cliente dice: "This is too expensive." Escribe tu respuesta completa.',
        sampleAnswer:
          'I understand your concern about the cost, and I want to find the best option for you. Let me walk you through our available plans — there may be one that fits your needs at a lower price point. Would that be helpful?',
      },
      {
        prompt: 'Crea una frase de seguimiento con accion y tiempo en 1 oracion.',
        sampleAnswer:
          'I will send you a confirmation email with all the details within the next 5 minutes.',
      },
    ],
    tips: [
      'Controla tu velocidad de voz cuando el cliente sube el tono — habla mas lento, no mas rapido.',
      'No prometas tiempos que no puedas cumplir. "Within 24 hours" es mejor que "very soon".',
      'Resume la solucion acordada en una frase final antes de cerrar la interaccion.',
    ],
  },

  'call-center-hold-and-transfer': {
    intro:
      'Poner en espera y transferir son los dos momentos donde mas se pierde la confianza del cliente si no se hacen bien. Esta leccion te da las frases exactas y la logica para manejarlos con profesionalismo total.',
    topicDetails: [
      {
        label: 'Solicitar hold con permiso, motivo y tiempo',
        explanation:
          'Nunca pongas a un cliente en espera sin pedirle permiso. La formula es: pedir permiso + motivo + tiempo estimado. El cliente necesita saber por que espera y cuanto tiempo.',
        example:
          'Would it be okay if I place you on a brief hold? I need to pull up your account details — it should take no more than two minutes.',
      },
      {
        label: 'Retomar la llamada correctamente',
        explanation:
          'Cuando regresas del hold, lo primero es agradecer la espera y confirmar de inmediato que tienes lo que necesitas. No vuelvas pidiendo al cliente que repita su problema.',
        example:
          'Thank you so much for holding, Mr. Johnson. I now have your account information in front of me. I can see that...',
      },
      {
        label: 'Transferencia caliente vs transferencia fria',
        explanation:
          'En una transferencia caliente presentas al cliente al nuevo agente con un resumen antes de soltar la llamada — el cliente no repite nada. En una fria solo transfieres sin contexto. Siempre que sea posible, usa transferencia caliente.',
        example:
          'I am connecting you with our billing team right now. I have already explained the issue so you will not need to repeat yourself — my colleague will pick up from here.',
      },
    ],
    rules: [
      {
        label: 'Nunca pongas en hold sin permiso',
        rule:
          'Siempre pide permiso, da el motivo y el tiempo estimado antes de activar el hold.',
        correct:
          'Could you hold for just one moment while I check on that? It will take about 90 seconds.',
        incorrect: 'Hold on. [silencio / musica de espera]',
        fix: 'Pide permiso, explica el motivo y da el tiempo: "Would it be okay if I place you on hold for about two minutes while I check your account?"',
      },
      {
        label: 'Transfiere con contexto completo',
        rule:
          'El cliente no debe repetir su problema al nuevo agente. Haz el handoff con un breve resumen del nombre, problema y acciones ya tomadas.',
        correct:
          'I am transferring you to our technical team. I have already noted that your router shows error code E4 and that you restarted it twice. They will continue from here.',
        incorrect: 'Let me transfer you. Goodbye.',
        fix: 'Antes de transferir: nombre del cliente + problema principal + lo que ya se hizo.',
      },
    ],
    practice: [
      {
        prompt:
          'Necesitas 3 minutos para revisar el sistema. Escribe la frase completa para solicitar hold.',
        sampleAnswer:
          'I am going to need to check our system for an update on your case. Would it be alright if I place you on hold for about three minutes? I will be back with you as soon as possible.',
      },
      {
        prompt:
          'Regresas del hold. Escribe la frase para retomar la llamada de forma profesional.',
        sampleAnswer:
          'Thank you so much for your patience, Ms. Garcia. I now have your account information in front of me. I can see the issue you described, and here is what I found...',
      },
    ],
    tips: [
      'Si el hold dura mas de lo esperado, regresa brevemente: "Thank you for continuing to hold — I am still looking into this and should have an answer in about 60 more seconds."',
      'Para transferencias usa esta formula: "I am connecting you with [department]. I have already explained [the situation] so you will not need to repeat yourself."',
      'Nunca digas solo "hold on" o "one second" sin contexto — es uno de los mayores generadores de frustracion.',
    ],
  },

  'call-center-escalations': {
    intro:
      'Te prepara para escalar casos complejos con trazabilidad, claridad y confianza para el cliente. Una escalacion bien hecha evita el abandono del caso y reduce los tiempos de resolucion.',
    topicDetails: [
      {
        label: 'Cuando escalar y como justificarlo',
        explanation:
          'Escala solo si el caso supera tus permisos, requiere otra area o hay riesgo alto para el cliente o la empresa. Al escalar, explica brevemente el motivo — el cliente necesita entender por que no puedes resolverlo tu.',
        example:
          'This issue requires access to our billing systems, which I am not able to modify directly. I am going to escalate this to our billing specialists who can resolve it for you right away.',
      },
      {
        label: 'Documentar antes de escalar',
        explanation:
          'Antes de transferir o escalar, documenta el nombre del cliente, el problema principal, los pasos ya intentados y el resultado esperado. El equipo receptor no deberia necesitar contactar al cliente para entender el caso.',
        example:
          'I have documented all the troubleshooting steps we took today so the specialist can continue without asking you to repeat anything.',
      },
      {
        label: 'Expectativas claras para el cliente',
        explanation:
          'Define tiempo estimado, canal de seguimiento y quien es responsable. La incertidumbre genera recontactos.',
        example:
          'Our specialist team will contact you by email within 24 hours. You will receive a case reference number to track the progress.',
      },
    ],
    rules: [
      {
        label: 'Escalar con contexto completo',
        rule:
          'Nunca escales un caso sin un resumen de lo ya intentado. El cliente no puede volver a explicar todo desde cero.',
        correct:
          'I have documented the issue and all troubleshooting steps before escalating.',
        incorrect: 'I escalated the case. Please check.',
        fix: 'Incluye en la nota: sintoma, pasos ya realizados y resultado esperado.',
      },
      {
        label: 'No abandones al cliente al escalar',
        rule:
          'Siempre deja claro que sigue, cuando y por que canal — no un "someone will contact you" sin detalle.',
        correct:
          'Our specialist team will contact you by 3 PM today via the email on your account.',
        incorrect: 'Someone will contact you.',
        fix: 'Da un plazo especifico y un canal concreto.',
      },
    ],
    practice: [
      {
        prompt: 'Escribe una frase para justificar una escalacion tecnica.',
        sampleAnswer:
          'This issue requires advanced diagnostics that I am not able to perform from here, so I am going to escalate it to our technical specialists immediately — they will be able to resolve this for you.',
      },
      {
        prompt: 'Escribe el cierre con SLA en una oracion.',
        sampleAnswer:
          'You will receive an update by email within 24 hours, and your case reference number is in the confirmation email I just sent.',
      },
    ],
    tips: [
      'Confirma siempre que el cliente entendio el siguiente paso antes de cerrar la interaccion.',
      'Evita lenguaje ambiguo: nada de "soon" o "maybe" — usa plazos concretos.',
      'Registra todo en el sistema antes de transferir: si el caso se pierde, tu nota es la unica evidencia.',
    ],
  },

  'call-center-refunds-billing': {
    intro:
      'Las llamadas de facturacion son de las mas sensibles porque involucran dinero directamente. Esta leccion te da el vocabulario de billing, las frases para explicar cargos con claridad y como comunicar la politica de reembolsos sin generar mas frustracion.',
    topicDetails: [
      {
        label: 'Vocabulario esencial de billing',
        explanation:
          'Los terminos mas usados son: charge (cargo), invoice (factura), statement (estado de cuenta), refund (reembolso), credit (credito en cuenta), dispute (disputa), billing cycle (ciclo de facturacion), outstanding balance (saldo pendiente). Usarlos correctamente suena profesional y reduce confusion.',
        example:
          'Your latest invoice shows a charge of $49.99 for the annual plan renewal on the 15th of this month.',
      },
      {
        label: 'Explicar un cargo con referencias concretas',
        explanation:
          'Nunca asumas que el cliente recuerda cuando contrató algo. Explica el concepto del cargo, la fecha exacta y el monto con referencias especificas del sistema.',
        example:
          'That $15.00 charge is a one-time setup fee applied when your account was first activated on March 3rd. It is listed on page two of your first invoice.',
      },
      {
        label: 'Comunicar la politica de reembolso con alternativas',
        explanation:
          'Se honesto sobre lo que es posible. Si el reembolso no aplica, explica el motivo y ofrece una alternativa concreta: credito en cuenta, escalacion a supervisor, o excepcion documentada.',
        example:
          'Our standard policy does not cover refunds after 30 days. However, since this was a billing error on our end, I can apply a one-time account credit of the full amount.',
      },
    ],
    rules: [
      {
        label: 'Lee de vuelta los datos del reembolso antes de procesar',
        rule:
          'Siempre confirma monto, metodo y plazo en voz alta antes de ejecutar. Un error aqui genera otra llamada.',
        correct:
          'Just to confirm: I am processing a refund of $24.99 to the Visa ending in 1234. You should see it within 5 to 7 business days — is that correct?',
        incorrect: 'Okay, I will process the refund.',
        fix: 'Lee siempre: monto + tarjeta/metodo + plazo estimado antes de confirmar.',
      },
      {
        label: 'Evita lenguaje defensivo sobre politicas',
        rule:
          'Presentar la politica como un obstaculo suena poco empatico. Explica el proposito y ofrece una alternativa.',
        correct:
          'Our 30-day window gives customers time to evaluate the service. Since it has been 35 days, I am not able to issue a full refund — but I can offer you a service credit for the same amount.',
        incorrect: 'That is our policy. There is nothing I can do.',
        fix: 'Explica el proposito de la politica y siempre ofrece al menos una alternativa.',
      },
    ],
    practice: [
      {
        prompt:
          'Un cliente llama por un cargo de $29.99 que no reconoce. Escribe tu primera respuesta.',
        sampleAnswer:
          'I completely understand your concern, and I want to help you figure this out right away. Let me pull up your account and review that charge. I can see a transaction for $29.99 on the 10th — that corresponds to your monthly subscription renewal. Were you perhaps expecting a different amount?',
      },
      {
        prompt:
          'El reembolso fue aprobado. Escribe la confirmacion final al cliente.',
        sampleAnswer:
          'Great news — I have processed a full refund of $29.99 to the Visa card ending in 4521. You should see it within 3 to 5 business days, and you will receive a confirmation email shortly. Is there anything else I can help you with today?',
      },
    ],
    tips: [
      'Aprende los plazos de reembolso de memoria: 3-5 business days para tarjeta de credito, 7-10 para debito. Comunicalos siempre de forma proactiva.',
      'Nunca digas "I cannot refund that" sin explicar por que y ofrecer al menos una alternativa.',
      'Cuando el error fue de la empresa, di explicitamente "this was a billing error on our end" — asumir responsabilidad genera mas confianza que justificarse.',
    ],
  },

  'call-center-technical-troubleshooting': {
    intro:
      'Guiar a un cliente por pasos tecnicos requiere paciencia, lenguaje simple y una estructura clara. Esta leccion te da la secuencia de troubleshooting y las frases exactas para que cualquier cliente pueda seguirte, sin importar su nivel tecnico.',
    topicDetails: [
      {
        label: 'Simplificar el lenguaje tecnico',
        explanation:
          'Traduce terminos tecnicos a acciones simples con verbos concretos: click, select, press, find, look for, unplug, plug back in. El cliente no sabe lo que es un DNS flush o un TTL — dale una instruccion que pueda ejecutar.',
        example:
          'Instead of "Flush your DNS cache" say: "I need you to open the Start menu, type cmd, press Enter, then type what I tell you and press Enter again."',
      },
      {
        label: 'La secuencia de troubleshooting',
        explanation:
          'Sigue siempre este orden: 1. Confirma el sintoma. 2. Verifica lo obvio (cables, reinicios). 3. Aplica solucion basica. 4. Confirma resultado. 5. Si no funciona, aplica plan B o escala con evidencia.',
        example:
          'First, can you check if the power light on your router is solid green or blinking? ... Okay, let us try a full restart — please unplug it from the wall, wait 30 seconds, and plug it back in.',
      },
      {
        label: 'Confirmar cada paso antes de avanzar',
        explanation:
          'No avances al siguiente paso hasta confirmar que el anterior se ejecuto correctamente y con que resultado. Avanzar sin confirmar genera confusion y errores acumulados.',
        example:
          'Take your time. Let me know when the device finishes restarting. ... Perfect. Now, can you check if you are connected to the network?',
      },
    ],
    rules: [
      {
        label: 'Da un paso a la vez',
        rule:
          'Si das varios pasos a la vez, el cliente los ejecuta en orden incorrecto o se pierde.',
        correct:
          'First, click the Start button in the bottom left corner. Let me know when you have that open.',
        incorrect:
          'Click Start, then Control Panel, then Network, then Adapter Settings, and change the DNS to 8.8.8.8.',
        fix: 'Da un paso, espera confirmacion verbal o señal de que el cliente lo completo, luego sigue.',
      },
      {
        label: 'Confirma el resultado, no solo el paso',
        rule:
          'Saber que el cliente completo el paso no es suficiente — necesitas saber si funciono.',
        correct:
          'Now that you have restarted the router, can you check if the internet light is back to solid green?',
        incorrect: 'Okay, did you restart it? Good, let us try the next step.',
        fix: 'Siempre pregunta por el resultado visible: "What do you see now?" / "Is the light green or still red?"',
      },
    ],
    practice: [
      {
        prompt:
          'El cliente dice: "My app keeps crashing." Escribe tus primeras dos preguntas de diagnostico.',
        sampleAnswer:
          'I am sorry to hear that — let us figure this out together. Does the app crash immediately when you open it, or does it happen after you have been using it for a while? And can you tell me what type of phone you are using?',
      },
      {
        prompt:
          'Le pediste al cliente que reiniciara su dispositivo. Escribe la frase para retomar despues del reinicio.',
        sampleAnswer:
          'Take your time — let me know once the device is fully back on. ... Great. Now, can you try opening the app again and tell me if you see the same issue?',
      },
    ],
    tips: [
      'Antes de empezar, pregunta: "Are you near your device right now?" — no pierdas tiempo si el cliente esta lejos del equipo.',
      'Usa "Perfect" y "Great" para reforzar cuando el cliente sigue instrucciones correctamente — genera confianza y mantiene su disposicion.',
      'Si el cliente no es tecnico, usa analogias: "Think of restarting as giving the device a quick nap — it clears out temporary issues."',
    ],
  },

  'call-center-de-escalation-advanced': {
    intro:
      'Los clientes de alta tension requieren empatia genuina, control de voz y frases estrategicas. Esta leccion te prepara para desescalar situaciones criticas sin perder el profesionalismo ni comprometer las politicas de la empresa.',
    topicDetails: [
      {
        label: 'Detectar y eliminar frases que escalan',
        explanation:
          'Las frases "That is not my problem", "I cannot do that", "You have to..." escalan la tension de forma inmediata. Sustituyelas por alternativas que abren espacio al dialogo y demuestran disposicion a ayudar.',
        example:
          'Instead of "I cannot give you a refund" → "What I can do right now is apply a credit to your account, and I want to explore every option available to resolve this for you."',
      },
      {
        label: 'Escucha reflexiva',
        explanation:
          'Parafrasea la emocion del cliente, no solo el contenido del problema. El cliente necesita sentir que fue escuchado antes de estar dispuesto a escuchar tu solucion. Valida primero, explica despues.',
        example:
          'I can hear how frustrated you are, and honestly, if I were in your position I would feel exactly the same way. This is not the experience we want you to have.',
      },
      {
        label: 'Establecer limites con respeto',
        explanation:
          'Cuando el cliente usa lenguaje inapropiado, puedes establecer un limite sin confrontar. Hazlo una vez, en tono calmado, y vuelve inmediatamente al foco de resolver.',
        example:
          'I want to help you resolve this today and I am fully committed to that. I do need to ask that we keep our conversation respectful so I can focus entirely on finding the best solution for you.',
      },
    ],
    rules: [
      {
        label: 'Reemplaza "I cannot" con "What I can do"',
        rule:
          '"I cannot" y "There is nothing I can do" son las frases que mas frustran a un cliente enojado. Siempre ofrece al menos una accion posible.',
        correct:
          'I understand this is not the answer you were hoping for. What I can do is escalate this to my supervisor, who has additional options available.',
        incorrect: 'There is nothing I can do. That is the policy.',
        fix: 'Cambia "I cannot" por "What I can do is..." o "Let me see what options are available for you."',
      },
      {
        label: 'Baja el ritmo cuando el cliente sube el tono',
        rule:
          'Cuando el cliente sube el tono, el instinto es responder mas rapido. Haz lo contrario: habla mas lento y con tono mas bajo. El cliente eventualmente se sincroniza con tu ritmo.',
        correct:
          '[Tono calmo, pausado] "I hear you. Let us slow down for a moment and I will walk you through exactly what happened."',
        incorrect:
          '[Igual ritmo o mas rapido] "Okay okay I understand but let me explain the policy really quick—"',
        fix: 'Reduce conscientemente tu velocidad de habla. Haz una pausa de 2 segundos antes de responder a un cliente enojado.',
      },
    ],
    practice: [
      {
        prompt:
          'El cliente dice: "This is absolutely unacceptable! I have been a customer for 5 years!" Escribe tu respuesta de desescalada.',
        sampleAnswer:
          'I completely understand your frustration, and I truly appreciate your loyalty over the past five years — that means a great deal to us. This is absolutely not the experience you deserve, and I am going to do everything I can right now to make this right. Can you give me just a moment to review your account?',
      },
      {
        prompt:
          'El cliente dice: "If you say that is the policy one more time, I am going to cancel." Responde sin usar la palabra "policy".',
        sampleAnswer:
          'I hear you, and I do not want to lose you as a customer. Let me set the standard process aside for a moment and see what I can personally do to resolve this for you. I want to find a solution that actually works.',
      },
    ],
    tips: [
      'La tecnica "I hear you + I want to help": empieza con validacion, termina con intencion. Nunca empieces con la explicacion — el cliente no esta listo para escucharla.',
      'Si el cliente insulta directamente, di: "I want to continue helping you, and I need us to keep the conversation respectful. Can we do that together?"',
      'Despues de una llamada muy tensa, toma 60 segundos antes de la siguiente — la tension residual afecta tu tono.',
    ],
  },

  'call-center-retention-save': {
    intro:
      'Retener a un cliente que quiere cancelar requiere escuchar antes de argumentar. Esta leccion te enseña las preguntas de retencion, como presentar una oferta de save de forma etica y cuando aceptar la baja con gracia.',
    topicDetails: [
      {
        label: 'Identificar la causa raiz antes de ofrecer',
        explanation:
          'El 80% de las cancelaciones tienen una causa especifica: precio, falta de uso, problema no resuelto o experiencia negativa. Si ofreces retencion sin saber la causa, ofreces la solucion equivocada y no hay save.',
        example:
          'Before I proceed with the cancellation, I want to make sure I understand what led to this decision. Would you mind sharing what is driving it for you today?',
      },
      {
        label: 'La oferta de save basada en la causa',
        explanation:
          'Presenta una oferta concreta basada en lo que el cliente te dijo. No empieces con el descuento maximo — empieza con valor. El descuento es el ultimo recurso, no el primero.',
        example:
          '[Cliente: "It is too expensive"] "I understand. Since you are on our standard plan, one option is our Lite plan at $9.99 per month — you keep the main features at less than half the current cost. Would you like to hear more about that?"',
      },
      {
        label: 'Cerrar con gracia cuando el save no aplica',
        explanation:
          'Si el cliente ha decidido y el save no funciona, cierra con profesionalismo. Una baja bien manejada puede generar un retorno futuro o una recomendacion positiva.',
        example:
          'I completely respect your decision. I have processed the cancellation and your service remains active until the end of the billing period. If you ever decide to come back, your account history will be saved. Thank you sincerely for the time you spent with us.',
      },
    ],
    rules: [
      {
        label: 'Descubre la causa antes de ofrecer retencion',
        rule:
          'Ofrecer un descuento antes de entender por que el cliente cancela es la causa numero uno de que el save no funcione.',
        correct:
          'I want to help you find the right solution. Before we look at options, can you tell me what is the main reason you are considering cancelling?',
        incorrect:
          'Wait — before you cancel, let me offer you 20% off your next 3 months!',
        fix: 'Siempre identifica la causa primero. El descuento correcto al problema correcto es lo que funciona.',
      },
      {
        label: 'No presiones ni uses lenguaje de culpa',
        rule:
          'La presion y la culpa generan experiencias negativas que se comparten publicamente. Un cliente que cancela bien puede regresar.',
        correct:
          'I completely understand. Let me make the cancellation process as smooth as possible for you.',
        incorrect:
          'Are you sure? You are going to lose all your data and there is no going back.',
        fix: 'Elimina el lenguaje de presion. Acepta la decision con respeto y deja la puerta abierta.',
      },
    ],
    practice: [
      {
        prompt:
          'El cliente dice: "I want to cancel my subscription." Escribe tu primera respuesta de retencion.',
        sampleAnswer:
          'I am sorry to hear that — I would really like to help if I can. Before I process the cancellation, could you share what is behind this decision? I want to make sure we have explored every option available to you.',
      },
      {
        prompt:
          'El cliente dijo que cancela porque el precio es muy alto. Tienes disponible un plan de $9.99 vs su plan actual de $24.99. Escribe la oferta de save.',
        sampleAnswer:
          'I appreciate you sharing that. Given that cost is the main concern, I would love to show you our Lite plan — it is $9.99 per month, less than half of what you are paying now, and it includes the features most customers use regularly. Would you like me to walk you through what is included before you make a final decision?',
      },
    ],
    tips: [
      'La secuencia correcta siempre es: Descubrir → Empatizar → Ofrecer → Aceptar. Nunca saltes al paso 3 sin el 1.',
      'Practica la tecnica "feel, felt, found": "I understand how you feel. Other customers have felt the same way. What they found is that..."',
      'Si el cliente acepta el save, confirma el nuevo plan en detalle y envia confirmacion por escrito — un save mal documentado genera otra cancelacion.',
    ],
  },

  'call-center-qa-compliance': {
    intro:
      'Una llamada de calidad no es solo resolver el problema — es documentar, cumplir las normas y proteger al cliente y a la empresa. Esta leccion te prepara para hablar con estructura de auditoria sin sonar robotico.',
    topicDetails: [
      {
        label: 'Frases requeridas y su razon de ser',
        explanation:
          'La mayoria de las empresas tienen frases obligatorias: aviso de grabacion, oferta de ayuda adicional al cierre, y confirmacion de identidad. Entender por que existen ayuda a decirlas con naturalidad en vez de sonar como un script.',
        example:
          'Opening: "This call may be recorded for quality and training purposes." / Closing: "Is there anything else I can help you with today before I let you go?"',
      },
      {
        label: 'Privacidad y datos sensibles',
        explanation:
          'Nunca repitas un numero de tarjeta, SSN o contrasena completa en voz alta. Confirma siempre con los ultimos cuatro digitos o con una pregunta de verificacion que no exponga el dato.',
        example:
          '"I see a card on file ending in 7823 — is that the one you would like to use?" (nunca: "Is your card 4532-1234-5678-7823?")',
      },
      {
        label: 'Documentacion post-llamada',
        explanation:
          'Lo que no se documenta no existe. Un caso bien documentado protege al agente en disputas futuras y reduce el tiempo de resolucion si el cliente vuelve a llamar.',
        example:
          'Buena nota: "Customer disputed charge of $29.99 on 03/15. Verified identity. Charge confirmed as monthly renewal. Refund not applicable per policy. Customer accepted account credit of $29.99. Case closed." — Mala nota: "customer called, issue resolved"',
      },
    ],
    rules: [
      {
        label: 'Di las frases requeridas con intencion',
        rule:
          'Las frases de compliance suenan roboticas cuando se dicen sin entonacion. El mismo script puede sonar autentico con el tono correcto.',
        correct:
          '[Con calor genuino] "Before we wrap up — is there anything else I can help you with today? I want to make sure you are all set."',
        incorrect:
          '[Monotono, rapido] "Isthereotherthingicanhelp. Okthankyougoodbye."',
        fix: 'Practica las frases requeridas con entonacion natural. Son obligatorias pero no tienen que sonar a lectura.',
      },
      {
        label: 'Nunca prometas lo que no controlas',
        rule:
          'Una promesa incumplida es peor que no prometer nada. Usa lenguaje que comunique intencion sin comprometer resultados que dependen de otros.',
        correct:
          'I will submit this request right now. The standard processing time is 3 to 5 business days — I cannot guarantee an exact date, but I will note it as a priority.',
        incorrect: 'I promise you will have your refund by Friday.',
        fix: 'Usa "I will..." para acciones que controlas. Usa "the standard time is..." para resultados que dependen de otros procesos.',
      },
    ],
    practice: [
      {
        prompt:
          'Escribe un cierre de llamada completo con todas las frases de QA correctas.',
        sampleAnswer:
          'So just to recap: I have updated your billing address and your next invoice will reflect that change starting next month. You will receive a confirmation email within the next hour. Is there anything else I can assist you with before I let you go? ... It was my pleasure. Thank you for calling, and have a great rest of your day.',
      },
      {
        prompt:
          'El cliente quiere que confirmes su numero de tarjeta completo. Escribe como manejas eso de forma correcta.',
        sampleAnswer:
          'For your security, I am not able to read your full card number out loud. I can confirm that we have a card on file ending in the last four digits — could you verify those for me? That way we can confirm it is the right card without compromising your information.',
      },
    ],
    tips: [
      'Practica el cierre como una rutina fija: resumen + confirmacion + oferta de ayuda adicional + despedida. 4 pasos, siempre en ese orden.',
      'Los evaluadores de QA buscan tres cosas: resolviste el problema, seguiste el proceso, el cliente se fue satisfecho. Diseña cada llamada con esas tres preguntas en mente.',
      'Documenta mientras hablas, no despues — una nota en tiempo real es mas precisa que reconstruirla de memoria.',
    ],
  },

  'call-center-closing-followup': {
    intro:
      'Un cierre profesional resume la solucion, confirma que el cliente no tiene mas dudas y define claramente el siguiente paso. Esta leccion reduce los recontactos y deja al cliente con una impresion positiva.',
    topicDetails: [
      {
        label: 'Cierre estructurado en cuatro pasos',
        explanation:
          'Todo cierre profesional incluye: 1. Resumen de lo que se hizo. 2. Confirmacion de satisfaccion. 3. Proximo paso y canal. 4. Despedida cortes. Sin estos pasos, el cliente llama de nuevo por incertidumbre.',
        example:
          'Today we updated your account, and you will receive a confirmation email in 10 minutes. Is there anything else you need before I let you go?',
      },
      {
        label: 'Follow-up profesional con responsable y plazo',
        explanation:
          'Define siempre quien hace el seguimiento, por que canal y en que plazo. Sin follow-up claro, el cliente vuelve a llamar porque no sabe que esperar.',
        example:
          'If you need further assistance with this, you can reply directly to the confirmation email and our team will respond within 24 hours.',
      },
      {
        label: 'Invitar al feedback',
        explanation:
          'Al cierre, una invitacion breve a dejar feedback muestra que la empresa valora la opinion del cliente y da la oportunidad de identificar problemas antes de que se vuelvan quejas publicas.',
        example:
          'You may receive a short survey by email — we would really appreciate your feedback on how we handled your case today.',
      },
    ],
    rules: [
      {
        label: 'Resume antes de despedirte',
        rule: 'Indica que se hizo y que sigue antes de cerrar la llamada.',
        correct:
          'We reset your password and you can log in now. I will also email you the steps as a reference.',
        incorrect: 'Okay, done, bye.',
        fix: 'Incluye siempre la accion tomada y el siguiente paso antes de la despedida.',
      },
      {
        label: 'Ofrece canal concreto para recontacto',
        rule:
          'Decir "call again if needed" no da suficiente informacion. El cliente necesita saber exactamente como volver a contactarte.',
        correct:
          'Thank you for your patience. If anything else comes up, please reply to the support email I just sent you.',
        incorrect: 'Call again if needed.',
        fix: 'Especifica el canal concreto: email, numero directo, o referencia del caso.',
      },
    ],
    practice: [
      {
        prompt: 'Escribe un cierre completo de 3 oraciones para un caso resuelto.',
        sampleAnswer:
          'Your service is active again, and I sent a confirmation email with all the details. If you have any additional questions, please reply to that email and we will be happy to assist. Thank you for your patience today — have a great day!',
      },
      {
        prompt: 'Escribe una frase de agradecimiento profesional al cierre.',
        sampleAnswer:
          'Thank you for your patience and for contacting HablaSpeak Support today. It was a pleasure assisting you.',
      },
    ],
    tips: [
      'Nunca cierres sin preguntar si el cliente tiene algo mas. "Is there anything else I can help you with?" es obligatorio.',
      'Menciona siempre el ticket o email de confirmacion para continuidad — reduce los recontactos a la mitad.',
      'Usa frases de cierre cortas y claras. Al final de una llamada el cliente no quiere escuchar un parrafo.',
    ],
  },
};
