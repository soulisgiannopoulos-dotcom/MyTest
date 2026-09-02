import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, Filter, ArrowUpRight, Clock } from 'lucide-react';
import { BlockReveal } from './BlockReveal';

interface ArchiveArticle {
  id: string;
  date: string;
  category: string;
  title: string;
  readTime: string;
  description: string;
}

const archiveData: ArchiveArticle[] = [
  {
    id: "01",
    date: "MAY 2026",
    category: "SUSTAINABILITY",
    title: "The New Sustainability Reality: What Boards Need to Know Now",
    readTime: "4 MIN",
    description: "The world that shaped corporate sustainability strategies no longer exists. What remains is a landscape defined by collision."
  },
  {
    id: "02",
    date: "APR 2026",
    category: "GEOPOLITICS",
    title: "The Great Decoupling: Fragmentation of Global Supply Chains",
    readTime: "6 MIN",
    description: "Analyzing the strategic shift towards regionalized production and the rise of friend-shoring in critical industries."
  },
  {
    id: "03",
    date: "MAR 2026",
    category: "TECHNOLOGY",
    title: "Quantum Resilience: Protecting Infrastructure in a Post-Quantum World",
    readTime: "8 MIN",
    description: "Why organizations must begin the transition to quantum-resistant encryption today to safeguard decade-long assets."
  },
  {
    id: "04",
    date: "FEB 2026",
    category: "ECONOMICS",
    title: "The Volatility Premia: Pricing Risk in an Unstable Climate",
    readTime: "5 MIN",
    description: "How financial markets are finally beginning to price the physical risks of climate change into long-term bonds."
  },
  {
    id: "05",
    date: "JAN 2026",
    category: "STRATEGY",
    title: "Leadership in Disorder: Capabilities for the Permanent Crisis",
    readTime: "7 MIN",
    description: "Traditional management frameworks are failing. We explore the new traits of leaders who thrive in high-entropy environments."
  },
  {
    id: "06",
    date: "DEC 2025",
    category: "SOCIETY",
    title: "The Fragmentation of Truth: Impact on Social Cohesion",
    readTime: "10 MIN",
    description: "Exploring the decline of institutional trust and its implications for corporate social license to operate."
  }
];

interface ArchiveViewProps {
  onClose: () => void;
  onSelectArticle: (id: string) => void;
  isDarkMode: boolean;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({ onClose, onSelectArticle, isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = archiveData.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      role="dialog"
      aria-modal="true"
      aria-label="Insights Archive"
      className="fixed inset-0 z-[120] bg-athena-cream dark:bg-athena-surface overflow-hidden antialiased text-athena-navy dark:text-[#E8E6E3]"
    >
      <div 
        data-lenis-prevent
        className="h-full w-full overflow-y-auto scrollbar-hide overscroll-contain touch-pan-y"
        style={{ WebkitOverflowScrolling: 'touch', overscrollBehaviorY: 'contain' }}
      >
        {/* Navigation Header */}
        <nav className="sticky top-0 z-50 p-6 md:p-10 flex justify-between items-center bg-athena-cream/80 dark:bg-athena-surface/80 backdrop-blur-md border-b border-athena-navy/5">
          <motion.button 
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 520, damping: 16 }}
            className="flex items-center gap-3 text-athena-navy dark:text-athena-peach font-bold text-xs uppercase tracking-[0.3em] hover:opacity-75 transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#66aba5] dark:focus-visible:ring-[#88c9c4] focus-visible:outline-none px-3 py-1.5 rounded-md"
          >
            <ArrowLeft size={18} /> Close Insights
          </motion.button>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 bg-athena-navy/5 dark:bg-athena-peach/5 px-4 py-2 rounded-full border border-athena-navy/10 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#66aba5] dark:focus-within:ring-[#88c9c4] transition-all">
              <Search size={14} className="text-athena-navy/40 dark:text-athena-peach/40" />
              <input 
                type="text" 
                placeholder="SEARCH INSIGHTS..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none font-mono text-[10px] tracking-widest text-athena-navy dark:text-athena-peach placeholder:text-athena-navy/30 focus:outline-none"
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hidden md:flex items-center gap-2 text-athena-navy/40 dark:text-athena-peach/40 hover:text-athena-navy dark:hover:text-athena-peach transition-colors font-mono text-[10px] tracking-widest uppercase focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#66aba5] dark:focus-visible:ring-[#88c9c4] focus-visible:outline-none px-2 py-1 rounded-sm"
            >
              <Filter size={14} /> Filter
            </motion.button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="px-6 py-12 md:py-20">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-20">
              <p className="font-mono text-[10px] tracking-[0.4em] text-athena-peach uppercase mb-4">The Repository</p>
              <BlockReveal color="var(--athena-peach-bright)">
                <h1 className="text-5xl md:text-8xl font-display font-medium text-athena-navy dark:text-athena-peach tracking-tighter leading-none mb-8">
                  Strategic <br />Archives.
                </h1>
              </BlockReveal>
              <p className="text-xl md:text-2xl font-jakarta font-light text-athena-navy/50 dark:text-athena-peach/50 max-w-2xl leading-relaxed">
                A chronological collection of our thinking on resilience, global systems, and the future of strategy.
              </p>
            </header>

            {/* List Section */}
            <div className="space-y-0">
              {/* Table Header (Desktop Only) */}
              <div className="hidden lg:grid grid-cols-[120px_180px_1fr_120px_40px] gap-8 px-6 py-4 border-b border-athena-navy/10 mb-8 items-center">
                <span className="font-mono text-[10px] tracking-widest text-athena-navy/40 uppercase">Date</span>
                <span className="font-mono text-[10px] tracking-widest text-athena-navy/40 uppercase">Category</span>
                <span className="font-mono text-[10px] tracking-widest text-athena-navy/40 uppercase">Title</span>
                <span className="font-mono text-[10px] tracking-widest text-athena-navy/40 uppercase text-right">Read Time</span>
                <span />
              </div>

              {/* Articles */}
              <div className="divide-y divide-athena-navy/5 border-t border-athena-navy/5 lg:border-t-0">
                {filteredArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    onClick={() => onSelectArticle(article.id)}
                    className="group relative cursor-pointer"
                  >
                    <div className="grid lg:grid-cols-[120px_180px_1fr_120px_40px] gap-4 lg:gap-8 px-0 lg:px-6 py-8 md:py-12 items-center transition-all duration-500 group-hover:bg-athena-navy/[0.02] dark:group-hover:bg-athena-peach/[0.02]">
                      {/* Date */}
                      <div className="lg:block">
                        <span className="font-mono text-[10px] md:text-xs tracking-widest text-athena-navy/40 group-hover:text-athena-peach transition-colors">
                          {article.date}
                        </span>
                      </div>

                      {/* Category */}
                      <div className="lg:block">
                        <span className="inline-block bg-athena-navy/5 dark:bg-athena-peach/5 px-3 py-1 rounded-full font-mono text-[10px] tracking-widest text-athena-navy dark:text-athena-peach opacity-60 group-hover:opacity-100 transition-opacity">
                          {article.category}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="text-2xl md:text-4xl font-display font-medium text-athena-navy dark:text-athena-peach tracking-tight group-hover:pl-4 transition-all duration-500 mb-4">
                          {article.title}
                        </h3>
                        <p className="text-sm md:text-base font-jakarta font-light text-athena-navy/40 group-hover:text-athena-navy/60 transition-colors max-w-3xl line-clamp-2 md:line-clamp-none">
                          {article.description}
                        </p>
                      </div>

                      {/* Meta (Read Time) */}
                      <div className="flex items-center justify-end gap-2 text-athena-navy/30 dark:text-athena-peach/30 font-mono text-[10px] uppercase tracking-widest">
                        <Clock size={12} /> {article.readTime}
                      </div>

                      {/* Icon */}
                      <div className="flex justify-end pr-4 lg:pr-0">
                        <ArrowUpRight size={24} className="text-athena-navy/20 dark:text-athena-peach/20 group-hover:text-athena-peach group-hover:rotate-45 transition-all duration-500" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredArticles.length === 0 && (
                <div className="py-20 text-center">
                  <p className="font-display text-2xl text-athena-navy/20">No insights found matching your exploration.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.02] overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-[40rem] font-display font-black">ARCHIVE</div>
        </div>
      </div>
    </motion.div>
  );
};
