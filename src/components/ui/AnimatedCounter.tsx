import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  suffix = '',
  duration = 1.8,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [displayValue, setDisplayValue] = useState<string>('0');

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const isDecimal = !Number.isInteger(value);

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // easeOutExpo for a satisfying smooth deceleration
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = ease * value;

      if (isDecimal) {
        setDisplayValue(current.toFixed(1).replace('.', ','));
      } else {
        setDisplayValue(Math.floor(current).toString());
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        if (isDecimal) {
          setDisplayValue(value.toFixed(1).replace('.', ','));
        } else {
          setDisplayValue(value.toString());
        }
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums font-condensed font-bold tracking-tight">
      {displayValue}
      {suffix}
    </span>
  );
};
