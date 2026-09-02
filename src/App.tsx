import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue, useInView, useVelocity } from 'motion/react';
import { X, ArrowRight, ChevronRight, ChevronDown, Mail, Linkedin, Globe, Shield, Zap, Users, BookOpen, Target, BarChart3, Info, RotateCcw, RotateCw, Circle, Contrast, MapPin, Phone, Cookie, ArrowUpRight } from 'lucide-react';
import Lenis from 'lenis';
import { Logo } from './components/Logo';
import { SearchLens } from './components/SearchLens';
import GlobalRiskGlobe from './components/GlobalRiskGlobe';
import { ThoughtLeadershipAccordion } from './components/ThoughtLeadershipAccordion';
import { ArticleView } from './components/ArticleView';
import { ArchiveView } from './components/ArchiveView';
import { BlockReveal } from './components/BlockReveal';
import { Footnote } from './components/Footnote';
import { ScrollTiedReveal } from './components/ScrollTiedReveal';
import { TypewriterText } from './components/TypewriterText';
import { UnsubscribeForm } from './components/UnsubscribeForm';
import RotatingText from './components/RotatingText';
import { LabelSlideButton } from './components/LabelSlideButton';

// Toggle to show/hide the Thought Leadership section and navigation links
export const SHOW_THOUGHT_LEADERSHIP = false;

// --- Components ---

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  lowResSrc?: string;
  className?: string;
  alt?: string;
}

const ProgressiveImage = ({ src, lowResSrc, className = "", alt, ...props }: ProgressiveImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const placeholder = lowResSrc || (src.includes('unsplash.com') ? src.replace(/w=\d+/, 'w=50').replace(/q=\d+/, 'q=10') : src);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-athena-peach/10 animate-pulse pointer-events-none" />
      )}
      {!isLoaded && (
        <img
          src={placeholder}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 transition-opacity duration-700 pointer-events-none"
          referrerPolicy="no-referrer"
        />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`transition-all duration-700 ease-out object-cover w-full h-full ${
          isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-105 pointer-events-none'
        }`}
        referrerPolicy="no-referrer"
        {...props}
      />
    </div>
  );
};

const CursorBeacon = () => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasHover = window.matchMedia('(hover: hover)').matches;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setShouldRender(hasHover && !prefersReduced);
    }
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const beaconX = useSpring(mouseX, { stiffness: 40, damping: 22 });
  const beaconY = useSpring(mouseY, { stiffness: 40, damping: 22 });

  useEffect(() => {
    if (!shouldRender) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, shouldRender]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden mix-blend-screen opacity-15 dark:opacity-[0.08]" style={{ pointerEvents: 'none' }}>
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          x: beaconX,
          y: beaconY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(102,171,165,0.4) 0%, rgba(102,171,165,0) 70%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const RippleAnchor = ({ children, className = "", ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { id, x, y }]);
    
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <a
      {...props}
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-athena-peach-bright/40 animate-ripple pointer-events-none"
          style={{
            width: '12px',
            height: '12px',
            top: ripple.y - 6,
            left: ripple.x - 6,
          }}
        />
      ))}
      <span className="relative z-10 flex items-center justify-center w-full h-full">{children}</span>
    </a>
  );
};

const useScrollVelocitySkew = () => {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 120,
    damping: 25,
    mass: 0.1,
    restDelta: 0.001
  });

  // Scale velocity (range roughly -3000 to 3000 pixels/sec) to a vertical skew of -1deg to 1deg.
  return useTransform(smoothVelocity, [-3000, 3000], [-1, 1]);
};

const NoiseTexture = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <div 
    className="fixed inset-0 pointer-events-none z-[9999] mix-blend-overlay transition-opacity duration-1000"
    style={{ opacity: isDarkMode ? 0.015 : 0.01 }}
  >
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

const GooeyFilter = () => (
  <svg className="hidden">
    <defs>
      <filter id="goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </defs>
  </svg>
);

const IntelligenceLens = ({ isOpen }: { isOpen: boolean }) => {
  const [isScanningActive, setIsScanningActive] = useState(true);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[43] pointer-events-none overflow-hidden">
      {/* Scanning Line */}
      {isScanningActive && (
        <motion.div 
          initial={{ top: '-10%' }}
          animate={{ 
            top: ['-10%', '30%', '30%', '60%', '60%', '110%'],
            opacity: [0.1, 0.3, 0.3, 0.3, 0.3, 0.1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "linear",
            times: [0, 0.2, 0.3, 0.5, 0.6, 1]
          }}
          className="absolute left-0 right-0 h-[2px] bg-athena-peach/20 shadow-[0_0_20px_rgba(102,171,165,0.4)] z-10"
        />
      )}

      {/* Aura Effect: Highlighting keywords during scan */}
      {isScanningActive && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.08, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-athena-peach/[0.02] z-0"
        />
      )}
      
      {/* Floating Data Chips */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              x: (20 + (i * 6) % 70) + '%', 
              y: (15 + (i * 8) % 75) + '%' 
            }}
            animate={isScanningActive ? { 
              opacity: [0, 0.2, 0],
              y: [null, '-=60'],
              scale: [0.9, 1, 0.9]
            } : {
              opacity: 0.05,
              scale: 0.9
            }}
            transition={{ 
              duration: 5 + (i % 3) * 2, 
              repeat: isScanningActive ? Infinity : 0, 
              delay: (i % 4) * 1.2
            }}
            className="absolute p-2 sm:p-3 border border-athena-peach/10 bg-athena-surface/20 backdrop-blur-[2px] rounded-lg text-[8px] font-sans text-athena-peach/60 uppercase tracking-[0.2em] shadow-[0_0_10px_rgba(102,171,165,0.05)]"
          >
            {['DATA_SYNC', 'ANALYZING_RISK', 'CLIMATE_MODEL_V2', 'STRATEGIC_INTEL', 'RESILIENCE_INDEX', 'FUTURE_PROOF', 'ADAPT_V4'][i % 7]}
          </motion.div>
        ))}
      </div>

      <div className="absolute bottom-6 left-6 pointer-events-auto z-50">
        <button
          onClick={() => setIsScanningActive(!isScanningActive)}
          className="flex items-center gap-2 bg-athena-navy/80 hover:bg-athena-navy text-[#eaeaea] hover:text-white px-3 py-1.5 rounded-full border border-white/10 text-[9px] font-mono tracking-wider uppercase transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isScanningActive ? 'bg-emerald-400 animate-pulse' : 'bg-athena-peach-bright'}`} />
          {isScanningActive ? 'Pause Diagnostic Overlay' : 'Resume Diagnostic Overlay'}
        </button>
      </div>
    </div>
  );
};

// Memory fallbacks for localStorage and sessionStorage to guard against Incognito / private constraints
const memoryStorage: Record<string, string> = {};
const memorySessionStorage: Record<string, string> = {};

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      // Ignored
    }
    return memoryStorage[key] || null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      // Ignored
    }
    memoryStorage[key] = value;
  }
};

export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        return window.sessionStorage.getItem(key);
      }
    } catch (e) {
      // Ignored
    }
    return memorySessionStorage[key] || null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      // Ignored
    }
    memorySessionStorage[key] = value;
  }
};

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    // Check if user has already visited in this session using safeSessionStorage
    const hasVisited = safeSessionStorage.getItem('athena_preloader_seen');
    if (hasVisited) {
      setProgress(100);
      setIsLoaded(true);
      setMinTimeElapsed(true);
      onComplete();
      return;
    }

    // Minimum time to show the preloader animation
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
      safeSessionStorage.setItem('athena_preloader_seen', 'true');
    }, 2200);

    // Critical assets to preload
    const criticalAssets = [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1496096265110-f83ad7f96608?",
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?",
      "https://plus.unsplash.com/premium_photo-1664300255663-41d18cf0f03e?",
      "https://images.unsplash.com/photo-1768055104929-cf2317674a80?"
    ];

    let loadedCount = 0;
    const totalToLoad = criticalAssets.length + 1; // +1 for window.onload

    const updateProgress = () => {
      loadedCount++;
      const newProgress = (loadedCount / totalToLoad) * 100;
      setProgress(newProgress);
      if (loadedCount >= totalToLoad) {
        setIsLoaded(true);
      }
    };

    // Preload images
    criticalAssets.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = updateProgress;
      img.onerror = updateProgress;
    });

    // Window onload
    if (document.readyState === 'complete') {
      updateProgress();
    } else {
      window.addEventListener('load', updateProgress);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', updateProgress);
    };
  }, []);

  useEffect(() => {
    if (isLoaded && minTimeElapsed) {
      onComplete();
    }
  }, [isLoaded, minTimeElapsed, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[10000] bg-athena-cream flex items-center justify-center"
    >
      <div className="relative flex flex-col items-center">
        <div className="relative mb-8">
          <motion.svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Central circle */}
            <motion.circle
              cx="60"
              cy="60"
              r="10"
              stroke="var(--athena-peach)"
              strokeWidth="4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            
            {/* Hexagonal circles */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const innerDist = 22;
              const outerDist = 44;
              
              const ix = 60 + innerDist * Math.cos(rad);
              const iy = 60 + innerDist * Math.sin(rad);
              const ox = 60 + outerDist * Math.cos(rad);
              const oy = 60 + outerDist * Math.sin(rad);
              
              return (
                <React.Fragment key={angle}>
                  <motion.circle
                    cx={ix}
                    cy={iy}
                    r="10"
                    fill="var(--athena-peach)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + (i * 0.1), duration: 0.5, type: "spring" }}
                  />
                  <motion.circle
                    cx={ox}
                    cy={oy}
                    r="10"
                    fill="var(--athena-peach)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 + (i * 0.1), duration: 0.5, type: "spring" }}
                  />
                </React.Fragment>
              );
            })}
          </motion.svg>
        </div>
        <div className="overflow-hidden">
          <motion.p
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
            className="text-athena-navy font-sans font-bold uppercase tracking-[0.4em] text-[10px]"
          >
            Athena Resilience Group
          </motion.p>
        </div>
        
        {/* Progress bar */}
        <div className="absolute -bottom-12 w-48 h-[1px] bg-athena-navy/10 overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-y-0 left-0 bg-athena-peach"
          />
        </div>
      </div>
    </motion.div>
  );
};

const CustomCursor = () => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasHover = window.matchMedia('(hover: hover)').matches;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setShouldRender(hasHover && !prefersReduced);
    }
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(mouseY, { stiffness: 500, damping: 28 });
  
  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { stiffness: 300, damping: 20 });
  
  const bgOpacity = useMotionValue(0);
  const springBgOpacity = useSpring(bgOpacity, { stiffness: 300, damping: 20 });
  
  const [isHovering, setIsHovering] = useState(false);
  const cursorBg = useTransform(springBgOpacity, [0, 1], ["rgba(102, 171, 165, 0)", "rgba(102, 171, 165, 0.2)"]);

  useEffect(() => {
    if (!shouldRender) return;
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('button, a, .interactive, .cursor-pointer');
      
      if (interactive) {
        const rect = interactive.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Magnetic pull when within 20px of the button
        const distanceX = Math.abs(e.clientX - centerX);
        const distanceY = Math.abs(e.clientY - centerY);
        
        if (distanceX < 40 && distanceY < 40) {
          mouseX.set(centerX + (e.clientX - centerX) * 0.3);
          mouseY.set(centerY + (e.clientY - centerY) * 0.3);
          scale.set(2.5);
          bgOpacity.set(0.15);
          setIsHovering(true);
          return;
        }
      }
      
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      scale.set(1);
      bgOpacity.set(0);
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY, scale, bgOpacity, shouldRender]);

  if (!shouldRender) return null;

  return (
    <motion.div
      className={`fixed top-0 left-0 w-8 h-8 border rounded-full pointer-events-none z-[9999] hidden lg:flex items-center justify-center transition-colors duration-300 ${isHovering ? 'border-athena-peach bg-athena-peach/10' : 'border-athena-peach/30'}`}
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
        scale: springScale,
        backgroundColor: cursorBg,
        pointerEvents: 'none'
      }}
    >
      {isHovering && (
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-1 h-1 bg-athena-peach rounded-full"
        />
      )}
    </motion.div>
  );
};

const Magnetic = ({ children, strength = 0.5 }: { children: React.ReactNode, strength?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Throttling effectively by using requestAnimationFrame via useMotionValue
    x.set((clientX - centerX) * strength);
    y.set((clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="w-fit h-fit"
    >
      {children}
    </motion.div>
  );
};

const TextReveal = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const words = typeof children === 'string' ? children.split(' ') : [];
  
  return (
    <div className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="text-reveal-mask mr-[0.2em] mb-[0.1em]">
          <motion.span
            initial={{ y: '100%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.8, 
              delay: i * 0.02, 
              ease: [0.215, 0.61, 0.355, 1] 
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const color = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8],
    ['#66aba5', '#152532', '#5A5A40', '#66aba5']
  );

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
      style={{ scaleX, backgroundColor: color }}
    />
  );
};

const Navbar = ({ 
  isDarkMode, 
  toggleDarkMode, 
  isSearchOpen, 
  setIsSearchOpen,
  setShowLeadership,
  setShowTeam,
  setShowPartners
}: { 
  isDarkMode: boolean, 
  toggleDarkMode: (event?: React.MouseEvent) => void,
  isSearchOpen: boolean,
  setIsSearchOpen: (val: boolean) => void,
  setShowLeadership: (val: boolean) => void,
  setShowTeam: (val: boolean) => void,
  setShowPartners: (val: boolean) => void
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [shouldUseBlur, setShouldUseBlur] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasHover = window.matchMedia('(hover: hover)').matches;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setShouldUseBlur(hasHover && !prefersReduced);
    }
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isWhoWeAreHovered, setIsWhoWeAreHovered] = useState(false);
  const [isWhatWeDoHovered, setIsWhatWeDoHovered] = useState(false);
  const [mobileWhoWeAreExpanded, setMobileWhoWeAreExpanded] = useState(false);
  const [mobileWhatWeDoExpanded, setMobileWhatWeDoExpanded] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (!mobileMenuOpen) {
      setMobileWhoWeAreExpanded(false);
      setMobileWhatWeDoExpanded(false);
    }
  }, [mobileMenuOpen]);

  const scrollToIdWithOffset = (id: string) => {
    if (id === 'leadership' || id === 'advisors' || id === 'partners') {
      navigateTo(id);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const rect = element.getBoundingClientRect();
      const targetY = rect.top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0% -40% 0%',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['hero', 'about', 'how-we-work', 'process', ...(SHOW_THOUGHT_LEADERSHIP ? ['thought-leadership'] : []), 'contact'];
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<{title: string, section: string, category: string, id: string}[]>([]);

  const searchIndex = [
    { title: "Strategic Horizon Scanning", section: "What we do", category: "Expertise", id: "process", keywords: ["future", "trends", "threats", "foresight"] },
    { title: "Board & CEO Advisory", section: "What we do", category: "Expertise", id: "process", keywords: ["coaching", "governance", "leadership", "executive"] },
    { title: "Transition Leadership", section: "What we do", category: "Expertise", id: "process", keywords: ["management", "change", "implementation"] },
    { title: "Stress-testing & Alignment", section: "What we do", category: "Expertise", id: "process", keywords: ["resilience", "robustness", "scenario"] },
    { title: "Commercialising Sustainability", section: "What we do", category: "Expertise", id: "process", keywords: ["esg", "value", "profit", "impact"] },
    { title: "ESG & Resilience for Boards", section: "What we do", category: "Expertise", id: "process", keywords: ["reporting", "compliance", "boardroom"] },
    { title: "Our Unique Model", section: "Who we are", category: "Agency", id: "about", keywords: ["purpose", "vision", "approach", "model", "pillars"] },
    { title: "Leadership Team", section: "Who we are", category: "Agency", id: "leadership", keywords: ["management", "executives", "directors"] },
    { title: "Board of Advisors", section: "Who we are", category: "Agency", id: "advisors", keywords: ["experts", "council", "network"] },
    { title: "Our Strategic Partners", section: "Who we are", category: "Agency", id: "partners", keywords: ["collaborators", "ecosystem", "network"] },
    ...(SHOW_THOUGHT_LEADERSHIP ? [
      { title: "Thought Leadership", section: "Intelligence", category: "Insights", id: "thought-leadership", keywords: ["articles", "reports", "papers"] },
      { title: "Geopolitical Insight", section: "Intelligence", category: "Insights", id: "thought-leadership", keywords: ["global", "policy", "security"] },
      { title: "Quantum Dominance", section: "Intelligence", category: "Insights", id: "thought-leadership", keywords: ["tech", "ai", "future"] },
    ] : []),
    { title: "Contact Us", section: "Connect", category: "Agency", id: "contact", keywords: ["email", "inquiry", "meeting"] },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 1) {
      const q = query.toLowerCase();
      const filtered = searchIndex.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.section.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.keywords?.some(k => k.toLowerCase().includes(q))
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  const navigateTo = (id: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setResults([]);
    
    // Handle special modal targets
    if (id === 'leadership') {
      setShowLeadership(true);
      return;
    }
    if (id === 'advisors') {
      setShowTeam(true); // Advisors in this app is controlled by setShowTeam
      return;
    }
    if (id === 'partners') {
      setShowPartners(true);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (!isSearchOpen) {
      setSearchQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  const navLinks = [
    { name: 'Who we are', href: '#about' },
    { name: "What we bring", href: '#how-we-work' },
    { name: 'What we do', href: '#process' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-2 left-0 right-0 z-50 px-6 pointer-events-none">
      <div className={`max-w-7xl mx-auto px-8 flex items-center justify-between transition-all duration-500 pointer-events-auto rounded-full border border-athena-navy/10 shadow-2xl relative overflow-visible ${
        isScrolled 
          ? `py-1 ${shouldUseBlur ? 'bg-athena-surface/85 backdrop-blur-[12px]' : 'bg-athena-surface/98'} scale-[0.985] mt-1` 
          : `py-2.5 ${shouldUseBlur ? 'bg-athena-surface/65 backdrop-blur-[6px]' : 'bg-athena-surface/90'} scale-100`
      }`}>

        
        <a href="#" className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach focus-visible:ring-offset-2 rounded-full">
          <Logo size={28} color="var(--athena-navy)" className="group-hover:rotate-12 transition-transform duration-500" />
          <span className="font-sans font-bold text-sm tracking-tight uppercase text-athena-navy">
            <span className="md:hidden">Athena</span>
            <span className="hidden md:inline">Athena Resilience Group</span>
          </span>
        </a>

        <div className="hidden xl:flex items-center gap-10">
          {navLinks.map((link, i) => {
            const isActive = activeSection === link.href.substring(1);
            if (link.name === 'Who we are') {
              return (
                <div 
                  key={`nav-desktop-${link.name}`}
                  className="relative pointer-events-auto py-2"
                  onMouseEnter={() => setIsWhoWeAreHovered(true)}
                  onMouseLeave={() => setIsWhoWeAreHovered(false)}
                >
                  <a 
                    href={link.href} 
                    onClick={(e) => {
                      e.preventDefault();
                      window.dispatchEvent(new CustomEvent('athena:reset-accordions'));
                      scrollToIdWithOffset('about');
                    }}
                    className="relative text-xs font-sans font-bold tracking-widest uppercase transition-all duration-300 inline-block link-swipe focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach focus-visible:ring-offset-2 rounded"
                  >
                    <span 
                      className={`transition-colors duration-300 ${isActive ? 'text-athena-peach' : 'text-athena-navy/80 hover:text-athena-navy font-semibold'} inline-flex items-center gap-1`}
                    >
                      {link.name}
                      <span className="text-[10px] opacity-65 font-medium translate-y-[0.5px] select-none">&gt;</span>
                    </span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeNav"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-athena-peach rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>

                  <AnimatePresence>
                    {isWhoWeAreHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-athena-surface border border-athena-navy/10 rounded-2xl shadow-xl p-3 min-w-[200px] z-50 flex flex-col gap-2 backdrop-blur-md"
                      >
                        <button
                          onClick={() => {
                            setIsWhoWeAreHovered(false);
                            scrollToIdWithOffset('our-team');
                          }}
                          className="text-left text-[11px] font-sans font-bold tracking-wider uppercase text-athena-navy/80 hover:text-athena-peach transition-colors py-2 px-3 rounded-xl hover:bg-athena-navy/5 duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach rounded"
                        >
                          our team
                        </button>
                        <button
                          onClick={() => {
                            setIsWhoWeAreHovered(false);
                            scrollToIdWithOffset('unique-model');
                          }}
                          className="text-left text-[11px] font-sans font-bold tracking-wider uppercase text-athena-navy/80 hover:text-athena-peach transition-colors py-2 px-3 rounded-xl hover:bg-athena-navy/5 duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach rounded"
                        >
                          our unique model
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            if (link.name === 'What we do' && SHOW_THOUGHT_LEADERSHIP) {
              return (
                <div 
                  key={`nav-desktop-${link.name}`}
                  className="relative pointer-events-auto py-2"
                  onMouseEnter={() => setIsWhatWeDoHovered(true)}
                  onMouseLeave={() => setIsWhatWeDoHovered(false)}
                >
                  <a 
                    href={link.href} 
                    onClick={(e) => {
                      e.preventDefault();
                      window.dispatchEvent(new CustomEvent('athena:reset-accordions'));
                      scrollToIdWithOffset('process');
                    }}
                    className="relative text-xs font-sans font-bold tracking-widest uppercase transition-all duration-300 inline-block link-swipe focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach focus-visible:ring-offset-2 rounded"
                  >
                    <span 
                      className={`transition-colors duration-300 ${isActive ? 'text-athena-peach' : 'text-athena-navy/80 hover:text-athena-navy font-semibold'} inline-flex items-center gap-1`}
                    >
                      {link.name}
                      <span className="text-[10px] opacity-65 font-medium translate-y-[0.5px] select-none">&gt;</span>
                    </span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeNav"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-athena-peach rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>

                  <AnimatePresence>
                    {isWhatWeDoHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-athena-surface border border-athena-navy/10 rounded-2xl shadow-xl p-3 min-w-[200px] z-50 flex flex-col gap-2 backdrop-blur-md"
                      >
                        <button
                          onClick={() => {
                            setIsWhatWeDoHovered(false);
                            scrollToIdWithOffset('process');
                          }}
                          className="text-left text-[11px] font-sans font-bold tracking-wider uppercase text-athena-navy/80 hover:text-athena-peach transition-colors py-2 px-3 rounded-xl hover:bg-athena-navy/5 duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach rounded"
                        >
                          services
                        </button>
                        <button
                          onClick={() => {
                            setIsWhatWeDoHovered(false);
                            scrollToIdWithOffset('thought-leadership');
                          }}
                          className="text-left text-[11px] font-sans font-bold tracking-wider uppercase text-athena-navy/80 hover:text-athena-peach transition-colors py-2 px-3 rounded-xl hover:bg-athena-navy/5 duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach rounded"
                        >
                          thought leadership
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <motion.a 
                key={`nav-desktop-${link.name}`} 
                href={link.href} 
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('athena:reset-accordions'));
                  scrollToIdWithOffset(link.href.substring(1));
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                className="relative text-xs font-sans font-bold tracking-widest uppercase transition-all duration-300 pointer-events-auto link-swipe focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach focus-visible:ring-offset-2 rounded"
              >
                <span 
                  className={`transition-colors duration-300 ${isActive ? 'text-athena-peach' : 'text-athena-navy/80 hover:text-athena-navy font-semibold'}`}
                >
                  {link.name}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-athena-peach rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.a>
            );
          })}
          
          <div className="flex items-center gap-4">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-athena-navy/5 rounded-full transition-colors duration-300 pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach focus-visible:ring-offset-2"
            >
              {isSearchOpen ? <X size={20} className="text-athena-peach" /> : <SearchLens size={20} color="var(--athena-peach)" />}
            </motion.button>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              onClick={(e) => toggleDarkMode(e)}
              className="p-2 hover:bg-athena-navy/5 rounded-full transition-colors duration-300 pointer-events-auto text-athena-peach focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach focus-visible:ring-offset-2"
            >
              {isDarkMode ? <Circle size={20} fill="currentColor" /> : <Contrast size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 xl:hidden">
          <button className="text-athena-navy p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach rounded-full" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            {isSearchOpen ? <X size={20} className="text-athena-peach" /> : <SearchLens size={20} color="var(--athena-peach)" />}
          </button>
          <button className="text-athena-peach p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach rounded-full" onClick={(e) => toggleDarkMode(e)}>
            {isDarkMode ? <Circle size={20} fill="currentColor" /> : <Contrast size={20} />}
          </button>
          <button className="text-athena-navy p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach rounded-full" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <X size={20} />
            ) : (
              <div className="grid grid-cols-2 gap-1 rotate-45">
                <div className="w-1.5 h-1.5 rounded-full bg-athena-peach" />
                <div className="w-1.5 h-1.5 rounded-full bg-athena-peach" />
                <div className="w-1.5 h-1.5 rounded-full bg-athena-peach" />
                <div className="w-1.5 h-1.5 rounded-full bg-athena-peach" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: searchQuery.length > 1 ? (results.length > 0 ? Math.min(450, 200 + results.length * 60) : 220) : 205, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-7xl bg-athena-surface z-40 pointer-events-auto border border-athena-navy/10 overflow-hidden rounded-[40px] shadow-2xl"
          >
            <div className="max-w-7xl mx-auto px-8 h-full flex flex-col justify-start pt-10 pb-8 relative">
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-8 right-8 p-2 hover:bg-athena-navy/5 rounded-full transition-colors z-50 text-athena-navy"
              >
                <X size={20} className="opacity-40" />
              </button>
              
              <div className="max-w-4xl w-full">
                <motion.p 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-athena-peach font-accent font-bold uppercase tracking-[0.2em] text-[10px] mb-2"
                >
                  Search inside Athena
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative group mb-6"
                >
                  <input 
                    autoFocus
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Type to search..."
                    className="w-full bg-transparent border-b border-athena-navy/10 py-2 text-2xl md:text-3xl font-sans font-bold text-athena-navy placeholder:text-athena-navy/10 focus:outline-none focus:border-athena-peach transition-all duration-500"
                  />
                  <div className="absolute right-0 bottom-2">
                    <SearchLens size={24} color="var(--athena-peach)" className="opacity-40 group-focus-within:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
                
                <AnimatePresence>
                  {searchQuery.length > 1 && (
                    <motion.div
                      style={{ filter: 'url(#goo)' }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="space-y-2 overflow-y-auto max-h-[250px] pr-4 custom-scrollbar"
                    >
                      {results.length > 0 ? (
                        results.map((result, index) => (
                           <motion.button
                            key={`${result.id}-${index}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => navigateTo(result.id)}
                            className="w-full group flex items-center justify-between p-4 rounded-2xl hover:bg-athena-navy/5 transition-all text-left"
                          >
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-athena-peach px-1.5 py-0.5 rounded-md bg-athena-peach/10">{result.category}</span>
                                <span className="text-[9px] font-medium uppercase tracking-widest text-athena-navy/40">{result.section}</span>
                              </div>
                              <h4 className="text-lg font-sans font-bold text-athena-navy group-hover:text-athena-peach transition-colors">{result.title}</h4>
                            </div>
                            <ArrowRight size={20} className="text-athena-peach opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                          </motion.button>
                        ))
                      ) : (
                        <div className="py-8 text-center">
                          <p className="text-athena-navy/40 font-jakarta font-medium italic">No matches found for "{searchQuery}"</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {searchQuery.length <= 1 && (
                  <div className="flex flex-col gap-3 mt-4 text-left">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-wrap items-center gap-4"
                    >
                      <span className="text-[9px] font-bold uppercase tracking-widest text-athena-navy/40 select-none">Quick Links:</span>
                      {['Leadership', 'Articles', 'ESG', 'Contact'].map((tag) => (
                        <button 
                          key={tag} 
                          onClick={() => handleSearch(tag)}
                          className="text-[9px] font-bold uppercase tracking-widest text-athena-navy/60 hover:text-athena-peach transition-colors cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                      className="flex flex-wrap items-center gap-2"
                    >
                      <span className="text-[9px] font-bold uppercase tracking-widest text-athena-navy/40 select-none">Featured Themes:</span>
                      {[
                        { label: '#GeopoliticalRisk', value: 'Geopolitical' },
                        { label: '#ClimateEconomics', value: 'Climate' },
                        { label: '#CircularBusiness', value: 'Circular' },
                        { label: '#AIGovernance', value: 'AI' }
                      ].map((chip) => (
                        <button 
                          key={chip.label} 
                          onClick={() => handleSearch(chip.value)}
                          className="px-3 py-1 bg-athena-peach/10 hover:bg-athena-peach hover:text-athena-navy rounded-full text-[9px] font-mono font-bold tracking-wider border border-athena-peach/20 hover:border-athena-peach text-athena-peach transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu - Full Screen Editorial Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            style={{ filter: 'url(#goo)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-athena-surface z-[60] flex flex-col xl:hidden pointer-events-auto"
          >
            {/* Background Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
              <Logo size={600} color="var(--athena-navy)" />
            </div>

            {/* Header in Menu */}
            <div className="flex items-center justify-between px-10 py-8 landscape:py-4 landscape:px-10 border-b border-athena-navy/5">
              <div className="flex items-center gap-3">
                <Logo size={28} color="var(--athena-navy)" />
                <span className="font-sans font-bold text-sm tracking-tight uppercase text-athena-navy">
                  Athena
                </span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-athena-navy group"
              >
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Close</span>
                <X size={20} />
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex-grow flex flex-col justify-center px-12 gap-6 md:gap-10 landscape:gap-4 landscape:px-12">
              {navLinks.map((link, i) => {
                const isActive = activeSection === link.href.substring(1);
                const isWhoWeAre = link.name === 'Who we are';
                return (
                  <div key={`nav-mobile-${link.name}`} className="flex flex-col gap-2">
                    <div className="flex items-center justify-start gap-2">
                      <motion.a 
                        href={link.href} 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
                        onClick={(e) => {
                          e.preventDefault();
                          setMobileMenuOpen(false);
                          window.dispatchEvent(new CustomEvent('athena:reset-accordions'));
                          scrollToIdWithOffset(link.href.substring(1));
                        }}
                        className="group flex items-baseline gap-4 landscape:gap-2"
                      >
                        <span className="text-[10px] font-mono opacity-20 group-hover:opacity-100 transition-opacity">0{i + 1}</span>
                        <span className={`text-3xl sm:text-4xl md:text-6xl landscape:text-3xl font-display font-medium tracking-tighter transition-all duration-500 ${isActive ? 'text-athena-peach' : 'text-athena-navy hover:pl-4'}`}>
                          {link.name}
                        </span>
                      </motion.a>

                      {(link.name === 'Who we are' || (link.name === 'What we do' && SHOW_THOUGHT_LEADERSHIP)) && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (link.name === 'Who we are') {
                              setMobileWhoWeAreExpanded(!mobileWhoWeAreExpanded);
                            } else {
                              setMobileWhatWeDoExpanded(!mobileWhatWeDoExpanded);
                            }
                          }}
                          className="p-1 px-2.5 md:p-1.5 rounded-full hover:bg-athena-navy/5 text-athena-navy/60 hover:text-athena-peach transition-all flex items-center justify-center cursor-pointer select-none self-center"
                          aria-label={`Toggle ${link.name} subcategories`}
                        >
                          <span className={`text-base sm:text-lg md:text-2xl font-bold leading-none select-none transform transition-transform duration-300 ${
                            (link.name === 'Who we are' && mobileWhoWeAreExpanded) || (link.name === 'What we do' && mobileWhatWeDoExpanded)
                              ? 'rotate-90 text-athena-peach'
                              : 'rotate-0'
                          }`}
                          style={{ display: 'inline-block', transformOrigin: 'center' }}
                          >
                            &gt;
                          </span>
                        </button>
                      )}
                    </div>

                    <AnimatePresence initial={false}>
                      {isWhoWeAre && mobileWhoWeAreExpanded && (
                        <motion.div 
                          key="mobile-who-we-are"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="flex flex-col gap-3 pl-8 md:pl-16 mt-2 overflow-hidden"
                        >
                          <motion.button
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.05, duration: 0.3 }}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              scrollToIdWithOffset('our-team');
                            }}
                            className="text-left text-xl sm:text-[26px] md:text-[50px] landscape:text-[20px] font-display font-light text-athena-navy/70 hover:text-athena-peach transition-colors"
                          >
                            our team
                          </motion.button>
                          <motion.button
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              scrollToIdWithOffset('unique-model');
                            }}
                            className="text-left text-xl sm:text-[26px] md:text-[50px] landscape:text-[20px] font-display font-light text-athena-navy/70 hover:text-athena-peach transition-colors"
                          >
                            our unique model
                          </motion.button>
                        </motion.div>
                      )}

                      {link.name === 'What we do' && SHOW_THOUGHT_LEADERSHIP && mobileWhatWeDoExpanded && (
                        <motion.div 
                          key="mobile-what-we-do"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="flex flex-col gap-3 pl-8 md:pl-16 mt-2 overflow-hidden"
                        >
                          <motion.button
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.05, duration: 0.3 }}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              scrollToIdWithOffset('process');
                            }}
                            className="text-left text-xl sm:text-[26px] md:text-[50px] landscape:text-[20px] font-display font-light text-athena-navy/70 hover:text-athena-peach transition-colors"
                          >
                            services
                          </motion.button>
                          <motion.button
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              scrollToIdWithOffset('thought-leadership');
                            }}
                            className="text-left text-xl sm:text-[26px] md:text-[50px] landscape:text-[20px] font-display font-light text-athena-navy/70 hover:text-athena-peach transition-colors"
                          >
                            thought leadership
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Footer in Menu */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="p-12 landscape:p-6 landscape:py-4 border-t border-athena-navy/5 grid grid-cols-2 gap-8 landscape:gap-4"
            >
              <div>
                <p className="text-[10px] font-accent font-bold uppercase tracking-widest text-athena-navy/40 mb-4 font-teko">Connect</p>
                <div className="flex gap-6">
                  <motion.a whileHover={{ y: -2 }} href="#" className="text-athena-navy/60 hover:text-athena-peach transition-colors">
                    <Linkedin size={20} />
                  </motion.a>
                  <motion.a whileHover={{ y: -2 }} href="mailto:info@athenaresiliencegroup.com" className="text-athena-navy/60 hover:text-athena-peach transition-colors">
                    <Mail size={20} />
                  </motion.a>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-accent font-bold uppercase tracking-widest text-athena-navy/40 mb-4 font-teko">Office</p>
                <p className="text-xs font-sans font-medium text-athena-navy/60 leading-relaxed">
                  Athens Business Hub24, Patision 75, 10434<br />
                  Athens, GR<br />
                  +30 697 199 4171
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ isDarkMode, isLoading }: { isDarkMode: boolean; isLoading: boolean }) => {
  const { scrollY } = useScroll();
  const y1Transform = useTransform(scrollY, [0, 500], [0, 160]);
  const y2Transform = useTransform(scrollY, [0, 500], [0, -90]);
  const y1 = useSpring(y1Transform, { stiffness: 85, damping: 20 });
  const y2 = useSpring(y2Transform, { stiffness: 85, damping: 20 });
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const poppingTexts = [
    "Geopolitcs",
    "Inequality",
    "AI",
    "Energy",
    "Net Zero",
    "Biodiversity",
    "Impact",
    "Resources",
    "Circularity",
    "Value creation",
    "Tranformation",
    "Resilience"
  ];

  const constellationPoints = [
    { top: '15%', left: '25%', delay: 0 },
    { top: '25%', left: '72%', delay: 1 },
    { top: '45%', left: '18%', delay: 2 },
    { top: '55%', left: '82%', delay: 3 },
    { top: '75%', left: '22%', delay: 4 },
    { top: '82%', left: '70%', delay: 5 },
    { top: '35%', left: '40%', delay: 6 },
    { top: '65%', left: '60%', delay: 7 },
    { top: '15%', left: '55%', delay: 8 },
    { top: '85%', left: '45%', delay: 9 },
    { top: '40%', left: '78%', delay: 10 },
    { top: '60%', left: '20%', delay: 11 },
  ];

  return (
    <section id="hero" className="relative min-h-screen w-full bg-athena-cream flex flex-col lg:flex-row items-center overflow-hidden pt-16 md:pt-12 lg:pt-0">
      {/* Background Image with Overlay */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
        <ProgressiveImage 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" 
          alt="Abstract Architecture" 
          className="w-full h-full object-cover opacity-20 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-athena-peach/20 to-athena-navy/40" />
        <div className="absolute inset-0 bg-athena-cream/40" />
      </motion.div>

      {/* Background Watermark Logo (Right 50%) */}
      <motion.div style={{ y: y2, opacity }} className="relative lg:absolute right-0 top-0 w-full lg:w-1/2 h-[35vh] md:h-[25vh] lg:h-full flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            rotate: { duration: 60, repeat: Infinity, ease: "linear" },
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
          className="opacity-[0.1] scale-50 lg:scale-100"
        >
          <Logo size={300} color="var(--athena-navy)" />
        </motion.div>

        {/* Popping/Flashing Texts Constellation */}
        {constellationPoints.map((point, i) => (
          <ConstellationPoint 
            key={`constellation-${i}`} 
            point={point} 
            texts={poppingTexts} 
            indexOffset={i}
            isDarkMode={isDarkMode}
          />
        ))}
      </motion.div>

      <div className="w-full max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row">
        {/* Content (Left 50%) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-1/2 pt-4 md:pt-2 lg:pt-16"
        >
          <h1 className="mb-6 lg:mb-8 text-athena-navy">
            <RotatingText
              prefix="From ESG to"
              texts={["Value", "Competitiveness", "Resilience"]}
              prefixColor={isDarkMode ? "#E8E6E3" : "var(--athena-navy)"}
              color={isDarkMode ? "#E8E6E3" : "var(--athena-navy)"}
              badgeBackground="transparent"
              badgePaddingX={0}
              badgePaddingY={0}
              badgeRadius={0}
              gap={10}
              font={{
                fontFamily: '"GeogrotesqueCyr", "Geogrotesque", sans-serif',
                fontSize: "clamp(2.15rem, 5.2vw, 4.25rem)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                lineHeight: "1.15em",
                textAlign: "left",
              }}
            />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 35, scaleY: 0.9, originY: 1 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 70,
              damping: 18,
              mass: 1.1,
              delay: 0.45,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="text-athena-navy text-base md:text-[18px] lg:text-[18px] font-jakarta font-light max-w-xl opacity-90 leading-relaxed md:leading-relaxed lg:leading-[27px] mb-8"
          >
            We are an integrated strategic intelligence, precision advisory and capability practice. We work with boards, CEOs, and leadership teams across the economy to prioritise what really matters, build capacity where it is needed and align value creation with impact.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 25, scaleY: 0.9, originY: 1 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 70,
              damping: 18,
              mass: 1.1,
              delay: 0.55,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="flex gap-6 w-fit"
          >
            <LabelSlideButton
              label="Let's Start a Conversation"
              link="#contact"
              newTab={false}
              padding="14px 28px 14px 28px"
              gap={14}
              rounded={100}
              font={{
                fontFamily: '"Satoshi", sans-serif',
                fontSize: "1.0625rem",
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
              colors={{
                fill: isDarkMode ? "#88c9c4" : "#4a8c87",
                textColor: isDarkMode ? "#0B151F" : "#FFFFFF",
                hoverFill: isDarkMode ? "#E8E6E3" : "#152532",
                hoverTextColor: isDarkMode ? "#0B151F" : "#FFFFFF",
              }}
              icon={{
                side: "right",
                size: 14,
                padding: 8,
                rounded: 100,
                type: "symbol",
                angle: 315,
                restSymbol: "↗",
                hoverSymbol: "↗",
                background: isDarkMode ? "#0B151F" : "#152532",
                color: isDarkMode ? "#88c9c4" : "#FFFFFF",
                hoverBackground: isDarkMode ? "#0B151F" : "#4a8c87",
                hoverColor: isDarkMode ? "#E8E6E3" : "#FFFFFF",
              }}
              className="shadow-xl shadow-athena-peach/15 hover:shadow-2xl transition-shadow duration-500 inline-block whitespace-nowrap text-center"
              onClick={(e) => {
                e.preventDefault();
                const contactEl = document.getElementById('contact');
                if (contactEl) {
                  contactEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle bottom gradient to blend with next section */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-athena-surface to-transparent pointer-events-none" />
    </section>
  );
};

const ConstellationPoint = ({ point, texts, indexOffset, isDarkMode }: any) => {
  const [textIndex, setTextIndex] = useState(indexOffset % texts.length);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Magnetic effect
  const magneticX = useSpring(useTransform(mouseX, [-100, 100], [-20, 20]), { stiffness: 150, damping: 15 });
  const magneticY = useSpring(useTransform(mouseY, [-100, 100], [-20, 20]), { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 1, 0, 0, 0],
        scale: [0.5, 1.1, 1.1, 0.5, 0.5, 0.5],
      }}
      whileHover={{ 
        scale: 1.3, 
        opacity: 1,
        color: 'var(--athena-peach)',
        boxShadow: '0 0 20px rgba(102, 171, 165, 0.5)',
        zIndex: 50
      }}
      style={{
        top: point.top,
        left: point.left,
        x: magneticX,
        y: magneticY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{
        duration: 12, // Longer duration for staggering
        repeat: Infinity,
        delay: point.delay,
        ease: "easeInOut",
        times: [0, 0.1, 0.2, 0.3, 0.4, 1], // Stays visible for 20% of the time
        scale: { duration: 0.3 }
      }}
      onAnimationIteration={() => {
        setTextIndex((prev) => (prev + 1) % texts.length);
      }}
      className="absolute text-athena-cream font-exo font-bold uppercase tracking-[0.2em] text-[12px] md:text-[14px] whitespace-nowrap bg-athena-navy/90 backdrop-blur-md px-4 py-2 rounded-full border border-athena-peach/40 cursor-default pointer-events-auto interactive shadow-xl"
    >
      {texts[textIndex]}
    </motion.div>
  );
};

const About = ({ setShowLeadership, setShowTeam, setShowPartners, isDarkMode }: { setShowLeadership: (val: boolean) => void, setShowTeam: (val: boolean) => void, setShowPartners: (val: boolean) => void, isDarkMode: boolean }) => {
  const skewY = useScrollVelocitySkew();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const hasHoverSupport = !isTouchDevice;

  const [popover, setPopover] = useState<{
    content: React.ReactNode;
    anchorRect: DOMRect | null;
    variant: 'peach' | 'navy';
    placement: 'top' | 'bottom';
    left: number;
    arrowLeft: number;
    width: number;
  } | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (popover && popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setPopover(null);
      }
    };

    if (popover) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [popover]);
  const [isModelExpanded, setIsModelExpanded] = useState(false);
  const aboutRef = useRef<HTMLElement>(null);
  const [hoveredAdvisorLocal, setHoveredAdvisorLocal] = useState<number | null>(null);
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  // Scroll-Link Reset logic for About
  useEffect(() => {
    const handleReset = () => setIsModelExpanded(false);
    window.addEventListener('athena:reset-accordions', handleReset);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && isModelExpanded) {
          setIsModelExpanded(false);
        }
      },
      { threshold: 0.1 }
    );

    if (aboutRef.current) observer.observe(aboutRef.current);

    return () => {
      window.removeEventListener('athena:reset-accordions', handleReset);
      observer.disconnect();
    };
  }, [isModelExpanded]);

  const handleTrigger = (e: React.MouseEvent | React.TouchEvent, content: React.ReactNode, variant: 'peach' | 'navy', isActive: boolean) => {
    if (isActive) {
      const rect = e.currentTarget.getBoundingClientRect();
      const placement = rect.top < window.innerHeight / 2 ? 'bottom' : 'top';
      const screenWidth = window.innerWidth;
      const margin = 12;
      const popoverWidth = Math.min(672, screenWidth - (margin * 2));
      const anchorCenter = rect.left + rect.width / 2;
      let left = anchorCenter - (popoverWidth / 2);
      if (left < margin) left = margin;
      if (left + popoverWidth > screenWidth - margin) left = screenWidth - margin - popoverWidth;
      const arrowLeft = anchorCenter - left;

      setPopover({
        content,
        anchorRect: rect,
        variant,
        placement,
        left,
        arrowLeft,
        width: popoverWidth
      });
    } else {
      setPopover(null);
    }
  };

  useEffect(() => {
    if (isModelExpanded) {
      window.dispatchEvent(new CustomEvent('athena:component-expanded', { detail: { type: 'about-expanded' } }));
    }
  }, [isModelExpanded]);
  
  // Listen for process character expansion to mutual reset
  useEffect(() => {
    const handleProcessChange = (e: any) => {
      if (e.detail?.type === 'process-expanded' && isModelExpanded) {
        setIsModelExpanded(false);
      }
    };
    window.addEventListener('athena:component-expanded', handleProcessChange);
    return () => window.removeEventListener('athena:component-expanded', handleProcessChange);
  }, [isModelExpanded]);

  return (
    <section id="about" ref={aboutRef} className="bg-athena-surface text-athena-navy pt-48 pb-16 md:pb-20 overflow-hidden relative">
      <AnimatePresence>
        {popover && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(50% 49.8% 50% 49.8%)' }}
            animate={{ 
              opacity: 1, 
              clipPath: [
                'inset(50% 49.8% 50% 49.8%)', 
                'inset(0% 49.8% 0% 49.8%)', 
                'inset(0% 0% 0% 0%)'
              ]
            }}
            exit={{ 
              opacity: 0, 
              clipPath: 'inset(50% 0% 50% 0%)',
              transition: { duration: 0.3, ease: 'easeInOut' }
            }}
            transition={{
              duration: 0.8,
              times: [0, 0.45, 1],
              ease: [
                [0.23, 1, 0.32, 1],
                [0.23, 1, 0.32, 1]
              ]
            }}
            style={{ 
              position: 'fixed',
              top: popover.anchorRect 
                ? (popover.placement === 'top' ? popover.anchorRect.top - 12 : popover.anchorRect.bottom + 12) 
                : 0,
              left: popover.left,
              width: popover.width,
              translateY: popover.placement === 'top' ? '-100%' : '0%',
              zIndex: 1000,
            }}
            ref={popoverRef}
            className={`p-6 md:p-8 rounded-2xl shadow-2xl backdrop-blur-xl border-[5px] border-athena-peach pointer-events-auto ${isDarkMode ? 'bg-athena-peach/95' : 'bg-[#eaeaea]'} text-[#152532]`}
          >
            <button 
              onClick={() => setPopover(null)}
              className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors pointer-events-auto"
              aria-label="Close popover"
            >
              <X size={18} />
            </button>
            {popover.content}
            <div 
              className={`absolute w-4 h-4 rotate-45 border-white/10 ${
                popover.placement === 'top' 
                  ? '-bottom-2 border-b border-r' 
                  : '-top-2 border-t border-l'
              } bg-athena-peach/95 border-white/20`}
              style={{
                left: popover.arrowLeft,
                transform: 'translateX(-50%) rotate(45deg)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Title Label */}
        <div className="mb-16 md:mb-24 border-l-2 border-athena-peach-bright/40 pl-5 flex items-center justify-between">
          <BlockReveal color="#fca71e">
            <span className="text-athena-peach-bright font-display font-semibold uppercase tracking-[0.25em] text-xs sm:text-sm selection:bg-athena-navy/10 relative">
              Who We Are
            </span>
          </BlockReveal>
          <div className="flex-grow h-[1px] bg-gradient-to-r from-athena-navy/5 to-transparent dark:from-white/5 ml-8 hidden sm:block" />
        </div>

        {/* Section Intro Text */}
        <div className="mb-24 max-w-4xl space-y-6">
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-xl sm:text-2xl font-display font-medium text-athena-navy/90 leading-relaxed text-left"
          >
            As boundaries, technologies, markets and practices shift, a different kind of insight, strategy and capacity is required.
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-[#66aba5] dark:text-athena-peach-bright font-jakarta font-normal text-base sm:text-[17px] leading-relaxed tracking-wide text-left"
          >
            Athena was created to bring together sustainability science, global trends, market transitions, commercial priorities and organisational capabilities into a single strategic lens- because treating them separately no longer works.
          </motion.p>
        </div>

        {/* Section: Leadership - Aris Vrettos */}
        <div id="our-team" className="grid lg:grid-cols-12 gap-12 lg:gap-20 mb-32 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-4 flex flex-col items-center text-center lg:text-left lg:items-start space-y-6"
          >
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-athena-peach/20 to-athena-peach-bright/20 blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              <ProgressiveImage 
                src="https://www.sargiapartners.com/wp-content/uploads/2026/02/vrettos.png" 
                alt="Aris Vrettos" 
                className="w-48 h-48 md:w-56 md:h-56 rounded-2xl relative z-10 border border-athena-navy/10 ring-4 ring-athena-peach/10 shadow-2xl"
              />
            </div>
            <div className="space-y-3 relative z-10 w-full flex flex-col items-center lg:items-start text-center lg:text-left">
              <BlockReveal color="#66aba5">
                <h3 className="text-3xl font-display font-medium text-athena-navy text-center lg:text-left">Aris Vrettos</h3>
              </BlockReveal>
              <p className="text-sm font-teko font-medium uppercase tracking-[0.2em] text-athena-peach-bright text-center lg:text-left">Leadership</p>
              <div className="flex gap-3 justify-center lg:justify-start">
                <RippleAnchor href="mailto:aris@athenaresiliencegroup.com" className="w-9 h-9 rounded-full bg-athena-navy dark:bg-athena-sage text-white dark:text-athena-navy flex items-center justify-center hover:bg-athena-peach transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach focus-visible:ring-offset-2">
                  <Mail size={16} />
                </RippleAnchor>
                <RippleAnchor href="https://www.linkedin.com/in/aris-vrettos/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-athena-navy dark:bg-athena-sage text-white dark:text-athena-navy flex items-center justify-center hover:bg-athena-peach transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach focus-visible:ring-offset-2">
                  <Linkedin size={16} />
                </RippleAnchor>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-8 space-y-6 p-6 sm:p-8 rounded-2xl border border-[#66aba5] bg-[#152532]/[0.01] dark:bg-white/[0.01]"
          >
            <p className="text-lg md:text-xl font-jakarta font-light text-athena-navy/90 leading-[1.7] max-w-4xl">
              Athena Resilience Group is led by Aris Vrettos, a trusted advisor and educator to boards, CEOs and leadership teams across sectors and geographies. Aris has held senior corporate, consultancy and academic positions and worked closely with leading figures in science, policy, business, investment and civil society. 
              {!isBioExpanded && (
                <button
                  onClick={() => setIsBioExpanded(true)}
                  className="inline-flex items-center ml-2 text-base font-jakarta font-medium text-[#66aba5] dark:text-athena-peach-bright hover:text-athena-peach transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach focus-visible:ring-offset-2 rounded"
                >
                  read full bio <span className="ml-1 text-xs select-none group-hover:translate-x-1 transition-transform">→</span>
                </button>
              )}
            </p>

            <AnimatePresence initial={false}>
              {isBioExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 16 }}
                  className="overflow-hidden space-y-6"
                >
                  <p className="text-base font-jakarta font-light text-athena-navy/80 leading-[1.6] max-w-4xl">
                    A trained economist, over the last three decades Aris has contributed to the development and adoption of key international frameworks, initiatives and leading practice and continues to speak and teach on the forces and leadership shaping business and the economy.
                  </p>
                  <p className="text-base font-jakarta font-light text-athena-navy/80 leading-[1.6] max-w-4xl">
                    His roles include Director for Sustainability Strategy and Transformation at Croda International, the FTSE 100 global manufacturing business; Director of the Centre of Business Transformation at the University of Cambridge Institute for Sustainability Leadership (CISL); Global Director of the HRH The Prince of Wales’s Business & Sustainability Programme; and Senior Advisor at the pioneering think tank AccountAbility.
                  </p>
                  <button
                    onClick={() => setIsBioExpanded(false)}
                    className="inline-flex items-center text-sm font-jakarta font-medium text-[#66aba5] dark:text-athena-peach-bright hover:text-athena-peach transition-colors cursor-pointer pt-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach focus-visible:ring-offset-2 rounded"
                  >
                    show less <span className="ml-1 text-xs select-none group-hover:-translate-y-0.5 transition-transform">↑</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Section: Board of Advisors */}
        <div className="mb-24">
          <div className="border-l-2 border-athena-peach-bright/40 pl-5 mb-12">
            <BlockReveal color="#66aba5">
              <h3 className="text-3xl font-display font-medium text-athena-navy">Board of Advisors</h3>
            </BlockReveal>
            <p className="text-xl sm:text-2xl font-display font-medium text-athena-navy/90 leading-relaxed text-left mt-4 max-w-4xl">Athena’s Board of Advisors provide strategic guidance, intellectual challenge, and deep, applied expertise — ensuring our work remains rigorous, future‑focused, and grounded in the realities of global markets and planetary boundaries.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                name: "Katherine Chou", 
                role: "VP Research, Google", 
                expertise: "AI & Science Innovation",
                desc: "A global technology leader shaping breakthrough innovation across AI, health, climate, and science. Katherine brings deep insight into how emerging technologies will transform markets, supply chains, and sustainability expectations.", 
                image: "https://storage.googleapis.com/gweb-developer-goog-blog-assets/images/Katherine.original.png",
                linkedin: "https://www.linkedin.com/in/katherinechou/"
              },
              { 
                name: "Dimitri Zenghelis", 
                role: "Senior Visiting Fellow, LSE", 
                expertise: "Climate Economics",
                desc: "One of the world’s foremost climate economists. Dimitri advises governments, financial institutions, and global organisations on sustainable growth, macroeconomics, and the transition to a resilient, low‑carbon economy.", 
                image: "https://www.bennettschool.cam.ac.uk/wp-content/uploads/2020/12/Dimitri.jpg",
                linkedin: "https://www.linkedin.com/in/dimitri-zenghelis-2a378517/"
              },
              { 
                name: "Håkan Nordkvist", 
                role: "Former Head of Sustainability Innovation, IKEA", 
                expertise: "Circular Business Models",
                desc: "A pioneer of circular business models and clean‑energy innovation. Håkan built IKEA’s global clean‑energy business and led the development of new circular services and business models.", 
                image: "https://www.spacegroup.co.uk/assets/_/2023/07/04/4584e26c-3d82-40f4-b248-48674193a67d/shift-hakan-nordkvist-talk-1-4x3.jpg?fit=crop&crop=3713,3686,1202,0&v=1",
                linkedin: "https://www.linkedin.com/in/h%C3%A5kan-nordkvist-65407820/"
              },
              { 
                name: "Alejandro Litovsky", 
                role: "Founder & CEO, Earth Security Group", 
                expertise: "Natural Capital & Geopolitics",
                desc: "A global expert in natural capital, sustainable finance, and geopolitical resilience. Alejandro helps organisations build partnerships and investment strategies that align commercial value with planetary resilience.", 
                image: "https://cdn.prod.website-files.com/649d0878144d1c4393b09cea/649d0878144d1c4393b09e64_630dd04a22283fa49dcaa0f5_Alejandro-Crop-.png",
                linkedin: "https://www.linkedin.com/in/alejandrolitovsky?originalSubdomain=uk"
              }
            ].map((member, i) => (
              <motion.div
                key={`advisor-card-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                onMouseEnter={() => { if (hasHoverSupport) setHoveredAdvisorLocal(i); }}
                onMouseLeave={() => { if (hasHoverSupport) setHoveredAdvisorLocal(null); }}
                className={`bg-athena-cream border border-athena-navy/10 dark:border-athena-peach/25 p-6 rounded-2xl flex flex-col justify-between transition-all duration-500 relative group overflow-hidden ${
                  hasHoverSupport 
                    ? 'hover:border-athena-peach dark:hover:border-athena-peach-bright hover:shadow-[0_20px_50px_rgba(252,167,30,0.12)] hover:ring-1 hover:ring-athena-peach/40' 
                    : ''
                }`}
              >
                {/* Custom Tooltip */}
                <AnimatePresence>
                  {hoveredAdvisorLocal === i && (() => {
                    const wordCount = member.expertise.split(/\s+/).length;
                    const isMultiLine = wordCount >= 3;
                    const renderExpertiseTooltip = (text: string) => {
                      const words = text.split(/\s+/);
                      if (words.length < 3) return text;
                      
                      if (text === "AI & Science Innovation") {
                        return (
                          <>
                            AI & Science
                            <br />
                            Innovation
                          </>
                        );
                      }
                      if (text === "Circular Business Models") {
                        return (
                          <>
                            Circular Business
                            <br />
                            Models
                          </>
                        );
                      }
                      if (text === "Natural Capital & Geopolitics") {
                        return (
                          <>
                            Natural Capital
                            <br />
                            & Geopolitics
                          </>
                        );
                      }
                      
                      const mid = Math.ceil(words.length / 2);
                      return (
                        <>
                          {words.slice(0, mid).join(" ")}
                          <br />
                          {words.slice(mid).join(" ")}
                        </>
                      );
                    };

                    return (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 6 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className={`absolute bottom-[23px] right-6 bg-athena-navy dark:bg-athena-cream text-athena-peach dark:text-athena-navy text-[7px] min-[360px]:text-[7.5px] sm:text-[8.5px] lg:text-[9px] font-sans font-bold uppercase tracking-wider border border-athena-peach/30 dark:border-athena-navy/30 shadow-md pointer-events-none z-20 text-center ${
                          isMultiLine 
                            ? 'px-3 py-1 rounded-xl leading-[1.2]' 
                            : 'px-2.5 py-0.5 rounded-full'
                        }`}
                      >
                        {renderExpertiseTooltip(member.expertise)}
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <ProgressiveImage 
                      src={member.image} 
                      alt={member.name} 
                      className="w-16 h-16 rounded-full border border-athena-peach/20 ring-2 ring-athena-peach/10"
                    />
                    <div>
                      <h4 className="font-display font-medium text-lg text-athena-navy">{member.name}</h4>
                      <p className="text-xs text-athena-peach font-sans font-medium">{member.role}</p>
                      {!hasHoverSupport && (
                        <span className="inline-block mt-1 bg-athena-peach/10 text-athena-peach text-[8px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                          {member.expertise}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm font-jakarta font-light text-athena-navy/80 leading-relaxed">
                    {member.desc}
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-athena-navy/5 flex gap-3 justify-start items-center">
                  <RippleAnchor 
                    href={member.linkedin || "https://linkedin.com"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-7 h-7 rounded-full bg-athena-navy dark:bg-athena-sage text-white dark:text-athena-navy flex items-center justify-center hover:bg-athena-peach hover:text-white transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach focus-visible:ring-offset-2 group/social"
                  >
                    <Linkedin size={12} className="transition-transform duration-300 group-hover/social:rotate-12" />
                  </RippleAnchor>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Partners Pill centered right under advisors boxes (Currently Hidden) */}
          <div className="hidden justify-center mt-12">
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPartners(true)}
              className="bg-athena-cream text-[#eaeaea] dark:bg-athena-peach px-6 py-3 rounded-full font-sans font-bold flex items-center gap-2 transition-all text-xs md:text-sm shadow-sm border border-athena-navy/5 hover:shadow-md"
            >
              Our Partners <ArrowRight size={16} />
            </motion.button>
          </div>
        </div>

        {/* Section: Our Unique Model */}
        <div id="unique-model" className="mb-12 mt-24">
          <div className="border-l-2 border-athena-peach-bright/40 pl-5 mb-12">
            <BlockReveal color="#66aba5">
              <h3 className="text-3xl font-display font-medium text-athena-navy">Our Unique Model</h3>
            </BlockReveal>
            <p className="text-sm font-teko font-medium uppercase tracking-[0.2em] text-athena-peach-bright mt-1">One integrated service, delivered by one senior team, tailored every time.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Holistic approach:",
                desc: "We integrate environmental, economic, social, policy, market and technological transitions with commercial realities."
              },
              {
                title: "Integrated, customised service:",
                desc: "The same team analyses the operating context, designs the strategic response and equips organisations to deliver it- tailored to your operating context and implementation needs."
              },
              {
                title: "Selective, high-attention advisory:",
                desc: "We limit the number of advisory engagements to ensure continuous support and meaningful impact."
              },
              {
                title: "Senior-led, AI-enabled:",
                desc: "Every engagement is led by senior advisors supported by AI-powered intelligence model for high quality with a lighter footprint."
              }
            ].map((pillar, idx) => (
              <motion.div
                key={`pillar-concept-${idx}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-athena-cream border border-athena-navy/5 dark:border-athena-peach/20 p-6 rounded-2xl flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  <div className="w-8 h-8 rounded-full bg-athena-navy/5 dark:bg-athena-peach/10 flex items-center justify-center text-athena-peach-bright mb-4 group-hover:bg-athena-peach/20 transition-colors">
                    <Logo size={16} color={isDarkMode ? "var(--athena-peach-bright)" : "#152532"} />
                  </div>
                  <h4 className="font-display font-medium text-lg text-athena-navy mb-3">{pillar.title}</h4>
                  <p className="text-sm font-jakarta font-light text-athena-navy/80 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-1/4 right-0 w-1/3 h-px bg-gradient-to-l from-athena-peach/20 to-transparent pointer-events-none hidden lg:block" />
        <div className="absolute bottom-1/3 left-0 w-1/4 h-px bg-gradient-to-r from-athena-peach/20 to-transparent pointer-events-none hidden lg:block" />
      </div>
    </section>
  );
};

const StickyScrollServices = ({ setShowLeadership, setShowTeam, setShowPartners, isDarkMode }: { setShowLeadership: (val: boolean) => void, setShowTeam: (val: boolean) => void, setShowPartners: (val: boolean) => void, isDarkMode: boolean }) => {
  const blocks = [
    {
      title: "SENIOR Commercial leadership",
      content: "We draw from our own experience in boards, leadership teams and transformation programmes to ensure our work is executive-ready and cascades through the organisation."
    },
    {
      title: "Worldclass capacity building AND leadership development",
      content: "For over a decade, we designed and delivered executive programmes of the highest standard at the University of Cambridge Institute for Sustainability Leadership, and trained more than 1,000 leaders from business, financial institutions and government through HRH The Prince of Wales’s Business & Sustainability Programme."
    },
    {
      title: "Global expertise and cutting-edge insight",
      content: "Our Board of Advisors and global network bring leading insight across key fields and industry sectors- from AI and macroeconomic policy to innovation and systems change."
    },
    {
      title: "Science-led, collaborative mission",
      content: "For over 20 years we’ve worked closely with business, scientists, government, civil society, standard setters and funders to advance the transition to a sustainable economy."
    },
  
  ];

  interface CardCoords {
    left: number;
    top: number;
    right: number;
    bottom: number;
    cx: number;
  }

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [coords, setCoords] = useState<{
    headerX: number;
    headerY: number;
    timelineX: number;
    cards: CardCoords[];
  } | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 90%", "end end"]
  });

  useEffect(() => {
    const calculatePositions = () => {
      if (headerRef.current && timelineRef.current && sectionRef.current) {
        const sectionRect = sectionRef.current.getBoundingClientRect();
        const headerRect = headerRef.current.getBoundingClientRect();
        const timelineRect = timelineRef.current.getBoundingClientRect();

        const headerX = headerRect.right - sectionRect.left + 24;
        const headerY = headerRect.top + headerRect.height / 2 - sectionRect.top;
        const timelineX = timelineRect.left + timelineRect.width / 2 - sectionRect.left;

        const cardsCoords: CardCoords[] = [];
        let success = true;
        for (let i = 0; i < blocks.length; i++) {
          const el = cardRefs.current[i];
          if (el) {
            const rect = el.getBoundingClientRect();
            const left = rect.left - sectionRect.left;
            const top = rect.top - sectionRect.top;
            const right = rect.right - sectionRect.left;
            const bottom = rect.bottom - sectionRect.top;
            const cx = (left + right) / 2;
            cardsCoords[i] = { left, top, right, bottom, cx };
          } else {
            success = false;
          }
        }

        if (success) {
          setCoords({
            headerX,
            headerY,
            timelineX,
            cards: cardsCoords,
          });
        }
      }
    };

    calculatePositions();

    const observer = new ResizeObserver(() => {
      calculatePositions();
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    cardRefs.current.forEach((el) => {
      if (el) {
        observer.observe(el);
      }
    });

    window.addEventListener('resize', calculatePositions);
    
    // Multiple staggered timers to ensure accurate layout calculation after fonts and assets render
    const t1 = setTimeout(calculatePositions, 100);
    const t2 = setTimeout(calculatePositions, 300);
    const t3 = setTimeout(calculatePositions, 600);
    const t4 = setTimeout(calculatePositions, 1200);
    const t5 = setTimeout(calculatePositions, 2400);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', calculatePositions);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const isCoordsReady = coords && coords.cards.length === blocks.length;

  return (
    <motion.section id="how-we-work" ref={sectionRef} className="relative bg-athena-surface scroll-mt-20 pt-16 md:pt-20" style={{ position: 'relative' }}>
      
      {/* Dynamic Continuous SVG Scroll-Filling Overlays */}
      {isCoordsReady && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden lg:block overflow-visible">
          {blocks.map((_, i) => {
            const total = blocks.length;
            const startRange = i / total;
            const endRange = (i + 1) / total;
            const timelineStart = startRange;
            const timelineEnd = startRange + 0.08;
            const outlineStart = timelineEnd;
            const outlineEnd = endRange;

            const card = coords!.cards[i];
            const prevCard = i > 0 ? coords!.cards[i - 1] : null;
            const cx = card.cx;
            const top = card.top;
            const bottom = card.bottom;
            const left = card.left;
            const right = card.right;
            const cardR = 40;

            // 1. Timeline path connection leading to Card i
            let timelinePathD = "";
            if (i === 0) {
              timelinePathD = `M ${coords!.headerX} ${coords!.headerY} L ${cx - 24} ${coords!.headerY} Q ${cx} ${coords!.headerY} ${cx} ${coords!.headerY + 24} L ${cx} ${top}`;
            } else if (prevCard) {
              timelinePathD = `M ${prevCard.cx} ${prevCard.bottom} L ${cx} ${top}`;
            }

            // 2. Outlining paths for Card i (Left & Right halves for symmetrical flow)
            const leftOutlineD = `M ${cx} ${top} L ${left + cardR} ${top} Q ${left} ${top} ${left} ${top + cardR} L ${left} ${bottom - cardR} Q ${left} ${bottom} ${left + cardR} ${bottom} L ${cx} ${bottom}`;
            const rightOutlineD = `M ${cx} ${top} L ${right - cardR} ${top} Q ${right} ${top} ${right} ${top + cardR} L ${right} ${bottom - cardR} Q ${right} ${bottom} ${right - cardR} ${bottom} L ${cx} ${bottom}`;

            return (
              <g key={`group-scroll-path-${i}`}>
                {timelinePathD && (
                  <SegmentPath 
                    scrollYProgress={scrollYProgress} 
                    startRange={timelineStart} 
                    endRange={timelineEnd} 
                    pathD={timelinePathD} 
                    isDarkMode={isDarkMode} 
                  />
                )}
                <SegmentPath 
                  scrollYProgress={scrollYProgress} 
                  startRange={outlineStart} 
                  endRange={outlineEnd} 
                  pathD={leftOutlineD} 
                  isDarkMode={isDarkMode} 
                />
                <SegmentPath 
                  scrollYProgress={scrollYProgress} 
                  startRange={outlineStart} 
                  endRange={outlineEnd} 
                  pathD={rightOutlineD} 
                  isDarkMode={isDarkMode} 
                />
              </g>
            );
          })}
        </svg>
      )}

      {/* Section Headline */}
      <div className="max-w-7xl mx-auto px-6 relative z-20 mb-12 sm:mb-16">
        <div className="border-l-2 border-athena-peach-bright/40 pl-5 flex items-center justify-between mb-8">
          <BlockReveal color="#fca71e">
            <span ref={headerRef} className="text-athena-peach-bright font-display font-semibold uppercase tracking-[0.25em] text-xs sm:text-sm">
              What We Bring
            </span>
          </BlockReveal>
          <div className="flex-grow h-[1px] bg-gradient-to-r from-athena-navy/5 to-transparent dark:from-white/5 ml-8 hidden sm:block lg:hidden" />
        </div>
        
        {/* Section Intro Text */}
        <div className="max-w-4xl">
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-xl sm:text-2xl font-display font-medium text-athena-navy/90 leading-relaxed text-left tablet-landscape-intro"
          >
            A unique blend of leadership, commercial, academic and applied expertise, shaped by our decades’ long experience at board level, in global business and across leading institutions.
          </motion.p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left Panel - Sticky */}
        <div className="w-full lg:w-1/2 h-[55vh] md:h-[50vh] lg:h-screen sticky top-0 lg:sticky lg:top-0 flex flex-col justify-center pt-20 pb-8 px-6 md:p-12 lg:p-24 bg-athena-surface text-athena-navy z-30 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <GlobalRiskGlobe isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* Right Panel - Scrolling */}
        <div className="w-full lg:w-1/2 bg-athena-surface relative">
          {/* Vertical Filling Line Measurement Anchor - border-athena-navy/10 has been replaced with centralized paths */}
          <div ref={timelineRef} className="absolute left-1/2 top-0 bottom-0 w-[1px] z-0 hidden lg:block" />

          <div className="flex flex-col relative z-10">
            {blocks.map((block, i) => (
              <ServiceBlock 
                key={`service-block-${i}`} 
                block={block} 
                index={i} 
                total={blocks.length} 
                progress={scrollYProgress} 
                isDarkMode={isDarkMode}
                cardRef={(node) => {
                  cardRefs.current[i] = node;
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Scroll Snapping Styles Removed for Lenis Compatibility */}
    </motion.section>
  );
};

const SegmentPath = ({ 
  scrollYProgress, 
  startRange, 
  endRange, 
  pathD, 
  isDarkMode 
}: { 
  scrollYProgress: any; 
  startRange: number; 
  endRange: number; 
  pathD: string; 
  isDarkMode: boolean; 
}) => {
  const localProg = useTransform(scrollYProgress, [startRange, endRange], [0, 1], { clamp: true });
  const pathLength = useSpring(localProg, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <>
      {/* Faded Background Track */}
      <path
        d={pathD}
        stroke={isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(21, 37, 50, 0.08)"}
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      {/* Active Animated Progress Overlay */}
      <motion.path
        d={pathD}
        stroke={isDarkMode ? "var(--athena-peach-bright)" : "var(--athena-peach)"}
        strokeWidth="1"
        fill="none"
        style={{ pathLength }}
        strokeLinecap="round"
        filter={isDarkMode ? "drop-shadow(0 0 4px rgba(252, 167, 30, 0.45))" : "drop-shadow(0 0 3px rgba(252, 167, 30, 0.15))"}
      />
    </>
  );
};

const ServiceBlock: React.FC<{ 
  block: { title: string, content: string | React.ReactNode }, 
  index: number, 
  total: number, 
  progress: any,
  isDarkMode: boolean,
  cardRef: (node: HTMLDivElement | null) => void
}> = ({ block, index, total, progress, isDarkMode, cardRef }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    amount: 0.2,
    margin: typeof window !== 'undefined' && window.innerWidth < 1024 ? "-45% 0px -10% 0px" : "-10% 0px -10% 0px"
  });

  return (
    <div 
      ref={ref}
      className="snap-block py-24 flex items-center justify-center px-6 md:px-12 lg:py-32 lg:px-16 xl:px-20 relative"
    >
      {/* Subtle path drawing animation for horizontal row dividers removed */}
      <motion.div
        ref={cardRef}
        animate={{ 
          opacity: isInView ? 1 : 0.2,
          boxShadow: isInView && typeof window !== 'undefined' && window.innerWidth < 1024
            ? "0 20px 40px -10px rgba(0,0,0,0.1), 0 0 0 1px rgba(102,171,165,0.05)" 
            : "0 0px 0px rgba(0,0,0,0)"
        }}
        transition={{ 
          type: "spring",
          stiffness: 80,
          damping: 12,
          mass: 1,
          duration: 0.6 
        }}
        className="max-w-xl md:max-w-[676px] flex flex-col justify-center items-center text-center p-8 md:p-12 lg:py-16 lg:px-20 rounded-[40px] border border-athena-peach/10 backdrop-blur-xl relative z-20 w-full transition-all duration-500 hover:border-athena-peach/30 lg:border-none lg:bg-transparent lg:shadow-none lg:backdrop-blur-none lg:hover:border-none"
      >
        <h3 
          className="text-athena-peach font-medium uppercase tracking-[0.4em] mb-3 md:mb-6 w-full max-w-[280px] md:max-w-[600px] mx-auto text-center"
          style={{ 
            fontSize: '12px',
            lineHeight: index === 0 ? undefined : '20px'
          }}
        >
          {block.title}
        </h3>
        <p 
          className="font-jakarta transition-colors duration-500 text-athena-navy w-full max-w-[280px] md:max-w-[600px] mx-auto text-center"
          style={{ 
            fontSize: '16px',
            fontWeight: index === 0 ? 'normal' : undefined,
            lineHeight: '25px',
            textAlign: 'center'
          }}
        >
          {block.content}
        </p>
      </motion.div>
    </div>
  );
};

const DecodingText = ({ text, isHovered }: { text: string; isHovered: boolean }) => {
  const [displayText, setDisplayText] = useState(text);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isHovered) {
      let iteration = 0;
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      intervalRef.current = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return text[index];
              }
              if (letter === " ") return " ";
              if (!/[a-zA-Z]/.test(letter)) return letter;
              return letters[Math.floor(Math.random() * 26)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }

        iteration += 1;
      }, 20);
    } else {
      setDisplayText(text);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, text]);

  return <>{displayText}</>;
};

const ServicePill = ({ item, i, idx, pillContent, expandedId, setExpandedId, isDarkMode }: any) => {
  const pillRef = useRef(null);
  const isInView = useInView(pillRef, { once: true, amount: 0.5 });
  const isExpanded = expandedId === `pill-${i}-${idx}`;
  const data = pillContent[item];
  const triggerId = `pill-trigger-${i}-${idx}`;
  
  return (
    <>
      <span 
        ref={pillRef}
        id={triggerId}
        key={`step-item-${i}-${idx}`} 
        onClick={(e) => {
          e.nativeEvent.stopImmediatePropagation();
          setExpandedId(isExpanded ? null : `pill-${i}-${idx}`);
        }}
        className={`px-5 py-2.5 bg-athena-peach rounded-full text-[10px] font-exo font-bold uppercase tracking-widest border border-athena-navy/10 dark:border-athena-peach/20 shadow-sm hover:border-athena-peach/30 dark:hover:border-athena-peach transition-colors text-[#eaeaea] ${pillContent[item] ? 'cursor-pointer ring-1 ring-athena-peach/20 shadow-md transform hover:-translate-y-0.5' : ''} ${isExpanded ? 'ring-2 ring-athena-peach' : ''}`}
      >
        <span className="flex items-center gap-2">
          <span className="whitespace-normal sm:whitespace-nowrap">{item}</span>
          {pillContent[item] && (
            <motion.span 
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="text-[14px] leading-none mb-0.5 opacity-70"
            >
              {isExpanded ? '−' : '+'}
            </motion.span>
          )}
        </span>
      </span>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden w-full mt-2 mb-4 -mx-[14px] md:mx-0"
          >
            <div className={`p-5 md:p-6 rounded-2xl shadow-sm border transition-colors duration-500 ${
              isDarkMode 
                ? 'bg-athena-peach/10 border-athena-peach/30 text-athena-peach' 
                : 'bg-athena-peach/5 border-athena-peach/20 text-athena-navy'
            }`}>
              <div className="text-xs md:text-sm lg:text-base font-jakarta leading-relaxed space-y-4">
                <p className="font-bold text-base md:text-lg">{data?.content}</p>
                {data?.subText && <p className="opacity-90">{data.subText}</p>}
                {data?.bullets && (
                  <ul className={`space-y-2 border-l-2 pl-4 py-1 ${isDarkMode ? 'border-athena-peach/30' : 'border-athena-navy/10'}`}>
                    {data.bullets.map((bullet: string, bIdx: number) => (
                      <li key={`pill-bullet-${bIdx}`} className="flex items-start gap-3 text-[11px] md:text-sm">
                        <span className={`w-1.5 h-1.5 rounded-full mt-[6px] md:mt-[8px] shrink-0 ${isDarkMode ? 'bg-athena-peach' : 'bg-athena-navy'}`} />
                        <span className="opacity-90 leading-relaxed text-left">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {data?.footer && <p className="text-[10px] md:text-xs italic pt-2 opacity-70">{data.footer}</p>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Process = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const processRef = useRef<HTMLElement>(null);

  // Scroll-Link Reset logic for Process
  useEffect(() => {
    const handleReset = () => setExpandedId(null);
    window.addEventListener('athena:reset-accordions', handleReset);
    
    // Mutual reset: if about expands, reset here
    const handleAboutChange = (e: any) => {
      if (e.detail?.type === 'about-expanded' && expandedId) {
        setExpandedId(null);
      }
    };
    window.addEventListener('athena:component-expanded', handleAboutChange);

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only reset if significantly out of view to avoid flickering during expansion
        if (!entry.isIntersecting && entry.boundingClientRect.top > 0 && expandedId) {
          setExpandedId(null);
        }
      },
      { threshold: 0.05, rootMargin: '100px 0px 100px 0px' }
    );

    if (processRef.current) observer.observe(processRef.current);

    return () => {
      window.removeEventListener('athena:reset-accordions', handleReset);
      window.removeEventListener('athena:component-expanded', handleAboutChange);
      observer.disconnect();
    };
  }, [expandedId]);

  // Notify of expansion for mutual exclusion
  useEffect(() => {
    if (expandedId) {
      window.dispatchEvent(new CustomEvent('athena:component-expanded', { detail: { type: 'process-expanded' } }));
      // Also reset About expanded state directly if needed or via event
      // We'll use the event pattern
    }
  }, [expandedId]);

  // Auto-scroll logic for accordions (robust real-time layout-tracking)
  useEffect(() => {
    if (expandedId) {
      const idToScroll = expandedId.startsWith('step-') 
        ? `step-${expandedId.split('-')[1]}`
        : `pill-trigger-${expandedId.split('-')[1]}-${expandedId.split('-')[2]}`;
      
      let animationFrameId: number;
      const startTime = performance.now();
      const duration = 550; // Duration of layout shift transition + buffer
      const yOffset = 100; // Header offset + comfortable spacing
      
      const updateScroll = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const element = document.getElementById(idToScroll);
        
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementDocTop = rect.top + window.pageYOffset;
          const targetY = elementDocTop - yOffset;
          
          if (Math.abs(window.pageYOffset - targetY) > 1.5) {
            // Smoothly track elements as another collapses and shifts the page
            const easeFactor = 0.18;
            const nextY = window.pageYOffset + (targetY - window.pageYOffset) * easeFactor;
            
            window.scrollTo({
              top: nextY,
              behavior: 'auto'
            });
          }
        }
        
        if (elapsed < duration) {
          animationFrameId = requestAnimationFrame(updateScroll);
        } else {
          // Final centering alignment to make it absolutely precise at the end of the transition
          const finalElement = document.getElementById(idToScroll);
          if (finalElement) {
            const rect = finalElement.getBoundingClientRect();
            window.scrollTo({
              top: rect.top + window.pageYOffset - yOffset,
              behavior: 'smooth'
            });
          }
        }
      };
      
      // Delay slightly (50ms) to ensure the newly expanded section starts rendering and height height starts measuring
      const scrollTimeout = setTimeout(() => {
        animationFrameId = requestAnimationFrame(updateScroll);
      }, 50);
      
      return () => {
        clearTimeout(scrollTimeout);
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [expandedId]);
  
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  const pillContent: Record<string, { title: string; content: string; subText?: string; bullets?: string[]; footer?: string }> = {
    "Strategic horizon scanning": {
      title: "",
      content: "Our authoritative Strategic Intelligence briefs act as a radar for boards and decision makers, translating global trends and leading practice into actionable insights.",
      subText: "We track and analyse environmental, policy, economic, technological, social and market signals, events and trends through each organisation’s commercial lens.",
      bullets: [
        "Map of key trends and their commercial implications",
        "Outside-in view of the competitive landscape, relative position and preparedness",
        "Time saved with curated intelligence",
      ]
    },
    "Transition leadership and foresight": {
      title: "",
      content: "The convergence of AI, environmental pressures, geopolitical shifts and new social dynamics bring non-linear changes affecting economies, societies, resource security, competitiveness and resilience.",
      subText: "Working with partners across the economy to combine systems thinking and scenario building with real-world complexity, our goal is to understand emerging possibilities, explore different levers and choices and strengthen preparedness, decision quality and adaptive capacity as transitions unfold."
    },
    "Board & CEO Advisory": {
      title: "",
      content: "We provide boards and CEOs with a tailored interpretation of external developments, focusing on what they need to know for sharper strategy, oversight and execution.",
      bullets: [
        "Senior, authoritative insight on key risks and opportunities, trade-offs, leadership and timing implications",
        "Independent, confidential coaching and support on priorities, resources and decisions",
      ]
    },
    "Stress-testing, alignment & prioritisation": {
      title: "",
      content: "Many CEOs and CFOs feel their ESG agenda is becoming unrealistic or disconnected from commercial logic- and that the organisation is overwhelmed by multiple initiatives and demands.",
      subText: "We help organisations assess whether strategies, targets and plans remain fit for purpose and align environmental and social priorities with commercial reality and resilience needs.",
      bullets: [
        "Review strategy and investments against external transitions, commercial risks and opportunities",
        "Identify priority initiatives and levers by impact, return and feasibility",
        "Simplify and reframe corporate strategy with credible narratives and KPIs"
      ]
    },
    "Commercialising sustainability": {
      title: "",
      content: "For business of all sizes, sustainability becomes real when it connects to risk, cost, customers and value.",
      subText: "As supply chain risks increase, customer expectations rise and competitors are catching up, companies need to turn ESG exercises and commitments into value creation and protection.",
      bullets: [
        "Build a dynamic strategy based on resources, markets, differentiation and resilience",
        "Quantify the value of sustainability and tie investment cases to performance, customers and impact",
        "Identify ‘no-regret’ moves that create cost, resilience and operational synergies",
        "Ecosystem scanning, engagement and partnership facilitation",
        "Co-create delivery roadmap with clear ownership, levers and capacity requirements."
      ]
    },
    "Sustainable Portfolio & Innovation": {
      title: "",
      content: "Customers expect performance, quality and value for money with lower environmental impact. Customers expect performance, quality and value for money with lower environmental impact. Companies see opportunity in low-carbon and more sustainable solutions but need credible evidence and market signals to inform portfolio strategy and communicate sustainability performance.",
      subText: "We help companies assess their portfolios, benchmark against peers and assess commercial potential. We work with commercial, sourcing and innovation teams to:",
      bullets: [
        "Categorise the portfolio based on sustainability risks, competition and market signals",
        "Integrate sustainability criteria into product development and value propositions",
        "Co‑design net zero and circular product roadmaps and go‑to‑market pathways",
        "Engage ecosystems for partnerships and solutions to de-risk, accelerate and scale"
      ]
    },
    "Applied Executive Programmes": {
      title: "",
      content: "Tailored to each audience — including leadership, commercial, innovation and operational teams — our programmes equip leaders with clarity, confidence and creativity.",
      subText: " Our applied learning approach means participants produce actual strategic and operational roadmaps in real time.",
      bullets: [
        "Executive-level masterclass on ESG pressures and transitions, and how they interact with economics, geopolitics and technological trends",
        "Deep dives on commercial implications, strategic insights and leading practice on sustainable business models and transformation",
        "Leadership and team alignment workshop, to strengthen shared vision, ownership, decision making and change leadership",
        "Co-created strategic and operational roadmaps"
      ]
    },
    "ESG & Resilience for Boards": {
      title: "",
      content: "Whether you have a dedicated committee or are embedding ESG at the Board, our in-person engagements help address knowledge gaps, integrate sustainability and resilience into governance and equip directors with tools and confidence for effective strategy and oversight.",
      bullets: [
        "Board-ready analysis of global, sectoral and market trends and their impact on the organisation’s risks, opportunities and stakeholder expectations",
        "Lessons from leading board practice on direction and monitoring, managing ESG risk, performance and reporting and stakeholder engagement",
        "Governance diagnosis and recommendations on structure, mandate and capabilities."
      ]
    },
    "Institutional capacity & transformation": {
      title: "",
      content: "Whether you are looking to build shared competence and language or preparing for transformation, our programmes provide a cost-efficient way to build organisation-wide capacity and alignment, and strengthen communication, collaboration and execution- especially in times of change",
      bullets: [
        "n-house programme, with foundational and specialist modules, case studies and tools -delivered as self-paced online or blended cohort-based",
        "Transformation readiness diagnosis and roadmap, covering leadership, strategy, governance, portfolio, data and value chain."
      ]
    }
  };

  const steps = [
    { 
      title: "Strategic Intelligence & Foresight", 
      items: ["Strategic horizon scanning", "Board & CEO Advisory", "Transition leadership and foresight"],
      img: "https://images.unsplash.com/photo-1496096265110-f83ad7f96608?"
    },
    { 
      title: "Senior Advisory & Strategic Alignment", 
      items: ["Stress-testing, alignment & prioritisation", "Commercialising sustainability", "Sustainable Portfolio & Innovation"],
      img: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?"
    },
    { 
      title: "Transformational capabilities", 
      items: ["Applied Executive Programmes", "ESG & Resilience for Boards", "Institutional capacity & transformation"],
      img: "https://plus.unsplash.com/premium_photo-1664300255663-41d18cf0f03e?"
    },
  ];

  const [currentTypingIndex, setCurrentTypingIndex] = useState(0);
  const [activePathPercent, setActivePathPercent] = useState(0);

  const bulletsRef = useRef<HTMLDivElement>(null);
  const bulletsInView = useInView(bulletsRef, { once: true, amount: 0.1 });

  // Sequential typing trigger effect
  useEffect(() => {
    if (bulletsInView && currentTypingIndex === 0) {
      const t = setTimeout(() => {
        setCurrentTypingIndex(6);
      }, 1000); // 1.0s delay to allow the left-column text container to fade in cleanly before tracing the path
      return () => clearTimeout(t);
    }
  }, [bulletsInView, currentTypingIndex]);

  // Golden path tracing animation
  useEffect(() => {
    if (currentTypingIndex < 6) return;
    
    const duration = 2500; // 2.5s trace down time
    const startTime = performance.now();
    
    let animFrame: number;
    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setActivePathPercent(progress * 100);
      
      if (progress < 1) {
        animFrame = requestAnimationFrame(update);
      }
    };
    animFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animFrame);
  }, [currentTypingIndex]);

  return (
    <motion.section id="process" className="relative text-athena-navy py-48 scroll-mt-20 overflow-hidden" ref={processRef} style={{ position: 'relative' }}>
      
      {/* Section Headline */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 lg:hidden landscape:hidden">
        <div className="mb-16 md:mb-24 border-l-2 border-athena-peach-bright/40 pl-5 flex items-center justify-between">
          <BlockReveal color="#fca71e">
            <span className="text-athena-peach-bright font-display font-semibold uppercase tracking-[0.25em] text-xs sm:text-sm">
              What We Do
            </span>
          </BlockReveal>
          <div className="flex-grow h-[1px] bg-gradient-to-r from-athena-navy/5 to-transparent dark:from-white/5 ml-8 hidden sm:block" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row landscape:flex-row gap-12 items-start">
          <div className="w-full lg:w-1/3 landscape:w-1/3 text-left" ref={bulletsRef}>
            {/* What We Do Heading - aligned horizontally for desktop/landscape tablet */}
            <div className="hidden lg:block landscape:block mb-12 border-l-2 border-athena-peach-bright/40 pl-5">
              <BlockReveal color="#fca71e">
                <span className="text-athena-peach-bright font-display font-semibold uppercase tracking-[0.25em] text-xs sm:text-sm">
                  What We Do
                </span>
              </BlockReveal>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex flex-col gap-8 text-left"
            >
              <p className="text-lg sm:text-[21px] font-display font-medium text-athena-navy leading-[1.5] border-l-2 border-athena-peach-bright/50 pl-5 select-none relative">
                We help leaders and organisations utilise sustainability as a core strategic filter, driver and capability to differentiate, create value and build resilience- for themselves and their stakeholders.
              </p>
              <p className="text-base sm:text-[17px] font-jakarta font-medium text-athena-peach dark:text-athena-peach-bright/90 pl-5 leading-relaxed tracking-wide">
                Athena connects intelligence, strategy, leadership, transformation and capabilities into a coherent service.
              </p>
              <p className="text-sm sm:text-[15px] font-jakarta font-light text-athena-navy/70 pl-5 leading-relaxed max-w-xl text-justify sm:text-left transition-colors duration-300">
                Rather than distinct services, clients gain an integrated, continuous support system. Every advisory engagement comes with leadership and training support, so that outcomes are clear and executable and internal teams can build their own capacity; programmes produce strategic and operational roadmaps, so that learning supports strategy and translates into action.
              </p>
            </motion.div>
          </div>

          <div className="w-full lg:w-2/3 landscape:w-2/3 space-y-12 relative bg-athena-surface/60 backdrop-blur-md p-8 md:p-0 rounded-3xl md:rounded-none border border-athena-navy/10 md:border-none md:bg-transparent md:backdrop-blur-none">
            <div className="pl-0 md:pl-24 landscape:pl-24 mb-4">
              <span className="text-xs font-teko font-medium uppercase tracking-[0.3em] text-athena-peach-bright dark:text-athena-peach-bright bg-athena-peach/10 px-3 py-1 rounded-full border border-athena-peach/20 inline-block">
                Services
              </span>
            </div>

            {/* Animated Path */}
            <div className="absolute left-6 top-[72px] bottom-6 w-[2px] bg-athena-navy/5 hidden md:block landscape:block">
            <motion.div 
              className="absolute top-0 left-0 w-full bg-athena-peach origin-top"
              style={{ scaleY: activePathPercent / 100, height: '100%' }}
            />
          </div>

          {steps.map((step, i) => {
            const isStepExpanded = expandedId === `step-${i}`;
            const isTimelineTriggered = currentTypingIndex >= 6;
            const isStepLit = isTimelineTriggered && (
              i === 0 || 
              (i === 1 && activePathPercent >= 45) || 
              (i === 2 && activePathPercent >= 90)
            );

            const stepContent = i === 0 ? (
              <p className="text-xs md:text-sm lg:text-base font-jakarta font-medium leading-relaxed">
                We help leaders understand what is truly changing around them, what these pressures and shifts mean for their markets and business models, and guide them to make more informed decisions.
              </p>
            ) : i === 1 ? (
              <p className="text-xs md:text-sm lg:text-base font-jakarta font-medium leading-relaxed">
                We help organisations focus and align their strategies, governance and engagement with their operating context and the transitions shaping it.
              </p>
            ) : (
              <div className="text-xs md:text-sm lg:text-base font-jakarta font-medium leading-relaxed space-y-4">
                <p>
                  Sustainability leadership, knowledge and skills have become critical organisational competencies. Applied effectively, they help reduce risk, strengthen resilience and support innovation, differentiation and growth, while fostering an outward‑looking, forward‑thinking and collaborative culture.
                </p>
                <p>
                  Tailored to each organisation’s context and delivered through a time‑ and cost‑sensitive model, we combine Cambridge pedigree and commercial experience to help organisations build the right capabilities- where they are most needed.
                </p>
              </div>
            );

            return (
              <div 
                id={`step-${i}`}
                key={`step-${i}`}
                className="flex flex-col items-center md:flex-row md:items-start gap-8 md:gap-12 group relative w-full scroll-mt-24"
              >
                <div 
                  className="relative z-10 shrink-0 cursor-pointer md:pt-6"
                  onClick={() => setExpandedId(expandedId === `step-${i}` ? null : `step-${i}`)}
                >
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={isStepLit 
                      ? { opacity: 1, scale: 1 } 
                      : { opacity: 0, scale: 0.8 }
                    }
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg border-4 border-athena-cream dark:border-[#152532] ${
                      isStepExpanded 
                        ? 'bg-athena-peach ring-4 ring-athena-peach/25 scale-105' 
                        : 'bg-athena-navy ring-2 ring-athena-peach/10'
                    }`}
                  >
                    <Logo size={22} color={isStepExpanded ? "#152532" : "var(--athena-peach)"} className="transition-all duration-300" />
                  </motion.div>
                </div>

                <div className="flex-grow w-full text-left">
                  {/* Step Header Toggle */}
                  <div 
                    id={`step-title-${i}`}
                    onClick={() => setExpandedId(expandedId === `step-${i}` ? null : `step-${i}`)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group/title select-none border-b border-athena-navy/5 dark:border-white/5 pb-4"
                  >
                    <div className="flex-grow text-left flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                      {/* Interactive Step Image Banner alongside the title - always visible */}
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="w-full sm:w-48 h-28 sm:h-24 rounded-2xl overflow-hidden border border-athena-navy/10 dark:border-athena-peach/20 shadow-md relative shrink-0"
                      >
                        <img 
                          src={step.img} 
                          alt={step.title} 
                          className="w-full h-full object-cover grayscale group-hover/title:grayscale-0 transition-all duration-700" 
                          referrerPolicy="no-referrer" 
                        />
                      </motion.div>

                      <h3 className="font-display text-xl md:text-2xl font-semibold text-athena-navy group-hover/title:text-athena-peach transition-colors">
                        {step.title}
                      </h3>
                    </div>
                    <motion.div 
                      animate={{ rotate: isStepExpanded ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="p-1.5 rounded-full bg-athena-navy/5 text-athena-peach hover:bg-athena-peach/10 transition-colors shrink-0 self-end sm:self-auto"
                    >
                      <ChevronDown size={18} className="stroke-[3]" />
                    </motion.div>
                  </div>

                  {/* Accordion Expansion Container */}
                  <AnimatePresence initial={false}>
                    {isStepExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden w-full"
                      >
                        <div className="pt-6 space-y-6">
                          {i === 0 ? (
                            <div className="space-y-6">
                              <div>
                                <h4 className="font-display text-lg md:text-xl font-medium text-athena-peach-bright mb-4 text-left">
                                  Clarity on what is actually changing - and what it means.
                                </h4>
                                <div className="text-sm md:text-base font-jakarta font-light text-athena-navy/80 leading-relaxed md:max-w-3xl space-y-4">
                                  <p>
                                    Our Strategic Intelligence briefings act as a radar for boards and decision makers. They clarify what is truly changing around you, how it affects customers, markets and competition and what it means for strategy, performance, and stakeholder expectations.
                                  </p>
                                  <p>
                                    Through our network and research we track and analyse key external signals and trends, curate and translate them for each organisation so you can save time, focus and stay ahead.
                                  </p>
                                </div>
                              </div>

                              {/* Offerings Section */}
                              <div className="pt-2">
                                <div className="flex flex-wrap gap-2.5">
                                  {[
                                    "Board & Executive workshops",
                                    "Horizon scanning & competitive landscape analysis",
                                    "Commercial & strategic implications roadmap"
                                  ].map((offering, oIdx) => (
                                    <span 
                                      key={`offering-${oIdx}`}
                                      className="px-5 py-2.5 bg-athena-peach rounded-full text-[10px] font-sans font-bold uppercase tracking-widest border border-athena-navy/10 dark:border-athena-peach/20 shadow-sm text-[#eaeaea]"
                                    >
                                      {offering}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Sub-heading 2 */}
                              <div className="pt-4 border-t border-athena-navy/5">
                                <h4 className="font-display text-lg md:text-xl font-medium text-athena-peach-bright mb-4 text-left">
                                  Understanding longterm transitions and shaping change
                                </h4>
                                <div className="text-sm md:text-base font-jakarta font-light text-athena-navy/80 leading-relaxed md:max-w-3xl space-y-4">
                                  <p>
                                    Together with partners across the economy we focus on the forces reshaping economies and societies- AI and technological disruption, macro‑economic and geopolitical shifts, climate, nature and resource constraints, and widening socio‑economic imbalances.
                                  </p>
                                  <p>
                                    We examine the levers that influence these pathways and work with governments, investors, innovators, industry and civil society to improve our collective understanding of emerging transitions, explore long‑term pathways and strengthen adaptive capacity.
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : i === 1 ? (
                            <div className="space-y-6">
                              <div>
                                <h4 className="font-display text-lg md:text-xl font-medium text-athena-peach-bright mb-4 text-left">
                                  CEO & Board Advisory
                                </h4>
                                <div className="text-sm md:text-base font-jakarta font-light text-athena-navy/80 leading-relaxed md:max-w-3xl">
                                  <p>
                                    CEOs and Boards face rising complexity and uneven transitions, with limited time and resources, and few senior spaces to explore priorities and decisions. We provide confidential, ongoing, senior-only counsel and support.
                                  </p>
                                </div>
                              </div>

                              {/* Leadership Priorities sections */}
                              <div className="grid md:grid-cols-3 gap-6 pt-2">
                                <div>
                                  <h5 className="font-display text-sm font-semibold text-athena-navy uppercase tracking-wider mb-2 text-athena-pink-bright dark:text-athena-peach-bright">
                                    Leadership Priorities
                                  </h5>
                                  <p className="text-sm font-jakarta font-light text-athena-navy/80 leading-relaxed">
                                    Live, curated insight on the developments that matter and their leadership and timing implications.
                                  </p>
                                </div>
                                <div>
                                  <h5 className="font-display text-sm font-semibold text-athena-navy uppercase tracking-wider mb-2 text-athena-pink-bright dark:text-athena-peach-bright">
                                    Decision & Oversight Support
                                  </h5>
                                  <p className="text-sm font-jakarta font-light text-athena-navy/80 leading-relaxed">
                                    Targeted, real-time guidance for key decisions, strategy, risk, performance and stakeholder expectations.
                                  </p>
                                </div>
                                <div>
                                  <h5 className="font-display text-sm font-semibold text-athena-navy uppercase tracking-wider mb-2 text-athena-pink-bright dark:text-athena-peach-bright">
                                    Confidential Counsel
                                  </h5>
                                  <p className="text-sm font-jakarta font-light text-athena-navy/80 leading-relaxed">
                                    A discreet, senior to senior space for clarity, judgement and alignment.
                                  </p>
                                </div>
                              </div>

                              {/* Sub-heading 2 */}
                              <div className="pt-4 border-t border-athena-navy/5">
                                <h4 className="font-display text-lg md:text-xl font-medium text-athena-peach-bright mb-4 text-left">
                                  Strategy, innovation and integration
                                </h4>
                                <div className="text-sm md:text-base font-jakarta font-light text-athena-navy/80 leading-relaxed md:max-w-3xl space-y-4">
                                  <p>
                                    Organisations face mixed signals, competing priorities and find strategies, operations and investments exposed to real-world risks and constraints and ESG commitments disconnected from commercial logic.
                                  </p>
                                  <p>
                                    We work closely with leadership, commercial, innovation and operational teams across the full strategy and delivery cycle.
                                  </p>
                                  <p>
                                    We assess whether targets, portfolios and plans remain fit for purpose, explore net-zero, circular and nature-related opportunities and co-create dynamic strategies that are commercially grounded, operationally feasible and aligned with the most credible frameworks and transitions shaping markets.
                                  </p>
                                </div>
                              </div>

                              {/* Offerings Section */}
                              <div className="pt-2">
                                <div className="flex flex-wrap gap-2.5">
                                  {[
                                    "Stress Testing, Alignment & Prioritisation",
                                    "Strategy development and commercialisation",
                                    "Sustainable portfolio and innovation",
                                    "Ecosystem mapping and partnership strategy",
                                    "Effective integration, governance and engagement"
                                  ].map((offering, oIdx) => (
                                    <span 
                                      key={`strategy-offering-${oIdx}`}
                                      className="px-5 py-2.5 bg-athena-peach rounded-full text-[10px] font-sans font-bold uppercase tracking-widest border border-athena-navy/10 dark:border-athena-peach/20 shadow-sm text-[#eaeaea]"
                                    >
                                      {offering}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <div>
                                <div className="text-sm md:text-base font-jakarta font-light text-athena-navy/80 leading-relaxed md:max-w-3xl space-y-4">
                                  <p>
                                    As pressures increase and policies, technologies, markets and practices evolve, organisations need to update their capabilities to remain competitive, innovative and able to navigate change.
                                  </p>
                                  <p>
                                    From boards and C-suites to functions, teams and entire organisations we help build the right capabilities where they are most needed.
                                  </p>
                                  <p>
                                    Our programmes are tailored, integrated and applied, combining academic rigour with commercial and transformation experience. We bring together foundational and specialist knowledge, transition skills and best practice with live strategy and operational roadmaps. Our diagnostic ties learning to your specific context, priorities and needs.
                                  </p>
                                </div>
                              </div>

                              {/* Outcomes */}
                              <div className="pt-4 border-t border-athena-navy/5">
                                <h4 className="font-display text-xl md:text-2xl font-semibold text-athena-navy mb-3">
                                  Outcomes
                                </h4>
                                <ul className="text-sm md:text-base font-jakarta font-light text-athena-navy/80 leading-relaxed md:max-w-3xl space-y-3 pl-1">
                                  {[
                                    "Explore key global, sectoral and market trends, new ideas and practices and what they mean for the organisation’s risks, opportunities, performance and stakeholders.",
                                    "Equip leaders with the mindset, knowledge, tools and confidence to evaluate strategy, oversee emerging risks and guide their organisations through change.",
                                    "Address specific challenges, priorities and gaps to respond to evolving regulatory, customer and market needs.",
                                    "Build ownership, common language and an outward-looking and collaborative culture aligned with your vision and priorities."
                                  ].map((outcome, oIdx) => (
                                    <li key={`outcome-${oIdx}`} className="flex items-start gap-3">
                                      <span className="w-1.5 h-1.5 rounded-full bg-athena-peach mt-2.5 shrink-0" />
                                      <span>{outcome}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Offerings Section */}
                              <div className="pt-2">
                                <div className="flex flex-wrap gap-2.5">
                                  {[
                                    "Executive-level masterclass",
                                    "ESG & resilience for boards",
                                    "Specialist training",
                                    "Leadership and team alignment",
                                    "Organisational transformation"
                                  ].map((offering, oIdx) => (
                                    <span 
                                      key={`capabilities-offering-${oIdx}`}
                                      className="px-5 py-2.5 bg-athena-peach rounded-full text-[10px] font-sans font-bold uppercase tracking-widest border border-athena-navy/10 dark:border-athena-peach/20 shadow-sm text-[#eaeaea]"
                                    >
                                      {offering}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </motion.section>
  );
};

const Contact = ({ isDarkMode, onUnsubscribeClick }: { isDarkMode: boolean, onUnsubscribeClick: () => void }) => {
  const skewY = useScrollVelocitySkew();
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [emailError, setEmailError] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fadeStatus, setFadeStatus] = useState<'idle' | 'verifying' | 'success'>('idle');

  const [consentError, setConsentError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let hasError = false;
    
    if (!email) {
      setEmailValid(false);
      setEmailError('Please fill this field');
      hasError = true;
    } else {
      const isOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!isOk) {
        setEmailValid(false);
        setEmailError('Please enter a valid email address');
        hasError = true;
      } else {
        setEmailValid(true);
        setEmailError('');
      }
    }
    
    if (!consent) {
      setConsentError('please tick this box if you want to proceed');
      hasError = true;
    } else {
      setConsentError('');
    }
    
    if (hasError) return;

    setSubmitting(true);
    setFadeStatus('verifying');

    // Option A: Send notification to aris@athenaresiliencegroup.com via secure submission endpoint
    const formPayload = {
      _subject: 'New Newsletter Subscription - Athena Resilience Group',
      _template: 'table',
      _captcha: 'false',
      subscriber_email: email,
      consent_given: consent ? 'Yes (GDPR compliant consent checked)' : 'No',
      submitted_at: new Date().toISOString(),
      source: 'Athena Resilience Intelligence Briefing Form',
    };

    fetch('https://formsubmit.co/ajax/aris@athenaresiliencegroup.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formPayload)
    })
      .catch((err) => {
        console.warn('Notification dispatch encountered an error, falling back:', err);
      })
      .finally(() => {
        setFadeStatus('success');
        setTimeout(() => {
          setSubmitting(false);
          setSuccess(true);
          setEmail('');
          setEmailValid(null);
          setEmailError('');
          setConsent(false);
          setConsentError('');
          setFadeStatus('idle');
        }, 1000);
      });
  };

  return (
    <section id="contact" className="bg-athena-surface text-athena-navy py-48 relative overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Title Label */}
        <div className="mb-16 md:mb-24 border-l-2 border-athena-peach-bright/40 pl-5 flex items-center justify-between">
          <BlockReveal color="#fca71e">
            <span className="text-athena-peach-bright font-display font-semibold uppercase tracking-[0.25em] text-xs sm:text-sm">
              Contact
            </span>
          </BlockReveal>
          <div className="flex-grow h-[1px] bg-gradient-to-r from-athena-navy/5 to-transparent dark:from-white/5 ml-8 hidden sm:block" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 xl:gap-8 2xl:gap-12 items-stretch justify-items-center">
          {/* Contact Info Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ skewY, backgroundColor: isDarkMode ? '#152532' : '#ffffff' }}
            className="p-6 sm:p-8 lg:p-8 xl:p-12 2xl:p-14 rounded-[40px] border border-athena-navy/10 dark:border-white/10 shadow-2xl flex flex-col justify-between items-center text-center lg:items-start lg:text-left w-full max-w-lg mx-auto lg:max-w-none lg:mx-0"
          >
            <div>
              <BlockReveal className="mb-3 mx-auto lg:mx-0">
                <h2 className="font-display text-[26px] sm:text-[30px] md:text-[32px] lg:text-[36px] font-medium tracking-tighter leading-tight [text-wrap:balance] text-athena-navy dark:text-athena-peach">
                  Let's Start a <br />Conversation.
                </h2>
              </BlockReveal>
              <motion.p 
                transition={{ delay: 0.1 }}
                className="text-sm sm:text-base md:text-lg lg:text-sm xl:text-base 2xl:text-lg text-athena-navy dark:text-athena-navy/90 mb-6 leading-relaxed font-jakarta font-light"
              >
                Reach out to learn how we can strengthen your organisation's resilience and commercial impact.
              </motion.p>
            </div>
            
            <div className="space-y-4 w-full">
              <div className="flex flex-col items-center lg:items-start text-athena-navy/70">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-athena-peach mb-2">Direct Inquiry</p>
                <div className="space-y-4 w-full">
                  <a href="mailto:frontdesk@athenaresiliencegroup.com" className="group flex flex-col sm:flex-row items-center gap-4 text-xs sm:text-sm md:text-base lg:text-xs xl:text-sm font-light hover:text-athena-peach transition-all duration-300 w-full justify-center lg:justify-start">
                    <span className="p-2.5 rounded-full bg-athena-navy/5 group-hover:bg-athena-peach group-hover:text-white transition-all duration-300 shrink-0">
                      <Mail size={16} />
                    </span>
                    <span className="text-center lg:text-left whitespace-nowrap">info@athenaresiliencegroup.com</span>
                  </a>
                  
                  <a 
                    id="google-maps-location-link"
                    href="https://www.google.com/maps/place/28is+Oktovriou+75,+Athina+104+34/@37.9924268,23.7316008,18.54z/data=!4m5!3m4!1s0x14a1bd332ffba8a9:0xdc43fe787bb22e55!8m2!3d37.992408!4d23.7312215" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group flex flex-col sm:flex-row items-center gap-4 text-xs sm:text-sm md:text-base lg:text-xs xl:text-sm font-light hover:text-athena-peach transition-all duration-300 w-full justify-center lg:justify-start"
                  >
                    <span className="p-2.5 rounded-full bg-athena-navy/5 group-hover:bg-athena-peach group-hover:text-white transition-all duration-300 shrink-0">
                      <MapPin size={16} className="text-athena-peach group-hover:text-white transition-colors duration-300" />
                    </span>
                    <span className="text-center lg:text-left">Athens Business Hub24, Patision 75, 10434, Athens</span>
                  </a>
                  
                  <a href="tel:+306971994171" className="group flex flex-col sm:flex-row items-center gap-4 text-xs sm:text-sm md:text-base lg:text-xs xl:text-sm font-light hover:text-athena-peach transition-all duration-300 w-full justify-center lg:justify-start">
                    <span className="p-2.5 rounded-full bg-athena-navy/5 group-hover:bg-athena-peach group-hover:text-white transition-all duration-300 shrink-0">
                      <Phone size={16} />
                    </span>
                    <span className="text-center lg:text-left">+30 697 199 4171</span>
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-start gap-3 pt-6 w-full">
                <p className="font-jakarta text-xs sm:text-sm text-athena-navy/60 font-light text-center lg:text-left">
                  Join our community for the latest buzz:
                </p>
                <div className="flex justify-center lg:justify-start gap-4">
                  <a href="#" className="group w-12 h-12 rounded-full border border-athena-navy/10 flex items-center justify-center text-athena-navy hover:bg-athena-peach hover:text-white hover:border-athena-peach transition-all duration-500">
                    <Linkedin size={18} className="transition-transform duration-300 group-hover:rotate-12" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Careers Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ skewY, backgroundColor: isDarkMode ? '#152532' : '#ffffff' }}
            transition={{ delay: 0.1 }}
            className="p-6 sm:p-8 lg:p-8 xl:p-12 2xl:p-14 rounded-[40px] border border-athena-navy/10 dark:border-white/10 shadow-2xl flex flex-col justify-between items-center text-center lg:items-start lg:text-left w-full max-w-lg mx-auto lg:max-w-none lg:mx-0"
          >
            <div>
              <BlockReveal className="mb-3 mx-auto lg:mx-0">
                <h3 className="font-display text-[26px] sm:text-[30px] md:text-[32px] lg:text-[36px] font-medium tracking-tighter leading-tight text-athena-navy dark:text-athena-peach">
                  Careers
                </h3>
              </BlockReveal>
              <p className="text-sm sm:text-base md:text-lg lg:text-sm xl:text-base 2xl:text-lg text-athena-navy dark:text-athena-navy/90 mb-4 leading-relaxed font-jakarta font-light">
                For further guidance or collaboration, feel free to reach out to our team.
              </p>
              <p className="text-[11px] sm:text-xs md:text-sm lg:text-[11px] xl:text-xs 2xl:text-sm text-athena-navy/70 dark:text-athena-navy/60 font-jakarta font-light leading-relaxed">
                Our culture is built on the collective intelligence of diverse thinkers dedicated to building enduring enterprises. We seek purpose-driven professionals eager to navigate the world’s most complex systemic risks and play a pivotal role in architecting, implementing, and securing sustainable futures for our clients. To join our mission, please submit your CV and a cover letter to get started.
              </p>
            </div>
            
            <div className="mt-8 pt-8 border-t border-athena-navy/5 w-full text-center flex flex-col items-center justify-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-athena-navy/40 dark:text-athena-peach mb-2 text-center">Talent Acquisition</p>
              <a href="mailto:enquiries@athenaresiliencegroup.com?subject=Strategic%20Advisory%20Inquiry%20-%20Athena%20Resilience%20Group&body=Dear%20Athena%20Resilience%20Team%2C%0D%0A%0D%0AI%20am%20writing%20to%20express%20my%20interest%20in%20furthering%20my%20professional%20opportunities%20with%20Athena%20Resilience%20Group.%20Please%20find%20my%20details%20attached.%0D%0A%0D%0ABest%20regards%2C%0D%0A%5BYour%20Name%5D" className="group flex items-center justify-center gap-3 text-athena-navy hover:text-athena-peach transition-colors w-full">
                <Mail size={16} className="text-athena-peach" />
                <span className="font-jakarta font-medium text-xs sm:text-sm lg:text-[10px] xl:text-xs 2xl:text-sm">enquiries@athenaresiliencegroup.com</span>
              </a>
            </div>
          </motion.div>

          {/* Newsletter Column */}
          <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ skewY, backgroundColor: isDarkMode ? '#152532' : '#ffffff' }}
            transition={{ delay: 0.2 }}
            className="p-6 sm:p-8 lg:p-8 xl:p-12 2xl:p-14 rounded-[40px] border border-athena-navy/10 dark:border-white/10 shadow-2xl flex flex-col items-center text-center lg:items-start lg:text-left w-full max-w-lg mx-auto lg:max-w-none lg:mx-0 overflow-hidden"
          >
            <BlockReveal className="mb-6 mx-auto lg:mx-0">
              <h3 className="font-display text-[26px] sm:text-[30px] md:text-[32px] lg:text-[36px] font-medium tracking-tighter leading-tight text-athena-navy dark:text-athena-peach">
                Intelligence Briefing
              </h3>
            </BlockReveal>
            <p className="text-sm sm:text-base md:text-lg lg:text-sm xl:text-base 2xl:text-lg text-athena-navy dark:text-athena-navy/90 mb-3 leading-relaxed font-jakarta font-light">Subscribe to receive every now and then (no spam, we promise) our periodic insights on resilience, strategy, and global dynamics.</p>
            <button
              type="button"
              onClick={onUnsubscribeClick}
              className="text-athena-navy dark:text-athena-navy/90 mb-4 text-xs sm:text-sm lg:text-xs xl:text-xs 2xl:text-sm font-jakarta leading-relaxed mt-1 underline decoration-athena-peach/40 hover:decoration-athena-peach hover:text-athena-peach transition-all cursor-pointer text-center lg:text-left focus:outline-none"
            >
              You can unsubscribe at any time.
            </button>
            
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div 
                  key="success-container"
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-auto py-3 px-6 text-center flex items-center justify-center gap-2.5 w-fit mx-auto bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20 shadow-[0_4px_25px_rgba(16,185,129,0.15)] select-none"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                    ✓
                  </span>
                  <span className="font-sans font-bold text-xs uppercase tracking-wider">Briefing Confirmed</span>
                </motion.div>
              ) : (
                <motion.form 
                  key="form-container"
                  layout
                  noValidate
                  onSubmit={handleSubmit} 
                  className="space-y-4 mt-auto w-full text-left"
                >
                  <div className="space-y-1 text-left relative">
                    <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-athena-navy/60 dark:text-athena-peach ml-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEmail(val);
                        if (!val) {
                          setEmailValid(null);
                          setEmailError('');
                        } else {
                          const isOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
                          setEmailValid(isOk);
                          setEmailError(isOk ? '' : 'Please enter a valid email address');
                        }
                      }}
                      className={`w-full bg-transparent border rounded-2xl px-5 xl:px-6 py-3 xl:py-4 focus:outline-none focus:bg-athena-navy/5 transition-all duration-500 placeholder:opacity-50 text-xs sm:text-sm lg:text-xs xl:text-sm text-athena-navy dark:text-athena-navy dark:placeholder:text-athena-navy/30 ${
                        emailValid === null 
                          ? 'border-athena-peach/40 focus:border-athena-peach' 
                          : emailValid 
                            ? 'border-emerald-500/60 focus:border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/5' 
                            : 'border-rose-400/60 focus:border-rose-400 bg-rose-400/5 dark:bg-rose-400/5'
                      }`}
                    />
                    <AnimatePresence>
                      {emailError && (
                        <motion.p
                          initial={{ opacity: 0, y: -8, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: -8, height: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="text-[10px] text-rose-400/90 font-medium pl-1 mt-1 font-jakarta leading-normal"
                        >
                          {emailError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-start gap-3 text-left">
                      <input 
                        type="checkbox" 
                        id="consent" 
                        className="mt-1.5 accent-athena-peach cursor-pointer" 
                        checked={consent}
                        onChange={(e) => {
                          setConsent(e.target.checked);
                          if (e.target.checked) {
                            setConsentError('');
                          }
                        }}
                      />
                      <label htmlFor="consent" className="text-[9px] sm:text-[10px] text-athena-navy dark:text-athena-navy/80 leading-relaxed cursor-pointer select-none">
                        I consent to my personal data being used by Athena Resilience Group to provide relevant insights and information.
                      </label>
                    </div>
                    <AnimatePresence>
                      {consentError && (
                        <motion.p
                          initial={{ opacity: 0, y: -8, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: -8, height: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="text-[10px] text-rose-400/90 font-medium pl-7 mt-1 font-jakarta leading-normal"
                        >
                          {consentError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <button 
                    type="submit"
                    disabled={submitting || emailValid === false}
                    className="w-full bg-athena-peach text-athena-navy font-bold py-3.5 xl:py-4 text-xs sm:text-sm xl:text-base rounded-2xl hover:bg-athena-navy hover:text-athena-cream dark:hover:text-athena-cream hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer overflow-hidden relative min-h-[46px] sm:min-h-[50px]"
                  >
                    <AnimatePresence mode="wait">
                      {fadeStatus === 'idle' && (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                          Join the Briefing
                        </motion.span>
                      )}
                      {fadeStatus === 'verifying' && (
                        <motion.span
                          key="verifying"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="flex items-center gap-2"
                        >
                          Verifying details...
                        </motion.span>
                      )}
                      {fadeStatus === 'success' && (
                        <motion.span
                          key="success"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="text-white flex items-center gap-1.5"
                        >
                          ✓ Subscription Confirmed
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      
      {/* Background Logo Decoration */}
      <div className="absolute -bottom-48 -left-48 opacity-[0.05] rotate-12 pointer-events-none">
        <Logo size={800} color="var(--athena-navy)" />
      </div>
    </section>
  );
};

const SectionSeparator = () => (
  <div className="w-full h-[1px] bg-athena-peach/30 dark:bg-athena-peach/20" />
);

const Footer = ({ onCookiesPolicyClick, onPrivacyNoticeClick, onTermsClick }: { onCookiesPolicyClick: () => void, onPrivacyNoticeClick: () => void, onTermsClick: () => void }) => {
  return (
    <footer className="py-8 border-t border-athena-navy/5 relative z-10 bg-athena-cream text-athena-navy">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 items-center gap-6">
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <Logo size={28} color="var(--athena-navy)" />
          <span className="font-sans font-bold text-xs tracking-tight uppercase leading-[1.15] text-left">
            Athena<br />Resilience<br />Group
          </span>
        </div>
        
        <div className="flex justify-center">
          <div className="flex gap-6 sm:gap-8 items-center justify-center">
            <button 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                onPrivacyNoticeClick();
              }}
              className="text-[10px] font-sans font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity cursor-pointer focus:outline-none"
            >
              Privacy Notice
            </button>
            <button 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                onTermsClick();
              }}
              className="text-[10px] font-sans font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity cursor-pointer focus:outline-none"
            >
              Terms
            </button>
            <button 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                onCookiesPolicyClick();
              }}
              className="text-[10px] font-sans font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity cursor-pointer focus:outline-none"
            >
              Cookies Policy
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-0.5">
          <span className="text-[8px] opacity-40 font-jakarta">Created by nono</span>
          <span className="text-[9px] opacity-80 font-jakarta text-center md:text-right">
            © 2026 Athena Resilience Group.<br className="hidden md:inline lg:hidden" /> All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

// --- Special Cookie Translations for GDPR & CPRA ---
const cookieTranslations = {
  EN: {
    title: "Manage Cookies",
    adjustTitle: "Adjusting Consent Preferences",
    situation: "Situation",
    essentials: "Essentials",
    essentialsDesc: "Necessary cookies contribute to the usability of the website, enabling basic functions such as page navigation and access to secure areas. The website cannot function properly without these cookies.",
    analytics: "Analytics & Statistics",
    analyticsDesc: "Analytical cookies help us understand how visitors interact with our website, gathering anonymous statistics on visits and improving performance.",
    advertising: "Advertising & Marketing",
    advertisingDesc: "Advertising cookies track visitors across websites to deliver personalized, relevant ads, helping us maintain custom interactions.",
    alwaysActive: "Always active",
    active: "Active",
    inactive: "Inactive",
    details: "Consent Details",
    date: "Consent date",
    consentId: "Your consent ID",
    copied: "Copied!",
    copy: "Copy ID",
    adjustBtn: "Consent Adjustment",
    acceptAllBtn: "Accept All",
    rejectAllBtn: "Reject All",
    saveBtn: "Save Preferences",
    closeBtn: "Closure",
    storageBtn: "Storage",
    generallyTitle: "Generally & Legal Compliance (GDPR & CPRA)",
    generallyDesc1: "We use cookies to help you navigate effectively and perform certain functions. You will find detailed information about all cookies under each category below.",
    generallyDesc2: "Cookies categorized as necessary are stored on your browser as they are essential for the basic functionalities of our website, compliant with GDPR & CPRA.",
    generallyDesc3: "We also use third-party statistical and advertising cookies with your explicit, prior, and reversible consent. You can withdraw your consent at any time.",
    generallyDesc4: "Under the GDPR & CPRA guidelines, you have the right to accept all, decline all non-essential cookies, or fine-tune your settings.",
    providersTitle: "Marketing & Analytics providers we use",
    providerLinktext: "Provider privacy policy",
    successMsg: "Preferences updated!"
  }
};

const formatDateForLang = (d: Date, lang: 'EN' | 'GR' = 'EN') => {
  const day = d.getDate();
  const monthsEN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsGR = ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μάι', 'Ιούν', 'Ιούλ', 'Αύγ', 'Σεπ', 'Οκτ', 'Νοέ', 'Δεκ'];
  const month = lang === 'GR' ? monthsGR[d.getMonth()] : monthsEN[d.getMonth()];
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  const ampm = lang === 'GR' 
    ? (hours >= 12 ? 'μ.μ.' : 'π.μ.')
    : (hours >= 12 ? 'p.m.' : 'a.m.');
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${day} ${month} ${year} - ${hours}:${minutes}:${seconds} ${ampm}`;
};

// --- Main App ---

export default function App() {
  const [isCookieOpen, setIsCookieOpen] = useState(false);
  const [isAdjustingConsent, setIsAdjustingConsent] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [cookieToast, setCookieToast] = useState(false);
  const cookieLang = 'EN';
  const [cookieSettings, setCookieSettings] = useState(() => {
    const saved = safeLocalStorage.getItem('athena_cookie_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          id: parsed.id || '1ERD' + Math.random().toString(36).substring(2, 11).toUpperCase(),
          date: parsed.date || formatDateForLang(new Date(), 'EN'),
          advertising: parsed.advertising !== undefined ? !!parsed.advertising : false,
          analytics: parsed.analytics !== undefined ? !!parsed.analytics : false
        };
      } catch (e) {
        // ignore
      }
    }
    
    const randId = '1ERD' + Array.from({ length: 28 }, () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      return chars.charAt(Math.floor(Math.random() * chars.length));
    }).join('');
    
    return {
      id: randId,
      date: formatDateForLang(new Date(), 'EN'),
      advertising: false,
      analytics: false
    };
  });

  const handleAcceptAllCookies = () => {
    const updated = {
      ...cookieSettings,
      date: formatDateForLang(new Date(), cookieLang),
      advertising: true,
      analytics: true
    };
    setCookieSettings(updated);
    safeLocalStorage.setItem('athena_cookie_settings', JSON.stringify(updated));
    setIsCookieOpen(false);
    setIsAdjustingConsent(false);
    setCookieToast(true);
    setTimeout(() => setCookieToast(false), 3000);
  };

  const handleRejectAllCookies = () => {
    const updated = {
      ...cookieSettings,
      date: formatDateForLang(new Date(), cookieLang),
      advertising: false,
      analytics: false
    };
    setCookieSettings(updated);
    safeLocalStorage.setItem('athena_cookie_settings', JSON.stringify(updated));
    setIsCookieOpen(false);
    setIsAdjustingConsent(false);
    setCookieToast(true);
    setTimeout(() => setCookieToast(false), 3000);
  };

  const handleSaveCookieSettings = () => {
    const updated = {
      ...cookieSettings,
      date: formatDateForLang(new Date(), cookieLang)
    };
    setCookieSettings(updated);
    safeLocalStorage.setItem('athena_cookie_settings', JSON.stringify(updated));
    setIsCookieOpen(false);
    setIsAdjustingConsent(false);
    setCookieToast(true);
    setTimeout(() => setCookieToast(false), 3000);
  };

  const [isMobile, setIsMobile] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLoading, setIsLoading] = useState(() => {
    return !safeSessionStorage.getItem('athena_preloader_seen');
  });
  const [hasHoverSupport, setHasHoverSupport] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 650);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(hover: hover)');
      setHasHoverSupport(media.matches);
      const listener = (e: MediaQueryListEvent) => setHasHoverSupport(e.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const [showLeadership, setShowLeadership] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [showPartners, setShowPartners] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [hoveredAdvisor, setHoveredAdvisor] = useState<number | null>(null);
  const [showCookiesPolicy, setShowCookiesPolicy] = useState(false);
  const [showUnsubscribe, setShowUnsubscribe] = useState(false);
  const [showUnsubscribeDropdown, setShowUnsubscribeDropdown] = useState(false);
  const unsubscribeScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showUnsubscribe) {
      setShowUnsubscribeDropdown(false);
    }
  }, [showUnsubscribe]);

  useEffect(() => {
    if (showUnsubscribeDropdown) {
      setTimeout(() => {
        if (unsubscribeScrollRef.current) {
          unsubscribeScrollRef.current.scrollTo({
            top: unsubscribeScrollRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 350);
    }
  }, [showUnsubscribeDropdown]);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (showLeadership || showTeam || showPartners || selectedArticle || showArchive || isCookieOpen || showCookiesPolicy || showUnsubscribe || showPrivacyPolicy || showTerms) {
      document.body.style.overflow = 'hidden';
      lenisRef.current?.stop();
    } else {
      document.body.style.overflow = 'unset';
      lenisRef.current?.start();
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLeadership, showTeam, showPartners, selectedArticle, showArchive, isCookieOpen, showCookiesPolicy, showUnsubscribe, showPrivacyPolicy, showTerms]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = safeLocalStorage.getItem('theme');
    if (saved) return saved === 'dark';
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useLayoutEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      safeLocalStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      safeLocalStorage.setItem('theme', 'light');
    }

    // Dynamic browser integration (theme-color meta tag)
    if (typeof window !== 'undefined' && window.document) {
      let metaThemeColor = window.document.querySelector('meta[name="theme-color"]');
      if (!metaThemeColor) {
        metaThemeColor = window.document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        window.document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.setAttribute('content', isDarkMode ? '#152532' : '#ffffff');
    }
  }, [isDarkMode]);

  const toggleDarkMode = (event?: React.MouseEvent) => {
    if (!event || !document.startViewTransition) {
      setIsDarkMode(!isDarkMode);
      return;
    }

    const { clientX, clientY } = event;
    const transition = document.startViewTransition(() => {
      setIsDarkMode(!isDarkMode);
    });

    transition.ready.then(() => {
      const endRadius = Math.hypot(
        Math.max(clientX, window.innerWidth - clientX),
        Math.max(clientY, window.innerHeight - clientY)
      );

      document.documentElement.animate(
        [
          { clipPath: `circle(0px at ${clientX}px ${clientY}px)` },
          { clipPath: `circle(${endRadius}px at ${clientX}px ${clientY}px)` }
        ],
        {
          duration: 750,
          easing: "cubic-bezier(0.25, 1, 0.5, 1)",
          pseudoElement: "::view-transition-new(root)"
        }
      );
    });
  };

  const { scrollYProgress } = useScroll();

  useLayoutEffect(() => {
    document.documentElement.style.position = 'relative';
    document.body.style.position = 'relative';
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
      infinite: false,
      syncTouch: true,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
  
  const lightBgRange = ['#FFFFFF', '#FFFFFF', '#F8F8F8', '#F8F8F8', '#F0F0F0', '#F0F0F0', '#FFFFFF'];
  const darkBgRange = ['#0B151F', '#0B151F', '#111d29', '#111d29', '#152532', '#152532', '#0B151F'];

  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.15, 0.25, 0.45, 0.55, 0.85, 0.95],
    isDarkMode ? darkBgRange : lightBgRange
  );

  return (
    <div className="relative bg-athena-cream min-h-screen font-sans selection:bg-athena-peach/30">
      <NoiseTexture isDarkMode={isDarkMode} />
      <GooeyFilter />
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <motion.div 
        style={{ backgroundColor: bgColor }}
        className="relative selection:bg-athena-peach selection:text-athena-navy transition-colors duration-1000"
      >
        <CustomCursor />
        <CursorBeacon />
        <ScrollProgress />
        <IntelligenceLens isOpen={isSearchOpen} />
        <Navbar 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode} 
          isSearchOpen={isSearchOpen} 
          setIsSearchOpen={setIsSearchOpen} 
          setShowLeadership={setShowLeadership}
          setShowTeam={setShowTeam}
          setShowPartners={setShowPartners}
        />
        <main className="relative">
          <Hero isDarkMode={isDarkMode} isLoading={isLoading} />
          <SectionSeparator />
          <About setShowLeadership={setShowLeadership} setShowTeam={setShowTeam} setShowPartners={setShowPartners} isDarkMode={isDarkMode} />
          <StickyScrollServices setShowLeadership={setShowLeadership} setShowTeam={setShowTeam} setShowPartners={setShowPartners} isDarkMode={isDarkMode} />
          <SectionSeparator />
          <Process isDarkMode={isDarkMode} />
          {SHOW_THOUGHT_LEADERSHIP && (
            <>
              <ThoughtLeadershipAccordion 
                isDarkMode={isDarkMode} 
                onArticleSelect={(id) => setSelectedArticle(id)} 
                onShowArchive={() => setShowArchive(true)}
              />
              <SectionSeparator />
            </>
          )}
          <Contact isDarkMode={isDarkMode} onUnsubscribeClick={() => setShowUnsubscribe(true)} />
        </main>
        <Footer onCookiesPolicyClick={() => setShowCookiesPolicy(true)} onPrivacyNoticeClick={() => setShowPrivacyPolicy(true)} onTermsClick={() => setShowTerms(true)} />

      {/* Global Side Popups */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleView 
            onClose={() => {
              setSelectedArticle(null);
              setShowArchive(true);
            }} 
            onStartConversation={() => {
              setSelectedArticle(null);
              setShowArchive(false);
              setTimeout(() => {
                const contact = document.getElementById('contact');
                if (contact) {
                  contact.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
            isDarkMode={isDarkMode} 
          />
        )}
        {showArchive && (
          <ArchiveView 
            onClose={() => setShowArchive(false)} 
            onSelectArticle={(id) => {
              setShowArchive(false);
              setSelectedArticle(id);
            }}
            isDarkMode={isDarkMode}
          />
        )}
        {showLeadership && (
          <motion.div 
            key="leadership-popup"
            initial={isMobile ? { y: '100%', x: 0, skewY: 4 } : { x: '100%', y: 0, skewX: -3 }}
            animate={isMobile ? { y: 0, x: 0, skewY: 0 } : { x: 0, y: 0, skewX: 0 }}
            exit={isMobile ? { y: '100%', x: 0, skewY: -4 } : { x: '100%', y: 0, skewX: 3 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            style={{ 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden', 
              transformStyle: 'preserve-3d' 
            }}
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label="Leadership Details Panel"
            className="fixed bottom-0 md:top-0 right-0 w-full md:w-[600px] h-[100dvh] bg-athena-surface z-[70] shadow-2xl flex flex-col overflow-hidden rounded-t-[32px] md:rounded-t-none md:rounded-l-3xl border border-athena-navy ring-2 ring-athena-peach"
          >
            <div className="sticky top-0 bg-athena-surface/95 backdrop-blur-md z-10 px-6 py-5 md:px-12 md:py-8 flex justify-between items-center border-b border-athena-navy/10 shrink-0">
              <h3 className="text-3xl font-display font-medium">Leadership</h3>
              <button 
                onClick={() => setShowLeadership(false)} 
                className="p-2.5 bg-athena-navy/5 hover:bg-athena-navy/10 hover:scale-105 active:scale-95 text-athena-navy rounded-full transition-all flex items-center justify-center border border-athena-navy/10"
                aria-label="Close panel"
              >
                <X size={20} className="stroke-[2.5]" />
              </button>
            </div>
            
            <div 
              style={{ WebkitOverflowScrolling: 'touch' }}
              className="flex-1 overflow-y-auto p-6 md:p-12 scrollbar-hide overscroll-contain touch-pan-y"
            >
              <div className="flex gap-6 items-start flex-col sm:flex-row">
                <div className="flex flex-col items-center gap-3 shrink-0 mx-auto sm:mx-0">
                  <ProgressiveImage 
                    src="https://img.cosmeticsandtoiletries.com/files/base/allured/all/image/2022/07/AV_2.3_Panel_174.62c8a459427cd.png?auto=format%2Ccompress&dpr=2&q=70&w=700" 
                    alt="Aris Vrettos" 
                    className="w-32 h-32 rounded-full border border-athena-navy/10"
                  />
                  <div className="flex gap-2">
                    <RippleAnchor href="mailto:aris@athenaresiliencegroup.com" className="w-8 h-8 rounded-full bg-[#152532] text-white flex items-center justify-center hover:bg-athena-peach transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach focus-visible:ring-offset-1">
                      <Mail size={14} />
                    </RippleAnchor>
                    <RippleAnchor href="https://www.linkedin.com/in/aris-vrettos/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#152532] text-white flex items-center justify-center hover:bg-athena-peach transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach focus-visible:ring-offset-1">
                      <Linkedin size={14} />
                    </RippleAnchor>
                  </div>
                </div>
                <div className="flex-1 w-full p-5 sm:p-6 rounded-xl border border-[#152532]/10 dark:border-white/10 bg-[#152532]/[0.01] dark:bg-white/[0.01]">
                  <p className="text-2xl font-display font-medium mb-3 text-center sm:text-left">Aris Vrettos</p>
                  <p className="text-sm leading-relaxed opacity-80">
                    Athena Resilience Group is led by Aris Vrettos. A trained economist and trusted advisor and educator to boards and CEOs, Aris has held senior positions in business and academia and worked closely with prominent leaders in science, policy, business, investment and civil society. 
                    <br/><br/>
                    His roles include the Director for Sustainability Strategy and Transformation at Croda International, a FTSE 100 global manufacturing business; Director of the Centre for Business Transformation at the University of Cambridge Institute for Sustainability Leadership (CISL); Global Director of the HRH Prince of Wales’s Business & Sustainability Programme; and Senior Advisor at the pioneering think-tank AccountAbility.
                    <br/><br/>
                    Aris has been involved in the development and adoption of key international frameworks and initiatives around the world and continues to speak and teach on his mission to mobilise progress towards a sustainable economy.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {showTeam && (
          <motion.div 
            key="team-popup"
            initial={isMobile ? { y: '100%', x: 0, skewY: 4 } : { x: '100%', y: 0, skewX: -3 }}
            animate={isMobile ? { y: 0, x: 0, skewY: 0 } : { x: 0, y: 0, skewX: 0 }}
            exit={isMobile ? { y: '100%', x: 0, skewY: -4 } : { x: '100%', y: 0, skewX: 3 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            style={{ 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden', 
              transformStyle: 'preserve-3d' 
            }}
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label="Board of Advisors Details Panel"
            className="fixed bottom-0 md:top-0 right-0 w-full md:w-[600px] h-[100dvh] bg-athena-surface z-[70] shadow-2xl flex flex-col overflow-hidden rounded-t-[32px] md:rounded-t-none md:rounded-l-3xl border border-athena-navy ring-2 ring-athena-peach"
          >
            <div className="sticky top-0 bg-athena-surface/95 backdrop-blur-md z-10 px-6 py-5 md:px-12 md:py-8 flex justify-between items-center border-b border-athena-navy/10 shrink-0">
              <h3 className="text-3xl font-display font-medium">Board of Advisors</h3>
              <button 
                onClick={() => setShowTeam(false)} 
                className="p-2.5 bg-athena-navy/5 hover:bg-athena-navy/10 hover:scale-105 active:scale-95 text-athena-navy rounded-full transition-all flex items-center justify-center border border-athena-navy/10"
                aria-label="Close panel"
              >
                <X size={20} className="stroke-[2.5]" />
              </button>
            </div>

            <div 
              style={{ WebkitOverflowScrolling: 'touch' }}
              className="flex-1 overflow-y-auto p-6 md:p-12 scrollbar-hide overscroll-contain space-y-8 touch-pan-y"
            >
              <div className="space-y-4">
                <p className="text-sm leading-relaxed opacity-70">
                  Athena’s Board of Advisors provide strategic guidance, intellectual challenge, and deep, applied expertise — ensuring our work remains rigorous, futurefocused, and grounded in the realities of global markets and planetary boundaries.
                </p>
                <p className="text-sm leading-relaxed opacity-70">
                  Our Board brings together global leaders in business, AI, economics, innovation, sustainability, and systems change.
                </p>
                <p className="text-sm leading-relaxed opacity-70">
                  Each member has shaped major institutions, influenced global policy, and led transformative work across sectors and geographies.
                </p>
              </div>
              
              <div className="grid gap-6">
                {[
                  { name: "Katherine Chou", role: "VP Research, Google", desc: "A global technology leader shaping breakthrough innovation across AI, health, climate, and science. Katherine brings deep insight into how emerging technologies will transform markets, supply chains, and sustainability expectations.", image: "https://storage.googleapis.com/gweb-developer-goog-blog-assets/images/Katherine.original.png", linkedin: "https://www.linkedin.com/in/katherinechou/" },
                  { name: "Dimitri Zenghelis", role: "Senior Visiting Fellow, LSE", desc: "One of the world’s foremost climate economists. Dimitri advises governments, financial institutions, and global organisations on sustainable growth, macroeconomics, and the transition to a resilient, low‑carbon economy", image: "https://www.bennettschool.cam.ac.uk/wp-content/uploads/2020/12/Dimitri.jpg", linkedin: "https://www.linkedin.com/in/dimitri-zenghelis-2a378517/" },
                  { name: "Håkan Nordkvist", role: "Former Head of Sustainability Innovation, IKEA", desc: "A pioneer of circular business models and clean‑energy innovation. Håkan built IKEA’s global clean‑energy business and led the development of new circular services and business models.", image: "https://www.spacegroup.co.uk/assets/_/2023/07/04/4584e26c-3d82-40f4-b248-48674193a67d/shift-hakan-nordkvist-talk-1-4x3.jpg?fit=crop&crop=3713,3686,1202,0&v=1", linkedin: "https://www.linkedin.com/in/h%C3%A5kan-nordkvist-65407820/" },
                  { name: "Alejandro Litovsky", role: "Founder & CEO, Earth Security Group", desc: "A global expert in natural capital, sustainable finance, and geopolitical resilience. Alejandro helps organisations build partnerships and investment strategies that align commercial value with planetary resilience.", image: "https://cdn.prod.website-files.com/649d0878144d1c4393b09cea/649d0878144d1c4393b09e64_630dd04a22283fa49dcaa0f5_Alejandro-Crop-.png", linkedin: "https://www.linkedin.com/in/alejandrolitovsky?originalSubdomain=uk" }
                ].map((member, i) => (
                  <motion.div 
                    key={`member-${i}`} 
                    onMouseEnter={() => { if (hasHoverSupport) setHoveredAdvisor(i); }}
                    onMouseLeave={() => { if (hasHoverSupport) setHoveredAdvisor(null); }}
                    onClick={() => setHoveredAdvisor(hoveredAdvisor === i ? null : i)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setHoveredAdvisor(hoveredAdvisor === i ? null : i);
                      }
                    }}
                    tabIndex={0}
                    className="border-b border-athena-navy/5 pb-3 flex flex-col gap-2 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach focus-visible:ring-offset-2 rounded px-2"
                  >
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-display font-medium">{member.name}</p>
                          <motion.div
                            animate={{ rotate: hoveredAdvisor === i ? 90 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronRight size={14} className="text-athena-peach opacity-50 group-hover:opacity-100" />
                          </motion.div>
                        </div>
                        <p className="text-xs text-athena-peach font-sans font-medium mb-1">{member.role}</p>
                      </div>
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <ProgressiveImage 
                          src={member.image || `https://picsum.photos/seed/${member.name.replace(/\s/g, '')}/200`} 
                          alt={member.name} 
                          className="w-16 h-16 rounded-full border border-athena-navy/5"
                        />
                        <div className="flex gap-1.5">
                          <RippleAnchor href={member.linkedin || "https://linkedin.com"} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-[#152532] text-white flex items-center justify-center hover:bg-athena-peach transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-athena-peach focus-visible:ring-offset-1">
                            <Linkedin size={10} />
                          </RippleAnchor>
                        </div>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {hoveredAdvisor === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 120, damping: 16 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm opacity-70 leading-relaxed pt-1">
                            {member.desc}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {showPartners && (
          <motion.div 
            key="partners-popup"
            initial={isMobile ? { y: '100%', x: 0, skewY: 4 } : { x: '100%', y: 0, skewX: -3 }}
            animate={isMobile ? { y: 0, x: 0, skewY: 0 } : { x: 0, y: 0, skewX: 0 }}
            exit={isMobile ? { y: '100%', x: 0, skewY: -4 } : { x: '100%', y: 0, skewX: 3 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            style={{ 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden', 
              transformStyle: 'preserve-3d' 
            }}
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label="Strategic Partners Details Panel"
            className="fixed bottom-0 md:top-0 right-0 w-full md:w-[600px] h-[100dvh] bg-athena-surface z-[70] shadow-2xl flex flex-col overflow-hidden rounded-t-[32px] md:rounded-t-none md:rounded-l-3xl border border-athena-navy ring-2 ring-athena-peach"
          >
            <div className="sticky top-0 bg-athena-surface/95 backdrop-blur-md z-10 px-6 py-5 md:px-12 md:py-8 flex justify-between items-center border-b border-athena-navy/10 shrink-0">
              <h3 className="text-3xl font-display font-medium">Our Partners</h3>
              <button 
                onClick={() => setShowPartners(false)} 
                className="p-2.5 bg-athena-navy/5 hover:bg-athena-navy/10 hover:scale-105 active:scale-95 text-athena-navy rounded-full transition-all flex items-center justify-center border border-athena-navy/10"
                aria-label="Close panel"
              >
                <X size={20} className="stroke-[2.5]" />
              </button>
            </div>
            
            <div 
              style={{ WebkitOverflowScrolling: 'touch' }}
              className="flex-1 overflow-y-auto p-6 md:p-12 scrollbar-hide overscroll-contain space-y-6 touch-pan-y"
            >
              <p className="opacity-70 text-sm leading-relaxed">Athena collaborates with a curated network of leading specialists, scientists, policy experts, and leadership educators.</p>
              <div className="grid grid-cols-2 gap-4">
                {['CISL', 'EoB', 'AIC', 'Sargia', 'Earth Security'].map((partner, i) => (
                  <div 
                    key={`partner-${i}`} 
                    className={`h-32 rounded-athena flex items-center justify-center font-display font-medium text-xl opacity-90 hover:opacity-100 transition-all duration-300 cursor-default p-6 border border-athena-navy/5 shadow-sm ${
                      partner === 'AIC' || partner === 'Sargia' ? 'bg-[#152532]' : 'bg-white'
                    }`}
                  >
                    {partner === 'CISL' ? (
                      <img 
                        src="https://www.cisl.cam.ac.uk/files/media/cisl-logo-transparent.png" 
                        alt="CISL Logo" 
                        className="max-h-full max-w-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : partner === 'EoB' ? (
                      <img 
                        src="https://osuny-1b4da.kxcdn.com/v5mpxdkyb2kbgt56dozr407ae5gg?format=webp&width=792&height=0&&fit=inside&quality=50" 
                        alt="EoB Logo" 
                        className="max-h-full max-w-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : partner === 'AIC' ? (
                      <img 
                        src="https://www.agindustries.org.uk/assets/img/logo.png" 
                        alt="AIC Logo" 
                        className="max-h-full max-w-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : partner === 'Sargia' ? (
                      <img 
                        src="https://www.sargiapartners.com/wp-content/uploads/2025/12/srg-logo.svg" 
                        alt="Sargia Logo" 
                        className="max-h-full max-w-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : partner === 'Earth Security' ? (
                      <img 
                        src="https://earthsecuritygroup.com/wp-content/themes/esg-new/dist/src/assets/logo-46db635b.svg" 
                        alt="Earth Security Logo" 
                        className="max-h-full max-w-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : partner}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {showCookiesPolicy && (
          <motion.div 
            key="cookies-policy-popup"
            initial={isMobile ? { y: '100%', opacity: 1 } : { scale: 0.95, opacity: 0, y: '-40%', x: '-50%' }}
            animate={isMobile ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1, y: '-50%', x: '-50%' }}
            exit={isMobile ? { y: '100%', opacity: 1 } : { scale: 0.95, opacity: 0, y: '-40%', x: '-50%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            style={isMobile ? { 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden', 
              transformStyle: 'preserve-3d' 
            } : {
              top: '50%',
              left: '50%',
              position: 'fixed',
              zIndex: 70
            }}
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label="Cookies Policy Details Panel"
            className={isMobile 
              ? `fixed bottom-0 left-0 right-0 w-full h-[85vh] ${isDarkMode ? 'bg-[#111D29] border-white/20' : 'bg-white border-[#152532]/20'} z-[70] shadow-2xl flex flex-col overflow-hidden rounded-t-[32px] border-t border-r border-l`
              : `fixed w-[720px] max-w-[90vw] h-[80vh] max-h-[750px] ${isDarkMode ? 'bg-[#111D29] border-white/25 ring-white/5' : 'bg-white border-[#152532]/25 ring-[#152532]/5'} z-[70] shadow-2xl flex flex-col overflow-hidden rounded-2xl border ring-4`
            }
          >
            <div className={`sticky top-0 ${isDarkMode ? 'bg-[#111D29]/95 border-white/10' : 'bg-white/95 border-[#152532]/10'} backdrop-blur-md z-10 px-6 py-5 md:px-10 md:py-6 flex justify-between items-center border-b shrink-0`}>
              <div>
                <h3 className={`text-2xl font-display font-bold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>Cookies Policy</h3>
                <p className={`text-xs font-sans ${isDarkMode ? 'text-[#E8E6E3]/70' : 'text-[#152532]/70'}`}>Athena Resilience Group</p>
              </div>
              <button 
                onClick={() => setShowCookiesPolicy(false)} 
                className={`p-2.5 ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-[#88c9c4] border-white/10' : 'bg-[#152532]/5 hover:bg-[#152532]/10 text-[#152532] border-[#152532]/10'} rounded-full transition-all flex items-center justify-center border cursor-pointer hover:scale-105 active:scale-95`}
                aria-label="Close dialog"
              >
                <X size={20} className="stroke-[2.5]" />
              </button>
            </div>
            
            <div 
              data-lenis-prevent
              className={`flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide overscroll-contain touch-pan-y space-y-8 ${isDarkMode ? 'text-[#E8E6E3]' : 'text-[#152532]'}`}
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {/* Dates */}
              <div className={`flex flex-wrap gap-4 text-xs font-sans border-b pb-4 ${isDarkMode ? 'text-[#E8E6E3] border-white/10' : 'text-[#152532] border-[#152532]/10'}`}>
                <div>
                  <span className={`font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>Effective Date:</span> March 31, 2026
                </div>
                <div className="hidden sm:block opacity-40">|</div>
                <div>
                  <span className={`font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>Last Updated:</span> March 31, 2026
                </div>
              </div>

              {/* What are cookies */}
              <section className="space-y-3">
                <h4 className={`text-lg font-display font-semibold text-left ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>What are cookies?</h4>
                <p className={`text-sm leading-relaxed font-normal text-left ${isDarkMode ? 'text-[#E8E6E3]' : 'text-[#152532]'}`}>
                  This Cookies Policy explains what cookies are, how we utilize them, the specific types of cookies we deploy (including the information collected via these cookies and how it is processed), and how you can manage your cookie preferences.
                </p>
                <p className={`text-sm leading-relaxed font-normal text-left ${isDarkMode ? 'text-[#E8E6E3]' : 'text-[#152532]'}`}>
                  Cookies are small text files used to store minor fragments of data. They are stored on your device when our website loads in your browser. These cookies are essential for ensuring the correct functionality and security of our platform, providing an optimized user experience, and analyzing website performance to identify areas for continuous improvement.
                </p>
              </section>

              {/* How do we use cookies */}
              <section className="space-y-3">
                <h4 className={`text-lg font-display font-semibold text-left ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>How do we use cookies?</h4>
                <p className={`text-sm leading-relaxed font-normal text-left ${isDarkMode ? 'text-[#E8E6E3]' : 'text-[#152532]'}`}>
                  Like most professional digital platforms, the Athena Resilience Group website utilizes both first-party and third-party cookies for several purposes.
                </p>
                <div className={`space-y-3 pl-3 border-l-2 mt-2 ${isDarkMode ? 'border-[#88c9c4]/30' : 'border-[#152532]/20'}`}>
                  <p className={`text-sm leading-relaxed font-normal text-left ${isDarkMode ? 'text-[#E8E6E3]' : 'text-[#152532]'}`}>
                    <strong className={`font-bold ${isDarkMode ? 'text-[#E8E6E3]' : 'text-[#152532]'}`}>First-party cookies:</strong> Are strictly necessary for the website to function correctly. They do not harvest any directly identifiable personal data.
                  </p>
                  <p className={`text-sm leading-relaxed font-normal text-left ${isDarkMode ? 'text-[#E8E6E3]' : 'text-[#152532]'}`}>
                    <strong className={`font-bold ${isDarkMode ? 'text-[#E8E6E3]' : 'text-[#152532]'}`}>Third-party cookies:</strong> Are utilized, where active, for performance measurement and tailored communication, and are deployed only after receiving your explicit consent.
                  </p>
                </div>
              </section>

              {/* Types of cookies we use */}
              <section className="space-y-4">
                <h4 className={`text-lg font-display font-semibold text-left ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>Types of cookies we use</h4>
                <div className="space-y-4">
                  {/* Category Card 1 */}
                  <div className={`p-4 rounded-xl border space-y-1 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-[#152532]/5 border-[#152532]/10'}`}>
                    <span className={`inline-block text-xs font-jakarta font-bold uppercase tracking-wider text-left ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                      Strictly Necessary
                    </span>
                    <p className={`text-sm leading-relaxed font-normal text-left ${isDarkMode ? 'text-[#E8E6E3]' : 'text-[#152532]/90'}`}>
                      These cookies support the core functionality of our website, ensuring seamless navigation and secure access to our pages. The website cannot operate properly without them.
                    </p>
                  </div>

                  {/* Category Card 2 */}
                  <div className={`p-4 rounded-xl border space-y-1 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-[#152532]/5 border-[#152532]/10'}`}>
                    <span className={`inline-block text-xs font-jakarta font-bold uppercase tracking-wider text-left ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                      Analytics & Performance
                    </span>
                    <p className={`text-sm leading-relaxed font-normal text-left ${isDarkMode ? 'text-[#E8E6E3]' : 'text-[#152532]/90'}`}>
                      Activated only upon consent, these cookies help us evaluate how users interact with our platform, enabling us to refine our digital presence and services.
                    </p>
                  </div>

                  {/* Category Card 3 */}
                  <div className={`p-4 rounded-xl border space-y-1 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-[#152532]/5 border-[#152532]/10'}`}>
                    <span className={`inline-block text-xs font-jakarta font-bold uppercase tracking-wider text-left ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                      Marketing & Communication
                    </span>
                    <p className={`text-sm leading-relaxed font-normal text-left ${isDarkMode ? 'text-[#E8E6E3]' : 'text-[#152532]/90'}`}>
                      These cookies are enabled strictly with your explicit consent to display relevant professional insights and measure the effectiveness of our outreach campaigns.
                    </p>
                  </div>
                </div>
              </section>

              {/* Marketing cookies & third party providers */}
              <section className="space-y-3">
                <h4 className={`text-lg font-display font-semibold text-left ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>Marketing Cookies & Third-Party Providers</h4>
                <p className={`text-sm leading-relaxed font-normal text-left ${isDarkMode ? 'text-[#E8E6E3]' : 'text-[#152532]'}`}>
                  For our corporate communication and marketing initiatives, we partner exclusively with the following verified provider. The associated cookies are deactivated by default and will only initialize upon your explicit consent:
                </p>
                
                <div className={`p-5 rounded-xl border space-y-3 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-[#152532]/5 border-[#152532]/10'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-display font-semibold text-sm ${isDarkMode ? 'text-[#E8E6E3]' : 'text-[#152532]'}`}>LinkedIn Ads</span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-jakarta uppercase font-bold tracking-wider ${isDarkMode ? 'bg-white text-[#152532]' : 'bg-[#152532] text-white'}`}>Verified Provider</span>
                  </div>
                  <p className={`text-xs sm:text-sm leading-relaxed font-normal text-left ${isDarkMode ? 'text-[#E8E6E3]' : 'text-[#152532]/85'}`}>
                    Utilized for B2B conversion tracking and professional audience insights.
                  </p>
                  <a 
                    href="https://www.linkedin.com/legal/privacy-policy" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`group inline-flex items-center gap-1.5 text-xs hover:opacity-85 transition-opacity font-semibold underline decoration-dotted underline-offset-4 ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}
                  >
                    Review the provider's data practices
                    <ArrowUpRight size={14} className="stroke-[2.5] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </section>

              {/* Reopen settings / manage cookies */}
              <section className={`space-y-4 p-5 rounded-xl border text-left ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-[#152532]/10 bg-[#152532]/5'}`}>
                <p className={`text-sm leading-relaxed font-normal ${isDarkMode ? 'text-[#E8E6E3]' : 'text-[#152532]'}`}>
                  You retain full control over your data. You can modify your cookie preferences at any time by clicking the "Manage Cookies" button below. This will reopen the consent banner, allowing you to update your choices or withdraw consent instantly.
                </p>
                <button 
                  type="button"
                  onClick={() => {
                    setShowCookiesPolicy(false);
                    setIsCookieOpen(true);
                    setIsAdjustingConsent(true);
                  }}
                  className={`px-5 py-2.5 font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer ${
                    isDarkMode 
                      ? 'bg-white text-[#111D29] hover:bg-[#88c9c4] hover:text-[#152532]' 
                      : 'bg-[#152532] text-white hover:bg-athena-peach hover:text-[#152532]'
                  }`}
                >
                  Manage Cookies
                </button>
              </section>

              {/* Browser Configuration */}
              <section className="space-y-4">
                <h4 className={`text-lg font-display font-semibold text-left ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>Browser Configuration</h4>
                <p className={`text-sm leading-relaxed font-normal text-left ${isDarkMode ? 'text-[#E8E6E3]' : 'text-[#152532]'}`}>
                  Alternatively, you can manage, restrict, or delete cookies directly through your web browser's native settings. Please find the official documentation for major browsers below:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  {[
                    { name: 'Google Chrome', desc: 'Clean, allow and manage cookies', url: 'https://support.google.com/chrome/answer/95647' },
                    { name: 'Apple Safari', desc: 'Manage cookies and website data', url: 'https://support.apple.com/guide/safari/sfri11471/mac' },
                    { name: 'Mozilla Firefox', desc: 'Clear cookies and site data', url: 'https://support.mozilla.org/kb/clear-cookies-and-site-data-firefox' },
                    { name: 'Microsoft Edge', desc: 'View, allow, block, or delete cookies', url: 'https://support.microsoft.com/microsoft-edge/view-allow-block-or-delete-cookies-in-microsoft-edge-a7d95376-f2cd-ef02-d29a-2508f36611c5' }
                  ].map((browser) => (
                    <a 
                      key={browser.name}
                      href={browser.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3.5 rounded-lg border transition-all text-left flex flex-col justify-between group ${
                        isDarkMode 
                          ? 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10' 
                          : 'border-[#152532]/10 bg-[#152532]/5 hover:border-[#152532]/30 hover:bg-[#152532]/10'
                      }`}
                    >
                      <div>
                        <span className={`font-display font-semibold text-xs sm:text-sm block transition-colors ${isDarkMode ? 'text-[#E8E6E3] group-hover:text-[#88c9c4]' : 'text-[#152532] group-hover:text-athena-peach'}`}>
                          {browser.name}
                        </span>
                        <span className={`text-[11px] block font-light leading-snug mt-0.5 ${isDarkMode ? 'text-[#E8E6E3]/80' : 'text-[#152532]/80'}`}>
                          {browser.desc}
                        </span>
                      </div>
                      <span className={`text-[10px] font-semibold tracking-wider uppercase mt-4 flex items-center gap-1 ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                        Documentation
                        <ArrowUpRight size={12} className="stroke-[2.5] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </a>
                  ))}
                </div>
                
                <p className={`text-xs leading-relaxed font-light mt-2 text-left ${isDarkMode ? 'text-[#E8E6E3]/85' : 'text-[#152532]/85'}`}>
                  If you are utilizing an alternative web browser, please refer to your browser's official support and documentation pages.
                </p>
              </section>
            </div>
          </motion.div>
        )}

        {showUnsubscribe && (
          <motion.div 
            key="unsubscribe-policy-popup"
            initial={isMobile ? { y: '100%', opacity: 1 } : { scale: 0.95, opacity: 0, y: '-40%', x: '-50%' }}
            animate={isMobile ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1, y: '-50%', x: '-50%' }}
            exit={isMobile ? { y: '100%', opacity: 1 } : { scale: 0.95, opacity: 0, y: '-40%', x: '-50%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            style={isMobile ? { 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden', 
              transformStyle: 'preserve-3d' 
            } : {
              top: '50%',
              left: '50%',
              position: 'fixed',
              zIndex: 70
            }}
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label="Unsubscribe Information Details Panel"
            className={isMobile 
              ? `fixed bottom-0 left-0 right-0 w-full transition-all duration-500 ease-out ${
                  showUnsubscribeDropdown 
                    ? 'h-[88vh] max-h-[820px] landscape:h-[95vh] landscape:max-h-none' 
                    : 'h-[36vh] max-h-[300px] landscape:h-[92vh] landscape:max-h-none'
                } ${isDarkMode ? 'bg-[#111D29] border-white/20' : 'bg-white border-[#152532]/20'} z-[70] shadow-2xl flex flex-col overflow-hidden rounded-t-[32px] border-t border-r border-l`
              : `fixed w-[560px] max-w-[95vw] transition-all duration-500 ease-out ${showUnsubscribeDropdown ? 'max-h-[90vh]' : 'max-h-[75vh]'} h-auto ${isDarkMode ? 'bg-[#111D29] border-white/25 ring-white/5' : 'bg-white border-[#152532]/25 ring-[#152532]/5'} z-[70] shadow-2xl flex flex-col overflow-hidden rounded-2xl border ring-4`
            }
          >
            <div className={`sticky top-0 ${isDarkMode ? 'bg-[#111D29]/95 border-white/10' : 'bg-white/95 border-[#152532]/10'} backdrop-blur-md z-10 px-6 py-5 md:px-10 md:py-6 flex justify-between items-center border-b shrink-0`}>
              <div>
                <h3 className={`text-xl md:text-2xl font-display font-bold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>Unsubscribe Preferences</h3>
                <p className={`text-xs font-sans ${isDarkMode ? 'text-[#E8E6E3]/70' : 'text-[#152532]/70'}`}>Athena Resilience Group</p>
              </div>
              <button 
                onClick={() => setShowUnsubscribe(false)} 
                className={`p-2.5 ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-[#88c9c4] border-white/10' : 'bg-[#152532]/5 hover:bg-[#152532]/10 text-[#152532] border-[#152532]/10'} rounded-full transition-all flex items-center justify-center border cursor-pointer hover:scale-105 active:scale-95`}
                aria-label="Close dialog"
              >
                <X size={20} className="stroke-[2.5]" />
              </button>
            </div>
            
            <div 
              ref={unsubscribeScrollRef}
              data-lenis-prevent
              className={`flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide overscroll-contain touch-pan-y space-y-6 ${isDarkMode ? 'text-[#E8E6E3]' : 'text-[#152532]'}`}
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div className="space-y-4 font-jakarta text-xs sm:text-sm leading-relaxed font-light text-left">
                <p>
                  You have the right to unsubscribe from our insights whenever you like. Simply use the 'Unsubscribe' link at the bottom of our emails, or{' '}
                  <button 
                    onClick={() => setShowUnsubscribeDropdown(!showUnsubscribeDropdown)} 
                    className="underline font-bold hover:text-athena-peach transition-colors focus:outline-none cursor-pointer"
                  >
                    click/tap here
                  </button>.
                </p>

                <AnimatePresence>
                  {showUnsubscribeDropdown && (
                    <UnsubscribeForm isDarkMode={isDarkMode} />
                  )}
                </AnimatePresence>
                
                <p>
                  Curious about how we protect your information? <button onClick={() => { setShowUnsubscribe(false); setShowPrivacyPolicy(true); }} className="underline font-semibold hover:text-athena-peach transition-colors focus:outline-none cursor-pointer">Check out our privacy notice</button>.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {showPrivacyPolicy && (
          <motion.div 
            key="privacy-policy-popup"
            initial={isMobile ? { y: '100%', opacity: 1 } : { scale: 0.95, opacity: 0, y: '-40%', x: '-50%' }}
            animate={isMobile ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1, y: '-50%', x: '-50%' }}
            exit={isMobile ? { y: '100%', opacity: 1 } : { scale: 0.95, opacity: 0, y: '-40%', x: '-50%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            style={isMobile ? { 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden', 
              transformStyle: 'preserve-3d' 
            } : {
              top: '50%',
              left: '50%',
              position: 'fixed',
              zIndex: 70
            }}
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label="Privacy Policy Details Panel"
            className={isMobile 
              ? `fixed bottom-0 left-0 right-0 w-full h-[85vh] ${isDarkMode ? 'bg-[#111D29] border-white/20' : 'bg-white border-[#152532]/20'} z-[70] shadow-2xl flex flex-col overflow-hidden rounded-t-[32px] border-t border-r border-l`
              : `fixed w-[800px] max-w-[95vw] h-[80vh] ${isDarkMode ? 'bg-[#111D29] border-white/25 ring-white/5' : 'bg-white border-[#152532]/25 ring-[#152532]/5'} z-[70] shadow-2xl flex flex-col overflow-hidden rounded-2xl border ring-4`
            }
          >
            <div className={`sticky top-0 ${isDarkMode ? 'bg-[#111D29]/95 border-white/10' : 'bg-white/95 border-[#152532]/10'} backdrop-blur-md z-10 px-6 py-5 md:px-10 md:py-6 flex justify-between items-center border-b shrink-0`}>
              <div>
                <h3 className={`text-xl md:text-2xl font-display font-bold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>Privacy Policy</h3>
                <p className={`text-xs font-sans ${isDarkMode ? 'text-[#E8E6E3]/70' : 'text-[#152532]/70'}`}>Last Updated: June 19, 2026</p>
              </div>
              <button 
                onClick={() => setShowPrivacyPolicy(false)} 
                className={`p-2.5 ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-[#88c9c4] border-white/10' : 'bg-[#152532]/5 hover:bg-[#152532]/10 text-[#152532] border-[#152532]/10'} rounded-full transition-all flex items-center justify-center border cursor-pointer hover:scale-105 active:scale-95`}
                aria-label="Close dialog"
              >
                <X size={20} className="stroke-[2.5]" />
              </button>
            </div>
            
            <div 
              data-lenis-prevent
              className={`flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide overscroll-contain touch-pan-y space-y-8 ${isDarkMode ? 'text-[#E8E6E3]' : 'text-[#152532]'}`}
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <section className="space-y-4 text-xs sm:text-sm leading-relaxed font-light text-left font-jakarta">
                <p className="font-semibold">
                  Athena Resilience Group (“the Company,” “we,” “us,” or “our”), acting as a data controller, is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, process, disclose, and safeguard your personal data when you visit our website (the “Web Site”), use our internal client portals, consume our content, or interact with any of our mobile or other digital applications (collectively, the “Services”).
                </p>
                <p>
                  We process your personal data in strict compliance with the EU General Data Protection Regulation (GDPR) (EU) 2016/679, the Greek Data Protection Law 4624/2019, and all other applicable European and local data protection laws.
                </p>
                <p>
                  Please read this Privacy Policy carefully to understand our practices regarding your personal data. By using our Services, you acknowledge the terms of this Privacy Policy. If you do not agree with this policy, please do not use our Web Site or Services.
                </p>
              </section>

              {/* 1. Scope of this Privacy Policy */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  1. Scope of this Privacy Policy
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light">
                  This Privacy Policy describes our practices regarding the personal data we collect from you, or that you provide to us, including:
                </p>
                <ul className="list-disc pl-5 text-xs sm:text-sm space-y-1.5 font-light leading-relaxed">
                  <li>Personal data we collect or process;</li>
                  <li>Our Cookie Policy;</li>
                  <li>How and why we use your data (purposes of processing);</li>
                  <li>Legal grounds for processing your data;</li>
                  <li>With whom we share your personal data;</li>
                  <li>Your rights under the GDPR and how to exercise them;</li>
                  <li>Data retention periods and security measures;</li>
                  <li>Children's privacy;</li>
                  <li>International data transfers (outside the EEA); and</li>
                  <li>How to contact us or our Data Protection Officer (DPO).</li>
                </ul>
              </section>

              {/* 2. What Personal Data Do We Collect or Process? */}
              <section className="space-y-4 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  2. What Personal Data Do We Collect or Process?
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light">
                  We collect personal data in several ways across our Services:
                </p>

                <div className="space-y-3 pl-2">
                  <h5 className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Information You Provide Directly to Us:</h5>
                  <ul className="space-y-3.5 text-xs sm:text-sm font-light leading-relaxed pl-3 border-l border-current/10">
                    <li>
                      <strong className="font-semibold block md:inline">Corporate Client Registration:</strong> When corporate clients (“Clients”) sign up for our Services for their organization, we collect company details along with the name, business email address, phone number, business title, and preferences of authorized employees.
                    </li>
                    <li>
                      <strong className="font-semibold block md:inline">Individual User Registration:</strong> If you register directly on our Web Site to access restricted content or services, we collect your name, email address, job title, company name, and any preferences you opt to share.
                    </li>
                    <li>
                      <strong className="font-semibold block md:inline">Communications and Enquiries:</strong> If you contact us via email, contact forms, or if we conduct research surveys (which are strictly voluntary), we retain a record of that correspondence and the information provided.
                    </li>
                  </ul>
                </div>

                <div className="space-y-2 pl-2">
                  <h5 className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Social Media Platforms:</h5>
                  <p className="text-xs sm:text-sm leading-relaxed font-light pl-3 border-l border-current/10">
                    We operate corporate pages on third-party social media networks. When you interact with our social media pages, your personal data is processed jointly by us and the respective platform provider. These third-party networks operate under their own independent privacy policies, which we encourage you to review.
                  </p>
                </div>

                <div className="space-y-3 pl-2">
                  <h5 className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Information Collected Automatically (Usage Data):</h5>
                  <p className="text-xs sm:text-sm leading-relaxed font-light pl-3 border-l border-current/10">
                    When you visit our Web Site, we and our authorized service providers automatically collect and store certain digital technical data (“Usage Information”) via your computer, tablet, or mobile device. This includes:
                  </p>
                  <ul className="list-disc pl-8 text-xs sm:text-sm space-y-1.5 font-light leading-relaxed">
                    <li>Your IP address and unique device identifiers;</li>
                    <li>Device characteristics (browser type, browser language, time zone, operating system, hardware, and mobile network info);</li>
                    <li>Referring/exit web pages, URLs clicked, and timestamped logs of your activities on our Web Site; and</li>
                    <li>Broad geographic location (derived from your IP address at a city or country level).</li>
                  </ul>
                </div>
              </section>

              {/* 3. Cookies Policy */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  3. Cookies Policy
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light">
                  Athena Resilience Group uses cookies and similar tracking mechanisms (such as web beacons and device identifiers) to optimize Web Site functionality, analyze web traffic, secure our portal, and personalize your experience.
                </p>
                <ul className="space-y-3 text-xs sm:text-sm font-light leading-relaxed pl-3 border-l border-current/10">
                  <li>
                    <strong className="font-semibold block md:inline">Session Cookies:</strong> These are temporary and are deleted automatically when you close your browser. They are used to manage your active session (e.g., keeping you logged into the client portal).
                  </li>
                  <li>
                    <strong className="font-semibold block md:inline">Persistent Cookies:</strong> These remain on your device until they expire or you manually delete them. They help us recognize you upon your return, remembering your preferences and analyzing aggregate traffic patterns to improve our content.
                  </li>
                  <li>
                    <strong className="font-semibold block md:inline">Consent Requirement:</strong> In compliance with the ePrivacy Directive and Greek law, all non-essential cookies (such as analytics or marketing cookies) are disabled by default and will only fire if you give your explicit consent via our cookie consent banner. You can modify your cookie settings at any time.
                  </li>
                </ul>
              </section>

              {/* 4. How Your Information Is Used (Purposes of Processing) */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  4. How Your Information Is Used (Purposes of Processing)
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light">
                  We process your personal data only for specific, explicit, and legitimate purposes:
                </p>
                <ul className="space-y-3 text-xs sm:text-sm font-light leading-relaxed pl-3 border-l border-current/10">
                  <li>
                    <strong className="font-semibold block md:inline">Providing and Managing Services:</strong> To fulfill our contractual obligations to you or your employer, deliver tailored resilience reports, manage client accounts, and authenticate portal access.
                  </li>
                  <li>
                    <strong className="font-semibold block md:inline">Customer Support & Communication:</strong> To respond to your enquiries, send technical updates, security alerts, and administrative messages.
                  </li>
                  <li>
                    <strong className="font-semibold block md:inline">Marketing and Insights:</strong> To send you newsletters, invitations to briefings, and promotional materials concerning our Services, provided you have opted-in to receive such communications.
                  </li>
                  <li>
                    <strong className="font-semibold block md:inline">Improving our Services:</strong> To conduct aggregated statistical research into user demographics and behavior to optimize our Web Site layout and thought leadership offerings.
                  </li>
                  <li>
                    <strong className="font-semibold block md:inline">Legal Compliance & Security:</strong> To protect our digital infrastructure against fraudulent or illegal activities, enforce our Terms of Use, and comply with legal obligations imposed by Greek or European judicial and administrative authorities.
                  </li>
                </ul>
              </section>

              {/* 5. Legal Grounds for Processing Your Personal Data */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  5. Legal Grounds for Processing Your Personal Data
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light">
                  Under the GDPR, we rely on the following lawful bases to process your personal data:
                </p>
                <ul className="space-y-3 text-xs sm:text-sm font-light leading-relaxed pl-3 border-l border-current/10">
                  <li>
                    <strong className="font-semibold block md:inline">Performance of a Contract (Art. 6(1)(b) GDPR):</strong> Processing is necessary to perform our obligations under a contract we have with you (or to take pre-contractual steps at your request), such as managing your corporate portal account.
                  </li>
                  <li>
                    <strong className="font-semibold block md:inline">Consent (Art. 6(1)(a) GDPR):</strong> Where you have granted explicit consent for a specific purpose, such as subscribing to our marketing newsletters or accepting analytical cookies. You have the right to withdraw consent at any time.
                  </li>
                  <li>
                    <strong className="font-semibold block md:inline">Legitimate Interests (Art. 6(1)(f) GDPR):</strong> Processing is necessary for our legitimate business interests, provided they do not override your fundamental privacy rights. This includes optimizing our web services, preventing cyber threats, and engaging in B2B marketing.
                  </li>
                  <li>
                    <strong className="font-semibold block md:inline">Compliance with a Legal Obligation (Art. 6(1)(c) GDPR):</strong> Where we are required by EU or Greek law to process or retain data (e.g., for tax reporting, corporate accounting, or responding to lawful law enforcement demands).
                  </li>
                </ul>
              </section>

              {/* 6. With Whom Your Information May Be Shared */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  6. With Whom Your Information May Be Shared
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light">
                  Athena Resilience Group does not sell your personal data. We may share your personal data only with the following categories of recipients:
                </p>
                <ul className="space-y-3 text-xs sm:text-sm font-light leading-relaxed pl-3 border-l border-current/10">
                  <li>
                    <strong className="font-semibold block md:inline">Internal Personnel:</strong> Authorized employees and advisors within Athena Resilience Group who require access to fulfil their professional duties.
                  </li>
                  <li>
                    <strong className="font-semibold block md:inline">Third-Party Service Providers:</strong> Trusted processors acting on our strict written instructions who provide infrastructure, IT hosting, cloud storage, payment processing, or email delivery systems. All such processors are bound by strict data processing agreements (DPAs) under Article 28 of the GDPR.
                  </li>
                  <li>
                    <strong className="font-semibold block md:inline">Public Authorities and Legal Proceedings:</strong> If mandated by EU or Greek law, we may disclose personal data to courts, regulatory bodies, or law enforcement agencies to comply with legal processes or protect our intellectual property and physical safety.
                  </li>
                  <li>
                    <strong className="font-semibold block md:inline">Corporate Restructuring:</strong> In the event of a merger, acquisition, joint venture, or sale of corporate assets, client databases may be transferred to the acquiring legal entity under strict confidentiality provisions.
                  </li>
                </ul>
              </section>

              {/* 7. Data Retention Periods */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  7. Data Retention Periods
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light">
                  We store your personal data only for as long as is strictly necessary to fulfill the purposes for which it was collected, as well as to meet our contractual, regulatory, tax, or legal defense obligations.
                </p>
                <ul className="list-disc pl-5 text-xs sm:text-sm space-y-1.5 font-light leading-relaxed">
                  <li><strong className="font-semibold">Account Data:</strong> Retained for the duration of your active relationship or corporate contract with us.</li>
                  <li><strong className="font-semibold">Marketing Data:</strong> Retained until you withdraw your consent or object to the processing (unsubscribe).</li>
                  <li><strong className="font-semibold">Cookies:</strong> Session cookies expire immediately; persistent cookies expire according to the parameters specified in our dedicated Cookie Banner settings.</li>
                </ul>
              </section>

              {/* 8. Data Security */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  8. Data Security
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light">
                  Athena Resilience Group implements robust technical and organizational security measures (such as firewalls, access controls, and encryption) to protect your personal data from accidental loss, destruction, alteration, unauthorized access, or disclosure.
                </p>
                <p className="text-xs sm:text-sm leading-relaxed font-light">
                  While we employ industry-standard protocols, please note that no method of transmission over the Internet can be guaranteed 100% secure, and any transmission of data via our web forms is done at your own risk.
                </p>
              </section>

              {/* 9. International Data Transfers (Outside the EEA) */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  9. International Data Transfers (Outside the EEA)
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light">
                  As an entity located in Athens, Greece, your personal data is primarily stored and hosted within the European Economic Area (EEA).
                </p>
                <p className="text-xs sm:text-sm leading-relaxed font-light">
                  If we transfer your personal data to third-party service providers located outside the EEA (such as cloud providers based in the United States), we ensure a legally compliant transfer mechanism is in place. This includes transferring data to countries recognized by the European Commission as providing an adequate level of protection, or utilizing the European Commission’s approved Standard Contractual Clauses (SCCs) alongside mandatory supplementary technical safeguards.
                </p>
              </section>

              {/* 10. Children's Privacy */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  10. Children's Privacy
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light">
                  Our professional resilience and advisory services are strictly directed at individuals over the age of 18. We do not knowingly collect personal data from anyone under 18 years of age. If you discover that a child has provided us with personal data, please contact us immediately so we can promptly delete it.
                </p>
              </section>

              {/* 11. Your European Privacy Rights Under the GDPR */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  11. Your European Privacy Rights Under the GDPR
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light">
                  If you are located within the EU/EEA, you possess the following comprehensive rights regarding your personal data:
                </p>
                <ul className="space-y-3 text-xs sm:text-sm font-light leading-relaxed pl-3 border-l border-current/10">
                  <li>
                    <strong className="font-semibold block md:inline">Right of Access (Art. 15 GDPR):</strong> The right to obtain confirmation as to whether your personal data is being processed, and to receive a clear copy of that data.
                  </li>
                  <li>
                    <strong className="font-semibold block md:inline">Right to Rectification (Art. 16 GDPR):</strong> The right to request the immediate correction of inaccurate or incomplete personal data.
                  </li>
                  <li>
                    <strong className="font-semibold block md:inline">Right to Erasure / "Right to be Forgotten" (Art. 17 GDPR):</strong> The right to request the deletion of your personal data when it is no longer needed for its original purpose, or when you have withdrawn your consent.
                  </li>
                  <li>
                    <strong className="font-semibold block md:inline">Right to Restriction of Processing (Art. 18 GDPR):</strong> The right to "block" or suspend the processing of your data under specific circumstances (e.g., while contesting the accuracy of the data).
                  </li>
                  <li>
                    <strong className="font-semibold block md:inline">Right to Data Portability (Art. 20 GDPR):</strong> The right to receive your personal data in a structured, commonly used, and machine-readable format, or have it transmitted directly to another data controller.
                  </li>
                  <li>
                    <strong className="font-semibold block md:inline">Right to Object (Art. 21 GDPR):</strong> The right to object at any time to processing based on our legitimate interests or direct marketing. If you object to direct marketing, we will cease processing your data for this purpose immediately.
                  </li>
                  <li>
                    <strong className="font-semibold block md:inline">Right to Withdraw Consent (Art. 7(3) GDPR):</strong> Where processing is based on your consent, you have the right to withdraw it at any time without affecting the lawfulness of processing based on consent before its withdrawal.
                  </li>
                  <li>
                    <strong className="font-semibold block md:inline">Automated Decision-Making (Art. 22 GDPR):</strong> The right not to be subject to decisions based solely on automated processing, including profiling, which produces legal or similarly significant effects on you. (Athena Resilience Group does not engage in such automated profiling).
                  </li>
                </ul>

                <p className="text-xs sm:text-sm leading-relaxed font-light pt-2">
                  To exercise any of these rights, please submit your request to our dedicated privacy desk at: <a href="mailto:privacy@athenaresiliencegroup.com" className="font-semibold hover:text-athena-peach underline transition-colors">privacy@athenaresiliencegroup.com</a>. We will respond to your request free of charge within thirty (30) days.
                </p>

                <div className="space-y-2 pt-3">
                  <h5 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-left">Right to Lodge a Complaint</h5>
                  <p className="text-xs sm:text-sm leading-relaxed font-light text-left">
                    You also have the right to lodge a formal complaint regarding our data handling practices with your local supervisory authority. In Greece, this is the:
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed font-light pl-3 border-l border-current/10 text-left">
                    <strong>Hellenic Data Protection Authority (HDPA)</strong><br />
                    Kifissias 1-3, PC 115 23, Athens, Greece<br />
                    Phone: +30-210 6475600<br />
                    Email: contact@dpa.gr<br />
                    Website: <a href="https://www.dpa.gr" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-athena-peach">www.dpa.gr</a>
                  </p>
                </div>
              </section>

              {/* 12. Thought Leadership Privacy Rider */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  12. Thought Leadership Privacy Rider
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light">
                  This rider applies explicitly to dedicated landing pages where you download our proprietary Thought Leadership Reports or industry briefs.
                </p>
                <ul className="space-y-3 text-xs sm:text-sm font-light leading-relaxed pl-3 border-l border-current/10 font-jakarta">
                  <li>
                    <strong className="font-semibold block md:inline">Voluntary Provision:</strong> Downloading these materials does not require you to register for a comprehensive client portal account. Providing your basic business details (Name, Corporate Email, Company) is completely voluntary; however, access to the free digital download is contingent upon providing the required fields.
                  </li>
                  <li>
                    <strong className="font-semibold block md:inline">Legal Basis:</strong> Our legal basis for processing this data is our Legitimate Business Interest (Art. 6(1)(f) GDPR) to establish a professional B2B marketing channel with you. You maintain the absolute right to unsubscribe from any subsequent communications at any time via the opt-out link in the delivery email.
                  </li>
                </ul>
              </section>

              {/* 13. Privacy Policy Updates */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  13. Privacy Policy Updates
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light font-jakarta">
                  We reserve the right to update or modify this Privacy Policy at any time to align with shifting business practices or evolving European data protection laws. Any updates will be published on this page with an amended "Last Updated" timestamp at the top. We encourage you to review this policy periodically.
                </p>
              </section>

              {/* 14. How to Contact Us */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  14. How to Contact Us
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light font-jakarta">
                  If you have any questions, comments, or concerns regarding this Privacy Policy, or if you wish to contact our Data Protection Office, please write to us at:
                </p>
                <p className="text-xs sm:text-sm leading-relaxed font-light pl-3 border-l border-current/10 text-left font-jakarta">
                  <strong>Athena Resilience Group</strong><br />
                  Patision 75,<br />
                  10434, Athens, Greece<br />
                  Email: <a href="mailto:privacy@athenaresiliencegroup.com" className="font-semibold hover:text-athena-peach underline transition-colors">privacy@athenaresiliencegroup.com</a><br /><br />
                  Attention: Data Protection & Compliance Officer
                </p>
              </section>
            </div>
          </motion.div>
        )}

        {showTerms && (
          <motion.div 
            key="terms-popup"
            initial={isMobile ? { y: '100%', opacity: 1 } : { scale: 0.95, opacity: 0, y: '-40%', x: '-50%' }}
            animate={isMobile ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1, y: '-50%', x: '-50%' }}
            exit={isMobile ? { y: '100%', opacity: 1 } : { scale: 0.95, opacity: 0, y: '-40%', x: '-50%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            style={isMobile ? { 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden', 
              transformStyle: 'preserve-3d' 
            } : {
              top: '50%',
              left: '50%',
              position: 'fixed',
              zIndex: 70
            }}
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label="Terms of Use Details Panel"
            className={isMobile 
              ? `fixed bottom-0 left-0 right-0 w-full h-[85vh] ${isDarkMode ? 'bg-[#111D29] border-white/20' : 'bg-white border-[#152532]/20'} z-[70] shadow-2xl flex flex-col overflow-hidden rounded-t-[32px] border-t border-r border-l`
              : `fixed w-[800px] max-w-[95vw] h-[80vh] ${isDarkMode ? 'bg-[#111D29] border-white/25 ring-white/5' : 'bg-white border-[#152532]/25 ring-[#152532]/5'} z-[70] shadow-2xl flex flex-col overflow-hidden rounded-2xl border ring-4`
            }
          >
            <div className={`sticky top-0 ${isDarkMode ? 'bg-[#111D29]/95 border-white/10' : 'bg-white/95 border-[#152532]/10'} backdrop-blur-md z-10 px-6 py-5 md:px-10 md:py-6 flex justify-between items-center border-b shrink-0`}>
              <div>
                <h3 className={`text-xl md:text-2xl font-display font-bold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>Terms of Use</h3>
                <p className={`text-xs font-sans ${isDarkMode ? 'text-[#E8E6E3]/70' : 'text-[#152532]/70'}`}>Last Updated: June 19, 2026</p>
              </div>
              <button 
                onClick={() => setShowTerms(false)} 
                className={`p-2.5 ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-[#88c9c4] border-white/10' : 'bg-[#152532]/5 hover:bg-[#152532]/10 text-[#152532] border-[#152532]/10'} rounded-full transition-all flex items-center justify-center border cursor-pointer hover:scale-105 active:scale-95`}
                aria-label="Close dialog"
              >
                <X size={20} className="stroke-[2.5]" />
              </button>
            </div>
            
            <div 
              data-lenis-prevent
              className={`flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide overscroll-contain touch-pan-y space-y-8 ${isDarkMode ? 'text-[#E8E6E3]' : 'text-[#152532]'}`}
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <section className="space-y-4 text-xs sm:text-sm leading-relaxed font-light text-left font-jakarta">
                <p className="font-semibold">
                  These Terms of Use apply to the services and websites of Athena Resilience Group (the “Company,” “we,” “us,” or “our”), including <a href="https://www.athenaresiliencegroup.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-athena-peach">www.athenaresiliencegroup.com</a> (collectively, the “Web Site”). Please carefully read these Terms of Use and the Company's Privacy Policy, which is incorporated into these Terms of Use by reference.
                </p>
                <p>
                  By visiting or using this Web Site, any of its pages, or our related Services, you are agreeing to be bound by these Terms of Use, and such agreement constitutes a binding contract between you and the Company. If you do not wish to be bound by these Terms of Use, please do not visit or use the Web Site or any of its pages or related Services.
                </p>
                <p>
                  “You” means you in your individual capacity and the company or organization you represent. If you are entering into these Terms of Use on behalf of a company or other organization, you hereby represent and warrant that you are authorized to enter into these Terms of Use on behalf of such company or other organization.
                </p>
                
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-[#152532]/5 border-[#152532]/10'} font-medium uppercase tracking-wide text-[11px] sm:text-xs text-left space-y-2`}>
                  <p>
                    THE COMPANY IS HEADQUARTERED IN GREECE. IF YOU ARE LOCATED IN THE EUROPEAN ECONOMIC AREA (EEA), SWITZERLAND, OR THE UNITED KINGDOM, YOU ACKNOWLEDGE AND CONSENT TO THE PROCESSING AND SECURE STORAGE OF YOUR PERSONAL DATA IN GREECE IN STRICT ACCORDANCE WITH THE GDPR AND APPLICABLE GREEK AND EUROPEAN LAWS.
                  </p>
                  <p>
                    THESE TERMS OF USE CONTAIN A DISPUTE RESOLUTION PROVISION, COMPLYING WITH GREEK AND EUROPEAN UNION LEGISLATION, AFFECTING YOUR RIGHTS UNDER THESE TERMS AND CONDITIONS.
                  </p>
                </div>
              </section>

              {/* Introduction */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  Introduction
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light">
                  The Company operates the Web Site and associated web pages and services.
                </p>
                <p className="text-xs sm:text-sm leading-relaxed font-light">
                  The Company offers you access to the Web Site in exchange for your agreement to accept and comply with the terms, conditions, and notices stated herein and as may be modified by the Company from time to time. The Company refers to these terms, conditions, and notices, whether modified or unmodified, as the "Agreement" or as the "Terms of Use." The Company reserves the right, at its sole discretion, to modify this Agreement and/or the Web Site without providing prior individual notification, but will post a notice of any material changes on the Web Site. You are responsible for regularly reviewing this Agreement. Your use of the Web Site following any posted change(s) to the Terms of Use will be deemed an acceptance of such change(s).
                </p>
                <p className="text-xs sm:text-sm leading-relaxed font-light">
                  The Web Site is not intended for the use of children under 18, and no such person is authorized to use it. By using the Web Site, you represent that you are at least 18 years old and of legal age to enter into legal agreements, or if you are not, that you have obtained your parent's or legal guardian's consent to accept these Terms of Use. If you do not meet this requirement, you must not access or use this Web Site.
                </p>
                <p className="text-xs sm:text-sm leading-relaxed font-light">
                  In addition, when using particular services or features of the Web Site, you shall be subject to any posted guidelines or rules applicable to such services or features, which may be posted from time to time. All such guidelines or rules are hereby incorporated by reference into these Terms of Use.
                </p>
              </section>

              {/* Use of Content */}
              <section className="space-y-4 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  Use of Content
                </h4>
                
                <ol className="space-y-4 text-xs sm:text-sm font-light leading-relaxed list-decimal pl-5">
                  <li>
                    Except where we specify otherwise, and subject to the limitations set forth herein, the Company grants you a limited, non-exclusive license to access and use the Web Site, provided that access to the Web Site is used solely for your personal, internal, and non-commercial information purposes. Except as expressly provided above, nothing contained herein shall be construed as conferring, by implication, estoppel, or otherwise, any license or right under any patent, trademark, copyright, or other proprietary right of the Company. You promise that you will not use the Web Site, in whole or in part, for any purpose that is unlawful or prohibited by these Terms of Use or for any purposes other than those that are expressly licensed by the Company.
                  </li>
                  <li>
                    The use by Athena Resilience Group's clients (the “Clients”) of the Web Site shall be governed by the terms of the separate agreements entered into between such Clients and the Company (“Client Agreements”) to the extent of a conflict between the applicable Client Agreement and these Terms of Use.
                  </li>
                  <li>
                    You agree that you will not modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, frame in another web page, use on any other website, transfer or sell any pages, information, software, lists of users, databases or other lists, content, material, products, or services provided through or obtained from the Web Site, or any portion thereof. You agree that you will not use the Web Site in any manner that could damage, disable, overburden, or impair the Web Site, or interfere with any other party's use and enjoyment of the Web Site. You may not obtain or attempt to obtain any materials or information through any means not intentionally made available or provided for through the Web Site.
                  </li>
                  <li>
                    Except with the written permission of the Company, you agree that you will not access or attempt to access password-protected, secure, or non-public areas of the Web Site. Unauthorized individuals attempting to access prohibited areas of the Web Site may be subject to prosecution in accordance with Greek and European cybercrime frameworks.
                  </li>
                  <li>
                    Except with the advanced, written permission of the Company, you agree that you will not create links from any website or web page to any page within the Web Site with the exception of the Web Site homepage. The origin of any such link to the Web Site homepage must be accompanied by a clear and prominent attribution indicating that the link is connected to the Web Site. You agree that you will not juxtapose the "Athena Resilience Group" name or link with your name or any other material(s) in a manner that might give rise to any erroneous conclusion that there is any affiliation or association between the Company, on the one hand, and you or any other person or entity, on the other hand. You agree that if the Company, at its sole and unfettered discretion, requests in writing that you remove any links to the Web Site, you will promptly do so.
                  </li>
                  <li>
                    You agree that the Company may at its sole discretion and at any time terminate your access to and use of the Web Site, or any part thereof, with or without notice.
                  </li>
                  <li>
                    In order for you to participate in certain Services available to Clients that the Company provides through the Web Site, the Company will require that you register and provide specific information about yourself (the "Solicited Information"). If you choose to register and to participate in such Services, you agree to provide true, accurate, and complete information and to refrain from impersonating or falsely representing your affiliation with any person or entity. The Company is committed to maintaining the privacy and security of any and all such information in compliance with our standard Privacy Policy.
                  </li>
                  <li>
                    Any use of the Web Site with your username and password will be deemed as being used by you. The Company is entitled to rely on the contact and other information that is supplied to us through your registration. Your registration is non-transferable and non-assignable.
                  </li>
                  <li>
                    By using the Web Site or otherwise contacting the Company, you consent to receiving emails and/or telephone calls from the Company. You must always provide accurate, current, and complete information to the Company when contacting the Company.
                  </li>
                  <li>
                    The Company reserves the right at all times to disclose any information as necessary to satisfy any applicable European and Greek laws, regulations, legal processes, or governmental requests.
                  </li>
                  <li>
                    By using the Web Site, you agree to indemnify, defend, and hold harmless the Company, its employees, directors, partners, affiliates, subsidiaries, and suppliers from any and all claims or damage, including attorneys' fees, arising out of or related to: (1) content you choose to submit, post, or transmit through the Web Site; (2) your use of or connection to the Web Site; (3) your violation of these Terms of Use; or (4) your violation of any rights of another.
                  </li>
                </ol>
              </section>

              {/* Intellectual Property */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  Intellectual Property
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light text-left">
                  Unless otherwise stated, as between the Company and you, the copyright and other intellectual property rights to the Web Site and all of its contents, features, and functionality (including without limitation photographs, graphical images, information, software, text, displays, video and audio, and the design, selection, and arrangement thereof) are owned by the Company or its licensors and are protected by Greek, European, and international copyright, trademark, patent, trade secret, and other intellectual property and proprietary rights laws.
                </p>
                <p className="text-xs sm:text-sm leading-relaxed font-light text-left">
                  For the avoidance of doubt, the trademarks, trade names, and service marks (the "Marks") displayed on the Web Site are the exclusive property of the Company or other third parties. Users are not permitted to copy or otherwise use these Marks without the prior written consent of the Company or such third party that may own the Mark.
                </p>
              </section>

              {/* Devices */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  Devices
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light text-left">
                  You agree that you will not use any robot, spider, other automatic device, or manual process to monitor or copy our web pages or the content they contain without our prior express written permission. You agree that you will not use any device, software, or routine to interfere or attempt to interfere with the proper working of the Web Site. You agree that you will not take any action that imposes an unreasonable or disproportionately large load on our digital hosting infrastructure.
                </p>
              </section>

              {/* No Unlawful or Prohibited Use */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  No Unlawful or Prohibited Use
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light text-left">
                  As a condition of your use of the Web Site, you warrant to the Company that you will comply with all applicable local, national, and international laws, statutes, ordinances, and regulations regarding your use of our service and any related activities. In addition, you warrant that you will not use the Web Site in any way prohibited by these terms, conditions, and notices.
                </p>
              </section>

              {/* Disclaimer */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  Disclaimer of Warranties and Liabilities
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light text-left">
                  The Web Site may contain links to websites operated by parties other than the Company. Such hyperlinks are provided for reference only. The Company does not control such websites and is not responsible for their contents. The Company's inclusion of hyperlinks to such websites does not imply any endorsement of the material on such websites or any association with their operators. If you decide to access any of the third-party sites linked to the Web Site, you do so entirely at your own risk.
                </p>
                
                <div className={`p-4 rounded-xl text-left text-[11px] sm:text-xs leading-relaxed space-y-3 font-normal font-mono ${isDarkMode ? 'bg-white/5 border-white/10 text-[#E8E6E3]/90' : 'bg-[#152532]/5 border-[#152532]/10 text-[#152532]/95'} border`}>
                  <p>
                    YOU EXPRESSLY UNDERSTAND AND AGREE THAT YOUR LIGHT AND USE OF THE WEB SITE IS AT YOUR OWN RISK. THE WEB SITE AND ALL INFORMATION, CONTENT, SOFTWARE, PRODUCTS, OR SERVICES PROVIDED ON OR THROUGH THE WEB SITE ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. THE COMPANY EXPRESSLY DISCLAIMS, AND YOU HEREBY WAIVE, ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
                  </p>
                  <p>
                    THE COMPANY MAKES NO WARRANTY THAT (I) THE WEB SITE WILL MEET YOUR REQUIREMENTS, (II) THE WEB SITE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, (III) THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE WEB SITE WILL BE ACCURATE OR RELIABLE, OR (IV) ANY SEEMING MISMATCHES OR DEFECTS WILL BE RESOLVED.
                  </p>
                </div>
              </section>

              {/* Indemnity */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  Indemnity
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light text-left">
                  You agree to indemnify and hold the Company harmless from any demands, losses, liabilities, claims, or expenses (including reasonable attorneys' fees), made against the Company by any third party due to or arising out of or in connection with (1) your access to or use of the Web Site or the Company's Services; (2) your violation of these Terms of Use or any applicable EU or Greek regulations; (3) your violation of any rights of any third party; or (4) any disputes between you and any third party.
                </p>
              </section>

              {/* Governing Law; Dispute Resolution */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  Governing Law; Dispute Resolution
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light text-left">
                  To the fullest extent permitted by law, you agree that all matters relating to your access to or use of the Web Site and the Company's Services, including all disputes, will be governed by the laws of Greece and the European Union, excluding its conflicts of law principles.
                </p>
                <p className="text-xs sm:text-sm leading-relaxed font-light text-left">
                  To the extent permitted under applicable law, you consent and submit to the personal and exclusive jurisdiction of the competent courts of Athens, Greece, as the exclusive forum and place of litigation for any and all disputes arising out of these Terms of Use or your use of the Services.
                </p>
                <p className="text-xs sm:text-sm leading-relaxed font-light text-left">
                  You agree that any claim under these Terms of Use must be brought within one (1) year after the cause of action arises, or such claim or cause of action is permanently barred.
                </p>
              </section>

              {/* Users Outside Greece */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  Users Outside Greece
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light text-left font-jakarta">
                  Athena Resilience Group is a Greek corporation, and the Company is headquartered in Athens, Greece. Although the Web Site is accessible worldwide, not all features, products, or Services discussed, referenced, provided, or offered through or on the Web Site are available to all persons or in all geographic locations, or appropriate or available for use outside the EU. If you choose to access the Web Site from outside Greece, you do so on your own initiative, and you are responsible for complying with applicable local laws and GDPR-equivalent standards in your jurisdiction.
                </p>
              </section>

              {/* Miscellaneous */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  Miscellaneous
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light text-left font-jakarta">
                  All provisions of these Terms of Use are severable, and the unenforceability or invalidity of any of the provisions will not affect the enforceability or validity of the remaining provisions. These Terms of Use, together with the Privacy Policy and any other legal notices published by the Company, constitute the entire agreement between you and the Company with regard to your use of the Web Site.
                </p>
              </section>

              {/* Questions and Contact Information */}
              <section className="space-y-3 text-left border-t pt-6 border-current/10 font-jakarta">
                <h4 className={`text-base md:text-lg font-display font-semibold ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#152532]'}`}>
                  Questions and Contact Information
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed font-light font-jakarta">
                  The Company's headquarters is located at:
                </p>
                <p className="text-xs sm:text-sm leading-relaxed font-light pl-3 border-l border-current/10 text-left font-jakarta">
                  <strong>Athena Resilience Group</strong><br />
                  Athens Business Hub 24, Patision 75,<br />
                  10434, Athens, Greece<br /><br />
                  Email: <a href="mailto:privacy@athenaresiliencegroup.com" className="font-semibold hover:text-athena-peach underline transition-colors">privacy@athenaresiliencegroup.com</a>
                </p>
              </section>
            </div>
          </motion.div>
        )}

        {(showLeadership || showTeam || showPartners || showCookiesPolicy || showUnsubscribe || showPrivacyPolicy || showTerms) && (
          <motion.div 
            key="popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setShowLeadership(false); setShowTeam(false); setShowPartners(false); setShowCookiesPolicy(false); setShowUnsubscribe(false); setShowPrivacyPolicy(false); setShowTerms(false); }}
            className="fixed inset-0 bg-athena-navy/20 backdrop-blur-md z-[65]"
          />
        )}

        {/* Cookie preferences dialogue boxes */}
        {isCookieOpen && (
          <>
            {isAdjustingConsent ? (
              // ADJUSTING STATE - Full screen dark blur backdrop + Centered Modal
              <>
                <motion.div
                  key="cookie-backdrop-adjust"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsAdjustingConsent(false)}
                  className={`fixed inset-0 backdrop-blur-md z-[85] ${isDarkMode ? 'bg-[#152532]/60' : 'bg-[#152532]/30'}`}
                />

                <motion.div
                  key="cookie-dialog-adjust"
                  initial={{ opacity: 0, scale: 0.92, x: "-50%", y: "-45%" }}
                  animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                  exit={{ opacity: 0, scale: 0.92, x: "-50%", y: "-45%" }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  style={{ top: "50%", left: "50%" }}
                  data-lenis-prevent
                  role="dialog"
                  aria-modal="true"
                  aria-label="Adjust Cookie Preferences"
                  className={`fixed w-[calc(100%-32px)] max-w-[540px] max-h-[85vh] ${isDarkMode ? 'bg-[#1a2c3a] border-white/10' : 'bg-white border-athena-navy/10'} rounded-2xl shadow-2xl z-[90] overflow-hidden border flex flex-col font-sans`}
                >
                  {/* Header */}
                  <div className={`px-6 py-4.5 flex justify-between items-center select-none border-b shrink-0 ${isDarkMode ? 'bg-[#152532] text-white border-[#243847]' : 'bg-white text-[#152532] border-[#152532]/10'}`}>
                    <div className="flex flex-col gap-0.5 text-left">
                      <h3 className="text-sm sm:text-base font-medium tracking-wide">{cookieTranslations[cookieLang].adjustTitle}</h3>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-[#fca71e]' : 'text-athena-peach'}`}>GDPR & CPRA</span>
                    </div>
                    
                    <button
                      onClick={() => setIsAdjustingConsent(false)}
                      className={`p-1.5 rounded-full transition-colors flex items-center justify-center cursor-pointer ${isDarkMode ? 'hover:bg-[#243847] text-white/85 hover:text-white' : 'hover:bg-[#152532]/5 text-[#152532]/85 hover:text-[#152532]'}`}
                      aria-label="Close settings"
                    >
                      <X size={18} className="stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Body (scrollable) */}
                  <div 
                    data-lenis-prevent
                    className={`p-6 overflow-y-auto scrollbar-hide overscroll-contain touch-pan-y flex flex-col gap-6 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    style={{ WebkitOverflowScrolling: "touch" }}
                  >
                    {/* Generally */}
                    <div className="flex flex-col gap-2 text-left">
                      <h4 className={`font-bold text-base ${isDarkMode ? 'text-[#eaeaea]' : 'text-[#152532]'}`}>{cookieTranslations[cookieLang].generallyTitle}</h4>
                      <div className={`flex flex-col gap-3 text-xs sm:text-sm font-light leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p>{cookieTranslations[cookieLang].generallyDesc1}</p>
                        <p>{cookieTranslations[cookieLang].generallyDesc2}</p>
                        <p>{cookieTranslations[cookieLang].generallyDesc3}</p>
                        <p>{cookieTranslations[cookieLang].generallyDesc4}</p>
                      </div>
                    </div>

                    {/* Necessities Section */}
                    <div className={`border-t pt-5 flex items-start justify-between gap-4 text-left ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                      <div className="flex flex-col gap-1 max-w-[80%]">
                        <h4 className={`font-bold text-sm ${isDarkMode ? 'text-[#eaeaea]' : 'text-[#152532]'}`}>{cookieTranslations[cookieLang].essentials}</h4>
                        <p className={`text-xs font-light leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {cookieTranslations[cookieLang].essentialsDesc}
                        </p>
                      </div>
                      
                      {/* Disabled / Active Toggle */}
                      <div className="pt-2">
                        <div className={`w-11 h-6 rounded-full border flex items-center px-1 justify-end opacity-70 cursor-not-allowed ${isDarkMode ? 'bg-athena-peach/10 border-athena-peach/30' : 'bg-athena-peach/20 border-athena-peach/30'}`}>
                          <span className="w-4 h-4 bg-athena-peach rounded-full block" />
                        </div>
                      </div>
                    </div>

                    {/* Analytics Section */}
                    <div className={`border-t pt-5 flex items-start justify-between gap-4 text-left ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                      <div className="flex flex-col gap-1 max-w-[80%]">
                        <h4 className={`font-bold text-sm ${isDarkMode ? 'text-[#eaeaea]' : 'text-[#152532]'}`}>{cookieTranslations[cookieLang].analytics}</h4>
                        <p className={`text-xs font-light leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {cookieTranslations[cookieLang].analyticsDesc}
                        </p>
                      </div>
                      
                      {/* Toggle */}
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setCookieSettings(prev => ({
                              ...prev,
                              analytics: !prev.analytics
                            }));
                          }}
                          className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 border relative cursor-pointer ${
                            cookieSettings.analytics 
                              ? 'bg-athena-peach border-athena-peach/30 justify-end' 
                              : isDarkMode 
                                ? 'bg-gray-700 border-gray-600 justify-start'
                                : 'bg-gray-200 border-gray-300 justify-start'
                          }`}
                          aria-label="Toggle analytics cookies"
                        >
                          <motion.span 
                            layout 
                            className="w-4 h-4 bg-white rounded-full shadow-sm block"
                          />
                        </button>
                      </div>
                    </div>

                    {/* Advertising Section */}
                    <div className={`border-t pt-5 flex flex-col gap-3 text-left ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1 max-w-[80%]">
                          <h4 className={`font-bold text-sm ${isDarkMode ? 'text-[#eaeaea]' : 'text-[#152532]'}`}>{cookieTranslations[cookieLang].advertising}</h4>
                          <p className={`text-xs font-light leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {cookieTranslations[cookieLang].advertisingDesc}
                          </p>
                        </div>

                        {/* Interactive Toggle Switch */}
                        <div className="pt-2">
                          <button
                            onClick={() => {
                              setCookieSettings(prev => ({
                                ...prev,
                                advertising: !prev.advertising
                              }));
                            }}
                            className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 border relative cursor-pointer ${
                              cookieSettings.advertising 
                                ? 'bg-athena-peach border-athena-peach/30 justify-end' 
                                : isDarkMode 
                                  ? 'bg-gray-700 border-gray-600 justify-start'
                                  : 'bg-gray-200 border-gray-300 justify-start'
                            }`}
                            aria-label="Toggle advertising cookies"
                          >
                            <motion.span 
                              layout 
                              className="w-4 h-4 bg-white rounded-full shadow-sm block"
                            />
                          </button>
                        </div>
                      </div>

                      {/* Marketing Providers */}
                      <div className={`rounded-lg p-3 text-xs flex flex-col gap-1.5 border mt-1 font-light ${
                        isDarkMode 
                          ? 'bg-[#14232f] border-[#243847] text-gray-400' 
                          : 'bg-gray-50 border-gray-100 text-gray-600'
                      }`}>
                        <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{cookieTranslations[cookieLang].providersTitle}:</span>
                        <div className="flex flex-col gap-2 pl-1">
                          <div className="flex justify-between items-center mr-1">
                            <span>• LinkedIn Ads (Marketing)</span>
                            <a 
                              href="https://www.linkedin.com/legal/privacy-policy" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-athena-peach hover:underline"
                            >
                              {cookieTranslations[cookieLang].providerLinktext}
                            </a>
                          </div>
                          <div className="flex justify-between items-center mr-1">
                            <span>• Google Analytics (Statistics)</span>
                            <a 
                              href="https://policies.google.com/privacy" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-athena-peach hover:underline"
                            >
                              {cookieTranslations[cookieLang].providerLinktext}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className={`px-6 py-4 border-t flex justify-end gap-3 shrink-0 ${
                    isDarkMode ? 'bg-[#152532] border-[#243847]' : 'bg-gray-50 border-gray-100'
                  }`}>
                    <button
                      onClick={() => setIsAdjustingConsent(false)}
                      className={`px-5 py-2.5 font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer ${
                        isDarkMode 
                          ? 'bg-[#243847] hover:bg-[#324b5e] text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      {cookieTranslations[cookieLang].closeBtn}
                    </button>
                    <button
                      onClick={handleSaveCookieSettings}
                      className={`px-6 py-2.5 font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer ${
                        isDarkMode 
                          ? 'bg-white text-[#152532] hover:bg-athena-peach hover:text-[#152532]' 
                          : 'bg-[#152532] text-white hover:bg-athena-peach hover:text-[#152532]'
                      }`}
                    >
                      {cookieTranslations[cookieLang].storageBtn}
                    </button>
                  </div>
                </motion.div>
              </>
            ) : (
              // POPUP STATE - Floating right above the bottom-left button, no visual background blur backdrop
              <>
                {/* Transparent click-outside handler */}
                <div 
                  className="fixed inset-0 bg-transparent z-[75]" 
                  onClick={() => setIsCookieOpen(false)}
                />

                <motion.div
                  key="cookie-dialog-compact"
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Cookie Preferences Consent Panel"
                  className={`fixed bottom-[56px] left-6 w-[calc(100%-48px)] sm:w-[380px] ${
                    isDarkMode 
                      ? 'bg-[#1a2c3a] shadow-[0_12px_45px_-5px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.08)] border-white/10' 
                      : 'bg-white shadow-[0_12px_45px_-5px_rgba(21,37,50,0.15),0_0_0_1px_rgba(21,37,50,0.05)] border-athena-navy/10'
                  } rounded-2xl z-[80] overflow-hidden border font-sans`}
                >
                  {/* Header */}
                  <div className={`px-5 py-3 flex justify-between items-center select-none border-b ${
                    isDarkMode ? 'bg-[#152532] text-white border-[#243847]' : 'bg-white text-[#152532] border-[#152532]/10'
                  }`}>
                     <div className="flex flex-col text-left">
                       <span className="text-sm font-medium tracking-wide">{cookieTranslations[cookieLang].title}</span>
                       <span className={`text-[8px] font-mono ${isDarkMode ? 'text-athena-peach/85' : 'text-athena-peach'}`}>GDPR & CPRA</span>
                     </div>
                     <button
                       onClick={() => setIsCookieOpen(false)}
                       className={`p-1 rounded-full transition-colors flex items-center justify-center cursor-pointer ${
                         isDarkMode ? 'hover:bg-[#243847] text-white/80 hover:text-white' : 'hover:bg-[#152532]/5 text-[#152532]/80 hover:text-[#152532]'
                       }`}
                       aria-label="Close Manage cookies"
                     >
                       <X size={15} className="stroke-[2.5]" />
                     </button>
                  </div>

                  {/* Body */}
                  <div className={`p-5 flex flex-col gap-4 text-xs text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {/* Status Section */}
                    <div className="flex flex-col gap-2.5">
                      <h4 className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-[#eaeaea]' : 'text-[#152532]'}`}>{cookieTranslations[cookieLang].situation}</h4>
                      
                      {/* Necessary Item */}
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-green-950/20 text-green-400 flex items-center justify-center shrink-0 border border-green-900/10">
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          <span className="font-semibold">{cookieTranslations[cookieLang].essentials}:</span> <span className="opacity-80 font-light">{cookieTranslations[cookieLang].alwaysActive}</span>
                        </div>
                      </div>

                      {/* Analytics Item */}
                      <div className="flex items-center gap-2">
                        {cookieSettings.analytics ? (
                          <span className="w-4 h-4 rounded-full bg-green-950/20 text-green-400 flex items-center justify-center shrink-0 border border-green-900/10">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        ) : (
                          <span className="w-4 h-4 rounded-full bg-red-950/20 text-red-500 flex items-center justify-center shrink-0 border border-red-900/10">
                            <X size={10} className="stroke-[3]" />
                          </span>
                        )}
                        <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          <span className="font-semibold">{cookieTranslations[cookieLang].analytics}:</span> <span className="opacity-80 font-light">{cookieSettings.analytics ? cookieTranslations[cookieLang].active : cookieTranslations[cookieLang].inactive}</span>
                        </div>
                      </div>

                      {/* Advertising Item */}
                      <div className="flex items-center gap-2">
                        {cookieSettings.advertising ? (
                          <span className="w-4 h-4 rounded-full bg-green-950/20 text-green-400 flex items-center justify-center shrink-0 border border-green-100 dark:border-green-900/10 border-green-900/10">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        ) : (
                          <span className="w-4 h-4 rounded-full bg-red-950/20 text-red-500 flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900/10 border-red-900/10">
                            <X size={10} className="stroke-[3]" />
                          </span>
                        )}
                        <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          <span className="font-semibold">{cookieTranslations[cookieLang].advertising}:</span> <span className="opacity-80 font-light">{cookieSettings.advertising ? cookieTranslations[cookieLang].active : cookieTranslations[cookieLang].inactive}</span>
                        </div>
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className={`border-t pt-3.5 flex flex-col gap-2 ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                      <h4 className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-[#eaeaea]' : 'text-[#152532]'}`}>{cookieTranslations[cookieLang].details}</h4>
                      <div className={`flex flex-col gap-1.5 font-light text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <div className="flex items-center gap-1 flex-wrap">
                          <span>{cookieTranslations[cookieLang].date}:</span> 
                          <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{cookieSettings.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span>{cookieTranslations[cookieLang].consentId}:</span>
                          <div 
                            className="flex items-center gap-1 hover:opacity-100 transition-opacity cursor-pointer group"
                            onClick={() => {
                              if (typeof navigator !== 'undefined' && navigator.clipboard) {
                                navigator.clipboard.writeText(cookieSettings.id);
                                setCopiedId(true);
                                setTimeout(() => setCopiedId(false), 2000);
                              }
                            }}
                            title="Click to copy Consent ID"
                          >
                            <code className={`font-mono text-[9px] px-1.5 py-0.5 rounded border select-all tracking-tight break-all transition-colors ${
                              isDarkMode 
                                ? 'bg-[#14232f] text-athena-peach border-athena-peach/10 hover:bg-[#1C2E3D]' 
                                : 'bg-gray-100 text-athena-navy border-athena-navy/10 hover:bg-gray-200'
                            }`}>
                              {cookieSettings.id}
                            </code>
                            <span className="text-[8px] font-sans font-bold text-green-500 opacity-60">
                              {copiedId ? cookieTranslations[cookieLang].copied : cookieTranslations[cookieLang].copy}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* GDPR DIRECT FIRST-LAYER CHOICE ACTIONS BUTTON PACK */}
                    <div className={`pt-2 border-t flex flex-col gap-2 ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={handleAcceptAllCookies}
                          className="py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white font-sans font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all active:scale-98 cursor-pointer shadow-sm text-center"
                        >
                          {cookieTranslations[cookieLang].acceptAllBtn}
                        </button>
                        <button
                          onClick={handleRejectAllCookies}
                          className="py-2 px-3 bg-[#fca71e] hover:bg-[#e59413] text-[#111D29] font-sans font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all active:scale-98 cursor-pointer shadow-sm text-center"
                        >
                          {cookieTranslations[cookieLang].rejectAllBtn}
                        </button>
                      </div>
                      <button
                        onClick={() => setIsAdjustingConsent(true)}
                        className={`w-full py-2 font-sans font-bold text-[10px] uppercase tracking-widest rounded-lg transition-all border active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                          isDarkMode 
                            ? 'bg-[#243847] hover:bg-athena-peach hover:text-[#152532] text-[#eaeaea] border-gray-700' 
                            : 'bg-gray-100 hover:bg-athena-peach hover:text-[#152532] text-gray-700 border-gray-300'
                        }`}
                      >
                        {cookieTranslations[cookieLang].adjustBtn}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cookieToast && (
          <motion.div
            key="cookie-toast"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="fixed bottom-6 right-6 z-[99] flex items-center gap-3 px-5 py-3.5 bg-[#152532] text-[#eaeaea] dark:bg-white dark:text-[#152532] shadow-[0_15px_40px_rgba(21,37,50,0.35)] rounded-xl border border-white/10 dark:border-athena-navy/10 font-sans font-medium text-xs sm:text-xs"
          >
            <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span>{cookieTranslations[cookieLang].successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            key="back-to-top"
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            }}
            aria-label="Back to top"
            className="fixed bottom-6 right-4 sm:right-6 z-[60] p-3 rounded-full bg-athena-peach text-[#152532] shadow-2xl border border-athena-peach/25 hover:bg-[#152532] hover:text-white dark:hover:bg-white dark:hover:text-[#152532] hover:border-athena-peach transition-all duration-300 cursor-pointer flex items-center justify-center group"
          >
            <svg className="w-4 h-4 stroke-[3] transition-transform duration-300 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7 7 7M12 3v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Rented-space Tab Button (Cookie preferences sticky horizontal pill on the bottom-left list) */}
      <button
        id="cookie-preferences-pill"
        onClick={() => setIsCookieOpen(true)}
        className="fixed bottom-0 left-4 sm:left-6 z-[50] flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-white dark:bg-[#1C2E3D] text-[#152532] dark:text-[#eaeaea] hover:text-white dark:hover:text-[#152532] shadow-[0_-4px_12px_rgba(0,0,0,0.06)] rounded-t-xl border-t border-x border-[#152532]/10 dark:border-white/10 hover:bg-athena-peach dark:hover:bg-athena-peach hover:border-athena-peach/30 transition-all duration-300 cursor-pointer"
      >
        <Cookie className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0 text-athena-peach group-hover:text-[#152532]" />
        <span className="text-[8px] sm:text-[9px] font-sans font-bold uppercase tracking-widest whitespace-nowrap">Manage Cookies</span>
        <ChevronRight className="w-2 h-2 sm:w-2.5 sm:h-2.5 opacity-50" />
      </button>
      </motion.div>
    </div>
  );
}
