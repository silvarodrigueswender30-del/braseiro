import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChamaIcon } from '@/components/icons/ChamaIcon';
import { heroVideos, siteConfig } from '@/config';
import { Volume2, VolumeX, Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleLinesRef = useRef<HTMLSpanElement[]>([]);
  const chamaRef = useRef<HTMLSpanElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [hasInteractedSound, setHasInteractedSound] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detecta preferência de movimento reduzido
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Controle de reprodução e visibilidade do vídeo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Pausa e silencia ao trocar de aba
    const handleVisibility = () => {
      if (document.hidden && video) {
        video.pause();
        video.muted = true;
        setIsMuted(true);
        setIsPlaying(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Autoplay apenas com pelo menos 40% visível na viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!prefersReducedMotion) {
              video.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          } else {
            video.pause();
            video.muted = true;
            setIsMuted(true);
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [prefersReducedMotion]);

  // Alternar som do vídeo
  const toggleSound = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    setHasInteractedSound(true);

    if (!nextMuted && videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // Botão manual de play para prefers-reduced-motion
  const handleManualPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
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
        });
      }

      // 2. Animação da Chama presa ao texto "mesa"
      if (chamaRef.current) {
        // Entrada com leve pop após a revelação da palavra "mesa"
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

        // Corpo respirando em loop
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

        // Faíscas subindo com durações e delays desencontrados (1.2s, 1.7s, 2.3s)
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

      // 3. Efeito sutil de scale no vídeo conforme entra na viewport
      if (videoRef.current) {
        gsap.fromTo(
          videoRef.current,
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
      aria-labelledby="quem-somos-heading"
      className="relative flex flex-col lg:flex-row items-stretch bg-[#F5E6D0] text-[#14100D] grao overflow-hidden border-t border-[#14100D]/15 scroll-mt-24"
    >
      {/* ============================================================== */}
      {/* COLUNA ESQUERDA: Vídeo como Parede da Seção (Full-Bleed 9:16)  */}
      {/* ============================================================== */}
      <div
        ref={videoWrapperRef}
        className="w-full lg:w-[clamp(340px,31vw,460px)] shrink-0 relative aspect-[9/16] lg:aspect-auto max-h-[75svh] lg:max-h-none overflow-hidden bg-[#14100D]"
        style={{
          // Garante proporção 9:16 rigorosa no desktop
          aspectRatio: '9 / 16',
        }}
      >
        <video
          ref={videoRef}
          src={heroVideos[1]}
          poster="/images/hero/poster2.webp"
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover select-none pointer-events-none"
        />

        {/* Gradiente sutil no rodapé do vídeo para o botão de som destacar */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        {/* Botão de Som no Canto Inferior Esquerdo */}
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

          {/* Botão play/pause adicional em modo reduced-motion */}
          {prefersReducedMotion && (
            <button
              type="button"
              onClick={handleManualPlay}
              aria-label={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
              className="w-11 h-11 rounded-full flex items-center justify-center bg-[#F5E6D0] text-[#14100D] shadow-md hover:bg-white"
            >
              <Play className="w-4 h-4 text-[#14100D] fill-current" />
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* COLUNA DIREITA: Texto Editorial & H2 com Chama Presa à Frase   */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 xl:px-20 py-12 sm:py-16 lg:py-20 relative">
        <div className="w-full max-w-2xl">
          {/* Eyebrow com fios laterais */}
          <div className="mb-4 sm:mb-6">
            <span className="eyebrow text-[#14100D]/75">O CHURRASCO DO MAR</span>
          </div>

          {/* H2 com 3 Linhas na Lógica da Hero */}
          <h2
            id="quem-somos-heading"
            className="mb-6 sm:mb-8 select-none"
          >
            {/* Linha 1 */}
            <span className="block overflow-hidden">
              <span
                ref={addToLinesRef}
                className="block font-display font-[700] uppercase text-[#14100D] whitespace-nowrap tracking-[0.06em] [word-spacing:0.12em] leading-[1.05] text-[clamp(1.1rem,5.4vw,1.7rem)] sm:text-[clamp(1.5rem,2.9vw,2.8rem)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                DO MAR PARA A BRASA,
              </span>
            </span>

            {/* Linha 2 */}
            <span className="block overflow-hidden">
              <span
                ref={addToLinesRef}
                className="block font-display font-[700] uppercase text-[#14100D] whitespace-nowrap tracking-[0.06em] [word-spacing:0.12em] leading-[1.05] text-[clamp(1.1rem,5.4vw,1.7rem)] sm:text-[clamp(1.5rem,2.9vw,2.8rem)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                DA BRASA PARA A SUA
              </span>
            </span>

            {/* Linha 3: mesa + CHAMA presa ao texto */}
            <span className="block overflow-hidden">
              <span
                ref={addToLinesRef}
                className="inline-flex items-baseline font-display font-[900] italic text-[#E8832A] leading-[0.8] -mt-[0.08em] text-[clamp(5rem,26vw,8rem)] sm:text-[clamp(6rem,12.5vw,11rem)]"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
                }}
              >
                <span>mesa</span>
                {/* Ícone da Chama como parte da palavra, com 1em de altura e inclinado -6deg */}
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

          {/* Parágrafo de Copy */}
          <p
            ref={copyRef}
            className="font-text font-normal text-[18px] sm:text-[19px] leading-[1.6] max-w-[44ch] text-[#14100D]/85 mb-8"
            style={{ fontFamily: 'var(--font-text)' }}
          >
            O Churrasco do Mar do Braseiro é para quem gosta de sabores marcantes,
            preparados com aquele cuidado que faz toda diferença.
          </p>

          {/* Informações Práticas Sem Caixas nem Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#14100D]/15 mb-8">
            <div>
              <span className="block font-text font-semibold uppercase tracking-[0.2em] text-[12px] text-[#E8832A] mb-1">
                HORÁRIO
              </span>
              <p className="font-text font-medium text-[17px] text-[#14100D] leading-snug">
                {siteConfig.hoursShort}
              </p>
            </div>

            <div>
              <span className="block font-text font-semibold uppercase tracking-[0.2em] text-[12px] text-[#E8832A] mb-1">
                ONDE
              </span>
              <p className="font-text font-medium text-[17px] text-[#14100D] leading-snug">
                {siteConfig.addressFull}
              </p>
              <a
                href={siteConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[14px] text-[#14100D] underline hover:text-[#E8832A] mt-1 transition-colors"
              >
                Ver no Google Maps
              </a>
            </div>
          </div>

          {/* Botões no Estilo Editorial */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 sm:gap-7">
            <a
              href="#reservas"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-[6px] bg-[#14100D] text-[#F5E6D0] font-text font-semibold uppercase tracking-[0.08em] text-[14px] hover:bg-[#B8352B] hover:text-white transition-colors duration-200 shadow-sm"
            >
              RESERVAR MESA
            </a>

            <a
              href="#cardapio"
              className="inline-flex items-center justify-center py-2 text-[#14100D] font-text font-semibold uppercase tracking-[0.08em] text-[14px] underline decoration-2 decoration-[#E8832A] underline-offset-4 hover:text-[#E8832A] transition-colors duration-200"
            >
              VER CARDÁPIO
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
