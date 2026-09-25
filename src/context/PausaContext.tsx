import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PauseExperience,
  UserProfile,
  PauseSessionRecord,
  Achievement,
  PostFeelingType,
  MoodType,
} from '../types/pausa';
import { CORE_PAUSES, INITIAL_ACHIEVEMENTS, FOURTEEN_DAYS_JOURNEY } from '../data/pausasData';

export type AppView =
  | 'landing'
  | 'onboarding'
  | 'home'
  | 'pausa_ahora'
  | 'recorrido'
  | 'logros'
  | 'perfil'
  | 'paywall'
  | 'login';

interface PausaContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  activePause: PauseExperience | null;
  activeIsDaily: boolean;
  activeDayNumber: number | null;
  userProfile: UserProfile;
  sessions: PauseSessionRecord[];
  currentJourneyDay: number;
  achievements: Achievement[];
  soundEnabled: boolean;
  startPause: (experience: PauseExperience, isDaily?: boolean, dayNumber?: number) => void;
  startPauseByMood: (mood: MoodType) => void;
  finishPause: (feeling: PostFeelingType) => void;
  exitPause: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  toggleSound: () => void;
  resetProgress: () => void;
  resetToNewUser: () => void;
  latestSession: PauseSessionRecord | null;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Elisa',
  primaryNeed: 'Bajar el ritmo mental y no acelerarme tanto',
  usualMoment: 'Al final del día',
  preferredGuidance: 'Voz y ritmo suave',
  isOnboarded: false,
  isSubscribed: false,
  createdAt: new Date().toISOString(),
};

const PausaContext = createContext<PausaContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'pausa_user_profile',
  SESSIONS: 'pausa_sessions',
  JOURNEY_DAY: 'pausa_current_journey_day',
  ACHIEVEMENTS: 'pausa_achievements',
  SOUND: 'pausa_sound_enabled',
};

export const PausaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [activePause, setActivePause] = useState<PauseExperience | null>(null);
  const [activeIsDaily, setActiveIsDaily] = useState<boolean>(false);
  const [activeDayNumber, setActiveDayNumber] = useState<number | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_PROFILE;
  });

  const [sessions, setSessions] = useState<PauseSessionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [currentJourneyDay, setCurrentJourneyDay] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOURNEY_DAY);
      if (saved) return Number(saved);
    } catch {
      // ignore
    }
    return 1;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_ACHIEVEMENTS;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOUND);
      if (saved !== null) return saved === 'true';
    } catch {
      // ignore
    }
    return true;
  });

  const [latestSession, setLatestSession] = useState<PauseSessionRecord | null>(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
    } catch {
      // ignore
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch {
      // ignore
    }
  }, [sessions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.JOURNEY_DAY, currentJourneyDay.toString());
    } catch {
      // ignore
    }
  }, [currentJourneyDay]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch {
      // ignore
    }
  }, [achievements]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND, soundEnabled.toString());
    } catch {
      // ignore
    }
  }, [soundEnabled]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const startPause = (experience: PauseExperience, isDaily = false, dayNumber?: number) => {
    setActivePause(experience);
    setActiveIsDaily(isDaily);
    setActiveDayNumber(dayNumber ?? null);
  };

  const startPauseByMood = (mood: MoodType) => {
    const exp = CORE_PAUSES[mood];
    if (exp) {
      startPause(exp, false);
    }
  };

  const exitPause = () => {
    setActivePause(null);
    setActiveIsDaily(false);
    setActiveDayNumber(null);
  };

  const checkAndUnlockAchievements = (newSessions: PauseSessionRecord[]) => {
    const updated = achievements.map((ach) => {
      if (ach.unlockedAt) return ach;

      let unlock = false;
      if (ach.id === 'primera_pausa' && newSessions.length >= 1) unlock = true;
      if (ach.id === 'aprendiendo_parar' && newSessions.length >= 3) unlock = true;
      if (ach.id === 'me_estoy_escuchando' && newSessions.some((s) => s.postFeeling)) unlock = true;
      if (ach.id === 'momento_sobrecarga' && newSessions.some((s) => s.moodType === 'sobrecarga')) unlock = true;
      if (ach.id === 'forma_pausar' && newSessions.some((s) => s.moodType === 'tension')) unlock = true;
      if (ach.id === 'cerrar_dia' && newSessions.some((s) => s.moodType === 'desconectar')) unlock = true;
      if (ach.id === 'volviste_a_ti' && newSessions.length >= 5) unlock = true;

      if (unlock) {
        return { ...ach, unlockedAt: new Date().toISOString() };
      }
      return ach;
    });

    setAchievements(updated);
  };

  const finishPause = (feeling: PostFeelingType) => {
    if (!activePause) return;

    const newRecord: PauseSessionRecord = {
      id: 'session_' + Date.now(),
      timestamp: new Date().toISOString(),
      moodType: activePause.moodType,
      title: activePause.title,
      durationCompletedSeconds: 120,
      postFeeling: feeling,
      isDailyPause: activeIsDaily,
      dayNumber: activeDayNumber ?? undefined,
    };

    const newSessions = [newRecord, ...sessions];
    setSessions(newSessions);
    setLatestSession(newRecord);

    // If it was daily pause, advance day up to 14
    if (activeIsDaily && activeDayNumber && activeDayNumber >= currentJourneyDay) {
      if (currentJourneyDay < 14) {
        setCurrentJourneyDay((d) => d + 1);
      }
    }

    checkAndUnlockAchievements(newSessions);
    exitPause();
  };

  const resetProgress = () => {
    setSessions([]);
    setCurrentJourneyDay(1);
    setAchievements(INITIAL_ACHIEVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.JOURNEY_DAY);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
  };

  const resetToNewUser = () => {
    setUserProfile(DEFAULT_PROFILE);
    setSessions([]);
    setCurrentJourneyDay(1);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setActivePause(null);
    setActiveIsDaily(false);
    setActiveDayNumber(null);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.JOURNEY_DAY);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    setCurrentView('landing');
  };

  return (
    <PausaContext.Provider
      value={{
        currentView,
        setCurrentView,
        activePause,
        activeIsDaily,
        activeDayNumber,
        userProfile,
        sessions,
        currentJourneyDay,
        achievements,
        soundEnabled,
        startPause,
        startPauseByMood,
        finishPause,
        exitPause,
        updateProfile,
        toggleSound,
        resetProgress,
        resetToNewUser,
        latestSession,
      }}
    >
      {children}
    </PausaContext.Provider>
  );
};

export const usePausa = () => {
  const context = useContext(PausaContext);
  if (!context) {
    throw new Error('usePausa must be used within a PausaProvider');
  }
  return context;
};
