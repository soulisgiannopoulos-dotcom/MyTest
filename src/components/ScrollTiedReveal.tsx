import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface ScrollTiedRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  startOffset?: string;
  endOffset?: string;
  transitionDuration?: number;
  highlightWordIndices?: number[];
  highlightClassName?: string;
  // An optional mapping of word index to a decorative React node (like footnotes or commas)
  decorations?: Record<number, React.ReactNode>;
}

export const ScrollTiedReveal: React.FC<ScrollTiedRevealProps> = ({
  text,
  className = "",
  wordClassName = "",
  startOffset = "start 85%",
  endOffset = "end 45%",
  highlightWordIndices = [],
  highlightClassName = "",
  decorations = {}
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: [startOffset as any, endOffset as any],
  });

  const words = text.split(/\s+/);

  return (
    <span ref={containerRef} className={className}>
      {words.map((word, i) => {
        // Subtle offset calculations for progressive word highlighting
        const startRange = i / words.length;
        const endRange = (i + 1.25) / words.length; // Overlaps for a smooth, readable ink reveal transitions
        const opacity = useTransform(scrollYProgress, [startRange, Math.min(endRange, 1)], [0.15, 1]);

        const isHighlighted = highlightWordIndices.includes(i);
        const resolvedWordClass = `${wordClassName} ${isHighlighted ? highlightClassName : ""}`;

        return (
          <span key={i} className="inline-block mr-[0.25em] last:mr-0 select-none">
            <motion.span style={{ opacity }} className={resolvedWordClass}>
              {word}
            </motion.span>
            {decorations[i] && (
              <span className="inline-block mr-[0.1em]">
                {decorations[i]}
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
};
