import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CarneIcon } from '@/components/icons/CarneIcon';

gsap.registerPlugin(ScrollTrigger);

export const FireSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);

  // Wrappers e inners do H2
  const line1WrapperRef = useRef<HTMLDivElement>(null);
  const line1InnerRef = useRef<HTMLSpanElement>(null);
  const line2WrapperRef = useRef<HTMLDivElement>(null);
  const line2InnerRef = useRef<HTMLDivElement>(null);
  const line3WrapperRef = useRef<HTMLDivElement>(null);
  const line3InnerRef = useRef<HTMLSpanElement>(null);

  // Carne e faíscas
  const meatIconRef = useRef<HTMLSpanElement>(null);

  // Textos e botão
  const bottomContainerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const p1Ref = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

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
      // 1) Imagem de fundo: parallax e scale suave (apenas desktop >= 1024px)
      if (window.innerWidth >= 1024 && bgImgRef.current) {
        gsap.fromTo(
          bgImgRef.current,
          { scale: 1.08, yPercent: -4 },
          {
            scale: 1,
            yPercent: 4,
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

      // 2) H2: Revelação por máscara
      const lineWrappers = [
        line1WrapperRef.current,
        line2WrapperRef.current,
        line3WrapperRef.current,
      ].filter(Boolean);

      const titleTl = gsap.timeline({
        scrollTrigger: {
          trigger: titleContainerRef.current || sectionRef.current,
          start: 'top 80%',
          once: true,
        },
        onComplete: () => {
          // Folga nas máscaras: visible após concluir a animação
          lineWrappers.forEach((w) => {
            if (w) w.style.overflow = 'visible';
          });
        },
      });

      // Linha 1
      if (line1InnerRef.current) {
        titleTl.fromTo(
          line1InnerRef.current,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.75, ease: 'power3.out' }
        );
      }

      // Linha 2 ("olho") entra com scale 0.92 -> 1
      if (line2InnerRef.current) {
        titleTl.fromTo(
          line2InnerRef.current,
          { yPercent: 100, scale: 0.92, opacity: 0 },
          { yPercent: 0, scale: 1, opacity: 1, duration: 0.85, ease: 'power3.out' },
          '-=0.63' // stagger ~0.12s
        );
      }

      // Linha 3
      if (line3InnerRef.current) {
        titleTl.fromTo(
          line3InnerRef.current,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
          '-=0.63' // stagger ~0.12s
        );
      }

      // Ícone da carne: pop de entrada logo depois do "olho"
      if (meatIconRef.current) {
        titleTl.fromTo(
          meatIconRef.current,
          { scale: 0.5, rotate: 20, opacity: 0 },
          { scale: 1, rotate: 8, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
          '-=0.45'
        );
      }

      // 3) Loops contínuos da carne (faíscas + wobble do corpo)
      const svg = meatIconRef.current?.querySelector('svg');
      const bodyEl = svg?.querySelector('.icon-body');
      const spark1El = svg?.querySelector('.icon-spark--1');
      const spark2El = svg?.querySelector('.icon-spark--2');
      const spark3El = svg?.querySelector('.icon-spark--3');

      const loopTweens: gsap.core.Tween[] = [];

      // Corpo balançando levemente (rotate 8deg ↔ 11deg)
      if (bodyEl) {
        const bodyTween = gsap.fromTo(
          bodyEl,
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

      // Faíscas com durações e delays desencontrados
      if (spark1El) {
        const s1Tween = gsap.fromTo(
          spark1El,
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
        loopTweens.push(s1Tween);
      }

      if (spark2El) {
        const s2Tween = gsap.fromTo(
          spark2El,
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
        loopTweens.push(s2Tween);
      }

      if (spark3El) {
        const s3Tween = gsap.fromTo(
          spark3El,
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
        loopTweens.push(s3Tween);
      }

      // Pausar loops quando a seção sai da viewport para poupar recursos
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

      // 4) Frase, parágrafo e botão: fade-up com stagger 0.1s
      const textEls = [
        quoteRef.current,
        p1Ref.current,
        btnRef.current,
      ].filter(Boolean);

      if (textEls.length > 0) {
        gsap.fromTo(
          textEls,
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: bottomContainerRef.current || sectionRef.current,
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
      id="fogo"
      ref={sectionRef}
      className="relative w-full min-h-[100svh] lg:min-h-[clamp(640px,100svh,960px)] overflow-hidden bg-[#14100D] flex flex-col justify-between scroll-mt-20"
    >
      {/* ============================================================== */}
      {/* IMAGEM DE FUNDO (PICTURE RESPONSIVO)                           */}
      {/* ============================================================== */}
      <picture className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0">
        <source
          media="(min-width: 768px)"
          srcSet="/images/fogo/fogo-desktop-1200.webp 1200w, /images/fogo/fogo-desktop.webp 2400w"
          sizes="100vw"
          type="image/webp"
        />
        <img
          ref={bgImgRef}
          src="/images/fogo/fogo-mobile.webp"
          alt=""
          width={1080}
          height={1935}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-[50%_40%] md:object-[50%_62%]"
        />
      </picture>

      {/* ============================================================== */}
      {/* OVERLAY EM CSS PURO (4 CAMADAS MAIS SUAVES PARA CHAMA VIVA)    */}
      {/* ============================================================== */}
      {/* Camada 1: Base uniforme bem leve (15%) para dar vida às chamas */}
      <div className="absolute inset-0 bg-[#14100D]/15 pointer-events-none z-[1]" />

      {/* Camada 2: Radial central suave para foco no título sem apagar a chama */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 50% 40%, rgba(20,16,13,0.40), transparent 70%)',
        }}
      />

      {/* Camada 3: Gradiente inferior suave (85% até 40% no desktop; reforço no mobile) */}
      <div
        className="absolute inset-0 pointer-events-none z-[3] hidden md:block"
        style={{
          background:
            'linear-gradient(to top, rgba(20,16,13,0.85) 0%, rgba(20,16,13,0.60) 22%, transparent 40%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-[3] md:hidden"
        style={{
          background:
            'linear-gradient(to top, rgba(20,16,13,0.92) 0%, rgba(20,16,13,0.80) 28%, transparent 55%)',
        }}
      />

      {/* Camada 4: Gradiente de transição no topo para emenda limpa com a seção anterior */}
      <div
        className="absolute inset-0 pointer-events-none z-[4]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(20,16,13,1) 0px, rgba(20,16,13,0.6) 45px, transparent 90px)',
        }}
      />

      {/* Textura de Grão sutil (.grao) a 3% de opacidade */}
      <div
        className="absolute inset-0 pointer-events-none z-[5] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ============================================================== */}
      {/* CONTEÚDO DA SEÇÃO                                              */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full grow flex flex-col justify-between px-6 sm:px-8 lg:px-[clamp(32px,5vw,80px)] pt-[clamp(96px,16vw,120px)] lg:pt-[clamp(96px,14vh,160px)] pb-12 sm:pb-14 lg:pb-16">
        {/* Bloco Superior / Central: Eyebrow + H2 */}
        <div
          ref={titleContainerRef}
          className="w-full flex flex-col items-center text-center"
        >
          {/* Eyebrow: O FOGO com fios laterais */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <span className="w-8 sm:w-10 h-[1px] bg-[#F5E6D0]/85 inline-block" />
            <span
              className="font-ui font-semibold uppercase tracking-[0.25em] text-[12px] md:text-[14px] text-[#F5E6D0]/85 select-none"
              style={{ fontFamily: 'var(--font-text)' }}
            >
              O FOGO
            </span>
            <span className="w-8 sm:w-10 h-[1px] bg-[#F5E6D0]/85 inline-block" />
          </div>

          {/* H2 em bloco de 3 linhas */}
          <h2
            className="relative flex flex-col items-center justify-center font-display text-center m-0 select-none max-w-full"
            aria-label="Brasa é ponto, tempo e olho de quem faz"
          >
            {/* Texto acessível completo para leitores de tela */}
            <span className="sr-only">Brasa é ponto, tempo e olho de quem faz</span>

            {/* Linha 1: BRASA É PONTO, TEMPO E */}
            <div
              ref={line1WrapperRef}
              className="line-wrapper block max-w-full"
              style={{
                overflow: prefersReducedMotion ? 'visible' : 'hidden',
                padding: '0.32em 0.2em 0.3em',
                margin: '-0.32em -0.2em -0.3em',
              }}
              aria-hidden="true"
            >
              <span
                ref={line1InnerRef}
                className="block uppercase whitespace-nowrap text-[#F5E6D0] text-[clamp(1.2rem,6.4vw,2rem)] md:text-[clamp(1.7rem,4.2vw,3.9rem)]"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  wordSpacing: '0.12em',
                  textShadow: '0 2px 18px rgba(0, 0, 0, 0.6)',
                  lineHeight: 1.15,
                  fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
                }}
              >
                BRASA É PONTO, TEMPO E
              </span>
            </div>

            {/* Linha 2: "olho" + Ícone da carne */}
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
                className="inline-flex items-center justify-center max-w-full text-[clamp(5.5rem,30vw,9rem)] md:text-[clamp(8rem,17vw,15rem)]"
                style={{
                  fontFamily: 'var(--font-display)',
                  lineHeight: 0.8,
                  marginTop: '-0.06em',
                }}
              >
                <span
                  className="inline-block lowercase italic text-[#E8832A]"
                  style={{
                    fontWeight: 900,
                    fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
                    WebkitTextStroke: '0.06em #14100D',
                    paintOrder: 'stroke fill',
                    strokeLinejoin: 'round',
                    textShadow: '0 6px 28px rgba(0, 0, 0, 0.55)',
                  }}
                >
                  olho
                </span>

                {/* Ícone da Carne (CarneIcon com detalhes e faíscas) */}
                <span
                  ref={meatIconRef}
                  aria-hidden="true"
                  className="inline-block select-none pointer-events-none origin-bottom-left"
                  style={{
                    height: '0.7em',
                    width: 'auto',
                    color: '#E8832A',
                    verticalAlign: 'top',
                    marginLeft: '-0.18em',
                    marginTop: '-0.1em',
                    transform: 'rotate(8deg)',
                  }}
                >
                  <CarneIcon className="h-full w-auto inline-block align-top" />
                </span>
              </div>
            </div>

            {/* Linha 3: DE QUEM FAZ */}
            <div
              ref={line3WrapperRef}
              className="line-wrapper block max-w-full"
              style={{
                overflow: prefersReducedMotion ? 'visible' : 'hidden',
                padding: '0.22em 0.18em 0.3em',
                margin: '-0.22em -0.18em -0.3em',
              }}
              aria-hidden="true"
            >
              <span
                ref={line3InnerRef}
                className="block uppercase whitespace-nowrap text-[#F5E6D0] text-[clamp(1.2rem,6.4vw,2rem)] md:text-[clamp(1.7rem,4.2vw,3.9rem)]"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  wordSpacing: '0.12em',
                  textShadow: '0 2px 18px rgba(0, 0, 0, 0.6)',
                  marginTop: '-0.02em',
                  lineHeight: 1.15,
                  fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
                }}
              >
                DE QUEM FAZ
              </span>
            </div>
          </h2>
        </div>

        {/* Espaçador garantindo centro da foto com chamas altas livre */}
        <div className="min-h-[48px] grow" aria-hidden="true" />

        {/* Bloco Inferior: Frase (esquerda) e Texto curto + Botão (direita) */}
        <div
          ref={bottomContainerRef}
          className="w-full flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 sm:gap-8 lg:gap-12 pb-6 sm:pb-8 lg:pb-0"
        >
          {/* Canto inferior esquerdo: Frase em itálico */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-start">
            <p
              ref={quoteRef}
              className="font-display italic text-[#F5E6D0] leading-[1.35] text-center lg:text-left"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                fontSize: 'clamp(1.15rem, 1.7vw, 1.6rem)',
                maxWidth: '30ch',
                textWrap: 'balance',
              }}
            >
              “Não tem pressa que acelere o carvão, nem relógio que substitua o olhar do assador.”
            </p>
          </div>

          {/* Canto inferior direito: Parágrafo único enxuto (~30 palavras) + botão */}
          {/* 
            Texto removido da copy anterior para reaproveitamento em "Cardápio" ou "Por que o fogo é diferente":
            "Trabalhamos com carnes certificadas, salmoura no ponto certo e uma paixão caiçara que transforma cada almoço e jantar num ritual compartilhado."
            TODO: confirmar com o restaurante se trabalham com carnes certificadas
          */}
          <div className="w-full lg:max-w-[38ch] flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
            <p
              ref={p1Ref}
              className="font-text font-normal text-[#F5E6D0]/90 leading-[1.65]"
              style={{
                fontFamily: 'var(--font-text)',
                fontSize: 'clamp(1rem, 1.15vw, 1.125rem)',
                maxWidth: '38ch',
                textWrap: 'balance',
              }}
            >
              Aqui o fogo sela o suco, caramela a crosta e deixa na gordura o aroma de lenha estalando. Do chorizo ao ponto à costela que desmancha, cada corte recebe o calor exato.
            </p>

            <div className="pt-2 w-full flex justify-center lg:justify-start">
              <a
                ref={btnRef}
                href="/cardapio"
                className="inline-flex items-center justify-center text-[#14100D] bg-[#F5E6D0] hover:bg-[#E8832A] hover:text-[#14100D] active:translate-y-0.5 px-8 py-3 rounded-[6px] transition-all duration-300 ease-out font-text font-semibold uppercase tracking-[0.08em] text-[14px] sm:text-[15px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8832A] shadow-lg w-full max-w-[340px] sm:max-w-[420px] lg:max-w-none text-center"
                style={{ fontFamily: 'var(--font-text)' }}
              >
                VER CARDÁPIO
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FireSection;
