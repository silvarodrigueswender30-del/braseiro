import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChamaIcon } from '@/components/icons/ChamaIcon';

gsap.registerPlugin(ScrollTrigger);

/**
 * CONFIGURAÇÃO CENTRALIZADA DAS AVALIAÇÕES (Único ponto de edição)
 * TODO: confirmar com o restaurante autorização para exibir nome e trechos das avaliações;
 * manter o texto exatamente como publicado no Google;
 * não incluir a nota no carimbo até preencher GOOGLE_RATING com o valor real
 * TODO: colar o link do perfil do Google Meu Negócio
 */
export const GOOGLE_RATING: { nota: number | null; total: number | null } = {
  nota: null,
  total: null,
};

export const GOOGLE_REVIEWS_URL: string = '';

export interface ReviewItem {
  id: number;
  texto: string;
  nome: string;
  cor: 'creme' | 'kraft' | 'laranja';
  rot: number; // graus
  dy: number;  // px
  dx: number;  // px
  tamanho: 'M' | 'L';
}

export const REVIEWS: readonly ReviewItem[] = [
  {
    id: 1,
    texto:
      'A experiência no restaurante foi ótima e comparando com outros lugares em Ubatuba, posso dizer que foi o melhor restaurante que fomos enquanto turistas.',
    nome: 'Luiza N.',
    cor: 'creme',
    rot: -3,
    dy: 0,
    dx: 0,
    tamanho: 'L',
  },
  {
    id: 2,
    texto:
      'Melhor restaurante da cidade! Alguns pratos individuais servem 2 pessoas tranquilamente.',
    nome: 'Alyne M.',
    cor: 'kraft',
    rot: 2,
    dy: 24,
    dx: 0,
    tamanho: 'M',
  },
  {
    id: 3,
    texto:
      'Superou as expectativas! […] Ambiente do restaurante também é ótimo, ficamos na parte voltada pra praia. Muito bom! Vale a pena.',
    nome: 'Vinicius B.',
    cor: 'creme',
    rot: -2,
    dy: -8,
    dx: 0,
    tamanho: 'L',
  },
  {
    id: 4,
    texto:
      'Excelente! Preço muito justo, porções muito bem servidas e a carne espetacular.',
    nome: 'Sarah F.',
    cor: 'laranja',
    rot: 3,
    dy: 20,
    dx: 0,
    tamanho: 'M',
  },
  {
    id: 5,
    texto:
      'Tudo 5 estrelas!! Comida MARAVILHOSA, atendimento perfeito…',
    nome: 'Nathália C.',
    cor: 'laranja',
    rot: 2,
    dy: 0,
    dx: 0,
    tamanho: 'M',
  },
  {
    id: 6,
    texto:
      'A comida estava maravilhosa, pedimos as entradas de casquinha de siri e pastelzinho de camarão que são excelentes, além dos pratos principais que estavam uma delícia.',
    nome: 'Patrick P.',
    cor: 'creme',
    rot: -2.5,
    dy: 14,
    dx: 0,
    tamanho: 'L',
  },
  {
    id: 7,
    texto:
      '[…] a comida estava impecável! Tudo muito saboroso e sem absolutamente nada a reclamar. Experiência excelente!',
    nome: 'Ana Flávia',
    cor: 'kraft',
    rot: 2.5,
    dy: -6,
    dx: 0,
    tamanho: 'L',
  },
  {
    id: 8,
    texto:
      'Comida excelente, ambiente super aconchegante e uma experiência muito agradável.',
    nome: 'Leticia B.',
    cor: 'creme',
    rot: -3,
    dy: 18,
    dx: 0,
    tamanho: 'M',
  },
] as const;

/**
 * TEXTOS E ELEMENTOS ANTERIORES REMOVIDOS (PRESERVADOS PARA REFERÊNCIA):
 * - Título anterior: "Quem já sentou à mesa" (font-condensed uppercase 3xl sm:5xl text-[#F3E6D0])
 * - Subtítulo / Frase: "“O melhor elogio do assador é prato limpo e riso solto.”"
 * - Divisor com losango e chama (<Divider variant="flame" />)
 * - 3 cards com borda e radius, aspas decorativas (lucide Quote) e estrelas preenchidas
 * - Etiquetas "[SUBSTITUIR por avaliação real do Google]", nomes "[CONFIRMAR]", locais e datas inventadas
 * - Selo no rodapé: "Avaliações integradas ao Google Meu Negócio de Ubatuba [CONFIRMAR]" com ícone MessageSquare
 */

// Paleta dos papéis de recorte
const PAPER_COLORS: Record<'creme' | 'kraft' | 'laranja', { bg: string; starColor: string }> = {
  creme: { bg: '#F5E6D0', starColor: '#C4631A' },
  kraft: { bg: '#C9A878', starColor: '#14100D' },
  laranja: { bg: '#F2A55E', starColor: '#14100D' },
};

// SVG de estrela 14px simples
const StarIcon: React.FC<{ fill: string }> = ({ fill }) => (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    fill={fill}
    aria-hidden="true"
    className="shrink-0"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export const ReviewsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Título e máscaras
  const titleLine1WrapperRef = useRef<HTMLSpanElement>(null);
  const titleLine1InnerRef = useRef<HTMLSpanElement>(null);
  const titleLine2WrapperRef = useRef<HTMLSpanElement>(null);
  const titleLine2InnerRef = useRef<HTMLSpanElement>(null);
  const chamaRef = useRef<HTMLSpanElement>(null);

  // Mural Desktop
  const muralContainerRef = useRef<HTMLDivElement>(null);
  const cardOuterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardInnerRefs = useRef<(HTMLElement | null)[]>([]);
  const stampRef = useRef<HTMLDivElement>(null);
  const footerLinkRef = useRef<HTMLDivElement>(null);

  // Mobile Carousel
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const mobileCardRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeMobileIdx, setActiveMobileIdx] = useState<number>(0);
  const [hoveredCardIdx, setHoveredCardIdx] = useState<number | null>(null);

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

  // 1) IntersectionObserver para Carrossel Mobile
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

  // 2) Scroll para card no mobile ao clicar no pontinho
  const scrollMobileTo = (idx: number) => {
    const carousel = mobileCarouselRef.current;
    const targetCard = mobileCardRefs.current[idx];
    if (!carousel || !targetCard) return;

    const left = targetCard.offsetLeft - (carousel.clientWidth - targetCard.clientWidth) / 2;
    carousel.scrollTo({
      left,
      behavior: 'smooth',
    });
    setActiveMobileIdx(idx);
  };

  // 3) Animações GSAP + ScrollTrigger
  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // -------------------------------------------------------------
      // A) TIMELINE DO TÍTULO COM MÁSCARAS
      // -------------------------------------------------------------
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

      // Linha 1: QUEM JÁ SENTOU À
      if (titleLine1InnerRef.current) {
        titleTl.fromTo(
          titleLine1InnerRef.current,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.75, ease: 'power3.out' }
        );
      }

      // Linha 2: "mesa" entra por último com scale 0.94 -> 1
      if (titleLine2InnerRef.current) {
        titleTl.fromTo(
          titleLine2InnerRef.current,
          { yPercent: 100, scale: 0.94, opacity: 0 },
          { yPercent: 0, scale: 1, opacity: 1, duration: 0.85, ease: 'power3.out' },
          '-=0.63' // stagger 0.12s
        );
      }

      // Chama com pop (scale 0.5 -> 1, rotate 20deg -> 6deg, back.out)
      if (chamaRef.current) {
        titleTl.fromTo(
          chamaRef.current,
          { scale: 0.5, rotate: 20, opacity: 0 },
          { scale: 1, rotate: 6, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
          '-=0.45'
        );
      }

      // -------------------------------------------------------------
      // B) LOOPS CONTÍNUOS DA CHAMA (faíscas + wobble do corpo)
      // -------------------------------------------------------------
      const chamaSvg = chamaRef.current?.querySelector('svg');
      const bodyEl = chamaSvg?.querySelector('.icon-body');
      const spark1El = chamaSvg?.querySelector('.icon-spark--1');
      const spark2El = chamaSvg?.querySelector('.icon-spark--2');

      const flameLoopTweens: gsap.core.Tween[] = [];

      if (bodyEl) {
        const bodyTween = gsap.fromTo(
          bodyEl,
          { rotate: 0 },
          {
            rotate: 3,
            transformOrigin: '50% 100%',
            duration: 2.4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          }
        );
        flameLoopTweens.push(bodyTween);
      }

      if (spark1El) {
        const s1Tween = gsap.fromTo(
          spark1El,
          { y: 0, opacity: 1, scale: 1 },
          {
            y: -26,
            opacity: 0,
            scale: 0.6,
            duration: 1.2,
            repeat: -1,
            ease: 'power1.out',
            delay: 0.1,
          }
        );
        flameLoopTweens.push(s1Tween);
      }

      if (spark2El) {
        const s2Tween = gsap.fromTo(
          spark2El,
          { y: 0, opacity: 1, scale: 1 },
          {
            y: -30,
            opacity: 0,
            scale: 0.5,
            duration: 1.7,
            repeat: -1,
            ease: 'power1.out',
            delay: 0.45,
          }
        );
        flameLoopTweens.push(s2Tween);
      }

      // -------------------------------------------------------------
      // C) ENTRADA DOS RECORTES DESKTOP (ELEMENTO EXTERNO)
      // -------------------------------------------------------------
      const validOuterCards = cardOuterRefs.current.filter(Boolean) as HTMLDivElement[];
      const floatingTweens: gsap.core.Tween[] = [];

      if (validOuterCards.length > 0 && muralContainerRef.current) {
        // Disparada com ScrollTrigger start "top 78%", uma vez
        const muralTl = gsap.timeline({
          scrollTrigger: {
            trigger: muralContainerRef.current,
            start: 'top 78%',
            once: true,
          },
          onComplete: () => {
            // Iniciar a flutuação em repouso após a entrada
            validOuterCards.forEach((outerEl, i) => {
              const review = REVIEWS[i];
              if (!outerEl || !review) return;

              // Flutuação: oscila y ±5px e rotate ±0.6deg, duração 3.6s - 5.4s
              const randomDuration = 3.6 + Math.random() * 1.8;
              const randomDelay = Math.random() * 1.2;

              const floatTween = gsap.to(outerEl, {
                y: review.dy + 5,
                rotate: review.rot + 0.6,
                duration: randomDuration,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: randomDelay,
              });

              floatingTweens.push(floatTween);
            });
          },
        });

        // Cada um começa com y +90, rotate (rot + 10deg), opacity 0, scale 0.92
        // e termina em y dy, rotate rot, opacity 1, scale 1; ease back.out(1.15), 0.8s, stagger 0.1s
        validOuterCards.forEach((outerEl, idx) => {
          const rev = REVIEWS[idx];
          if (!outerEl || !rev) return;

          muralTl.fromTo(
            outerEl,
            {
              y: rev.dy + 90,
              rotate: rev.rot + 10,
              opacity: 0,
              scale: 0.92,
            },
            {
              y: rev.dy,
              rotate: rev.rot,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: 'back.out(1.15)',
            },
            idx * 0.1
          );

          // Carimbo bate logo após o recorte 4 (índice 3)
          if (idx === 3 && stampRef.current) {
            muralTl.fromTo(
              stampRef.current,
              {
                scale: 1.7,
                rotate: -30,
                opacity: 0,
              },
              {
                scale: 1,
                rotate: -12,
                opacity: 0.95,
                duration: 0.5,
                ease: 'power4.in',
              },
              0.45
            );
            // Quique rápido
            muralTl.to(
              stampRef.current,
              {
                scale: 1.04,
                duration: 0.12,
                yoyo: true,
                repeat: 1,
                ease: 'power1.out',
              },
              0.95
            );
          }
        });

        // Link abaixo do mural (fade-up y 16 -> 0)
        if (footerLinkRef.current) {
          muralTl.fromTo(
            footerLinkRef.current,
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
            '-=0.2'
          );
        }
      }

      // -------------------------------------------------------------
      // D) ENTRADA E DICA DE ARRASTE MOBILE (<1024px)
      // -------------------------------------------------------------
      const validMobileCards = mobileCardRefs.current.filter(Boolean) as HTMLElement[];
      if (validMobileCards.length > 0 && mobileCarouselRef.current) {
        // Cada recorte entra com y 40 -> 0, opacity 0 -> 1
        gsap.fromTo(
          validMobileCards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: mobileCarouselRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );

        // Dica de arraste mobile: desloca ~40px e volta uma vez
        const carouselEl = mobileCarouselRef.current;
        ScrollTrigger.create({
          trigger: carouselEl,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            if (window.innerWidth < 1024) {
              gsap.to(carouselEl, {
                scrollLeft: 40,
                duration: 0.45,
                ease: 'power2.out',
                yoyo: true,
                repeat: 1,
                delay: 0.4,
              });
            }
          },
        });
      }

      // -------------------------------------------------------------
      // E) PAUSAR LOOPS QUANDO A SEÇÃO SAI DA VIEWPORT
      // -------------------------------------------------------------
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          flameLoopTweens.forEach((t) => {
            if (self.isActive) t.resume();
            else t.pause();
          });
          floatingTweens.forEach((t) => {
            if (self.isActive) t.resume();
            else t.pause();
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Carimbo SVG (132px desktop, 96px mobile)
  const renderStamp = (isMobile = false) => {
    const hasData = GOOGLE_RATING.nota !== null && GOOGLE_RATING.total !== null;
    const size = isMobile ? 96 : 132;

    return (
      <div
        ref={!isMobile ? stampRef : undefined}
        className={`pointer-events-none select-none z-30 transition-transform ${
          isMobile ? 'relative mx-auto mb-4' : 'absolute -top-7 right-4 lg:right-6'
        }`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          opacity: 0.95,
          transform: isMobile ? 'rotate(-12deg)' : undefined,
        }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 160 160"
          width={size}
          height={size}
          className="w-full h-full"
        >
          {/* Anel Externo Duplo */}
          <circle
            cx="80"
            cy="80"
            r="76"
            fill="none"
            stroke="#E8832A"
            strokeWidth="3"
            strokeDasharray="6 2"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#E8832A"
            strokeWidth="1.5"
          />
          {/* Anel Interno */}
          <circle
            cx="80"
            cy="80"
            r="46"
            fill="none"
            stroke="#E8832A"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* Caminho Curvo para Texto Superior / Circular */}
          <defs>
            <path
              id="stampCirclePath"
              d="M 80, 80 m -58, 0 a 58,58 0 1,1 116,0 a 58,58 0 1,1 -116,0"
            />
          </defs>

          {/* Texto do Anel */}
          <text
            fill="#E8832A"
            fontSize="10.5"
            fontFamily="var(--font-text)"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            <textPath
              href="#stampCirclePath"
              startOffset="50%"
              textAnchor="middle"
            >
              {hasData
                ? `${GOOGLE_RATING.total} AVALIAÇÕES`
                : 'AVALIAÇÕES REAIS · GOOGLE'}
            </textPath>
          </text>

          {/* Centro do Carimbo */}
          {hasData ? (
            <g transform="translate(80, 80)">
              <text
                textAnchor="middle"
                dy="-4"
                fill="#E8832A"
                fontSize="18"
                fontFamily="var(--font-display)"
                fontWeight="900"
              >
                {GOOGLE_RATING.nota}
              </text>
              <text
                textAnchor="middle"
                dy="14"
                fill="#E8832A"
                fontSize="8"
                fontFamily="var(--font-text)"
                fontWeight="700"
                letterSpacing="0.12em"
              >
                NO GOOGLE
              </text>
            </g>
          ) : (
            <g transform="translate(80, 80)">
              {/* Estrela central única quando não há dados inventados */}
              <path
                d="M 0 -11 L 3.4 -3.5 L 11.5 -2.4 L 5.6 3.3 L 7 11.3 L 0 7.4 L -7 11.3 L -5.6 3.3 L -11.5 -2.4 L -3.4 -3.5 Z"
                fill="#E8832A"
              />
            </g>
          )}
        </svg>

        {/* Texto acessível quando houver dados */}
        {hasData && (
          <span className="sr-only">
            Avaliação no Google: {GOOGLE_RATING.nota} estrelas com {GOOGLE_RATING.total} avaliações
          </span>
        )}
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="depoimentos"
      aria-labelledby="depoimentos-heading"
      className="relative w-full overflow-x-clip bg-[#14100D] text-[#F5E6D0] py-[clamp(72px,8vw,120px)] px-[clamp(24px,5vw,80px)] scroll-mt-16"
      style={{
        backgroundColor: '#14100D',
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
      {/* CONTAINER PRINCIPAL DO CONTEÚDO                                */}
      {/* ============================================================== */}
      <div className="relative z-10 max-w-[1280px] mx-auto w-full flex flex-col items-center">
        {/* ============================================================ */}
        {/* CABEÇALHO CENTRALIZADO: EYEBROW + H2 COM 2 LINHAS            */}
        {/* ============================================================ */}
        <div className="w-full flex flex-col items-center text-center">
          {/* Eyebrow: DEPOIMENTOS com fios de 1px laterais */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-3">
            <span className="w-6 sm:w-8 h-[1px] bg-[#F5E6D0]/30 inline-block shrink-0" />
            <span
              className="font-text font-semibold uppercase tracking-[0.25em] text-[12px] sm:text-[13px] text-[#F5E6D0]/85 select-none"
              style={{ fontFamily: 'var(--font-text)' }}
            >
              DEPOIMENTOS
            </span>
            <span className="w-6 sm:w-8 h-[1px] bg-[#F5E6D0]/30 inline-block shrink-0" />
          </div>

          {/* H2 com 2 Linhas: "QUEM JÁ SENTOU À" + "mesa" com Chama colada */}
          <h2
            id="depoimentos-heading"
            className="mt-2 sm:mt-3 flex flex-col items-center text-center m-0 select-none"
            aria-label="Quem já sentou à mesa"
          >
            {/* Linha 1: "QUEM JÁ SENTOU À" (Fraunces 700, creme) */}
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
                className="block uppercase text-[#F5E6D0] whitespace-nowrap text-[clamp(1.15rem,6vw,2rem)] lg:text-[clamp(1.6rem,3.8vw,3.6rem)]"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  wordSpacing: '0.12em',
                  lineHeight: 1.1,
                }}
              >
                QUEM JÁ SENTOU À
              </span>
            </span>

            {/* Linha 2: "mesa" (Fraunces 900 itálico, brasa) + ChamaIcon inline fora da máscara */}
            <div className="inline-flex items-baseline justify-center">
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
                  className="block lowercase italic text-[#E8832A] whitespace-nowrap text-[clamp(4.2rem,17vw,6.8rem)] lg:text-[clamp(5.4rem,10.6vw,9.5rem)]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
                    lineHeight: 0.85,
                    marginTop: '-0.06em',
                    textShadow: '0 4px 28px rgba(0,0,0,0.4)',
                  }}
                >
                  mesa
                </span>
              </span>

              {/* Ícone da chama inline após "mesa", height 0.62em colado à letra "a", rotate 6deg */}
              <span
                ref={chamaRef}
                aria-hidden="true"
                className="inline-block h-[0.62em] w-[0.62em] -ml-[0.14em] -mb-[0.06em] align-[-0.08em] text-[#E8832A] select-none pointer-events-none origin-bottom shrink-0"
                style={{
                  transform: 'rotate(6deg)',
                  transformOrigin: '50% 100%',
                }}
              >
                <ChamaIcon className="h-full w-full" />
              </span>
            </div>
          </h2>
        </div>

        {/* ============================================================ */}
        {/* MURAL DESKTOP (≥1024px): 4 COLUNAS × 2 LINHAS                */}
        {/* ============================================================ */}
        <div
          ref={muralContainerRef}
          className="relative hidden lg:block w-full max-w-[1280px]"
          style={{
            marginTop: 'clamp(40px, 4.5vw, 72px)',
          }}
        >
          {/* Carimbo posicionado no canto superior direito do mural */}
          {renderStamp(false)}

          {/* Grid de 4 Colunas x 2 Linhas com sobreposição vertical de -28px */}
          <div className="w-full flex flex-col">
            {/* Linha Superior (Recortes 1 a 4) */}
            <div className="grid grid-cols-4 gap-5 relative z-10">
              {REVIEWS.slice(0, 4).map((rev, idx) => {
                const colors = PAPER_COLORS[rev.cor];
                const isHovered = hoveredCardIdx === idx;
                const hasHover = hoveredCardIdx !== null;
                const isOtherHovered = hasHover && !isHovered;

                return (
                  <div
                    key={rev.id}
                    ref={(el) => {
                      cardOuterRefs.current[idx] = el;
                    }}
                    className="relative transition-opacity duration-200"
                    style={{
                      transform: `translate3d(${rev.dx}px, ${rev.dy}px, 0px) rotate(${rev.rot}deg)`,
                      opacity: isOtherHovered ? 0.85 : 1,
                      zIndex: isHovered ? 40 : 10,
                    }}
                  >
                    {/* Elemento INTERNO que gerencia o HOVER (só pointer fine) */}
                    <figure
                      ref={(el) => {
                        cardInnerRefs.current[idx] = el;
                      }}
                      onMouseEnter={() => setHoveredCardIdx(idx)}
                      onMouseLeave={() => setHoveredCardIdx(null)}
                      className="group relative flex flex-col justify-between select-none transition-transform duration-250 ease-out cursor-default"
                      style={{
                        backgroundColor: colors.bg,
                        padding: 'clamp(20px, 1.8vw, 28px)',
                        minHeight: rev.tamanho === 'L' ? '280px' : '240px',
                        transform: isHovered ? `scale(1.05) rotate(${-rev.rot}deg)` : 'scale(1) rotate(0deg)',
                        boxShadow:
                          '0 10px 24px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.35)',
                      }}
                    >
                      {/* Textura de Grão (.grao) 6% dentro do papel */}
                      <div
                        className="absolute inset-0 pointer-events-none z-0 opacity-[0.06]"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        }}
                      />

                      {/* Sombra ampliada via pseudo-elemento em hover */}
                      <div
                        className="absolute inset-0 pointer-events-none transition-opacity duration-250 -z-10"
                        style={{
                          opacity: isHovered ? 1 : 0,
                          boxShadow:
                            '0 20px 40px rgba(0,0,0,0.65), 0 6px 14px rgba(0,0,0,0.45)',
                        }}
                      />

                      {/* Topo do Recorte: 5 Estrelas */}
                      <div className="relative z-10 flex items-center justify-center gap-1 mb-3">
                        <span className="sr-only">5 de 5 estrelas</span>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon key={i} fill={colors.starColor} />
                        ))}
                      </div>

                      {/* Texto da Avaliação */}
                      <blockquote className="relative z-10 m-0 my-auto text-center px-1">
                        <p
                          className="font-display italic text-[#14100D] m-0"
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 500,
                            fontSize: 'clamp(0.96rem, 1.15vw, 1.12rem)',
                            lineHeight: 1.38,
                            textWrap: 'balance',
                          }}
                        >
                          “{rev.texto}”
                        </p>
                      </blockquote>

                      {/* Rodapé do Recorte: Nome + GOOGLE */}
                      <figcaption className="relative z-10 mt-4 pt-3 flex flex-col items-center justify-center text-center border-t border-[#14100D]/10">
                        <span
                          className="font-text font-semibold uppercase text-[12px] text-[#14100D] tracking-[0.12em]"
                          style={{ fontFamily: 'var(--font-text)' }}
                        >
                          {rev.nome}
                        </span>
                        <span
                          className="mt-0.5 font-text font-medium text-[11px] text-[#14100D]/65 tracking-[0.2em]"
                          style={{ fontFamily: 'var(--font-text)' }}
                        >
                          GOOGLE
                        </span>
                      </figcaption>
                    </figure>
                  </div>
                );
              })}
            </div>

            {/* Linha Inferior (Recortes 5 a 8) com Sobreposição vertical de -28px */}
            <div
              className="grid grid-cols-4 gap-5 relative z-20"
              style={{ marginTop: '-28px' }}
            >
              {REVIEWS.slice(4, 8).map((rev, offsetIdx) => {
                const idx = offsetIdx + 4;
                const colors = PAPER_COLORS[rev.cor];
                const isHovered = hoveredCardIdx === idx;
                const hasHover = hoveredCardIdx !== null;
                const isOtherHovered = hasHover && !isHovered;

                return (
                  <div
                    key={rev.id}
                    ref={(el) => {
                      cardOuterRefs.current[idx] = el;
                    }}
                    className="relative transition-opacity duration-200"
                    style={{
                      transform: `translate3d(${rev.dx}px, ${rev.dy}px, 0px) rotate(${rev.rot}deg)`,
                      opacity: isOtherHovered ? 0.85 : 1,
                      zIndex: isHovered ? 40 : 20,
                    }}
                  >
                    {/* Elemento INTERNO que gerencia o HOVER */}
                    <figure
                      ref={(el) => {
                        cardInnerRefs.current[idx] = el;
                      }}
                      onMouseEnter={() => setHoveredCardIdx(idx)}
                      onMouseLeave={() => setHoveredCardIdx(null)}
                      className="group relative flex flex-col justify-between select-none transition-transform duration-250 ease-out cursor-default"
                      style={{
                        backgroundColor: colors.bg,
                        padding: 'clamp(20px, 1.8vw, 28px)',
                        minHeight: rev.tamanho === 'L' ? '280px' : '240px',
                        transform: isHovered ? `scale(1.05) rotate(${-rev.rot}deg)` : 'scale(1) rotate(0deg)',
                        boxShadow:
                          '0 10px 24px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.35)',
                      }}
                    >
                      {/* Textura de Grão (.grao) 6% dentro do papel */}
                      <div
                        className="absolute inset-0 pointer-events-none z-0 opacity-[0.06]"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        }}
                      />

                      {/* Sombra ampliada via pseudo-elemento em hover */}
                      <div
                        className="absolute inset-0 pointer-events-none transition-opacity duration-250 -z-10"
                        style={{
                          opacity: isHovered ? 1 : 0,
                          boxShadow:
                            '0 20px 40px rgba(0,0,0,0.65), 0 6px 14px rgba(0,0,0,0.45)',
                        }}
                      />

                      {/* Topo do Recorte: 5 Estrelas */}
                      <div className="relative z-10 flex items-center justify-center gap-1 mb-3">
                        <span className="sr-only">5 de 5 estrelas</span>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon key={i} fill={colors.starColor} />
                        ))}
                      </div>

                      {/* Texto da Avaliação */}
                      <blockquote className="relative z-10 m-0 my-auto text-center px-1">
                        <p
                          className="font-display italic text-[#14100D] m-0"
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 500,
                            fontSize: 'clamp(0.96rem, 1.15vw, 1.12rem)',
                            lineHeight: 1.38,
                            textWrap: 'balance',
                          }}
                        >
                          “{rev.texto}”
                        </p>
                      </blockquote>

                      {/* Rodapé do Recorte: Nome + GOOGLE */}
                      <figcaption className="relative z-10 mt-4 pt-3 flex flex-col items-center justify-center text-center border-t border-[#14100D]/10">
                        <span
                          className="font-text font-semibold uppercase text-[12px] text-[#14100D] tracking-[0.12em]"
                          style={{ fontFamily: 'var(--font-text)' }}
                        >
                          {rev.nome}
                        </span>
                        <span
                          className="mt-0.5 font-text font-medium text-[11px] text-[#14100D]/65 tracking-[0.2em]"
                          style={{ fontFamily: 'var(--font-text)' }}
                        >
                          GOOGLE
                        </span>
                      </figcaption>
                    </figure>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CARROSSEL MOBILE (<1024px): SCROLL-SNAP COM ROTAÇÃO SUAVE    */}
        {/* ============================================================ */}
        <div className="lg:hidden w-full flex flex-col items-center mt-8">
          {/* Carimbo acima do carrossel no mobile */}
          {renderStamp(true)}

          {/* Container Scroll-Snap Horizontal */}
          <div
            ref={mobileCarouselRef}
            className="w-full flex gap-[14px] overflow-x-auto snap-x snap-mandatory py-4 scrollbar-none"
            style={{
              paddingLeft: 'max(24px, calc((100vw - 310px) / 2))',
              paddingRight: 'max(24px, calc((100vw - 310px) / 2))',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {REVIEWS.map((rev, idx) => {
              const colors = PAPER_COLORS[rev.cor];
              const isActive = activeMobileIdx === idx;
              // Rotação reduzida pela metade no mobile; ativo = 0
              const reducedRot = rev.rot * 0.5;

              return (
                <figure
                  key={rev.id}
                  ref={(el) => {
                    mobileCardRefs.current[idx] = el;
                  }}
                  className="relative shrink-0 snap-center w-[76vw] max-w-[330px] flex flex-col justify-between select-none transition-all duration-350 ease-out"
                  style={{
                    backgroundColor: colors.bg,
                    padding: '24px 20px',
                    minHeight: '250px',
                    transform: isActive
                      ? 'scale(1) rotate(0deg)'
                      : `scale(0.94) rotate(${reducedRot}deg)`,
                    boxShadow:
                      '0 10px 24px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.35)',
                  }}
                >
                  {/* Textura de Grão (.grao) 6% */}
                  <div
                    className="absolute inset-0 pointer-events-none z-0 opacity-[0.06]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                  />

                  {/* 5 Estrelas */}
                  <div className="relative z-10 flex items-center justify-center gap-1 mb-2">
                    <span className="sr-only">5 de 5 estrelas</span>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} fill={colors.starColor} />
                    ))}
                  </div>

                  {/* Texto */}
                  <blockquote className="relative z-10 m-0 my-auto text-center px-1">
                    <p
                      className="font-display italic text-[#14100D] m-0"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 500,
                        fontSize: '1rem',
                        lineHeight: 1.38,
                        textWrap: 'balance',
                      }}
                    >
                      “{rev.texto}”
                    </p>
                  </blockquote>

                  {/* Rodapé: Nome + GOOGLE */}
                  <figcaption className="relative z-10 mt-4 pt-3 flex flex-col items-center justify-center text-center border-t border-[#14100D]/10">
                    <span
                      className="font-text font-semibold uppercase text-[12px] text-[#14100D] tracking-[0.12em]"
                      style={{ fontFamily: 'var(--font-text)' }}
                    >
                      {rev.nome}
                    </span>
                    <span
                      className="mt-0.5 font-text font-medium text-[11px] text-[#14100D]/65 tracking-[0.2em]"
                      style={{ fontFamily: 'var(--font-text)' }}
                    >
                      GOOGLE
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>

          {/* Indicador de 8 Pontinhos para o Mobile */}
          <div className="flex items-center justify-center gap-2 mt-5 select-none">
            {REVIEWS.map((rev, idx) => (
              <button
                key={rev.id}
                type="button"
                onClick={() => scrollMobileTo(idx)}
                aria-label={`Ir para avaliação ${idx + 1} de ${rev.nome}`}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  activeMobileIdx === idx
                    ? 'bg-[#E8832A] scale-125'
                    : 'bg-[#F5E6D0]/30 hover:bg-[#F5E6D0]/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* LINK ABAIXO DO MURAL: "Ver todas as avaliações no Google"    */}
        {/* ============================================================ */}
        {GOOGLE_REVIEWS_URL && GOOGLE_REVIEWS_URL.trim() !== '' && (
          <div
            ref={footerLinkRef}
            className="w-full flex justify-center text-center"
            style={{
              marginTop: 'clamp(32px, 3.5vw, 56px)',
            }}
          >
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-text font-semibold uppercase text-[14px] text-[#F5E6D0] tracking-[0.08em] border-b-2 border-[#E8832A] pb-0.5 hover:text-[#E8832A] transition-colors duration-200 select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E8832A]"
              style={{ fontFamily: 'var(--font-text)' }}
            >
              Ver todas as avaliações no Google
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
