import React from 'react';
import { usePausa } from '../../context/PausaContext';
import { CORE_PAUSES } from '../../data/pausasData';
import { MoodType } from '../../types/pausa';
import { Play, Clock, Compass, Sparkles } from 'lucide-react';

export const PausaAhoraView: React.FC = () => {
  const { startPauseByMood } = usePausa();

  const handleSelect = (mood: MoodType) => {
    startPauseByMood(mood);
  };

  const pausesList = Object.values(CORE_PAUSES);

  return (
    <div className="space-y-6 animate-fade-in pb-6">
      {/* Intro with Strong Contrast */}
      <section className="pt-1">
        <div className="flex items-center gap-1.5 text-xs text-[#294C3F] font-bold tracking-wide mb-1">
          <Compass size={14} className="text-[#CBB082]" />
          <span className="uppercase tracking-widest text-[10px] text-[#527A68]">Pausa Ahora</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1D362D] tracking-tight leading-tight">
          ¿Cómo estás en este momento?
        </h1>

        <p className="text-sm text-[#3B5B4D] mt-1.5 leading-relaxed font-medium">
          Dime lo que sientes y PAUSA te guiará. No tienes que buscar entre decenas de técnicas.
        </p>
      </section>

      {/* The 4 Choices Detailed & Distinctive */}
      <section className="space-y-4">
        {pausesList.map((pause) => (
          <div
            key={pause.id}
            className="p-5 rounded-3xl bg-white border-2 border-[#294C3F]/20 hover:border-[#294C3F] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3.5 mb-3">
              <div className="w-13 h-13 rounded-2xl bg-[#294C3F] text-white border border-[#CBB082]/30 flex items-center justify-center text-2xl shrink-0 shadow-xs">
                {pause.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#1D362D]">
                    {pause.title}
                  </h3>
                  <span className="text-[11px] text-[#1D362D] flex items-center gap-1 bg-[#F3E9D8] px-2.5 py-1 rounded-full font-bold border border-[#294C3F]/15 shrink-0">
                    <Clock size={11} className="text-[#294C3F]" /> 2 min
                  </span>
                </div>

                <p className="text-xs text-[#3B5B4D] mt-1 font-medium">
                  {pause.subtitle}
                </p>
              </div>
            </div>

            {/* Core message quote block with rich warmth */}
            <div className="bg-[#FFF9EF] rounded-2xl p-3.5 border border-[#294C3F]/15 text-xs text-[#1D362D] font-serif italic mb-4 leading-relaxed">
              "{pause.coreMessage}"
            </div>

            <button
              onClick={() => handleSelect(pause.moodType)}
              className="w-full py-3.5 rounded-xl bg-[#294C3F] hover:bg-[#1D362D] text-[#FFF9EF] text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-md border border-[#CBB082]/30 hover:border-[#CBB082]"
            >
              <Play size={14} className="fill-[#FFF9EF]" />
              <span>Hacer esta pausa (2 min)</span>
            </button>
          </div>
        ))}
      </section>

      {/* Reassurance Card */}
      <div className="p-4 rounded-2xl bg-[#294C3F] text-[#FFF9EF] border border-[#CBB082]/40 text-center text-xs space-y-1 shadow-md">
        <p className="font-serif italic text-base text-[#CBB082]">
          "Menos elección → más dirección."
        </p>
        <span className="text-[#FFF9EF]/80 font-light">
          Dos minutos son suficientes para restablecer el ritmo de tu respiración y tu cuerpo.
        </span>
      </div>
    </div>
  );
};
