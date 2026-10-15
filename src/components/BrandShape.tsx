import React, { useEffect, useState } from 'react';

export type BrandShapeType =
  | 'nuvem-a'
  | 'nuvem-b'
  | 'mancha-c'
  | 'pincelada-d'
  | 'faiscas'
  | 'selo'
  | 'sal';

export type BrandShapeTone =
  | 'terracota'
  | 'areia'
  | 'carvao'
  | 'creme'
  | 'brasa';

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
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Aspect ratio nativo de cada vetor de forma de marca
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
};

/**
 * BrandShape - Formas decorativas da marca como máscara CSS.
 * 
 * REGRA DE OURO DA MARCA:
 * O tom "brasa" (#E8832A) só deve ser usado em formas pequenas,
 * no máximo UMA por página, para preservar o contraste e a elegância editorial.
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
  className = '',
  style: userStyle,
}) => {
  const maskUrl = `url(/images/formas/${shape}.svg)`;
  const aspectRatio = SHAPE_ASPECT_RATIOS[shape] || '1 / 1';

  // Parallax leve (≤ 20px) apenas quando habilitado, respeitando prefers-reduced-motion e desktop
  const [parallaxOffset, setParallaxOffset] = useState<number>(0);

  useEffect(() => {
    if (!parallax || typeof window === 'undefined') return;

    // Verificar se o usuário prefere movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || window.innerWidth < 768) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Deslocamento máximo muito suave de até 20px
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

  const transforms: string[] = [];
  if (parallaxOffset !== 0) transforms.push(`translateY(${parallaxOffset}px)`);
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
    opacity: opacity !== undefined ? opacity : undefined,
    transform: transforms.length > 0 ? transforms.join(' ') : undefined,
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
      aria-hidden="true"
      className={`brand-shape ${responsiveClasses} ${className}`.trim()}
      style={inlineStyle}
    />
  );
};

export default BrandShape;
