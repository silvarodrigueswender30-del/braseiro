import React from 'react';

export interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ children, className = '' }) => {
  return (
    <span
      className={`inline-block font-condensed uppercase tracking-[0.22em] text-[#F2B25A] text-xs sm:text-sm font-semibold select-none ${className}`}
    >
      {children}
    </span>
  );
};
