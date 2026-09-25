export type MoodType = 'mente_acelerada' | 'sobrecarga' | 'tension' | 'desconectar';

export type PostFeelingType = 'mas_tranquila' | 'igual' | 'todavia_sobrepasada';

export interface PauseGuidanceStep {
  timeSeconds: number; // cumulative start time
  phase: 'iniciar' | 'inhalar' | 'sostener' | 'exhalar' | 'descanso' | 'reflexion';
  instruction: string;
  subtext?: string;
  cycleDuration?: number; // breathing loop seconds
}

export interface PauseExperience {
  id: string;
  moodType: MoodType;
  title: string;
  subtitle: string;
  icon: string;
  colorBg: string;
  durationSeconds: number;
  preparationMessage: string;
  coreMessage: string;
  closingMessage: string;
  breathingPattern: {
    inhale: number;
    hold: number;
    exhale: number;
    rest: number;
    name: string;
    guidance: string;
  };
  steps: PauseGuidanceStep[];
}

export interface DayJourneyItem {
  dayNumber: number;
  title: string;
  category: 'base' | 'sobrecarga' | 'cierre' | 'personalizado';
  intention: string;
  moodType: MoodType;
  durationMinutes: number;
  isCompleted?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'inicio' | 'habito' | 'escucha' | 'descanso';
}

export interface PauseSessionRecord {
  id: string;
  timestamp: string;
  moodType: MoodType;
  title: string;
  durationCompletedSeconds: number;
  postFeeling?: PostFeelingType;
  isDailyPause: boolean;
  dayNumber?: number;
}

export interface UserProfile {
  name: string;
  primaryNeed: string;
  usualMoment: string;
  preferredGuidance: string;
  isOnboarded: boolean;
  isSubscribed: boolean;
  createdAt: string;
}
