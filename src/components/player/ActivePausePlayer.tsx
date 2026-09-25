import React, { useState, useEffect, useRef } from 'react';
import { usePausa } from '../../context/PausaContext';
import { PostFeelingType } from '../../types/pausa';
import { soundService } from '../../utils/audio';
import { Volume2, VolumeX, X, Play, Pause, FastForward, CheckCircle2, Heart, Sparkles } from 'lucide-react';

export const ActivePausePlayer: React.FC = () => {
  const {
    activePause,
    exitPause,
    finishPause,
    soundEnabled,
    toggleSound,
    userProfile,
    sessions,
    setCurrentView,
    updateProfile,
  } = usePausa();

  if (!activePause) return null;

  // Stages: 'active' -> 'first_pause_closing' (if first pause) OR 'closing' -> 'reflection' -> 'feedback_acknowledged'
  const [stage, setStage] = useState<'active' | 'first_pause_closing' | 'closing' | 'reflection' | 'feedback_acknowledged'>('active');
  const [secondsLeft, setSecondsLeft] = useState<number>(120); // starts at 02:00 (120s)
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [selectedFeeling, setSelectedFeeling] = useState<PostFeelingType | null>(null);

  // Check if this is the user's first pause and she is not yet subscribed
  const isFirstPause = sessions.length === 0 && !userProfile.isSubscribed;

  // Breathing cycle tracking
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');

  const totalDuration = 120; // Exactly 2 minutes
  const { inhale, hold, exhale, rest } = activePause.breathingPattern;
  const cycleLength = inhale + hold + exhale + rest;

  // Play gentle initial chime once on mount
  const hasPlayedInitialChime = useRef(false);
  useEffect(() => {
    if (soundEnabled && !hasPlayedInitialChime.current) {
      soundService.playBowlChime(432, 3.5);
      hasPlayedInitialChime.current = true;
    }
  }, [soundEnabled]);

  // Real-time functional 2-minute countdown timer (02:00 -> 00:00)
  useEffect(() => {
    if (stage !== 'active' || isPaused || showExitModal) return;

    if (secondsLeft <= 0) {
      setStage(isFirstPause ? 'first_pause_closing' : 'closing');
      if (soundEnabled) {
        soundService.playBowlChime(432, 4);
      }
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, isPaused, showExitModal, secondsLeft, soundEnabled, isFirstPause]);

  // When timer hits 0 in active stage, transition to closing
  useEffect(() => {
    if (stage === 'active' && secondsLeft === 0) {
      setStage(isFirstPause ? 'first_pause_closing' : 'closing');
      if (soundEnabled) {
        soundService.playBowlChime(432, 4);
      }
    }
  }, [stage, secondsLeft, soundEnabled, isFirstPause]);

  // Sync breathing phase with elapsed time
  const secondsElapsed = totalDuration - secondsLeft;
  useEffect(() => {
    if (stage !== 'active') return;

    const cycleSecond = secondsElapsed % cycleLength;

    if (cycleSecond < inhale) {
      setBreathPhase('inhale');
    } else if (cycleSecond < inhale + hold) {
      setBreathPhase('hold');
    } else if (cycleSecond < inhale + hold + exhale) {
      setBreathPhase('exhale');
    } else {
      setBreathPhase('rest');
    }
  }, [secondsElapsed, cycleLength, inhale, hold, exhale, stage]);

  const getBreathData = () => {
    switch (breathPhase) {
      case 'inhale':
        return { text: 'Inhala', sub: 'Siente el aire entrar sin forzar' };
      case 'hold':
        return { text: 'Sostén', sub: 'Un momento de quietud' };
      case 'exhale':
        return { text: 'Exhala', sub: 'Suelta el aire y el peso del día' };
      case 'rest':
      default:
        return { text: 'Pausa', sub: 'Permanece presente en el silencio' };
    }
  };
  const { text: breathText, sub: breathSubtext } = getBreathData();

  // Formatted countdown: 02:00 -> 01:59 ... -> 00:00
  const formatTime = (secs: number) => {
    const safeSecs = Math.max(0, Math.min(totalDuration, secs));
    const m = Math.floor(safeSecs / 60);
    const s = safeSecs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Accompanying calm phrases that transition softly during the 2 minutes
  const ACCOMPANYING_PHRASES = [
    { start: 0, end: 20, phrase: 'No tienes que resolver nada ahora.', sub: 'Solo quédate aquí y acompaña tu respiración.' },
    { start: 20, end: 40, phrase: 'Respira a tu propio ritmo.', sub: 'Siente el aire entrar y salir sin forzar.' },
    { start: 40, end: 60, phrase: 'Este momento es para ti.', sub: 'Lo que está pendiente puede esperar.' },
    { start: 60, end: 80, phrase: 'Un poco más despacio.', sub: 'Suelta la prisa y la exigencia del día.' },
    { start: 80, end: 100, phrase: 'Estás aquí.', sub: 'Permite que tus hombros y mandíbula aflojen.' },
    { start: 100, end: 120, phrase: 'Solo quédate aquí.', sub: 'Vuelves a ti con calma y presencia.' },
  ];

  const currentPhrase =
    ACCOMPANYING_PHRASES.find(
      (item) => secondsElapsed >= item.start && secondsElapsed < item.end
    ) || ACCOMPANYING_PHRASES[ACCOMPANYING_PHRASES.length - 1];

  const handleSkipToFinish = () => {
    setSecondsLeft(0);
    setStage(isFirstPause ? 'first_pause_closing' : 'closing');
    if (soundEnabled) soundService.playBowlChime(432, 4);
  };

  const handleSelectFeeling = (feeling: PostFeelingType) => {
    setSelectedFeeling(feeling);
    setStage('feedback_acknowledged');
  };

  const handleContinueToPaywall = () => {
    const feeling = selectedFeeling || 'mas_tranquila';
    updateProfile({ isOnboarded: true });
    finishPause(feeling);
    setCurrentView('paywall');
  };

  const handleConfirmAndClose = () => {
    const feeling = selectedFeeling || 'mas_tranquila';
    finishPause(feeling);
    exitPause();
  };

  const userName = userProfile.name?.trim() || 'Marta';

  return (
    <div className="fixed inset-0 z-50 bg-[#1D362D] text-[#FFF9EF] flex flex-col justify-between overflow-y-auto select-none">
      {/* Background Soft Organic Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full blur-[100px] transition-all duration-1000 ${
            breathPhase === 'inhale'
              ? 'bg-[#527A68] scale-125 opacity-75'
              : breathPhase === 'exhale'
              ? 'bg-[#294C3F] scale-90 opacity-40'
              : 'bg-[#CBB082] scale-105 opacity-55'
          }`}
        />
      </div>

      {/* Discrete Top Bar */}
      <header className="relative z-20 flex items-center justify-between px-6 pt-5 pb-3">
        <div className="flex items-center gap-2 text-xs text-[#FFF9EF]/80 tracking-widest uppercase font-semibold">
          <span className="text-sm">{activePause.icon}</span>
          <span className="truncate max-w-[180px]">PAUSA · 2 MIN</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Silenciar campanita' : 'Activar campanita'}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-[#FFF9EF]"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Discrete exit trigger */}
          <button
            onClick={() => setShowExitModal(true)}
            aria-label="Salir de la pausa"
            title="Salir"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-[#FFF9EF]"
          >
            <X size={16} />
          </button>
        </div>
      </header>

      {/* Main Experience Body */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-md mx-auto w-full">
        {/* ACTIVE STAGE: ORIGINAL ELEGANT BREATHING SPHERE WITH DISCRETE TIMER UNDERNEATH */}
        {stage === 'active' && (
          <div className="w-full flex flex-col items-center justify-center space-y-6 animate-fade-in">
            {/* Header label */}
            <div className="text-center">
              <span className="text-[10px] uppercase tracking-widest text-[#CBB082] font-semibold">
                {activePause.title}
              </span>
            </div>

            {/* Original Breathing Visual Sphere with Multi-Layer Ripples */}
            <div className="relative w-64 h-64 flex items-center justify-center my-1">
              {/* Outer Ripple */}
              <div
                className={`absolute inset-0 rounded-full border border-[#527A68]/40 transition-transform duration-[4000ms] ease-in-out ${
                  breathPhase === 'inhale'
                    ? 'scale-125 opacity-80'
                    : breathPhase === 'exhale'
                    ? 'scale-85 opacity-30'
                    : 'scale-105 opacity-50'
                }`}
              />

              {/* Second Ripple */}
              <div
                className={`absolute inset-4 rounded-full border border-[#CBB082]/30 transition-transform duration-[4000ms] ease-in-out ${
                  breathPhase === 'inhale'
                    ? 'scale-115 opacity-60'
                    : breathPhase === 'exhale'
                    ? 'scale-90 opacity-20'
                    : 'scale-100 opacity-40'
                }`}
              />

              {/* Inner Glowing Orb with Delicate Original Typography */}
              <div
                className={`relative w-44 h-44 rounded-full bg-gradient-to-br from-[#527A68] via-[#294C3F] to-[#1F372E] border border-[#CBB082]/40 shadow-2xl flex flex-col items-center justify-center p-4 transition-all duration-[4000ms] ease-in-out ${
                  breathPhase === 'inhale'
                    ? 'scale-110 shadow-[#527A68]/40'
                    : breathPhase === 'exhale'
                    ? 'scale-90 shadow-none'
                    : 'scale-100'
                }`}
              >
                <span className="font-serif text-2xl font-semibold tracking-wide text-[#FFF9EF]">
                  {breathText}
                </span>
                <span className="text-[11px] text-[#CBB082] mt-1 font-light tracking-wide text-center px-2">
                  {breathSubtext}
                </span>
              </div>
            </div>

            {/* Accompanying Calm Phrases */}
            <div className="space-y-1 max-w-xs mx-auto text-center px-4 min-h-[64px] flex flex-col items-center justify-center">
              <p className="font-serif text-xl sm:text-2xl text-[#FFF9EF] font-medium leading-snug transition-opacity duration-700">
                "{currentPhrase.phrase}"
              </p>
              <p className="text-xs text-[#FFF9EF]/70 leading-relaxed font-light transition-opacity duration-700">
                {currentPhrase.sub}
              </p>
            </div>

            {/* Discrete, Subtle Counter Below (Secondary Reference) */}
            <div className="flex flex-col items-center gap-1.5 pt-0.5">
              <span className="text-xs font-mono font-light tracking-widest text-[#FFF9EF]/45 select-none">
                {formatTime(secondsLeft)}
              </span>
            </div>

            {/* Discrete Player Controls */}
            <div className="flex items-center justify-center gap-5 pt-1">
              <button
                onClick={() => setIsPaused(!isPaused)}
                aria-label={isPaused ? 'Reanudar pausa' : 'Pausar'}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-[#FFF9EF] transition-all"
              >
                {isPaused ? <Play size={15} /> : <Pause size={15} />}
              </button>

              <button
                onClick={handleSkipToFinish}
                aria-label="Adelantar al cierre"
                title="Avanzar"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 flex items-center justify-center text-[#FFF9EF]/50 hover:text-[#FFF9EF] transition-all"
              >
                <FastForward size={13} />
              </button>
            </div>
          </div>
        )}

        {/* FIRST PAUSE CLOSING SCREEN: RECOGNITION, FEELING, & CTA TO PAYWALL */}
        {stage === 'first_pause_closing' && (
          <div className="flex flex-col items-center animate-fade-in w-full space-y-5 max-w-sm">
            <div className="w-16 h-16 rounded-full bg-[#294C3F] border-2 border-[#CBB082] flex items-center justify-center text-2xl text-[#CBB082] shadow-xl">
              🌿
            </div>

            <div className="space-y-2 text-center">
              <span className="text-[10px] uppercase tracking-widest text-[#CBB082] font-bold bg-white/10 px-3 py-1 rounded-full border border-[#CBB082]/30">
                Tu primera victoria · 2 min
              </span>

              <h2 className="font-serif text-3xl font-medium text-[#FFF9EF] leading-snug">
                Completaste tu primera PAUSA, {userName}.
              </h2>

              <p className="text-xs sm:text-sm text-[#FFF9EF]/85 leading-relaxed font-light">
                Acabas de dar el paso más importante: regalarte 2 minutos para parar y recuperar el timón.
              </p>
            </div>

            {/* How do you feel check-in */}
            <div className="w-full bg-white/10 rounded-2xl p-4 border border-white/15 space-y-3 text-left">
              <span className="text-[11px] font-semibold text-[#CBB082] uppercase tracking-wider block">
                ¿Cómo te sientes ahora?
              </span>

              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedFeeling('mas_tranquila')}
                  className={`py-3 px-2 rounded-xl text-center transition-all text-xs border flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 ${
                    selectedFeeling === 'mas_tranquila'
                      ? 'bg-[#CBB082] text-[#1D362D] border-[#FFF9EF] font-bold shadow-lg ring-2 ring-[#CBB082]/60'
                      : 'bg-white/10 hover:bg-white/20 text-[#FFF9EF] border-white/20 hover:border-white/40'
                  }`}
                >
                  <span className="text-xl">🌿</span>
                  <span className="text-[11px] font-semibold">Tranquila</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFeeling('igual')}
                  className={`py-3 px-2 rounded-xl text-center transition-all text-xs border flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 ${
                    selectedFeeling === 'igual'
                      ? 'bg-[#CBB082] text-[#1D362D] border-[#FFF9EF] font-bold shadow-lg ring-2 ring-[#CBB082]/60'
                      : 'bg-white/10 hover:bg-white/20 text-[#FFF9EF] border-white/20 hover:border-white/40'
                  }`}
                >
                  <span className="text-xl">🌱</span>
                  <span className="text-[11px] font-semibold">Igual</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFeeling('todavia_sobrepasada')}
                  className={`py-3 px-2 rounded-xl text-center transition-all text-xs border flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 ${
                    selectedFeeling === 'todavia_sobrepasada'
                      ? 'bg-[#CBB082] text-[#1D362D] border-[#FFF9EF] font-bold shadow-lg ring-2 ring-[#CBB082]/60'
                      : 'bg-white/10 hover:bg-white/20 text-[#FFF9EF] border-white/20 hover:border-white/40'
                  }`}
                >
                  <span className="text-xl">🤲</span>
                  <span className="text-[11px] font-semibold">Sobrecarga</span>
                </button>
              </div>
            </div>

            {/* Botón para continuar: Aparece únicamente después de seleccionar una de las tres opciones y abre directamente el Paywall existente */}
            {selectedFeeling && (
              <div className="w-full pt-1 animate-fade-in">
                <button
                  type="button"
                  onClick={handleContinueToPaywall}
                  className="w-full py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 border cursor-pointer bg-[#CBB082] hover:bg-[#d8c29b] text-[#1D362D] border-[#FFF9EF]/20"
                >
                  <Sparkles size={16} />
                  <span>QUIERO SEGUIR CON PAUSA</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* CLOSING SCREEN (FOR SUBSEQUENT PAUSES WHEN TIMER REACHES 00:00) */}
        {stage === 'closing' && (
          <div className="flex flex-col items-center animate-fade-in w-full space-y-6 max-w-sm">
            <div className="w-16 h-16 rounded-full bg-[#294C3F] border-2 border-[#CBB082] flex items-center justify-center text-2xl text-[#CBB082] shadow-xl">
              🌿
            </div>

            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-[#CBB082] font-bold bg-white/10 px-3 py-1 rounded-full border border-[#CBB082]/30">
                00:00 · 2 minutos completados
              </span>

              <h2 className="font-serif text-3xl font-medium text-[#FFF9EF]">
                Tu pausa ha terminado.
              </h2>

              <p className="text-base text-[#FFF9EF] font-serif italic">
                Bien hecho, {userName}.
              </p>

              <p className="text-xs text-[#FFF9EF]/80 leading-relaxed font-light pt-1">
                Ahora tómate un momento para notar cómo estás.
              </p>
            </div>

            <div className="pt-3 w-full">
              <button
                onClick={() => setStage('reflection')}
                className="w-full py-4 rounded-2xl bg-[#CBB082] hover:bg-[#d8c29b] text-[#1D362D] font-bold text-xs uppercase tracking-widest transition-all shadow-xl active:scale-[0.98]"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* REFLECTION: HOW DO YOU FEEL NOW? */}
        {stage === 'reflection' && (
          <div className="flex flex-col items-center animate-fade-in w-full space-y-6 max-w-sm">
            <div className="w-14 h-14 rounded-full bg-[#294C3F] border border-[#CBB082]/40 flex items-center justify-center text-xl text-[#CBB082]">
              ✨
            </div>

            <div className="space-y-1.5">
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#FFF9EF]">
                ¿Cómo te sientes ahora?
              </h2>
              <p className="text-xs text-[#FFF9EF]/70 max-w-xs mx-auto font-light">
                No hay respuestas correctas ni incorrectas. Solo reconocer cómo estás.
              </p>
            </div>

            {/* The 3 Options */}
            <div className="w-full flex flex-col gap-3 pt-2">
              <button
                onClick={() => handleSelectFeeling('mas_tranquila')}
                className="w-full py-4 px-5 rounded-2xl bg-white/10 hover:bg-[#294C3F] border border-[#CBB082]/30 hover:border-[#CBB082] active:scale-[0.98] transition-all text-left flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🌿</span>
                  <span className="text-sm font-semibold text-[#FFF9EF]">Más tranquila</span>
                </div>
                <span className="text-xs text-[#CBB082] opacity-0 group-hover:opacity-100 transition-opacity">
                  Elegir →
                </span>
              </button>

              <button
                onClick={() => handleSelectFeeling('igual')}
                className="w-full py-4 px-5 rounded-2xl bg-white/10 hover:bg-[#294C3F] border border-[#CBB082]/30 hover:border-[#CBB082] active:scale-[0.98] transition-all text-left flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🌱</span>
                  <span className="text-sm font-semibold text-[#FFF9EF]">Igual</span>
                </div>
                <span className="text-xs text-[#CBB082] opacity-0 group-hover:opacity-100 transition-opacity">
                  Elegir →
                </span>
              </button>

              <button
                onClick={() => handleSelectFeeling('todavia_sobrepasada')}
                className="w-full py-4 px-5 rounded-2xl bg-white/10 hover:bg-[#294C3F] border border-[#CBB082]/30 hover:border-[#CBB082] active:scale-[0.98] transition-all text-left flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🤲</span>
                  <span className="text-sm font-semibold text-[#FFF9EF]">Todavía sobrepasada</span>
                </div>
                <span className="text-xs text-[#CBB082] opacity-0 group-hover:opacity-100 transition-opacity">
                  Elegir →
                </span>
              </button>
            </div>
          </div>
        )}

        {/* FEEDBACK ACKNOWLEDGED STAGE */}
        {stage === 'feedback_acknowledged' && (
          <div className="flex flex-col items-center animate-fade-in w-full space-y-6 max-w-sm">
            <div className="w-16 h-16 rounded-full bg-[#294C3F] border-2 border-[#CBB082] flex items-center justify-center text-2xl text-[#CBB082] shadow-xl">
              <Heart size={28} />
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-2xl font-medium text-[#FFF9EF]">
                {selectedFeeling === 'mas_tranquila' && 'Qué bueno que te diste este espacio.'}
                {selectedFeeling === 'igual' && 'Hacer la pausa ya es suficiente.'}
                {selectedFeeling === 'todavia_sobrepasada' && 'Está bien sentirse así.'}
              </h3>

              <p className="text-xs sm:text-sm text-[#FFF9EF]/80 leading-relaxed font-light">
                {selectedFeeling === 'mas_tranquila' &&
                  'Cada vez que te detienes 2 minutos, le recuerdas a tu mente que no todo tiene que ser una carrera.'}
                {selectedFeeling === 'igual' &&
                  'No siempre todo cambia de golpe. Pero le diste a tu cuerpo dos minutos de descanso que antes no tenía.'}
                {selectedFeeling === 'todavia_sobrepasada' &&
                  'Cuando hay mucha carga, detenerse cuesta. Haber intentado esta pausa ya es un acto de cuidado inmenso.'}
              </p>
            </div>

            <div className="pt-4 w-full">
              <button
                onClick={handleConfirmAndClose}
                className="w-full py-4 rounded-2xl bg-[#CBB082] hover:bg-[#d8c29b] text-[#1D362D] font-bold text-xs uppercase tracking-widest transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                <span>Completar mi pausa</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Subtle Zen Footer */}
      <footer className="relative z-20 px-6 py-4">
        <div className="max-w-md mx-auto flex justify-between items-center text-[11px] text-[#FFF9EF]/50">
          <span>PAUSA · 2 minutos</span>
          <span>{activePause.breathingPattern.name}</span>
        </div>
      </footer>

      {/* DISCRETE EXIT CONFIRMATION MODAL */}
      {showExitModal && (
        <div className="fixed inset-0 z-60 bg-black/65 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-[#1D362D] border-2 border-[#CBB082]/40 rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl mx-auto text-[#CBB082]">
              🌿
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif text-xl font-medium text-[#FFF9EF]">
                ¿Quieres salir de esta pausa?
              </h3>
              <p className="text-xs text-[#FFF9EF]/75 leading-relaxed font-light">
                Tu pausa quedará sin completar.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={() => setShowExitModal(false)}
                className="w-full py-3.5 px-4 rounded-xl bg-[#294C3F] hover:bg-[#325a4a] text-[#FFF9EF] font-bold text-xs uppercase tracking-wider transition-all border border-[#CBB082]/40 active:scale-98 shadow-md"
              >
                Seguir con mi pausa
              </button>
              <button
                onClick={() => {
                  setShowExitModal(false);
                  exitPause();
                }}
                className="w-full py-2.5 px-4 text-xs text-[#FFF9EF]/60 hover:text-[#FFF9EF] transition-colors font-medium"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
