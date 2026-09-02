import React from 'react';
import { motion } from 'motion/react';

export const Infographic: React.FC<{ className?: string }> = ({ className }) => {
  const teal = "#66aba5";
  const navy = "#152532";

  // Cluster 1: Sustainability (Bottom Left)
  const c1 = { x: 250, y: 400 };
  const nodes1 = [
    { label: "CLIMATE SCIENCE", angle: -150 },
    { label: "CIRCULAR ECONOMY", angle: -90 },
    { label: "ESG REPORTING", angle: -30 },
    { label: "RESOURCE STEWARDSHIP", angle: 150 },
    { label: "SOCIAL IMPACT", angle: 90 },
  ];

  // Cluster 2: Business (Top Right)
  const c2 = { x: 750, y: 200 };
  const nodes2 = [
    { label: "STRATEGIC ADVANTAGE", angle: -120 },
    { label: "INNOVATION", angle: -60 },
    { label: "FINANCIAL PERFORMANCE", angle: 0 },
    { label: "BRAND REPUTATION", angle: 60 },
    { label: "RISK MITIGATION", angle: 120 },
    { label: "OPERATIONAL EFFICIENCY", angle: 180 },
  ];

  const radius1 = 120;
  const radius2 = 160;

  return (
    <svg 
      viewBox="0 0 1000 650" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Cluster 1 Orbital Ring Boundary Tracing */}
      <motion.circle
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.15 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: "easeInOut", delay: 0.2 }}
        cx={c1.x} cy={c1.y} r={radius1}
        fill="none"
        stroke={teal}
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      {/* Cluster 2 Orbital Ring Boundary Tracing */}
      <motion.circle
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.15 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.4 }}
        cx={c2.x} cy={c2.y} r={radius2}
        fill="none"
        stroke={teal}
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      {/* Bridge */}
      <motion.line 
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.4 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.5 }}
        x1={c1.x} y1={c1.y} 
        x2={c2.x} y2={c2.y} 
        stroke={teal} 
        strokeWidth="1" 
        strokeDasharray="4 4"
      />
      
      {/* Bridge Label */}
      <motion.g 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.5 }}
        transform={`translate(${(c1.x + c2.x) / 2}, ${(c1.y + c2.y) / 2}) rotate(${(Math.atan2(c2.y - c1.y, c2.x - c1.x) * 180) / Math.PI})`}
      >
        <text 
          y="-10" 
          textAnchor="middle" 
          fill={teal} 
          fontSize="10" 
          fontWeight="bold" 
          letterSpacing="0.1em"
          className="font-display"
        >
          EFFECTIVE APPLICATION
        </text>
      </motion.g>

      {/* Cluster 1 Connections */}
      {nodes1.map((node, i) => {
        const nx = c1.x + radius1 * Math.cos((node.angle * Math.PI) / 180);
        const ny = c1.y + radius1 * Math.sin((node.angle * Math.PI) / 180);
        return (
          <g key={`c1-node-${i}`}>
            <motion.line 
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.3 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
              x1={c1.x} y1={c1.y} x2={nx} y2={ny} stroke={teal} strokeWidth="0.5" 
            />
            <motion.circle 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1 + (i * 0.1) }}
              cx={nx} cy={ny} r="4" fill={teal} filter="url(#glow)" 
            />
            {/* Outer Node Tracing Ring */}
            <motion.circle 
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1 + (i * 0.1) }}
              cx={nx} cy={ny} r="8" 
              fill="none"
              stroke={teal}
              strokeWidth="0.75"
              strokeDasharray="2 2"
            />
            <motion.text 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2 + (i * 0.1) }}
              x={nx + (nx > c1.x ? 10 : -10)} 
              y={ny + (ny > c1.y ? 5 : -5)} 
              textAnchor={nx > c1.x ? "start" : "end"} 
              fill={teal} 
              fontSize="8" 
              fontWeight="600"
              className="font-sans"
            >
              [{node.label}]
            </motion.text>
          </g>
        );
      })}

      {/* Cluster 2 Connections */}
      {nodes2.map((node, i) => {
        const nx = c2.x + radius2 * Math.cos((node.angle * Math.PI) / 180);
        const ny = c2.y + radius2 * Math.sin((node.angle * Math.PI) / 180);
        return (
          <g key={`c2-node-${i}`}>
            <motion.line 
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.3 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
              x1={c2.x} y1={c2.y} x2={nx} y2={ny} stroke={teal} strokeWidth="0.5" 
            />
            <motion.circle 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.3 + (i * 0.1) }}
              cx={nx} cy={ny} r="5" fill={teal} filter="url(#glow)" 
            />
            {/* Outer Node Tracing Ring */}
            <motion.circle 
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1.3 + (i * 0.1) }}
              cx={nx} cy={ny} r="10" 
              fill="none"
              stroke={teal}
              strokeWidth="0.75"
              strokeDasharray="2 2"
            />
            <motion.text 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.5 + (i * 0.1) }}
              x={nx + (nx > c2.x ? 12 : -12)} 
              y={ny + (ny > c2.y ? 5 : -5)} 
              textAnchor={nx > c2.x ? "start" : "end"} 
              fill={teal} 
              fontSize="9" 
              fontWeight="600"
              className="font-sans"
            >
              [{node.label}]
            </motion.text>
          </g>
        );
      })}

      {/* Main Cluster Nodes */}
      <motion.circle 
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        cx={c1.x} cy={c1.y} r="8" fill={teal} 
      />
      {/* Main Node 1 Center Tracing Ring */}
      <motion.circle
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.4 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.6 }}
        cx={c1.x} cy={c1.y} r="16"
        fill="none"
        stroke={teal}
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <motion.text 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        x={c1.x} y={c1.y + 25} 
        textAnchor="middle" 
        fill={teal} 
        fontSize="12" 
        fontWeight="bold"
        className="font-display"
      >
        SUSTAINABILITY KNOWLEDGE & SKILLS
      </motion.text>

      <motion.circle 
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        cx={c2.x} cy={c2.y} r="10" fill={teal} 
      />
      {/* Main Node 2 Center Tracing Ring */}
      <motion.circle
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.4 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.8 }}
        cx={c2.x} cy={c2.y} r="20"
        fill="none"
        stroke={teal}
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <motion.text 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        x={c2.x} y={c2.y - 25} 
        textAnchor="middle" 
        fill={teal} 
        fontSize="14" 
        fontWeight="bold"
        className="font-display"
      >
        CORE BUSINESS COMPETENCIES
      </motion.text>

      {/* Bottom Caption */}
      <motion.text 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 2 }}
        x="500" y="620" 
        textAnchor="middle" 
        fill={teal} 
        fontSize="14" 
        fontWeight="bold" 
        letterSpacing="0.05em"
        className="font-display"
      >
        APPLIED EFFECTIVELY, SUSTAINABILITY KNOWLEDGE & SKILLS ARE CORE BUSINESS COMPETENCIES.
      </motion.text>
    </svg>
  );
};
