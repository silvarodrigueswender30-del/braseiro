import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const OndaIcon: React.FC<IconProps> = ({ className = '', style, ...props }) => (
  <svg
    viewBox="0 0 1024 1024"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
    style={{ overflow: 'visible', ...style }}
    {...props}
  >
    {/* Contorno adesivo carvão (#14100D) atrás de todas as ondas */}
    <g
      className="icon-waves-outline"
      fill="none"
      stroke="#14100D"
      strokeWidth={68}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Onda 1 (superior) */}
      <path
        className="icon-wave-outline--1"
        d="M 120 360 C 220 250, 360 250, 460 360 C 560 470, 700 470, 800 360 C 850 305, 900 305, 940 340"
      />
      {/* Onda 2 (meio) */}
      <path
        className="icon-wave-outline--2"
        d="M 90 540 C 190 430, 330 430, 430 540 C 530 650, 670 650, 770 540 C 830 475, 890 475, 940 520"
      />
      {/* Onda 3 (inferior, mais calma) */}
      <path
        className="icon-wave-outline--3"
        d="M 140 710 C 240 630, 360 630, 460 710 C 560 790, 680 790, 780 710 C 840 660, 890 660, 930 690"
      />
    </g>

    {/* Ondas principais em Laranja Brasa (#E8832A) com espessura 40 */}
    <g
      className="icon-waves-body"
      fill="none"
      stroke="#E8832A"
      strokeWidth={40}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Onda 1 (superior) */}
      <path
        className="icon-wave icon-wave--1"
        d="M 120 360 C 220 250, 360 250, 460 360 C 560 470, 700 470, 800 360 C 850 305, 900 305, 940 340"
      />
      {/* Onda 2 (meio) */}
      <path
        className="icon-wave icon-wave--2"
        d="M 90 540 C 190 430, 330 430, 430 540 C 530 650, 670 650, 770 540 C 830 475, 890 475, 940 520"
      />
      {/* Onda 3 (inferior, mais calma) */}
      <path
        className="icon-wave icon-wave--3"
        d="M 140 710 C 240 630, 360 630, 460 710 C 560 790, 680 790, 780 710 C 840 660, 890 660, 930 690"
      />
    </g>
  </svg>
);

export default OndaIcon;
