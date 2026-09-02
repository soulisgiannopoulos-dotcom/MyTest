import React from 'react';
import { motion } from 'motion/react';

interface BlockRevealProps {
  children: React.ReactNode;
  color?: string;
  delay?: number;
  duration?: number;
  className?: string;
  trigger?: boolean;
}

export const BlockReveal: React.FC<BlockRevealProps> = ({ 
  children, 
  color = "var(--athena-peach)", 
  delay = 0, 
  duration = 0.8, 
  className = "",
  trigger
}) => {
  const isControlled = trigger !== undefined;

  const textAnimate = isControlled
    ? (trigger ? { opacity: 1 } : { opacity: 0 })
    : undefined;

  const textWhileInView = isControlled ? undefined : { opacity: 1 };

  const blockAnimate = isControlled
    ? (trigger ? { 
        width: ["0%", "100%", "0%"],
        left: ["0%", "0%", "100%"]
      } : { left: 0, width: "0%" })
    : undefined;

  const blockWhileInView = isControlled ? undefined : { 
    width: ["0%", "100%", "0%"],
    left: ["0%", "0%", "100%"]
  };

  return (
    <div className={`relative w-fit overflow-hidden ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={textAnimate}
        whileInView={textWhileInView}
        viewport={{ once: true }}
        transition={{ duration: 0.01, delay: delay + (duration / 2) }}
      >
        {children}
      </motion.div>
      <motion.div
        initial={{ left: 0, width: "0%" }}
        animate={blockAnimate}
        whileInView={blockWhileInView}
        viewport={{ once: true }}
        transition={{ 
          duration: duration, 
          delay: delay,
          ease: "easeInOut",
          times: [0, 0.5, 1]
        }}
        style={{ backgroundColor: color }}
        className="absolute top-0 bottom-0 z-20"
      />
    </div>
  );
};
