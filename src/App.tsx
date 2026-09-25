import React from 'react';
import { PausaProvider, usePausa } from './context/PausaContext';
import { MobileShell } from './components/layout/MobileShell';
import { LandingView } from './components/views/LandingView';
import { OnboardingView } from './components/views/OnboardingView';
import { HomeView } from './components/views/HomeView';
import { PausaAhoraView } from './components/views/PausaAhoraView';
import { RecorridoView } from './components/views/RecorridoView';
import { LogrosView } from './components/views/LogrosView';
import { PerfilView } from './components/views/PerfilView';
import { PaywallView } from './components/views/PaywallView';
import { LoginView } from './components/views/LoginView';
import { ActivePausePlayer } from './components/player/ActivePausePlayer';

const MainNavigator: React.FC = () => {
  const { currentView, activePause, userProfile, resetToNewUser } = usePausa();

  return (
    <>
      {/* Temporary Dev/Testing Tool to test new user flow */}
      <div className="fixed bottom-3 right-3 z-50 pointer-events-auto">
        <button
          type="button"
          onClick={resetToNewUser}
          className="px-3 py-1.5 rounded-full bg-[#1D362D] text-[#CBB082] hover:bg-[#294C3F] border border-[#CBB082]/60 shadow-2xl text-[10px] font-mono font-bold tracking-tight active:scale-95 transition-all flex items-center gap-1.5"
          title="Herramienta temporal para restablecer la app al estado de nueva usuaria"
        >
          <span>🧪</span>
          <span>REINICIAR PRUEBA — NUEVA USUARIA</span>
        </button>
      </div>

      {/* Active 2-Minute Pause Player Modal */}
      {activePause && <ActivePausePlayer />}

      {/* Screen Routing */}
      {(() => {
        // Enforce: New users cannot access internal app screens without completing onboarding
        const isInternalAppScreen = ['home', 'pausa_ahora', 'recorrido', 'logros', 'perfil'].includes(currentView);
        if (isInternalAppScreen && !userProfile.isOnboarded) {
          return <OnboardingView />;
        }

        switch (currentView) {
          case 'landing':
            return <LandingView />;
          case 'onboarding':
            return <OnboardingView />;
          case 'paywall':
            return <PaywallView />;
          case 'login':
            return <LoginView />;
          case 'home':
            return (
              <MobileShell>
                <HomeView />
              </MobileShell>
            );
          case 'pausa_ahora':
            return (
              <MobileShell>
                <PausaAhoraView />
              </MobileShell>
            );
          case 'recorrido':
            return (
              <MobileShell>
                <RecorridoView />
              </MobileShell>
            );
          case 'logros':
            return (
              <MobileShell>
                <LogrosView />
              </MobileShell>
            );
          case 'perfil':
            return (
              <MobileShell>
                <PerfilView />
              </MobileShell>
            );
          default:
            return (
              <MobileShell>
                <HomeView />
              </MobileShell>
            );
        }
      })()}
    </>
  );
};

export default function App() {
  return (
    <PausaProvider>
      <MainNavigator />
    </PausaProvider>
  );
}
