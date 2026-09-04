export type BloomLevel = 
  | 'تذكر' 
  | 'فهم' 
  | 'تطبيق' 
  | 'تحليل' 
  | 'تقييم' 
  | 'ابتكار';

export type LearningDomain = 'معرفي' | 'مهاري' | 'وجداني';

export type TrainingSector = 
  | 'إداري وقيادي'
  | 'تنموي وغير ربحي'
  | 'مهني وتقني'
  | 'ريادة أعمال ومشاريع'
  | 'تربوي وتعليمي'
  | 'مبيعات وخدمة عملاء'
  | 'أخرى';

export interface TrainingNeedInput {
  title: string;
  sector: TrainingSector;
  targetAudience: string;
  audienceLevel: 'مبتدئ' | 'متوسط' | 'متقدم' | 'متنوع';
  totalHours: number;
  totalDays: number;
  trainingGap: string;
  expectedOutcomes: string;
  trainerOrCenterName: string;
}

export interface SpecificObjective {
  id: string;
  text: string;
  bloomLevel: BloomLevel;
  domain: LearningDomain;
  performanceIndicator: string;
}

export interface TrainingSession {
  sessionNumber: number;
  title: string;
  durationMinutes: number;
  topics: string[];
  deliveryMethod: string;
  learningAid: string;
}

export interface TrainingModule {
  moduleNumber: number;
  title: string;
  durationMinutes: number;
  summary: string;
  sessions: TrainingSession[];
}

export interface FacilitationTip {
  title: string;
  content: string;
}

export interface TrainerGuide {
  iceBreakers: string[];
  facilitationNotes: FacilitationTip[];
  discussionPrompts: string[];
  frequentPitfalls: string[];
}

export interface TrainingActivity {
  id: string;
  title: string;
  targetModule: string;
  type: 'فردي' | 'ثنائي' | 'مجموعات عمل' | 'لعب أدوار' | 'دراسة حالة' | 'محاكاة عملية';
  durationMinutes: number;
  objective: string;
  instructions: string[];
  expectedOutput: string;
  materialsNeeded: string;
}

export interface RubricLevel {
  score: number;
  title: string;
  description: string;
}

export interface AssessmentCriterion {
  id: string;
  criterion: string;
  weight: number;
  levels: {
    excellent: string;
    proficient: string;
    developing: string;
    unsatisfactory: string;
  };
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'اختيار من متعدد' | 'دراسة حالة مصغرة' | 'سؤال تطبيقي';
  options?: string[];
  correctAnswer: string;
  bloomLevel: BloomLevel;
}

export interface AssessmentTools {
  preTestInstructions: string;
  postTestInstructions: string;
  rubrics: AssessmentCriterion[];
  questions: AssessmentQuestion[];
}

export interface TrainingPackage {
  id: string;
  metadata: {
    title: string;
    sector: string;
    targetAudience: string;
    audienceLevel: string;
    totalHours: number;
    totalDays: number;
    trainingGap: string;
    trainerOrCenterName: string;
    createdAt: string;
    version: string;
  };
  objectives: {
    generalGoal: string;
    specificObjectives: SpecificObjective[];
  };
  curriculum: TrainingModule[];
  trainerGuide: TrainerGuide;
  activities: TrainingActivity[];
  assessments: AssessmentTools;
}

export interface HumanReviewRequest {
  packageId: string;
  packageTitle: string;
  trainerName: string;
  email: string;
  phone: string;
  tier: 'express' | 'comprehensive';
  price: number;
  notes: string;
  submittedAt: string;
}
