import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '@/config';
import { BrandShape } from '@/components/BrandShape';
import { formasLayoutConfig } from '@/data/formas-layout';
import { ReservaTriagem } from '@/components/ReservaTriagem';

gsap.registerPlugin(ScrollTrigger);

/**
 * CONFIGURAÇÃO CENTRALIZADA DE COMO CHEGAR E RESERVAS
 * TODO: trocar por foto definitiva da fachada à noite
 * TODO: confirmar com o restaurante o fluxo de reservas (política de tolerância, grupos, antecedência)
 * TODO: confirmar endereço, horário e estacionamento com o restaurante
 */

export const LocationReservationsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);

  // Título e glow
  const titleLine1WrapperRef = useRef<HTMLSpanElement>(null);
  const titleLine1InnerRef = useRef<HTMLSpanElement>(null);
  const titleLine2WrapperRef = useRef<HTMLSpanElement>(null);
  const titleLine2InnerRef = useRef<HTMLSpanElement>(null);
  const titleSubtitleRef = useRef<HTMLParagraphElement>(null);

  // Grid e Colunas
  const formColRef = useRef<HTMLDivElement>(null);
  const mapColRef = useRef<HTMLDivElement>(null);

  // Carregamento tardio do mapa Google Maps (600px antes da viewport)
  const [loadMap, setLoadMap] = useState<boolean>(false);
  const mapWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mapWrapperRef.current;
    if (!el || loadMap) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setLoadMap(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '600px 0px 600px 0px',
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMap]);

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



  // Animações GSAP + ScrollTrigger
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1) Parallax sutil na imagem de fundo (apenas desktop ≥1024px)
      // Somente yPercent (-5 a +5), SEM scale simultâneo.
      if (bgImageRef.current && window.innerWidth >= 1024) {
        gsap.fromTo(
          bgImageRef.current,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      }

      // 2) Revelação do Título
      const titleTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
        onComplete: () => {
          if (titleLine1WrapperRef.current) titleLine1WrapperRef.current.style.overflow = 'visible';
          if (titleLine2WrapperRef.current) titleLine2WrapperRef.current.style.overflow = 'visible';
          // Garante que o estado final seja 100% limpo sem sobras de transform
          gsap.set([titleLine1InnerRef.current, titleLine2InnerRef.current, titleSubtitleRef.current], {
            clearProps: 'opacity,transform',
          });
        },
      });

      // Linha 1: "A BRASA JÁ ESTÁ"
      if (titleLine1InnerRef.current) {
        titleTl.fromTo(
          titleLine1InnerRef.current,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.75, ease: 'power3.out', immediateRender: false }
        );
      }

      // Linha 2: "acesa" com scale 0.94 -> 1
      if (titleLine2InnerRef.current) {
        titleTl.fromTo(
          titleLine2InnerRef.current,
          { yPercent: 100, scale: 0.94, opacity: 0 },
          { yPercent: 0, scale: 1, opacity: 1, duration: 0.85, ease: 'power3.out', immediateRender: false },
          '-=0.63'
        );
      }

      // Subtítulo
      if (titleSubtitleRef.current) {
        titleTl.fromTo(
          titleSubtitleRef.current,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, ease: 'power2.out', immediateRender: false },
          '-=0.3'
        );
      }

      // 3) Formulário à esquerda
      if (formColRef.current) {
        gsap.fromTo(
          formColRef.current,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: formColRef.current,
              start: 'top 85%',
              once: true,
            },
            onComplete: () => {
              gsap.set(formColRef.current, { clearProps: 'opacity,transform' });
            },
          }
        );
      }

      // 4) Mapa e informações à direita
      if (mapColRef.current) {
        gsap.fromTo(
          mapColRef.current,
          { x: 24, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: mapColRef.current,
              start: 'top 85%',
              once: true,
            },
            onComplete: () => {
              gsap.set(mapColRef.current, { clearProps: 'opacity,transform' });
            },
          }
        );
      }
    }, sectionRef);

    // Atualização de medidas de ScrollTrigger após fontes e imagens carregadas
    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoad);
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => {
      window.removeEventListener('load', handleLoad);
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="contato-reservas"
      aria-labelledby="reservas-heading"
      className="relative has-shapes w-full overflow-hidden bg-[#14100D] text-[#F5E6D0] scroll-mt-20"
      style={{
        position: 'relative',
        isolation: 'isolate',
        overflow: 'hidden',
        backgroundColor: '#14100D',
        paddingTop: 'clamp(80px, 8vw, 120px)',
        paddingBottom: 'clamp(80px, 8vw, 120px)',
        paddingLeft: 'var(--pad, clamp(24px, 5vw, 80px))',
        paddingRight: 'var(--pad, clamp(24px, 5vw, 80px))',
        ['--pad' as any]: 'clamp(24px, 5vw, 80px)',
      }}
    >
      {/* Formas de marca decorativas (camada z-[1] entre fundo e conteúdo z-[2]) */}
      {formasLayoutConfig['home-location-reservations']?.shapes.map((s, idx) => (
        <BrandShape key={`location-shape-${idx}`} {...s} className="z-[1]" />
      ))}
      {/* ============================================================== */}
      {/* WRAPPER DE FUNDO: INSET-0, OVERFLOW-HIDDEN, Z-0                */}
      {/* ============================================================== */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        {/* A) IMAGEM: picture cobrindo o wrapper (top: -10%, height: 120%) para suportar parallax */}
        <picture
          className="absolute left-0 w-full pointer-events-none select-none"
          style={{
            position: 'absolute',
            left: 0,
            width: '100%',
            top: '-10%',
            height: '120%',
          }}
        >
          <source media="(min-width: 1024px)" srcSet="/images/reservas/fachada-reserva-desktop.webp" type="image/webp" />
          <img
            ref={bgImageRef}
            src="/images/reservas/fachada-reserva-mobile.webp"
            alt=""
            width={1600}
            height={1200}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-[center_62%] pointer-events-none"
          />
        </picture>

        {/* B) OVERLAYS COMO IRMÃS DA IMAGEM (FORA DO TRANSFORM) */}
        {/* Overlay escuro base: rgba(20,16,13, 0.70) */}
        <div className="absolute inset-0 bg-[#14100D]/70 pointer-events-none z-[1]" />

        {/* Radial escuro dedicado atrás do título/eyebrow para afastar letreiro da foto */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            background: 'radial-gradient(ellipse 90% 45% at 50% 18%, rgba(20,16,13,0.85) 0%, rgba(20,16,13,0.5) 50%, transparent 75%)',
          }}
        />

        {/* Radial suave central */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(20,16,13,0.4), transparent 75%)',
          }}
        />

        {/* Gradiente inferior para linha de informações e botão */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            background: 'linear-gradient(to top, rgba(20,16,13,0.90) 0%, rgba(20,16,13,0.75) 28%, transparent 55%)',
          }}
        />

        {/* Degradês de transição de 90px nas bordas exatas do wrapper */}
        <div
          className="absolute top-0 inset-x-0 h-[90px] pointer-events-none z-[3]"
          style={{
            background: 'linear-gradient(to bottom, #14100D 0px, rgba(20,16,13,0.6) 45px, transparent 90px)',
          }}
        />
        <div
          className="absolute bottom-0 inset-x-0 h-[90px] pointer-events-none z-[3]"
          style={{
            background: 'linear-gradient(to top, #14100D 0px, rgba(20,16,13,0.6) 45px, transparent 90px)',
          }}
        />

        {/* Textura de grão (.grao) 3% */}
        <div
          className="absolute inset-0 pointer-events-none z-[4] opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ============================================================== */}
      {/* CONTEÚDO PRINCIPAL (Z-2)                                       */}
      {/* ============================================================== */}
      <div className="relative z-[2] max-w-[1280px] mx-auto w-full flex flex-col items-center">
        {/* CABEÇALHO CENTRALIZADO */}
        <div className="w-full flex flex-col items-center text-center mb-[clamp(44px, 5vw, 76px)]">
          {/* Eyebrow: COMO CHEGAR E RESERVAS */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-3">
            <span className="w-6 sm:w-8 h-[1px] bg-[#F5E6D0]/40 inline-block shrink-0" />
            <span
              className="font-text font-semibold uppercase tracking-[0.25em] text-[12px] sm:text-[13px] text-[#F5E6D0] select-none"
              style={{ fontFamily: 'var(--font-text)', textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}
            >
              COMO CHEGAR E RESERVAS
            </span>
            <span className="w-6 sm:w-8 h-[1px] bg-[#F5E6D0]/40 inline-block shrink-0" />
          </div>

          {/* H2 com 2 Linhas: "A BRASA JÁ ESTÁ" + "acesa" */}
          <h2
            id="reservas-heading"
            className="mt-2 sm:mt-3 flex flex-col items-center text-center m-0 select-none"
            aria-label="A brasa já está acesa"
          >
            {/* Linha 1: "A BRASA JÁ ESTÁ" */}
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
                data-reveal="true"
                className="block uppercase text-[#F5E6D0] whitespace-nowrap text-[clamp(1.35rem,4.8vw,2.1rem)] lg:text-[clamp(1.7rem,3.8vw,3.6rem)]"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  wordSpacing: '0.12em',
                  lineHeight: 1.1,
                  textShadow: '0 4px 18px rgba(0,0,0,0.85)',
                }}
              >
                A BRASA JÁ ESTÁ
              </span>
            </span>

            {/* Linha 2: "acesa" com efeito adesivo */}
            <span
              ref={titleLine2WrapperRef}
              className="line-wrapper block relative"
              style={{
                overflow: prefersReducedMotion ? 'visible' : 'hidden',
                padding: '0.22em 0.18em 0.3em',
                margin: '-0.22em -0.18em -0.3em',
              }}
            >
              {/* Brilho pulsante sobreposto com exatamente a mesma métrica */}
              {!prefersReducedMotion && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 block lowercase italic text-[#E8832A] whitespace-nowrap tracking-[-0.02em] text-[clamp(4.3rem,15vw,6.8rem)] lg:text-[clamp(5.6rem,12.5vw,11.5rem)] select-none pointer-events-none filter blur-[18px] animate-pulse z-0"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
                    lineHeight: 0.85,
                    marginTop: '-0.06em',
                    opacity: 0.4,
                  }}
                >
                  acesa
                </span>
              )}

              <span
                ref={titleLine2InnerRef}
                data-reveal="true"
                className="block lowercase italic text-[#E8832A] whitespace-nowrap tracking-[-0.02em] text-[clamp(4.3rem,15vw,6.8rem)] lg:text-[clamp(5.6rem,12.5vw,11.5rem)] relative z-10"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
                  lineHeight: 0.85,
                  marginTop: '-0.06em',
                  WebkitTextStroke: '0.065em #14100D',
                  paintOrder: 'stroke fill',
                  strokeLinejoin: 'round',
                  textShadow: '0 6px 26px rgba(0,0,0,0.75)',
                }}
              >
                acesa
              </span>
            </span>
          </h2>

          {/* Subtítulo */}
          <p
            ref={titleSubtitleRef}
            className="mt-4 sm:mt-5 font-display italic text-[#F5E6D0] text-[clamp(1.1rem,1.6vw,1.4rem)] max-w-[40ch] m-0"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              textWrap: 'balance',
              lineHeight: 1.45,
              textShadow: '0 2px 14px rgba(0,0,0,0.8)',
            }}
          >
            “Avise antes para prepararmos a melhor mesa ou venha direto sentir o cheiro da lenha.”
          </p>
        </div>

        {/* ============================================================== */}
        {/* GRID PRINCIPAL: FORMULÁRIO (ESQUERDA) + MAPA (DIREITA)         */}
        {/* ============================================================== */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-[clamp(40px,5vw,88px)] items-start">
          {/* ============================================================ */}
          {/* COLUNA ESQUERDA: FORMULÁRIO DE TRIAGEM DE RESERVA            */}
          {/* ============================================================ */}
          <div ref={formColRef} className="w-full flex flex-col">
            <ReservaTriagem variant="inline" />
          </div>

          {/* ============================================================ */}
          {/* COLUNA DIREITA: MAPA GOOGLE EMBED + 3 COLUNAS DE INFO        */}
          {/* ============================================================ */}
          <div ref={mapColRef} className="w-full flex flex-col">
            {/* Iframe do Mapa: Desktop full-bleed até a borda direita da tela (Carregamento tardio 600px antes da viewport) */}
            <div
              ref={mapWrapperRef}
              className="relative w-full overflow-hidden bg-[#14100D]"
              style={{
                height: 'clamp(300px, 34vw, 420px)',
                marginRight: 'calc(-1 * var(--pad, 0px))',
                width: 'calc(100% + var(--pad, 0px))',
              }}
            >
              {loadMap ? (
                <iframe
                  title="Mapa: Braseiro Caiçara em Ubatuba"
                  src="https://maps.google.com/maps?q=Braseiro%20Cai%C3%A7ara%20Ubatuba&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full border-0 pointer-events-none lg:pointer-events-auto"
                  style={{
                    filter: 'grayscale(0.9) invert(0.92) hue-rotate(180deg) brightness(0.85) contrast(0.95)',
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#14100D] text-[#F5E6D0]/60 gap-2 select-none">
                  <div className="w-6 h-6 border-2 border-[#E8832A] border-t-transparent rounded-full animate-spin" />
                  <span className="font-text text-[12px] uppercase tracking-wider text-[#F5E6D0]/75">
                    Carregando mapa...
                  </span>
                </div>
              )}
            </div>

            {/* Link para abrir o mapa no mobile sem capturar scroll da página */}
            <div className="lg:hidden mt-3 mb-6 w-full flex justify-center">
              <a
                href={siteConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-text font-semibold uppercase text-[13px] text-[#F5E6D0] tracking-[0.08em] border-b-2 border-[#E8832A] pb-0.5 hover:text-[#E8832A] transition-colors duration-200 select-none"
                style={{ fontFamily: 'var(--font-text)' }}
              >
                ABRIR NO GOOGLE MAPS
              </a>
            </div>

            {/* 3 Colunas de Informações Práticas com fundo de proteção de contraste puro, sem borda e sem radius */}
            {/* TODO: confirmar endereço, horário e estacionamento com o restaurante */}
            <div
              className="mt-7 w-full grid grid-cols-1 sm:grid-cols-3 gap-6 text-left p-4 sm:p-5"
              style={{
                backgroundColor: 'rgba(20,16,13,0.55)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {/* ENDEREÇO */}
              <div className="flex flex-col">
                <span
                  className="font-text font-semibold uppercase text-[12px] tracking-[0.2em] text-[#E8832A] select-none"
                  style={{ fontFamily: 'var(--font-text)' }}
                >
                  ENDEREÇO
                </span>
                <p
                  className="mt-1.5 font-text font-medium text-[15px] sm:text-[16px] text-[#F5E6D0] leading-[1.4] m-0"
                  style={{ fontFamily: 'var(--font-text)', textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
                >
                  Rua Guarani, 370 · Itaguá, Ubatuba - SP
                </p>
                <a
                  href={siteConfig.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block font-text font-semibold uppercase text-[13px] text-[#F5E6D0] tracking-[0.08em] border-b-2 border-[#E8832A] pb-0.5 hover:text-[#E8832A] transition-colors duration-200 select-none w-fit"
                  style={{ fontFamily: 'var(--font-text)' }}
                >
                  ABRIR NO MAPS
                </a>
              </div>

              {/* HORÁRIO */}
              <div className="flex flex-col">
                <span
                  className="font-text font-semibold uppercase text-[12px] tracking-[0.2em] text-[#E8832A] select-none"
                  style={{ fontFamily: 'var(--font-text)' }}
                >
                  HORÁRIO
                </span>
                <p
                  className="mt-1.5 font-text font-medium text-[15px] sm:text-[16px] text-[#F5E6D0] leading-[1.4] m-0"
                  style={{ fontFamily: 'var(--font-text)', textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
                >
                  Todos os dias · 11h30–23h30
                </p>
              </div>

              {/* ESTACIONAMENTO */}
              <div className="flex flex-col">
                <span
                  className="font-text font-semibold uppercase text-[12px] tracking-[0.2em] text-[#E8832A] select-none"
                  style={{ fontFamily: 'var(--font-text)' }}
                >
                  ESTACIONAMENTO
                </span>
                <p
                  className="mt-1.5 font-text font-medium text-[15px] sm:text-[16px] text-[#F5E6D0] leading-[1.4] m-0"
                  style={{ fontFamily: 'var(--font-text)', textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
                >
                  Vagas na rua e estacionamento próximo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationReservationsSection;
