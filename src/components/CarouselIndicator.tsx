import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselIndicatorItem {
  id: string;
  label: string;
}

export interface CarouselIndicatorProps {
  items: (CarouselIndicatorItem | string)[];
  activeIndex: number;
  onChange: (index: number) => void;
  theme?: 'light' | 'dark';
  onPrev?: () => void;
  onNext?: () => void;
  showArrowsOnDesktop?: boolean;
  isDesktopScrollable?: boolean;
  className?: string;
}

/**
 * CarouselIndicator - Indicador segmentado universal de carrosséis (Prompt v8).
 * 
 * ESPECIFICAÇÃO:
 * - Altura 4px, largura inativa 28px, ativa ~44px, gap 8px.
 * - Margem de 20px (mt-5) abaixo do carrossel, centralizado.
 * - Transição 300ms ease-out (sem animação em prefers-reduced-motion).
 * - Cores com contraste:
 *   - Tema Claro (fundo creme): ativo Terracota #A83A2A, inativo rgba(168, 58, 42, 0.28).
 *   - Tema Escuro (fundo carvão): ativo Brasa #E8832A, inativo rgba(232, 131, 42, 0.28).
 * - Área de toque >= 44x44px por segmento via padding/pseudo-elemento.
 * - Desktop (>= 768px): setas discretas (44x44px) caso o carrossel seja rolável.
 */
export const CarouselIndicator: React.FC<CarouselIndicatorProps> = ({
  items,
  activeIndex,
  onChange,
  theme = 'light',
  onPrev,
  onNext,
  showArrowsOnDesktop = false,
  isDesktopScrollable = false,
  className = '',
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(media.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const count = items.length;
  if (count <= 1) return null;

  const isLight = theme === 'light';
  const activeColor = isLight ? '#A83A2A' : '#E8832A';
  const inactiveColor = isLight ? 'rgba(168, 58, 42, 0.28)' : 'rgba(232, 131, 42, 0.28)';
  const arrowBorder = isLight ? 'border-[#14100D]/20 hover:border-[#14100D]/40 text-[#14100D]' : 'border-[#F5E6D0]/20 hover:border-[#F5E6D0]/40 text-[#F5E6D0]';

  const transitionStyle = prefersReducedMotion
    ? 'none'
    : 'width 300ms cubic-bezier(0.16, 1, 0.3, 1), background-color 300ms cubic-bezier(0.16, 1, 0.3, 1)';

  return (
    <div
      role="region"
      aria-label="Controles do carrossel"
      className={`carousel-indicator-container flex items-center justify-center gap-4 mt-5 select-none ${className}`.trim()}
    >
      {/* Seta Esquerda (Desktop rolável) */}
      {showArrowsOnDesktop && isDesktopScrollable && onPrev && (
        <button
          type="button"
          onClick={onPrev}
          disabled={activeIndex <= 0}
          aria-label="Item anterior"
          className={`hidden md:inline-flex items-center justify-center w-11 h-11 rounded-full border transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E8832A] ${arrowBorder} ${
            activeIndex <= 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/5 active:scale-95 cursor-pointer'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Segmentos em pílula */}
      <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Slides do carrossel">
        {items.map((item, idx) => {
          const isActive = idx === activeIndex;
          const label = typeof item === 'string' ? item : item.label;

          return (
            <button
              key={typeof item === 'string' ? `seg-${idx}` : item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? 'true' : undefined}
              aria-label={`Ir para ${label || `slide ${idx + 1}`}`}
              onClick={() => onChange(idx)}
              className="relative py-4 px-1 flex items-center justify-center cursor-pointer group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8832A]"
              style={{
                // Garante área de toque mínima de 44x44px
                minWidth: '44px',
                minHeight: '44px',
              }}
            >
              {/* Barra segmentada visível */}
              <span
                className="block h-[4px] rounded-full pointer-events-none"
                style={{
                  width: isActive ? '44px' : '28px',
                  backgroundColor: isActive ? activeColor : inactiveColor,
                  transition: transitionStyle,
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Seta Direita (Desktop rolável) */}
      {showArrowsOnDesktop && isDesktopScrollable && onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={activeIndex >= count - 1}
          aria-label="Próximo item"
          className={`hidden md:inline-flex items-center justify-center w-11 h-11 rounded-full border transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E8832A] ${arrowBorder} ${
            activeIndex >= count - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/5 active:scale-95 cursor-pointer'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default CarouselIndicator;
