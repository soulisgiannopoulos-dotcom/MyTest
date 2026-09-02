import React from 'react';

export const Logo: React.FC<{ className?: string; size?: number; color?: string }> = ({ className, size = 48, color = "rgba(102, 171, 165, 0.6)" }) => {
  const center = size / 2;
  const strokeWidth = size * 0.04;
  const centralRadius = size * 0.07;
  const darkCircleRadius = centralRadius * 1.3; // 30% larger
  const innerDistance = size * 0.18;
  const outerDistance = size * 0.36;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Central hollow circle */}
      <circle
        cx={center}
        cy={center}
        r={centralRadius}
        fill="transparent"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      
      {/* 12 solid black circles in hexagonal formation */}
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        
        // Inner ring (6 circles)
        const ix = center + innerDistance * Math.cos(rad);
        const iy = center + innerDistance * Math.sin(rad);
        
        // Outer ring (6 circles)
        const ox = center + outerDistance * Math.cos(rad);
        const oy = center + outerDistance * Math.sin(rad);
        
        return (
          <React.Fragment key={angle}>
            <circle cx={ix} cy={iy} r={darkCircleRadius} fill={color} />
            <circle cx={ox} cy={oy} r={darkCircleRadius} fill={color} />
          </React.Fragment>
        );
      })}
    </svg>
  );
};
