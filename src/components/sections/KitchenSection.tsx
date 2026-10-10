import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '@/config';
import { CarneIcon } from '@/components/icons/CarneIcon';
import { OndaIcon } from '@/components/icons/OndaIcon';

gsap.registerPlugin(ScrollTrigger);

const VIDEOS = {
  terra: {
    src: 'https://jszueizwowynhekpsfii.supabase.co/storage/v1/object/public/braseiro/carne.mp4',
    poster: '/images/duas-brasas/terra-poster.webp',
  },
  mar: {
    src: 'https://jszueizwowynhekpsfii.supabase.co/storage/v1/object/public/braseiro/mar.mp4',
    poster: '/images/duas-brasas/mar-poster.webp',
  },
};

export const KitchenSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const panelsContainerRef = useRef<HTMLDivElement>(null);

  // Vídeos
  const videoTerraRef = useRef<HTMLVideoElement>(null);
  const videoMarRef = useRef<HTMLVideoElement>(null);

  // Selo central
  const badgeRef = useRef<HTMLDivElement>(null);

  // Painéis e elementos de texto/ícones
  const panelTerraRef = useRef<HTMLDivElement>(null);
  const panelMarRef = useRef<HTMLDivElement>(null);

  const wordTerraWrapperRef = useRef<HTMLSpanElement>(null);
  const wordTerraInnerRef = useRef<HTMLSpanElement>(null);
  const iconCarneRef = useRef<HTMLSpanElement>(null);

  const wordMarWrapperRef = useRef<HTMLSpanElement>(null);
  const wordMarInnerRef = useRef<HTMLSpanElement>(null);
  const iconOndaRef = useRef<HTMLSpanElement>(null);

  // Descrições e etiquetas mobile
  const descTerraRef = useRef<HTMLParagraphElement>(null);
  const tagTerraRef = useRef<HTMLSpanElement>(null);
  const descMarRef = useRef<HTMLParagraphElement>(null);
  const tagMarRef = useRef<HTMLSpanElement>(null);

  // Rodapé desktop (3 colunas sobre os vídeos)
  const bottom3ColsRef = useRef<HTMLDivElement>(null);

  // Bloco inferior mobile e faixa WhatsApp
  const mobileBottomBlockRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  // Hover state para o grid desktop (50/50, 62/38, 38/62)
  const [hoveredPanel, setHoveredPanel] = useState<'terra' | 'mar' | null>(null);

  // Reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // 1) CONTROLE DE CARREGAMENTO E REPRODUÇÃO DOS VÍDEOS
  useEffect(() => {
    if (prefersReducedMotion) return;

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    let isSectionNear = false;
    let isSectionVisible40 = false;
    let isDocVisible = !document.hidden;

    const updateVideoPlayback = () => {
      const shouldPlay = isSectionVisible40 && isDocVisible;

      [videoTerraRef.current, videoMarRef.current].forEach((vid) => {
        if (!vid) return;
        if (shouldPlay) {
          if (vid.src && vid.paused) {
            vid.play().catch(() => {});
          }
        } else {
          if (!vid.paused) {
            vid.pause();
          }
        }
      });
    };

    // Observer 1: Pré-carregar vídeo apenas quando a até 400px da viewport
    const preloadObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isSectionNear) {
            isSectionNear = true;
            if (videoTerraRef.current && !videoTerraRef.current.src) {
              videoTerraRef.current.src = VIDEOS.terra.src;
              videoTerraRef.current.load();
            }
            if (videoMarRef.current && !videoMarRef.current.src) {
              videoMarRef.current.src = VIDEOS.mar.src;
              videoMarRef.current.load();
            }
          }
        });
      },
      { rootMargin: '400px' }
    );
    preloadObserver.observe(sectionEl);

    // Observer 2: Reproduzir quando 40% visível; pausar ao sair
    const playbackObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isSectionVisible40 = entry.isIntersecting;
          updateVideoPlayback();
        });
      },
      { threshold: 0.4 }
    );
    playbackObserver.observe(sectionEl);

    // Pausar quando a aba for ocultada
    const handleVisibilityChange = () => {
      isDocVisible = !document.hidden;
      updateVideoPlayback();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      preloadObserver.disconnect();
      playbackObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [prefersReducedMotion]);

  // 2) ANIMAÇÕES GSAP (SCROLLTRIGGER)
  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Zoom sutil nos vídeos ao rolar
      // Terra: mantém scale >= 1.22 com origin 'bottom right' e object-position bottom para ocultar texto gravado no topo
      if (videoTerraRef.current) {
        gsap.fromTo(
          videoTerraRef.current,
          { scale: 1.28 },
          {
            scale: 1.22,
            ease: 'none',
            scrollTrigger: {
              trigger: panelsContainerRef.current || sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      }

      if (videoMarRef.current) {
        gsap.fromTo(
          videoMarRef.current,
          { scale: 1.06 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: panelsContainerRef.current || sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      }

      // Selo do título "DUAS BRASAS, UMA MESA": fade + y 16 -> 0
      if (badgeRef.current) {
        gsap.fromTo(
          badgeRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: badgeRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      // Linhas com máscaras: revelação das palavras "terra" e "mar"
      const lineWrappers = [
        wordTerraWrapperRef.current,
        wordMarWrapperRef.current,
      ].filter(Boolean);

      const wordsTl = gsap.timeline({
        scrollTrigger: {
          trigger: panelsContainerRef.current || sectionRef.current,
          start: 'top 75%',
          once: true,
        },
        onComplete: () => {
          // Folga nas máscaras: visible após concluir animação para não cortar descendentes/itálico
          lineWrappers.forEach((w) => {
            if (w) w.style.overflow = 'visible';
          });
          // Garantir estado final de escala e opacidade nos ícones
          if (iconCarneRef.current) {
            gsap.set(iconCarneRef.current, { scale: 1, rotate: 8, opacity: 1 });
          }
          if (iconOndaRef.current) {
            gsap.set(iconOndaRef.current, { scale: 1, opacity: 1 });
          }
        },
      });

      // Palavra "terra"
      if (wordTerraInnerRef.current) {
        wordsTl.fromTo(
          wordTerraInnerRef.current,
          { yPercent: 100, scale: 0.94, opacity: 0 },
          { yPercent: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );
      }

      // Pop do ícone da carne (fora da máscara)
      if (iconCarneRef.current) {
        wordsTl.fromTo(
          iconCarneRef.current,
          { scale: 0.5, rotate: 20, opacity: 0 },
          { scale: 1, rotate: 8, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
          '-=0.45'
        );
      }

      // Palavra "mar"
      if (wordMarInnerRef.current) {
        wordsTl.fromTo(
          wordMarInnerRef.current,
          { yPercent: 100, scale: 0.94, opacity: 0 },
          { yPercent: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.65'
        );
      }

      // Pop do ícone da onda (fora da máscara)
      if (iconOndaRef.current) {
        wordsTl.fromTo(
          iconOndaRef.current,
          { scale: 0.6, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
          '-=0.45'
        );
      }

      // 3) LOOPS CONTÍNUOS DOS ÍCONES (CARNE & ONDA)
      const loopTweens: gsap.core.Tween[] = [];

      // A) Loops da carne
      const carneSvg = iconCarneRef.current?.querySelector('svg');
      const carneBody = carneSvg?.querySelector('.icon-body');
      const spark1 = carneSvg?.querySelector('.icon-spark--1');
      const spark2 = carneSvg?.querySelector('.icon-spark--2');
      const spark3 = carneSvg?.querySelector('.icon-spark--3');

      if (carneBody) {
        const bodyTween = gsap.fromTo(
          carneBody,
          { rotate: 0 },
          {
            rotate: 3,
            transformOrigin: '50% 50%',
            duration: 2.8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          }
        );
        loopTweens.push(bodyTween);
      }

      if (spark1) {
        const s1 = gsap.fromTo(
          spark1,
          { y: 0, opacity: 1, scale: 1 },
          {
            y: -22,
            opacity: 0,
            scale: 0.65,
            duration: 1.2,
            repeat: -1,
            ease: 'power1.out',
            delay: 0.1,
          }
        );
        loopTweens.push(s1);
      }

      if (spark2) {
        const s2 = gsap.fromTo(
          spark2,
          { y: 0, opacity: 1, scale: 1 },
          {
            y: -28,
            opacity: 0,
            scale: 0.55,
            duration: 1.7,
            repeat: -1,
            ease: 'power1.out',
            delay: 0.45,
          }
        );
        loopTweens.push(s2);
      }

      if (spark3) {
        const s3 = gsap.fromTo(
          spark3,
          { y: 0, opacity: 1, scale: 1 },
          {
            y: -25,
            opacity: 0,
            scale: 0.6,
            duration: 2.3,
            repeat: -1,
            ease: 'power1.out',
            delay: 0.8,
          }
        );
        loopTweens.push(s3);
      }

      // B) Loops das ondas (maré com deslize em x)
      const ondaSvg = iconOndaRef.current?.querySelector('svg');
      const wave1 = ondaSvg?.querySelector('.icon-wave--1');
      const waveOutline1 = ondaSvg?.querySelector('.icon-wave-outline--1');
      const wave2 = ondaSvg?.querySelector('.icon-wave--2');
      const waveOutline2 = ondaSvg?.querySelector('.icon-wave-outline--2');
      const wave3 = ondaSvg?.querySelector('.icon-wave--3');
      const waveOutline3 = ondaSvg?.querySelector('.icon-wave-outline--3');

      if (wave1 && waveOutline1) {
        const w1Tween = gsap.fromTo(
          [wave1, waveOutline1],
          { x: -6 },
          {
            x: 6,
            duration: 2.4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          }
        );
        loopTweens.push(w1Tween);
      }

      if (wave2 && waveOutline2) {
        const w2Tween = gsap.fromTo(
          [wave2, waveOutline2],
          { x: 6 },
          {
            x: -6,
            duration: 3.0,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 0.3,
          }
        );
        loopTweens.push(w2Tween);
      }

      if (wave3 && waveOutline3) {
        const w3Tween = gsap.fromTo(
          [wave3, waveOutline3],
          { x: -5 },
          {
            x: 5,
            duration: 3.6,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 0.6,
          }
        );
        loopTweens.push(w3Tween);
      }

      // Pausar loops contínuos ao sair da viewport
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          loopTweens.forEach((t) => {
            if (self.isActive) t.resume();
            else t.pause();
          });
        },
      });

      // 4) FADE-UP DAS DESCRIÇÕES E ETIQUETAS NO MOBILE
      const mobileTexts = [
        descTerraRef.current,
        tagTerraRef.current,
        descMarRef.current,
        tagMarRef.current,
      ].filter(Boolean);

      if (mobileTexts.length > 0) {
        gsap.fromTo(
          mobileTexts,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: panelsContainerRef.current || sectionRef.current,
              start: 'top 65%',
              once: true,
            },
          }
        );
      }

      // 5) FADE-UP DA LINHA INFERIOR EM 3 COLUNAS (DESKTOP >= 1024px)
      if (bottom3ColsRef.current) {
        gsap.fromTo(
          bottom3ColsRef.current,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: panelsContainerRef.current || sectionRef.current,
              start: 'top 70%',
              once: true,
            },
          }
        );
      }

      // 6) FADE-UP DO BLOCO EXCLUSIVO MOBILE (< 1024px)
      if (mobileBottomBlockRef.current) {
        gsap.fromTo(
          mobileBottomBlockRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: mobileBottomBlockRef.current,
              start: 'top 95%',
              once: true,
            },
          }
        );
      }

      // 7) FADE-IN DA FAIXA FINA (WHATSAPP E DRINKS)
      if (bottomBarRef.current) {
        gsap.fromTo(
          bottomBarRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: bottomBarRef.current,
              start: 'top 98%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Cálculo dinâmico das colunas desktop no hover: 50/50, 62/38 ou 38/62
  const getGridColumns = () => {
    if (prefersReducedMotion) return '1fr 1fr';
    if (hoveredPanel === 'terra') return '62% 38%';
    if (hoveredPanel === 'mar') return '38% 62%';
    return '1fr 1fr';
  };

  return (
    <section
      id="cardapio"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#14100D] text-[#F5E6D0] scroll-mt-16"
      style={{
        backgroundColor: '#14100D',
      }}
    >
      {/* ============================================================== */}
      {/* TEXTURA DE GRÃO (.grao) 3% OPACIDADE                           */}
      {/* ============================================================== */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ============================================================== */}
      {/* CONTAINER DOS PAINÉIS DE VÍDEO E RODAPÉ EM 3 COLUNAS          */}
      {/* ============================================================== */}
      <div className="relative w-full">
        <div
          ref={panelsContainerRef}
          className="relative w-full flex flex-col lg:grid"
          style={{
            gridTemplateColumns: getGridColumns(),
            transition: prefersReducedMotion
              ? 'none'
              : 'grid-template-columns 600ms cubic-bezier(0.2, 0.7, 0.2, 1)',
          }}
        >
          {/* ============================================================ */}
          {/* PAINEL TERRA (ESQUERDO NO DESKTOP / SUPERIOR NO MOBILE)      */}
          {/* ============================================================ */}
          <div
            ref={panelTerraRef}
            onMouseEnter={() => setHoveredPanel('terra')}
            onMouseLeave={() => setHoveredPanel(null)}
            className="relative w-full h-[clamp(380px,62svh,520px)] lg:h-[clamp(620px,92svh,900px)] overflow-hidden flex flex-col justify-end items-center text-center pb-12 sm:pb-16 lg:pb-[clamp(210px,26vh,270px)] px-6"
          >
            {/* Poster / Fundo enquanto o vídeo carrega */}
            <img
              src={VIDEOS.terra.poster}
              alt=""
              width={1200}
              height={2133}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
              style={{
                objectPosition: '50% 100%',
                transform: 'scale(1.22)',
                transformOrigin: 'bottom right',
              }}
            />

            {/* Vídeo remoto Terra (Carne) com zoom e ancoragem no canto inferior direito */}
            {!prefersReducedMotion && (
              <video
                ref={videoTerraRef}
                poster={VIDEOS.terra.poster}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
                style={{
                  objectPosition: '50% 100%',
                  transform: 'scale(1.22)',
                  transformOrigin: 'bottom right',
                }}
              />
            )}

            {/* Overlays em CSS puro (sem backdrop-filter) */}
            {/* Camada 1: Base suave 18% */}
            <div className="absolute inset-0 bg-[#14100D]/18 pointer-events-none z-[1]" />

            {/* Camada 2: Gradiente inferior para contraste AA */}
            <div
              className="absolute inset-0 pointer-events-none z-[2]"
              style={{
                background:
                  'linear-gradient(to top, rgba(20,16,13,0.94) 0%, rgba(20,16,13,0.7) 22%, transparent 46%)',
              }}
            />

            {/* Camada 3: Gradiente de transição de 90px no topo para emenda limpa */}
            <div
              className="absolute inset-0 pointer-events-none z-[3]"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(20,16,13,1) 0px, rgba(20,16,13,0.6) 45px, transparent 90px)',
              }}
            />

            {/* Conteúdo do Painel Terra */}
            <div className="relative z-10 w-full max-w-[560px] flex flex-col items-center">
              {/* Container inline-flex h3 com tamanho de fonte fluido */}
              <h3
                className="inline-flex items-center justify-center lowercase italic text-[#E8832A] whitespace-nowrap m-0 select-none text-[clamp(5rem,26vw,8.5rem)] lg:text-[clamp(5.5rem,13vw,12rem)]"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
                  lineHeight: 0.85,
                  WebkitTextStroke: '0.06em #14100D',
                  paintOrder: 'stroke fill',
                  strokeLinejoin: 'round',
                  textShadow: '0 6px 26px rgba(0,0,0,0.55)',
                }}
              >
                {/* Máscara de revelação apenas na palavra "terra" */}
                <span
                  ref={wordTerraWrapperRef}
                  className="line-wrapper inline-block"
                  style={{
                    overflow: prefersReducedMotion ? 'visible' : 'hidden',
                    padding: '0.22em 0.04em 0.3em 0.18em',
                    margin: '-0.22em -0.04em -0.3em -0.18em',
                  }}
                >
                  <span
                    ref={wordTerraInnerRef}
                    className="inline-block"
                    style={{
                      transform: prefersReducedMotion ? 'none' : undefined,
                      opacity: prefersReducedMotion ? 1 : undefined,
                    }}
                  >
                    terra
                  </span>
                </span>

                {/* Ícone da Carne (colado à letra "a" final, FORA da máscara) */}
                <span
                  ref={iconCarneRef}
                  aria-hidden="true"
                  className="inline-block shrink-0 select-none pointer-events-none origin-bottom-left"
                  style={{
                    height: '0.62em',
                    width: '0.62em',
                    aspectRatio: '1 / 1',
                    verticalAlign: 'middle',
                    marginLeft: '0.02em',
                    transform: 'rotate(8deg)',
                    opacity: prefersReducedMotion ? 1 : undefined,
                  }}
                >
                  <CarneIcon className="w-full h-full block" />
                </span>
              </h3>

              {/* Descrição e etiqueta centralizadas no mobile (< 1024px) */}
              <div className="lg:hidden mt-3 flex flex-col items-center">
                <span
                  ref={tagTerraRef}
                  className="font-text font-semibold uppercase tracking-[0.25em] text-[12px] text-[#F5E6D0]/85 select-none"
                  style={{ fontFamily: 'var(--font-text)' }}
                >
                  PARRILLA
                </span>
                <p
                  ref={descTerraRef}
                  className="mt-2 font-text font-medium text-[#F5E6D0]/92 text-[clamp(0.95rem,1.1vw,1.0625rem)] leading-[1.5] max-w-[36ch]"
                  style={{
                    fontFamily: 'var(--font-text)',
                    textWrap: 'balance',
                  }}
                >
                  Picanha, chorizo e assado de tira no ponto certo, selados na lenha com flor de sal marinho.
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* PAINEL MAR (DIREITO NO DESKTOP / INFERIOR NO MOBILE)         */}
          {/* ============================================================ */}
          <div
            ref={panelMarRef}
            onMouseEnter={() => setHoveredPanel('mar')}
            onMouseLeave={() => setHoveredPanel(null)}
            className="relative w-full h-[clamp(380px,62svh,520px)] lg:h-[clamp(620px,92svh,900px)] overflow-hidden flex flex-col justify-end items-center text-center pb-12 sm:pb-16 lg:pb-[clamp(210px,26vh,270px)] px-6"
          >
            {/* Poster / Fundo enquanto o vídeo carrega */}
            <img
              src={VIDEOS.mar.poster}
              alt=""
              width={1200}
              height={2133}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
              style={{
                objectPosition: '50% 78%',
                filter: 'saturate(1.05) contrast(1.02)',
              }}
            />

            {/* Vídeo remoto Mar */}
            {!prefersReducedMotion && (
              <video
                ref={videoMarRef}
                poster={VIDEOS.mar.poster}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
                style={{
                  objectPosition: '50% 78%',
                  filter: 'saturate(1.05) contrast(1.02)',
                }}
              />
            )}

            {/* Overlays em CSS puro (sem backdrop-filter) */}
            {/* Camada 1: Base suave 18% */}
            <div className="absolute inset-0 bg-[#14100D]/18 pointer-events-none z-[1]" />

            {/* Camada 2: Gradiente inferior para contraste AA */}
            <div
              className="absolute inset-0 pointer-events-none z-[2]"
              style={{
                background:
                  'linear-gradient(to top, rgba(20,16,13,0.94) 0%, rgba(20,16,13,0.7) 22%, transparent 46%)',
              }}
            />

            {/* Camada 3: Gradiente de transição de 90px no topo para emenda limpa */}
            <div
              className="absolute inset-0 pointer-events-none z-[3]"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(20,16,13,1) 0px, rgba(20,16,13,0.6) 45px, transparent 90px)',
              }}
            />

            {/* Conteúdo do Painel Mar */}
            <div className="relative z-10 w-full max-w-[560px] flex flex-col items-center">
              {/* Container inline-flex h3 com tamanho de fonte fluido */}
              <h3
                className="inline-flex items-center justify-center lowercase italic text-[#E8832A] whitespace-nowrap m-0 select-none text-[clamp(5rem,26vw,8.5rem)] lg:text-[clamp(5.5rem,13vw,12rem)]"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
                  lineHeight: 0.85,
                  WebkitTextStroke: '0.06em #14100D',
                  paintOrder: 'stroke fill',
                  strokeLinejoin: 'round',
                  textShadow: '0 6px 26px rgba(0,0,0,0.55)',
                }}
              >
                {/* Ícone da Onda (inline antes da palavra, sem rotação, FORA da máscara) */}
                <span
                  ref={iconOndaRef}
                  aria-hidden="true"
                  className="inline-block shrink-0 select-none pointer-events-none origin-center"
                  style={{
                    height: '0.5em',
                    width: '0.5em',
                    aspectRatio: '1 / 1',
                    verticalAlign: 'middle',
                    marginRight: '0.02em',
                    opacity: prefersReducedMotion ? 1 : undefined,
                  }}
                >
                  <OndaIcon className="w-full h-full block" />
                </span>

                {/* Máscara de revelação apenas na palavra "mar" */}
                <span
                  ref={wordMarWrapperRef}
                  className="line-wrapper inline-block"
                  style={{
                    overflow: prefersReducedMotion ? 'visible' : 'hidden',
                    padding: '0.22em 0.18em 0.3em 0.04em',
                    margin: '-0.22em -0.18em -0.3em -0.04em',
                  }}
                >
                  <span
                    ref={wordMarInnerRef}
                    className="inline-block"
                    style={{
                      transform: prefersReducedMotion ? 'none' : undefined,
                      opacity: prefersReducedMotion ? 1 : undefined,
                    }}
                  >
                    mar
                  </span>
                </span>
              </h3>

              {/* Descrição e etiqueta centralizadas no mobile (< 1024px) */}
              <div className="lg:hidden mt-3 flex flex-col items-center">
                <span
                  ref={tagMarRef}
                  className="font-text font-semibold uppercase tracking-[0.25em] text-[12px] text-[#F5E6D0]/85 select-none"
                  style={{ fontFamily: 'var(--font-text)' }}
                >
                  COSTA DE UBATUBA
                </span>
                <p
                  ref={descMarRef}
                  className="mt-2 font-text font-medium text-[#F5E6D0]/92 text-[clamp(0.95rem,1.1vw,1.0625rem)] leading-[1.5] max-w-[36ch]"
                  style={{
                    fontFamily: 'var(--font-text)',
                    textWrap: 'balance',
                  }}
                >
                  Polvo tenro grelhado, camarões e peixe fresco do dia dos pescadores locais.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SELO CENTRAL H2 ("DUAS BRASAS, UMA MESA")                      */}
        {/* ============================================================== */}
        <div
          ref={badgeRef}
          className="absolute z-20 left-1/2 -translate-x-1/2 pointer-events-none select-none top-1/2 -translate-y-1/2 lg:top-[42%]"
        >
          <div className="flex items-center gap-3 sm:gap-4 px-5 py-2.5 bg-[#14100D]/80 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            <span className="w-8 sm:w-10 h-[1px] bg-[#F5E6D0]/80 inline-block shrink-0" />
            <h2
              className="font-display uppercase text-[#F5E6D0] whitespace-nowrap text-[clamp(0.95rem,1.4vw,1.35rem)]"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                letterSpacing: '0.06em',
                wordSpacing: '0.12em',
              }}
            >
              DUAS BRASAS, UMA MESA
            </h2>
            <span className="w-8 sm:w-10 h-[1px] bg-[#F5E6D0]/80 inline-block shrink-0" />
          </div>
        </div>

        {/* ============================================================== */}
        {/* RODAPÉ EM 3 COLUNAS SOBRE OS VÍDEOS (DESKTOP >= 1024px)        */}
        {/* Fixado à seção (não aos painéis), para não reflowar no hover  */}
        {/* ============================================================== */}
        <div
          ref={bottom3ColsRef}
          className="hidden lg:grid absolute bottom-0 inset-x-0 z-20 pointer-events-auto items-end grid-cols-[1fr_auto_1fr]"
          style={{
            paddingLeft: 'clamp(24px, 3vw, 48px)',
            paddingRight: 'clamp(24px, 3vw, 48px)',
            paddingBottom: 'clamp(24px, 3vw, 44px)',
          }}
        >
          {/* Coluna Esquerda: etiqueta PARRILLA + descrição */}
          <div className="flex flex-col items-start justify-end text-left pr-6">
            <span
              className="font-text font-semibold uppercase text-[12px] text-[#F5E6D0]/90 select-none"
              style={{
                fontFamily: 'var(--font-text)',
                letterSpacing: '0.25em',
              }}
            >
              PARRILLA
            </span>
            <p
              className="mt-1.5 font-text font-medium text-[15px] leading-[1.5] text-[#F5E6D0] max-w-[34ch]"
              style={{ fontFamily: 'var(--font-text)' }}
            >
              Picanha, chorizo e assado de tira no ponto certo, selados na lenha com flor de sal marinho.
            </p>
          </div>

          {/* Coluna Central: Frase em itálico + botão pequeno VER CARDÁPIO */}
          <div className="flex flex-col items-center justify-end text-center px-4">
            <p
              className="font-display italic text-[#F5E6D0] leading-[1.4] text-center max-w-[30ch] text-[clamp(0.95rem,1.2vw,1.15rem)]"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                textWrap: 'balance',
              }}
            >
              “A força do pasto encontra a maresia do Atlântico sobre a mesma lenha viva.”
            </p>
            <a
              href="/cardapio"
              className="mt-4 inline-flex items-center justify-center rounded-[6px] bg-[#F5E6D0] text-[#14100D] hover:bg-[#E8832A] hover:text-[#14100D] transition-colors duration-200 font-text font-semibold uppercase text-[13px] shadow-sm select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#E8832A]"
              style={{
                fontFamily: 'var(--font-text)',
                letterSpacing: '0.08em',
                padding: '10px 22px',
              }}
            >
              VER CARDÁPIO
            </a>
          </div>

          {/* Coluna Direita: etiqueta COSTA DE UBATUBA + descrição */}
          <div className="flex flex-col items-end justify-end text-right pl-6">
            <span
              className="font-text font-semibold uppercase text-[12px] text-[#F5E6D0]/90 select-none text-right"
              style={{
                fontFamily: 'var(--font-text)',
                letterSpacing: '0.25em',
              }}
            >
              COSTA DE UBATUBA
            </span>
            <p
              className="mt-1.5 font-text font-medium text-[15px] leading-[1.5] text-[#F5E6D0] max-w-[34ch] text-right"
              style={{ fontFamily: 'var(--font-text)' }}
            >
              Polvo tenro grelhado, camarões e peixe fresco do dia dos pescadores locais.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BLOCO EXCLUSIVO MOBILE (< 1024px): FRASE + BOTÃO               */}
      {/* ============================================================== */}
      <div
        ref={mobileBottomBlockRef}
        className="lg:hidden relative z-10 w-full bg-[#14100D] py-10 px-6 flex flex-col items-center text-center"
      >
        <p
          className="font-display italic text-[#F5E6D0] leading-[1.4] text-center max-w-[32ch] text-[clamp(1.05rem,1.4vw,1.25rem)]"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            textWrap: 'balance',
          }}
        >
          “A força do pasto encontra a maresia do Atlântico sobre a mesma lenha viva.”
        </p>
        <a
          href="/cardapio"
          className="mt-6 inline-flex items-center justify-center rounded-[6px] bg-[#F5E6D0] text-[#14100D] hover:bg-[#E8832A] hover:text-[#14100D] transition-colors duration-200 font-text font-semibold uppercase tracking-[0.08em] text-[13px] shadow-md py-[10px] px-[22px] select-none"
          style={{ fontFamily: 'var(--font-text)' }}
        >
          VER CARDÁPIO
        </a>
      </div>

      {/* ============================================================== */}
      {/* FAIXA FINA CARVÃO: WHATSAPP E BRINDE (COMUM DESKTOP E MOBILE)  */}
      {/* ============================================================== */}
      <div
        ref={bottomBarRef}
        className="relative z-10 w-full bg-[#14100D] py-[20px] px-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center border-t border-[#F5E6D0]/8"
      >
        <a
          href={siteConfig.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-text font-medium text-[15px] text-[#F5E6D0] hover:text-[#E8832A] transition-colors duration-200 border-b-2 border-[#E8832A] pb-0.5"
          style={{ fontFamily: 'var(--font-text)' }}
        >
          Consultar pratos do dia no WhatsApp
        </a>
        <span className="hidden sm:inline text-[#F5E6D0]/50 select-none">·</span>
        <span
          className="font-text text-[15px] text-[#F5E6D0]/75"
          style={{ fontFamily: 'var(--font-text)' }}
        >
          E para brindar: coquetelaria autoral e chopp trincando.
        </span>
      </div>
    </section>
  );
};

export default KitchenSection;
