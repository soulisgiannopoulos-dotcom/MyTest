import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ChevronRight } from 'lucide-react';

interface Insight {
  id: string;
  title: string;
  word: string;
  subtext: string;
  image: string;
  category: string;
  readTime: string;
}

const insights: Insight[] = [
  {
    id: "01",
    title: "The New Sustainability Reality: What Boards Need to Know Now",
    word: "SUSTAINABILITY",
    subtext: "A world where everything is connected — and everyone is exposed The End of the Old Sustainability Story",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000",
    category: "Strategic Risk",
    readTime: "4 MIN READ"
  },
  {
    id: "02",
    title: "Carbon as Currency",
    word: "CLIMATE",
    subtext: "How transitional risk is shifting from a liability to a core balance sheet driver.",
    image: "https://images.unsplash.com/photo-1580064461598-505b080a8242?",
    category: "Sustainability",
    readTime: "3 MIN READ"
  },
  {
    id: "03",
    title: "Quantum Dominance",
    word: "TECHNOLOGY",
    subtext: "The security implications of the next computational leap for organizational resilience.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000",
    category: "Cyber Resilience",
    readTime: "5 MIN READ"
  },
  {
    id: "04",
    title: "Social License 2.0",
    word: "PURPOSE",
    subtext: "Redefining the relationship between corporate power and community resilience.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
    category: "Social Capital",
    readTime: "4 MIN READ"
  },
  {
    id: "05",
    title: "Synthetic Intelligence",
    word: "AI",
    subtext: "Navigating the blurred lines between automated efficiency and systemic fragility.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
    category: "Operational Risk",
    readTime: "6 MIN READ"
  },
  {
    id: "06",
    title: "Radical Transparency",
    word: "RESILIENCE",
    subtext: "New standards of reporting that go far beyond traditional ESG metrics.",
    image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=1000",
    category: "Governance",
    readTime: "3 MIN READ"
  }
];

const BlockReveal = ({ children, color = "var(--athena-peach)", delay = 0, duration = 0.8, className = "" }: { children: React.ReactNode, color?: string, delay?: number, duration?: number, className?: string }) => {
  return (
    <div className={`relative w-fit overflow-hidden ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.01, delay: delay + (duration / 2) }}
      >
        {children}
      </motion.div>
      <motion.div
        initial={{ left: 0, width: "0%" }}
        whileInView={{ 
          width: ["0%", "100%", "0%"],
          left: ["0%", "0%", "100%"]
        }}
        viewport={{ once: true }}
        transition={{ 
          duration: duration, 
          delay: delay,
          ease: [0.77, 0, 0.175, 1],
          times: [0, 0.5, 1]
        }}
        style={{ backgroundColor: color }}
        className="absolute top-0 bottom-0 z-20 pointer-events-none"
      />
    </div>
  );
};

export const ThoughtLeadershipAccordion = ({ isDarkMode, onArticleSelect, onShowArchive }: { isDarkMode?: boolean, onArticleSelect?: (id: string) => void, onShowArchive?: () => void }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="thought-leadership" className="relative bg-white dark:bg-athena-cream overflow-hidden transition-colors duration-500">
      <div className="flex h-[400px] md:h-[550px] w-full">
        {/* Left Column (20%) */}
        <div className="hidden md:flex w-[20%] bg-white dark:bg-athena-surface border-r border-athena-navy/5 dark:border-white/5 items-center justify-center relative overflow-hidden">
          <div className="origin-center -rotate-90 whitespace-nowrap">
            <BlockReveal delay={0.1} duration={1}>
              <h2 className="font-display text-[4vw] xl:text-[54px] font-medium leading-none tracking-tighter text-[#152532] dark:text-[#eaeaea] uppercase">
                Thought <span className="text-athena-peach">Leadership</span>
              </h2>
            </BlockReveal>
          </div>
        </div>

        {/* Right Column (80% or 100% on mobile) */}
        <div className="w-full md:w-[80%] flex h-full bg-[#eaeaea] dark:bg-athena-surface">
          {insights.map((insight, index) => {
            const isExpanded = expandedIndex === index;
            const isAnyExpanded = expandedIndex !== null;
            const isHovered = hoveredIndex === index;
            
            return (
              <motion.div
                key={insight.id}
                className={`relative h-full cursor-pointer overflow-hidden border-r last:border-r-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach focus-visible:ring-offset-2 transition-colors duration-300 ${
                  isHovered || isExpanded ? 'border-r-athena-peach bg-white/5' : 'border-r-white/10'
                }`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (isExpanded) {
                      if (onArticleSelect) onArticleSelect(insight.id);
                    } else {
                      setExpandedIndex(index);
                    }
                  }
                }}
                initial={false}
                animate={{
                  width: isExpanded ? '55%' : isAnyExpanded ? '9%' : '16.66%'
                }}
                transition={{
                  type: 'spring',
                  stiffness: 120,
                  damping: 16,
                  mass: 0.8
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => {
                  if (isExpanded) {
                    if (onArticleSelect) onArticleSelect(insight.id);
                  } else {
                    setExpandedIndex(index);
                  }
                }}
              >
                {/* Image Background */}
                <motion.div
                  className="absolute inset-0 z-0"
                  animate={{
                    scale: isExpanded ? 1.05 : 1,
                    filter: isExpanded ? 'grayscale(0%) brightness(0.6)' : 'grayscale(100%) brightness(0.4)'
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <img 
                    src={insight.image} 
                    alt={insight.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Vertical Title (Collapsed State) */}
                <AnimatePresence>
                  {!isExpanded && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
                    >
                      <span 
                        className="origin-center -rotate-90 text-white/40 font-mono font-bold text-sm tracking-[0.4em] whitespace-nowrap uppercase mb-32"
                      >
                        {insight.word}
                      </span>
                      <span className="origin-center -rotate-90 text-athena-peach/60 font-mono font-bold text-[10px] tracking-widest whitespace-nowrap uppercase mt-8">
                        {insight.readTime}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.15 }}
                      className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-end"
                    >
                      <div className="max-w-xl">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-4"
                        >
                          <span className="bg-athena-peach text-athena-navy text-[10px] font-bold font-mono tracking-widest px-3 py-1 rounded-full uppercase">
                            {insight.category}
                          </span>
                        </motion.div>
                        
                        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-display font-medium text-white mb-4 sm:mb-6 leading-tight">
                          {insight.title}
                        </h3>
                        
                        <p className="text-white/70 text-xs sm:text-sm md:text-base lg:text-xl font-jakarta leading-relaxed mb-6 sm:mb-8 max-w-md">
                          {insight.subtext}
                        </p>
                        
                         <motion.button
                          whileHover={{ x: 10 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onArticleSelect) onArticleSelect(insight.id);
                          }}
                          className="flex items-center gap-3 text-athena-peach hover:text-white transition-colors font-mono text-sm tracking-widest font-bold uppercase"
                        >
                          Explore Insight <ArrowUpRight size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-athena-navy via-transparent to-transparent opacity-60 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onShowArchive}
          className="group flex items-center gap-2 bg-athena-navy text-white px-5 py-2.5 rounded-full font-sans font-bold text-xs tracking-widest uppercase transition-all hover:bg-athena-peach shadow-lg dark:bg-athena-peach dark:text-athena-navy dark:hover:bg-athena-peach-bright dark:hover:text-athena-navy transition-colors duration-300"
        >
          See more posts <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </section>
  );
};
