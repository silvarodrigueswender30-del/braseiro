import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * CONFIGURAÇÃO DOS CARDS DE CARDÁPIO (Único ponto de edição)
 * TODO: trocar os vídeos por clipes definitivos (um por cardápio); o de drinks e o de executivos são provisórios
 * TODO: substituir por visualizador interno do cardápio
 */
export const MENU_CARDS = [
  {
    id: 'gastronomia',
    numero: '01',
    titulo: 'gastronomia',
    href: 'https://www.braseirocaicara.com/gastronomia-atualizado',
    video: 'https://jszueizwowynhekpsfii.supabase.co/storage/v1/object/public/braseiro/carne.mp4',
    poster: '/images/pratos/gastronomia-poster.webp',
    ariaLabel: 'Ver cardápio de gastronomia',
  },
  {
    id: 'drinks',
    numero: '02',
    titulo: 'drinks',
    href: 'https://www.braseirocaicara.com/drinks',
    // Provisório: vídeo 3 da Hero hospedado no Supabase (trecho / provisório conforme prompt)
    video: 'https://jszueizwowynhekpsfii.supabase.co/storage/v1/object/public/braseiro/vid3.mp4',
    poster: '/images/pratos/drinks-poster.webp',
    ariaLabel: 'Ver cardápio de drinks',
  },
  {
    id: 'executivos',
    numero: '03',
    titulo: 'executivos',
    href: 'https://www.braseirocaicara.com/executivos',
    // Provisório: clipe mar.mp4 hospedado no Supabase
    video: 'https://jszueizwowynhekpsfii.supabase.co/storage/v1/object/public/braseiro/mar.mp4',
    poster: '/images/pratos/executivos-poster.webp',
    ariaLabel: 'Ver cardápio de executivos',
  },
] as const;

/**
 * TEXTOS E ELEMENTOS ANTERIORES REMOVIDOS (PRESERVADOS PARA REFERÊNCIA):
 * - Título anterior: "Os pratos da casa" (font-condensed uppercase) + divisor com losango/chama
 * - Subtítulo anterior: "Receitas feitas com o calor da lenha e o frescor da maré de Ubatuba."
 * - Setas de navegação do carrossel desktop (ChevronLeft/ChevronRight) e barra de progresso
 * - Pílulas de categoria: "CARNES", "FRUTOS DO MAR", "BEBIDAS"
 * - Prato 1 (inventado): "Corte nobre na brasa" ("Picanha de parrilla selada na lenha com sal grosso e chimichurri artesanal.")
 * - Prato 2 (inventado): "Arroz caiçara de frutos do mar" ("Polvo grelhado, camarões pistola e mariscos frescos com arroz caldoso aromático.")
 * - Prato 3 (inventado): "Coquetel cítrico da casa" ("Coquetel autoral com cachaça de alambique local, xarope de capim-santo e cítricos.")
 * - Botões anteriores: "PEDIR PELO WHATSAPP"
 */

export const SignatureDishesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Título e máscaras
  const titleLine1WrapperRef = useRef<HTMLSpanElement>(null);
  const titleLine1InnerRef = useRef<HTMLSpanElement>(null);
  const titleLine2WrapperRef = useRef<HTMLSpanElement>(null);
  const titleLine2InnerRef = useRef<HTMLSpanElement>(null);

  // Cards e vídeos desktop
  const desktopCardsContainerRef = useRef<HTMLDivElement>(null);
  const desktopCardRefs = useRef<(HTMLElement | null)[]>([]);
  const desktopVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const desktopWordWrapperRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const desktopWordInnerRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Mobile carrossel
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const mobileCardRefs = useRef<(HTMLElement | null)[]>([]);
  const mobileVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Estado mobile e hover desktop
  const [activeMobileIdx, setActiveMobileIdx] = useState(0);
  const [hoveredCardIdx, setHoveredCardIdx] = useState<number | null>(null);
  const [videoErrors, setVideoErrors] = useState<Record<string, boolean>>({});

  // Preferência de movimento reduzido
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

    const allVideos = () => [
      ...desktopVideoRefs.current.filter(Boolean),
      ...mobileVideoRefs.current.filter(Boolean),
    ];

    const updateVideoPlayback = () => {
      const isDesktop = window.innerWidth >= 1024;
      const shouldPlayGeneral = isSectionVisible40 && isDocVisible;

      if (!shouldPlayGeneral) {
        allVideos().forEach((vid) => {
          if (vid && !vid.paused) vid.pause();
        });
        return;
      }

      if (isDesktop) {
        // No desktop, tocam os 3 vídeos da seção (máx 3 simultâneos)
        desktopVideoRefs.current.forEach((vid) => {
          if (vid && vid.src && vid.paused) {
            vid.play().catch(() => {});
          }
        });
        // Pausar mobile se houver
        mobileVideoRefs.current.forEach((vid) => {
          if (vid && !vid.paused) vid.pause();
        });
      } else {
        // No mobile, apenas o card ativo toca; os outros pausam
        mobileVideoRefs.current.forEach((vid, idx) => {
          if (!vid) return;
          if (idx === activeMobileIdx) {
            if (vid.src && vid.paused) {
              vid.play().catch(() => {});
            }
          } else {
            if (!vid.paused) vid.pause();
          }
        });
        // Pausar desktop
        desktopVideoRefs.current.forEach((vid) => {
          if (vid && !vid.paused) vid.pause();
        });
      }
    };

    // Observer 1: Carregar src dos vídeos apenas quando a até 400px da viewport
    const preloadObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isSectionNear) {
            isSectionNear = true;
            MENU_CARDS.forEach((card, idx) => {
              const dVid = desktopVideoRefs.current[idx];
              if (dVid && !dVid.src && !videoErrors[card.id]) {
                dVid.src = card.video;
                dVid.load();
              }
              const mVid = mobileVideoRefs.current[idx];
              if (mVid && !mVid.src && !videoErrors[card.id]) {
                mVid.src = card.video;
                mVid.load();
              }
            });
          }
        });
      },
      { rootMargin: '400px' }
    );
    preloadObserver.observe(sectionEl);

    // Observer 2: Play com 40% visível, pause ao sair
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

    const handleVisibility = () => {
      isDocVisible = !document.hidden;
      updateVideoPlayback();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const handleResize = () => {
      updateVideoPlayback();
    };
    window.addEventListener('resize', handleResize);

    // Atualizar quando mudar o card ativo no mobile
    updateVideoPlayback();

    return () => {
      preloadObserver.disconnect();
      playbackObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', handleResize);
    };
  }, [prefersReducedMotion, activeMobileIdx, videoErrors]);

  // 2) OBSERVER DO CARROSSEL MOBILE (SYNC DOS PONTINHOS E VÍDEO ATIVO)
  useEffect(() => {
    const carouselEl = mobileCarouselRef.current;
    if (!carouselEl) return;

    const cards = mobileCardRefs.current.filter(Boolean) as HTMLElement[];
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = cards.indexOf(entry.target as HTMLElement);
            if (idx !== -1) {
              setActiveMobileIdx(idx);
            }
          }
        });
      },
      {
        root: carouselEl,
        threshold: 0.6,
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  // 3) ANIMAÇÕES GSAP (SCROLLTRIGGER)
  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Timeline do Título (Linha 1 "OS PRATOS" e Linha 2 "da casa")
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

      if (titleLine1InnerRef.current) {
        titleTl.fromTo(
          titleLine1InnerRef.current,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.75, ease: 'power3.out' }
        );
      }

      if (titleLine2InnerRef.current) {
        titleTl.fromTo(
          titleLine2InnerRef.current,
          { yPercent: 100, scale: 0.94, opacity: 0 },
          { yPercent: 0, scale: 1, opacity: 1, duration: 0.85, ease: 'power3.out' },
          '-=0.55'
        );
      }

      // Cards Desktop: entram com y 48 -> 0 e fade, com zoom suave no vídeo
      const validDesktopCards = desktopCardRefs.current.filter(Boolean);
      if (validDesktopCards.length > 0 && desktopCardsContainerRef.current) {
        const cardsTl = gsap.timeline({
          scrollTrigger: {
            trigger: desktopCardsContainerRef.current,
            start: 'top 75%',
            once: true,
          },
          onComplete: () => {
            desktopWordWrapperRefs.current.forEach((w) => {
              if (w) w.style.overflow = 'visible';
            });
          },
        });

        cardsTl.fromTo(
          validDesktopCards,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.14,
            ease: 'power2.out',
          }
        );

        // Revelação das palavras dos cards
        const validWordInners = desktopWordInnerRefs.current.filter(Boolean);
        if (validWordInners.length > 0) {
          cardsTl.fromTo(
            validWordInners,
            { yPercent: 100, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.12,
              ease: 'power3.out',
            },
            '-=0.5'
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Scroll suave no mobile ao clicar no pontinho
  const scrollMobileTo = useCallback((index: number) => {
    const targetCard = mobileCardRefs.current[index];
    if (targetCard && mobileCarouselRef.current) {
      targetCard.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, []);

  const handleVideoError = (cardId: string) => {
    setVideoErrors((prev) => ({ ...prev, [cardId]: true }));
  };

  return (
    <section
      id="pratos"
      ref={sectionRef}
      className="grao relative w-full overflow-x-clip bg-[#F5E6D0] text-[#14100D] scroll-mt-16"
      style={{
        backgroundColor: '#F5E6D0',
        paddingTop: 'clamp(72px, 8vw, 120px)',
        paddingBottom: 'clamp(72px, 8vw, 120px)',
        paddingLeft: 'clamp(24px, 5vw, 80px)',
        paddingRight: 'clamp(24px, 5vw, 80px)',
      }}
    >
      {/* ============================================================== */}
      {/* TEXTURA DE GRÃO 3% OPACIDADE                                   */}
      {/* ============================================================== */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto flex flex-col items-center">
        {/* ============================================================ */}
        {/* CABEÇALHO DA SEÇÃO (EYEBROW + TÍTULO EM 2 LINHAS)            */}
        {/* ============================================================ */}
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow: DA BRASA PRA MESA */}
          <span className="eyebrow text-[#14100D] select-none">
            DA BRASA PRA MESA
          </span>

          {/* H2 com texto acessível e layout visual em 2 linhas */}
          <h2
            className="mt-3 sm:mt-4 flex flex-col items-center text-center m-0 select-none"
            aria-label="Os pratos da casa"
          >
            {/* Linha 1: "OS PRATOS" */}
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
                className="block uppercase text-[#14100D] whitespace-nowrap text-[clamp(1.35rem,6.8vw,2.2rem)] lg:text-[clamp(1.75rem,3.8vw,3.6rem)]"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  wordSpacing: '0.12em',
                  lineHeight: 1.1,
                }}
              >
                OS PRATOS
              </span>
            </span>

            {/* Linha 2: "da casa" (Fraunces 900 itálico, brasa) */}
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
                className="block lowercase italic text-[#E8832A] whitespace-nowrap text-[clamp(4.2rem,21vw,7.2rem)] lg:text-[clamp(5rem,11vw,10rem)]"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
                  lineHeight: 0.85,
                  marginTop: '-0.06em',
                  textShadow: '0 4px 24px rgba(20,16,13,0.12)',
                }}
              >
                da casa
              </span>
            </span>
          </h2>
        </div>

        {/* ============================================================ */}
        {/* CARDS DESKTOP (≥1024px): 3 CARDS VERTICAIS EM FLEX           */}
        {/* ============================================================ */}
        <div
          ref={desktopCardsContainerRef}
          className="hidden lg:flex w-full justify-center items-stretch gap-3"
          style={{
            marginTop: 'clamp(40px, 4.5vw, 72px)',
            height: 'clamp(520px, 33vw, 720px)',
          }}
        >
          {MENU_CARDS.map((card, idx) => {
            const isHovered = hoveredCardIdx === idx;
            const hasHover = hoveredCardIdx !== null;
            const flexValue = prefersReducedMotion
              ? 1
              : hasHover
              ? isHovered
                ? 1.4
                : 0.8
              : 1;

            // Harmonização de tom: leve saturação no vídeo de executivos se necessário
            const isMar = card.id === 'executivos';
            const filterStyle = isMar ? 'saturate(1.05) contrast(1.02)' : undefined;

            return (
              <article
                key={card.id}
                ref={(el) => {
                  desktopCardRefs.current[idx] = el;
                }}
                onMouseEnter={() => setHoveredCardIdx(idx)}
                onMouseLeave={() => setHoveredCardIdx(null)}
                className="relative overflow-hidden shadow-[0_8px_24px_rgba(20,16,13,0.18)] bg-[#14100D] flex flex-col justify-end"
                style={{
                  flex: flexValue,
                  transition: prefersReducedMotion
                    ? 'none'
                    : 'flex 600ms cubic-bezier(0.2, 0.7, 0.2, 1)',
                  containerType: 'inline-size',
                }}
              >
                {/* Poster fixo WebP de fallback e carregamento inicial */}
                <img
                  src={card.poster}
                  alt=""
                  width={900}
                  height={1600}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
                  style={{ filter: filterStyle }}
                />

                {/* Vídeo remoto em looping silencioso */}
                {!prefersReducedMotion && !videoErrors[card.id] && (
                  <video
                    ref={(el) => {
                      desktopVideoRefs.current[idx] = el;
                    }}
                    poster={card.poster}
                    muted
                    loop
                    playsInline
                    preload="none"
                    aria-hidden="true"
                    onError={() => handleVideoError(card.id)}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
                    style={{ filter: filterStyle }}
                  />
                )}

                {/* Overlays em CSS puro (sem backdrop-filter) */}
                {/* Camada 1: Base suave 12% */}
                <div className="absolute inset-0 bg-[#14100D]/12 pointer-events-none z-[1]" />

                {/* Camada 2: Gradiente inferior para contraste AA */}
                <div
                  className="absolute inset-0 pointer-events-none z-[2]"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(20,16,13,0.94) 0%, rgba(20,16,13,0.72) 26%, transparent 55%)',
                  }}
                />

                {/* Conteúdo na base do card */}
                <div className="relative z-10 w-full flex flex-col items-center text-center px-4 pb-7">
                  {/* Numeração: 01 / 02 / 03 */}
                  <span
                    className="font-text font-semibold uppercase text-[13px] text-[#F5E6D0]/90 select-none tracking-[0.25em]"
                    style={{ fontFamily: 'var(--font-text)' }}
                  >
                    {card.numero}
                  </span>

                  {/* Título gigante adesivo */}
                  <div
                    ref={(el) => {
                      desktopWordWrapperRefs.current[idx] = el;
                    }}
                    className="line-wrapper block w-full mt-1.5"
                    style={{
                      overflow: prefersReducedMotion ? 'visible' : 'hidden',
                      padding: '0.22em 0.18em 0.3em',
                      margin: '-0.22em -0.18em -0.3em',
                    }}
                  >
                    <h3
                      ref={(el) => {
                        desktopWordInnerRefs.current[idx] = el;
                      }}
                      className="block lowercase italic text-[#F5E6D0] whitespace-nowrap m-0 select-none"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 900,
                        fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
                        lineHeight: 0.9,
                        // Tamanho responsivo por container query (cqi da largura do card)
                        fontSize:
                          card.id === 'gastronomia'
                            ? 'clamp(2rem, 14.5cqi, 3.8rem)'
                            : card.id === 'drinks'
                            ? 'clamp(2.4rem, 26cqi, 5.8rem)'
                            : 'clamp(2rem, 16cqi, 4.2rem)',
                        WebkitTextStroke: '0.07em #14100D',
                        paintOrder: 'stroke fill',
                        strokeLinejoin: 'round',
                        textShadow: '0 4px 18px rgba(0,0,0,0.5)',
                      }}
                    >
                      {card.titulo}
                    </h3>
                  </div>

                  {/* Botão pequeno "VER CARDÁPIO" com pseudo-elemento cobrindo o card */}
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={card.ariaLabel}
                    className="mt-4 inline-flex items-center justify-center rounded-[6px] bg-[#F5E6D0] text-[#14100D] hover:bg-[#E8832A] hover:text-[#14100D] transition-colors duration-200 font-text font-semibold uppercase text-[13px] tracking-[0.08em] py-[10px] px-[22px] select-none shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#E8832A] after:absolute after:inset-0 after:z-10 cursor-pointer"
                    style={{ fontFamily: 'var(--font-text)' }}
                  >
                    VER CARDÁPIO
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* CARROSSEL MOBILE (<1024px): SCROLL-SNAP HORIZONTAL           */}
        {/* ============================================================ */}
        <div className="lg:hidden w-full flex flex-col items-center">
          <div
            ref={mobileCarouselRef}
            className="w-full flex gap-3 overflow-x-auto snap-x snap-mandatory py-4 scrollbar-none"
            style={{
              marginTop: 'clamp(36px, 5vw, 48px)',
              paddingLeft: 'max(24px, calc((100vw - 320px) / 2))',
              paddingRight: 'max(24px, calc((100vw - 320px) / 2))',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {MENU_CARDS.map((card, idx) => {
              const isMar = card.id === 'executivos';
              const filterStyle = isMar ? 'saturate(1.05) contrast(1.02)' : undefined;
              const isActive = activeMobileIdx === idx;

              return (
                <article
                  key={card.id}
                  ref={(el) => {
                    mobileCardRefs.current[idx] = el;
                  }}
                  className="relative shrink-0 snap-center w-[78vw] max-w-[340px] aspect-[9/16] overflow-hidden shadow-[0_8px_24px_rgba(20,16,13,0.18)] bg-[#14100D] flex flex-col justify-end transition-transform duration-500"
                  style={{
                    transform: isActive ? 'scale(1)' : 'scale(0.96)',
                    containerType: 'inline-size',
                  }}
                >
                  {/* Poster WebP */}
                  <img
                    src={card.poster}
                    alt=""
                    width={900}
                    height={1600}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
                    style={{ filter: filterStyle }}
                  />

                  {/* Vídeo remoto: só toca se for o card mais visível */}
                  {!prefersReducedMotion && !videoErrors[card.id] && (
                    <video
                      ref={(el) => {
                        mobileVideoRefs.current[idx] = el;
                      }}
                      poster={card.poster}
                      muted
                      loop
                      playsInline
                      preload="none"
                      aria-hidden="true"
                      onError={() => handleVideoError(card.id)}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
                      style={{ filter: filterStyle }}
                    />
                  )}

                  {/* Overlays */}
                  <div className="absolute inset-0 bg-[#14100D]/12 pointer-events-none z-[1]" />
                  <div
                    className="absolute inset-0 pointer-events-none z-[2]"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(20,16,13,0.94) 0%, rgba(20,16,13,0.72) 26%, transparent 55%)',
                    }}
                  />

                  {/* Conteúdo na base do card */}
                  <div className="relative z-10 w-full flex flex-col items-center text-center px-4 pb-7">
                    <span
                      className="font-text font-semibold uppercase text-[13px] text-[#F5E6D0]/90 select-none tracking-[0.25em]"
                      style={{ fontFamily: 'var(--font-text)' }}
                    >
                      {card.numero}
                    </span>

                    <h3
                      className="mt-1 block lowercase italic text-[#F5E6D0] whitespace-nowrap m-0 select-none"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 900,
                        fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
                        lineHeight: 0.9,
                        fontSize:
                          card.id === 'gastronomia'
                            ? 'clamp(2rem, 14.5cqi, 3.4rem)'
                            : card.id === 'drinks'
                            ? 'clamp(2.4rem, 26cqi, 5.2rem)'
                            : 'clamp(2rem, 16cqi, 3.8rem)',
                        WebkitTextStroke: '0.07em #14100D',
                        paintOrder: 'stroke fill',
                        strokeLinejoin: 'round',
                        textShadow: '0 4px 18px rgba(0,0,0,0.5)',
                      }}
                    >
                      {card.titulo}
                    </h3>

                    <a
                      href={card.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={card.ariaLabel}
                      className="mt-4 inline-flex items-center justify-center rounded-[6px] bg-[#F5E6D0] text-[#14100D] hover:bg-[#E8832A] hover:text-[#14100D] transition-colors duration-200 font-text font-semibold uppercase text-[13px] tracking-[0.08em] py-[10px] px-[22px] select-none shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#E8832A] after:absolute after:inset-0 after:z-10 cursor-pointer"
                      style={{ fontFamily: 'var(--font-text)' }}
                    >
                      VER CARDÁPIO
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Indicador de 3 pontinhos para o mobile */}
          <div className="flex items-center justify-center gap-2 mt-4 select-none">
            {MENU_CARDS.map((card, idx) => (
              <button
                key={card.id}
                type="button"
                onClick={() => scrollMobileTo(idx)}
                aria-label={`Ir para cardápio ${card.numero}: ${card.titulo}`}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  activeMobileIdx === idx
                    ? 'bg-[#E8832A] scale-125'
                    : 'bg-[#14100D]/30 hover:bg-[#14100D]/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignatureDishesSection;
