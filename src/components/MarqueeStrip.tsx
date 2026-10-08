import React from 'react';
import { ChamaIcon } from './icons/ChamaIcon';
import { CarneIcon } from './icons/CarneIcon';

const MarqueeGroup: React.FC<{ 'aria-hidden'?: boolean | 'true' | 'false' }> = ({
  'aria-hidden': ariaHidden,
}) => (
  <div
    className="marquee__group flex items-center shrink-0"
    aria-hidden={ariaHidden}
  >
    {/* Segmento 1: [CHAMA] */}
    <ChamaIcon className="icon-chama h-[24px] sm:h-[28px] w-auto mx-[28px] text-[#14100D] shrink-0" />

    {/* Segmento 2: TODO DIA É DIA DE brasa */}
    <span
      className="font-display font-[800] uppercase tracking-[0.02em] whitespace-nowrap text-[#14100D] text-[clamp(1rem,1.6vw,1.25rem)] leading-none select-none"
      style={{
        fontFamily: 'var(--font-display)',
        fontVariationSettings: '"SOFT" 100, "WONK" 1',
        fontOpticalSizing: 'auto',
      }}
    >
      TODO DIA É DIA DE{' '}
      <em
        className="normal-case not-italic font-[800] text-[#14100D]"
        style={{
          fontStyle: 'italic',
          textTransform: 'none',
        }}
      >
        brasa
      </em>
    </span>

    {/* Segmento 3: [CARNE] */}
    <CarneIcon className="icon-carne h-[24px] sm:h-[28px] w-auto mx-[28px] text-[#14100D] shrink-0" />

    {/* Segmento 4: RESERVE SUA MESA · RESERVA TU MESA · BOOK YOUR TABLE */}
    <span
      className="font-display font-[800] uppercase tracking-[0.02em] whitespace-nowrap text-[#14100D] text-[clamp(1rem,1.6vw,1.25rem)] leading-none select-none"
      style={{
        fontFamily: 'var(--font-display)',
        fontVariationSettings: '"SOFT" 100, "WONK" 1',
        fontOpticalSizing: 'auto',
      }}
    >
      RESERVE SUA MESA <span className="mx-[0.5em] opacity-80">·</span> RESERVA TU MESA{' '}
      <span className="mx-[0.5em] opacity-80">·</span> BOOK YOUR TABLE
    </span>

    {/* Segmento 5: [CHAMA] */}
    <ChamaIcon className="icon-chama h-[24px] sm:h-[28px] w-auto mx-[28px] text-[#14100D] shrink-0" />

    {/* Segmento 6: PARRILLA · FRUTOS DO MAR */}
    <span
      className="font-display font-[800] uppercase tracking-[0.02em] whitespace-nowrap text-[#14100D] text-[clamp(1rem,1.6vw,1.25rem)] leading-none select-none"
      style={{
        fontFamily: 'var(--font-display)',
        fontVariationSettings: '"SOFT" 100, "WONK" 1',
        fontOpticalSizing: 'auto',
      }}
    >
      PARRILLA <span className="mx-[0.5em] opacity-80">·</span> FRUTOS DO MAR
    </span>
  </div>
);

export const MarqueeStrip: React.FC = () => {
  return (
    <section
      className="marquee relative w-full bg-[#E8832A] h-[48px] sm:h-[60px] flex items-center border-y border-[#14100D] z-20"
      aria-label="Braseiro Caiçara, parrilla e frutos do mar. Reserve sua mesa"
    >
      <div className="marquee__track">
        <MarqueeGroup />
        <MarqueeGroup aria-hidden="true" />
      </div>
    </section>
  );
};

export default MarqueeStrip;
