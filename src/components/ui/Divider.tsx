import React from 'react';

export interface DividerProps {
  className?: string;
  variant?: 'subtle' | 'flame';
}

export const Divider: React.FC<DividerProps> = ({ className = '', variant = 'flame' }) => {
  return (
    <div className={`relative flex items-center justify-center my-6 sm:my-8 w-full max-w-lg mx-auto ${className}`}>
      {/* Left line */}
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#F3E6D0]/25 to-[#F3E6D0]/40" />

      {/* Flame Icon */}
      {variant === 'flame' && (
        <div className="mx-3 text-[#D9741C] flex items-center justify-center">
          <svg
            className="w-4 h-4 fill-current drop-shadow-[0_0_8px_rgba(217,116,28,0.6)]"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2C10.5 4.5 9 7.5 9 10.5c0 1.2.3 2.3.8 3.3C9.3 13.3 9 12.7 9 12c0-2-1.5-3.5-1.5-3.5S6 10.5 6 13c0 3.3 2.7 6 6 6s6-2.7 6-6c0-3.5-3-6.5-6-11zm.5 15.5c-1.4 0-2.5-1.1-2.5-2.5 0-.8.4-1.5 1-1.9.1.5.3.9.7 1.2.4.3.9.4 1.3.3.3.4.5.9.5 1.4 0 .8-.5 1.5-1 1.5z" />
          </svg>
        </div>
      )}

      {/* Right line */}
      <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#F3E6D0]/25 to-[#F3E6D0]/40" />
    </div>
  );
};
