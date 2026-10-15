import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CalendarCheck } from 'lucide-react';
import { gsap } from 'gsap';
import { useReservationModal } from '@/context/ReservationModalContext';

export const AtalhosDock: React.FC = () => {
  const dockRef = useRef<HTMLDivElement>(null);
  const [shouldShow, setShouldShow] = useState(false);
  const { isOpen: isModalOpen, openReservationModal } = useReservationModal();

  // Estados de controle de visibilidade
  const [heroCtaOut, setHeroCtaOut] = useState(false);
  const [reservasVisible, setReservasVisible] = useState(false);
  const [rodapeVisible, setRodapeVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

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
  // Oculta assim que a seção atingir a zona do dock (rootMargin negativo na base e threshold 0)
  useEffect(() => {
    let observedReservas: Element | null = null;
    let observedRodape: Element | null = null;

    const dockHeight = dockRef.current?.offsetHeight || 72;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id === 'contato-reservas') {
            setReservasVisible(entry.isIntersecting);
          }
          if (entry.target.id === 'rodape') {
            setRodapeVisible(entry.isIntersecting);
          }
        });
      },
      {
        rootMargin: `0px 0px -${dockHeight}px 0px`,
        threshold: 0,
      }
    );

    const updateVisibility = () => {
      const vh = window.innerHeight;
      const dockH = dockRef.current?.offsetHeight || 72;
      const limitY = vh - dockH;

      const secRes = document.getElementById('contato-reservas');
      const secRod = document.getElementById('rodape');

      if (secRes) {
        const r = secRes.getBoundingClientRect();
        setReservasVisible(r.top <= limitY && r.bottom >= 0);
        if (secRes !== observedReservas) {
          if (observedReservas) observer.unobserve(observedReservas);
          observer.observe(secRes);
          observedReservas = secRes;
        }
      }

      if (secRod) {
        const r = secRod.getBoundingClientRect();
        setRodapeVisible(r.top <= limitY && r.bottom >= 0);
        if (secRod !== observedRodape) {
          if (observedRodape) observer.unobserve(observedRodape);
          observer.observe(secRod);
          observedRodape = secRod;
        }
      }
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateVisibility);
    };
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

  // 5. Cálculo consolidado de visibilidade (oculta se o modal de reserva estiver aberto)
  useEffect(() => {
    const isVisible = heroCtaOut && !reservasVisible && !rodapeVisible && !menuOpen && !inputFocused && !isModalOpen;
    setShouldShow(isVisible);
  }, [heroCtaOut, reservasVisible, rodapeVisible, menuOpen, inputFocused, isModalOpen]);

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

  return (
    <>
      <div
        ref={dockRef}
        role="group"
        aria-label="Atalhos rápidos"
        inert
        style={{
          visibility: 'hidden',
          opacity: 0,
          transform: 'translateY(120%)',
          willChange: 'transform, opacity',
        }}
        className="fixed z-40 left-0 right-0 bottom-0 bg-[#14100D]/[0.96] border-t border-[#F5E6D0]/[0.14] px-3 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom,0px))] grid grid-cols-[1fr_1.3fr] gap-2.5 shadow-2xl lg:left-auto lg:right-6 lg:bottom-6 lg:w-auto lg:flex lg:h-[52px] lg:p-[6px] lg:gap-1.5 lg:rounded-[6px] lg:border lg:border-[#F5E6D0]/[0.14] lg:shadow-[0_12px_36px_rgba(0,0,0,0.6)] dock-container"
      >
        {/* 1) CARDÁPIO NATIVO (Link para rota interna do cardápio) */}
        <Link
          to="/cardapio"
          className="dock-btn group flex items-center justify-center gap-2 h-12 lg:h-full px-3 lg:px-5 rounded-[6px] border-[1.5px] border-[#F5E6D0]/55 bg-transparent text-[#F5E6D0] hover:bg-[#F5E6D0]/10 hover:border-[#F5E6D0]/80 transition-colors select-none"
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
        </Link>

        {/* 2) RESERVAR MESA (Abre o diálogo de triagem com ícone CalendarCheck) */}
        <a
          href="#contato-reservas"
          onClick={(e) => {
            e.preventDefault();
            openReservationModal();
          }}
          aria-label="Reservar mesa no restaurante"
          className="dock-btn group flex items-center justify-center gap-2 h-12 lg:h-full px-3 lg:px-5 rounded-[6px] bg-[#E8832A] text-[#14100D] hover:bg-[#F5E6D0] transition-colors select-none cursor-pointer"
          style={{
            fontFamily: 'var(--font-ui, "Instrument Sans", sans-serif)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            fontSize: '0.8125rem',
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          <CalendarCheck className="w-[18px] h-[18px] shrink-0 text-[#14100D]" aria-hidden="true" />
          <span>RESERVAR MESA</span>
        </a>
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
