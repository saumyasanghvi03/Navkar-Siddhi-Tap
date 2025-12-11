import React from 'react';

const ProgressGrid = ({ totalCount }) => {
  const filledCount = totalCount % 100;
  const boxes = Array.from({ length: 100 }, (_, i) => i);

  return (
    <div className="fixed bottom-0 left-0 w-full p-2 bg-parchment/90 backdrop-blur-sm">
      <div className="grid grid-cols-[repeat(10,minmax(0,1fr))] gap-1 max-w-sm mx-auto h-[10vh] max-h-24">
        {boxes.map((i) => (
          <div
            key={i}
            className={`
              rounded-[1px] w-full h-full min-h-[6px]
              transition-colors duration-200
              ${i < filledCount ? 'bg-mantra-red' : 'bg-gray-300'}
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressGrid;
