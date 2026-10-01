import React, { useState, useRef } from 'react';
import { usePausa, AppView } from '../../context/PausaContext';
import { Home, Compass, Calendar, Award, User, Sparkles, Camera, Trash2 } from 'lucide-react';

interface MobileShellProps {
  children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  const {
    currentView,
    setCurrentView,
    activePause,
    userProfile,
    uploadAvatar,
    removeAvatar,
  } = usePausa();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen.');
      return;
    }

    try {
      setIsUploading(true);
      await uploadAvatar(file);
    } catch (err) {
      console.warn('Error al guardar foto:', err);
    } finally {
      setIsUploading(false);
      setShowAvatarMenu(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = async () => {
    try {
      await removeAvatar();
    } catch (err) {
      console.warn('Error al eliminar foto:', err);
    } finally {
      setShowAvatarMenu(false);
    }
  };

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
        
        {/* Crisp High-Contrast Header with Soft Depth */}
        <header className="sticky top-0 z-30 bg-[#FFF9EF]/95 backdrop-blur-md px-4 sm:px-5 h-16 border-b border-[#294C3F]/12 flex items-center justify-between shadow-[0_4px_16px_rgba(41,76,63,0.04)]">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group py-1"
            aria-label="Ir a inicio de PAUSA"
          >
            <img
              src="/logo-pausa.png"
              alt="Logo PAUSA"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-contain shadow-xs border border-[#294C3F]/15 shrink-0 bg-[#FFF9EF]"
              referrerPolicy="no-referrer"
            />
            <div className="flex items-center gap-2">
              <span className="font-serif text-[26px] sm:text-2xl font-bold tracking-tight text-[#294C3F] group-hover:text-[#1D362D] transition-colors leading-none">
                PAUSA
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#294C3F] font-bold bg-[#F3E9D8] px-2 py-0.5 rounded-full border border-[#294C3F]/20 hidden xs:inline-block">
                2 MIN
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => setCurrentView('paywall')}
              className="text-xs font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-[#294C3F] text-[#FFF9EF] hover:bg-[#1D362D] active:scale-95 transition-all flex items-center gap-1.5 button-tactile"
            >
              <Sparkles size={12} className="text-[#CBB082]" />
              <span>Membresía</span>
            </button>

            {/* Hidden file input to pick photo from device */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="header-avatar-file-input"
            />

            {/* Discreet circular profile photo avatar */}
            <button
              type="button"
              onClick={() => setShowAvatarMenu((prev) => !prev)}
              aria-label={userProfile?.avatar_url ? 'Foto de perfil (pulsar para opciones)' : 'Agregar foto de perfil'}
              title={userProfile?.avatar_url ? 'Foto de perfil' : 'Agregar foto'}
              className="w-9 h-9 rounded-full overflow-hidden border border-[#294C3F]/25 flex items-center justify-center bg-[#F3E9D8] text-[#294C3F] hover:opacity-90 active:scale-95 transition-all shrink-0 shadow-xs button-tactile-light focus:outline-none focus:ring-1 focus:ring-[#294C3F]"
            >
              {isUploading ? (
                <div className="w-3.5 h-3.5 border-2 border-[#294C3F] border-t-transparent rounded-full animate-spin" />
              ) : userProfile?.avatar_url ? (
                <img
                  src={userProfile.avatar_url}
                  alt={userProfile.name ? `Foto de ${userProfile.name}` : 'Foto de perfil'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={16} className="text-[#294C3F]/70" />
              )}
            </button>

            {/* Small menu popover to add, change, or remove profile photo */}
            {showAvatarMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowAvatarMenu(false)}
                />
                <div className="absolute right-0 top-12 z-50 card-depth-md rounded-2xl p-1.5 w-44 animate-fade-in text-[#1D362D]">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAvatarMenu(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#1D362D] hover:bg-[#F3E9D8] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Camera size={14} className="text-[#CBB082]" />
                    <span>{userProfile?.avatar_url ? 'Cambiar foto' : 'Agregar foto'}</span>
                  </button>

                  {userProfile?.avatar_url && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#8C3A24] hover:bg-[#F3E9D8] flex items-center gap-2 transition-colors border-t border-[#294C3F]/10 mt-1 pt-1.5 cursor-pointer"
                    >
                      <Trash2 size={14} />
                      <span>Eliminar foto</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 pb-24 px-4 sm:px-5 pt-4 overflow-y-auto bg-[#FFF9EF]">
          {children}
        </main>

        {/* High-End Deep Forest Green Bottom Navigation Bar with Depth */}
        <nav
          aria-label="Navegación principal"
          className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-gradient-to-t from-[#1D362D] to-[#294C3F] border-t border-[#CBB082]/35 px-3 py-2 flex items-center justify-around shadow-[0_-10px_35px_rgba(29,54,45,0.35)]"
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
