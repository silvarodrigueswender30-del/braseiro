import React from 'react';

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
  className?: string;
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
  className = '',
}) => {
  const maskUrl = `url(/images/formas/${shape}.svg)`;
  const aspectRatio = SHAPE_ASPECT_RATIOS[shape] || '1 / 1';

  const transforms: string[] = [];
  if (rotate) transforms.push(`rotate(${rotate}deg)`);
  if (flipX) transforms.push('scaleX(-1)');

  const style: React.CSSProperties = {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 0,
    width: size,
    aspectRatio,
    top,
    right,
    bottom,
    left,
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
    // Sem animação e sem will-change para evitar consumo desnecessário de GPU/composição
  };

  return (
    <span
      aria-hidden="true"
      className={`brand-shape ${className}`.trim()}
      style={style}
    />
  );
};

export default BrandShape;
