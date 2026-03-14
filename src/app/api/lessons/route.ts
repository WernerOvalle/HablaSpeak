import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const lessons = await prisma.lesson.findMany({
    orderBy: [{ category: 'asc' }, { order: 'asc' }],
  });

  return NextResponse.json({
    lessons: lessons.map(lesson => ({
      id: lesson.id,
      slug: lesson.slug,
      title: lesson.title,
      description: lesson.description,
      level: lesson.level,
      category: lesson.category,
      order: lesson.order,
      isPremium: lesson.isPremium,
      syllabus: Array.isArray(lesson.syllabus) ? lesson.syllabus : [],
    })),
  });
}
