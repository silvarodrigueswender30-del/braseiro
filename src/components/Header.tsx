import React, { useState, useEffect, useRef } from 'react';
import { siteConfig } from '@/config';

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const isTransparentMode = siteConfig.headerMode === 'transparent';

  // IntersectionObserver on #hero-sentinel to switch from transparent to solid without scroll listeners
  useEffect(() => {
    if (!isTransparentMode) {
      setIsPastHero(true);
      return;
    }

    const checkSentinel = () => {
      const sentinel = document.getElementById('hero-sentinel');
      if (!sentinel) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          // When sentinel is above viewport, hero has been scrolled past
          const past = entry.boundingClientRect.top < 0 && !entry.isIntersecting;
          setIsPastHero(past);
        },
        { rootMargin: '-72px 0px 0px 0px', threshold: 0 }
      );

      observer.observe(sentinel);
      return observer;
    };

    // Retry finding sentinel if it renders slightly asynchronously
    const observer = checkSentinel();
    return () => observer?.disconnect();
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
    { label: 'Cardápio', href: '/cardapio' },
    { label: 'A Casa', href: '/#casa' },
    { label: 'Ambiente', href: '/#ambiente' },
    { label: 'Eventos', href: '/#eventos' },
    { label: 'Contato', href: '/#contato' },
  ];

  // Header dynamic styling
  const headerPositionClass = isTransparentMode
    ? 'fixed top-0 left-0 right-0'
    : 'sticky top-0';

  const headerBackgroundStyle: React.CSSProperties = isTransparentMode
    ? isPastHero
      ? {
          backgroundColor: 'rgba(5, 7, 13, 0.92)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(243, 230, 208, 0.08)',
        }
      : {
          background: 'linear-gradient(180deg, rgba(5,7,13,0.70) 0%, rgba(5,7,13,0) 100%)',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          borderBottom: '1px solid transparent',
        }
    : {
        backgroundColor: '#05070D',
        borderBottom: '1px solid transparent',
      };

  const shadowFilterStyle: React.CSSProperties = isTransparentMode && !isPastHero
    ? { filter: 'drop-shadow(0 1px 6px rgba(0,0,0,0.6))' }
    : {};

  return (
    <>
      <header
        className={`${headerPositionClass} z-[99] w-full px-5 h-[72px] md:h-[83px] transition-[background,backdrop-filter,border-color] duration-300 ease-out`}
        style={headerBackgroundStyle}
      >
        <div className="w-full h-full flex items-center justify-between">
          {/* DESKTOP & TABLET: 3 colunas iguais (33.3%) */}
          <div className="hidden md:flex w-full items-center justify-between">
            {/* Esquerda: Botão RESERVAR (33.3%) */}
            <div className="w-1/3 flex items-center justify-start">
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-ui font-semibold uppercase tracking-[0.08em] text-[13px] lg:text-[14px] text-[#1A1411] bg-[#D9741C] hover:bg-[#F3E6D0] hover:-translate-y-1 active:-translate-y-1 px-6 py-2.5 rounded-[8px] border-none shadow-sm transition-all duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9741C]"
                style={{ backgroundColor: '#D9741C', color: '#1A1411' }}
              >
                RESERVAR
              </a>
            </div>

            {/* Centro: Logotipo centralizado (33.3%) */}
            <div className="w-1/3 flex items-center justify-center" style={shadowFilterStyle}>
              <a
                href="/"
                className="group flex flex-col items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9741C] rounded py-1"
                aria-label="Braseiro Caiçara - Início"
              >
                <img
                  src="/images/logo/logo.webp"
                  alt="Braseiro Caiçara"
                  width={143}
                  height={56}
                  className="h-[52px] lg:h-[56px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="eager"
                  fetchPriority="high"
                />
              </a>
            </div>

            {/* Direita: Ícone Hambúrguer (33.3%) */}
            <div className="w-1/3 flex items-center justify-end" style={shadowFilterStyle}>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Abrir menu principal"
                className="p-1 text-[#D9741C] hover:scale-110 active:scale-110 transition-transform duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D9741C] rounded-lg"
              >
                <svg
                  viewBox="0 0 46 46"
                  fill="none"
                  stroke="#D9741C"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="h-[46px] w-[46px]"
                  aria-hidden="true"
                >
                  <line x1="6" y1="12" x2="40" y2="12" />
                  <line x1="6" y1="23" x2="40" y2="23" />
                  <line x1="6" y1="34" x2="40" y2="34" />
                </svg>
              </button>
            </div>
          </div>

          {/* MOBILE (<=767px): 2 colunas (Logo à esquerda / Menu à direita) */}
          <div className="flex md:hidden w-full items-center justify-between">
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

            {/* Direita: Hambúrguer */}
            <div className="flex items-center justify-end" style={shadowFilterStyle}>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Abrir menu principal"
                className="p-1 text-[#D9741C] hover:scale-110 active:scale-110 transition-transform duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D9741C] rounded-lg"
              >
                <svg
                  viewBox="0 0 46 46"
                  fill="none"
                  stroke="#D9741C"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="h-[42px] w-[42px]"
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
