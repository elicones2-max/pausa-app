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

        <h1 className="font-serif text-[32px] sm:text-4xl font-normal text-[#1D362D] tracking-tight leading-tight">
          Hola, <span className="font-semibold text-[#294C3F]">{userProfile.name || 'Elisa'}</span>.
        </h1>

        <p className="text-[15px] sm:text-sm font-medium text-[#3B5B4D] mt-1.5 leading-relaxed">
          No tienes que resolver nada ahora. Solo necesitas 2 minutos para bajar revoluciones.
        </p>
      </section>

      {/* 1. PAUSA DIARIA (CARD EDITORIAL DESTACADA CON IMAGEN PROTAGONISTA Y PROFUNDIDAD) */}
      <section className="relative overflow-hidden rounded-[30px] card-depth-dark text-[#FFF9EF]">
        {/* Soft Ambient Light Glow in Corner */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#CBB082]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Large Visual Photography Card Banner */}
        <div className="relative w-full h-48 sm:h-56 overflow-hidden">
          <img
            src="/daily-pause.jpg"
            alt="Pausa Diaria momento de calma"
            className="w-full h-full object-cover object-center transform scale-102"
            referrerPolicy="no-referrer"
          />
          {/* Editorial Gradient Scrim with Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D362D] via-[#1D362D]/45 to-black/25" />

          {/* Floating Badges with Frosted Glass Layering */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between text-xs">
            <span className="uppercase tracking-widest text-[10px] font-bold bg-[#1D362D]/85 backdrop-blur-md text-[#CBB082] px-3.5 py-1.5 rounded-full border border-[#CBB082]/40 flex items-center gap-1.5 shadow-md">
              <Sparkles size={11} />
              <span>Pausa Diaria · Día {currentDayItem.dayNumber} de 14</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#FFF9EF] font-mono text-xs bg-black/55 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-md">
              <Clock size={12} className="text-[#CBB082]" /> 2 min
            </span>
          </div>

          {/* Bottom Title on Image with Subtle Text Shadow for Maximum Legibility */}
          <div className="absolute bottom-3.5 left-4 right-4 text-left">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium leading-snug text-[#FFF9EF] drop-shadow-sm">
              {currentDayItem.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#FFF9EF]/90 mt-1 leading-relaxed font-light italic line-clamp-1 drop-shadow-xs">
              "{currentDayItem.intention}"
            </p>
          </div>
        </div>

        {/* Action Button Area */}
        <div className="p-4 bg-gradient-to-b from-[#294C3F] to-[#1D362D] border-t border-[#CBB082]/25">
          <button
            onClick={handleDailyPause}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FFF9EF] via-[#FBF5EB] to-[#F3E9D8] text-[#1D362D] font-bold text-xs uppercase tracking-widest button-tactile-light flex items-center justify-center gap-2.5 border border-[#CBB082]/60 hover:brightness-105 active:scale-[0.98]"
          >
            <Play size={16} className="fill-[#1D362D]" />
            <span>Hacer mi pausa de 2 min</span>
          </button>
        </div>
      </section>

      {/* 2. PAUSA AHORA: "DIME CÓMO ESTÁS Y YO TE DOY LA PAUSA ADECUADA" */}
      <section className="space-y-3 pt-1">
        <div className="flex items-baseline justify-between px-1">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-1 bg-[#294C3F] rounded-full" />
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
            className="w-full text-left p-4 rounded-2xl card-depth-md hover:border-[#294C3F]/40 transition-all flex items-center justify-between group active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2E5547] to-[#1D362D] text-white flex items-center justify-center text-xl shrink-0 shadow-md border border-[#CBB082]/30 group-hover:scale-105 transition-transform">
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
            <div className="w-8 h-8 rounded-full bg-[#294C3F]/10 group-hover:bg-[#294C3F] group-hover:text-[#FFF9EF] flex items-center justify-center transition-all text-[#294C3F] shrink-0 shadow-xs">
              <ArrowRight size={15} />
            </div>
          </button>

          {/* Opción 2: Sobrepasada */}
          <button
            onClick={() => handleQuickMood('sobrecarga')}
            className="w-full text-left p-4 rounded-2xl card-depth-md hover:border-[#294C3F]/40 transition-all flex items-center justify-between group active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2E5547] to-[#1D362D] text-white flex items-center justify-center text-xl shrink-0 shadow-md border border-[#CBB082]/30 group-hover:scale-105 transition-transform">
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
            <div className="w-8 h-8 rounded-full bg-[#294C3F]/10 group-hover:bg-[#294C3F] group-hover:text-[#FFF9EF] flex items-center justify-center transition-all text-[#294C3F] shrink-0 shadow-xs">
              <ArrowRight size={15} />
            </div>
          </button>

          {/* Opción 3: Tensión */}
          <button
            onClick={() => handleQuickMood('tension')}
            className="w-full text-left p-4 rounded-2xl card-depth-md hover:border-[#294C3F]/40 transition-all flex items-center justify-between group active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2E5547] to-[#1D362D] text-white flex items-center justify-center text-xl shrink-0 shadow-md border border-[#CBB082]/30 group-hover:scale-105 transition-transform">
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
            <div className="w-8 h-8 rounded-full bg-[#294C3F]/10 group-hover:bg-[#294C3F] group-hover:text-[#FFF9EF] flex items-center justify-center transition-all text-[#294C3F] shrink-0 shadow-xs">
              <ArrowRight size={15} />
            </div>
          </button>

          {/* Opción 4: Desconectar */}
          <button
            onClick={() => handleQuickMood('desconectar')}
            className="w-full text-left p-4 rounded-2xl card-depth-md hover:border-[#294C3F]/40 transition-all flex items-center justify-between group active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1D362D] to-[#152720] text-white flex items-center justify-center text-xl shrink-0 shadow-md border border-[#CBB082]/40 group-hover:scale-105 transition-transform">
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
            <div className="w-8 h-8 rounded-full bg-[#294C3F]/10 group-hover:bg-[#294C3F] group-hover:text-[#FFF9EF] flex items-center justify-center transition-all text-[#294C3F] shrink-0 shadow-xs">
              <ArrowRight size={15} />
            </div>
          </button>
        </div>
      </section>

      {/* Kind Progress Banner with Depth */}
      <section className="p-4 rounded-2xl card-depth-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2E5547] to-[#1D362D] text-[#CBB082] flex items-center justify-center text-base shrink-0 font-serif font-bold shadow-xs border border-[#CBB082]/30">
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
          className="px-3.5 py-2 rounded-xl bg-[#F3E9D8] hover:bg-[#E4D5BE] text-[#1D362D] text-xs font-bold transition-all shrink-0 button-tactile-light border border-[#CBB082]/40"
        >
          Ver logros
        </button>
      </section>
    </div>
  );
};
