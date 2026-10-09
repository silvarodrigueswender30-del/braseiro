import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChamaIcon } from '@/components/icons/ChamaIcon';

gsap.registerPlugin(ScrollTrigger);

export const ManifestoSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const chamaRef = useRef<HTMLDivElement>(null);
  const titleLinesRef = useRef<HTMLSpanElement[]>([]);
  const copyRef = useRef<HTMLParagraphElement>(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Linhas do título com máscara de revelação
      if (titleLinesRef.current.length > 0) {
        gsap.from(titleLinesRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
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

      // 2. Parágrafo com fade-up
      if (copyRef.current) {
        gsap.from(copyRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
          opacity: 0,
          y: 28,
          duration: 1.0,
          delay: 0.25,
          ease: 'power2.out',
        });
      }

      // 3. Animação da chama pequena: faíscas em loop e corpo respirando
      if (chamaRef.current) {
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

        const sparks = chamaRef.current.querySelectorAll('.icon-spark');
        const sparkDurations = [1.2, 1.7, 2.3];
        const sparkDelays = [0, 0.45, 0.9];
        sparks.forEach((spark, idx) => {
          gsap.to(spark, {
            y: -24 - idx * 6,
            opacity: 0,
            duration: sparkDurations[idx % sparkDurations.length],
            delay: sparkDelays[idx % sparkDelays.length],
            repeat: -1,
            ease: 'power1.out',
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addToLinesRef = (el: HTMLSpanElement | null) => {
    if (el && !titleLinesRef.current.includes(el)) {
      titleLinesRef.current.push(el);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="quem-somos"
      aria-label="Quem Somos - Sal, Fogo e Paciência"
      className="relative bg-[#14100D] text-[#F5E6D0] grao overflow-hidden py-[clamp(72px,8vw,120px)] border-t border-[#F5E6D0]/10 flex flex-col items-center justify-center text-center px-6 sm:px-10"
    >
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Chama pequena (altura 44px) acima do eyebrow */}
        <div
          ref={chamaRef}
          className="h-[44px] w-auto text-[#E8832A] mb-[14px] flex items-center justify-center select-none pointer-events-none"
          aria-hidden="true"
        >
          <ChamaIcon className="h-full w-auto" />
        </div>

        {/* Eyebrow com fios laterais */}
        <div className="mb-[16px]">
          <span className="eyebrow text-[#F5E6D0]/70">QUEM SOMOS</span>
        </div>

        {/* Título Monumental: SAL, FOGO E paciência */}
        <h2 className="select-none">
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
              className="block font-display font-[700] uppercase text-[#F5E6D0] whitespace-nowrap tracking-[0.06em] [word-spacing:0.12em] leading-[1.05] text-[clamp(1.25rem,6.4vw,2rem)] sm:text-[clamp(1.8rem,4.2vw,3.8rem)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              SAL, FOGO E
            </span>
          </span>
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
              className="block font-display font-[900] italic text-[#E8832A] leading-[0.8] -mt-[0.08em] text-[clamp(3.6rem,20vw,6.5rem)] sm:text-[clamp(5rem,12vw,11rem)]"
              style={{
                fontFamily: 'var(--font-display)',
                fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
              }}
            >
              paciência
            </span>
          </span>
        </h2>

        {/* Parágrafo de narrativa com respiro calibrado */}
        <p
          ref={copyRef}
          className="font-text font-normal text-[clamp(1.0625rem,1.3vw,1.25rem)] leading-[1.65] max-w-[56ch] text-[#F5E6D0]/85 mx-auto [text-wrap:balance] mt-[clamp(28px,3vw,44px)]"
          style={{ fontFamily: 'var(--font-text)' }}
        >
          Nascemos do encontro das águas do litoral paulista com a tradição
          ancestral do fogo de chão. Aqui, o mar dita o ritmo e a brasa dá o
          calor, reunindo pescadores, moradores e viajantes ao redor da mesma
          fumaça aromática.
        </p>
      </div>
    </section>
  );
};

export default ManifestoSection;
