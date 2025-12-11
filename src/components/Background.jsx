import React from 'react';
import { LINE_BG_COLORS } from '../utils/constants';

const Background = ({ currentTheme, currentLineIndex }) => {
  // Determine background style
  // Priority: Theme > Line Color

  let backgroundStyle = {};

  if (currentTheme) {
    backgroundStyle = { background: currentTheme.bgGradient };
  } else {
    // Default Mode: Line-based colors
    const bgColor = LINE_BG_COLORS[currentLineIndex] || LINE_BG_COLORS[0];
    backgroundStyle = { backgroundColor: bgColor };
  }

  return (
    <div
      className="absolute inset-0 -z-10 transition-colors duration-500 ease-in-out"
      style={backgroundStyle}
    />
  );
};

export default Background;
