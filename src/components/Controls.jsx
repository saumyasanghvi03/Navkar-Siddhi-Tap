import React from 'react';

const Controls = ({
  mode, toggleMode,
  autoScroll, toggleAutoScroll,
  scrollSpeed, cycleSpeed,
  onOpenDashboard
}) => {
  return (
    <div className="fixed top-4 left-4 z-20 flex flex-col gap-3">
      {/* Mode Toggle */}
      <button
        onClick={toggleMode}
        className="w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center text-gray-700 hover:bg-white transition-all"
        title={mode === 'GRID' ? 'Switch to Ring Mode' : 'Switch to Grid Mode'}
      >
        {mode === 'GRID' ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <circle cx="12" cy="12" r="10" strokeWidth="2" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Auto Scroll Toggle */}
      <div className="flex flex-col gap-1 items-center">
        <button
          onClick={toggleAutoScroll}
          className={`w-10 h-10 rounded-full backdrop-blur shadow-md flex items-center justify-center transition-all ${
            autoScroll ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-white/80 text-gray-700'
          }`}
          title="Toggle Auto-Scroll"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {autoScroll ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            )}
          </svg>
        </button>

        {autoScroll && (
          <button
            onClick={cycleSpeed}
            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 shadow text-gray-600"
          >
            {scrollSpeed}
          </button>
        )}
      </div>

      {/* Stats Dashboard */}
      <button
        onClick={onOpenDashboard}
        className="w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center text-gray-700 hover:bg-white transition-all"
        title="View Statistics"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>
    </div>
  );
};

export default Controls;
