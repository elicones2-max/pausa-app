import React, { useState } from 'react';
import { usePausa } from '../../context/PausaContext';
import { ArrowRight, ArrowLeft, Mail, ShieldCheck } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { setCurrentView, updateProfile } = usePausa();
  const [email, setEmail] = useState('');
  const [sentLink, setSentLink] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSentLink(true);
    setTimeout(() => {
      updateProfile({ isOnboarded: true });
      setCurrentView('home');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FFF9EF] text-[#1D362D] flex flex-col justify-between max-w-md mx-auto w-full px-4.5 sm:px-6 py-5 sm:py-6 border-x-2 border-[#294C3F]/20 shadow-2xl">
      {/* Header */}
      <header className="flex items-center justify-between pb-3.5 border-b border-[#294C3F]/15">
        <button
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#294C3F] hover:text-[#1D362D] transition-colors py-1.5 px-1"
        >
          <ArrowLeft size={16} />
          <span>Volver</span>
        </button>

        <div className="flex items-center gap-2.5">
          <img
            src="/logo-pausa.png"
            alt="Logo PAUSA"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-contain shadow-xs border border-[#294C3F]/15 shrink-0 bg-[#FFF9EF]"
            referrerPolicy="no-referrer"
          />
          <span className="font-serif text-[26px] sm:text-2xl font-bold tracking-tight text-[#294C3F] leading-none">
            PAUSA
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col justify-center py-4 space-y-5">
        {/* Editorial Visual Card with Depth */}
        <div className="relative w-full h-36 rounded-[26px] overflow-hidden shadow-xl border border-[#CBB082]/45 bg-[#1D362D] flex items-center justify-center">
          <img
            src="/sanctuary.jpg"
            alt="Espacio sereno PAUSA"
            className="w-full h-full object-cover object-center absolute inset-0 transform scale-102"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D362D]/90 via-[#1D362D]/50 to-black/30 backdrop-blur-[0.5px]" />
          <div className="relative z-10 flex flex-col items-center">
            <img
              src="/logo-pausa.png"
              alt="Logo oficial PAUSA"
              className="w-16 h-16 rounded-2xl object-contain shadow-2xl border border-[#CBB082]/50 bg-[#FFF9EF] p-1"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="text-center space-y-1.5">
          <h1 className="font-serif text-3xl font-medium text-[#1D362D] leading-snug">
            Bienvenida de vuelta a tu espacio.
          </h1>

          <p className="text-sm text-[#3B5B4D] max-w-xs mx-auto leading-relaxed font-medium">
            Ingresa con tu correo para continuar con tus pausas de hoy.
          </p>
        </div>

        {sentLink ? (
          <div className="p-5 rounded-2xl card-depth-dark text-[#FFF9EF] text-center space-y-2 animate-fade-in shadow-xl">
            <h3 className="text-base font-bold text-[#FFF9EF]">¡Acceso concedido!</h3>
            <p className="text-xs text-[#CBB082]">Entrando a tu espacio personal...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl card-depth-sm">
              <label htmlFor="email-input" className="block text-xs font-bold text-[#1D362D] mb-2">
                Tu correo electrónico
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#294C3F]" />
                <input
                  id="email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#FFF9EF] border border-[#294C3F]/25 text-sm font-semibold text-[#1D362D] focus:outline-none focus:border-[#294C3F] focus:ring-1 focus:ring-[#294C3F]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-[#294C3F] hover:bg-[#1D362D] text-[#FFF9EF] font-bold text-xs uppercase tracking-widest button-tactile flex items-center justify-center gap-2 border border-[#CBB082]/40"
            >
              <span>Acceder a PAUSA</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <button
            onClick={() => setCurrentView('onboarding')}
            className="text-xs font-bold text-[#294C3F] underline underline-offset-4 hover:text-[#1D362D]"
          >
            ¿Primera vez en PAUSA? Crear mi espacio personal
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="pt-4 border-t border-[#294C3F]/15 text-center">
        <p className="text-xs text-[#3B5B4D] font-medium flex items-center justify-center gap-1.5">
          <ShieldCheck size={14} className="text-[#294C3F]" />
          <span>Tus pausas se guardan de forma privada y segura.</span>
        </p>
      </footer>
    </div>
  );
};
