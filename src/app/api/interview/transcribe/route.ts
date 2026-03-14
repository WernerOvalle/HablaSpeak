import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { createGroqTranscription } from '@/lib/groq';

export const dynamic = 'force-dynamic';

const MAX_AUDIO_SIZE_BYTES = 8 * 1024 * 1024;

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  if (user.plan !== 'PREMIUM') {
    return NextResponse.json({ error: 'La transcripcion por voz es premium' }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const audio = formData.get('audio');
    const language = formData.get('language');

    if (!(audio instanceof File)) {
      return NextResponse.json({ error: 'Archivo de audio invalido' }, { status: 400 });
    }

    if (audio.size <= 0) {
      return NextResponse.json({ error: 'El audio esta vacio' }, { status: 400 });
    }

    if (audio.size > MAX_AUDIO_SIZE_BYTES) {
      return NextResponse.json({ error: 'El audio supera el limite permitido (8MB)' }, { status: 413 });
    }

    const languageCode =
      typeof language === 'string' && language.trim().length > 0 ? language.trim() : undefined;

    const text = await createGroqTranscription(audio, languageCode);

    if (!text) {
      return NextResponse.json({ error: 'No se pudo transcribir el audio' }, { status: 502 });
    }

    return NextResponse.json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error inesperado transcribiendo audio';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
