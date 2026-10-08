import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChamaIcon } from '@/components/icons/ChamaIcon';
import { siteConfig } from '@/config';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const titleLinesRef = useRef<HTMLDivElement[]>([]);
  const chamaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Título: revelação linha a linha com máscara (overflow: hidden)
      if (titleLinesRef.current.length > 0) {
        gsap.from(titleLinesRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
          y: '110%',
          opacity: 0,
          duration: 1.1,
          stagger: 0.15,
          ease: 'power3.out',
        });
      }

      // 2. Revelação suave do conteúdo textual
      if (contentRef.current) {
        gsap.from(contentRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
          opacity: 0,
          y: 30,
          duration: 1.0,
          delay: 0.25,
          ease: 'power2.out',
        });
      }

      // 3. Parallax sutil na mídia da esquerda
      if (mediaRef.current) {
        gsap.to(mediaRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4,
          },
          y: -36,
          ease: 'none',
        });
      }

      // 4. Animação da Chama (efeito mascote vivo):
      // - Corpo respira (scale 1 a 1.03)
      // - Faíscas sobem e piscam em loop com durações desencontradas
      if (chamaRef.current) {
        const bodyEl = chamaRef.current.querySelector('.icon-body');
        const sparks = chamaRef.current.querySelectorAll('.icon-spark');

        if (bodyEl) {
          gsap.to(bodyEl, {
            scale: 1.035,
            transformOrigin: '50% 100%',
            duration: 2.4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }

        sparks.forEach((spark, idx) => {
          gsap.to(spark, {
            y: -35 - idx * 12,
            opacity: 0,
            duration: 1.8 + idx * 0.6,
            repeat: -1,
            ease: 'power1.out',
            delay: idx * 0.5,
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addToTitleRefs = (el: HTMLDivElement | null) => {
    if (el && !titleLinesRef.current.includes(el)) {
      titleLinesRef.current.push(el);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="casa"
      aria-labelledby="quem-somos-heading"
      className="relative bg-[#F5E6D0] text-[#14100D] grao overflow-hidden pt-32 sm:pt-40 lg:pt-44 pb-24 sm:pb-32 lg:pb-36 border-t border-[#14100D]/15 scroll-mt-24"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* ============================================================== */}
          {/* COLUNA ESQUERDA: Mídia vertical com bordas orgânicas e parallax */}
          {/* ============================================================== */}
          <div className="lg:col-span-5 order-1">
            <div
              ref={mediaRef}
              className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-[0_24px_50px_rgba(20,16,13,0.18)] bg-[#14100D]/10"
            >
              <img
                src="/images/ambiente/casa-fachada.webp"
                alt="Fachada acolhedora de madeira rústica e braseiro do Braseiro Caiçara em Ubatuba"
                width={960}
                height={1200}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center filter saturate-[1.08] contrast-[1.03]"
              />

              {/* Vinheta fotográfica suave */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#14100D]/75 via-transparent to-transparent pointer-events-none" />

              {/* Rótulo artesanal recortado no canto inferior */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[#F5E6D0] pointer-events-none">
                <span className="font-display font-[800] uppercase text-xs sm:text-sm tracking-wider px-3.5 py-1.5 rounded-full bg-[#14100D]/85 backdrop-blur-md border border-[#F5E6D0]/20">
                  Ubatuba · Litoral Norte
                </span>
                <span className="font-text font-semibold uppercase tracking-[0.2em] text-[10px] sm:text-xs text-[#E8832A]">
                  Desde 2022
                </span>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* COLUNA DIREITA: Tipografia editorial em escala exagerada        */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 order-2 relative">
            {/* Ícone da Chama sobreposto (Efeito Mascote Vivo do Print 1) */}
            <div
              ref={chamaRef}
              className="absolute -top-12 sm:-top-16 right-0 sm:right-2 lg:-top-20 lg:right-0 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 text-[#E8832A] pointer-events-none select-none z-20 rotate-6 drop-shadow-[0_8px_20px_rgba(232,131,42,0.25)]"
              aria-hidden="true"
            >
              <ChamaIcon className="w-full h-full" />
            </div>

            {/* Eyebrow com fios laterais de 1px */}
            <div className="mb-6 sm:mb-8">
              <span className="eyebrow text-[#14100D]/70">QUEM SOMOS</span>
            </div>

            {/* Título gigante em 3 linhas com máscara de revelação */}
            <h2
              id="quem-somos-heading"
              className="titulo-secao text-[#14100D] mb-8 select-none"
            >
              <span className="block overflow-hidden">
                <span ref={addToTitleRefs} className="block quem-somos-line">
                  A MESA É
                </span>
              </span>
              <span className="block overflow-hidden">
                <span ref={addToTitleRefs} className="block quem-somos-line">
                  DE TODO
                </span>
              </span>
              <span className="block overflow-hidden">
                <span ref={addToTitleRefs} className="block quem-somos-line">
                  <em className="destaque-italico not-italic">mundo.</em>
                </span>
              </span>
            </h2>

            {/* Conteúdo textual e comanda de detalhes */}
            <div ref={contentRef} className="space-y-6">
              <p className="corpo-editorial text-[#14100D]/90 font-medium">
                Nascemos do encontro das águas de Ubatuba com a força ancestral
                do fogo de chão. Aqui, o mar dita o ritmo e a brasa traz o
                calor, reunindo pescadores, moradores e viajantes ao redor da
                mesma fumaça aromática.
              </p>

              <p className="corpo-editorial text-[#14100D]/80">
                Sem mistérios ou formalidades vazias: trabalhamos com cortes
                nobres bem selecionados, pescados frescos que acabaram de
                desembarcar do barco e a paciência de quem respeita o tempo exato
                da brasa.
              </p>

              {/* Régua de detalhes em estilo editorial artesanal */}
              <div className="pt-6 border-t border-[#14100D]/20 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#B8352B] block">
                    Parrilla & Cozinha
                  </span>
                  <p className="font-display font-[800] uppercase text-lg text-[#14100D]">
                    {siteConfig.hoursShort}
                  </p>
                  <p className="text-xs text-[#14100D]/70 font-medium">
                    {siteConfig.hoursDetail.kitchen}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#2F6FA8] block">
                    Localização
                  </span>
                  <p className="font-display font-[800] uppercase text-lg text-[#14100D]">
                    {siteConfig.addressFull}
                  </p>
                  <a
                    href={siteConfig.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#14100D] font-semibold hover:text-[#B8352B] underline transition-colors"
                  >
                    Ver no Google Maps <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Botão de ação artesanal */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href="#reservas"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#14100D] text-[#F5E6D0] font-text font-bold uppercase tracking-wider text-sm hover:bg-[#B8352B] hover:text-white transition-colors duration-200 shadow-md"
                >
                  Reservar Mesa
                  <ArrowUpRight className="w-4 h-4 text-[#E8832A]" />
                </a>

                <a
                  href="#cardapio"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-full border border-[#14100D]/30 text-[#14100D] font-text font-semibold uppercase tracking-wider text-sm hover:bg-[#14100D]/10 transition-colors duration-200"
                >
                  Conhecer o Cardápio
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
