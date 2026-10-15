import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pause, Play } from 'lucide-react';
import { siteConfig, heroVideos } from '@/config';
import { RotatingWord } from '@/components/RotatingWord';
import { useVideosPaused } from '@/lib/videoState';
import { useReservationModal } from '@/context/ReservationModalContext';

interface DesktopPanelProps {
  videoSrc: string;
  posterSrc: string;
  shouldLoad: boolean;
  onCanPlay?: () => void;
  paused: boolean;
  reducedMotion: boolean;
}

const DesktopPanel: React.FC<DesktopPanelProps> = ({
  videoSrc,
  posterSrc,
  shouldLoad,
  onCanPlay,
  paused,
  reducedMotion,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const stallTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad || reducedMotion || hasError) return;

    if (paused) {
      video.pause();
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay interrupted or waiting
        });
      }
    }
  }, [paused, shouldLoad, reducedMotion, hasError]);

  const handlePlaying = () => {
    setIsPlaying(true);
    if (stallTimerRef.current) clearTimeout(stallTimerRef.current);
    onCanPlay?.();
  };

  const handleWaiting = () => {
    if (stallTimerRef.current) clearTimeout(stallTimerRef.current);
    stallTimerRef.current = setTimeout(() => {
      // Stalled for > 4s, fallback to poster
      setHasError(true);
    }, 4000);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#05070D]">
      {/* Poster image (sempre presente por baixo para evitar tela preta) */}
      <img
        src={posterSrc}
        alt=""
        width={720}
        height={1280}
        loading="eager"
        fetchPriority={posterSrc.includes('poster1') ? 'high' : 'auto'}
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
      />

      {/* Video Element */}
      {!reducedMotion && !hasError && shouldLoad && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          controlsList="nodownload"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={handlePlaying}
          onWaiting={handleWaiting}
          onError={handleError}
          className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-500 ease-out ${
            isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};

export const Hero: React.FC = () => {
  const { openReservationModal } = useReservationModal();
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 767;
    }
    return false;
  });

  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(true);
  const [isDocVisible, setIsDocVisible] = useState<boolean>(true);

  // Desktop Triptych state
  const [vid1Ready, setVid1Ready] = useState(false);

  // Mobile Sequential state (Player A e Player B com crossfade 500ms)
  const [activePlayer, setActivePlayer] = useState<'A' | 'B'>('A');
  // Poster-first: inicia vazio para não concorrer com LCP na rede móvel
  const [playerASrc, setPlayerASrc] = useState<string>('');
  const [playerBSrc, setPlayerBSrc] = useState<string>('');
  const [currentVideoIdx, setCurrentVideoIdx] = useState<number>(0);
  const [mobilePlaying, setMobilePlaying] = useState<boolean>(false);
  const [mobileAllFailed, setMobileAllFailed] = useState<boolean>(false);
  const [mobileVideoStarted, setMobileVideoStarted] = useState<boolean>(false);

  const heroContainerRef = useRef<HTMLElement>(null);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const mobileStallTimer = useRef<NodeJS.Timeout | null>(null);

  const isTransparent = siteConfig.headerMode === 'transparent';

  // 1. Detect screen size and reduced motion / saveData
  useEffect(() => {
    const mobileMq = window.matchMedia('(max-width: 767px)');
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleResize = () => setIsMobile(mobileMq.matches);
    const handleMotion = () => {
      const saveData = (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData;
      setReducedMotion(motionMq.matches || !!saveData);
    };

    handleResize();
    handleMotion();

    mobileMq.addEventListener('change', handleResize);
    motionMq.addEventListener('change', handleMotion);

    return () => {
      mobileMq.removeEventListener('change', handleResize);
      motionMq.removeEventListener('change', handleMotion);
    };
  }, []);

  // Poster-first no Mobile: só inicia download do MP4 após LCP consolidado (interação ou timeout 2.5s)
  useEffect(() => {
    if (!isMobile || reducedMotion || mobileVideoStarted) return;

    let timer: NodeJS.Timeout | null = null;
    const startVideo = () => {
      setMobileVideoStarted(true);
      setPlayerASrc(heroVideos[0]);
      cleanup();
    };

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('scroll', startVideo);
      window.removeEventListener('touchstart', startVideo);
      window.removeEventListener('click', startVideo);
    };

    window.addEventListener('scroll', startVideo, { passive: true, once: true });
    window.addEventListener('touchstart', startVideo, { passive: true, once: true });
    window.addEventListener('click', startVideo, { passive: true, once: true });

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        timer = setTimeout(startVideo, 2500);
      }, { timeout: 3500 });
    } else {
      timer = setTimeout(startVideo, 2500);
    }

    return cleanup;
  }, [isMobile, reducedMotion, mobileVideoStarted]);

  // 2. Pause when document hidden or hero offscreen
  useEffect(() => {
    const handleVisibility = () => {
      setIsDocVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibility);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (heroContainerRef.current) {
      observer.observe(heroContainerRef.current);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      observer.disconnect();
    };
  }, []);

  const { isPaused: userPausedVideos, toggle: togglePauseVideos } = useVideosPaused();

  const shouldPauseVideos = !isDocVisible || !isIntersecting || reducedMotion || userPausedVideos;

  // Sincroniza estado de pausa com os reprodutores mobile
  useEffect(() => {
    if (shouldPauseVideos) {
      if (videoARef.current) videoARef.current.pause();
      if (videoBRef.current) videoBRef.current.pause();
    } else {
      if (activePlayer === 'A' && videoARef.current) {
        videoARef.current.play().catch(() => {});
      } else if (activePlayer === 'B' && videoBRef.current) {
        videoBRef.current.play().catch(() => {});
      }
    }
  }, [shouldPauseVideos, activePlayer]);

  // 3. Mobile Sequential Player Logic: vid01 -> vid2 -> vid3 -> vid01
  const advanceMobileVideo = useCallback(() => {
    const nextIdx = (currentVideoIdx + 1) % heroVideos.length;
    setCurrentVideoIdx(nextIdx);

    if (activePlayer === 'A') {
      setActivePlayer('B');
      if (videoBRef.current) {
        videoBRef.current.play().catch(() => {});
      }
      setTimeout(() => {
        if (videoARef.current) {
          videoARef.current.pause();
          videoARef.current.currentTime = 0;
        }
      }, 500);
    } else {
      setActivePlayer('A');
      if (videoARef.current) {
        videoARef.current.play().catch(() => {});
      }
      setTimeout(() => {
        if (videoBRef.current) {
          videoBRef.current.pause();
          videoBRef.current.currentTime = 0;
        }
      }, 500);
    }
  }, [currentVideoIdx, activePlayer]);

  // Handle active video timeupdate on mobile to preload next video after 50%
  const handleMobileTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (!video.duration) return;

    const remaining = video.duration - video.currentTime;
    const pastHalf = video.currentTime / video.duration > 0.5;

    if (pastHalf || remaining <= 3) {
      const nextIdx = (currentVideoIdx + 1) % heroVideos.length;
      const nextSrc = heroVideos[nextIdx];

      if (activePlayer === 'A' && playerBSrc !== nextSrc) {
        setPlayerBSrc(nextSrc);
        videoBRef.current?.load();
      } else if (activePlayer === 'B' && playerASrc !== nextSrc) {
        setPlayerASrc(nextSrc);
        videoARef.current?.load();
      }
    }
  };

  // Play/pause mobile active video
  useEffect(() => {
    if (!isMobile || reducedMotion || mobileAllFailed) return;

    const activeVideo = activePlayer === 'A' ? videoARef.current : videoBRef.current;
    if (!activeVideo) return;

    if (shouldPauseVideos) {
      activeVideo.pause();
    } else {
      activeVideo.play().catch(() => {});
    }
  }, [isMobile, activePlayer, shouldPauseVideos, reducedMotion, mobileAllFailed]);

  // Mobile stall / error detection (>4s)
  const handleMobileWaiting = () => {
    if (mobileStallTimer.current) clearTimeout(mobileStallTimer.current);
    mobileStallTimer.current = setTimeout(() => {
      advanceMobileVideo();
    }, 4000);
  };

  const handleMobilePlaying = () => {
    if (mobileStallTimer.current) clearTimeout(mobileStallTimer.current);
    setMobilePlaying(true);
  };

  const handleMobileError = () => {
    if (heroVideos.length <= 1) {
      setMobileAllFailed(true);
    } else {
      advanceMobileVideo();
    }
  };

  return (
    <section
      id="inicio"
      ref={heroContainerRef}
      className="relative w-full bg-[#05070D] overflow-hidden select-none"
      style={{ backgroundColor: '#05070D' }}
    >
      {/* ============================================================== */}
      {/* DESKTOP & TABLET HERO (>=768px): TRÍPTICO 16/9                 */}
      {/* ============================================================== */}
      {!isMobile && (
        <div className="relative w-full max-w-[2160px] mx-auto aspect-[16/9] min-h-[500px] lg:min-h-0 flex items-center justify-center overflow-hidden">
          {/* Tríptico: 3 Colunas iguais lado a lado */}
          <div className="absolute inset-0 grid grid-cols-3 gap-0 w-full h-full pointer-events-none">
            <DesktopPanel
              videoSrc={heroVideos[0]}
              posterSrc="/images/hero/poster1.webp"
              shouldLoad={true}
              onCanPlay={() => setVid1Ready(true)}
              paused={shouldPauseVideos}
              reducedMotion={reducedMotion}
            />
            <DesktopPanel
              videoSrc={heroVideos[1]}
              posterSrc="/images/hero/poster2.webp"
              shouldLoad={vid1Ready}
              paused={shouldPauseVideos}
              reducedMotion={reducedMotion}
            />
            <div className="relative w-full h-full">
              <DesktopPanel
                videoSrc={heroVideos[2]}
                posterSrc="/images/hero/poster3.webp"
                shouldLoad={vid1Ready}
                paused={shouldPauseVideos}
                reducedMotion={reducedMotion}
              />
              {/* Neutralização do tint amarelo-esverdeado do painel direito */}
              <div className="absolute inset-0 bg-[#05070D]/25 pointer-events-none" />
            </div>
          </div>

          {/* Sistema de 3 camadas de Overlay em CSS puro */}
          {/* Camada 1 (base): background escuro uniforme muito leve (rgba(0,0,0,.20)) */}
          <div className="absolute inset-0 pointer-events-none z-10 bg-black/20" />

          {/* Camada 2 (leitura do texto): radial-gradient centrado no texto */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                'radial-gradient(ellipse 75% 60% at 50% 50%, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.35) 55%, transparent 100%)',
            }}
          />

          {/* Camada 3 (topo para o header): linear-gradient do topo para contraste da logo */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.25) 15%, transparent 25%)',
            }}
          />

          {/* Conteúdo Centralizado por Flexbox (Max-Width 1140px, Sem Margem Negativa, levemente subido 3-5% para não cobrir avental) */}
          <div
            className={`relative z-20 w-full max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center pb-4 -translate-y-[2%] md:-translate-y-[3%] ${
              isTransparent ? 'pt-20 lg:pt-24' : 'pt-10 lg:pt-12'
            }`}
          >
            {/* Eyebrow: PARRILLA · FRUTOS DO MAR com fios finos */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-3">
              <span className="w-8 sm:w-10 h-[1px] bg-[#F5E6D0]/85 inline-block" />
              <span className="font-ui font-semibold uppercase tracking-[0.25em] text-[12px] md:text-[14px] text-[#F5E6D0]/85 select-none">
                PARRILLA · FRUTOS DO MAR
              </span>
              <span className="w-8 sm:w-10 h-[1px] bg-[#F5E6D0]/85 inline-block" />
            </div>

            {/* Título Principal: linha 1 discreta e elegante, "brasa" animada com pulo */}
            <h1 className="hero-title-fraunces text-center m-0">
              <span className="linha1">TODO DIA É DIA DE</span>
              <RotatingWord />
            </h1>

            {/* Subtítulo com text-wrap: balance e max-width 34ch */}
            <p className="hero-subtitle-instrument text-center max-w-[34ch] mt-4 lg:mt-6 mb-6 lg:mb-8 m-0 px-4">
              Carnes e frutos do mar na brasa, num cantinho de Ubatuba onde a mesa é de todo mundo.
            </p>

            {/* Botão CTA Desktop */}
            <div className="mt-2 flex flex-col items-center">
              <a
                href="/#contato-reservas"
                onClick={(e) => {
                  e.preventDefault();
                  openReservationModal();
                }}
                data-hero-cta="true"
                className="hero-btn-instrument inline-flex items-center justify-center text-[#1A1411] bg-[#F3E6D0] hover:bg-[#D9741C] hover:-translate-y-2 active:-translate-y-2 px-8 py-2.5 rounded-[6px] transition-all duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9741C] shadow-lg text-[clamp(19px,1.52vw,22px)] min-h-[46px]"
              >
                RESERVAR MINHA MESA
              </a>

              {/* Botão Global de Pausa dos Vídeos (WCAG 2.2.2) - Desktop */}
              <button
                type="button"
                onClick={togglePauseVideos}
                aria-label={userPausedVideos ? 'Reproduzir vídeos de fundo da hero' : 'Pausar vídeos de fundo da hero'}
                aria-pressed={userPausedVideos}
                className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14100D]/70 hover:bg-[#14100D] border border-[#F5E6D0]/20 text-[#F5E6D0] hover:text-[#E8832A] transition-all duration-200 text-[11px] font-text font-semibold uppercase tracking-[0.14em] shadow-sm backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E8832A] select-none cursor-pointer"
              >
                {userPausedVideos ? (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current text-[#E8832A]" aria-hidden="true" />
                    <span>REPRODUZIR VÍDEOS</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current text-[#E8832A]" aria-hidden="true" />
                    <span>PAUSAR VÍDEOS</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MOBILE HERO (<=767px): 1 VÍDEO POR VEZ (100svh)                */}
      {/* ============================================================== */}
      {isMobile && (
        <div className="relative w-full h-[100svh] min-h-[580px] max-h-[850px] overflow-hidden flex flex-col justify-between items-center text-center">
          {/* Fundo: Poster estático inicial (WebP do 1º frame do vid01) */}
          <img
            src="/images/hero/poster1.webp"
            alt=""
            width={720}
            height={1280}
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none z-0"
          />

          {/* Player A e Player B empilhados com crossfade 500ms */}
          {!reducedMotion && !mobileAllFailed && (
            <div className="absolute inset-0 w-full h-full pointer-events-none z-[1]">
              {playerASrc && (
                <video
                  ref={videoARef}
                  src={playerASrc}
                  autoPlay
                  muted
                  playsInline
                  disablePictureInPicture
                  controlsList="nodownload"
                  aria-hidden="true"
                  tabIndex={-1}
                  preload="auto"
                  onTimeUpdate={handleMobileTimeUpdate}
                  onEnded={advanceMobileVideo}
                  onWaiting={handleMobileWaiting}
                  onPlaying={handleMobilePlaying}
                  onError={handleMobileError}
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-out ${
                    activePlayer === 'A' && mobilePlaying ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}

              {playerBSrc && (
                <video
                  ref={videoBRef}
                  src={playerBSrc}
                  muted
                  playsInline
                  disablePictureInPicture
                  controlsList="nodownload"
                  aria-hidden="true"
                  tabIndex={-1}
                  preload="auto"
                  onTimeUpdate={handleMobileTimeUpdate}
                  onEnded={advanceMobileVideo}
                  onWaiting={handleMobileWaiting}
                  onPlaying={handleMobilePlaying}
                  onError={handleMobileError}
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-out ${
                    activePlayer === 'B' ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}
            </div>
          )}

          {/* Sistema de 3 camadas de Overlay em CSS puro */}
          {/* Camada 1 (base): background escuro uniforme muito leve (rgba(0,0,0,.20)) */}
          <div className="absolute inset-0 pointer-events-none z-[2] bg-black/20" />

          {/* Camada 2 (leitura do texto): radial-gradient centrado no texto (ellipse 75% 60%) */}
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              background:
                'radial-gradient(ellipse 75% 60% at 50% 65%, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.35) 55%, transparent 100%)',
            }}
          />

          {/* Camada 3 (topo para o header): linear-gradient do topo para contraste da logo */}
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.25) 15%, transparent 25%)',
            }}
          />

          {/* Conteúdo Mobile: Título, Subtítulo e Botão na Base com Animação Única de Carga */}
          <div
            className={`relative z-10 w-full h-full flex flex-col justify-end items-center px-4 pb-7 sm:pb-8 ${
              isTransparent ? 'pt-20' : 'pt-16'
            }`}
          >
            {/* Eyebrow Mobile */}
            <div className="flex items-center justify-center gap-2.5 mb-2 animate-[fadeInUp_0.9s_ease-out_forwards]">
              <span className="w-6 sm:w-8 h-[1px] bg-[#F5E6D0]/85 inline-block" />
              <span className="font-ui font-semibold uppercase tracking-[0.25em] text-[11px] sm:text-[12px] text-[#F5E6D0]/85 select-none">
                PARRILLA · FRUTOS DO MAR
              </span>
              <span className="w-6 sm:w-8 h-[1px] bg-[#F5E6D0]/85 inline-block" />
            </div>

            {/* Título Mobile */}
            <div className="w-full flex justify-center mb-2 animate-[fadeInUp_0.9s_ease-out_forwards]">
              <h1 className="hero-title-fraunces text-center m-0">
                <span className="linha1">TODO DIA É DIA DE</span>
                <RotatingWord />
              </h1>
            </div>

            {/* Subtítulo Mobile */}
            <p className="hero-subtitle-instrument text-center max-w-[32ch] text-[15px] sm:text-[16px] leading-snug mb-5 animate-[fadeInUp_0.9s_ease-out_forwards]">
              Carnes e frutos do mar na brasa, num cantinho de Ubatuba onde a mesa é de todo mundo.
            </p>

            {/* Botão Mobile "RESERVAR" */}
            <div className="w-full flex justify-center animate-[fadeInUp_0.9s_ease-out_forwards]">
              <a
                href="/#contato-reservas"
                onClick={(e) => {
                  e.preventDefault();
                  openReservationModal();
                }}
                data-hero-cta="true"
                className="hero-btn-instrument inline-flex items-center justify-center text-[#1A1411] bg-[#D9741C] hover:bg-[#F3E6D0] text-[22px] px-9 py-2.5 rounded-[6px] shadow-lg transition-transform duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D9741C] min-w-[210px] min-h-[52px]"
              >
                RESERVAR
              </a>
            </div>

            {/* Botão Mobile de Pausa dos Vídeos (WCAG 2.2.2) */}
            <div className="w-full flex justify-center mt-3 animate-[fadeInUp_0.9s_ease-out_forwards]">
              <button
                type="button"
                onClick={togglePauseVideos}
                aria-label={userPausedVideos ? 'Reproduzir vídeos de fundo da hero' : 'Pausar vídeos de fundo da hero'}
                aria-pressed={userPausedVideos}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 min-h-[44px] min-w-[44px] rounded-full bg-[#14100D]/75 border border-[#F5E6D0]/20 text-[#F5E6D0] hover:text-[#E8832A] text-[11px] font-text font-semibold uppercase tracking-[0.12em] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E8832A] select-none cursor-pointer"
              >
                {userPausedVideos ? (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current text-[#E8832A]" aria-hidden="true" />
                    <span>REPRODUZIR VÍDEOS</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current text-[#E8832A]" aria-hidden="true" />
                    <span>PAUSAR VÍDEOS</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sentinela de saída do Hero para o IntersectionObserver do Header */}
      <div id="hero-sentinel" className="absolute bottom-0 left-0 right-0 h-2 pointer-events-none" />
    </section>
  );
};
