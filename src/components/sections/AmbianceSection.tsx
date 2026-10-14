import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * CONFIGURAÇÃO CENTRALIZADA DA MÍDIA DO AMBIENTE (Único ponto de edição)
 * TODO: trocar pelas fotos/vídeos definitivos e confirmar as legendas com o restaurante
 */
export interface AmbienteMediaItem {
  id: string;
  legenda: string;
  desktopSrc: string;
  mobileSrc: string;
  poster: string;
  alt: string;
  video?: string;
}

export const AMBIENTE_MIDIA: readonly AmbienteMediaItem[] = [
  {
    id: 'salao',
    legenda: 'O SALÃO DE MADEIRA',
    desktopSrc: '/images/ambiente/mosaico-salao-desktop.webp',
    mobileSrc: '/images/ambiente/mosaico-salao-mobile.webp',
    poster: '/images/ambiente/mosaico-salao-mobile.webp',
    alt: 'Salão interno do Braseiro Caiçara com mesas em madeira maciça e iluminação âmbar',
  },
  {
    id: 'adega',
    legenda: 'ADEGA & ARQUITETURA',
    desktopSrc: '/images/ambiente/mosaico-adega-desktop.webp',
    mobileSrc: '/images/ambiente/mosaico-adega-mobile.webp',
    poster: '/images/ambiente/mosaico-adega-mobile.webp',
    alt: 'Luminárias de palha trançada, adega rústica e arquitetura de praia',
  },
  {
    id: 'bar',
    legenda: 'COQUETELARIA & BAR',
    desktopSrc: '/images/ambiente/mosaico-bar-desktop.webp',
    mobileSrc: '/images/ambiente/mosaico-bar-mobile.webp',
    poster: '/images/ambiente/mosaico-bar-mobile.webp',
    alt: 'Balcão de bar e coquetelaria artesanal com botânicos da Mata Atlântica',
  },
  {
    id: 'varanda',
    legenda: 'VARANDA & NATUREZA',
    desktopSrc: '/images/ambiente/mosaico-varanda-desktop.webp',
    mobileSrc: '/images/ambiente/mosaico-varanda-mobile.webp',
    poster: '/images/ambiente/mosaico-varanda-mobile.webp',
    alt: 'Deck de madeira e área rústica cercada pela vegetação nativa de Ubatuba',
  },
  {
    id: 'mesa',
    legenda: 'CELEBRAÇÃO À MESA',
    desktopSrc: '/images/ambiente/mosaico-mesa-desktop.webp',
    mobileSrc: '/images/ambiente/mosaico-mesa-mobile.webp',
    poster: '/images/ambiente/mosaico-mesa-mobile.webp',
    alt: 'Mesa de celebração farta para confraternizações e momentos especiais',
  },
] as const;

/**
 * TEXTOS E ELEMENTOS ANTERIORES REMOVIDOS (PRESERVADOS PARA REFERÊNCIA):
 * - Título anterior: "Ambiente & Vida Caiçara" (font-condensed uppercase 3xl sm:5xl text-[#F3E6D0])
 * - Frase anterior: "“Um refúgio rústico em Ubatuba para desacelerar o tempo e viver a brasa.”"
 * - Divisor com losango e chama (<Divider variant="flame" />)
 * - 3 cards com borda e radius e legendas em pílula
 * - Moldura interna nos cards
 */

export const AmbianceSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Título e máscaras
  const titleLine1WrapperRef = useRef<HTMLSpanElement>(null);
  const titleLine1InnerRef = useRef<HTMLSpanElement>(null);
  const titleLine2WrapperRef = useRef<HTMLSpanElement>(null);
  const titleLine2InnerRef = useRef<HTMLSpanElement>(null);

  // Mosaico Desktop
  const mosaicGridRef = useRef<HTMLDivElement>(null);
  const mosaicCellRefs = useRef<(HTMLElement | null)[]>([]);

  // Mobile Carousel
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const mobileCellRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeMobileIdx, setActiveMobileIdx] = useState<number>(0);

  // Frase inferior
  const quoteRef = useRef<HTMLParagraphElement>(null);

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

    const cards = mobileCellRefs.current.filter(Boolean) as HTMLElement[];
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

  const scrollMobileTo = (idx: number) => {
    const carousel = mobileCarouselRef.current;
    const targetCell = mobileCellRefs.current[idx];
    if (!carousel || !targetCell) return;

    const left = targetCell.offsetLeft - (carousel.clientWidth - targetCell.clientWidth) / 2;
    carousel.scrollTo({
      left,
      behavior: 'smooth',
    });
    setActiveMobileIdx(idx);
  };

  // 2) Animações GSAP + ScrollTrigger
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

      // Linha 1: "AMBIENTE & VIDA"
      if (titleLine1InnerRef.current) {
        titleTl.fromTo(
          titleLine1InnerRef.current,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.75, ease: 'power3.out' }
        );
      }

      // Linha 2: "caiçara" (entra por último com scale 0.94 -> 1)
      if (titleLine2InnerRef.current) {
        titleTl.fromTo(
          titleLine2InnerRef.current,
          { yPercent: 100, scale: 0.94, opacity: 0 },
          { yPercent: 0, scale: 1, opacity: 1, duration: 0.85, ease: 'power3.out' },
          '-=0.63' // stagger ~0.12s
        );
      }

      // Mosaico Desktop: as 5 células entram com opacity 0 -> 1 e y 40 -> 0, stagger 0.1s
      const validCells = mosaicCellRefs.current.filter(Boolean) as HTMLElement[];
      if (validCells.length > 0 && mosaicGridRef.current) {
        gsap.fromTo(
          validCells,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: mosaicGridRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }

      // Mobile: células entram com y 32 -> 0 e opacity
      const validMobileCells = mobileCellRefs.current.filter(Boolean) as HTMLElement[];
      if (validMobileCells.length > 0 && mobileCarouselRef.current) {
        gsap.fromTo(
          validMobileCells,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: mobileCarouselRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      // Frase: fade-up
      if (quoteRef.current) {
        gsap.fromTo(
          quoteRef.current,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: quoteRef.current,
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
      id="ambiente"
      aria-labelledby="ambiente-heading"
      className="relative w-full overflow-x-clip bg-[#14100D] text-[#F5E6D0] scroll-mt-20 pb-0"
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
      {/* ÁREA DO TÍTULO CENTRALIZADO                                    */}
      {/* ============================================================== */}
      <div
        className="relative z-10 w-full flex flex-col items-center text-center px-[clamp(24px,5vw,80px)] pt-[clamp(72px,8vw,120px)]"
        style={{
          marginBottom: 'clamp(40px, 4.5vw, 72px)',
        }}
      >
        {/* Eyebrow: NOSSO ESPAÇO com fios laterais de 1px */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-3">
          <span className="w-6 sm:w-8 h-[1px] bg-[#F5E6D0]/30 inline-block shrink-0" />
          <span
            className="font-text font-semibold uppercase tracking-[0.25em] text-[12px] sm:text-[13px] text-[#F5E6D0]/85 select-none"
            style={{ fontFamily: 'var(--font-text)' }}
          >
            NOSSO ESPAÇO
          </span>
          <span className="w-6 sm:w-8 h-[1px] bg-[#F5E6D0]/30 inline-block shrink-0" />
        </div>

        {/* H2 com 2 Linhas: "AMBIENTE & VIDA" + "caiçara" */}
        <h2
          id="ambiente-heading"
          className="mt-2 sm:mt-3 flex flex-col items-center text-center m-0 select-none"
          aria-label="Ambiente & vida caiçara"
        >
          {/* Linha 1: "AMBIENTE & VIDA" (Fraunces 700, creme) */}
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
              className="block uppercase text-[#F5E6D0] whitespace-nowrap text-[clamp(1.4rem,4.8vw,2.2rem)] lg:text-[clamp(1.8rem,3.8vw,3.6rem)]"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                letterSpacing: '0.03em',
                wordSpacing: '0.12em',
                lineHeight: 1.1,
              }}
            >
              AMBIENTE & VIDA
            </span>
          </span>

          {/* Linha 2: "caiçara" (Fraunces 900 itálico, brasa) */}
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
              className="block lowercase italic text-[#E8832A] whitespace-nowrap tracking-[-0.02em] text-[clamp(4.1rem,14vw,6.5rem)] lg:text-[clamp(5.2rem,11.8vw,10.8rem)]"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
                lineHeight: 0.85,
                marginTop: '-0.06em',
                textShadow: '0 4px 28px rgba(0,0,0,0.4)',
              }}
            >
              caiçara
            </span>
          </span>
        </h2>
      </div>

      {/* ============================================================== */}
      {/* MOSAICO DESKTOP (≥1024px): 12 COLUNAS × 2 LINHAS FULL-BLEED    */}
      {/* ============================================================== */}
      <div
        ref={mosaicGridRef}
        className="hidden lg:grid w-full gap-[6px]"
        style={{
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          height: 'clamp(560px, 74svh, 760px)',
        }}
      >
        {/* CÉLULA 1: O SALÃO DE MADEIRA (Colunas 1 a 5, Linhas 1 a 2 - Grande vertical) */}
        <figure
          ref={(el) => {
            mosaicCellRefs.current[0] = el;
          }}
          className="group relative m-0 overflow-hidden select-none"
          style={{
            gridColumn: '1 / 6',
            gridRow: '1 / 3',
          }}
        >
          <picture className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
            <source media="(min-width: 1024px)" srcSet={AMBIENTE_MIDIA[0].desktopSrc} type="image/webp" />
            <img
              src={AMBIENTE_MIDIA[0].mobileSrc}
              alt={AMBIENTE_MIDIA[0].alt}
              width={1400}
              height={1800}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
            />
          </picture>
          <div className="absolute inset-0 bg-[#14100D]/10 pointer-events-none z-[1]" />
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              background: 'linear-gradient(to top, rgba(20,16,13,0.85) 0%, rgba(20,16,13,0.4) 22%, transparent 45%)',
            }}
          />
          <figcaption className="absolute bottom-0 left-0 p-[18px_20px] z-10 pointer-events-none transition-opacity duration-300 opacity-85 group-hover:opacity-100">
            <span
              className="font-text font-semibold uppercase text-[12px] text-[#F5E6D0] tracking-[0.2em]"
              style={{ fontFamily: 'var(--font-text)' }}
            >
              {AMBIENTE_MIDIA[0].legenda}
            </span>
          </figcaption>
        </figure>

        {/* CÉLULA 2: ADEGA & ARQUITETURA (Colunas 6 a 9, Linha 1) */}
        <figure
          ref={(el) => {
            mosaicCellRefs.current[1] = el;
          }}
          className="group relative m-0 overflow-hidden select-none"
          style={{
            gridColumn: '6 / 10',
            gridRow: '1 / 2',
          }}
        >
          <picture className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
            <source media="(min-width: 1024px)" srcSet={AMBIENTE_MIDIA[1].desktopSrc} type="image/webp" />
            <img
              src={AMBIENTE_MIDIA[1].mobileSrc}
              alt={AMBIENTE_MIDIA[1].alt}
              width={1400}
              height={1000}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
            />
          </picture>
          <div className="absolute inset-0 bg-[#14100D]/10 pointer-events-none z-[1]" />
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              background: 'linear-gradient(to top, rgba(20,16,13,0.85) 0%, rgba(20,16,13,0.4) 22%, transparent 45%)',
            }}
          />
          <figcaption className="absolute bottom-0 left-0 p-[18px_20px] z-10 pointer-events-none transition-opacity duration-300 opacity-85 group-hover:opacity-100">
            <span
              className="font-text font-semibold uppercase text-[12px] text-[#F5E6D0] tracking-[0.2em]"
              style={{ fontFamily: 'var(--font-text)' }}
            >
              {AMBIENTE_MIDIA[1].legenda}
            </span>
          </figcaption>
        </figure>

        {/* CÉLULA 3: COQUETELARIA & BAR (Colunas 10 a 12, Linha 1) */}
        <figure
          ref={(el) => {
            mosaicCellRefs.current[2] = el;
          }}
          className="group relative m-0 overflow-hidden select-none"
          style={{
            gridColumn: '10 / 13',
            gridRow: '1 / 2',
          }}
        >
          <picture className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
            <source media="(min-width: 1024px)" srcSet={AMBIENTE_MIDIA[2].desktopSrc} type="image/webp" />
            <img
              src={AMBIENTE_MIDIA[2].mobileSrc}
              alt={AMBIENTE_MIDIA[2].alt}
              width={1400}
              height={1000}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
            />
          </picture>
          <div className="absolute inset-0 bg-[#14100D]/10 pointer-events-none z-[1]" />
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              background: 'linear-gradient(to top, rgba(20,16,13,0.85) 0%, rgba(20,16,13,0.4) 22%, transparent 45%)',
            }}
          />
          <figcaption className="absolute bottom-0 left-0 p-[18px_20px] z-10 pointer-events-none transition-opacity duration-300 opacity-85 group-hover:opacity-100">
            <span
              className="font-text font-semibold uppercase text-[12px] text-[#F5E6D0] tracking-[0.2em]"
              style={{ fontFamily: 'var(--font-text)' }}
            >
              {AMBIENTE_MIDIA[2].legenda}
            </span>
          </figcaption>
        </figure>

        {/* CÉLULA 4: VARANDA & NATUREZA (Colunas 6 a 9, Linha 2) */}
        <figure
          ref={(el) => {
            mosaicCellRefs.current[3] = el;
          }}
          className="group relative m-0 overflow-hidden select-none"
          style={{
            gridColumn: '6 / 10',
            gridRow: '2 / 3',
          }}
        >
          <picture className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
            <source media="(min-width: 1024px)" srcSet={AMBIENTE_MIDIA[3].desktopSrc} type="image/webp" />
            <img
              src={AMBIENTE_MIDIA[3].mobileSrc}
              alt={AMBIENTE_MIDIA[3].alt}
              width={1400}
              height={1000}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
            />
          </picture>
          <div className="absolute inset-0 bg-[#14100D]/10 pointer-events-none z-[1]" />
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              background: 'linear-gradient(to top, rgba(20,16,13,0.85) 0%, rgba(20,16,13,0.4) 22%, transparent 45%)',
            }}
          />
          <figcaption className="absolute bottom-0 left-0 p-[18px_20px] z-10 pointer-events-none transition-opacity duration-300 opacity-85 group-hover:opacity-100">
            <span
              className="font-text font-semibold uppercase text-[12px] text-[#F5E6D0] tracking-[0.2em]"
              style={{ fontFamily: 'var(--font-text)' }}
            >
              {AMBIENTE_MIDIA[3].legenda}
            </span>
          </figcaption>
        </figure>

        {/* CÉLULA 5: CELEBRAÇÃO À MESA (Colunas 10 a 12, Linha 2) */}
        <figure
          ref={(el) => {
            mosaicCellRefs.current[4] = el;
          }}
          className="group relative m-0 overflow-hidden select-none"
          style={{
            gridColumn: '10 / 13',
            gridRow: '2 / 3',
          }}
        >
          <picture className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
            <source media="(min-width: 1024px)" srcSet={AMBIENTE_MIDIA[4].desktopSrc} type="image/webp" />
            <img
              src={AMBIENTE_MIDIA[4].mobileSrc}
              alt={AMBIENTE_MIDIA[4].alt}
              width={1400}
              height={1000}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
            />
          </picture>
          <div className="absolute inset-0 bg-[#14100D]/10 pointer-events-none z-[1]" />
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              background: 'linear-gradient(to top, rgba(20,16,13,0.85) 0%, rgba(20,16,13,0.4) 22%, transparent 45%)',
            }}
          />
          <figcaption className="absolute bottom-0 left-0 p-[18px_20px] z-10 pointer-events-none transition-opacity duration-300 opacity-85 group-hover:opacity-100">
            <span
              className="font-text font-semibold uppercase text-[12px] text-[#F5E6D0] tracking-[0.2em]"
              style={{ fontFamily: 'var(--font-text)' }}
            >
              {AMBIENTE_MIDIA[4].legenda}
            </span>
          </figcaption>
        </figure>
      </div>

      {/* ============================================================== */}
      {/* CARROSSEL MOBILE (<1024px): SCROLL-SNAP COM 5 CÉLULAS          */}
      {/* ============================================================== */}
      <div className="lg:hidden w-full flex flex-col items-center">
        <div
          ref={mobileCarouselRef}
          className="w-full flex gap-2 overflow-x-auto snap-x snap-mandatory py-2 scrollbar-none"
          style={{
            paddingLeft: 'max(24px, calc((100vw - 320px) / 2))',
            paddingRight: 'max(24px, calc((100vw - 320px) / 2))',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {AMBIENTE_MIDIA.map((item, idx) => {
            const isFirst = idx === 0;

            return (
              <figure
                key={item.id}
                ref={(el) => {
                  mobileCellRefs.current[idx] = el;
                }}
                className={`relative shrink-0 snap-center w-[72vw] max-w-[320px] ${
                  isFirst ? 'aspect-[3/4]' : 'aspect-[4/5]'
                } overflow-hidden select-none bg-[#14100D]`}
              >
                <picture className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
                  <img
                    src={item.mobileSrc}
                    alt={item.alt}
                    width={800}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center"
                  />
                </picture>
                <div className="absolute inset-0 bg-[#14100D]/10 pointer-events-none z-[1]" />
                <div
                  className="absolute inset-0 pointer-events-none z-[2]"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(20,16,13,0.88) 0%, rgba(20,16,13,0.45) 25%, transparent 50%)',
                  }}
                />
                <figcaption className="absolute bottom-0 left-0 p-4 z-10 pointer-events-none">
                  <span
                    className="font-text font-semibold uppercase text-[11px] text-[#F5E6D0] tracking-[0.2em]"
                    style={{ fontFamily: 'var(--font-text)' }}
                  >
                    {item.legenda}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>

        {/* Indicador de 5 Pontinhos Mobile */}
        <div className="flex items-center justify-center gap-2 mt-4 select-none">
          {AMBIENTE_MIDIA.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollMobileTo(idx)}
              aria-label={`Ir para foto ${idx + 1}: ${item.legenda}`}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                activeMobileIdx === idx
                  ? 'bg-[#E8832A] scale-125'
                  : 'bg-[#F5E6D0]/30 hover:bg-[#F5E6D0]/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* FRASE INFERIOR CENTRALIZADA                                    */}
      {/* ============================================================== */}
      <div className="w-full flex justify-center text-center px-6 py-[clamp(40px,4.5vw,72px)]">
        <p
          ref={quoteRef}
          className="font-display italic text-[#F5E6D0] m-0 text-[clamp(1.05rem,1.5vw,1.35rem)] max-w-[40ch]"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            textWrap: 'balance',
            lineHeight: 1.45,
          }}
        >
          “Um refúgio rústico em Ubatuba para desacelerar o tempo e viver à brasa.”
        </p>
      </div>
    </section>
  );
};

export default AmbianceSection;
