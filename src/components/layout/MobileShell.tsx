import React from 'react';
import { usePausa, AppView } from '../../context/PausaContext';
import { Home, Compass, Calendar, Award, User, Sparkles } from 'lucide-react';

interface MobileShellProps {
  children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  const { currentView, setCurrentView, activePause } = usePausa();

  // If in landing, onboarding, paywall, login, or during active pause, render full screen without app navigation bar
  const isStandalone =
    currentView === 'landing' ||
    currentView === 'onboarding' ||
    currentView === 'paywall' ||
    currentView === 'login' ||
    activePause !== null;

  if (isStandalone) {
    return (
      <div className="min-h-screen bg-[#FFF9EF] text-[#294C3F] flex flex-col justify-start">
        {children}
      </div>
    );
  }

  const navItems = [
    { id: 'home' as AppView, label: 'Inicio', icon: Home },
    { id: 'pausa_ahora' as AppView, label: 'Pausa Ahora', icon: Compass },
    { id: 'recorrido' as AppView, label: '14 Días', icon: Calendar },
    { id: 'logros' as AppView, label: 'Progreso', icon: Award },
    { id: 'perfil' as AppView, label: 'Perfil', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#1D362D] sm:py-6 flex justify-center selection:bg-[#527A68]/30 selection:text-[#FFF9EF]">
      {/* Container simulating high-end mobile experience with deep contrast frame */}
      <div className="w-full max-w-md min-h-screen bg-[#FFF9EF] text-[#1D362D] flex flex-col shadow-2xl relative border-x border-[#294C3F]/20">
        
        {/* Crisp High-Contrast Header */}
        <header className="sticky top-0 z-30 bg-[#FFF9EF]/95 backdrop-blur-md px-5 h-15 border-b border-[#294C3F]/15 flex items-center justify-between shadow-xs">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <span className="font-serif text-2xl font-bold tracking-tight text-[#294C3F] group-hover:text-[#1D362D] transition-colors">
              PAUSA
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#294C3F] font-bold bg-[#F3E9D8] px-2 py-0.5 rounded-full border border-[#294C3F]/20">
              2 MIN
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('paywall')}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#294C3F] text-[#FFF9EF] hover:bg-[#1D362D] active:scale-95 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles size={12} className="text-[#CBB082]" />
              <span>Membresía</span>
            </button>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 pb-24 px-5 pt-4 overflow-y-auto bg-[#FFF9EF]">
          {children}
        </main>

        {/* High-End Deep Forest Green Bottom Navigation Bar */}
        <nav
          aria-label="Navegación principal"
          className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-[#294C3F] border-t border-[#CBB082]/30 px-3 py-2 flex items-center justify-around shadow-2xl"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`min-w-[56px] min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'text-[#FFF9EF] font-bold'
                    : 'text-[#E6EDE9]/65 hover:text-[#FFF9EF]'
                }`}
              >
                <div
                  className={`relative p-1.5 rounded-xl transition-colors ${
                    isActive ? 'bg-white/15 text-[#CBB082]' : ''
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#CBB082]" />
                  )}
                </div>
                <span
                  className={`text-[10px] tracking-tight mt-0.5 ${
                    isActive ? 'text-[#FFF9EF] font-semibold' : 'text-[#E6EDE9]/75'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

      </div>
    </div>
  );
};
