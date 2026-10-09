import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/config';
import { TacasIcon } from '@/components/icons/TacasIcon';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// CONFIGURAÇÃO CENTRALIZADA DAS FOTOS DA COLAGEM
// Para trocar qualquer foto depois, altere apenas esta constante!
// ============================================================================
const EVENT_PHOTOS = {
  photoA: {
    src: '/images/ambiente/eventos-mesa.webp',
    alt: 'Mesa de celebração no Braseiro Caiçara com risoto de frutos do mar e taça de vinho',
    width: 1050,
    height: 1400,
  },
  photoB: {
    src: '/images/ambiente/ambiente-drinks.webp',
    alt: 'Balcão de coquetelaria e ambiente acolhedor no Braseiro Caiçara',
    width: 1050,
    height: 1400,
  },
  photoC: {
    src: '/images/pratos/prato-corte-nobre.webp',
    alt: 'Tábua farta de corte nobre com guarnições rústicas na parrilla',
    width: 1200,
    height: 960,
  },
};

export const EventsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Colagem e cards
  const collageRef = useRef<HTMLDivElement>(null);
  const cardARef = useRef<HTMLDivElement>(null);
  const cardBRef = useRef<HTMLDivElement>(null);
  const cardCRef = useRef<HTMLDivElement>(null);

  // Título e máscaras
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const line1WrapperRef = useRef<HTMLDivElement>(null);
  const line1InnerRef = useRef<HTMLSpanElement>(null);
  const line2WrapperRef = useRef<HTMLDivElement>(null);
  const line2InnerRef = useRef<HTMLDivElement>(null);
  const glassesIconRef = useRef<HTMLSpanElement>(null);

  // Textos, itens e botão
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1) ENTRADA DA COLAGEM POLAROIDE
      const cards = [cardARef.current, cardBRef.current, cardCRef.current].filter(Boolean);
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 35, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            stagger: 0.14,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: collageRef.current || sectionRef.current,
              start: 'top 82%',
              once: true,
            },
          }
        );

        // Parallax sutil no scroll (apenas desktop >= 1024px)
        if (window.innerWidth >= 1024) {
          if (cardARef.current) {
            gsap.to(cardARef.current, {
              y: -15,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
              },
            });
          }
          if (cardBRef.current) {
            gsap.to(cardBRef.current, {
              y: 20,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
              },
            });
          }
          if (cardCRef.current) {
            gsap.to(cardCRef.current, {
              y: -8,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            });
          }
        }
      }

      // 2) TÍTULO: EYEBROW + MÁSCARAS DE H2
      const lineWrappers = [line1WrapperRef.current, line2WrapperRef.current].filter(Boolean);

      const titleTl = gsap.timeline({
        scrollTrigger: {
          trigger: titleContainerRef.current || sectionRef.current,
          start: 'top 82%',
          once: true,
        },
        onComplete: () => {
          // Folga nas máscaras: visible após concluir animação para não cortar descendentes/itálico
          lineWrappers.forEach((w) => {
            if (w) w.style.overflow = 'visible';
          });
        },
      });

      // Eyebrow fade-in
      if (eyebrowRef.current) {
        titleTl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        );
      }

      // Linha 1: "SEMPRE CABE"
      if (line1InnerRef.current) {
        titleTl.fromTo(
          line1InnerRef.current,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
          '-=0.4'
        );
      }

      // Linha 2: "mais um"
      if (line2InnerRef.current) {
        titleTl.fromTo(
          line2InnerRef.current,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.85, ease: 'power3.out' },
          '-=0.6'
        );
      }

      // Pop do ícone das taças
      if (glassesIconRef.current) {
        titleTl.fromTo(
          glassesIconRef.current,
          { scale: 0.5, rotate: 16, opacity: 0 },
          { scale: 1, rotate: 6, opacity: 1, duration: 0.65, ease: 'back.out(1.7)' },
          '-=0.45'
        );
      }

      // 3) ANIMAÇÃO CONTÍNUA DO ÍCONE DAS TAÇAS (BRINDE + FAÍSCAS)
      const svg = glassesIconRef.current?.querySelector('svg');
      const glassLeft = svg?.querySelector('.icon-glass-left');
      const glassRight = svg?.querySelector('.icon-glass-right');
      const spark1 = svg?.querySelector('.icon-spark--1');
      const spark2 = svg?.querySelector('.icon-spark--2');
      const spark3 = svg?.querySelector('.icon-spark--3');

      const loopTweens: (gsap.core.Tween | gsap.core.Timeline)[] = [];

      // Brinde periódico (as duas taças inclinam ~4deg uma contra a outra e voltam)
      if (glassLeft && glassRight) {
        const toastTl = gsap.timeline({ repeat: -1, repeatDelay: 3.5 });
        toastTl
          .to(glassLeft, { rotate: 5, duration: 0.22, ease: 'power2.in' })
          .to(glassRight, { rotate: -5, duration: 0.22, ease: 'power2.in' }, '<')
          .to(glassLeft, { rotate: 0, duration: 0.38, ease: 'elastic.out(1.2, 0.4)' })
          .to(glassRight, { rotate: 0, duration: 0.38, ease: 'elastic.out(1.2, 0.4)' }, '<');
        loopTweens.push(toastTl);
      }

      // Faíscas
      if (spark1) {
        const s1 = gsap.fromTo(
          spark1,
          { y: 0, opacity: 0.9, scale: 1 },
          {
            y: -20,
            opacity: 0,
            scale: 0.6,
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
          { y: 0, opacity: 0.9, scale: 1 },
          {
            y: -26,
            opacity: 0,
            scale: 0.5,
            duration: 1.7,
            repeat: -1,
            ease: 'power1.out',
            delay: 0.4,
          }
        );
        loopTweens.push(s2);
      }

      if (spark3) {
        const s3 = gsap.fromTo(
          spark3,
          { y: 0, opacity: 0.9, scale: 1 },
          {
            y: -22,
            opacity: 0,
            scale: 0.55,
            duration: 2.3,
            repeat: -1,
            ease: 'power1.out',
            delay: 0.75,
          }
        );
        loopTweens.push(s3);
      }

      // Pausar loops fora da viewport para performance
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

      // 4) FADE-UP DO PARÁGRAFO, ITENS E BOTÃO
      const copyEls = [
        paragraphRef.current,
        ...(itemsRef.current ? Array.from(itemsRef.current.children) : []),
        buttonContainerRef.current,
      ].filter(Boolean);

      if (copyEls.length > 0) {
        gsap.fromTo(
          copyEls,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: paragraphRef.current || sectionRef.current,
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
      id="eventos"
      ref={sectionRef}
      className="relative w-full overflow-x-clip bg-[#F5E6D0] text-[#14100D] py-[clamp(72px,8vw,120px)] px-[clamp(24px,5vw,80px)] scroll-mt-16"
      style={{
        // Transição limpa com a seção anterior e posterior (sem linhas ou sombras)
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
      {/* CONTAINER PRINCIPAL DO LAYOUT                                   */}
      {/* ============================================================== */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Grid de 2 colunas no desktop (≥1024px) / Empilhado no mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-[clamp(36px,5vw,72px)] items-center">
          {/* ========================================================== */}
          {/* COLUNA ESQUERDA (DESKTOP) / INFERIOR (MOBILE): COLAGEM     */}
          {/* ========================================================== */}
          <div className="w-full flex justify-center order-2 lg:order-1">
            <div
              ref={collageRef}
              className="relative w-full max-w-[560px] aspect-[1/1.02] sm:aspect-[1/0.95]"
            >
              {/* FOTO A (Topo Esquerda): rotate(-4deg), proporção 4:5, ~46% largura */}
              <div
                ref={cardARef}
                className="absolute top-0 left-0 w-[47%] z-10 select-none transition-transform duration-500 ease-out hover:z-30 hover:scale-[1.02]"
                style={{
                  transform: 'rotate(-4deg)',
                }}
              >
                <div
                  className="bg-[#FBF3E4] p-[10px_10px_32px_10px] sm:p-[12px_12px_38px_12px]"
                  style={{
                    boxShadow:
                      '0 10px 24px rgba(20,16,13,0.22), 0 2px 6px rgba(20,16,13,0.18)',
                  }}
                >
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#14100D]/5">
                    <img
                      src={EVENT_PHOTOS.photoA.src}
                      alt={EVENT_PHOTOS.photoA.alt}
                      width={EVENT_PHOTOS.photoA.width}
                      height={EVENT_PHOTOS.photoA.height}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
              </div>

              {/* FOTO B (Topo Direita): rotate(2deg), proporção 4:5, ~44% largura */}
              <div
                ref={cardBRef}
                className="absolute top-[4%] right-0 w-[45%] z-0 select-none transition-transform duration-500 ease-out hover:z-30 hover:scale-[1.02]"
                style={{
                  transform: 'rotate(2deg)',
                }}
              >
                <div
                  className="bg-[#FBF3E4] p-[10px_10px_32px_10px] sm:p-[12px_12px_38px_12px]"
                  style={{
                    boxShadow:
                      '0 10px 24px rgba(20,16,13,0.22), 0 2px 6px rgba(20,16,13,0.18)',
                  }}
                >
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#14100D]/5">
                    <img
                      src={EVENT_PHOTOS.photoB.src}
                      alt={EVENT_PHOTOS.photoB.alt}
                      width={EVENT_PHOTOS.photoB.width}
                      height={EVENT_PHOTOS.photoB.height}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
              </div>

              {/* FOTO C (Base Maior): rotate(-2deg), proporção 5:4, ~60% largura, sobrepõe A e B */}
              <div
                ref={cardCRef}
                className="absolute bottom-0 left-[18%] sm:left-[16%] w-[62%] sm:w-[59%] z-20 select-none transition-transform duration-500 ease-out hover:z-30 hover:scale-[1.02]"
                style={{
                  transform: 'rotate(-2deg)',
                }}
              >
                <div
                  className="bg-[#FBF3E4] p-[10px_10px_32px_10px] sm:p-[12px_12px_38px_12px]"
                  style={{
                    boxShadow:
                      '0 14px 28px rgba(20,16,13,0.25), 0 3px 8px rgba(20,16,13,0.18)',
                  }}
                >
                  <div className="relative w-full aspect-[5/4] overflow-hidden bg-[#14100D]/5">
                    <img
                      src={EVENT_PHOTOS.photoC.src}
                      alt={EVENT_PHOTOS.photoC.alt}
                      width={EVENT_PHOTOS.photoC.width}
                      height={EVENT_PHOTOS.photoC.height}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* COLUNA DIREITA (DESKTOP) / SUPERIOR (MOBILE): TEXTO        */}
          {/* ========================================================== */}
          <div className="w-full flex flex-col justify-center order-1 lg:order-2 text-left">
            {/* Bloco de Título */}
            <div ref={titleContainerRef} className="w-full flex flex-col items-start">
              {/* Eyebrow: ANIVERSÁRIO, GRUPO OU COMEMORAÇÃO? */}
              <div
                ref={eyebrowRef}
                className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 w-full"
              >
                <span className="w-6 sm:w-8 h-[1px] bg-[#14100D]/40 inline-block shrink-0" />
                <span
                  className="font-ui font-semibold uppercase tracking-[0.2em] text-[12px] sm:text-[13px] text-[#14100D] select-none"
                  style={{ fontFamily: 'var(--font-text)' }}
                >
                  ANIVERSÁRIO, GRUPO OU COMEMORAÇÃO?
                </span>
                <span className="w-6 sm:w-8 h-[1px] bg-[#14100D]/40 inline-block shrink-0" />
              </div>

              {/* H2 em bloco de 2 linhas */}
              <h2
                className="relative flex flex-col items-start justify-center font-display text-left m-0 select-none w-full"
                aria-label="Sempre cabe mais um"
              >
                <span className="sr-only">Sempre cabe mais um</span>

                {/* Linha 1: SEMPRE CABE */}
                <div
                  ref={line1WrapperRef}
                  className="line-wrapper block max-w-full"
                  style={{
                    overflow: prefersReducedMotion ? 'visible' : 'hidden',
                    padding: '0.22em 0.18em 0.3em',
                    margin: '-0.22em -0.18em -0.3em',
                  }}
                  aria-hidden="true"
                >
                  <span
                    ref={line1InnerRef}
                    className="block uppercase whitespace-nowrap text-[#14100D] text-[clamp(1.4rem,7vw,2.2rem)] lg:text-[clamp(1.8rem,3.4vw,3.2rem)]"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      wordSpacing: '0.12em',
                      lineHeight: 1.1,
                      fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
                    }}
                  >
                    SEMPRE CABE
                  </span>
                </div>

                {/* Linha 2: "mais um" + Ícone das Taças */}
                <div
                  ref={line2WrapperRef}
                  className="line-wrapper block max-w-full"
                  style={{
                    overflow: prefersReducedMotion ? 'visible' : 'hidden',
                    padding: '0.22em 0.18em 0.3em',
                    margin: '-0.22em -0.18em -0.3em',
                  }}
                  aria-hidden="true"
                >
                  <div
                    ref={line2InnerRef}
                    className="inline-flex items-center justify-start max-w-full text-[clamp(4.2rem,21vw,6.4rem)] lg:text-[clamp(5.2rem,10vw,9.2rem)]"
                    style={{
                      fontFamily: 'var(--font-display)',
                      lineHeight: 0.85,
                      marginTop: '-0.06em',
                    }}
                  >
                    <span
                      className="inline-block lowercase italic text-[#E8832A] whitespace-nowrap"
                      style={{
                        fontWeight: 900,
                        fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
                      }}
                    >
                      mais um
                    </span>

                    {/* Ícone das Taças Brindando */}
                    <span
                      ref={glassesIconRef}
                      aria-hidden="true"
                      className="inline-block select-none pointer-events-none origin-bottom"
                      style={{
                        height: '0.62em',
                        width: 'auto',
                        verticalAlign: 'top',
                        marginLeft: '-0.05em',
                        marginTop: '-0.15em',
                        transform: 'rotate(6deg)',
                      }}
                    >
                      <TacasIcon className="h-full w-auto inline-block align-top" />
                    </span>
                  </div>
                </div>
              </h2>
            </div>

            {/* Parágrafo de Apoio Enxuto (~32 palavras) */}
            <p
              ref={paragraphRef}
              className="mt-6 font-text font-normal text-[#14100D]/90 text-[clamp(1rem,1.15vw,1.125rem)] leading-[1.65] max-w-[42ch]"
              style={{
                fontFamily: 'var(--font-text)',
                textWrap: 'pretty',
              }}
            >
              Aniversário, família depois da praia ou turma de amigos com chopp gelado e tábuas fartas de parrilla: a gente cuida de tudo para você só se preocupar em brindar.
            </p>

            {/* 3 Itens com Marcador Traço Laranja (Pincelada/Gis) */}
            {/*
              Copy anterior preservada para referência futura:
              - "Mesas reservadas e integradas para grupos a partir de 8 pessoas"
              - "Cardápios compartilhados de carnes nobres e frutos do mar"
              - "Atendimento personalizado direto com nossos anfitriões"
              - “Mesa caiçara é mesa farta: puxa a cadeira, que aqui sempre cabe mais um.”
              TODO: Caso necessário reaproveitar os textos longos em página dedicada de reservas/eventos.
            */}
            <ul ref={itemsRef} className="mt-6 space-y-3.5">
              <li className="flex items-start gap-3.5">
                {/* Traço laranja pincelado */}
                <span
                  aria-hidden="true"
                  className="inline-block shrink-0 rounded-full bg-[#E8832A] mt-2.5"
                  style={{
                    width: '22px',
                    height: '5px',
                    transform: 'rotate(-8deg)',
                  }}
                />
                <span
                  className="font-text font-medium text-[#14100D] text-[15px] sm:text-[16px] leading-[1.5]"
                  style={{ fontFamily: 'var(--font-text)' }}
                >
                  Mesas integradas para grupos a partir de 8 pessoas
                </span>
              </li>

              <li className="flex items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className="inline-block shrink-0 rounded-full bg-[#E8832A] mt-2.5"
                  style={{
                    width: '22px',
                    height: '5px',
                    transform: 'rotate(-8deg)',
                  }}
                />
                <span
                  className="font-text font-medium text-[#14100D] text-[15px] sm:text-[16px] leading-[1.5]"
                  style={{ fontFamily: 'var(--font-text)' }}
                >
                  Cardápios compartilhados de carnes e frutos do mar
                </span>
              </li>

              <li className="flex items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className="inline-block shrink-0 rounded-full bg-[#E8832A] mt-2.5"
                  style={{
                    width: '22px',
                    height: '5px',
                    transform: 'rotate(-8deg)',
                  }}
                />
                <span
                  className="font-text font-medium text-[#14100D] text-[15px] sm:text-[16px] leading-[1.5]"
                  style={{ fontFamily: 'var(--font-text)' }}
                >
                  Atendimento direto com nossos anfitriões
                </span>
              </li>
            </ul>

            {/* Botão de Ação (Carvão #14100D com texto Creme #F5E6D0) */}
            <div ref={buttonContainerRef} className="mt-8 pt-1">
              <a
                href={siteConfig.whatsappEventUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[6px] bg-[#14100D] text-[#F5E6D0] hover:bg-[#E8832A] hover:text-[#14100D] active:translate-y-0.5 transition-all duration-300 font-text font-semibold uppercase tracking-[0.08em] text-[14px] sm:text-[15px] shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8832A]"
                style={{ fontFamily: 'var(--font-text)' }}
              >
                <span>PLANEJAR MEU EVENTO</span>
                <ArrowUpRight className="w-[18px] h-[18px]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
