import React, { useState } from 'react';
import { usePausa } from '../../context/PausaContext';
import { User, Sparkles, Check, RotateCcw, ShieldCheck } from 'lucide-react';

export const PerfilView: React.FC = () => {
  const {
    userProfile,
    updateProfile,
    soundEnabled,
    toggleSound,
    resetProgress,
    setCurrentView,
  } = usePausa();

  const [name, setName] = useState(userProfile.name);
  const [primaryNeed, setPrimaryNeed] = useState(userProfile.primaryNeed);
  const [usualMoment, setUsualMoment] = useState(userProfile.usualMoment);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || 'Elisa',
      primaryNeed,
      usualMoment,
    });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('¿Quieres reiniciar tu historial de pausas y recorrido?')) {
      resetProgress();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-6">
      {/* Header */}
      <section className="pt-1">
        <div className="flex items-center gap-1.5 text-xs text-[#294C3F] font-bold tracking-wide mb-1">
          <User size={14} className="text-[#CBB082]" />
          <span className="uppercase tracking-widest text-[10px] text-[#527A68]">Tu espacio</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1D362D] tracking-tight leading-tight">
          Personalización.
        </h1>

        <p className="text-sm text-[#3B5B4D] mt-1.5 leading-relaxed font-medium">
          Ajusta cómo te acompaña PAUSA para que la experiencia responda a tu día a día.
        </p>
      </section>

      {/* Subscription Status Card in Rich Deep Green */}
      <section className="p-5 rounded-3xl bg-[#294C3F] text-[#FFF9EF] flex items-center justify-between border-2 border-[#CBB082]/40 shadow-xl relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <span className="text-[10px] uppercase tracking-widest text-[#CBB082] font-bold block">
            Membresía
          </span>
          <h3 className="font-serif text-xl font-bold text-[#FFF9EF]">
            {userProfile.isSubscribed ? 'PAUSA Completa' : 'Periodo de Bienvenida'}
          </h3>
          <p className="text-xs text-[#FFF9EF]/80 font-light">
            {userProfile.isSubscribed
              ? 'Acceso ilimitado a pausas y recorrido'
              : 'Acceso a las 4 experiencias y los 14 días'}
          </p>
        </div>

        <button
          onClick={() => setCurrentView('paywall')}
          className="relative z-10 px-4 py-2.5 rounded-xl bg-[#CBB082] hover:bg-[#d8c29b] text-[#1D362D] text-xs font-bold transition-all shadow-md active:scale-95 shrink-0"
        >
          {userProfile.isSubscribed ? 'Gestionar' : 'Ver planes'}
        </button>
      </section>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="p-5 rounded-3xl bg-white border-2 border-[#294C3F]/20 space-y-4 shadow-sm">
          <div>
            <label htmlFor="user-name" className="block text-xs font-bold text-[#1D362D] mb-1.5">
              ¿Cómo te llamas?
            </label>
            <input
              id="user-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#FFF9EF] border border-[#294C3F]/25 text-sm font-semibold text-[#1D362D] focus:outline-none focus:border-[#294C3F] focus:ring-1 focus:ring-[#294C3F]"
            />
          </div>

          <div>
            <label htmlFor="user-need" className="block text-xs font-bold text-[#1D362D] mb-1.5">
              Tu situación más frecuente
            </label>
            <select
              id="user-need"
              value={primaryNeed}
              onChange={(e) => setPrimaryNeed(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#FFF9EF] border border-[#294C3F]/25 text-xs sm:text-sm font-semibold text-[#1D362D] focus:outline-none focus:border-[#294C3F]"
            >
              <option value="Mi mente va demasiado rápido">Mi mente va demasiado rápido</option>
              <option value="Tengo demasiados pendientes y me sobrepaso">Tengo demasiados pendientes y me sobrepaso</option>
              <option value="Acumulo tensión en hombros y mandíbula">Acumulo tensión en hombros y mandíbula</option>
              <option value="Me cuesta apagar el trabajo al terminar el día">Me cuesta apagar el trabajo al terminar el día</option>
            </select>
          </div>

          <div>
            <label htmlFor="user-moment" className="block text-xs font-bold text-[#1D362D] mb-1.5">
              Momento habitual de pausa
            </label>
            <select
              id="user-moment"
              value={usualMoment}
              onChange={(e) => setUsualMoment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#FFF9EF] border border-[#294C3F]/25 text-xs sm:text-sm font-semibold text-[#1D362D] focus:outline-none focus:border-[#294C3F]"
            >
              <option value="En medio de la jornada (cuando surge el agobio)">En medio de la jornada (cuando surge el agobio)</option>
              <option value="Al final del día (para cerrar y descansar)">Al final del día (para cerrar y descansar)</option>
              <option value="Por la mañana (para no arrancar acelerada)">Por la mañana (para no arrancar acelerada)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-[#294C3F] hover:bg-[#1D362D] text-[#FFF9EF] text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-98 shadow-md border border-[#CBB082]/30"
          >
            <Check size={16} />
            <span>Guardar cambios</span>
          </button>

          {showSavedToast && (
            <p className="text-xs text-[#294C3F] text-center font-bold animate-fade-in bg-[#F3E9D8] py-2 rounded-xl border border-[#294C3F]/15">
              Cambios guardados con éxito.
            </p>
          )}
        </div>
      </form>

      {/* Preferences & Sound */}
      <section className="p-5 rounded-3xl bg-white border-2 border-[#294C3F]/20 space-y-3 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#294C3F]">
          Preferencias de sonido
        </h3>

        <div className="flex items-center justify-between py-1">
          <div>
            <span className="text-sm font-bold text-[#1D362D] block">
              Campanita de inicio y fin
            </span>
            <span className="text-xs text-[#3B5B4D] font-medium">
              Sonido suave de cuenco tibetano al comenzar y terminar
            </span>
          </div>

          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
            className={`w-13 h-7 rounded-full transition-colors relative flex items-center px-1 shrink-0 ${
              soundEnabled ? 'bg-[#294C3F]' : 'bg-[#E4D5BE]'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Privacy and Reset */}
      <section className="p-4 rounded-2xl bg-[#F3E9D8] border border-[#294C3F]/20 flex items-center justify-between text-xs text-[#1D362D]">
        <span className="font-medium text-[#3B5B4D]">Tus registros son 100% privados.</span>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-[#8C3A24] hover:underline flex items-center gap-1 font-bold"
        >
          <RotateCcw size={13} />
          <span>Reiniciar historial</span>
        </button>
      </section>
    </div>
  );
};
