import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
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

  // Painéis e elementos
  const panelTerraRef = useRef<HTMLDivElement>(null);
  const panelMarRef = useRef<HTMLDivElement>(null);

  const wordTerraWrapperRef = useRef<HTMLDivElement>(null);
  const wordTerraInnerRef = useRef<HTMLDivElement>(null);
  const iconCarneRef = useRef<HTMLSpanElement>(null);

  const wordMarWrapperRef = useRef<HTMLDivElement>(null);
  const wordMarInnerRef = useRef<HTMLDivElement>(null);
  const iconOndaRef = useRef<HTMLSpanElement>(null);

  const descTerraRef = useRef<HTMLParagraphElement>(null);
  const tagTerraRef = useRef<HTMLSpanElement>(null);
  const descMarRef = useRef<HTMLParagraphElement>(null);
  const tagMarRef = useRef<HTMLSpanElement>(null);

  // Bloco inferior
  const bottomContainerRef = useRef<HTMLDivElement>(null);
  const bottomQuoteRef = useRef<HTMLParagraphElement>(null);
  const bottomBtnRef = useRef<HTMLAnchorElement>(null);
  const bottomLinkRef = useRef<HTMLAnchorElement>(null);
  const bottomDrinksRef = useRef<HTMLParagraphElement>(null);

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
            // Injetar src nos vídeos
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
      // Scale sutil 1.06 -> 1 nos vídeos ao entrar
      const vids = [videoTerraRef.current, videoMarRef.current].filter(Boolean);
      if (vids.length > 0) {
        gsap.fromTo(
          vids,
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

      // Linhas com máscaras: "terra" primeiro e "mar" 0.15s depois
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

      // Pop do ícone da carne
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
          '-=0.65' // 0.15s stagger após terra
        );
      }

      // Pop do ícone da onda
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

      // B) Loops das ondas (sensação de maré com deslize em x)
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

      // 4) FADE-UP DAS DESCRIÇÕES E ETIQUETAS
      const panelTexts = [
        descTerraRef.current,
        tagTerraRef.current,
        descMarRef.current,
        tagMarRef.current,
      ].filter(Boolean);

      if (panelTexts.length > 0) {
        gsap.fromTo(
          panelTexts,
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

      // 5) FADE-UP DO BLOCO INFERIOR (FRASE, BOTÕES E DRINKS)
      const bottomEls = [
        bottomQuoteRef.current,
        bottomBtnRef.current,
        bottomLinkRef.current,
        bottomDrinksRef.current,
      ].filter(Boolean);

      if (bottomEls.length > 0) {
        gsap.fromTo(
          bottomEls,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: bottomContainerRef.current || sectionRef.current,
              start: 'top 95%',
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
      {/* CONTAINER DOS PAINÉIS (VÍDEO TERRA & MAR)                      */}
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
            className="relative w-full h-[clamp(380px,62svh,520px)] lg:h-[clamp(620px,92svh,900px)] overflow-hidden flex flex-col justify-end items-center text-center pb-12 sm:pb-16 lg:pb-20 px-6"
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
            />

            {/* Vídeo remoto Terra (Carne) */}
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
              />
            )}

            {/* Overlays em CSS puro (sem backdrop-filter) */}
            {/* Camada 1: Base suave 18% */}
            <div className="absolute inset-0 bg-[#14100D]/18 pointer-events-none z-[1]" />

            {/* Camada 2: Gradiente inferior para legibilidade da copy */}
            <div
              className="absolute inset-0 pointer-events-none z-[2]"
              style={{
                background:
                  'linear-gradient(to top, rgba(20,16,13,0.92) 0%, rgba(20,16,13,0.60) 28%, transparent 55%)',
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
            <div className="relative z-10 w-full max-w-[480px] flex flex-col items-center">
              {/* Palavra Gigante: "terra" + Ícone da Carne */}
              <div
                ref={wordTerraWrapperRef}
                className="line-wrapper block max-w-full"
                style={{
                  overflow: prefersReducedMotion ? 'visible' : 'hidden',
                  padding: '0.22em 0.18em 0.3em',
                  margin: '-0.22em -0.18em -0.3em',
                }}
              >
                <div
                  ref={wordTerraInnerRef}
                  className="inline-flex items-center justify-center max-w-full"
                >
                  <h3
                    className="inline-block lowercase italic text-[#E8832A] whitespace-nowrap m-0 select-none text-[clamp(5rem,26vw,8.5rem)] lg:text-[clamp(5.5rem,13vw,12rem)]"
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
                    terra
                  </h3>

                  {/* Ícone da Carne (inline após a palavra) */}
                  <span
                    ref={iconCarneRef}
                    aria-hidden="true"
                    className="inline-block select-none pointer-events-none origin-bottom-left"
                    style={{
                      height: '0.62em',
                      width: 'auto',
                      verticalAlign: 'middle',
                      marginLeft: '0.04em',
                      transform: 'rotate(8deg)',
                    }}
                  >
                    <CarneIcon className="h-full w-auto inline-block align-middle" />
                  </span>
                </div>
              </div>

              {/* Descrição enxuta de 1 linha */}
              {/* 
                Texto anterior completo:
                "Picanha, chorizo e assado de tira no ponto certo, selados na lenha com flor de sal marinho."
                TODO: confirmar com o restaurante origem dos cortes e temperos.
              */}
              <p
                ref={descTerraRef}
                className="mt-4 font-text font-medium text-[#F5E6D0]/92 text-[clamp(0.95rem,1.1vw,1.0625rem)] leading-[1.5] max-w-[40ch]"
                style={{
                  fontFamily: 'var(--font-text)',
                  textWrap: 'balance',
                }}
              >
                Picanha, chorizo e assado de tira no ponto certo, selados na lenha.
              </p>

              {/* Etiqueta sem pílula */}
              <span
                ref={tagTerraRef}
                className="mt-3 font-text font-semibold uppercase tracking-[0.25em] text-[12px] text-[#F5E6D0]/85 select-none"
                style={{ fontFamily: 'var(--font-text)' }}
              >
                PARRILLA
              </span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* PAINEL MAR (DIREITO NO DESKTOP / INFERIOR NO MOBILE)         */}
          {/* ============================================================ */}
          <div
            ref={panelMarRef}
            onMouseEnter={() => setHoveredPanel('mar')}
            onMouseLeave={() => setHoveredPanel(null)}
            className="relative w-full h-[clamp(380px,62svh,520px)] lg:h-[clamp(620px,92svh,900px)] overflow-hidden flex flex-col justify-end items-center text-center pb-12 sm:pb-16 lg:pb-20 px-6"
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
                // Ajuste sutil de tom se necessário para harmonizar com a carne
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
                  filter: 'saturate(1.05) contrast(1.02)',
                }}
              />
            )}

            {/* Overlays em CSS puro (sem backdrop-filter) */}
            {/* Camada 1: Base suave 18% */}
            <div className="absolute inset-0 bg-[#14100D]/18 pointer-events-none z-[1]" />

            {/* Camada 2: Gradiente inferior para legibilidade da copy */}
            <div
              className="absolute inset-0 pointer-events-none z-[2]"
              style={{
                background:
                  'linear-gradient(to top, rgba(20,16,13,0.92) 0%, rgba(20,16,13,0.60) 28%, transparent 55%)',
              }}
            />

            {/* Conteúdo do Painel Mar */}
            <div className="relative z-10 w-full max-w-[480px] flex flex-col items-center">
              {/* Palavra Gigante: Ícone da Onda + "mar" */}
              <div
                ref={wordMarWrapperRef}
                className="line-wrapper block max-w-full"
                style={{
                  overflow: prefersReducedMotion ? 'visible' : 'hidden',
                  padding: '0.22em 0.18em 0.3em',
                  margin: '-0.22em -0.18em -0.3em',
                }}
              >
                <div
                  ref={wordMarInnerRef}
                  className="inline-flex items-center justify-center max-w-full"
                >
                  {/* Ícone da Onda (inline antes da palavra) */}
                  <span
                    ref={iconOndaRef}
                    aria-hidden="true"
                    className="inline-block select-none pointer-events-none origin-center"
                    style={{
                      height: '0.5em',
                      width: 'auto',
                      verticalAlign: 'middle',
                      marginRight: '0.02em',
                    }}
                  >
                    <OndaIcon className="h-full w-auto inline-block align-middle" />
                  </span>

                  <h3
                    className="inline-block lowercase italic text-[#E8832A] whitespace-nowrap m-0 select-none text-[clamp(5rem,26vw,8.5rem)] lg:text-[clamp(5.5rem,13vw,12rem)]"
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
                    mar
                  </h3>
                </div>
              </div>

              {/* Descrição enxuta de 1 linha */}
              {/* 
                Texto anterior completo:
                "Polvo tenro grelhado, camarões pistola na brasa e peixe do dia fresco dos pescadores locais."
                TODO: confirmar com o restaurante origem dos pescados e cortes.
              */}
              <p
                ref={descMarRef}
                className="mt-4 font-text font-medium text-[#F5E6D0]/92 text-[clamp(0.95rem,1.1vw,1.0625rem)] leading-[1.5] max-w-[40ch]"
                style={{
                  fontFamily: 'var(--font-text)',
                  textWrap: 'balance',
                }}
              >
                Polvo tenro grelhado, camarões e peixe fresco do dia dos pescadores locais.
              </p>

              {/* Etiqueta sem pílula */}
              <span
                ref={tagMarRef}
                className="mt-3 font-text font-semibold uppercase tracking-[0.25em] text-[12px] text-[#F5E6D0]/85 select-none"
                style={{ fontFamily: 'var(--font-text)' }}
              >
                COSTA DE UBATUBA
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SELO CENTRAL H2 ("DUAS BRASAS, UMA MESA")                      */}
        {/* ============================================================== */}
        {/* 
          Desktop: posicionado absolute sobre a emenda vertical dos painéis a ~46% da altura
          Mobile: posicionado sobre a emenda horizontal entre os dois painéis
        */}
        <div
          ref={badgeRef}
          className="absolute z-20 left-1/2 -translate-x-1/2 pointer-events-none select-none top-1/2 -translate-y-1/2 lg:top-[46%]"
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
      </div>

      {/* ============================================================== */}
      {/* BLOCO INFERIOR (FRASE, BOTÃO, WHATSAPP E DRINKS)               */}
      {/* ============================================================== */}
      <div
        ref={bottomContainerRef}
        className="relative z-10 w-full bg-[#14100D] py-[clamp(44px,5vw,72px)] px-6 flex flex-col items-center text-center"
      >
        {/* Frase em itálico */}
        <p
          ref={bottomQuoteRef}
          className="font-display italic text-[#F5E6D0] leading-[1.4] text-center max-w-[40ch] text-[clamp(1.15rem,1.7vw,1.5rem)]"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            textWrap: 'balance',
          }}
        >
          “A força do pasto encontra a maresia do Atlântico sobre a mesma lenha viva.”
        </p>

        {/* Botão Principal: VER CARDÁPIO */}
        <div className="mt-8 w-full flex justify-center">
          <a
            ref={bottomBtnRef}
            href="/cardapio"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[6px] bg-[#F5E6D0] text-[#14100D] hover:bg-[#E8832A] hover:text-[#14100D] active:translate-y-0.5 transition-all duration-300 font-text font-semibold uppercase tracking-[0.08em] text-[14px] sm:text-[15px] shadow-lg w-full max-w-[340px] sm:max-w-[420px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#E8832A]"
            style={{ fontFamily: 'var(--font-text)' }}
          >
            <span>VER CARDÁPIO</span>
            <ArrowUpRight className="w-[18px] h-[18px]" />
          </a>
        </div>

        {/* Link Secundário: Consultar pratos do dia no WhatsApp */}
        <div className="mt-4">
          <a
            ref={bottomLinkRef}
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-text font-medium text-[15px] sm:text-[16px] text-[#F5E6D0] hover:text-[#E8832A] transition-colors duration-200 border-b-2 border-[#E8832A] pb-0.5"
            style={{ fontFamily: 'var(--font-text)' }}
          >
            <span>Consultar pratos do dia no WhatsApp</span>
            <ArrowUpRight className="w-4 h-4 text-[#E8832A]" />
          </a>
        </div>

        {/* Linha Pequena de Drinks (substitui o card "Drinks da Casa") */}
        {/*
          Card anterior preservado para referência:
          "Drinks da Casa: Coquetéis autorais em tons âmbar, infusões de botânicos da mata, caipirinhas de frutas locais e chopp trincando."
        */}
        <p
          ref={bottomDrinksRef}
          className="mt-6 font-text text-[15px] text-[#F5E6D0]/75"
          style={{ fontFamily: 'var(--font-text)' }}
        >
          E para brindar: coquetelaria autoral e chopp trincando.
        </p>
      </div>
    </section>
  );
};

export default KitchenSection;
