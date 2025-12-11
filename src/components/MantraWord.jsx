import React, { useEffect, useState } from 'react';

const MantraWord = ({ word }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    // Short timeout to trigger animation frame
    const timer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timer);
  }, [word]);

  return (
    <div
      className={`
        text-5xl md:text-7xl lg:text-8xl font-bold text-mantra-red select-none
        transition-all duration-300 ease-out transform
        ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      `}
    >
      {word}
    </div>
  );
};

export default MantraWord;
