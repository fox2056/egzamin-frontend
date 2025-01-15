export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';

export interface Discipline {
  id: number;
  name: string;
  professor: string;
}

export interface Question {
  id: number;
  content: string;
  type: QuestionType;
  correctAnswers: string[];
  incorrectAnswers: string[];
  disciplineId: number;
  ratings: {
    positiveCount: number;
    negativeCount: number;
    recentComments: {
      comment: string | null;
      isPositive: boolean;
    }[];
  };
}

export interface TestQuestion {
  id: number;
  content: string;
  type: QuestionType;
  answers: string[];
}

export interface TestQuestionsResponse {
  questions: TestQuestion[];
}

export interface QuestionRating {
  comment: string;
  isPositive: boolean;
}

export interface QuestionRatingStats {
  positiveCount: number;
  negativeCount: number;
  comments: QuestionRating[];
}

export interface QuestionResult {
  questionId: number;
  content: string;
  correctAnswers: string[];
  selectedAnswers: string[];
  isCorrect: boolean;
}

export interface TestResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  questionResults: QuestionResult[];
}

export interface Test {
  id: number;
  studentName: string;
  studentEmail: string;
  startTime: string;
  endTime?: string;
  score?: number;
  questions: Question[];
}

export interface TestAnswer {
  questionId: number;
  selectedAnswers: string[];
}

export interface TestStartRequest {
  studentName: string;
  studentEmail: string;
  includedDisciplineIds: number[];
  excludedDisciplineIds: number[];
  numberOfQuestions: number;
}

export interface QuestionImport {
  disciplineName: string;
  content: string;
  type: QuestionType;
  correctAnswers: string[];
  incorrectAnswers: string[];
}

export interface DisciplineStatistic {
  disciplineId: number;
  name: string;
  professor: string;
  questionCount: number;
}

export interface Statistics {
  disciplineStatistics: Record<string, DisciplineStatistic>;
  totalQuestions: number;
  completedTests: number;
}

export interface DisciplineMergeResponse {
  sourceId: number;
  targetId: number;
  message: string;
} 