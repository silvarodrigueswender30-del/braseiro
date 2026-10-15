import React, { useEffect, useRef, useState } from 'react';

export type BrandShapeType =
  | 'nuvem-a'
  | 'nuvem-b'
  | 'mancha-c'
  | 'pincelada-d'
  | 'faiscas'
  | 'selo'
  | 'sal'
  | 'chama-traco';

export type BrandShapeTone =
  | 'terracota'
  | 'areia'
  | 'carvao'
  | 'creme'
  | 'brasa'
  | 'marrom-fogo';

export interface BrandShapeProps {
  shape: BrandShapeType;
  tone: BrandShapeTone;
  size?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  rotate?: number;
  flipX?: boolean;
  opacity?: number;
  hideOnMobile?: boolean;
  parallax?: boolean;
  reveal?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Aspect ratio nativo de cada vetor/raster de forma de marca
 * para garantir escalabilidade perfeita sem distorção.
 */
const SHAPE_ASPECT_RATIOS: Record<BrandShapeType, string> = {
  'nuvem-a': '870 / 740',
  'nuvem-b': '1310 / 733',
  'mancha-c': '997 / 739',
  'pincelada-d': '1489 / 534',
  'faiscas': '2213 / 477',
  'selo': '879 / 881',
  'sal': '683 / 552',
  'chama-traco': '320 / 400',
};

/**
 * Determina o caminho da máscara (raster WebP com grão para silhuetas ricas, ou SVG para traços).
 */
function getMaskUrl(shape: BrandShapeType): string {
  if (shape === 'chama-traco') {
    return 'url(/images/formas/chama-traco.svg)';
  }
  return `url(/images/formas-raster/${shape}.webp)`;
}

/**
 * BrandShape - Formas decorativas da marca em cor sólida saturada com textura de carimbo/xilogravura.
 * 
 * DIRETRIZES DA MARCA (Prompt v7):
 * - Cor sólida e saturada (sem marcas d'água transparentes: opacity >= 0.85 ou sólido 1.0).
 * - Tom sobre tom feito com cores sólidas (ex: marrom-fogo no fundo escuro).
 * - Textura e grão preservados via máscara WebP de luminância do original artesanal.
 * - Revelação suave ao entrar na viewport (<= 400ms, transform/opacity apenas).
 */
export const BrandShape: React.FC<BrandShapeProps> = ({
  shape,
  tone,
  size = 'clamp(220px, 34vw, 520px)',
  top,
  right,
  bottom,
  left,
  rotate,
  flipX,
  opacity,
  hideOnMobile = false,
  parallax = false,
  reveal = true,
  className = '',
  style: userStyle,
}) => {
  const elRef = useRef<HTMLSpanElement>(null);
  const maskUrl = getMaskUrl(shape);
  const aspectRatio = SHAPE_ASPECT_RATIOS[shape] || '1 / 1';

  // Revelação viewport (<= 400ms, ease-out, transform/opacity apenas)
  const [isRevealed, setIsRevealed] = useState<boolean>(!reveal);

  // Parallax leve (<= 20px) apenas quando habilitado, respeitando prefers-reduced-motion e desktop
  const [parallaxOffset, setParallaxOffset] = useState<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    if (!reveal) {
      setIsRevealed(true);
    } else if (elRef.current && typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsRevealed(true);
            observer.disconnect();
          }
        },
        { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
      );
      observer.observe(elRef.current);
      return () => observer.disconnect();
    } else {
      setIsRevealed(true);
    }
  }, [reveal]);

  useEffect(() => {
    if (!parallax || typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || window.innerWidth < 768) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const offset = Math.sin(scrollY * 0.0015) * 16;
          setParallaxOffset(Math.round(offset));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [parallax]);

  // Garante conformidade estrita com a regra "Proibido opacity < 0.85"
  const finalOpacity = opacity !== undefined ? Math.max(0.85, opacity) : 1;

  // Montagem de transforms combinando rotação, flip, parallax e reveal
  const transforms: string[] = [];
  if (!isRevealed) {
    transforms.push('translateY(20px)');
  } else if (parallaxOffset !== 0) {
    transforms.push(`translateY(${parallaxOffset}px)`);
  }
  if (rotate) transforms.push(`rotate(${rotate}deg)`);
  if (flipX) transforms.push('scaleX(-1)');

  const inlineStyle: React.CSSProperties = {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 0,
    width: size,
    aspectRatio,
    top,
    right,
    bottom,
    left,
    opacity: isRevealed ? finalOpacity : 0,
    transform: transforms.length > 0 ? transforms.join(' ') : undefined,
    transition: 'opacity 380ms cubic-bezier(0.16, 1, 0.3, 1), transform 380ms cubic-bezier(0.16, 1, 0.3, 1)',
    WebkitMaskImage: maskUrl,
    maskImage: maskUrl,
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    backgroundColor: `var(--shape-${tone})`,
    ...userStyle,
  };

  const responsiveClasses = hideOnMobile ? 'hidden sm:inline-block' : 'inline-block';

  return (
    <span
      ref={elRef}
      aria-hidden="true"
      className={`brand-shape ${responsiveClasses} ${className}`.trim()}
      style={inlineStyle}
    />
  );
};

export default BrandShape;
