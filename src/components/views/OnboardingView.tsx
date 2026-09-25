import React, { useState } from 'react';
import { usePausa } from '../../context/PausaContext';
import { CORE_PAUSES } from '../../data/pausasData';
import { ArrowRight, Check, Sparkles, X } from 'lucide-react';

export const OnboardingView: React.FC = () => {
  const { userProfile, updateProfile, setCurrentView, startPause } = usePausa();

  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>(userProfile.name || 'Elisa');
  const [primaryNeed, setPrimaryNeed] = useState<string>(
    userProfile.primaryNeed || 'Mi mente va demasiado rápido'
  );
  const [usualMoment, setUsualMoment] = useState<string>(
    userProfile.usualMoment || 'Al final del día'
  );
  const [preferredGuidance, setPreferredGuidance] = useState<string>(
    userProfile.preferredGuidance || 'Me gusta que me guíen con voz y texto suave'
  );

  const needsOptions = [
    { label: 'Mi mente va demasiado rápido', icon: '🧠' },
    { label: 'Tengo demasiados pendientes y me sobrepaso', icon: '😣' },
    { label: 'Acumulo tensión en hombros y mandíbula', icon: '🤲' },
    { label: 'Me cuesta apagar el trabajo al terminar el día', icon: '🌙' },
  ];

  const momentOptions = [
    { label: 'En medio de la jornada (cuando surge el agobio)', icon: '⚡' },
    { label: 'Al final del día (para cerrar y descansar)', icon: '🌆' },
    { label: 'Por la mañana (para no arrancar acelerada)', icon: '🌅' },
  ];

  const startFirstPauseExperience = () => {
    let moodKey: 'mente' | 'sobrecarga' | 'tension' | 'desconectar' = 'mente';
    if (primaryNeed.includes('sobrepaso') || primaryNeed.includes('pendientes')) {
      moodKey = 'sobrecarga';
    } else if (primaryNeed.includes('tensión') || primaryNeed.includes('hombros')) {
      moodKey = 'tension';
    } else if (primaryNeed.includes('apagar') || primaryNeed.includes('terminar el día')) {
      moodKey = 'desconectar';
    }
    const exp = CORE_PAUSES[moodKey] || CORE_PAUSES['mente'];
    startPause(exp, true, 1);
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      updateProfile({
        name: name.trim() || 'Elisa',
        primaryNeed,
        usualMoment,
        preferredGuidance,
        isOnboarded: true,
      });
      startFirstPauseExperience();
      setCurrentView('home');
    }
  };

  const handleSkip = () => {
    updateProfile({
      name: name.trim() || 'Elisa',
      primaryNeed,
      usualMoment,
      preferredGuidance,
      isOnboarded: true,
    });
    startFirstPauseExperience();
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-[#FFF9EF] text-[#1D362D] flex flex-col justify-between max-w-md mx-auto w-full px-6 py-6 border-x-2 border-[#294C3F]/20 shadow-2xl">
      {/* Header with High-End Contrast */}
      <header className="flex items-center justify-between pt-2 pb-4 border-b border-[#294C3F]/15">
        <div className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-[#294C3F]">
            PAUSA
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#294C3F] font-bold bg-[#F3E9D8] px-2 py-0.5 rounded-full border border-[#294C3F]/20">
            Personalización
          </span>
        </div>

        <button
          onClick={handleSkip}
          className="text-xs font-bold text-[#294C3F] hover:text-[#1D362D] flex items-center gap-1 p-1 underline-offset-2 hover:underline"
        >
          <span>Saltar</span>
          <X size={16} />
        </button>
      </header>

      {/* Progress Line */}
      <div className="flex items-center gap-2 py-3 mb-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              s <= step ? 'bg-[#294C3F]' : 'bg-[#F3E9D8] border border-[#294C3F]/10'
            }`}
          />
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center py-4">
        {/* STEP 1: NOMBRE */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#294C3F] font-bold bg-[#F3E9D8] px-2.5 py-1 rounded-full inline-block border border-[#294C3F]/20">
                Paso 1 de 4
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1D362D] leading-tight">
                ¿Cómo te gustaría que te llamemos?
              </h1>
              <p className="text-sm text-[#3B5B4D] font-medium">
                Para que cada pausa se sienta personal, cercana y respetuosa.
              </p>
            </div>

            <div>
              <label htmlFor="name-input" className="block text-xs font-bold text-[#1D362D] mb-2">
                Tu nombre de pila
              </label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Elisa, Claudia, Sofía..."
                className="w-full px-4 py-4 rounded-2xl bg-white border-2 border-[#294C3F]/25 text-[#1D362D] placeholder-[#3B5B4D]/50 focus:outline-none focus:border-[#294C3F] font-semibold text-base transition-colors shadow-sm"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* STEP 2: NECESIDAD PRINCIPAL */}
        {step === 2 && (
          <div className="animate-fade-in space-y-5">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#294C3F] font-bold bg-[#F3E9D8] px-2.5 py-1 rounded-full inline-block border border-[#294C3F]/20">
                Paso 2 de 4
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1D362D] leading-tight">
                {name || 'Elisa'}, ¿qué sueles experimentar cuando estás sobrecargada?
              </h1>
              <p className="text-sm text-[#3B5B4D] font-medium">
                Nos ayuda a sugerirte la pausa adecuada sin que tengas que buscar.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {needsOptions.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setPrimaryNeed(opt.label)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-xs sm:text-sm ${
                    primaryNeed === opt.label
                      ? 'bg-[#294C3F] border-[#294C3F] text-[#FFF9EF] font-bold shadow-md'
                      : 'bg-white border-[#294C3F]/15 text-[#1D362D] hover:border-[#294C3F] font-medium shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </div>
                  {primaryNeed === opt.label && <Check size={18} className="text-[#CBB082] stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: MOMENTO HABITUAL */}
        {step === 3 && (
          <div className="animate-fade-in space-y-5">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#294C3F] font-bold bg-[#F3E9D8] px-2.5 py-1 rounded-full inline-block border border-[#294C3F]/20">
                Paso 3 de 4
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1D362D] leading-tight">
                ¿En qué momento sientes que más te cuesta parar?
              </h1>
              <p className="text-sm text-[#3B5B4D] font-medium">
                PAUSA preparará tu pausa diaria según tu ritmo.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {momentOptions.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setUsualMoment(opt.label)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-xs sm:text-sm ${
                    usualMoment === opt.label
                      ? 'bg-[#294C3F] border-[#294C3F] text-[#FFF9EF] font-bold shadow-md'
                      : 'bg-white border-[#294C3F]/15 text-[#1D362D] hover:border-[#294C3F] font-medium shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </div>
                  {usualMoment === opt.label && <Check size={18} className="text-[#CBB082] stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: RESUMEN Y BIENVENIDA CÁLIDA */}
        {step === 4 && (
          <div className="animate-fade-in space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#294C3F] border-2 border-[#CBB082] text-2xl flex items-center justify-center mx-auto text-[#CBB082] shadow-md">
              🌿
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#294C3F] font-bold bg-[#F3E9D8] px-3 py-1 rounded-full inline-block border border-[#294C3F]/20">
                Tu espacio está listo
              </span>
              <h1 className="font-serif text-3xl font-medium text-[#1D362D] leading-snug">
                {name || 'Elisa'}, hagamos una pausa.
              </h1>
              <p className="text-sm text-[#3B5B4D] max-w-xs mx-auto leading-relaxed font-medium">
                Solo necesitas 2 minutos. Hoy vamos a bajar un poco el ritmo de tu mente.
              </p>
            </div>

            <div className="bg-[#294C3F] text-[#FFF9EF] rounded-3xl p-5 text-left border border-[#CBB082]/40 space-y-2.5 text-xs shadow-xl">
              <div className="flex justify-between border-b border-white/15 pb-2">
                <span className="text-[#CBB082] font-semibold">Tu nombre:</span>
                <span className="font-bold">{name || 'Elisa'}</span>
              </div>
              <div className="flex justify-between border-b border-white/15 pb-2">
                <span className="text-[#CBB082] font-semibold">Tu foco:</span>
                <span className="font-bold truncate max-w-[190px]">{primaryNeed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#CBB082] font-semibold">Momento clave:</span>
                <span className="font-bold truncate max-w-[190px]">{usualMoment}</span>
              </div>
            </div>

            <p className="text-xs text-[#294C3F] font-serif italic font-bold">
              "Menos elección, más dirección."
            </p>
          </div>
        )}
      </main>

      {/* Footer Navigation */}
      <footer className="pt-4 border-t border-[#294C3F]/15 flex items-center justify-between gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="px-5 py-4 rounded-xl border-2 border-[#294C3F]/25 text-xs font-bold text-[#1D362D] hover:bg-[#F3E9D8] transition-colors"
          >
            Atrás
          </button>
        )}

        <button
          type="button"
          onClick={handleNext}
          className="flex-1 py-4 px-6 rounded-xl bg-[#294C3F] hover:bg-[#1D362D] text-[#FFF9EF] font-bold text-xs uppercase tracking-widest transition-all shadow-xl active:scale-98 flex items-center justify-center gap-2 border border-[#CBB082]/40"
        >
          <span>{step === 4 ? 'Comenzar mi primera pausa (2 min)' : 'Continuar'}</span>
          <ArrowRight size={16} />
        </button>
      </footer>
    </div>
  );
};
