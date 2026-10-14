import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '@/config';
import { ChamaIcon } from '@/components/icons/ChamaIcon';

gsap.registerPlugin(ScrollTrigger);

/**
 * TEXTOS E ELEMENTOS ANTERIORES REMOVIDOS DO RODAPÉ (PRESERVADOS PARA REFERÊNCIA):
 * - Nota sobre Newsletter: bloco de newsletter removido por falta de backend e de aviso de privacidade (LGPD).
 * - Card central com moldura dupla (<Card variant="double">)
 * - Título "BRASEIRO CAIÇARA" em sans condensada + subtítulo "Parrilla · Frutos do Mar · Ubatuba"
 * - Divisor com losango e chama (<Divider variant="flame" />)
 * - Ícones em círculo: Horário (Clock), Localização (MapPin), Atendimento (Phone) e Redes Sociais (Instagram, Maps, WhatsApp)
 * - Bloco "Cardápio do Dia & Novidades no WhatsApp":
 *   "Deixe seu número ou clique abaixo para receber peixes do dia, cortes especiais e promoções sazonais direto no seu celular."
 *   Campo de telefone ("Seu DDD + WhatsApp (ex: 12 99999-9999)") e botão "RECEBER"
 * - Botão pílula "VOLTAR AO TOPO" com ícone circular ArrowUp
 * - Lema em itálico no canto inferior direito: "“Acende o fogo, senta à mesa.”"
 *
 * TODO: confirmar endereço, horário, WhatsApp e Instagram com o restaurante
 * TODO: confirmar o @ do Instagram com o restaurante
 */

// Navegação real verificada contra os IDs existentes nas seções do projeto:
// - Início (#inicio)
// - A casa (#casa)
// - O fogo (#fogo)
// - Pratos (#pratos)
// - Cardápio (#cardapio - âncora própria da seção Duas Brasas / Cardápio)
// - Eventos (#eventos)
// - Ambiente (#ambiente)
// - Reservas (#contato-reservas)
// ("Contato" descartado por apontar para o próprio rodapé)
const FOOTER_NAV_LINKS = [
  { label: 'Início', href: '/#inicio' },
  { label: 'A casa', href: '/#casa' },
  { label: 'O fogo', href: '/#fogo' },
  { label: 'Pratos', href: '/#pratos' },
  { label: 'Cardápio', href: '/#cardapio' },
  { label: 'Eventos', href: '/#eventos' },
  { label: 'Ambiente', href: '/#ambiente' },
  { label: 'Reservas', href: '/#contato-reservas' },
] as const;

const COURIER_FONT_STACK = '"Courier Prime", "Courier New", ui-monospace, monospace';

// Máscara SVG para borda inferior picotada (dentes de 12px na base e topo/laterais retos)
const ZIGZAG_TOOTH_MASK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='10' viewBox='0 0 12 10'%3E%3Cpolygon points='0,0 12,0 6,9' fill='black'/%3E%3C/svg%3E")`;

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);

  // Refs de animação da coluna esquerda (Título + Chama + Botão)
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleLine1WrapperRef = useRef<HTMLSpanElement>(null);
  const titleLine1InnerRef = useRef<HTMLSpanElement>(null);
  const titleLine2WrapperRef = useRef<HTMLSpanElement>(null);
  const titleLine2InnerRef = useRef<HTMLSpanElement>(null);
  const chamaRef = useRef<HTMLSpanElement>(null);
  const reserveBtnWrapperRef = useRef<HTMLDivElement>(null);

  // Refs de animação da coluna direita (Comanda + Itens + Carimbo)
  const comandaAnimWrapperRef = useRef<HTMLDivElement>(null);
  const comandaItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stampRef = useRef<HTMLDivElement>(null);

  // Refs da barra inferior
  const bottomBarLogoRef = useRef<HTMLDivElement>(null);
  const bottomBarNavRef = useRef<HTMLElement>(null);
  const bottomBarCopyRef = useRef<HTMLDivElement>(null);

  const [isComandaHovered, setIsComandaHovered] = useState(false);

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

  // Verificação de número de WhatsApp real vs placeholder
  const isDummyPhone =
    !siteConfig.phoneRaw ||
    siteConfig.phoneRaw.includes('999999999') ||
    siteConfig.phoneRaw.trim() === '';

  // Formatação de telefone caso um número real seja configurado no futuro
  const formatPhoneFromRaw = (raw: string): string => {
    const clean = raw.replace(/\D/g, '');
    // Ex: 5512988887777 -> (12) 98888-7777
    if (clean.length === 13 && clean.startsWith('55')) {
      const ddd = clean.slice(2, 4);
      const part1 = clean.slice(4, 9);
      const part2 = clean.slice(9, 13);
      return `(${ddd}) ${part1}-${part2}`;
    }
    if (clean.length === 12 && clean.startsWith('55')) {
      const ddd = clean.slice(2, 4);
      const part1 = clean.slice(4, 8);
      const part2 = clean.slice(8, 12);
      return `(${ddd}) ${part1}-${part2}`;
    }
    return siteConfig.phoneDisplay || raw;
  };

  // Verificação do Instagram em config.ts
  const instagramHandle = siteConfig.instagramHandle?.trim() || '';
  const hasInstagram = instagramHandle.length > 0;
  // Limpa qualquer "[CONFIRMAR]" caso exista na URL
  const instagramUrl = (siteConfig.instagramUrl || '').replace(/\[CONFIRMAR\]/gi, '').trim();

  // Endereço formatado com ponto médio conforme especificação: "Rua Guarani, 370 · Itaguá, Ubatuba - SP"
  const formattedAddress = 'Rua Guarani, 370 · Itaguá, Ubatuba - SP';

  // Rolagem suave para o topo respeitando prefers-reduced-motion
  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  // Animações GSAP + ScrollTrigger
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    if (prefersReducedMotion || !footerRef.current) return;

    const ctx = gsap.context(() => {
      // -------------------------------------------------------------
      // 1) TIMELINE PRINCIPAL DE ENTRADA (start: "top 80%", once: true)
      // -------------------------------------------------------------
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
          once: true,
        },
        onComplete: () => {
          if (titleLine1WrapperRef.current) titleLine1WrapperRef.current.style.overflow = 'visible';
          if (titleLine2WrapperRef.current) titleLine2WrapperRef.current.style.overflow = 'visible';

          gsap.set(
            [
              eyebrowRef.current,
              titleLine1InnerRef.current,
              titleLine2InnerRef.current,
              reserveBtnWrapperRef.current,
              comandaAnimWrapperRef.current,
              ...comandaItemRefs.current.filter(Boolean),
              bottomBarLogoRef.current,
              bottomBarNavRef.current,
              bottomBarCopyRef.current,
            ],
            { clearProps: 'opacity,transform,clipPath' }
          );
        },
      });

      // Eyebrow fade-up
      if (eyebrowRef.current) {
        mainTl.fromTo(
          eyebrowRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out', immediateRender: false },
          0
        );
      }

      // Linha 1: "ACENDA O FOGO,"
      if (titleLine1InnerRef.current) {
        mainTl.fromTo(
          titleLine1InnerRef.current,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.75, ease: 'power3.out', immediateRender: false },
          0.08
        );
      }

      // Linha 2: "sente à mesa" (stagger 0.12s, scale 0.94 -> 1)
      if (titleLine2InnerRef.current) {
        mainTl.fromTo(
          titleLine2InnerRef.current,
          { yPercent: 100, scale: 0.94, opacity: 0 },
          { yPercent: 0, scale: 1, opacity: 1, duration: 0.85, ease: 'power3.out', immediateRender: false },
          0.2
        );
      }

      // Ícone da chama com pop (scale 0.5 -> 1, rotate 20deg -> 6deg, back.out)
      if (chamaRef.current) {
        mainTl.fromTo(
          chamaRef.current,
          { scale: 0.5, rotate: 20, opacity: 0 },
          { scale: 1, rotate: 6, opacity: 1, duration: 0.6, ease: 'back.out(1.7)', immediateRender: false },
          0.55
        );
      }

      // Botão "RESERVAR MESA" fade-up
      if (reserveBtnWrapperRef.current) {
        mainTl.fromTo(
          reserveBtnWrapperRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, ease: 'power2.out', immediateRender: false },
          0.45
        );
      }

      // Comanda "sendo impressa": clip-path inset(0 0 100% 0) -> inset(0 0 0% 0) em 0.9s power2.out + y -24 -> 0
      if (comandaAnimWrapperRef.current) {
        mainTl.fromTo(
          comandaAnimWrapperRef.current,
          {
            clipPath: 'inset(0% 0% 100% 0%)',
            y: -24,
            opacity: 0,
          },
          {
            clipPath: 'inset(-25% -25% -25% -25%)',
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
            immediateRender: false,
          },
          0.18
        );
      }

      // Os 5 itens da comanda entram depois em sequência (opacity 0 -> 1, y 8 -> 0, stagger 0.1s)
      const validItems = comandaItemRefs.current.filter(Boolean) as HTMLDivElement[];
      if (validItems.length > 0) {
        mainTl.fromTo(
          validItems,
          { y: 8, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            stagger: 0.1,
            ease: 'power2.out',
            immediateRender: false,
          },
          0.55
        );
      }

      // Carimbo chega depois do último item: scale 1.7 -> 1, rotate -30deg -> -14deg, opacity 0 -> 1, ease power4.in + quique final (scale 1.04 -> 1, 0.25s)
      if (stampRef.current) {
        const stampStartTime = 0.55 + validItems.length * 0.1;
        mainTl.fromTo(
          stampRef.current,
          { scale: 1.7, rotate: -30, opacity: 0 },
          {
            scale: 1,
            rotate: -14,
            opacity: 0.9,
            duration: 0.35,
            ease: 'power4.in',
            immediateRender: false,
          },
          stampStartTime
        );
        mainTl.fromTo(
          stampRef.current,
          { scale: 1.04 },
          {
            scale: 1,
            duration: 0.25,
            ease: 'back.out(2)',
            immediateRender: false,
          },
          stampStartTime + 0.35
        );
      }

      // Barra inferior: fade-up com stagger 0.08s
      const bottomBarEls = [
        bottomBarLogoRef.current,
        bottomBarNavRef.current,
        bottomBarCopyRef.current,
      ].filter(Boolean);

      if (bottomBarEls.length > 0) {
        mainTl.fromTo(
          bottomBarEls,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            immediateRender: false,
          },
          0.65
        );
      }

      // -------------------------------------------------------------
      // 2) LOOPS CONTÍNUOS DA CHAMA (pausando fora da viewport via onToggle)
      // -------------------------------------------------------------
      const chamaSvg = chamaRef.current?.querySelector('svg');
      const bodyEl = chamaSvg?.querySelector('.icon-body');
      const spark1El = chamaSvg?.querySelector('.icon-spark--1');
      const spark2El = chamaSvg?.querySelector('.icon-spark--2');

      const flameLoopTweens: gsap.core.Tween[] = [];

      if (bodyEl) {
        flameLoopTweens.push(
          gsap.fromTo(
            bodyEl,
            { rotate: -1.5 },
            {
              rotate: 2.5,
              transformOrigin: '50% 90%',
              duration: 2.3,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
              delay: 0.2,
            }
          )
        );
      }

      if (spark1El) {
        flameLoopTweens.push(
          gsap.fromTo(
            spark1El,
            { y: 0, opacity: 0.95, scale: 1 },
            {
              y: -24,
              opacity: 0,
              scale: 0.55,
              duration: 1.2,
              repeat: -1,
              ease: 'power1.out',
              delay: 0.1,
            }
          )
        );
      }

      if (spark2El) {
        flameLoopTweens.push(
          gsap.fromTo(
            spark2El,
            { y: 0, opacity: 0.95, scale: 1 },
            {
              y: -28,
              opacity: 0,
              scale: 0.5,
              duration: 1.7,
              repeat: -1,
              ease: 'power1.out',
              delay: 0.45,
            }
          )
        );
      }

      ScrollTrigger.create({
        trigger: footerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          flameLoopTweens.forEach((tween) => {
            if (self.isActive) {
              tween.play();
            } else {
              tween.pause();
            }
          });
        },
      });
    }, footerRef);

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
    <footer
      ref={footerRef}
      id="rodape"
      aria-labelledby="footer-heading"
      className="relative w-full overflow-x-clip bg-[#F5E6D0] text-[#14100D]"
      style={{
        backgroundColor: '#F5E6D0',
        color: '#14100D',
        paddingTop: 'clamp(72px, 8vw, 120px)',
        paddingBottom: 'calc(clamp(72px, 8vw, 120px) + var(--dock-h, 0px))',
        paddingLeft: 'clamp(24px, 5vw, 80px)',
        paddingRight: 'clamp(24px, 5vw, 80px)',
      }}
    >
      {/* ============================================================== */}
      {/* TEXTURA DE GRÃO (.grao) A 3% SOBRE O FUNDO CREME               */}
      {/* ============================================================== */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ============================================================== */}
      {/* CONTAINER CENTRAL DO RODAPÉ                                    */}
      {/* ============================================================== */}
      <div className="relative z-10 max-w-[1280px] mx-auto w-full flex flex-col">
        {/* ============================================================ */}
        {/* LINHA SUPERIOR: TEXTO (ESQUERDA ~54%) + COMANDA (DIREITA ~46%)*/}
        {/* ============================================================ */}
        <div
          className="w-full grid grid-cols-1 lg:grid-cols-[54fr_46fr] items-center"
          style={{
            gap: 'clamp(32px, 4vw, 72px)',
            paddingBottom: 'clamp(56px, 6vw, 96px)',
          }}
        >
          {/* ---------------------------------------------------------- */}
          {/* COLUNA ESQUERDA: EYEBROW + H2 (2 LINHAS + CHAMA) + BOTÃO    */}
          {/* ---------------------------------------------------------- */}
          <div className="w-full flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* Eyebrow "ATÉ A PRÓXIMA" com fios laterais de 1px */}
            <div
              ref={eyebrowRef}
              className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-2 sm:mb-3"
            >
              <span className="w-6 sm:w-8 h-[1px] bg-[#14100D]/35 inline-block shrink-0" />
              <span
                className="font-text font-semibold uppercase tracking-[0.25em] text-[12px] sm:text-[13px] text-[#14100D] select-none"
                style={{ fontFamily: 'var(--font-text)' }}
              >
                ATÉ A PRÓXIMA
              </span>
              <span className="w-6 sm:w-8 h-[1px] bg-[#14100D]/35 inline-block shrink-0" />
            </div>

            {/* H2 com 2 Linhas: "ACENDA O FOGO," + "sente à mesa" + Chama */}
            <h2
              id="footer-heading"
              className="mt-2 sm:mt-3 flex flex-col items-center text-center lg:items-start lg:text-left m-0 select-none"
              aria-label="Acenda o fogo, sente à mesa"
            >
              {/* Linha 1: "ACENDA O FOGO," */}
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
                  className="block uppercase text-[#14100D] whitespace-nowrap text-[clamp(1.15rem,5.4vw,1.9rem)] lg:text-[clamp(1.6rem,3.4vw,3.1rem)]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    wordSpacing: '0.12em',
                    lineHeight: 1.1,
                  }}
                >
                  ACENDA O FOGO,
                </span>
              </span>

              {/* Linha 2: "sente à mesa" + ChamaIcon (inline-flex; máscara só na palavra) */}
              <span className="inline-flex items-baseline justify-center lg:justify-start whitespace-nowrap">
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
                    data-reveal="true"
                    className="block lowercase italic text-[var(--brasa-creme-grande)] whitespace-nowrap tracking-[-0.02em] text-[clamp(2.55rem,11.8vw,4.5rem)] lg:text-[clamp(3.4rem,6.9vw,6.3rem)]"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 900,
                      fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
                      lineHeight: 0.85,
                      marginTop: '-0.06em',
                    }}
                  >
                    sente à mesa
                  </span>
                </span>

                {/* Ícone da chama inline após "mesa", height 0.62em, colado à letra "a", rotate(6deg) */}
                <span
                  ref={chamaRef}
                  aria-hidden="true"
                  className="inline-block text-[var(--brasa-creme-grande)] select-none pointer-events-none shrink-0 text-[clamp(2.55rem,11.8vw,4.5rem)] lg:text-[clamp(3.4rem,6.9vw,6.3rem)]"
                  style={{
                    height: '0.62em',
                    width: '0.62em',
                    marginLeft: '-0.08em',
                    marginBottom: '-0.04em',
                    verticalAlign: '-0.04em',
                    transform: 'rotate(6deg)',
                    transformOrigin: '50% 100%',
                  }}
                >
                  <ChamaIcon className="w-full h-full block" />
                </span>
              </span>
            </h2>

            {/* Botão "RESERVAR MESA" */}
            <div
              ref={reserveBtnWrapperRef}
              className="w-full flex justify-center lg:justify-start"
              style={{
                marginTop: 'clamp(28px, 3vw, 44px)',
              }}
            >
              <a
                href="/#contato-reservas"
                className="inline-flex items-center justify-center bg-[#14100D] text-[#F5E6D0] hover:bg-[#E8832A] hover:text-[#14100D] transition-colors duration-200 font-text font-semibold uppercase text-[14px] tracking-[0.08em] rounded-[6px] py-[16px] px-[28px] w-full max-w-[420px] lg:w-auto lg:min-w-[240px] select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#E8832A]"
                style={{ fontFamily: 'var(--font-text)' }}
              >
                RESERVAR MESA
              </a>
            </div>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* COLUNA DIREITA: COMANDA DE DESPEDIDA (<address>)            */}
          {/* ---------------------------------------------------------- */}
          <div className="w-full flex justify-center lg:justify-end">
            <div
              ref={comandaAnimWrapperRef}
              className="relative w-full max-w-[360px] lg:max-w-none lg:w-[clamp(300px,28vw,400px)]"
            >
              {/* Wrapper PAI do papel com drop-shadow para que a sombra siga os dentes picotados da máscara */}
              <div
                onMouseEnter={() => setIsComandaHovered(true)}
                onMouseLeave={() => setIsComandaHovered(false)}
                className="relative w-full footer-comanda-hover"
                style={{
                  filter:
                    'drop-shadow(0 10px 18px rgba(20,16,13,0.28)) drop-shadow(0 2px 4px rgba(20,16,13,0.22))',
                  transform: isComandaHovered
                    ? 'rotate(0deg) translateY(-6px)'
                    : undefined,
                  transition: 'transform 300ms cubic-bezier(0.2, 0.7, 0.2, 1)',
                }}
              >
                {/* Papel Kraft #C9A878 com máscara picotada na base e grão a 8% */}
                <address
                  aria-label="Contato e horário"
                  className="relative not-italic w-full bg-[#C9A878] text-[#14100D] text-left"
                  style={{
                    backgroundColor: '#C9A878',
                    color: '#14100D',
                    paddingTop: 'clamp(28px, 2.6vw, 44px)',
                    paddingLeft: 'clamp(28px, 2.6vw, 44px)',
                    paddingRight: 'clamp(28px, 2.6vw, 44px)',
                    paddingBottom: 'calc(clamp(28px, 2.6vw, 44px) + 10px)',
                    WebkitMaskImage: `linear-gradient(#000, #000), ${ZIGZAG_TOOTH_MASK}`,
                    WebkitMaskSize: '100% calc(100% - 9px), 12px 10px',
                    WebkitMaskPosition: 'top left, bottom left',
                    WebkitMaskRepeat: 'no-repeat, repeat-x',
                    maskImage: `linear-gradient(#000, #000), ${ZIGZAG_TOOTH_MASK}`,
                    maskSize: '100% calc(100% - 9px), 12px 10px',
                    maskPosition: 'top left, bottom left',
                    maskRepeat: 'no-repeat, repeat-x',
                  }}
                >
                  {/* Textura de grão (.grao) a 8% dentro da comanda */}
                  <div
                    className="absolute inset-0 pointer-events-none z-0 opacity-[0.08]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilterComanda'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilterComanda)'/%3E%3C/svg%3E")`,
                    }}
                  />

                  {/* Conteúdo da Comanda em Courier Prime */}
                  <div
                    className="relative z-10 flex flex-col"
                    style={{ fontFamily: COURIER_FONT_STACK }}
                  >
                    {/* ITEM 1: ENDEREÇO */}
                    <div
                      ref={(el) => {
                        comandaItemRefs.current[0] = el;
                      }}
                      className="pb-[14px] mb-[14px] border-b border-dashed border-[#14100D]/45"
                    >
                      <div
                        className="font-bold uppercase tracking-[0.08em] text-[#14100D]"
                        style={{ fontSize: 'clamp(0.9rem, 1vw, 1.0625rem)' }}
                      >
                        ENDEREÇO
                      </div>
                      <div
                        className="mt-0.5 font-normal text-[#14100D] leading-[1.45]"
                        style={{ fontSize: 'clamp(0.9rem, 1vw, 1.0625rem)' }}
                      >
                        <a
                          href={siteConfig.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8832A] rounded-[2px]"
                        >
                          {formattedAddress}
                        </a>
                      </div>
                    </div>

                    {/* ITEM 2: HORÁRIO */}
                    <div
                      ref={(el) => {
                        comandaItemRefs.current[1] = el;
                      }}
                      className="pb-[14px] mb-[14px] border-b border-dashed border-[#14100D]/45"
                    >
                      <div
                        className="font-bold uppercase tracking-[0.08em] text-[#14100D]"
                        style={{ fontSize: 'clamp(0.9rem, 1vw, 1.0625rem)' }}
                      >
                        HORÁRIO
                      </div>
                      <div
                        className="mt-0.5 font-normal text-[#14100D] leading-[1.45]"
                        style={{ fontSize: 'clamp(0.9rem, 1vw, 1.0625rem)' }}
                      >
                        Todos os dias · 11h30–23h30
                      </div>
                    </div>

                    {/* ITEM 3: WHATSAPP */}
                    <div
                      ref={(el) => {
                        comandaItemRefs.current[2] = el;
                      }}
                      className="pb-[14px] mb-[14px] border-b border-dashed border-[#14100D]/45"
                    >
                      <div
                        className="font-bold uppercase tracking-[0.08em] text-[#14100D]"
                        style={{ fontSize: 'clamp(0.9rem, 1vw, 1.0625rem)' }}
                      >
                        WHATSAPP
                      </div>
                      <div
                        className="mt-0.5 font-normal text-[#14100D] leading-[1.45]"
                        style={{ fontSize: 'clamp(0.9rem, 1vw, 1.0625rem)' }}
                      >
                        {isDummyPhone ? (
                          <span>EM BREVE</span>
                        ) : (
                          <a
                            href={`https://wa.me/${siteConfig.phoneRaw}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8832A] rounded-[2px]"
                          >
                            {formatPhoneFromRaw(siteConfig.phoneRaw)}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* ITEM 4: INSTAGRAM */}
                    {/* TODO: confirmar o @ do Instagram com o restaurante */}
                    {hasInstagram && (
                      <div
                        ref={(el) => {
                          comandaItemRefs.current[3] = el;
                        }}
                        className="pb-[14px] mb-[14px] border-b border-dashed border-[#14100D]/45"
                      >
                        <div
                          className="font-bold uppercase tracking-[0.08em] text-[#14100D]"
                          style={{ fontSize: 'clamp(0.9rem, 1vw, 1.0625rem)' }}
                        >
                          INSTAGRAM
                        </div>
                        <div
                          className="mt-0.5 font-normal text-[#14100D] leading-[1.45] break-all"
                          style={{ fontSize: 'clamp(0.9rem, 1vw, 1.0625rem)' }}
                        >
                          <a
                            href={instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8832A] rounded-[2px]"
                          >
                            {instagramHandle}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* ITEM 5: OBRIGADO PELA VISITA! (Sem linha tracejada) */}
                    <div
                      ref={(el) => {
                        comandaItemRefs.current[4] = el;
                      }}
                      className="pt-1 text-center"
                    >
                      <div
                        className="font-bold uppercase tracking-[0.08em] text-[#14100D]"
                        style={{ fontSize: 'clamp(0.9rem, 1vw, 1.0625rem)' }}
                      >
                        OBRIGADO PELA VISITA!
                      </div>
                    </div>
                  </div>
                </address>

                {/* CARIMBO SOBREPONDO A BORDA SUPERIOR DIREITA DA COMANDA */}
                <div
                  ref={stampRef}
                  aria-hidden="true"
                  className="pointer-events-none select-none absolute -top-5 -right-4 sm:-right-7 lg:-right-8 w-[92px] h-[92px] lg:w-[clamp(104px,9vw,132px)] lg:h-[clamp(104px,9vw,132px)] z-20"
                  style={{
                    transform: 'rotate(-14deg)',
                    opacity: 0.9,
                    mixBlendMode: 'multiply',
                  }}
                >
                  <svg
                    viewBox="0 0 140 140"
                    className="w-full h-full overflow-visible"
                  >
                    {/* Anel Externo Duplo em var(--brasa-creme-texto) */}
                    <circle
                      cx="70"
                      cy="70"
                      r="65"
                      fill="none"
                      stroke="var(--brasa-creme-texto)"
                      strokeWidth="3"
                    />
                    <circle
                      cx="70"
                      cy="70"
                      r="59"
                      fill="none"
                      stroke="var(--brasa-creme-texto)"
                      strokeWidth="1.2"
                      strokeDasharray="4 2"
                    />
                    {/* Anel Interno */}
                    <circle
                      cx="70"
                      cy="70"
                      r="40"
                      fill="none"
                      stroke="var(--brasa-creme-texto)"
                      strokeWidth="2"
                    />

                    {/* Caminho Curvo para o texto circular */}
                    <defs>
                      <path
                        id="footerComandaStampPath"
                        d="M 70, 70 m -49, 0 a 49,49 0 1,1 98,0 a 49,49 0 1,1 -98,0"
                      />
                    </defs>

                    <text
                      fill="var(--brasa-creme-texto)"
                      fontSize="10.2"
                      fontWeight="700"
                      letterSpacing="0.14em"
                      style={{
                        fontFamily: COURIER_FONT_STACK,
                        textTransform: 'uppercase',
                      }}
                    >
                      <textPath
                        href="#footerComandaStampPath"
                        startOffset="50%"
                        textAnchor="middle"
                      >
                        BRASEIRO CAIÇARA · UBATUBA ·
                      </textPath>
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* BARRA INFERIOR: FIO 1PX + LOGO CARVÃO + NAV + COPYRIGHT      */}
        {/* ============================================================ */}
        <div
          className="w-full border-t border-[#14100D]/15 pb-[120px] lg:pb-[clamp(36px,4vw,56px)]"
          style={{
            paddingTop: 'clamp(28px, 3vw, 44px)',
          }}
        >
          {/* DESKTOP (≥1024px): Grid de 3 Colunas (auto 1fr auto) */}
          <div className="hidden lg:grid lg:grid-cols-[auto_1fr_auto] items-center gap-8 w-full">
            {/* Esquerda: Logo Carvão (64px de altura) */}
            <div ref={bottomBarLogoRef} className="flex items-center justify-start">
              <a
                href="/#inicio"
                onClick={handleScrollToTop}
                aria-label="Braseiro Caiçara, voltar ao topo"
                className="inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8832A] rounded-[4px]"
              >
                <picture>
                  <source
                    media="(min-width: 1024px)"
                    srcSet="/images/logo/logo-carvao.webp"
                    type="image/webp"
                  />
                  <source
                    srcSet="/images/logo/logo-carvao-mobile.webp"
                    type="image/webp"
                  />
                  <img
                    src="/images/logo/logo-carvao.png"
                    alt="Braseiro Caiçara"
                    width={163}
                    height={64}
                    loading="lazy"
                    decoding="async"
                    className="h-[64px] w-auto object-contain block"
                  />
                </picture>
              </a>
            </div>

            {/* Centro: Navegação Centralizada */}
            <nav
              ref={bottomBarNavRef}
              aria-label="Rodapé"
              className="flex items-center justify-center flex-wrap"
              style={{
                gap: 'clamp(16px, 2vw, 28px)',
              }}
            >
              {FOOTER_NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-text font-medium text-[15px] text-[#14100D] py-1 border-b-2 border-transparent hover:border-[#E8832A] focus-visible:border-[#E8832A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8832A] transition-colors duration-200 whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-text)' }}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Direita: Copyright + Voltar ao topo */}
            <div
              ref={bottomBarCopyRef}
              className="flex flex-col items-end text-right"
            >
              <p
                className="font-text font-normal text-[13px] text-[#14100D]/75 leading-[1.45] m-0"
                style={{ fontFamily: 'var(--font-text)' }}
              >
                © 2026 Braseiro Caiçara. Todos os direitos reservados.
                <br />
                Parrilla &amp; Frutos do Mar · Ubatuba/SP
              </p>
              <a
                href="/#inicio"
                onClick={handleScrollToTop}
                className="mt-2 inline-block font-text font-semibold uppercase text-[12px] tracking-[0.12em] text-[#14100D] border-b-2 border-[var(--brasa-creme-texto)] pb-0.5 hover:text-[var(--brasa-creme-texto)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8832A] transition-colors duration-200 select-none"
                style={{ fontFamily: 'var(--font-text)' }}
              >
                VOLTAR AO TOPO ↑
              </a>
            </div>
          </div>

          {/* MOBILE (<1024px): Navegação 2 Colunas -> Logo Carvão (52px) -> Copyright -> Voltar ao topo */}
          <div className="flex lg:hidden flex-col items-center text-center w-full gap-8">
            {/* Navegação em 2 Colunas (área de toque ≥ 44px de altura) */}
            <nav
              aria-label="Rodapé Mobile"
              className="w-full max-w-[360px] grid grid-cols-2"
              style={{
                gap: '12px 24px',
              }}
            >
              {FOOTER_NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="min-h-[44px] flex items-center justify-center font-text font-medium text-[15px] text-[#14100D] border-b-2 border-transparent hover:border-[var(--brasa-creme-texto)] focus-visible:border-[var(--brasa-creme-texto)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8832A] transition-colors duration-200"
                  style={{ fontFamily: 'var(--font-text)' }}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Logo Carvão (52px de altura no mobile) */}
            <a
              href="/#inicio"
              onClick={handleScrollToTop}
              aria-label="Braseiro Caiçara, voltar ao topo"
              className="inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8832A] rounded-[4px]"
            >
              <picture>
                <source
                  media="(min-width: 1024px)"
                  srcSet="/images/logo/logo-carvao.webp"
                  type="image/webp"
                />
                <source
                  srcSet="/images/logo/logo-carvao-mobile.webp"
                  type="image/webp"
                />
                <img
                  src="/images/logo/logo-carvao.png"
                  alt="Braseiro Caiçara"
                  width={132}
                  height={52}
                  loading="lazy"
                  decoding="async"
                  className="h-[52px] w-auto object-contain block"
                />
              </picture>
            </a>

            {/* Copyright e link Voltar ao Topo */}
            <div className="flex flex-col items-center text-center">
              <p
                className="font-text font-normal text-[13px] text-[#14100D]/75 leading-[1.5] m-0"
                style={{ fontFamily: 'var(--font-text)' }}
              >
                © 2026 Braseiro Caiçara. Todos os direitos reservados.
                <br />
                Parrilla &amp; Frutos do Mar · Ubatuba/SP
              </p>
              <a
                href="/#inicio"
                onClick={handleScrollToTop}
                className="mt-3 min-h-[44px] inline-flex items-center justify-center font-text font-semibold uppercase text-[12px] tracking-[0.12em] text-[#14100D] border-b-2 border-[var(--brasa-creme-texto)] px-2 hover:text-[var(--brasa-creme-texto)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8832A] transition-colors duration-200 select-none"
                style={{ fontFamily: 'var(--font-text)' }}
              >
                VOLTAR AO TOPO ↑
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Regras de rotação responsiva da comanda e hover apenas em pointer: fine */}
      <style>{`
        .footer-comanda-hover {
          transform: rotate(-1.5deg);
        }
        @media (min-width: 1024px) {
          .footer-comanda-hover {
            transform: rotate(-2deg);
          }
        }
        @media (hover: hover) and (pointer: fine) {
          .footer-comanda-hover:hover {
            transform: rotate(0deg) translateY(-6px) !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
