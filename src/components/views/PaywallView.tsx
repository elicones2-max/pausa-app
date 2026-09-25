import React, { useState } from 'react';
import { usePausa } from '../../context/PausaContext';
import { Check, X, Shield, Sparkles, Calendar, Compass, Award, Heart } from 'lucide-react';

export const PaywallView: React.FC = () => {
  const { setCurrentView, updateProfile, userProfile } = usePausa();
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const userName = userProfile.name?.trim();
  const headingText = userName
    ? `${userName}, tu pausa puede continuar aquí.`
    : 'Tu pausa puede continuar aquí.';

  // Dynamic calculation for the 7-day free trial end date (never hardcoded)
  const getDynamicTrialEndDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const trialEndFormatted = getDynamicTrialEndDate();

  const handleStartTrial = () => {
    updateProfile({ isSubscribed: true });
    setStatusMessage(
      selectedPlan === 'annual'
        ? `¡Membresía activada! Tu prueba de 7 días está en marcha. No se cobrará nada hasta el ${trialEndFormatted}.`
        : '¡Membresía mensual activada! Disfruta de tu espacio diario.'
    );
    setTimeout(() => {
      setCurrentView('home');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#FFF9EF] text-[#1D362D] flex flex-col justify-between max-w-md mx-auto w-full px-6 py-6 border-x-2 border-[#294C3F]/20 shadow-2xl">
      {/* Header with High-End Calm Presence */}
      <header className="flex items-center justify-between pb-4 border-b border-[#294C3F]/15">
        <div className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-[#294C3F]">
            PAUSA
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#294C3F] font-bold bg-[#F3E9D8] px-2 py-0.5 rounded-full border border-[#294C3F]/20">
            Membresía
          </span>
        </div>

        <button
          onClick={() => setCurrentView('home')}
          aria-label="Cerrar y volver a la app"
          className="w-10 h-10 rounded-full bg-[#F3E9D8] hover:bg-[#E4D5BE] flex items-center justify-center text-[#1D362D] transition-colors border border-[#294C3F]/20"
        >
          <X size={18} />
        </button>
      </header>

      {/* Main Pitch */}
      <main className="flex-1 flex flex-col justify-center py-5 space-y-5">
        {/* Intro */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#294C3F] text-[#CBB082] text-xs font-bold shadow-xs">
            <Sparkles size={13} />
            <span>Membresía PAUSA</span>
          </div>

          <h1 className="font-serif text-3xl font-medium text-[#1D362D] leading-snug">
            {headingText}
          </h1>

          <p className="text-xs sm:text-sm text-[#3B5B4D] max-w-xs mx-auto leading-relaxed font-medium">
            Sigue teniendo una pausa guiada de 2 minutos cuando la necesites y una PAUSA DIARIA para acompañar tu ritmo.
          </p>
        </div>

        {/* Clear Communication of What the Membership Unlocks */}
        <div className="bg-white rounded-3xl p-5 border-2 border-[#294C3F]/20 space-y-3.5 text-xs text-[#1D362D] shadow-sm">
          <span className="text-[10px] uppercase tracking-widest text-[#294C3F] font-bold block mb-1">
            Lo que incluye tu membresía
          </span>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-[#294C3F]/10 flex items-center justify-center shrink-0 mt-0.5 text-[#294C3F]">
              <Compass size={14} />
            </div>
            <div>
              <strong className="block text-[#1D362D] font-bold">PAUSA AHORA</strong>
              <span className="text-[#3B5B4D] font-normal leading-relaxed">
                Guía instantánea para mente a mil, sobrecarga, tensión corporal y desconexión nocturna.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-[#294C3F]/10 flex items-center justify-center shrink-0 mt-0.5 text-[#294C3F]">
              <Calendar size={14} />
            </div>
            <div>
              <strong className="block text-[#1D362D] font-bold">PAUSA DIARIA</strong>
              <span className="text-[#3B5B4D] font-normal leading-relaxed">
                Tu ritual guiado de 2 minutos listo cada día, diseñado para acompañar tu ritmo.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-[#294C3F]/10 flex items-center justify-center shrink-0 mt-0.5 text-[#294C3F]">
              <Check size={14} className="stroke-[3]" />
            </div>
            <div>
              <strong className="block text-[#1D362D] font-bold">Recorrido progresivo de 14 días</strong>
              <span className="text-[#3B5B4D] font-normal leading-relaxed">
                Una secuencia suave paso a paso para construir el hábito de parar sin culpa.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-[#294C3F]/10 flex items-center justify-center shrink-0 mt-0.5 text-[#294C3F]">
              <Award size={14} />
            </div>
            <div>
              <strong className="block text-[#1D362D] font-bold">Personalización y progreso amable</strong>
              <span className="text-[#3B5B4D] font-normal leading-relaxed">
                Adaptado a tus momentos de tensión y registro de cómo te sientes al terminar.
              </span>
            </div>
          </div>
        </div>

        {/* Plan Selector */}
        <div className="space-y-3">
          {/* Plan Anual con 7 días de prueba */}
          <button
            type="button"
            onClick={() => setSelectedPlan('annual')}
            className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
              selectedPlan === 'annual'
                ? 'bg-[#294C3F] text-[#FFF9EF] border-[#294C3F] shadow-xl'
                : 'bg-white text-[#1D362D] border-[#294C3F]/20 hover:border-[#294C3F]'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">Anual · 7 días de prueba</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#CBB082] text-[#1D362D]">
                  Recomendado
                </span>
              </div>
              <span className={`text-xs mt-1 block ${selectedPlan === 'annual' ? 'text-[#FFF9EF]/90 font-light' : 'text-[#3B5B4D] font-medium'}`}>
                Hoy no pagas nada · Luego $39.99 al año (~$3.33/mes)
              </span>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              selectedPlan === 'annual' ? 'border-[#FFF9EF] bg-[#CBB082]' : 'border-[#294C3F]/40'
            }`}>
              {selectedPlan === 'annual' && <span className="w-2.5 h-2.5 rounded-full bg-[#1D362D]" />}
            </div>
          </button>

          {/* Plan Mensual */}
          <button
            type="button"
            onClick={() => setSelectedPlan('monthly')}
            className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
              selectedPlan === 'monthly'
                ? 'bg-[#294C3F] text-[#FFF9EF] border-[#294C3F] shadow-xl'
                : 'bg-white text-[#1D362D] border-[#294C3F]/20 hover:border-[#294C3F]'
            }`}
          >
            <div>
              <span className="text-sm font-bold">Mensual</span>
              <span className={`text-xs mt-1 block ${selectedPlan === 'monthly' ? 'text-[#FFF9EF]/90 font-light' : 'text-[#3B5B4D] font-medium'}`}>
                $4.99 al mes · Cobro mensual renovable
              </span>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              selectedPlan === 'monthly' ? 'border-[#FFF9EF] bg-[#CBB082]' : 'border-[#294C3F]/40'
            }`}>
              {selectedPlan === 'monthly' && <span className="w-2.5 h-2.5 rounded-full bg-[#1D362D]" />}
            </div>
          </button>
        </div>

        {/* Dynamic Trial Timeline Transparency (Calculated dynamically) */}
        {selectedPlan === 'annual' ? (
          <div className="p-3.5 rounded-2xl bg-[#F3E9D8] border border-[#294C3F]/15 space-y-1.5 text-xs text-[#1D362D]">
            <div className="flex items-center justify-between font-bold">
              <span>Hoy:</span>
              <span className="text-[#294C3F]">$0.00 (Prueba gratuita)</span>
            </div>
            <p className="text-[11px] text-[#3B5B4D] leading-relaxed">
              Disfruta 7 días completos sin costo. Tu primer cobro de $39.99/año será el{' '}
              <strong className="text-[#1D362D] font-semibold">{trialEndFormatted}</strong>.
            </p>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-[#F3E9D8] border border-[#294C3F]/15 space-y-1 text-xs text-[#1D362D]">
            <p className="text-[11px] text-[#3B5B4D] leading-relaxed">
              Primer cobro de $4.99 hoy. Renovación mensual continua sin permanencia.
            </p>
          </div>
        )}

        {/* Simple & Clear Cancellation Note */}
        <div className="flex items-start gap-2 text-xs text-[#3B5B4D] px-1 font-medium">
          <Shield size={15} className="text-[#294C3F] shrink-0 mt-0.5" />
          <span>
            <strong>Cancela cuando quieras:</strong> puedes cancelar en cualquier momento con un solo toque desde tu Perfil o tienda de aplicaciones. Sin llamadas, sin trabas ni penalizaciones.
          </span>
        </div>

        {statusMessage && (
          <div className="p-3.5 rounded-2xl bg-[#294C3F] text-xs text-[#FFF9EF] text-center font-bold shadow-md border border-[#CBB082]/40 animate-fade-in">
            {statusMessage}
          </div>
        )}
      </main>

      {/* Footer Actions */}
      <footer className="pt-4 border-t border-[#294C3F]/15 space-y-3 text-center">
        <button
          onClick={handleStartTrial}
          className="w-full py-4 rounded-2xl bg-[#294C3F] hover:bg-[#1D362D] text-[#FFF9EF] font-bold text-xs uppercase tracking-widest transition-all shadow-xl active:scale-98 border border-[#CBB082]/40"
        >
          {userProfile.isSubscribed
            ? 'Membresía activa · Ir al inicio'
            : selectedPlan === 'annual'
            ? 'Comenzar 7 días de prueba (Hoy: $0)'
            : 'Suscribirme por $4.99/mes'}
        </button>

        {userProfile.isSubscribed && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('¿Deseas cancelar tu suscripción? No se realizará ningún cobro adicional.')) {
                updateProfile({ isSubscribed: false });
                setStatusMessage('Tu membresía ha sido cancelada.');
              }
            }}
            className="text-xs text-[#8C3A24] underline underline-offset-2 hover:opacity-80 transition-opacity py-1 block mx-auto"
          >
            Cancelar mi membresía
          </button>
        )}

        <p className="text-xs text-[#3B5B4D] font-medium flex items-center justify-center gap-1.5">
          <Heart size={13} className="text-[#DE8A73]" />
          <span>Tu bienestar a tu propio ritmo</span>
        </p>
      </footer>
    </div>
  );
};
