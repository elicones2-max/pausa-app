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
    <div className="space-y-5 animate-fade-in pb-6">
      {/* Editorial Sanctuary Banner with Depth */}
      <div className="relative w-full h-36 sm:h-40 rounded-[28px] overflow-hidden shadow-xl border border-[#CBB082]/45">
        <img
          src="/sanctuary.jpg"
          alt="Espacio de calma PAUSA"
          className="w-full h-full object-cover object-center transform scale-102"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D362D]/95 via-[#1D362D]/40 to-black/20" />
        <div className="absolute bottom-3.5 left-4 right-4">
          <span className="text-[10px] uppercase tracking-widest text-[#CBB082] font-bold block mb-1 drop-shadow-xs">
            Elige según tu estado corporal
          </span>
          <h2 className="font-serif text-lg sm:text-xl text-[#FFF9EF] font-medium leading-snug drop-shadow-sm">
            Toca lo que sientes. PAUSA te guía durante 2 minutos.
          </h2>
        </div>
      </div>

      {/* Intro with Strong Contrast */}
      <section className="pt-0.5 px-0.5">
        <div className="flex items-center gap-2 text-xs text-[#294C3F] font-bold tracking-wide mb-1">
          <Compass size={14} className="text-[#CBB082]" />
          <span className="uppercase tracking-widest text-[10px] text-[#527A68]">Pausa Ahora</span>
        </div>

        <h1 className="font-serif text-[28px] sm:text-3xl font-normal text-[#1D362D] tracking-tight leading-tight">
          ¿Cómo estás en este momento?
        </h1>
      </section>

      {/* The 4 Choices Detailed & Distinctive */}
      <section className="space-y-4">
        {pausesList.map((pause) => (
          <div
            key={pause.id}
            className="p-5 rounded-3xl card-depth-md hover:border-[#294C3F]/40 transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3.5 mb-3.5">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#2E5547] to-[#1D362D] text-white border border-[#CBB082]/35 flex items-center justify-center text-2xl shrink-0 shadow-md">
                {pause.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#1D362D]">
                    {pause.title}
                  </h3>
                  <span className="text-[11px] text-[#1D362D] flex items-center gap-1 bg-[#F3E9D8] px-2.5 py-1 rounded-full font-bold border border-[#294C3F]/15 shrink-0 shadow-2xs">
                    <Clock size={11} className="text-[#294C3F]" /> 2 min
                  </span>
                </div>

                <p className="text-xs text-[#3B5B4D] mt-1 font-medium">
                  {pause.subtitle}
                </p>
              </div>
            </div>

            {/* Core message quote block with rich warmth and inner depth */}
            <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FBF5EB] rounded-2xl p-4 border border-[#294C3F]/12 text-xs text-[#1D362D] font-serif italic mb-4 leading-relaxed shadow-[inset_0_1px_2px_rgba(41,76,63,0.03)]">
              "{pause.coreMessage}"
            </div>

            <button
              onClick={() => handleSelect(pause.moodType)}
              className="w-full py-3.5 rounded-xl bg-[#294C3F] hover:bg-[#1D362D] text-[#FFF9EF] text-xs font-bold uppercase tracking-widest button-tactile flex items-center justify-center gap-2 active:scale-[0.98] border border-[#CBB082]/40"
            >
              <Play size={14} className="fill-[#FFF9EF]" />
              <span>Hacer esta pausa (2 min)</span>
            </button>
          </div>
        ))}
      </section>

      {/* Reassurance Card with Depth */}
      <div className="p-4 rounded-2xl card-depth-dark text-[#FFF9EF] text-center text-xs space-y-1">
        <p className="font-serif italic text-base text-[#CBB082]">
          "Menos elección → más dirección."
        </p>
        <span className="text-[#FFF9EF]/85 font-light">
          Dos minutos son suficientes para restablecer el ritmo de tu respiración y tu cuerpo.
        </span>
      </div>
    </div>
  );
};
