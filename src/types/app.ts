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
  | 'call-center-escalations'
  | 'call-center-billing-dispute'
  | 'call-center-refund-request'
  | 'call-center-technical-support'
  | 'call-center-cancellation'
  | 'call-center-account-locked'
  | 'call-center-service-outage'
  | 'call-center-upsell'
  | 'call-center-duplicate-charge'
  | 'call-center-delivery-tracking'
  | 'call-center-complaint-agent'
  | 'call-center-appointment'
  | 'call-center-plan-downgrade'
  | 'call-center-callback-followup'
  | 'call-center-new-customer'
  | 'call-center-language-barrier';

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
