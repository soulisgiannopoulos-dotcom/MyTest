import React from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';

const marqueeItems = [
  "As boundaries, technologies, practices and markets shift, a different kind of insight, strategy and capability is required"
];

export const InfiniteRibbon = () => {
  return (
    <div className="relative w-full bg-white dark:bg-athena-cream overflow-hidden py-8 border-y border-athena-peach/20 select-none">
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
          className="flex gap-12 items-center"
        >
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-12">
              <span className="text-xs md:text-base font-display font-medium tracking-tight text-athena-navy dark:text-athena-navy">
                {item}
              </span>
              <Logo size={20} color="var(--athena-peach)" className="opacity-80" />
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Side Fades for depth */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white dark:from-athena-cream to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white dark:from-athena-cream to-transparent z-10" />
    </div>
  );
};
