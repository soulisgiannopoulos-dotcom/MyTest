import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info } from 'lucide-react';

interface FootnoteProps {
  number: string;
  note: string;
  isDarkMode?: boolean;
  className?: string;
}

export const Footnote: React.FC<FootnoteProps> = ({ number, note, isDarkMode, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-block align-baseline group mx-0.5">
      <motion.button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.15 }}
        className={`group relative z-10 transition-all font-mono font-bold ${
          className || '-top-2 text-[10px] px-1'
        } ${
          isDarkMode 
            ? 'text-athena-peach hover:text-white' 
            : 'text-athena-peach hover:text-athena-navy'
        }`}
      >
        [{number}]
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`block absolute left-1/2 bottom-full mb-2.5 -translate-x-1/2 w-64 md:w-72 p-4 rounded-xl shadow-2xl z-50 backdrop-blur-xl border transition-all font-jakarta text-xs leading-relaxed font-normal tracking-normal normal-case whitespace-normal break-words ${
              isDarkMode 
                ? 'bg-[#152532]/95 border-white/10 text-[#eaeaea]' 
                : 'bg-white/95 border-athena-navy/10 text-athena-navy'
            }`}
          >
            <span className="flex items-start gap-2.5 font-jakarta text-xs leading-relaxed font-normal tracking-normal normal-case whitespace-normal break-words text-inherit">
              <Info size={14} className="mt-0.5 shrink-0 text-athena-peach" />
              <span className="block text-xs font-jakarta leading-relaxed font-normal tracking-normal normal-case whitespace-normal break-words text-inherit">
                {note}
              </span>
            </span>
            <span className={`block absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-b border-r ${
              isDarkMode ? 'bg-[#152532]/95 border-white/10' : 'bg-white/95 border-athena-navy/10'
            }`} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};
