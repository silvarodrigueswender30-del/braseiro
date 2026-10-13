import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BookOpen } from 'lucide-react';
import { gsap } from 'gsap';
import { siteConfig } from '@/config';

export const AtalhosDock: React.FC = () => {
  const dockRef = useRef<HTMLDivElement>(null);
  const [shouldShow, setShouldShow] = useState(false);

  // Estados de controle de visibilidade
  const [heroCtaOut, setHeroCtaOut] = useState(false);
  const [reservasVisible, setReservasVisible] = useState(false);
  const [rodapeVisible, setRodapeVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const phoneRaw = siteConfig.phoneRaw?.trim();
  const isPhoneValid = Boolean(
    phoneRaw &&
    !phoneRaw.includes('99999') &&
    !phoneRaw.includes('TODO') &&
    phoneRaw.length >= 10
  );

  const whatsappText = encodeURIComponent(
    'Olá! Vim pelo site do Braseiro Caiçara e gostaria de falar com o restaurante.'
  );
  const whatsappUrl = `https://wa.me/${phoneRaw}?text=${whatsappText}`;

  // 1. Observer do botão da hero ("RESERVAR MINHA MESA" / "RESERVAR")
  useEffect(() => {
    const heroCtas = document.querySelectorAll<HTMLElement>('[data-hero-cta="true"]');
    if (!heroCtas.length) {
      // Fallback: se não achar pelo atributo, procura pelos botões no hero
      const heroSection = document.getElementById('inicio') || document.querySelector('section');
      if (!heroSection) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          setHeroCtaOut(!entry.isIntersecting);
        },
        { threshold: 0.1 }
      );
      observer.observe(heroSection);
      return () => observer.disconnect();
    }

    const ctaObserver = new IntersectionObserver(
      (entries) => {
        // Se pelo menos um botão da hero estiver visível, heroCtaOut = false
        const anyVisible = entries.some((entry) => entry.isIntersecting);
        setHeroCtaOut(!anyVisible);
      },
      { threshold: 0.05 }
    );

    heroCtas.forEach((el) => ctaObserver.observe(el));
    return () => ctaObserver.disconnect();
  }, []);

  // 2. Observer das seções "Como chegar e reservas" (#contato-reservas) e rodapé (#rodape)
  // Oculta enquanto qualquer uma estiver >= 20% visível
  useEffect(() => {
    const sectionReservas = document.getElementById('contato-reservas');
    const sectionRodape = document.getElementById('rodape');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id === 'contato-reservas') {
            setReservasVisible(entry.isIntersecting && entry.intersectionRatio >= 0.2);
          }
          if (entry.target.id === 'rodape') {
            setRodapeVisible(entry.isIntersecting && entry.intersectionRatio >= 0.2);
          }
        });
      },
      { threshold: [0, 0.15, 0.2, 0.3, 0.5] }
    );

    if (sectionReservas) observer.observe(sectionReservas);
    if (sectionRodape) observer.observe(sectionRodape);

    return () => observer.disconnect();
  }, []);

  // 3. Monitorar drawer de menu aberto (MutationObserver em document.body)
  useEffect(() => {
    const checkMenuOpen = () => {
      const dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
      const navDialog = document.querySelector('[aria-label="Menu de Navegação"]');
      setMenuOpen(Boolean(dialog || navDialog));
    };

    const observer = new MutationObserver(checkMenuOpen);
    observer.observe(document.body, { childList: true, subtree: true });
    checkMenuOpen();

    return () => observer.disconnect();
  }, []);

  // 4. Monitorar inputs em foco (focusin / focusout)
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        setInputFocused(true);
      }
    };

    const handleFocusOut = () => {
      setInputFocused(false);
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  // 5. Cálculo consolidado de visibilidade
  useEffect(() => {
    const isVisible = heroCtaOut && !reservasVisible && !rodapeVisible && !menuOpen && !inputFocused;
    setShouldShow(isVisible);
  }, [heroCtaOut, reservasVisible, rodapeVisible, menuOpen, inputFocused]);

  // 6. ResizeObserver para publicar --dock-h no root
  useEffect(() => {
    const dockEl = dockRef.current;
    if (!dockEl) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
        if (height > 0) {
          document.documentElement.style.setProperty('--dock-h', `${Math.round(height)}px`);
        }
      }
    });

    ro.observe(dockEl);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty('--dock-h');
    };
  }, []);

  // 7. Animação de Entrada e Saída com GSAP (regras da Apple: mesmo caminho, espelhado, overwrite auto)
  useEffect(() => {
    const dockEl = dockRef.current;
    if (!dockEl) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (shouldShow) {
      dockEl.style.visibility = 'visible';
      dockEl.removeAttribute('inert');

      if (reducedMotion) {
        gsap.to(dockEl, {
          opacity: 1,
          duration: 0.2,
          overwrite: 'auto',
        });
      } else {
        gsap.to(dockEl, {
          y: 0,
          opacity: 1,
          duration: 0.45,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
    } else {
      dockEl.setAttribute('inert', '');

      if (reducedMotion) {
        gsap.to(dockEl, {
          opacity: 0,
          duration: 0.2,
          overwrite: 'auto',
          onComplete: () => {
            if (!shouldShow) {
              dockEl.style.visibility = 'hidden';
            }
          },
        });
      } else {
        gsap.to(dockEl, {
          y: '120%',
          opacity: 0,
          duration: 0.3,
          ease: 'power3.in',
          overwrite: 'auto',
          onComplete: () => {
            if (!shouldShow) {
              dockEl.style.visibility = 'hidden';
            }
          },
        });
      }
    }
  }, [shouldShow]);

  // Smooth scroll até #pratos
  const handleScrollToMenu = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const dishesSection = document.getElementById('pratos');
    if (dishesSection) {
      dishesSection.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', '#pratos');
    }
  }, []);

  return (
    <>
      <div
        ref={dockRef}
        role="group"
        aria-label="Atalhos de contato"
        inert
        style={{
          visibility: 'hidden',
          opacity: 0,
          transform: 'translateY(120%)',
          willChange: 'transform, opacity',
        }}
        className="fixed z-40 left-0 right-0 bottom-0 bg-[#14100D]/[0.96] border-t border-[#F5E6D0]/[0.14] px-3 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom,0px))] grid grid-cols-[1fr_1.3fr] gap-2.5 shadow-2xl lg:left-auto lg:right-6 lg:bottom-6 lg:w-auto lg:flex lg:h-[52px] lg:p-[6px] lg:gap-1.5 lg:rounded-[6px] lg:border lg:border-[#F5E6D0]/[0.14] lg:shadow-[0_12px_36px_rgba(0,0,0,0.6)] dock-container"
      >
        {/* 1) CARDÁPIO */}
        <a
          href="#pratos"
          onClick={handleScrollToMenu}
          className="dock-btn group flex items-center justify-center gap-2 h-12 lg:h-full px-3 lg:px-5 rounded-[6px] lg:rounded-[4px] border-[1.5px] border-[#F5E6D0]/55 bg-transparent text-[#F5E6D0] hover:bg-[#F5E6D0]/10 hover:border-[#F5E6D0]/80 transition-colors select-none"
          style={{
            fontFamily: 'var(--font-ui, "Instrument Sans", sans-serif)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            fontSize: '0.8125rem',
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          <BookOpen className="w-[18px] h-[18px] shrink-0 text-[#F5E6D0]" aria-hidden="true" />
          <span>Cardápio</span>
        </a>

        {/* 2) FALAR COM A GENTE */}
        {isPhoneValid && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar com o restaurante pelo WhatsApp"
            className="dock-btn group flex items-center justify-center gap-2 h-12 lg:h-full px-3 lg:px-5 rounded-[6px] lg:rounded-[4px] bg-[#E8832A] text-[#14100D] hover:bg-[#F5E6D0] transition-colors select-none"
            style={{
              fontFamily: 'var(--font-ui, "Instrument Sans", sans-serif)',
              fontWeight: 600,
              letterSpacing: '0.06em',
              fontSize: '0.8125rem',
              lineHeight: 1,
              textTransform: 'uppercase',
            }}
          >
            {/* Ícone de WhatsApp (marca SVG com currentColor) */}
            <svg
              className="w-[18px] h-[18px] shrink-0 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.07l-.29-.16-3.02.79.81-2.95-.19-.3a8.217 8.217 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.5 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.65.81-.8 1-.15.19-.3.21-.55.08-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.41.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.53.61.2 1.16.17 1.6.11.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28z" />
            </svg>
            <span>Falar com a gente</span>
          </a>
        )}
      </div>

      <style>{`
        .dock-btn {
          min-height: 48px;
          outline: none;
        }
        .dock-btn:active {
          transform: scale(0.97);
          transition: transform 100ms ease-out;
        }
        .dock-btn:focus-visible {
          outline: 2px solid #E8832A;
          outline-offset: 3px;
        }
        @media (prefers-contrast: more) {
          .dock-container {
            border-color: #F5E6D0 !important;
          }
          .dock-btn {
            border-color: #F5E6D0 !important;
          }
        }
      `}</style>
    </>
  );
};

export default AtalhosDock;
