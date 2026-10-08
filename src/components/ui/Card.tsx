import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'double';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  if (variant === 'double') {
    return (
      <div
        className={`relative p-1.5 sm:p-2 rounded-[12px] border border-[#F2B25A]/35 bg-[rgba(26,20,17,0.7)] backdrop-blur-md shadow-[0_12px_40px_rgba(5,7,13,0.7)] ${className}`}
        {...props}
      >
        <div className="w-full h-full p-4 sm:p-7 rounded-[8px] border border-[#F2B25A]/25 bg-[rgba(26,20,17,0.55)] text-[#F3E6D0]">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-[rgba(26,20,17,0.65)] backdrop-blur-md border border-[#F3E6D0]/15 rounded-[10px] p-4 sm:p-6 text-[#F3E6D0] shadow-[0_8px_32px_rgba(5,7,13,0.5)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
