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
      <header className="px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b border-[#294C3F]/15 max-w-4xl mx-auto w-full bg-[#FFF9EF]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <img
            src="/logo-pausa.png"
            alt="Logo PAUSA"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-contain shadow-xs border border-[#294C3F]/15 shrink-0 bg-[#FFF9EF]"
            referrerPolicy="no-referrer"
          />
          <div className="flex items-center gap-2">
            <span className="font-serif text-[26px] sm:text-2xl font-bold tracking-tight text-[#294C3F] leading-none">
              PAUSA
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#294C3F] font-bold bg-[#F3E9D8] px-2 py-0.5 rounded-full border border-[#294C3F]/20 hidden xs:inline-block">
              2 MIN
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setCurrentView('login')}
            className="text-xs sm:text-sm font-bold text-[#294C3F] hover:text-[#1D362D] transition-colors py-2 px-2 underline-offset-4 hover:underline"
          >
            Ingresar
          </button>
          <button
            onClick={() => setCurrentView('onboarding')}
            className="text-xs sm:text-sm font-bold px-4 py-2.5 rounded-full bg-[#294C3F] text-[#FFF9EF] hover:bg-[#1D362D] active:scale-95 transition-all shadow-md border border-[#CBB082]/40"
          >
            Empezar
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col justify-center">
        {/* Editorial Wellness Hero Card */}
        <div className="relative w-full rounded-[28px] overflow-hidden shadow-2xl border-2 border-[#CBB082]/40 bg-[#1D362D] mb-5 aspect-[4/3] sm:aspect-[16/9]">
          <img
            src="/hero-editorial.jpg"
            alt="Mujer respirando en calma en PAUSA"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          {/* Multi-stop cinematic gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D362D]/95 via-[#1D362D]/35 to-black/25" />

          {/* Floating Header Pills */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md text-[#FFF9EF] text-[11px] font-bold border border-white/20 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CBB082] animate-pulse" />
              <span>PAUSA · 2 MIN</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#294C3F]/90 backdrop-blur-md text-[#CBB082] text-[11px] font-semibold border border-[#CBB082]/35 shadow-xs">
              <Sparkles size={11} />
              <span>Calma guiada</span>
            </div>
          </div>

          {/* Editorial Content Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-left">
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#CBB082] font-bold bg-[#1D362D]/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-[#CBB082]/30 mb-2">
              <span>Para mentes aceleradas y sobrecarga</span>
            </div>
            <h1 className="font-serif text-[26px] sm:text-4xl text-[#FFF9EF] font-normal leading-[1.18] tracking-tight">
              Tu pausa de 2 minutos para bajar revoluciones.
            </h1>
          </div>
        </div>

        {/* Value Proposition Callout */}
        <div className="text-center mb-5 px-1">
          <p className="text-[14px] sm:text-[15px] text-[#3B5B4D] font-medium leading-relaxed">
            Sin largas meditaciones ni tareas pesadas.
            <strong className="text-[#1D362D] font-bold block mt-0.5 text-[15px] sm:text-base">
              "Dime cómo estás y yo te doy la pausa adecuada."
            </strong>
          </p>
        </div>

        {/* INSTANT INTERACTIVE COMPONENT: "DIME CÓMO ESTÁS" (BLOCK DESTACADO EN VERDE PROFUNDO CON PROFUNDIDAD) */}
        <div className="card-depth-dark text-[#FFF9EF] rounded-3xl p-4 sm:p-6 text-left mb-6 sm:mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-52 h-52 bg-[#CBB082]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3.5 gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#CBB082] bg-[#1D362D]/90 px-3 py-1 rounded-full border border-[#CBB082]/35 flex items-center gap-1.5 shadow-sm truncate">
                <Sparkles size={12} className="shrink-0" />
                <span className="truncate">Prueba tu primera pausa ahora</span>
              </span>
              <span className="text-xs text-[#FFF9EF] font-mono flex items-center gap-1 bg-black/40 px-2.5 py-0.5 rounded-full border border-white/15 shadow-sm shrink-0">
                <Clock size={12} className="text-[#CBB082]" /> 2 min
              </span>
            </div>

            <h2 className="font-serif text-2xl font-medium text-[#FFF9EF] mb-3.5 drop-shadow-xs">
              ¿Cómo estás en este momento?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.values(CORE_PAUSES).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleInstantPause(p.moodType)}
                  className="w-full text-left p-3.5 sm:p-4 rounded-2xl card-depth-sm text-[#1D362D] transition-all flex items-center justify-between group active:scale-[0.98] border border-[#CBB082]/30 hover:border-[#294C3F] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl shrink-0 drop-shadow-xs">{p.icon}</span>
                    <div>
                      <span className="block text-sm sm:text-base font-bold text-[#1D362D] leading-tight group-hover:text-[#294C3F]">
                        {p.title}
                      </span>
                      <span className="block text-[11px] sm:text-xs text-[#3B5B4D] leading-tight mt-0.5 font-medium">
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

            <p className="text-xs text-[#FFF9EF]/85 text-center mt-3.5 font-light">
              Toca una opción y tu pausa comenzará de inmediato.
            </p>
          </div>
        </div>

        {/* Action Buttons with High Presence and Tactile Depth */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 sm:mb-10 w-full">
          <button
            onClick={() => setCurrentView('onboarding')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#294C3F] hover:bg-[#1D362D] text-[#FFF9EF] font-bold text-sm sm:text-base tracking-wide button-tactile flex items-center justify-center gap-2.5 border border-[#CBB082]/40"
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
            className="w-full sm:w-auto px-6 py-4 rounded-2xl card-depth-sm hover:bg-[#F3E9D8] text-[#1D362D] font-bold text-sm sm:text-base button-tactile-light"
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
