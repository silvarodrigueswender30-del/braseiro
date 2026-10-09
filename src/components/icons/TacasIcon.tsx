import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const TacasIcon: React.FC<IconProps> = ({ className = '', style, ...props }) => (
  <svg
    viewBox="0 0 1024 1024"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    className={className}
    style={{ overflow: 'visible', ...style }}
    {...props}
  >
    {/* Faísca 1 (topo esquerda) */}
    <g className="icon-spark icon-spark--1">
      <path
        d="M 440 210 Q 420 270 410 300 Q 450 280 470 260 Z"
        fill="#F4A340"
        stroke="#14100D"
        strokeWidth={12}
        strokeLinejoin="round"
        style={{ paintOrder: 'stroke fill' }}
      />
    </g>

    {/* Faísca 2 (centro topo) */}
    <g className="icon-spark icon-spark--2">
      <path
        d="M 512 140 Q 498 210 500 240 Q 526 210 535 180 Z"
        fill="#F4A340"
        stroke="#14100D"
        strokeWidth={12}
        strokeLinejoin="round"
        style={{ paintOrder: 'stroke fill' }}
      />
    </g>

    {/* Faísca 3 (topo direita) */}
    <g className="icon-spark icon-spark--3">
      <path
        d="M 580 210 Q 600 270 610 300 Q 570 280 550 260 Z"
        fill="#F4A340"
        stroke="#14100D"
        strokeWidth={12}
        strokeLinejoin="round"
        style={{ paintOrder: 'stroke fill' }}
      />
    </g>

    {/* Taça Esquerda (gira em torno da base) */}
    <g className="icon-glass-left" style={{ transformOrigin: '350px 820px' }}>
      {/* Líquido taça esquerda */}
      <path
        d="M 285 450 C 290 550 360 620 425 615 C 440 600 455 575 460 525 L 285 450 Z"
        fill="#F4A340"
      />
      {/* Contorno taça esquerda */}
      <path
        d="M 270 380
           L 475 465
           C 465 580 410 650 365 650
           L 350 820
           L 300 820
           M 350 820
           L 400 820
           M 365 650
           C 320 650 265 520 270 380 Z"
        fill="none"
        stroke="#E8832A"
        strokeWidth={22}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Borda superior da taça esquerda */}
      <path
        d="M 270 380 L 475 465"
        fill="none"
        stroke="#E8832A"
        strokeWidth={22}
        strokeLinecap="round"
      />
    </g>

    {/* Taça Direita (gira em torno da base) */}
    <g className="icon-glass-right" style={{ transformOrigin: '674px 820px' }}>
      {/* Líquido taça direita */}
      <path
        d="M 739 450 C 734 550 664 620 599 615 C 584 600 569 575 564 525 L 739 450 Z"
        fill="#F4A340"
      />
      {/* Contorno taça direita */}
      <path
        d="M 754 380
           L 549 465
           C 559 580 614 650 659 650
           L 674 820
           L 724 820
           M 674 820
           L 624 820
           M 659 650
           C 704 650 759 520 754 380 Z"
        fill="none"
        stroke="#E8832A"
        strokeWidth={22}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Borda superior da taça direita */}
      <path
        d="M 754 380 L 549 465"
        fill="none"
        stroke="#E8832A"
        strokeWidth={22}
        strokeLinecap="round"
      />
    </g>
  </svg>
);

export default TacasIcon;
