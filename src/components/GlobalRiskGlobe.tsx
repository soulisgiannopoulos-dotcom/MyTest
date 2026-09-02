import React, { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface GlobalRiskGlobeProps {
  isDarkMode: boolean;
}

interface Hotspot {
  name: string;
  coords: [number, number];
  color: string;
  risk: string;
  desc: string;
}

const GlobalRiskGlobe: React.FC<GlobalRiskGlobeProps> = ({ isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredState, setHoveredState] = useState<any>(null);
  const [isRotatingManually, setIsRotatingManually] = useState(false);

  // Geopolitical hotspots with detailed risk profiles
  const hotspots: Hotspot[] = useMemo(() => [
    { 
      name: 'Middle East', 
      coords: [35, 32] as [number, number], 
      color: '#ff4d4d',
      risk: 'Geopolitical Instability',
      desc: 'Critical maritime chokepoints subject to rising global polarization and infrastructure security friction.'
    },
    { 
      name: 'Eastern Europe', 
      coords: [31, 49] as [number, number], 
      color: '#ff4d4d',
      risk: 'Supply Chain Friction',
      desc: 'Regional transit delays and cross-border decoupling affecting continental distribution networks.' 
    },
    { 
      name: 'SE Asia', 
      coords: [115, 15] as [number, number], 
      color: '#ff4d4d',
      risk: 'Maritime Transport Bottlenecks',
      desc: 'High concentration of global tech lanes and microchip logistics vulnerable to geopolitical pivots.' 
    },
    { 
      name: 'North America', 
      coords: [-100, 40] as [number, number], 
      color: '#66aba5',
      risk: 'Power Grid Transformation',
      desc: 'Transition dependencies during high-capacity clean integration, impacting urban cluster resiliency.' 
    },
    { 
      name: 'South America', 
      coords: [-60, -15] as [number, number], 
      color: '#66aba5',
      risk: 'Bio-asset Regulatory Pressure',
      desc: 'Evolving frameworks on voluntary carbon sinks and sovereign nature capital protection standards.' 
    },
    { 
      name: 'Africa', 
      coords: [20, 0] as [number, number], 
      color: '#66aba5',
      risk: 'Critical Minerals Sovereignty',
      desc: 'Concentration of cobalt, lithium, and rare earth channels facing resource nationalism risk.' 
    },
  ], []);

  // Connections representation
  const connections = useMemo(() => [
    { from: hotspots[0].coords, to: hotspots[1].coords },
    { from: hotspots[1].coords, to: hotspots[2].coords },
    { from: hotspots[0].coords, to: hotspots[5].coords },
    { from: hotspots[3].coords, to: hotspots[0].coords },
  ], [hotspots]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    context.scale(dpr, dpr);

    const projection = d3.geoOrthographic()
      .scale(Math.min(width, height) / 2.2)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    const path = d3.geoPath(projection, context);
    const graticule = d3.geoGraticule();

    let world: any = null;
    let rotation = 0;
    let pitch = -15;
    let animationFrameId: number;
    let isVisible = false;
    let isRunning = false;

    let isDragging = false;
    let previousX = 0;
    let previousY = 0;

    const colors = {
      land: isDarkMode ? '#1c2e3d' : '#ffffff',
      borders: '#66aba5',
      graticule: 'rgba(102, 171, 165, 0.15)',
      ocean: isDarkMode ? '#152532' : '#f9f5ec',
      hotspot: '#ff4d4d',
      connection: isDarkMode ? 'rgba(255, 77, 77, 0.4)' : 'rgba(255, 77, 77, 0.3)'
    };

    const render = () => {
      if (!isVisible) {
        isRunning = false;
        return;
      }
      isRunning = true;

      // Slowly auto-rotate only when not dragging
      if (!isDragging) {
        rotation += 0.2;
      }

      projection.rotate([rotation, pitch]);

      context.clearRect(0, 0, width, height);

      // Sphere bounds
      context.beginPath();
      context.arc(width / 2, height / 2, projection.scale(), 0, 2 * Math.PI);
      context.fillStyle = colors.ocean;
      context.fill();

      // Lines of longitude / latitude
      context.beginPath();
      path(graticule());
      context.lineWidth = 0.5;
      context.strokeStyle = colors.graticule;
      context.stroke();

      if (world) {
        // Render countries
        context.beginPath();
        path(world);
        context.fillStyle = colors.land;
        context.fill();

        // Render borders
        context.beginPath();
        path(world);
        context.lineWidth = 1;
        context.strokeStyle = colors.borders;
        context.stroke();
      }

      // Draw active geopolitical risk vectors
      connections.forEach(conn => {
        const geoLine: any = { type: 'LineString', coordinates: [conn.from, conn.to] };
        context.beginPath();
        path(geoLine);
        context.setLineDash([4, 4]);
        context.lineWidth = 1;
        context.strokeStyle = colors.connection;
        context.stroke();
        context.setLineDash([]);
      });

      // Show risk beacons
      const time = Date.now() * 0.005;
      hotspots.forEach(spot => {
        const [x, y] = projection(spot.coords) || [0, 0];
        const visible = d3.geoDistance(spot.coords, [-rotation, -pitch]) < Math.PI / 2;
        
        if (visible) {
          const pulse = Math.sin(time) * 3 + 5;
          context.beginPath();
          context.arc(x, y, pulse, 0, 2 * Math.PI);
          context.fillStyle = spot.color + '44';
          context.fill();
          
          context.beginPath();
          context.arc(x, y, 2, 0, 2 * Math.PI);
          context.fillStyle = spot.color;
          context.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    // User drag rotation support
    const handleDragStart = (x: number, y: number) => {
      isDragging = true;
      setIsRotatingManually(true);
      previousX = x;
      previousY = y;
    };

    const handleDragMove = (x: number, y: number) => {
      if (!isDragging) return;
      const dx = x - previousX;
      const dy = y - previousY;

      rotation += dx * 0.35;
      pitch = Math.max(-60, Math.min(60, pitch - dy * 0.35));

      previousX = x;
      previousY = y;
    };

    const handleDragEnd = () => {
      isDragging = false;
    };

    const checkPointHover = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;

      let hovered: any = null;
      hotspots.forEach(spot => {
        const [x, y] = projection(spot.coords) || [0, 0];
        const visible = d3.geoDistance(spot.coords, [-rotation, -pitch]) < Math.PI / 2;
        
        if (visible) {
          const dist = Math.hypot(x - localX, y - localY);
          if (dist < 15) {
            hovered = {
              ...spot,
              x,
              y
            };
          }
        }
      });

      setHoveredState(hovered);
    };

    // Events registration
    const onMouseDown = (e: MouseEvent) => {
      handleDragStart(e.clientX, e.clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientX, e.clientY);
      checkPointHover(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      handleDragEnd();
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
        checkPointHover(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchEnd = () => {
      handleDragEnd();
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Visibility management
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !isRunning && world) {
            render();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(canvas);

    // World Atlas
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((data: any) => {
      world = topojson.feature(data, data.objects.countries);
      if (isVisible) render();
    });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.scale(dpr, dpr);
      projection.scale(Math.min(width, height) / 2.2).translate([width / 2, height / 2]);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDarkMode, hotspots, connections]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Main Canvas rendering D3 World Globe */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full max-w-full max-h-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      />

      {/* Contextual Hotspot Tooltip */}
      <AnimatePresence>
        {hoveredState && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="absolute z-20 w-64 p-4 bg-white dark:bg-athena-surface border border-athena-peach/30 dark:border-athena-peach/40 shadow-xl rounded-xl text-left pointer-events-none"
            style={{ 
              top: hoveredState.y - 120, // position above hotspot point
              left: Math.max(10, Math.min(window.innerWidth - 270, hoveredState.x - 128)) // keep inside safe width constraints
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldAlert size={14} className="text-[#ff4d4d]" />
              <h5 className="font-display font-medium text-xs text-[#152532] dark:text-[#eaeaea] uppercase tracking-wider leading-none">
                {hoveredState.name}
              </h5>
            </div>
            <p className="text-[10px] text-athena-peach font-mono font-bold tracking-widest uppercase mb-1.5 leading-none">
              {hoveredState.risk}
            </p>
            <p className="text-[10px] font-sans text-athena-navy/70 dark:text-white/70 leading-relaxed font-light">
              {hoveredState.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalRiskGlobe;
