import React from 'react';
import { usePausa } from '../../context/PausaContext';
import { CORE_PAUSES, FOURTEEN_DAYS_JOURNEY } from '../../data/pausasData';
import { MoodType } from '../../types/pausa';
import { Play, ArrowRight, Clock, Award, Sparkles } from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    userProfile,
    currentJourneyDay,
    startPause,
    startPauseByMood,
    setCurrentView,
    sessions,
  } = usePausa();

  // Get current journey day item (bounded 1 to 14)
  const currentDayItem =
    FOURTEEN_DAYS_JOURNEY.find((item) => item.dayNumber === currentJourneyDay) ||
    FOURTEEN_DAYS_JOURNEY[0];

  const handleDailyPause = () => {
    const experience = CORE_PAUSES[currentDayItem.moodType];
    startPause(experience, true, currentDayItem.dayNumber);
  };

  const handleQuickMood = (mood: MoodType) => {
    startPauseByMood(mood);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-4">
      {/* Warm Personal Greeting with Strong Contrast */}
      <section className="pt-1">
        <div className="flex items-center gap-2 text-xs text-[#294C3F] font-bold tracking-wide mb-1">
          <span className="w-2 h-2 rounded-full bg-[#CBB082] shadow-xs" />
          <span className="uppercase tracking-widest text-[10px] text-[#527A68]">Tu espacio para parar</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1D362D] tracking-tight leading-tight">
          Hola, <span className="font-semibold text-[#294C3F]">{userProfile.name || 'Elisa'}</span>.
        </h1>

        <p className="text-sm font-medium text-[#3B5B4D] mt-1.5 leading-relaxed">
          No tienes que resolver nada ahora. Solo necesitas 2 minutos para bajar revoluciones.
        </p>
      </section>

      {/* 1. PAUSA DIARIA (CARD DESTACADA EN VERDE PROFUNDO CON MÁXIMO CONTRASTE) */}
      <section className="relative overflow-hidden rounded-3xl bg-[#294C3F] text-[#FFF9EF] p-5 sm:p-6 shadow-xl border-2 border-[#CBB082]/40">
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#527A68]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#1D362D] rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="uppercase tracking-widest text-[10px] font-bold bg-[#1D362D] text-[#CBB082] px-3 py-1 rounded-full border border-[#CBB082]/30 flex items-center gap-1.5 shadow-xs">
              <Sparkles size={11} />
              <span>Pausa Diaria · Día {currentDayItem.dayNumber} de 14</span>
            </span>
            <span className="flex items-center gap-1 text-[#FFF9EF] font-mono text-xs bg-black/20 px-2.5 py-0.5 rounded-full border border-white/10">
              <Clock size={12} className="text-[#CBB082]" /> 2 min
            </span>
          </div>

          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium leading-snug text-[#FFF9EF]">
              {currentDayItem.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#FFF9EF]/90 mt-1.5 leading-relaxed font-light">
              "{currentDayItem.intention}"
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleDailyPause}
              className="w-full py-4 px-6 rounded-2xl bg-[#FFF9EF] hover:bg-[#F3E9D8] text-[#1D362D] font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2.5 border border-[#CBB082]/50 hover:border-[#CBB082]"
            >
              <Play size={16} className="fill-[#1D362D]" />
              <span>Hacer mi pausa de 2 min</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. PAUSA AHORA: "DIME CÓMO ESTÁS Y YO TE DOY LA PAUSA ADECUADA" */}
      <section className="space-y-3 pt-1">
        <div className="flex items-baseline justify-between px-1">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-0.5 bg-[#294C3F] rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#294C3F]">Pausa Ahora</span>
            </div>
            <h2 className="font-serif text-2xl font-medium text-[#1D362D]">
              ¿Cómo estás ahora?
            </h2>
            <p className="text-xs text-[#3B5B4D] mt-0.5 font-medium">
              Toca tu sensación y PAUSA te guiará de inmediato:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {/* Opción 1: Mente a mil */}
          <button
            onClick={() => handleQuickMood('mente_acelerada')}
            className="w-full text-left p-4 rounded-2xl bg-white hover:bg-[#FFF9EF] border-2 border-[#294C3F]/15 hover:border-[#294C3F] transition-all flex items-center justify-between group active:scale-[0.98] shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#294C3F] text-white flex items-center justify-center text-xl shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                🧠
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="block text-sm font-bold text-[#1D362D] group-hover:text-[#294C3F] transition-colors">
                    Tengo la mente a mil
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wide bg-[#294C3F]/10 text-[#294C3F] px-1.5 py-0.5 rounded">
                    Mente
                  </span>
                </div>
                <span className="block text-xs text-[#3B5B4D] mt-0.5 font-normal">
                  No puedo parar de pensar · Volver al presente
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#294C3F]/10 group-hover:bg-[#294C3F] group-hover:text-[#FFF9EF] flex items-center justify-center transition-colors text-[#294C3F] shrink-0">
              <ArrowRight size={16} />
            </div>
          </button>

          {/* Opción 2: Sobrepasada */}
          <button
            onClick={() => handleQuickMood('sobrecarga')}
            className="w-full text-left p-4 rounded-2xl bg-white hover:bg-[#FFF9EF] border-2 border-[#294C3F]/15 hover:border-[#294C3F] transition-all flex items-center justify-between group active:scale-[0.98] shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#294C3F] text-white flex items-center justify-center text-xl shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                😣
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="block text-sm font-bold text-[#1D362D] group-hover:text-[#294C3F] transition-colors">
                    Me siento sobrepasada
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wide bg-[#DE8A73]/20 text-[#8C3A24] px-1.5 py-0.5 rounded font-semibold">
                    Corte
                  </span>
                </div>
                <span className="block text-xs text-[#3B5B4D] mt-0.5 font-normal">
                  Tengo demasiado · Lo pendiente puede esperar
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#294C3F]/10 group-hover:bg-[#294C3F] group-hover:text-[#FFF9EF] flex items-center justify-center transition-colors text-[#294C3F] shrink-0">
              <ArrowRight size={16} />
            </div>
          </button>

          {/* Opción 3: Tensión */}
          <button
            onClick={() => handleQuickMood('tension')}
            className="w-full text-left p-4 rounded-2xl bg-white hover:bg-[#FFF9EF] border-2 border-[#294C3F]/15 hover:border-[#294C3F] transition-all flex items-center justify-between group active:scale-[0.98] shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#294C3F] text-white flex items-center justify-center text-xl shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                🤲
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="block text-sm font-bold text-[#1D362D] group-hover:text-[#294C3F] transition-colors">
                    Siento mucha tensión
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wide bg-[#527A68]/20 text-[#294C3F] px-1.5 py-0.5 rounded font-semibold">
                    Cuerpo
                  </span>
                </div>
                <span className="block text-xs text-[#3B5B4D] mt-0.5 font-normal">
                  Hombros, mandíbula o cuello rígido · Aflojar
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#294C3F]/10 group-hover:bg-[#294C3F] group-hover:text-[#FFF9EF] flex items-center justify-center transition-colors text-[#294C3F] shrink-0">
              <ArrowRight size={16} />
            </div>
          </button>

          {/* Opción 4: Desconectar */}
          <button
            onClick={() => handleQuickMood('desconectar')}
            className="w-full text-left p-4 rounded-2xl bg-white hover:bg-[#FFF9EF] border-2 border-[#294C3F]/15 hover:border-[#294C3F] transition-all flex items-center justify-between group active:scale-[0.98] shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#1D362D] text-white flex items-center justify-center text-xl shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                🌙
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="block text-sm font-bold text-[#1D362D] group-hover:text-[#294C3F] transition-colors">
                    Necesito desconectarme
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wide bg-[#CBB082]/30 text-[#68532F] px-1.5 py-0.5 rounded font-semibold">
                    Noche
                  </span>
                </div>
                <span className="block text-xs text-[#3B5B4D] mt-0.5 font-normal">
                  Cerrar el día · El día ya tuvo suficiente de ti
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#294C3F]/10 group-hover:bg-[#294C3F] group-hover:text-[#FFF9EF] flex items-center justify-center transition-colors text-[#294C3F] shrink-0">
              <ArrowRight size={16} />
            </div>
          </button>
        </div>
      </section>

      {/* High-Contrast Kind Progress Banner */}
      <section className="p-4 rounded-2xl bg-white border-2 border-[#294C3F]/20 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#294C3F] text-[#CBB082] flex items-center justify-center text-base shrink-0 font-serif font-bold">
            🌱
          </div>
          <div>
            <span className="font-bold text-xs text-[#1D362D] block">
              {sessions.length === 0
                ? 'Comienza con tu primera pausa'
                : `${sessions.length} ${sessions.length === 1 ? 'pausa realizada' : 'pausas realizadas'}`}
            </span>
            <span className="text-[11px] text-[#3B5B4D] block font-medium">
              {sessions.length === 0
                ? 'Solo 2 minutos para cambiar el tono de tu día'
                : 'Aprender a parar es un hábito amable'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('logros')}
          className="px-3 py-1.5 rounded-xl bg-[#F3E9D8] hover:bg-[#E4D5BE] text-[#1D362D] text-xs font-bold transition-colors shrink-0"
        >
          Ver logros
        </button>
      </section>
    </div>
  );
};
