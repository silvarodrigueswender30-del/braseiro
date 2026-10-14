import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * CONFIGURAÇÃO CENTRALIZADA DOS DIFERENCIAIS (Único ponto de edição)
 * TODO: confirmar com o restaurante: lenha de eucalipto e carvão vegetal, pescadores artesanais de Ubatuba, elementos de canoa caiçara, entrega diária
 * TODO: trocar pelas fotos/vídeos definitivos
 */
export interface DiferencialItem {
  id: string;
  numero: string;
  palavra: string;
  titulo: string;
  texto: string;
  media: {
    desktopSrc: string;
    mobileSrc: string;
    poster: string;
    alt: string;
    video?: string;
  };
}

export const DIFERENCIAIS: readonly DiferencialItem[] = [
  {
    id: 'brasa',
    numero: '01',
    palavra: 'brasa',
    titulo: 'BRASA DE VERDADE',
    texto:
      'Sem atalhos de gás. Fogo lento alimentado com lenha de eucalipto e carvão vegetal que garantem a crosta caramelizada perfeita.',
    media: {
      desktopSrc: '/images/diferenciais/brasa-desktop.webp',
      mobileSrc: '/images/diferenciais/brasa-mobile.webp',
      poster: '/images/diferenciais/brasa-mobile.webp',
      alt: 'Brasa viva e lenha incandescente na parrilla',
    },
  },
  {
    id: 'mar',
    numero: '02',
    palavra: 'mar',
    titulo: 'MAR NA MESA',
    texto:
      'Pescadores artesanais de Ubatuba entregando peixes frescos, polvos e camarões diariamente direto na nossa cozinha de praia.',
    media: {
      desktopSrc: '/images/diferenciais/mar-desktop.webp',
      mobileSrc: '/images/diferenciais/mar-mobile.webp',
      poster: '/images/diferenciais/mar-mobile.webp',
      alt: 'Polvo e camarões frescos da costa de Ubatuba',
    },
  },
  {
    id: 'mata',
    numero: '03',
    palavra: 'mata',
    titulo: 'CASA NA MATA',
    texto:
      'Construção rústica com elementos de canoa caiçara, tijolo aparente e ventilação natural que abraça o clima de Ubatuba.',
    media: {
      desktopSrc: '/images/diferenciais/mata-desktop.webp',
      mobileSrc: '/images/diferenciais/mata-mobile.webp',
      poster: '/images/diferenciais/mata-mobile.webp',
      alt: 'Varanda rústica acolhedora em meio à vegetação nativa',
    },
  },
  {
    id: 'mesa',
    numero: '04',
    palavra: 'mesa',
    titulo: 'MESA DE GRUPO',
    texto:
      'Aqui ninguém come com pressa. Bancadas e mesas generosas pensadas para abrir vinho, dividir travessas e celebrar a vida.',
    media: {
      desktopSrc: '/images/diferenciais/mesa-desktop.webp',
      mobileSrc: '/images/diferenciais/mesa-mobile.webp',
      poster: '/images/diferenciais/mesa-mobile.webp',
      alt: 'Celebração e brinde à mesa no salão acolhedor',
    },
  },
] as const;

/**
 * TEXTOS E ELEMENTOS ANTERIORES REMOVIDOS (PRESERVADOS PARA REFERÊNCIA):
 * - Título anterior: "Por que o fogo é diferente" (font-condensed uppercase 3xl sm:5xl text-[#F3E6D0])
 * - Frase em itálico: "“Não é técnica importada: é respeito pelo produto, pelo tempo e pela nossa terra.”"
 * - Divisor com losango e chama (<Divider variant="flame" />)
 * - 4 cards com borda e radius, ícones em círculo (Flame, Anchor, Trees, Users)
 * - Pílulas de categoria/tagline ("Lenha & Carvão Nobre", "Pescados da Costa", "Madeira, Brisa & Alma", "Partilha & Celebração")
 */

export const FeaturesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Título e máscaras
  const titleLine1WrapperRef = useRef<HTMLSpanElement>(null);
  const titleLine1InnerRef = useRef<HTMLSpanElement>(null);
  const titleLine2WrapperRef = useRef<HTMLSpanElement>(null);
  const titleLine2InnerRef = useRef<HTMLSpanElement>(null);

  // Painéis Desktop
  const desktopContainerRef = useRef<HTMLUListElement>(null);
  const desktopPanelRefs = useRef<(HTMLLIElement | null)[]>([]);
  const desktopVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Mobile Accordion
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const mobileItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Estados de ativação
  const [activeDesktopIdx, setActiveDesktopIdx] = useState<number>(0);
  const [activeMobileIdx, setActiveMobileIdx] = useState<number>(0);

  // Interação do usuário para pausar avanço automático
  const [userInteracted, setUserInteracted] = useState<boolean>(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollYRef = useRef<number>(0);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // 1) AVANÇO AUTOMÁTICO DESKTOP A CADA 5s (PAUSA NA PRIMEIRA INTERAÇÃO)
  useEffect(() => {
    if (prefersReducedMotion || userInteracted) return;

    let timer: NodeJS.Timeout | null = null;
    let isVisible40 = false;
    let isDocVisible = !document.hidden;

    const startTimer = () => {
      if (timer) clearInterval(timer);
      if (isVisible40 && isDocVisible && !userInteracted) {
        timer = setInterval(() => {
          setActiveDesktopIdx((prev) => (prev + 1) % DIFERENCIAIS.length);
        }, 5000);
      }
    };

    const stopTimer = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible40 = entry.isIntersecting;
        if (isVisible40) startTimer();
        else stopTimer();
      },
      { threshold: 0.4 }
    );
    observer.observe(sectionEl);

    const handleVisibility = () => {
      isDocVisible = !document.hidden;
      if (isDocVisible && isVisible40) startTimer();
      else stopTimer();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopTimer();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [prefersReducedMotion, userInteracted]);

  // Resposta imediata (< 50ms) com histerese de 24px para evitar trocas acidentais na rolagem
  const handleMouseEnterPanel = (idx: number) => {
    if (window.matchMedia('(pointer: fine)').matches) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      const scrollDiff = Math.abs(window.scrollY - lastScrollYRef.current);
      lastScrollYRef.current = window.scrollY;
      if (scrollDiff > 24) {
        return;
      }
      setUserInteracted(true);
      setActiveDesktopIdx(idx);
    }
  };

  const handleMouseLeavePanel = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleClickPanel = (idx: number) => {
    setUserInteracted(true);
    setActiveDesktopIdx(idx);
  };

  // Navegação por teclado nas setas esquerda/direita
  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setUserInteracted(true);
      setActiveDesktopIdx((prev) => (prev + 1) % DIFERENCIAIS.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setUserInteracted(true);
      setActiveDesktopIdx((prev) => (prev - 1 + DIFERENCIAIS.length) % DIFERENCIAIS.length);
    }
  };

  // Mobile Accordion toggle
  const toggleMobileAccordion = (idx: number) => {
    setActiveMobileIdx((prev) => (prev === idx ? -1 : idx));
    // Scroll suave se o item aberto ficar parcialmente fora da tela
    setTimeout(() => {
      const itemEl = mobileItemRefs.current[idx];
      if (itemEl && activeMobileIdx !== idx) {
        itemEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 150);
  };

  // Controle de vídeos (se houver mídia de vídeo configurada)
  useEffect(() => {
    desktopVideoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (activeDesktopIdx === idx) {
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });

    mobileVideoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (activeMobileIdx === idx) {
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, [activeDesktopIdx, activeMobileIdx]);

  // 2) ANIMAÇÕES GSAP (SCROLLTRIGGER)
  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Timeline do Título (Linha 1 e Linha 2)
      const titleTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
        onComplete: () => {
          if (titleLine1WrapperRef.current) titleLine1WrapperRef.current.style.overflow = 'visible';
          if (titleLine2WrapperRef.current) titleLine2WrapperRef.current.style.overflow = 'visible';
        },
      });

      // Linha 1: "POR QUE O FOGO É"
      if (titleLine1InnerRef.current) {
        titleTl.fromTo(
          titleLine1InnerRef.current,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.75, ease: 'power3.out' }
        );
      }

      // Linha 2: "diferente" (entra por último com scale 0.94 -> 1)
      if (titleLine2InnerRef.current) {
        titleTl.fromTo(
          titleLine2InnerRef.current,
          { yPercent: 100, scale: 0.94, opacity: 0 },
          { yPercent: 0, scale: 1, opacity: 1, duration: 0.85, ease: 'power3.out' },
          '-=0.63' // stagger ~0.12s
        );
      }

      // Painéis Desktop: entrada suave (yPercent 8 -> 0 e fade, scale 1.08 -> 1 na imagem)
      const validDesktopPanels = desktopPanelRefs.current.filter(Boolean) as HTMLLIElement[];
      if (validDesktopPanels.length > 0 && desktopContainerRef.current) {
        gsap.fromTo(
          validDesktopPanels,
          { yPercent: 8, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: desktopContainerRef.current,
              start: 'top 78%',
              once: true,
            },
          }
        );
      }

      // Painéis Mobile: entrada de cada item com y 32 -> 0 e opacity 0 -> 1
      const validMobileItems = mobileItemRefs.current.filter(Boolean) as HTMLDivElement[];
      if (validMobileItems.length > 0 && mobileContainerRef.current) {
        gsap.fromTo(
          validMobileItems,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: mobileContainerRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="diferenciais"
      aria-labelledby="diferenciais-heading"
      className="relative w-full overflow-x-clip bg-[#F5E6D0] text-[#14100D] scroll-mt-20"
      style={{
        backgroundColor: '#F5E6D0',
      }}
    >
      {/* ============================================================== */}
      {/* TEXTURA DE GRÃO (.grao) 3% OPACIDADE                           */}
      {/* ============================================================== */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ============================================================== */}
      {/* ÁREA DO TÍTULO CENTRALIZADO COM FUNDO CREME                   */}
      {/* ============================================================== */}
      <div
        className="relative z-10 w-full flex flex-col items-center text-center px-[clamp(24px,5vw,80px)] pt-[clamp(72px,8vw,120px)] pb-[clamp(40px,4.5vw,72px)]"
      >
        {/* Eyebrow "DIFERENCIAIS" com fios laterais de 1px */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-3">
          <span className="w-6 sm:w-8 h-[1px] bg-[#14100D]/30 inline-block shrink-0" />
          <span
            className="font-text font-semibold uppercase tracking-[0.25em] text-[12px] sm:text-[13px] text-[#14100D] select-none"
            style={{ fontFamily: 'var(--font-text)' }}
          >
            DIFERENCIAIS
          </span>
          <span className="w-6 sm:w-8 h-[1px] bg-[#14100D]/30 inline-block shrink-0" />
        </div>

        {/* H2 com 2 Linhas: "POR QUE O FOGO É" + "diferente" (sem ícone colado) */}
        <h2
          id="diferenciais-heading"
          className="mt-2 sm:mt-3 flex flex-col items-center text-center m-0 select-none"
          aria-label="Por que o fogo é diferente"
        >
          {/* Linha 1: "POR QUE O FOGO É" (Fraunces 700, carvão) */}
          <span
            ref={titleLine1WrapperRef}
            className="line-wrapper block"
            style={{
              overflow: prefersReducedMotion ? 'visible' : 'hidden',
              padding: '0.22em 0.18em 0.3em',
              margin: '-0.22em -0.18em -0.3em',
            }}
          >
            <span
              ref={titleLine1InnerRef}
              className="block uppercase text-[#14100D] whitespace-nowrap text-[clamp(1.15rem,6vw,2rem)] lg:text-[clamp(1.7rem,4vw,3.8rem)]"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                letterSpacing: '0.05em',
                wordSpacing: '0.12em',
                lineHeight: 1.1,
              }}
            >
              POR QUE O FOGO É
            </span>
          </span>

          {/* Linha 2: "diferente" (Fraunces 900 itálico, brasa) */}
          <span
            ref={titleLine2WrapperRef}
            className="line-wrapper block"
            style={{
              overflow: prefersReducedMotion ? 'visible' : 'hidden',
              padding: '0.22em 0.18em 0.3em',
              margin: '-0.22em -0.18em -0.3em',
            }}
          >
            <span
              ref={titleLine2InnerRef}
              className="block lowercase italic text-[var(--brasa-creme-grande)] whitespace-nowrap tracking-[-0.02em] text-[clamp(4rem,19vw,6.5rem)] lg:text-[clamp(5rem,11.5vw,10.5rem)]"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
                lineHeight: 0.85,
                marginTop: '-0.06em',
                textShadow: '0 4px 28px rgba(20,16,13,0.12)',
              }}
            >
              diferente
            </span>
          </span>
        </h2>
      </div>

      {/* ============================================================== */}
      {/* PAINÉIS DESKTOP (≥1024px): 4 COLUNAS EM FLEX FULL-BLEED        */}
      {/* ============================================================== */}
      <ul
        ref={desktopContainerRef}
        onKeyDown={handleKeyDownList}
        tabIndex={0}
        aria-label="Lista de diferenciais da casa"
        className="hidden lg:flex w-full p-0 m-0 list-none overflow-hidden select-none"
        style={{
          height: 'clamp(560px, 78svh, 760px)',
          outline: 'none',
        }}
      >
        {DIFERENCIAIS.map((item, idx) => {
          const isActive = activeDesktopIdx === idx;
          const panelFlex = isActive ? '3.4' : '1';

          return (
            <li
              key={item.id}
              ref={(el) => {
                desktopPanelRefs.current[idx] = el;
              }}
              onMouseEnter={() => handleMouseEnterPanel(idx)}
              onMouseLeave={handleMouseLeavePanel}
              className="relative h-full overflow-hidden transition-[flex] duration-[650ms] cubic-bezier(0.2,0.7,0.2,1)"
              style={{
                flex: panelFlex,
                minWidth: '120px',
              }}
            >
              {/* Botão invisível acessível cobrindo todo o painel */}
              <button
                type="button"
                onClick={() => handleClickPanel(idx)}
                aria-expanded={isActive}
                aria-controls={`painel-desc-${item.id}`}
                aria-label={`Diferencial ${item.numero}: ${item.titulo}`}
                className="absolute inset-0 w-full h-full z-30 cursor-pointer bg-transparent border-0 p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E8832A] focus-visible:-outline-offset-4"
              />

              {/* Imagem de Fundo (com <picture> para servir WebP desktop/mobile) */}
              <picture className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
                <source media="(min-width: 1024px)" srcSet={item.media.desktopSrc} type="image/webp" />
                <img
                  src={item.media.mobileSrc}
                  alt=""
                  width={1400}
                  height={1050}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out"
                  style={{
                    transform: isActive ? 'scale(1.04)' : 'scale(1)',
                  }}
                />
              </picture>

              {/* Vídeo opcional se configurado na mídia */}
              {item.media.video && (
                <video
                  ref={(el) => {
                    desktopVideoRefs.current[idx] = el;
                  }}
                  poster={item.media.poster}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
                />
              )}

              {/* Camada 1: Escurecimento do painel fechado */}
              <div
                className="absolute inset-0 bg-[#14100D] pointer-events-none z-[1] transition-opacity duration-500 ease-out"
                style={{
                  opacity: isActive ? 0.08 : 0.32,
                }}
              />

              {/* Camada 2: Gradiente inferior no painel ativo */}
              <div
                className="absolute inset-0 pointer-events-none z-[2] transition-opacity duration-500 ease-out"
                style={{
                  opacity: isActive ? 1 : 0,
                  background:
                    'linear-gradient(to top, rgba(20,16,13,0.96) 0%, rgba(20,16,13,0.85) 25%, rgba(20,16,13,0.5) 45%, transparent 70%)',
                }}
              />

              {/* Topo do Painel: Número ("01" a "04") */}
              <div className="absolute top-0 left-0 p-6 z-10 pointer-events-none">
                <span
                  className="font-text font-semibold uppercase text-[14px] text-[#F5E6D0] tracking-[0.2em]"
                  style={{ fontFamily: 'var(--font-text)' }}
                >
                  {item.numero}
                </span>
              </div>

              {/* ====================================================== */}
              {/* PALAVRA DO PAINEL (Crossfade elegante Vertical / Horiz) */}
              {/* ====================================================== */}
              {/* 1) Versão Vertical (Painel Fechado): leitor de baixo para cima */}
              <div
                className="absolute top-20 left-1/2 -translate-x-1/2 z-10 pointer-events-none transition-all duration-500 ease-out flex items-center justify-center"
                style={{
                  opacity: isActive ? 0 : 1,
                  transform: isActive ? 'translate(-50%, -10px)' : 'translate(-50%, 0)',
                }}
              >
                <h3
                  className="m-0 select-none lowercase italic text-[#F5E6D0] whitespace-nowrap text-[clamp(3.6rem,6.6vw,6.2rem)]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
                    lineHeight: 0.9,
                    WebkitTextStroke: '0.07em #14100D',
                    paintOrder: 'stroke fill',
                    strokeLinejoin: 'round',
                    textShadow: '0 4px 18px rgba(0,0,0,0.5)',
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                  }}
                >
                  {item.palavra}
                </h3>
              </div>

              {/* 2) Versão Horizontal (Painel Ativo): ancorada no topo esquerdo */}
              <div
                className="absolute top-[68px] left-6 z-10 pointer-events-none transition-all duration-500 ease-out"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(8px)',
                }}
              >
                <h3
                  className="m-0 select-none lowercase italic text-[#F5E6D0] whitespace-nowrap text-[clamp(3.6rem,6.6vw,6.2rem)]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
                    lineHeight: 0.9,
                    WebkitTextStroke: '0.07em #14100D',
                    paintOrder: 'stroke fill',
                    strokeLinejoin: 'round',
                    textShadow: '0 4px 18px rgba(0,0,0,0.5)',
                  }}
                >
                  {item.palavra}
                </h3>
              </div>

              {/* ====================================================== */}
              {/* CONTEÚDO NA BASE DO PAINEL ATIVO (Título + Texto)       */}
              {/* ====================================================== */}
              <div
                id={`painel-desc-${item.id}`}
                aria-hidden={!isActive}
                className="absolute bottom-0 left-0 w-full z-10 pointer-events-none px-[clamp(24px,3vw,48px)] pb-[clamp(28px,3vw,48px)] transition-all duration-[350ms]"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(12px)',
                  transitionDelay: isActive ? '250ms' : '0ms',
                }}
              >
                <h4
                  className="m-0 font-text font-bold uppercase tracking-[0.06em] text-[clamp(1.15rem,1.7vw,1.6rem)]"
                  style={{
                    fontFamily: 'var(--font-text)',
                    color: '#F5E6D0',
                    textShadow: '0 2px 10px rgba(0,0,0,0.6)',
                  }}
                >
                  {item.titulo}
                </h4>
                <p
                  className="mt-2 m-0 font-text font-normal leading-[1.6] max-w-[44ch] text-[clamp(1rem,1.15vw,1.125rem)]"
                  style={{
                    fontFamily: 'var(--font-text)',
                    color: 'rgba(245, 230, 208, 0.95)',
                    textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                  }}
                >
                  {item.texto}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {/* ============================================================== */}
      {/* ACORDEÃO MOBILE (<1024px): COLUNA VERTICAL COM EXPANSÃO AO TOQUE */}
      {/* ============================================================== */}
      <div
        ref={mobileContainerRef}
        className="lg:hidden w-full flex flex-col p-0 m-0"
      >
        {DIFERENCIAIS.map((item, idx) => {
          const isOpen = activeMobileIdx === idx;

          return (
            <div
              key={item.id}
              ref={(el) => {
                mobileItemRefs.current[idx] = el;
              }}
              className="relative w-full overflow-hidden transition-[height] duration-[450ms] ease-out border-b border-[#14100D]/10"
              style={{
                height: isOpen ? 'clamp(360px, 62svh, 480px)' : '88px',
              }}
            >
              {/* Botão de toque cobrindo o item do acordeão */}
              <button
                type="button"
                onClick={() => toggleMobileAccordion(idx)}
                aria-expanded={isOpen}
                aria-controls={`mobile-panel-${item.id}`}
                className="relative w-full h-full text-left p-0 border-0 bg-transparent cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E8832A] focus-visible:-outline-offset-4"
              >
                {/* Imagem de Fundo WebP */}
                <picture className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
                  <img
                    src={item.media.mobileSrc}
                    alt=""
                    width={900}
                    height={1200}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center"
                  />
                </picture>

                {/* Overlays */}
                <div
                  className="absolute inset-0 bg-[#14100D] pointer-events-none z-[1] transition-opacity duration-300"
                  style={{
                    opacity: isOpen ? 0.15 : 0.45,
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none z-[2] transition-opacity duration-300"
                  style={{
                    opacity: isOpen ? 1 : 0,
                    background:
                      'linear-gradient(to top, rgba(20,16,13,0.96) 0%, rgba(20,16,13,0.85) 35%, rgba(20,16,13,0.4) 60%, transparent 80%)',
                  }}
                />

                {/* Linha Cabeçalho (Sempre Visível) */}
                <div className="relative z-10 w-full h-[88px] flex items-center justify-between px-6">
                  {/* Lado Esquerdo: Número + Palavra */}
                  <div className="flex items-center gap-4">
                    <span
                      className="font-text font-semibold uppercase text-[14px] text-[#F5E6D0] tracking-[0.2em]"
                      style={{ fontFamily: 'var(--font-text)' }}
                    >
                      {item.numero}
                    </span>
                    <h3
                      className="m-0 lowercase italic text-[#F5E6D0] whitespace-nowrap text-[clamp(2.6rem,14vw,3.6rem)]"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 900,
                        fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
                        lineHeight: 0.9,
                        WebkitTextStroke: '0.07em #14100D',
                        paintOrder: 'stroke fill',
                        strokeLinejoin: 'round',
                        textShadow: '0 4px 18px rgba(0,0,0,0.5)',
                      }}
                    >
                      {item.palavra}
                    </h3>
                  </div>

                  {/* Lado Direito: Indicador + / - */}
                  <div className="w-8 h-8 rounded-full border border-[#F5E6D0]/40 flex items-center justify-center text-[#F5E6D0] text-lg font-light">
                    {isOpen ? '–' : '+'}
                  </div>
                </div>

                {/* Conteúdo Aberto na Base do Acordeão */}
                <div
                  id={`mobile-panel-${item.id}`}
                  aria-hidden={!isOpen}
                  className="absolute bottom-0 left-0 w-full z-10 px-6 pb-7 transition-all duration-300 pointer-events-none"
                  style={{
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateY(0)' : 'translateY(12px)',
                    transitionDelay: isOpen ? '150ms' : '0ms',
                  }}
                >
                  <h4
                    className="m-0 font-text font-bold uppercase tracking-[0.06em] text-[1.2rem]"
                    style={{
                      fontFamily: 'var(--font-text)',
                      color: '#F5E6D0',
                      textShadow: '0 2px 10px rgba(0,0,0,0.6)',
                    }}
                  >
                    {item.titulo}
                  </h4>
                  <p
                    className="mt-2 m-0 font-text font-normal leading-[1.55] text-[0.95rem] max-w-[40ch]"
                    style={{
                      fontFamily: 'var(--font-text)',
                      color: 'rgba(245, 230, 208, 0.95)',
                      textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                    }}
                  >
                    {item.texto}
                  </p>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturesSection;
