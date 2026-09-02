import React from 'react';

export const SearchLens: React.FC<{ size?: number; color?: string; className?: string }> = ({ 
  size = 20, 
  color = "#66aba5", 
  className = "" 
}) => {
  // Proportions inspired by the Logo's inner circle
  const strokeWidth = size * 0.12;
  const radius = size * 0.32;
  const centerX = size * 0.4;
  const centerY = size * 0.4;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <line
        x1={centerX + radius * 0.707}
        y1={centerY + radius * 0.707}
        x2={size * 0.85}
        y2={size * 0.85}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
};
