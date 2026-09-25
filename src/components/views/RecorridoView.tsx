import React from 'react';
import { usePausa } from '../../context/PausaContext';
import { FOURTEEN_DAYS_JOURNEY, CORE_PAUSES } from '../../data/pausasData';
import { Play, Check, Lock, Calendar, Sparkles } from 'lucide-react';

export const RecorridoView: React.FC = () => {
  const { currentJourneyDay, startPause } = usePausa();

  const handleStartDay = (dayItem: (typeof FOURTEEN_DAYS_JOURNEY)[0]) => {
    const experience = CORE_PAUSES[dayItem.moodType];
    startPause(experience, true, dayItem.dayNumber);
  };

  const getPhaseName = (day: number) => {
    if (day <= 3) return 'Fase 1: El permiso de parar (Días 1–3)';
    if (day <= 7) return 'Fase 2: Sobrecarga y mente acelerada (Días 4–7)';
    if (day <= 12) return 'Fase 3: Resetear y cerrar momentos (Días 8–12)';
    return 'Fase 4: Tu pausa personalizada (Días 13–14)';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-6">
      {/* Header */}
      <section className="pt-1">
        <div className="flex items-center gap-1.5 text-xs text-[#294C3F] font-bold tracking-wide mb-1">
          <Calendar size={14} className="text-[#CBB082]" />
          <span className="uppercase tracking-widest text-[10px] text-[#527A68]">Recorrido guiado</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1D362D] tracking-tight leading-tight">
          14 días para aprender a parar.
        </h1>

        <p className="text-sm text-[#3B5B4D] mt-1.5 leading-relaxed font-medium">
          14 pequeñas pausas de 2 minutos para crear el hábito sin esfuerzo, sin teoría pesada y sin exigencias.
        </p>

        {/* High-Contrast Progress Card */}
        <div className="mt-4 p-4 rounded-2xl bg-white border-2 border-[#294C3F]/20 shadow-sm">
          <div className="flex justify-between items-center text-xs font-bold text-[#1D362D] mb-2">
            <span className="flex items-center gap-1 text-[#294C3F]">
              <Sparkles size={13} className="text-[#CBB082]" />
              <span>Tu avance en el recorrido</span>
            </span>
            <span className="bg-[#294C3F] text-[#FFF9EF] px-2.5 py-0.5 rounded-full text-[11px]">
              Día {currentJourneyDay} de 14
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#F3E9D8] rounded-full overflow-hidden border border-[#294C3F]/10">
            <div
              className="h-full bg-gradient-to-r from-[#294C3F] to-[#527A68] rounded-full transition-all duration-500"
              style={{ width: `${(currentJourneyDay / 14) * 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* 14 Days List with Crisp Contrast */}
      <section className="space-y-3">
        {FOURTEEN_DAYS_JOURNEY.map((dayItem, index) => {
          const isCompleted = dayItem.dayNumber < currentJourneyDay;
          const isCurrent = dayItem.dayNumber === currentJourneyDay;
          const isLocked = dayItem.dayNumber > currentJourneyDay;

          const showPhaseHeader =
            index === 0 ||
            dayItem.dayNumber === 4 ||
            dayItem.dayNumber === 8 ||
            dayItem.dayNumber === 13;

          return (
            <React.Fragment key={dayItem.dayNumber}>
              {showPhaseHeader && (
                <div className="pt-3 pb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#294C3F]" />
                  <span className="text-[11px] uppercase tracking-widest text-[#294C3F] font-bold">
                    {getPhaseName(dayItem.dayNumber)}
                  </span>
                </div>
              )}

              <div
                className={`p-4 rounded-2xl border-2 transition-all ${
                  isCurrent
                    ? 'bg-[#294C3F] text-[#FFF9EF] border-[#CBB082] shadow-xl relative overflow-hidden'
                    : isCompleted
                    ? 'bg-white border-[#294C3F]/25 text-[#1D362D] shadow-xs'
                    : 'bg-white/80 border-[#294C3F]/10 text-[#1D362D]/60'
                }`}
              >
                {isCurrent && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#527A68]/30 rounded-full blur-2xl pointer-events-none" />
                )}

                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-serif font-bold shrink-0 mt-0.5 border ${
                        isCurrent
                          ? 'bg-[#CBB082] text-[#1D362D] border-[#FFF9EF]'
                          : isCompleted
                          ? 'bg-[#294C3F] text-[#FFF9EF] border-transparent'
                          : 'bg-[#F3E9D8] text-[#294C3F] border-[#294C3F]/15'
                      }`}
                    >
                      {isCompleted ? <Check size={16} strokeWidth={2.8} /> : dayItem.dayNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm font-bold ${isCurrent ? 'text-[#FFF9EF]' : 'text-[#1D362D]'}`}>
                          {dayItem.title}
                        </h3>
                        {isCurrent && (
                          <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.2 rounded bg-[#CBB082] text-[#1D362D]">
                            Hoy
                          </span>
                        )}
                      </div>

                      <p className={`text-xs mt-1 leading-relaxed ${isCurrent ? 'text-[#FFF9EF]/90 font-light' : 'text-[#3B5B4D] font-normal'}`}>
                        {dayItem.intention}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center">
                    {isCurrent ? (
                      <button
                        onClick={() => handleStartDay(dayItem)}
                        className="py-2 px-3.5 rounded-xl bg-[#FFF9EF] text-[#1D362D] font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:bg-[#F3E9D8] active:scale-95 flex items-center gap-1.5 border border-[#CBB082]"
                      >
                        <Play size={12} className="fill-[#1D362D]" />
                        <span>Hacer</span>
                      </button>
                    ) : isCompleted ? (
                      <button
                        onClick={() => handleStartDay(dayItem)}
                        className="py-1.5 px-3 rounded-lg text-xs font-bold text-[#294C3F] bg-[#F3E9D8] hover:bg-[#E4D5BE] transition-colors"
                      >
                        Repetir
                      </button>
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center text-[#294C3F]/40">
                        <Lock size={16} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </section>

      {/* Philosophy Box */}
      <div className="p-4 rounded-2xl bg-[#F3E9D8] border border-[#294C3F]/20 text-center text-xs text-[#1D362D]">
        <p className="font-serif italic text-base text-[#294C3F] font-bold mb-1">
          Sin exámenes ni culpas.
        </p>
        <span className="text-[#3B5B4D] font-medium">
          Si un día no puedes pausar, no perdiste nada. Tu espacio sigue aquí esperándote cuando estés lista.
        </span>
      </div>
    </div>
  );
};
