import React from 'react';
import { useNavkar } from './hooks/useNavkar';
import Background from './components/Background';
import MantraWord from './components/MantraWord';
import ProgressGrid from './components/ProgressGrid';
import MalaRing from './components/MalaRing';
import Dashboard from './components/Dashboard';
import Controls from './components/Controls';
import CounterHeader from './components/CounterHeader';

function App() {
  const {
    totalNavkars,
    malaCount,
    currentIndex,
    currentWord,
    isClearing,
    currentLineIndex,
    currentTheme,

    mode,
    autoScroll,
    scrollSpeed,
    history,
    showDashboard,
    setShowDashboard,

    handleTap,
    toggleMode,
    toggleAutoScroll,
    cycleSpeed
  } = useNavkar();

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden">
      {/* Dynamic Background Layer */}
      <Background
        currentTheme={currentTheme}
        currentLineIndex={currentLineIndex}
      />

      {/* Header Stats */}
      {/* We can update CounterHeader to show Total Navkar + Mala Count if we want,
          or keep it simple. Let's keep existing, but maybe add Mala info. */}
      <div className="fixed top-0 right-0 p-4 z-20 pointer-events-none">
        <div className="flex flex-col items-end gap-1">
           <div className="text-gray-600 font-serif text-sm bg-white/80 px-3 py-1 rounded-full border border-gray-200 shadow-sm backdrop-blur-sm">
            Navkar: <span className="font-bold text-gray-900">{totalNavkars}</span>
          </div>
          {malaCount > 0 && (
             <div className="text-gray-600 font-serif text-xs bg-white/60 px-3 py-1 rounded-full border border-gray-200 shadow-sm backdrop-blur-sm">
              Mala: <span className="font-bold text-gray-900">{malaCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls (Top Left) */}
      <Controls
        mode={mode} toggleMode={toggleMode}
        autoScroll={autoScroll} toggleAutoScroll={toggleAutoScroll}
        scrollSpeed={scrollSpeed} cycleSpeed={cycleSpeed}
        onOpenDashboard={() => setShowDashboard(true)}
      />

      {/* Main Interaction Layer */}
      <div
        onClick={handleTap}
        className="absolute inset-0 flex items-center justify-center cursor-pointer z-10 touch-manipulation"
        style={{ paddingBottom: mode === 'GRID' ? '15vh' : '0' }}
      >
        {/* If Ring Mode, render Ring in center */}
        {mode === 'RING' && (
          <MalaRing totalNavkars={totalNavkars} currentTheme={currentTheme} />
        )}

        {/* The Word */}
        <div className="relative z-20">
           {currentIndex >= 0 && !isClearing && (
             <MantraWord word={currentWord} lineIndex={currentLineIndex} />
           )}
        </div>
      </div>

      {/* Grid Mode Footer */}
      {mode === 'GRID' && (
        <ProgressGrid totalNavkars={totalNavkars} currentTheme={currentTheme} />
      )}

      {/* Dashboard Overlay */}
      {showDashboard && (
        <Dashboard
          history={history}
          totalNavkars={totalNavkars}
          onClose={() => setShowDashboard(false)}
        />
      )}
    </div>
  );
}

export default App;
