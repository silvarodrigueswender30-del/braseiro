import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const WORDS = ['brasa', 'fogo', 'mar', 'mesa', 'sabor', 'festa'] as const;

export const DURATIONS = {
  out: 0.38,
  in: 0.75,
  inOpacity: 0.2,
  squash: 0.1,
  settle: 0.35,
} as const;

export const HOLD = {
  anchor: 3.0, // "brasa" fica 3s
  default: 2.2, // as demais ficam 2.2s
} as const;

export const RotatingWord: React.FC = () => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const wordIndexRef = useRef<number>(0);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let isMounted = true;

    const ctx = gsap.context(() => {
      const startCycle = () => {
        if (!isMounted || !wordRef.current) return;

        const animateNext = () => {
          if (!isMounted || !wordRef.current) return;

          const nextIndex = (wordIndexRef.current + 1) % WORDS.length;
          const nextWord = WORDS[nextIndex];
          const nextHold = nextWord === 'brasa' ? HOLD.anchor : HOLD.default;

          const tl = gsap.timeline({
            onComplete: () => {
              wordIndexRef.current = nextIndex;
              if (isMounted) {
                // Agenda o próximo salto de acordo com o tempo de parada da palavra
                delayedCallRef.current = gsap.delayedCall(nextHold, () => {
                  if (isVisibleRef.current) {
                    animateNext();
                  }
                });
              }
            },
          });

          activeTimelineRef.current = tl;

          // 1) SAÍDA (0.38s, ease "power2.in"): sobe e encolhe pra fora
          // yPercent -70, rotation -5, scaleX .94, scaleY 1.12, opacity 0
          tl.to(wordRef.current, {
            yPercent: -70,
            rotation: -5,
            scaleX: 0.94,
            scaleY: 1.12,
            opacity: 0,
            duration: DURATIONS.out,
            ease: 'power2.in',
            transformOrigin: '50% 100%',
          });

          // 2) TROCA NO PONTO INVISÍVEL
          tl.call(() => {
            if (wordRef.current) {
              wordRef.current.textContent = nextWord;
            }
          });

          // Posicionar a nova palavra abaixo
          tl.set(wordRef.current, {
            yPercent: 90,
            rotation: 5,
            scaleX: 1,
            scaleY: 0.9,
            opacity: 0,
            transformOrigin: '50% 100%',
          });

          // 3) ENTRADA (0.75s, ease "back.out(2.4)", overshoot de pulo)
          tl.to(wordRef.current, {
            yPercent: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            duration: DURATIONS.in,
            ease: 'back.out(2.4)',
          });

          // Opacity chega a 1 nos primeiros 0.2s
          tl.to(
            wordRef.current,
            {
              opacity: 1,
              duration: DURATIONS.inOpacity,
              ease: 'power1.out',
            },
            '<'
          );

          // 4) POUSO (squash and stretch)
          tl.to(wordRef.current, {
            scaleY: 0.94,
            scaleX: 1.04,
            duration: DURATIONS.squash,
            ease: 'power1.out',
            transformOrigin: '50% 100%',
          });

          tl.to(wordRef.current, {
            scaleY: 1,
            scaleX: 1,
            duration: DURATIONS.settle,
            ease: 'elastic.out(1, 0.4)',
            transformOrigin: '50% 100%',
          });
        };

        // Primeira troca só 3s após document.fonts.ready
        delayedCallRef.current = gsap.delayedCall(HOLD.anchor, animateNext);
      };

      // Só iniciar o ciclo depois de document.fonts.ready
      if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          if (isMounted) startCycle();
        });
      } else {
        startCycle();
      }
    }, containerRef);

    // Pausar o ciclo quando a Hero sair da tela via IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            if (activeTimelineRef.current && activeTimelineRef.current.paused()) {
              activeTimelineRef.current.resume();
            }
            if (delayedCallRef.current && delayedCallRef.current.paused()) {
              delayedCallRef.current.resume();
            }
          } else {
            if (activeTimelineRef.current && activeTimelineRef.current.isActive()) {
              activeTimelineRef.current.pause();
            }
            if (delayedCallRef.current && delayedCallRef.current.isActive()) {
              delayedCallRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      isMounted = false;
      observer.disconnect();
      if (delayedCallRef.current) delayedCallRef.current.kill();
      if (activeTimelineRef.current) activeTimelineRef.current.kill();
      ctx.revert();
    };
  }, []);

  return (
    <span
      ref={containerRef}
      className="brasa rotating-word"
      style={{
        display: 'block',
        textAlign: 'center',
        minHeight: '1em',
      }}
    >
      {/* Texto acessível estático para leitores de tela e SEO */}
      <span className="sr-only">brasa</span>

      {/* Palavra animada com pulo */}
      <span
        ref={wordRef}
        className="rotating-word__word"
        aria-hidden="true"
        style={{
          display: 'inline-block',
          willChange: 'transform, opacity',
        }}
      >
        {WORDS[0]}
      </span>
    </span>
  );
};

export default RotatingWord;
