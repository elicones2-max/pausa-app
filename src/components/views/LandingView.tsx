import React from 'react';
import { usePausa } from '../../context/PausaContext';
import { CORE_PAUSES } from '../../data/pausasData';
import { MoodType } from '../../types/pausa';
import { ArrowRight, Clock, Sparkles, Shield, HeartHandshake } from 'lucide-react';

export const LandingView: React.FC = () => {
  const { setCurrentView, startPauseByMood, userProfile, updateProfile, resetToNewUser } = usePausa();

  const handleInstantPause = (mood: MoodType) => {
    if (!userProfile.isOnboarded) {
      updateProfile({ primaryNeed: mood });
      setCurrentView('onboarding');
    } else {
      startPauseByMood(mood);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9EF] text-[#1D362D] flex flex-col justify-between selection:bg-[#294C3F] selection:text-[#FFF9EF]">
      {/* Top Header with Strong Brand Presence */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#294C3F]/15 max-w-4xl mx-auto w-full bg-[#FFF9EF]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <span className="font-serif text-2xl font-bold tracking-tight text-[#294C3F]">
            PAUSA
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#294C3F] font-bold bg-[#F3E9D8] px-2 py-0.5 rounded-full border border-[#294C3F]/20">
            2 MIN
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('login')}
            className="text-xs font-bold text-[#294C3F] hover:text-[#1D362D] transition-colors py-2 px-1 underline-offset-4 hover:underline"
          >
            Ingresar
          </button>
          <button
            onClick={() => setCurrentView('onboarding')}
            className="text-xs font-bold px-4 py-2 rounded-full bg-[#294C3F] text-[#FFF9EF] hover:bg-[#1D362D] active:scale-95 transition-all shadow-md border border-[#CBB082]/40"
          >
            Empezar
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-xl mx-auto px-6 py-8 flex-1 flex flex-col justify-center text-center">
        {/* Subtle Warm Badge */}
        <div className="inline-flex items-center justify-center gap-2 text-xs text-[#294C3F] font-bold mb-4 bg-[#F3E9D8] px-3.5 py-1.5 rounded-full border border-[#294C3F]/20 mx-auto">
          <span className="w-2 h-2 rounded-full bg-[#CBB082]" />
          <span>Para mujeres con mente acelerada y sobrecarga</span>
        </div>

        {/* Main Promise with Punchy Contrast */}
        <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#1D362D] leading-[1.12] mb-4">
          Tu pausa de <span className="italic font-semibold text-[#294C3F]">2 minutos</span> para bajar revoluciones.
        </h1>

        <p className="text-base sm:text-lg text-[#3B5B4D] leading-relaxed max-w-md mx-auto mb-8 font-medium">
          Sin largas meditaciones, sin teoría pesada y sin añadir otra tarea pesada a tu día.
          <br />
          <strong className="text-[#1D362D] font-bold block mt-1">
            "Dime cómo estás y yo te doy la pausa adecuada."
          </strong>
        </p>

        {/* INSTANT INTERACTIVE COMPONENT: "DIME CÓMO ESTÁS" (BLOCK DESTACADO EN VERDE PROFUNDO) */}
        <div className="bg-[#294C3F] text-[#FFF9EF] border-2 border-[#CBB082]/40 rounded-3xl p-5 sm:p-6 text-left mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#527A68]/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#CBB082] bg-[#1D362D] px-2.5 py-1 rounded-full border border-[#CBB082]/30 flex items-center gap-1.5">
                <Sparkles size={12} />
                <span>Prueba tu primera pausa ahora</span>
              </span>
              <span className="text-xs text-[#FFF9EF] font-mono flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-full border border-white/10">
                <Clock size={12} className="text-[#CBB082]" /> 2 min
              </span>
            </div>

            <h2 className="font-serif text-2xl font-medium text-[#FFF9EF] mb-3">
              ¿Cómo estás en este momento?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.values(CORE_PAUSES).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleInstantPause(p.moodType)}
                  className="w-full text-left p-3.5 rounded-2xl bg-white hover:bg-[#FFF9EF] text-[#1D362D] transition-all flex items-center justify-between group active:scale-[0.98] shadow-md border border-[#CBB082]/30"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <span className="block text-sm font-bold text-[#1D362D] leading-tight group-hover:text-[#294C3F]">
                        {p.title}
                      </span>
                      <span className="block text-[11px] text-[#3B5B4D] leading-tight mt-0.5 font-medium">
                        {p.subtitle}
                      </span>
                    </div>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-[#294C3F] opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0"
                  />
                </button>
              ))}
            </div>

            <p className="text-xs text-[#FFF9EF]/80 text-center mt-3 font-light">
              Toca una opción y tu pausa comenzará de inmediato.
            </p>
          </div>
        </div>

        {/* Action Buttons with High Presence */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setCurrentView('onboarding')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#294C3F] hover:bg-[#1D362D] text-[#FFF9EF] font-bold text-sm tracking-wide transition-all shadow-xl active:scale-98 flex items-center justify-center gap-2.5 border border-[#CBB082]/40"
          >
            <span>Crear mi espacio personal</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => {
              if (userProfile.isOnboarded) {
                setCurrentView('home');
              } else {
                setCurrentView('login');
              }
            }}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-[#F3E9D8] text-[#1D362D] border-2 border-[#294C3F]/20 font-bold text-sm transition-all shadow-xs"
          >
            {userProfile.isOnboarded ? 'Entrar a mi espacio' : 'Ya tengo cuenta'}
          </button>
        </div>

        {/* User Quote with Editorial Elegance */}
        <div className="border-t-2 border-[#294C3F]/15 pt-6 text-center max-w-md mx-auto">
          <p className="font-serif italic text-xl text-[#1D362D] font-medium mb-1">
            "Por fin alguien me dice qué hacer ahora."
          </p>
          <p className="text-xs font-semibold text-[#294C3F] uppercase tracking-wider">
            Menos elección · Más dirección
          </p>
        </div>

        {/* 3 Pillars with Deep Green Contrast */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left mt-8 pt-6 border-t border-[#294C3F]/15">
          <div className="p-4 rounded-2xl bg-white border border-[#294C3F]/15 shadow-xs">
            <div className="text-sm font-mono text-[#294C3F] mb-1 font-bold">01.</div>
            <h3 className="text-xs font-bold text-[#1D362D]">Solo 2 minutos</h3>
            <p className="text-xs text-[#3B5B4D] mt-1 font-normal">
              Un corte deliberado y suficiente para devolverte el ritmo.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#294C3F]/15 shadow-xs">
            <div className="text-sm font-mono text-[#294C3F] mb-1 font-bold">02.</div>
            <h3 className="text-xs font-bold text-[#1D362D]">Sin teoría pesada</h3>
            <p className="text-xs text-[#3B5B4D] mt-1 font-normal">
              No es un curso ni una tarea más en tu día ya sobrecargado.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#294C3F]/15 shadow-xs">
            <div className="text-sm font-mono text-[#294C3F] mb-1 font-bold">03.</div>
            <h3 className="text-xs font-bold text-[#1D362D]">Hábito de 14 días</h3>
            <p className="text-xs text-[#3B5B4D] mt-1 font-normal">
              Aprende a parar sin juicios, castigos ni autoexigencia.
            </p>
          </div>
        </div>
      </main>

      {/* High-End Footer */}
      <footer className="px-6 py-5 border-t border-[#294C3F]/15 max-w-4xl mx-auto w-full flex flex-col gap-3 text-xs text-[#3B5B4D] font-medium">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div>
            <span>PAUSA © 2026 · Herramienta de pausas guiadas</span>
          </div>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <button
              onClick={() => setCurrentView('paywall')}
              className="text-[#294C3F] hover:text-[#1D362D] font-bold transition-colors underline underline-offset-2"
            >
              Membresía
            </button>
            <button
              onClick={() => setCurrentView('login')}
              className="text-[#294C3F] hover:text-[#1D362D] font-bold transition-colors underline underline-offset-2"
            >
              Acceso
            </button>
          </div>
        </div>

        {/* Herramienta temporal de desarrollo */}
        <div className="pt-2 border-t border-dashed border-[#294C3F]/20 flex justify-center">
          <button
            type="button"
            onClick={resetToNewUser}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#294C3F]/10 hover:bg-[#294C3F]/20 text-[#1D362D] border border-[#294C3F]/20 text-[11px] font-mono font-bold transition-colors"
          >
            <span>🧪</span>
            <span>REINICIAR PRUEBA — NUEVA USUARIA</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
