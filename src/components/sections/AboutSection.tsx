import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChamaIcon } from '@/components/icons/ChamaIcon';
import { heroVideos, siteConfig } from '@/config';
import { Volume2, VolumeX, Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const video3Ref = useRef<HTMLVideoElement>(null);
  const titleLinesRef = useRef<HTMLSpanElement[]>([]);
  const chamaRef = useRef<HTMLSpanElement>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [hasInteractedSound, setHasInteractedSound] = useState(false);
  const [isPlaying2, setIsPlaying2] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Monitora viewport desktop (≥1024px) para renderizar o vídeo 3 apenas em telas grandes
  useEffect(() => {
    const mqDesktop = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mqDesktop.matches);
    const handleDesktop = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mqDesktop.addEventListener('change', handleDesktop);

    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mqMotion.matches);
    const handleMotion = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mqMotion.addEventListener('change', handleMotion);

    return () => {
      mqDesktop.removeEventListener('change', handleDesktop);
      mqMotion.removeEventListener('change', handleMotion);
    };
  }, []);

  // Lazy-load do src do vídeo 3 quando a seção estiver a 400px de entrar na tela
  const [shouldLoadVideo3, setShouldLoadVideo3] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const loadObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoadVideo3(true);
          loadObserver.disconnect();
        }
      },
      { rootMargin: '400px' }
    );

    loadObserver.observe(el);
    return () => loadObserver.disconnect();
  }, []);

  // Controle de reprodução e visibilidade dos vídeos
  useEffect(() => {
    const v2 = video2Ref.current;
    const v3 = video3Ref.current;

    const handleVisibility = () => {
      if (document.hidden) {
        if (v2) {
          v2.pause();
          v2.muted = true;
          setIsMuted(true);
          setIsPlaying2(false);
        }
        if (v3) {
          v3.pause();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!prefersReducedMotion) {
              if (v2) v2.play().then(() => setIsPlaying2(true)).catch(() => {});
              if (v3) v3.play().catch(() => {});
            }
          } else {
            if (v2) {
              v2.pause();
              v2.muted = true;
              setIsMuted(true);
              setIsPlaying2(false);
            }
            if (v3) {
              v3.pause();
            }
          }
        });
      },
      { threshold: 0.4 }
    );

    if (v2) observer.observe(v2);
    if (v3) observer.observe(v3);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [prefersReducedMotion, shouldLoadVideo3, isDesktop]);

  // Alternar som do vídeo 2
  const toggleSound = () => {
    if (!video2Ref.current) return;
    const nextMuted = !isMuted;
    video2Ref.current.muted = nextMuted;
    setIsMuted(nextMuted);
    setHasInteractedSound(true);

    if (!nextMuted && video2Ref.current.paused) {
      video2Ref.current.play().then(() => setIsPlaying2(true)).catch(() => {});
    }
  };

  // Botão manual de play para prefers-reduced-motion
  const handleManualPlay = () => {
    if (!video2Ref.current) return;
    if (video2Ref.current.paused) {
      video2Ref.current.play().then(() => setIsPlaying2(true)).catch(() => {});
    } else {
      video2Ref.current.pause();
      setIsPlaying2(false);
    }
  };

  // Animações GSAP + ScrollTrigger
  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Linhas do H2 reveladas com máscara
      if (titleLinesRef.current.length > 0) {
        gsap.from(titleLinesRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
          yPercent: 100,
          opacity: 0,
          duration: 0.95,
          stagger: 0.12,
          ease: 'power3.out',
          onComplete: () => {
            titleLinesRef.current.forEach((el) => {
              const wrapper = el.parentElement;
              if (wrapper) {
                wrapper.style.overflow = 'visible';
              }
            });
          },
        });
      }

      // 2. Animação da Chama presa ao texto "mesa"
      if (chamaRef.current) {
        // Pop de entrada
        gsap.from(chamaRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
          scale: 0.6,
          opacity: 0,
          duration: 0.8,
          delay: 0.35,
          ease: 'back.out(1.7)',
        });

        // Respiração do corpo
        const bodyEl = chamaRef.current.querySelector('.icon-body');
        if (bodyEl) {
          gsap.to(bodyEl, {
            scale: 1.03,
            transformOrigin: '50% 100%',
            duration: 2.4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }

        // Faíscas desincronizadas (1.2s, 1.7s, 2.3s)
        const sparks = chamaRef.current.querySelectorAll('.icon-spark');
        const sparkDurations = [1.2, 1.7, 2.3];
        const sparkDelays = [0, 0.45, 0.9];
        sparks.forEach((spark, idx) => {
          gsap.to(spark, {
            y: -30 - idx * 8,
            opacity: 0,
            duration: sparkDurations[idx % sparkDurations.length],
            delay: sparkDelays[idx % sparkDelays.length],
            repeat: -1,
            ease: 'power1.out',
          });
        });
      }

      // 3. Efeito sutil de scale nos vídeos
      if (video2Ref.current) {
        gsap.fromTo(
          video2Ref.current,
          { scale: 1.06 },
          {
            scale: 1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
            ease: 'none',
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const addToLinesRef = (el: HTMLSpanElement | null) => {
    if (el && !titleLinesRef.current.includes(el)) {
      titleLinesRef.current.push(el);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="casa"
      aria-labelledby="churrasco-mar-heading"
      className="relative flex flex-col lg:flex-row items-stretch bg-[#F5E6D0] text-[#14100D] grao overflow-hidden border-t border-[#14100D]/15 scroll-mt-24"
    >
      {/* ============================================================== */}
      {/* COLUNA ESQUERDA: Vídeo 2 (Full-Bleed 9:16 com som interativo)   */}
      {/* ============================================================== */}
      <div
        className="w-full lg:w-[clamp(340px,31vw,460px)] shrink-0 relative aspect-[9/16] lg:aspect-auto max-h-[75svh] lg:max-h-none overflow-hidden bg-[#14100D]"
        style={{
          // Define a proporção 9:16 base para a altura da seção no desktop
          aspectRatio: '9 / 16',
        }}
      >
        <video
          ref={video2Ref}
          src={heroVideos[1]}
          poster="/images/hero/poster2.webp"
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover select-none pointer-events-none"
        />

        {/* Gradiente sutil no rodapé para legibilidade do botão de som */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        {/* Botão de Som */}
        <div className="absolute bottom-5 left-5 z-20 flex items-center gap-3 pointer-events-auto">
          {!hasInteractedSound ? (
            <button
              type="button"
              onClick={toggleSound}
              aria-label="Ativar som do vídeo"
              aria-pressed="false"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F5E6D0] text-[#14100D] font-text font-semibold text-xs tracking-wider uppercase shadow-md hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8832A] transition-all duration-200"
            >
              <Volume2 className="w-4 h-4 text-[#14100D] shrink-0" />
              <span>Ativar som</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleSound}
              aria-label={isMuted ? 'Ativar som do vídeo' : 'Desativar som do vídeo'}
              aria-pressed={!isMuted}
              className="w-11 h-11 rounded-full flex items-center justify-center bg-[#F5E6D0] text-[#14100D] shadow-md hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8832A] transition-all duration-200"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-[#14100D]" />
              ) : (
                <Volume2 className="w-5 h-5 text-[#14100D]" />
              )}
            </button>
          )}

          {prefersReducedMotion && (
            <button
              type="button"
              onClick={handleManualPlay}
              aria-label={isPlaying2 ? 'Pausar vídeo' : 'Reproduzir vídeo'}
              className="w-11 h-11 rounded-full flex items-center justify-center bg-[#F5E6D0] text-[#14100D] shadow-md hover:bg-white"
            >
              <Play className="w-4 h-4 text-[#14100D] fill-current" />
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* COLUNA CENTRAL: Texto Editorial "O Churrasco do Mar"           */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-[clamp(32px,3.8vw,64px)] py-12 sm:py-16 lg:py-14 relative z-10">
        <div className="w-full max-w-xl mx-auto lg:mx-0">
          {/* Eyebrow */}
          <div className="mb-4 sm:mb-5">
            <span className="eyebrow text-[#14100D]/75">O CHURRASCO DO MAR</span>
          </div>

          {/* H2 com 3 Linhas na Lógica da Hero */}
          <h2
            id="churrasco-mar-heading"
            className="mb-5 sm:mb-6 select-none"
          >
            {/* Linha 1 */}
            <span
              className="block"
              style={{
                overflow: prefersReducedMotion ? 'visible' : 'hidden',
                padding: '0.22em 0.18em 0.3em',
                margin: '-0.22em -0.18em -0.3em',
              }}
            >
              <span
                ref={addToLinesRef}
                className="block font-display font-[700] uppercase text-[#14100D] whitespace-nowrap tracking-[0.06em] [word-spacing:0.12em] leading-[1.05] text-[clamp(1.1rem,4.8vw,1.6rem)] sm:text-[clamp(1.35rem,2.4vw,2.3rem)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                DO MAR PARA A BRASA,
              </span>
            </span>

            {/* Linha 2 */}
            <span
              className="block"
              style={{
                overflow: prefersReducedMotion ? 'visible' : 'hidden',
                padding: '0.22em 0.18em 0.3em',
                margin: '-0.22em -0.18em -0.3em',
              }}
            >
              <span
                ref={addToLinesRef}
                className="block font-display font-[700] uppercase text-[#14100D] whitespace-nowrap tracking-[0.06em] [word-spacing:0.12em] leading-[1.05] text-[clamp(1.1rem,4.8vw,1.6rem)] sm:text-[clamp(1.35rem,2.4vw,2.3rem)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                DA BRASA PARA A SUA
              </span>
            </span>

            {/* Linha 3: mesa + CHAMA presa ao texto */}
            <span
              className="block"
              style={{
                overflow: prefersReducedMotion ? 'visible' : 'hidden',
                padding: '0.22em 0.18em 0.3em',
                margin: '-0.22em -0.18em -0.3em',
              }}
            >
              <span
                ref={addToLinesRef}
                className="inline-flex items-baseline font-display font-[900] italic text-[#E8832A] leading-[0.8] -mt-[0.08em] text-[clamp(4.8rem,24vw,7.5rem)] sm:text-[clamp(5rem,9.5vw,8.5rem)]"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
                }}
              >
                <span>mesa</span>
                <span
                  ref={chamaRef}
                  aria-hidden="true"
                  className="inline-block h-[1em] w-auto -ml-[0.12em] -mb-[0.08em] align-[-0.1em] text-[#E8832A] select-none pointer-events-none origin-bottom -rotate-6 shrink-0"
                >
                  <ChamaIcon className="h-full w-auto" />
                </span>
              </span>
            </span>
          </h2>

          {/* Parágrafo 1 */}
          <p
            className="font-text font-normal text-[17px] sm:text-[18px] leading-[1.6] max-w-[44ch] text-[#14100D]/85 mb-3"
            style={{ fontFamily: 'var(--font-text)' }}
          >
            O Churrasco do Mar do Braseiro é para quem gosta de sabores marcantes,
            preparados com aquele cuidado que faz toda diferença.
          </p>

          {/* Parágrafo 2 (Sensorial) */}
          {/* TODO: Confirmar com o restaurante a procedência/pescadores locais */}
          <p
            className="font-text font-normal text-[17px] sm:text-[18px] leading-[1.6] max-w-[44ch] text-[#14100D]/85 mb-6"
            style={{ fontFamily: 'var(--font-text)' }}
          >
            Peixes e frutos do mar chegam frescos dos pescadores de Ubatuba e vão
            direto para a brasa de lenha. Sem pressa, só com sal, fogo e o tempo
            certo de cada corte.
          </p>

          {/* Informações Práticas com Fio Fino */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-5 border-t border-[#14100D]/15 mb-7">
            <div>
              <span className="block font-text font-semibold uppercase tracking-[0.2em] text-[12px] text-[#E8832A] mb-1">
                HORÁRIO
              </span>
              <p className="font-text font-medium text-[16px] text-[#14100D] leading-snug">
                {siteConfig.hoursShort}
              </p>
            </div>

            <div>
              <span className="block font-text font-semibold uppercase tracking-[0.2em] text-[12px] text-[#E8832A] mb-1">
                ONDE
              </span>
              <p className="font-text font-medium text-[16px] text-[#14100D] leading-snug">
                {siteConfig.addressFull}
              </p>
              <a
                href={siteConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[13px] text-[#14100D] underline hover:text-[#E8832A] mt-1 transition-colors"
              >
                Ver no Google Maps
              </a>
            </div>
          </div>

          {/* Botões Editoriais */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
            <a
              href="#reservas"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-[6px] bg-[#14100D] text-[#F5E6D0] font-text font-semibold uppercase tracking-[0.08em] text-[13px] sm:text-[14px] hover:bg-[#B8352B] hover:text-white transition-colors duration-200 shadow-sm"
            >
              RESERVAR MESA
            </a>

            <a
              href="#cardapio"
              className="inline-flex items-center justify-center py-2 text-[#14100D] font-text font-semibold uppercase tracking-[0.08em] text-[13px] sm:text-[14px] underline decoration-2 decoration-[#E8832A] underline-offset-4 hover:text-[#E8832A] transition-colors duration-200"
            >
              VER CARDÁPIO
            </a>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VÍDEO 3 MOBILE (<1024px): Fora do container de texto, full-bleed */}
      {/* ============================================================== */}
      {!isDesktop && (
        <div className="w-full relative aspect-video overflow-hidden bg-[#14100D] m-0 p-0 block shrink-0">
          <video
            ref={video3Ref}
            src={shouldLoadVideo3 && !prefersReducedMotion ? heroVideos[2] : undefined}
            poster="/images/hero/poster3.webp"
            muted
            loop
            playsInline
            preload="none"
            className="w-full h-full object-cover select-none pointer-events-none filter saturate-[1.05] contrast-[1.02] block border-0 rounded-none shadow-none"
          />
        </div>
      )}

      {/* ============================================================== */}
      {/* COLUNA DIREITA: Vídeo 3 (Full-Bleed, Desktop ≥1024px apenas)    */}
      {/* ============================================================== */}
      {isDesktop && (
        <div className="hidden lg:block lg:w-[clamp(260px,22vw,330px)] shrink-0 relative overflow-hidden bg-[#14100D]">
          <video
            ref={video3Ref}
            src={shouldLoadVideo3 && !prefersReducedMotion ? heroVideos[2] : undefined}
            poster="/images/hero/poster3.webp"
            muted
            loop
            playsInline
            preload="none"
            className="w-full h-full object-cover select-none pointer-events-none filter saturate-[1.05] contrast-[1.02]"
          />
        </div>
      )}
    </section>
  );
};

export default AboutSection;
