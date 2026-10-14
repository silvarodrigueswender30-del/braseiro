import React, { useState, useEffect, useRef } from 'react';
import { siteConfig } from '@/config';

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const isTransparentMode = siteConfig.headerMode === 'transparent';

  // Aplica fundo sólido carvão após scroll > 80px com transição suave de 250ms
  useEffect(() => {
    if (!isTransparentMode) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isTransparentMode]);

  // Close on ESC and trap focus when drawer is open
  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      } else if (e.key === 'Tab') {
        if (!drawerRef.current) return;
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navItems = [
    { label: 'Início', href: '/#inicio' },
    { label: 'A Casa', href: '/#casa' },
    { label: 'O Fogo', href: '/#fogo' },
    { label: 'Pratos', href: '/#pratos' },
    { label: 'Eventos', href: '/#eventos' },
    { label: 'Ambiente', href: '/#ambiente' },
    { label: 'Cardápio', href: '/cardapio' },
    { label: 'Reservas', href: '/#contato-reservas' },
  ];

  // Header dynamic styling
  const headerPositionClass = isTransparentMode
    ? 'fixed top-0 left-0 right-0'
    : 'sticky top-0';

  const headerBackgroundStyle: React.CSSProperties = isTransparentMode
    ? isScrolled
      ? {
          backgroundColor: 'rgb(20, 16, 13)',
        }
      : {
          background: 'linear-gradient(180deg, rgba(5,7,13,0.70) 0%, rgba(5,7,13,0) 100%)',
        }
    : {
        backgroundColor: 'rgb(20, 16, 13)',
      };

  const shadowFilterStyle: React.CSSProperties = isTransparentMode && !isScrolled
    ? { filter: 'drop-shadow(0 1px 6px rgba(0,0,0,0.6))' }
    : {};

  return (
    <>
      <header
        className={`${headerPositionClass} z-[99] w-full px-5 h-[72px] md:h-[83px] transition-[background-color] duration-[250ms] ease-out ${
          isScrolled ? 'header-scrolled relative' : ''
        }`}
        style={headerBackgroundStyle}
      >
        <div className="w-full h-full max-w-[1360px] mx-auto flex items-center justify-between">
          {/* DESKTOP (>= 1180px): 3 colunas (grid 1fr auto 1fr com links inline e logo central) */}
          <div data-testid="desktop-nav" className="hidden min-[1180px]:grid w-full grid-cols-[1fr_auto_1fr] items-center">
            {/* Esquerda: A casa (#casa), O fogo (#fogo), Pratos (#pratos) */}
            <nav aria-label="Navegação Principal Esquerda" className="flex items-center justify-start gap-8">
              <a
                href="/#casa"
                className="font-text font-semibold uppercase tracking-[0.08em] text-[13px] xl:text-[14px] text-[#F5E6D0] hover:text-[#E8832A] transition-colors py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E8832A] rounded"
              >
                A CASA
              </a>
              <a
                href="/#fogo"
                className="font-text font-semibold uppercase tracking-[0.08em] text-[13px] xl:text-[14px] text-[#F5E6D0] hover:text-[#E8832A] transition-colors py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E8832A] rounded"
              >
                O FOGO
              </a>
              <a
                href="/#pratos"
                className="font-text font-semibold uppercase tracking-[0.08em] text-[13px] xl:text-[14px] text-[#F5E6D0] hover:text-[#E8832A] transition-colors py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E8832A] rounded"
              >
                PRATOS
              </a>
            </nav>

            {/* Centro: Logotipo Braseiro Caiçara */}
            <div className="flex items-center justify-center px-4" style={shadowFilterStyle}>
              <a
                href="/"
                className="group flex flex-col items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8832A] rounded py-1"
                aria-label="Braseiro Caiçara - Início"
              >
                <img
                  src="/images/logo/logo.webp"
                  alt="Braseiro Caiçara"
                  width={143}
                  height={56}
                  className="h-[50px] lg:h-[54px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="eager"
                  fetchPriority="high"
                />
              </a>
            </div>

            {/* Direita: Eventos (#eventos), Ambiente (#ambiente), Botão RESERVAR (#contato-reservas) */}
            <nav aria-label="Navegação Principal Direita" className="flex items-center justify-end gap-8">
              <a
                href="/#eventos"
                className="font-text font-semibold uppercase tracking-[0.08em] text-[13px] xl:text-[14px] text-[#F5E6D0] hover:text-[#E8832A] transition-colors py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E8832A] rounded"
              >
                EVENTOS
              </a>
              <a
                href="/#ambiente"
                className="font-text font-semibold uppercase tracking-[0.08em] text-[13px] xl:text-[14px] text-[#F5E6D0] hover:text-[#E8832A] transition-colors py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E8832A] rounded"
              >
                AMBIENTE
              </a>
              <a
                href="/#contato-reservas"
                className="inline-flex items-center justify-center font-text font-semibold uppercase tracking-[0.08em] text-[13px] xl:text-[14px] text-[#14100D] bg-[#E8832A] hover:bg-[#F5E6D0] px-6 py-2.5 rounded-[6px] transition-all duration-200 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8832A] select-none"
              >
                RESERVAR
              </a>
            </nav>
          </div>

          {/* TABLET E MOBILE (< 1180px): Logo à esquerda / Hambúrguer à direita */}
          <div className="flex min-[1180px]:hidden w-full items-center justify-between">
            {/* Esquerda: Logo */}
            <div className="flex items-center justify-start" style={shadowFilterStyle}>
              <a
                href="/"
                className="flex items-center justify-start focus:outline-none py-1"
                aria-label="Braseiro Caiçara - Início"
              >
                <img
                  src="/images/logo/logo-mobile.webp"
                  alt="Braseiro Caiçara"
                  width={112}
                  height={44}
                  className="h-[40px] sm:h-[44px] w-auto object-contain"
                  loading="eager"
                  fetchPriority="high"
                />
              </a>
            </div>

            {/* Direita: Botão Reserva Tablet + Botão Hambúrguer (alvo de toque >= 44x44px) */}
            <div className="flex items-center justify-end gap-3 sm:gap-4" style={shadowFilterStyle}>
              <a
                href="/#contato-reservas"
                className="hidden sm:inline-flex items-center justify-center font-text font-semibold uppercase tracking-[0.08em] text-[13px] text-[#14100D] bg-[#E8832A] hover:bg-[#F5E6D0] px-4 py-2 rounded-[6px] transition-all duration-200 shadow-sm select-none"
              >
                RESERVAR
              </a>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Abrir menu principal"
                className="p-1 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#E8832A] hover:scale-105 active:scale-95 transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E8832A] rounded-lg cursor-pointer"
              >
                <svg
                  viewBox="0 0 46 46"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="h-[36px] w-[36px]"
                  aria-hidden="true"
                >
                  <line x1="6" y1="12" x2="40" y2="12" />
                  <line x1="6" y1="23" x2="40" y2="23" />
                  <line x1="6" y1="34" x2="40" y2="34" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* GAVETA / MODAL MENU EM TELA CHEIA */}
      {menuOpen && (
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de Navegação"
          className="fixed inset-0 z-[100] bg-[#05070D] flex flex-col justify-between p-6 sm:p-10 animate-in fade-in duration-300"
          style={{ backgroundColor: '#05070D' }}
        >
          {/* Top Bar with Close Button */}
          <div className="flex items-center justify-between w-full border-b border-[#F3E6D0]/10 pb-4">
            <a href="/" onClick={() => setMenuOpen(false)} aria-label="Braseiro Caiçara">
              <img
                src="/images/logo/logo.webp"
                alt="Braseiro Caiçara"
                width={143}
                height={56}
                className="h-[44px] sm:h-[48px] w-auto object-contain"
              />
            </a>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Fechar menu"
              className="p-2 text-[#D9741C] hover:scale-110 active:scale-110 transition-transform duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D9741C] rounded-lg"
            >
              <svg
                viewBox="0 0 46 46"
                fill="none"
                stroke="#D9741C"
                strokeWidth="4"
                strokeLinecap="round"
                className="h-[36px] w-[36px]"
                aria-hidden="true"
              >
                <line x1="10" y1="10" x2="36" y2="36" />
                <line x1="36" y1="10" x2="10" y2="36" />
              </svg>
            </button>
          </div>

          {/* Nav Links com Fraunces 700, 2rem a 3rem, capitalizado, itálico no hover */}
          <nav className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 my-auto">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-display font-bold text-[2rem] sm:text-[2.6rem] md:text-[3rem] text-[#F3E6D0] hover:text-[#E8832A] hover:italic active:italic transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D9741C] rounded px-4 py-1"
                style={{
                  fontVariationSettings: '"SOFT" 100, "WONK" 1',
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Bottom WhatsApp CTA in Drawer */}
          <div className="w-full flex flex-col items-center justify-center pt-4 border-t border-[#F3E6D0]/10">
            <a
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="w-full sm:w-auto text-center font-ui font-semibold uppercase text-[#1A1411] bg-[#D9741C] hover:bg-[#F3E6D0] text-xl px-8 py-3 rounded-[8px] transition-colors duration-300"
              style={{ backgroundColor: '#D9741C', color: '#1A1411' }}
            >
              RESERVAR PELO WHATSAPP
            </a>
            <span className="font-sans text-xs text-[#F3E6D0]/60 mt-3">
              {siteConfig.hoursShort}
            </span>
          </div>
        </div>
      )}
    </>
  );
};
