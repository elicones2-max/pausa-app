import React from 'react';
import { usePausa } from '../../context/PausaContext';
import { Award, Heart, CheckCircle2, Sparkles } from 'lucide-react';

export const LogrosView: React.FC = () => {
  const { achievements, sessions } = usePausa();

  const completedCount = sessions.length;
  const totalMinutes = Math.round(completedCount * 2);

  // Group feelings from feedback
  const feelingCounts = sessions.reduce(
    (acc, curr) => {
      if (curr.postFeeling) {
        acc[curr.postFeeling] = (acc[curr.postFeeling] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-6">
      {/* Header */}
      <section className="pt-1">
        <div className="flex items-center gap-1.5 text-xs text-[#294C3F] font-bold tracking-wide mb-1">
          <Award size={14} className="text-[#CBB082]" />
          <span className="uppercase tracking-widest text-[10px] text-[#527A68]">Progreso amable</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1D362D] tracking-tight leading-tight">
          Tu camino de calma.
        </h1>

        <p className="text-sm text-[#3B5B4D] mt-1.5 leading-relaxed font-medium">
          Aquí no hay rachas que perder ni marcas que cumplir. Cada vez que te detienes 2 minutos, aprendes a priorizarte.
        </p>
      </section>

      {/* High-Contrast Metrics Cards */}
      <section className="grid grid-cols-2 gap-3">
        <div className="p-5 rounded-3xl bg-white border-2 border-[#294C3F]/20 shadow-sm text-left">
          <span className="text-[10px] uppercase tracking-wider text-[#294C3F] font-bold block mb-1">
            Pausas completadas
          </span>
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[#1D362D]">
            {completedCount}
          </div>
          <span className="text-xs text-[#3B5B4D] mt-1 block font-medium">
            momentos de respiro
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border-2 border-[#294C3F]/20 shadow-sm text-left">
          <span className="text-[10px] uppercase tracking-wider text-[#294C3F] font-bold block mb-1">
            Tiempo de pausa
          </span>
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[#1D362D]">
            {totalMinutes} <span className="text-base font-normal text-[#294C3F]">min</span>
          </div>
          <span className="text-xs text-[#3B5B4D] mt-1 block font-medium">
            dedicados a ti
          </span>
        </div>
      </section>

      {/* How it felt summary */}
      {completedCount > 0 && (
        <section className="p-5 rounded-3xl bg-[#F3E9D8] border-2 border-[#294C3F]/20 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-[#1D362D]">
              Cómo te has sentido después
            </h2>
            <Heart size={16} className="text-[#DE8A73]" />
          </div>

          <p className="text-xs text-[#3B5B4D] font-medium">
            Tus registros al finalizar cada pausa de 2 minutos:
          </p>

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs bg-white/80 p-2.5 rounded-xl border border-[#294C3F]/10">
              <span className="flex items-center gap-2 font-medium text-[#1D362D]">
                <span>🌿</span> Más tranquila
              </span>
              <span className="font-bold text-[#294C3F] bg-[#294C3F]/10 px-2.5 py-0.5 rounded-full">
                {feelingCounts['mas_tranquila'] || 0} veces
              </span>
            </div>

            <div className="flex items-center justify-between text-xs bg-white/80 p-2.5 rounded-xl border border-[#294C3F]/10">
              <span className="flex items-center gap-2 font-medium text-[#1D362D]">
                <span>🌱</span> Igual (espacio concedido)
              </span>
              <span className="font-bold text-[#294C3F] bg-[#294C3F]/10 px-2.5 py-0.5 rounded-full">
                {feelingCounts['igual'] || 0} veces
              </span>
            </div>

            <div className="flex items-center justify-between text-xs bg-white/80 p-2.5 rounded-xl border border-[#294C3F]/10">
              <span className="flex items-center gap-2 font-medium text-[#1D362D]">
                <span>🤲</span> Todavía sobrepasada (acto de cuidado)
              </span>
              <span className="font-bold text-[#294C3F] bg-[#294C3F]/10 px-2.5 py-0.5 rounded-full">
                {feelingCounts['todavia_sobrepasada'] || 0} veces
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Gentle Badges Section with Bold Contrast */}
      <section className="space-y-3">
        <h2 className="font-serif text-2xl font-medium text-[#1D362D] px-1">
          Hitos que estás descubriendo
        </h2>

        <div className="grid grid-cols-1 gap-2.5">
          {achievements.map((ach) => {
            const isUnlocked = !!ach.unlockedAt;
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-white border-[#294C3F]/30 shadow-sm'
                    : 'bg-white/60 border-[#294C3F]/10 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                    isUnlocked
                      ? 'bg-[#294C3F] text-[#CBB082] shadow-xs'
                      : 'bg-[#F3E9D8] text-[#294C3F]/50'
                  }`}
                >
                  {ach.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-sm font-bold ${
                        isUnlocked ? 'text-[#1D362D]' : 'text-[#3B5B4D]'
                      }`}
                    >
                      {ach.title}
                    </h3>
                    {isUnlocked && (
                      <span className="text-[10px] text-[#1D362D] font-bold bg-[#CBB082]/30 px-2 py-0.5 rounded-full border border-[#CBB082]/40">
                        Alcanzado
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#3B5B4D] mt-1 leading-relaxed font-normal">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Philosophy Callout in Deep Green */}
      <div className="p-5 rounded-3xl bg-[#294C3F] text-[#FFF9EF] text-center text-xs space-y-1 shadow-lg border border-[#CBB082]/30">
        <p className="font-serif italic text-lg text-[#CBB082] font-semibold">
          "Pausar no es perder el tiempo, es recuperar el timón."
        </p>
        <p className="text-[#FFF9EF]/90 font-light">Tu propio ritmo es el correcto.</p>
      </div>
    </div>
  );
};
