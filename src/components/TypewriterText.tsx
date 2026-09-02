import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface TypewriterTextProps {
  text: string;
  delay?: number; // Delay in seconds before typing starts
  speed?: number; // Speed in milliseconds per character
  isTriggered?: boolean;
  onComplete?: () => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  delay = 0, 
  speed = 25,
  isTriggered = true,
  onComplete
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isInView || !isTriggered) return;

    let startTimeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    startTimeout = setTimeout(() => {
      setStarted(true);
      let currentIndex = 0;
      interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText((prev) => text.slice(0, prev.length + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        }
      }, speed);
    }, delay * 1000);

    return () => {
      clearTimeout(startTimeout);
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isInView, text, delay, speed, isTriggered]);

  return (
    <span ref={containerRef} className="relative inline font-jakarta">
      {displayedText}
      {isInView && isTriggered && (!started || displayedText.length < text.length) && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="inline-block w-[1.5px] h-[1em] bg-athena-peach ml-0.5 align-middle"
        />
      )}
    </span>
  );
};
