import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Share2, Bookmark, Clock, ChevronRight, Linkedin, Mail } from 'lucide-react';
import { Logo } from './Logo';
import { BlockReveal } from './BlockReveal';

interface ArticleViewProps {
  onClose: () => void;
  onStartConversation?: () => void;
  isDarkMode: boolean;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ onClose, onStartConversation, isDarkMode }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      role="dialog"
      aria-modal="true"
      aria-label="Article: The New Sustainability Reality"
      className="fixed inset-0 z-[110] bg-athena-cream dark:bg-athena-surface overflow-hidden antialiased text-athena-navy dark:text-[#E8E6E3]"
    >
      <div 
        data-lenis-prevent
        className="h-full w-full overflow-y-auto scrollbar-hide overscroll-contain touch-pan-y"
        style={{ WebkitOverflowScrolling: 'touch', overscrollBehaviorY: 'contain' }}
      >
        {/* Top Navigation */}
        <nav className="sticky top-0 z-50 bg-athena-cream/80 dark:bg-athena-surface/80 backdrop-blur-md border-b border-athena-navy/5 px-6 py-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <motion.button 
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 520, damping: 16 }}
              className="flex items-center gap-2 text-athena-navy dark:text-athena-peach font-bold text-xs uppercase tracking-[0.16em] hover:opacity-75 transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#66aba5] dark:focus-visible:ring-[#88c9c4] focus-visible:outline-none px-2 py-1 rounded-md"
            >
              <ArrowLeft size={18} /> Back to Insights
            </motion.button>
            
            <div className="flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-athena-navy dark:text-athena-peach hover:bg-athena-navy/5 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-[#66aba5] dark:focus-visible:ring-[#88c9c4] focus-visible:outline-none"
              >
                <Bookmark size={18} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-athena-navy dark:text-athena-peach hover:bg-athena-navy/5 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-[#66aba5] dark:focus-visible:ring-[#88c9c4] focus-visible:outline-none"
              >
                <Share2 size={18} />
              </motion.button>
            </div>
          </div>
        </nav>

        <article className="max-w-4xl mx-auto px-6 py-12 md:py-24">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="bg-athena-peach text-athena-navy text-[10px] font-bold font-mono tracking-widest px-3 py-1 rounded-full uppercase">
              SUSTAINABILITY
            </span>
            <span className="flex items-center gap-1.5 text-athena-navy/40 dark:text-athena-peach/40 font-mono text-[10px] font-bold uppercase tracking-widest">
              <Clock size={12} /> 4 MIN READ
            </span>
            <span className="text-athena-navy/40 dark:text-athena-peach/40 font-mono text-[10px] font-bold uppercase tracking-widest">
              MAY 14, 2026
            </span>
          </div>

          {/* Header */}
          <header className="mb-16">
            <BlockReveal color="var(--athena-peach-bright)">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium text-athena-navy dark:text-athena-peach tracking-tighter leading-[1.05] mb-8">
                The New Sustainability Reality: What Boards Need to Know Now
              </h1>
            </BlockReveal>
            <p className="text-xl md:text-2xl font-jakarta font-light text-athena-navy/70 dark:text-athena-peach/70 leading-relaxed max-w-2xl">
              The world that shaped corporate sustainability strategies no longer exists. What remains is a landscape defined by collision.
            </p>
          </header>

          {/* Hero Image */}
          <div className="relative aspect-[16/9] mb-16 rounded-[40px] overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600" 
              alt="Global Connections"
              className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-athena-navy/20" />
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert prose-headings:font-display prose-headings:font-medium prose-p:font-jakarta prose-p:font-light prose-p:leading-relaxed max-w-none text-athena-navy/80 dark:text-athena-peach/80">
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-athena-navy dark:text-athena-peach mt-12 mb-6">
              A world where everything is connected — and everyone is exposed
            </h2>

            <h3 className="text-xl font-bold mb-4">The End of the Old Sustainability Story</h3>
            
            <p className="mb-6">
              Businesses today operate in a deeply interconnected environment defined by volatility, disruption and accelerating system pressures. The world that shaped corporate sustainability strategies no longer exists. The assumptions that underpinned them — predictable policy, steady markets, linear transitions, stable geopolitics — have collapsed. What remains is a landscape defined by collision: <span className="italic">“geopolitical shifts, economic constraints and technological disruptions colliding with the pressures from climate change, nature loss and socioeconomic fragmentation”</span>, leaving companies exposed to uncertainty and risk.
            </p>

            <div className="my-12 p-8 border-l-4 border-athena-peach bg-athena-peach/5 rounded-r-3xl">
              <p className="text-xl md:text-2xl font-medium text-athena-navy dark:text-athena-peach italic">
                "This is not a temporary disruption. It is the new operating system of the global economy."
              </p>
            </div>

            <p className="mb-6">
              Companies are discovering that the sustainability ambitions they set five or ten years ago were built for a world of direction, not disorder. Boards and CFOs now face the hard edge of delivery: insufficient infrastructure, expensive technologies, fragmented supply chain data, uncertain premiums, and markets that reward sustainability rhetorically but buy on cost. 
            </p>
            
            <p className="mb-12">
              Meanwhile, the physical world is shifting faster than the political one. <span className="font-bold">“Over two thirds of companies worldwide were affected by physical climate events in 2025”</span>. The planet is on track for 2.3°C by 2040. The economic consequences are not abstract — they are balance sheet events.
            </p>

            <div className="h-px w-full bg-athena-navy/5 my-12" />

            <h3 className="text-2xl font-bold mb-6">Sustainability has become a competition — and most companies are unprepared</h3>
            
            <p className="mb-6">
              Executives sense the shift. They are speaking less about sustainability, but acting more. The majority of organisations plan to sustain or increase sustainability spending — but the motivation has changed. Sustainability is no longer a moral narrative or a compliance exercise. It is a fight for advantage.
            </p>

            <p className="mb-6">
              The winners are not the companies with the longest reports. They are the ones that understand sustainability as a commercial weapon: a way to shape markets, secure supply, build resilience, reduce cost, and create products customers actually want. They see sustainability as inseparable from geopolitics, technology, economics and competition. They treat it as strategy, not signalling.
            </p>

            <p className="mb-12 text-athena-peach font-bold uppercase tracking-widest text-sm">
              Those still treating sustainability as a parallel universe — a separate team, a separate language, a separate set of KPIs — have to change fast.
            </p>

            <h3 className="text-2xl font-bold mb-6">The capability gap is now the biggest strategic risk</h3>
            
            <p className="mb-6">
              Most organisations already have the technical ingredients for transition. What they lack is the integration, ownership and leadership capacity to use them. Companies need <span className="italic">“commercially savvy sustainability teams and sustainability-literate business leaders”</span> — and they don’t have them at scale.
            </p>

            <p className="mb-12 font-display text-4xl text-athena-navy/90 dark:text-athena-peach/90 leading-tight">
              This is the real bottleneck. Not frameworks. Not data. Not technology. <span className="text-athena-peach">Capability.</span>
            </p>

            <div className="bg-athena-navy text-athena-cream p-10 rounded-[40px] mb-12">
              <h4 className="text-xl font-bold mb-6 text-athena-peach">Boards are asking sharper questions because they have no choice:</h4>
              <ul className="space-y-4">
                {[
                  "Where is the value — and how do we quantify it?",
                  "What do we stop doing?",
                  "How do we compete in markets that are fragmenting?",
                  "How exposed are our assets and supply chains?",
                  "How do we build resilience while cutting cost?",
                  "How do we innovate for different customer groups?"
                ].map((q, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-athena-peach mt-2 shrink-0" />
                    <p className="text-lg font-light">{q}</p>
                  </li>
                ))}
              </ul>
            </div>

            <h3 className="text-2xl font-bold mb-6">Organisations are already behaving differently</h3>
            
            <p className="mb-6">
              They are not waiting for perfect data or perfect policy. They are not paralysed by the ESG backlash. They are not trying to please everyone. They are making hard choices.
            </p>

            <p className="mb-12">
              They are focusing on the parts of sustainability that create real commercial leverage: products, markets, supply chains, resilience, cost, innovation. They are building capabilities across the business, not concentrating them in a central team. They are aligning sustainability with strategy, not bolting it on.
            </p>

            {/* CTA / Final Section */}
            <section className="bg-athena-peach/10 p-12 rounded-[40px] border border-athena-peach/20 my-16">
              <Logo size={40} color="var(--athena-peach)" className="mb-8" />
              <h3 className="text-3xl md:text-4xl font-display font-medium text-athena-navy dark:text-athena-peach mb-6">
                This is the world Athena was built for
              </h3>
              <p className="text-lg font-light mb-6">
                Athena exists because boards and executives need a different kind of partner — one that understands the collision of systems shaping their world and can translate it into strategy, capability and value.
              </p>
              <p className="text-lg font-light mb-8">
                We help organisations focus — on the initiatives that create value, not the noise that destroys it. We help them build the capabilities they don’t yet have but urgently need.
              </p>
              <button 
                className="px-8 py-4 bg-athena-navy text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-athena-peach transition-all"
                onClick={() => {
                  if (onStartConversation) {
                    onStartConversation();
                  } else {
                    onClose();
                    const contact = document.getElementById('contact');
                    if (contact) contact.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Start the Conversation
              </button>
            </section>

            <footer className="mt-24 pt-12 border-t border-athena-navy/10 flex flex-col md:flex-row justify-between items-start gap-8 pb-12">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-athena-navy/40 mb-2">WRITTEN BY</p>
                <p className="font-display font-medium text-lg text-athena-navy dark:text-athena-peach">Athena Intelligence Team</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-athena-navy/40 mb-2">CATEGORY</p>
                <p className="font-display font-medium text-lg text-athena-navy dark:text-athena-peach">Strategic Insight</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-athena-navy/40 mb-2">SHARE</p>
                <div className="flex gap-4">
                  <Linkedin size={20} className="text-athena-navy/60 hover:text-athena-peach cursor-pointer" />
                  <Mail size={20} className="text-athena-navy/60 hover:text-athena-peach cursor-pointer" />
                </div>
              </div>
            </footer>
          </div>
        </article>

        {/* Decorative background element */}
        <div className="fixed -bottom-48 -right-48 opacity-[0.03] rotate-12 pointer-events-none">
          <Logo size={800} color="var(--athena-navy)" />
        </div>
      </div>
    </motion.div>

  );
};
