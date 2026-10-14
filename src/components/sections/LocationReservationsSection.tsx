import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/config';

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

  // Estado do formulário
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('19:30');
  const [pessoas, setPessoas] = useState('2');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Erros de validação
  const [errors, setErrors] = useState<{
    nome?: string;
    data?: string;
    horario?: string;
    pessoas?: string;
  }>({});

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

  // Data mínima: hoje (yyyy-mm-dd)
  const todayStr = new Date().toISOString().split('T')[0];

  // Verificação de número de WhatsApp real vs exemplo
  // Se for o exemplo 99999-9999 ou vazio, o botão deve ficar desabilitado
  const isDummyNumber =
    !siteConfig.phoneRaw ||
    siteConfig.phoneRaw.includes('999999999') ||
    siteConfig.phoneRaw.trim() === '';

  // Validação e envio para WhatsApp
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isDummyNumber) return;

    const newErrors: { nome?: string; data?: string; horario?: string; pessoas?: string } = {};

    if (!nome.trim()) {
      newErrors.nome = 'Informe seu nome para a reserva';
    }
    if (!data) {
      newErrors.data = 'Selecione a data';
    }
    if (!horario) {
      newErrors.horario = 'Selecione o horário';
    }
    if (!pessoas) {
      newErrors.pessoas = 'Selecione o número de pessoas';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Formatar data para DD/MM/AAAA
    const [ano, mes, dia] = data.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;

    let msg = '';
    if (pessoas === '13+') {
      msg = `Olá! Meu nome é ${nome.trim()}. Gostaria de reservar uma mesa para um grupo de 13 pessoas ou mais no dia ${dataFormatada} às ${horario}. Pode confirmar, por favor?`;
    } else {
      msg = `Olá! Meu nome é ${nome.trim()}. Gostaria de reservar uma mesa para ${pessoas} no dia ${dataFormatada} às ${horario}. Pode confirmar, por favor?`;
    }

    const whatsappUrl = `https://wa.me/${siteConfig.phoneRaw}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

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
      className="relative w-full overflow-hidden bg-[#14100D] text-[#F5E6D0] scroll-mt-16"
      style={{
        position: 'relative',
        isolation: 'isolate',
        overflow: 'hidden',
        backgroundColor: '#14100D',
        paddingTop: 'clamp(96px, 10vw, 150px)',
        paddingBottom: 'clamp(100px, 10vw, 160px)',
        paddingLeft: 'var(--pad, clamp(24px, 5vw, 80px))',
        paddingRight: 'var(--pad, clamp(24px, 5vw, 80px))',
        ['--pad' as any]: 'clamp(24px, 5vw, 80px)',
      }}
    >
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
                  letterSpacing: '0.05em',
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
                  className="absolute inset-0 block lowercase italic text-[#E8832A] whitespace-nowrap text-[clamp(4.3rem,15vw,6.8rem)] lg:text-[clamp(5.6rem,12.5vw,11.5rem)] select-none pointer-events-none filter blur-[18px] animate-pulse z-0"
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
                className="block lowercase italic text-[#E8832A] whitespace-nowrap text-[clamp(4.3rem,15vw,6.8rem)] lg:text-[clamp(5.6rem,12.5vw,11.5rem)] relative z-10"
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
          {/* COLUNA ESQUERDA: FORMULÁRIO SEM CAIXAS                       */}
          {/* ============================================================ */}
          <div ref={formColRef} className="w-full flex flex-col">
            <form onSubmit={handleFormSubmit} noValidate className="w-full flex flex-col">
              {/* Grid 2x2 para Data, Pessoas, Horário e Nome (Nome ocupa 2 colunas) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">
                {/* 1) DATA */}
                <div className="relative flex flex-col">
                  <label
                    htmlFor="reserva-data"
                    className="font-text font-semibold uppercase text-[12px] tracking-[0.2em] text-[#F5E6D0]/80 mb-1"
                    style={{ fontFamily: 'var(--font-text)' }}
                  >
                    DATA
                  </label>
                  <input
                    id="reserva-data"
                    type="date"
                    min={todayStr}
                    value={data}
                    onChange={(e) => {
                      setData(e.target.value);
                      if (errors.data) setErrors({ ...errors, data: undefined });
                    }}
                    onFocus={() => setFocusedField('data')}
                    onBlur={() => setFocusedField(null)}
                    required
                    aria-describedby={errors.data ? 'erro-data' : undefined}
                    className="w-full bg-transparent border-0 border-b border-[#F5E6D0]/45 py-2 px-0 text-[#F5E6D0] font-text font-medium text-[18px] focus:outline-none cursor-pointer"
                    style={{
                      fontFamily: 'var(--font-text)',
                      colorScheme: 'dark',
                    }}
                  />
                  {/* Linha de foco animada scaleX */}
                  <span
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E8832A] pointer-events-none transition-transform duration-250 ease-out origin-left"
                    style={{
                      transform: focusedField === 'data' ? 'scaleX(1)' : 'scaleX(0)',
                    }}
                  />
                  {errors.data && (
                    <span id="erro-data" aria-live="polite" className="mt-1.5 text-[13px] text-[#F4A340] font-text font-medium">
                      {errors.data}
                    </span>
                  )}
                </div>

                {/* 2) PESSOAS */}
                <div className="relative flex flex-col">
                  <label
                    htmlFor="reserva-pessoas"
                    className="font-text font-semibold uppercase text-[12px] tracking-[0.2em] text-[#F5E6D0]/80 mb-1"
                    style={{ fontFamily: 'var(--font-text)' }}
                  >
                    PESSOAS
                  </label>
                  <select
                    id="reserva-pessoas"
                    value={pessoas}
                    onChange={(e) => {
                      setPessoas(e.target.value);
                      if (errors.pessoas) setErrors({ ...errors, pessoas: undefined });
                    }}
                    onFocus={() => setFocusedField('pessoas')}
                    onBlur={() => setFocusedField(null)}
                    required
                    aria-describedby={errors.pessoas ? 'erro-pessoas' : undefined}
                    className="w-full bg-transparent border-0 border-b border-[#F5E6D0]/45 py-2 px-0 text-[#F5E6D0] font-text font-medium text-[18px] focus:outline-none cursor-pointer"
                    style={{
                      fontFamily: 'var(--font-text)',
                      colorScheme: 'dark',
                    }}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n} className="bg-[#14100D] text-[#F5E6D0]">
                        {n} {n === 1 ? 'pessoa' : 'pessoas'}
                      </option>
                    ))}
                    <option value="13+" className="bg-[#14100D] text-[#F5E6D0]">
                      13 ou mais (falar com a gente)
                    </option>
                  </select>
                  <span
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E8832A] pointer-events-none transition-transform duration-250 ease-out origin-left"
                    style={{
                      transform: focusedField === 'pessoas' ? 'scaleX(1)' : 'scaleX(0)',
                    }}
                  />
                  {errors.pessoas && (
                    <span id="erro-pessoas" aria-live="polite" className="mt-1.5 text-[13px] text-[#F4A340] font-text font-medium">
                      {errors.pessoas}
                    </span>
                  )}
                </div>

                {/* 3) HORÁRIO */}
                <div className="relative flex flex-col">
                  <label
                    htmlFor="reserva-horario"
                    className="font-text font-semibold uppercase text-[12px] tracking-[0.2em] text-[#F5E6D0]/80 mb-1"
                    style={{ fontFamily: 'var(--font-text)' }}
                  >
                    HORÁRIO
                  </label>
                  {/* TODO: confirmar último horário de reserva com o restaurante */}
                  <select
                    id="reserva-horario"
                    value={horario}
                    onChange={(e) => {
                      setHorario(e.target.value);
                      if (errors.horario) setErrors({ ...errors, horario: undefined });
                    }}
                    onFocus={() => setFocusedField('horario')}
                    onBlur={() => setFocusedField(null)}
                    required
                    aria-describedby={errors.horario ? 'erro-horario' : undefined}
                    className="w-full bg-transparent border-0 border-b border-[#F5E6D0]/45 py-2 px-0 text-[#F5E6D0] font-text font-medium text-[18px] focus:outline-none cursor-pointer"
                    style={{
                      fontFamily: 'var(--font-text)',
                      colorScheme: 'dark',
                    }}
                  >
                    {[
                      '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
                      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00',
                      '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
                      '22:00', '22:30',
                    ].map((h) => (
                      <option key={h} value={h} className="bg-[#14100D] text-[#F5E6D0]">
                        {h}
                      </option>
                    ))}
                  </select>
                  <span
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E8832A] pointer-events-none transition-transform duration-250 ease-out origin-left"
                    style={{
                      transform: focusedField === 'horario' ? 'scaleX(1)' : 'scaleX(0)',
                    }}
                  />
                  {errors.horario && (
                    <span id="erro-horario" aria-live="polite" className="mt-1.5 text-[13px] text-[#F4A340] font-text font-medium">
                      {errors.horario}
                    </span>
                  )}
                </div>

                {/* 4) NOME (Ocupa a linha inteira em sm:col-span-2) */}
                <div className="sm:col-span-2 relative flex flex-col">
                  <label
                    htmlFor="reserva-nome"
                    className="font-text font-semibold uppercase text-[12px] tracking-[0.2em] text-[#F5E6D0]/80 mb-1"
                    style={{ fontFamily: 'var(--font-text)' }}
                  >
                    NOME COMPLETO
                  </label>
                  <input
                    id="reserva-nome"
                    type="text"
                    autoComplete="name"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value);
                      if (errors.nome) setErrors({ ...errors, nome: undefined });
                    }}
                    onFocus={() => setFocusedField('nome')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Seu nome"
                    required
                    aria-describedby={errors.nome ? 'erro-nome' : undefined}
                    className="w-full bg-transparent border-0 border-b border-[#F5E6D0]/45 py-2 px-0 text-[#F5E6D0] placeholder-[#F5E6D0]/35 font-text font-medium text-[18px] focus:outline-none"
                    style={{ fontFamily: 'var(--font-text)' }}
                  />
                  <span
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E8832A] pointer-events-none transition-transform duration-250 ease-out origin-left"
                    style={{
                      transform: focusedField === 'nome' ? 'scaleX(1)' : 'scaleX(0)',
                    }}
                  />
                  {errors.nome && (
                    <span id="erro-nome" aria-live="polite" className="mt-1.5 text-[13px] text-[#F4A340] font-text font-medium">
                      {errors.nome}
                    </span>
                  )}
                </div>
              </div>

              {/* Botão de Envio */}
              <div className="mt-9 flex flex-col items-start w-full">
                <button
                  type="submit"
                  disabled={isDummyNumber}
                  aria-disabled={isDummyNumber}
                  className={`inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#F5E6D0] text-[#14100D] transition-colors duration-200 font-text font-semibold uppercase text-[14px] tracking-[0.08em] py-4 px-7 select-none shadow-md w-full sm:w-auto max-w-[420px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#E8832A] ${
                    isDummyNumber
                      ? 'opacity-60 cursor-not-allowed'
                      : 'hover:bg-[#E8832A] hover:text-[#14100D] cursor-pointer'
                  }`}
                  style={{ fontFamily: 'var(--font-text)' }}
                >
                  <span>RESERVAR PELO WHATSAPP</span>
                  <ArrowUpRight className="w-[18px] h-[18px] shrink-0" />
                </button>

                {/* Linha informativa / aviso se número for dummy */}
                {isDummyNumber ? (
                  <p
                    className="mt-3 text-[14px] text-[#F4A340] font-text m-0"
                    style={{ fontFamily: 'var(--font-text)' }}
                  >
                    Reservas por WhatsApp em breve (aguardando número oficial do restaurante).
                  </p>
                ) : (
                  <p
                    className="mt-3 text-[14px] text-[#F5E6D0]/75 font-text m-0"
                    style={{ fontFamily: 'var(--font-text)' }}
                  >
                    A reserva é confirmada por mensagem do restaurante.
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* ============================================================ */}
          {/* COLUNA DIREITA: MAPA GOOGLE EMBED + 3 COLUNAS DE INFO        */}
          {/* ============================================================ */}
          <div ref={mapColRef} className="w-full flex flex-col">
            {/* Iframe do Mapa: Desktop full-bleed até a borda direita da tela */}
            <div
              className="relative w-full overflow-hidden"
              style={{
                height: 'clamp(300px, 34vw, 420px)',
                marginRight: 'calc(-1 * var(--pad, 0px))',
                width: 'calc(100% + var(--pad, 0px))',
              }}
            >
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
