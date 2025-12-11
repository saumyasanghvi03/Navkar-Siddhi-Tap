import React from 'react';

const MalaRing = ({ totalNavkars, currentTheme }) => {
  const count = totalNavkars % 108;
  const beads = Array.from({ length: 108 }, (_, i) => i);

  // SVG Config
  const radius = 140;
  const centerX = 160;
  const centerY = 160;

  // Theme Color
  const activeColor = currentTheme ? currentTheme.gridFill : '#b91c1c';

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
      <svg
        viewBox="0 0 320 320"
        className="w-[85vmin] h-[85vmin] max-w-[500px] max-h-[500px] opacity-80"
      >
        {beads.map((i) => {
          // Calculate position
          // Start from top ( -90 degrees)
          const angle = (i * (360 / 108)) - 90;
          const radian = (angle * Math.PI) / 180;
          const x = centerX + radius * Math.cos(radian);
          const y = centerY + radius * Math.sin(radian);

          const isCompleted = i < count;
          const isCurrent = i === count - 1;

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={isCurrent ? 4 : 2.5}
              fill={isCompleted ? activeColor : '#d1d5db'}
              className="transition-all duration-300"
              style={{
                 fill: isCompleted ? activeColor : undefined,
                 opacity: isCompleted ? 0.9 : 0.4
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default MalaRing;
