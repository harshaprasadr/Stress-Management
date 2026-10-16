export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  occupation: string;
  emergencyContact: string;
  medicalConditions: string;
  currentMedications: string;
  stressHistory: StressAssessment[];
  weeklyReports: WeeklyReport[];
  checklists: ChecklistItem[];
}

export interface StressAssessment {
  id: string;
  date: string;
  mood: string;
  stressLevel: number;
  textAnalysis: string;
  voiceAnalysis: string;
  facialAnalysis: string;
  overallStressLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface WeeklyReport {
  id: string;
  weekOf: string;
  averageStressLevel: number;
  improvementAreas: string[];
  achievements: string[];
  nextWeekGoals: string[];
}

export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  date: string;
  category: 'breathing' | 'exercise' | 'social' | 'hobby' | 'meditation';
}