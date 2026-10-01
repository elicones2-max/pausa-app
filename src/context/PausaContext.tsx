import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  PauseExperience,
  UserProfile,
  PauseSessionRecord,
  Achievement,
  PostFeelingType,
  MoodType,
} from '../types/pausa';
import { CORE_PAUSES, INITIAL_ACHIEVEMENTS } from '../data/pausasData';
import { supabase } from '../utils/supabase';

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
  finishPause: (feeling: PostFeelingType) => Promise<void> | void;
  exitPause: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  uploadAvatar: (file: File) => Promise<string>;
  removeAvatar: () => Promise<void>;
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
  avatar_url: null,
};

const PausaContext = createContext<PausaContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'pausa_user_profile',
  PROFILE_ID: 'pausa_profile_id',
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

  const [profileId, setProfileId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.PROFILE_ID);
    } catch {
      return null;
    }
  });

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

  const profileIdRef = useRef<string | null>(profileId);
  const isInitializingRef = useRef<boolean>(false);
  const initialLoadCompleteRef = useRef<boolean>(false);
  const skipNextSyncRef = useRef<boolean>(false);

  useEffect(() => {
    profileIdRef.current = profileId;
  }, [profileId]);

  // Sync profileId to localStorage
  useEffect(() => {
    try {
      if (profileId) {
        localStorage.setItem(STORAGE_KEYS.PROFILE_ID, profileId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.PROFILE_ID);
      }
    } catch {
      // ignore
    }
  }, [profileId]);

  // Initialize or fetch profile from Supabase on mount
  useEffect(() => {
    if (isInitializingRef.current) return;
    isInitializingRef.current = true;

    const initProfile = async () => {
      try {
        let storedId: string | null = null;
        try {
          storedId = localStorage.getItem(STORAGE_KEYS.PROFILE_ID);
        } catch {
          storedId = null;
        }

        if (storedId) {
          profileIdRef.current = storedId;
          setProfileId(storedId);

          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', storedId)
            .maybeSingle();

          if (!error && data) {
            skipNextSyncRef.current = true;
            setUserProfile({
              name: data.name ?? DEFAULT_PROFILE.name,
              primaryNeed: data.primary_nee ?? data.primaryNeed ?? DEFAULT_PROFILE.primaryNeed,
              usualMoment: data.usual_moment ?? data.usualMoment ?? DEFAULT_PROFILE.usualMoment,
              preferredGuidance: data.preferred_guidance ?? data.preferredGuidance ?? DEFAULT_PROFILE.preferredGuidance,
              isOnboarded: data.is_onboarded ?? data.isOnboarded ?? DEFAULT_PROFILE.isOnboarded,
              isSubscribed: data.is_subscribed ?? data.isSubscribed ?? DEFAULT_PROFILE.isSubscribed,
              createdAt: data.created_at ?? data.createdAt ?? DEFAULT_PROFILE.createdAt,
              avatar_url: data.avatar_url ?? null,
            });
          } else if (!error && !data) {
            // Profile ID was in localStorage but record was not found in Supabase
            const { data: createdData, error: createError } = await supabase
              .from('profiles')
              .insert({
                name: DEFAULT_PROFILE.name,
                primary_nee: DEFAULT_PROFILE.primaryNeed,
                usual_moment: DEFAULT_PROFILE.usualMoment,
                preferred_guidance: DEFAULT_PROFILE.preferredGuidance,
                is_onboarded: DEFAULT_PROFILE.isOnboarded,
                is_subscribed: DEFAULT_PROFILE.isSubscribed,
                avatar_url: null,
              })
              .select('id')
              .single();

            if (!createError && createdData?.id) {
              const newId = createdData.id;
              try {
                localStorage.setItem(STORAGE_KEYS.PROFILE_ID, newId);
              } catch {
                // ignore
              }
              profileIdRef.current = newId;
              setProfileId(newId);
            }
          }
        } else {
          // No pausa_profile_id in localStorage: create a new record in public.profiles with DEFAULT_PROFILE
          const { data, error } = await supabase
            .from('profiles')
            .insert({
              name: DEFAULT_PROFILE.name,
              primary_nee: DEFAULT_PROFILE.primaryNeed,
              usual_moment: DEFAULT_PROFILE.usualMoment,
              preferred_guidance: DEFAULT_PROFILE.preferredGuidance,
              is_onboarded: DEFAULT_PROFILE.isOnboarded,
              is_subscribed: DEFAULT_PROFILE.isSubscribed,
              avatar_url: null,
            })
            .select('id')
            .single();

          if (!error && data?.id) {
            const newId = data.id;
            try {
              localStorage.setItem(STORAGE_KEYS.PROFILE_ID, newId);
            } catch {
              // ignore
            }
            profileIdRef.current = newId;
            setProfileId(newId);
          }
        }
      } catch (err) {
        console.warn('Fallo al inicializar perfil en Supabase (usando localStorage como respaldo):', err);
      } finally {
        initialLoadCompleteRef.current = true;
      }
    };

    initProfile();
  }, []);

  // Sync state to local storage and Supabase when userProfile changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
    } catch {
      // ignore
    }

    if (!initialLoadCompleteRef.current) return;

    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      return;
    }

    const currentProfileId = profileIdRef.current || localStorage.getItem(STORAGE_KEYS.PROFILE_ID);
    if (!currentProfileId) return;

    const syncProfile = async () => {
      try {
        await supabase
          .from('profiles')
          .update({
            name: userProfile.name,
            primary_nee: userProfile.primaryNeed,
            usual_moment: userProfile.usualMoment,
            preferred_guidance: userProfile.preferredGuidance,
            is_onboarded: userProfile.isOnboarded,
            is_subscribed: userProfile.isSubscribed,
            avatar_url: userProfile.avatar_url ?? null,
          })
          .eq('id', currentProfileId);
      } catch (err) {
        console.warn('Fallo al sincronizar perfil con Supabase:', err);
      }
    };

    syncProfile();
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

  /**
   * Upload user profile photo to Supabase Storage ('avatars' bucket)
   * and link public URL to profiles.avatar_url.
   * Includes seamless client-side base64 fallback for offline/demo reliability.
   */
  const uploadAvatar = async (file: File): Promise<string> => {
    let finalUrl: string | null = null;
    const currentProfileId = profileIdRef.current || localStorage.getItem(STORAGE_KEYS.PROFILE_ID) || 'guest';

    // 1. Attempt Supabase Storage upload
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const cleanExt = fileExt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const fileName = `${currentProfileId}-${Date.now()}.${cleanExt}`;
      const filePath = `avatars/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          finalUrl = publicUrlData.publicUrl;
        }
      }
    } catch {
      // Handled via client-side storage fallback
    }

    // 2. If Supabase Storage was unavailable or offline, read as standard Data URL
    if (!finalUrl) {
      finalUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('No se pudo procesar la fotografía'));
        reader.readAsDataURL(file);
      });
    }

    // 3. Persist in local state and database
    updateProfile({ avatar_url: finalUrl });

    if (currentProfileId && currentProfileId !== 'guest') {
      try {
        await supabase
          .from('profiles')
          .update({ avatar_url: finalUrl })
          .eq('id', currentProfileId);
      } catch {
        // Handled via local storage
      }
    }

    return finalUrl;
  };

  /**
   * Remove user profile photo
   */
  const removeAvatar = async (): Promise<void> => {
    updateProfile({ avatar_url: null });
    const currentProfileId = profileIdRef.current || localStorage.getItem(STORAGE_KEYS.PROFILE_ID);
    if (currentProfileId && currentProfileId !== 'guest') {
      try {
        await supabase
          .from('profiles')
          .update({ avatar_url: null })
          .eq('id', currentProfileId);
      } catch {
        // Handled via local storage
      }
    }
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

  const finishPause = async (feeling: PostFeelingType) => {
    if (!activePause) return;

    const currentPause = activePause;
    const isDaily = activeIsDaily;
    const dayNum = activeDayNumber;

    let sessionId = 'session_' + Date.now();
    let currentProfileId = profileIdRef.current;
    if (!currentProfileId) {
      try {
        currentProfileId = localStorage.getItem(STORAGE_KEYS.PROFILE_ID);
      } catch {
        currentProfileId = null;
      }
    }

    // If profile_id is not yet available, attempt to register profile first
    if (!currentProfileId) {
      try {
        const { data: newProf } = await supabase
          .from('profiles')
          .insert({
            name: userProfile.name,
            primary_nee: userProfile.primaryNeed,
            usual_moment: userProfile.usualMoment,
            preferred_guidance: userProfile.preferredGuidance,
            is_onboarded: userProfile.isOnboarded,
            is_subscribed: userProfile.isSubscribed,
          })
          .select('id')
          .single();

        if (newProf && newProf.id) {
          const newId = String(newProf.id);
          currentProfileId = newId;
          try {
            localStorage.setItem(STORAGE_KEYS.PROFILE_ID, newId);
          } catch {
            // ignore
          }
          profileIdRef.current = newId;
          setProfileId(newId);
        }
      } catch {
        // ignore
      }
    }

    if (currentProfileId) {
      try {
        const { data, error } = await supabase
          .from('pause_sessions')
          .insert({
            profile_id: currentProfileId,
            mood_type: currentPause.moodType,
            title: currentPause.title,
            duration_completed_seconds: 120,
            post_feeling: feeling,
            is_daily_pause: isDaily,
            day_number: dayNum ?? null,
          })
          .select('id')
          .single();

        if (!error && data?.id) {
          sessionId = data.id;
        } else if (error) {
          console.warn('Fallo al registrar sesión en Supabase (usando respaldo local):', error.message);
        }
      } catch (err) {
        console.warn('Error al registrar sesión en Supabase (usando respaldo local):', err);
      }
    }

    const newRecord: PauseSessionRecord = {
      id: sessionId,
      timestamp: new Date().toISOString(),
      moodType: currentPause.moodType,
      title: currentPause.title,
      durationCompletedSeconds: 120,
      postFeeling: feeling,
      isDailyPause: isDaily,
      dayNumber: dayNum ?? undefined,
    };

    const newSessions = [newRecord, ...sessions];
    setSessions(newSessions);
    setLatestSession(newRecord);

    // If it was daily pause, advance day up to 14
    if (isDaily && dayNum && dayNum >= currentJourneyDay) {
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
    setLatestSession(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.JOURNEY_DAY);
      localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    } catch {
      // ignore
    }
  };

  const resetToNewUser = () => {
    setUserProfile(DEFAULT_PROFILE);
    setSessions([]);
    setCurrentJourneyDay(1);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setActivePause(null);
    setActiveIsDaily(false);
    setActiveDayNumber(null);
    setLatestSession(null);
    setProfileId(null);
    profileIdRef.current = null;
    isInitializingRef.current = false;
    initialLoadCompleteRef.current = false;

    try {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.PROFILE_ID);
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.JOURNEY_DAY);
      localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    } catch {
      // ignore
    }
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
        uploadAvatar,
        removeAvatar,
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
