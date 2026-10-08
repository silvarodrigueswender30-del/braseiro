import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  as = 'button',
  href,
  className = '',
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-[8px] tracking-wide active:scale-[0.98] select-none';

  const sizeClasses = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm sm:text-base px-5 py-2.5 gap-2',
    lg: 'text-base sm:text-lg px-7 py-3.5 gap-2.5 font-semibold',
  }[size];

  // Primário: fundo âmbar (--brasa: #D9741C) com texto carvão (--rua: #1A1411)
  // Secundário: contorno creme (--creme: #F3E6D0)
  const variantClasses = {
    primary:
      'bg-[#D9741C] text-[#1A1411] font-semibold hover:bg-[#F2B25A] shadow-[0_4px_20px_rgba(217,116,28,0.35)] hover:shadow-[0_6px_25px_rgba(242,178,90,0.5)]',
    secondary:
      'border border-[#F3E6D0]/40 text-[#F3E6D0] hover:border-[#F3E6D0] hover:bg-[#F3E6D0]/10 backdrop-blur-sm',
    ghost:
      'text-[#F3E6D0] hover:text-[#F2B25A] hover:bg-white/5',
  }[variant];

  const combinedClasses = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;

  if (as === 'a' && href) {
    return (
      <a
        href={href}
        className={combinedClasses}
        target={props.target}
        rel={props.rel}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
