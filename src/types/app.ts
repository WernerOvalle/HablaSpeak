export type UserPlan = 'free' | 'premium';

export type View =
  | 'login'
  | 'dashboard'
  | 'classes-general'
  | 'classes-callcenter'
  | 'scenarios'
  | 'interview'
  | 'pricing';
export type InterviewScenarioId =
  | 'job-interview'
  | 'call-center-opening'
  | 'call-center-objections'
  | 'call-center-escalations';

export type LessonLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type LessonCategory = 'GENERAL' | 'CALL_CENTER';

export interface LessonSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: LessonLevel;
  category: LessonCategory;
  order: number;
  isPremium: boolean;
  syllabus: string[];
}

export interface InterviewScenario {
  id: InterviewScenarioId;
  title: string;
  description: string;
  initialMessage: string;
}
