import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface ScrollRevealProps {
  from?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  amount?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Slides its content in from the given side when it enters the viewport, and
 * slides it back out when it leaves — so it re-plays whether you scroll down
 * or back up.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  from = 'left',
  delay = 0,
  amount = 0.3,
  className = '',
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount });

  const offset =
    from === 'left'
      ? { x: -64, y: 0 }
      : from === 'right'
        ? { x: 64, y: 0 }
        : from === 'down'
          ? { x: 0, y: 48 }
          : { x: 0, y: -48 };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...offset }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
};
