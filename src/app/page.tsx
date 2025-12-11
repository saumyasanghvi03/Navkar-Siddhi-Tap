"use client";

import { useState, useEffect, useCallback } from "react";
import { MANTRA, MANTRA_LINES, lineWordCounts, themes, wordColors as defaultWordColors } from "@/lib/mantra";
import { Mala } from "@/components/Mala";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LOCAL_STORAGE_KEY = 'siddhiTapNavkarCount';
const MALA_SIZE_KEY = 'siddhiTapMalaSize';

type MalaSize = 9 | 27 | 108;

const getLineIndex = (wordIndex: number) => {
  if (wordIndex < 0) return -1;
  let cumulativeWords = 0;
  for (let i = 0; i < lineWordCounts.length; i++) {
    cumulativeWords += lineWordCounts[i];
    if (wordIndex < cumulativeWords) {
      return i;
    }
  }
  return MANTRA_LINES.length - 1;
};

export default function Home() {
  const [totalNavkarCount, setTotalNavkarCount] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isClient, setIsClient] = useState(false);
  const [malaSize, setMalaSize] = useState<MalaSize>(108);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    try {
      const savedCount = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedCount) {
        setTotalNavkarCount(Number(savedCount));
      }
      const savedMalaSize = localStorage.getItem(MALA_SIZE_KEY);
      if (savedMalaSize && (savedMalaSize === '9' || savedMalaSize === '27' || savedMalaSize === '108')) {
        setMalaSize(Number(savedMalaSize) as MalaSize);
      }
    } catch (error) {
      console.error("Failed to read from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, String(totalNavkarCount));
        localStorage.setItem(MALA_SIZE_KEY, String(malaSize));
      } catch (error) {
        console.error("Failed to write to localStorage", error);
      }
    }
  }, [totalNavkarCount, malaSize, isClient]);

  const handleTap = useCallback(() => {
    if (!isClient) return;

    let nextWordIndex = currentWordIndex + 1;

    if (nextWordIndex >= MANTRA.length) {
      // Mantra is complete
      const newTotalCount = totalNavkarCount + 1;
      if (newTotalCount > 0 && newTotalCount % malaSize === 0) {
        navigator.vibrate?.(200);
        const malasCompleted = Math.floor(newTotalCount / malaSize);
        toast({
          title: `✨ ${malasCompleted} Mala${malasCompleted > 1 ? 's' : ''} Completed ✨`,
          description: `You have completed ${malasCompleted} mala${malasCompleted > 1 ? 's' : ''} of ${malaSize} beads.`,
        });
      } else {
        navigator.vibrate?.(100);
      }
      setTotalNavkarCount(newTotalCount);
      setCurrentWordIndex(-1); // Reset for the next mantra
    } else {
      // Standard progression
      const navkarsInCurrentMala = totalNavkarCount % malaSize;
      if (navkarsInCurrentMala >= malaSize - 9) {
        navigator.vibrate?.([20, 10, 20, 10, 20]);
      } else {
        navigator.vibrate?.(20);
      }
      setCurrentWordIndex(nextWordIndex);
    }
  }, [currentWordIndex, isClient, totalNavkarCount, toast, malaSize]);

  const handleReset = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setTotalNavkarCount(0);
    setCurrentWordIndex(-1);
  }, []);

  const handleMalaSizeChange = (size: MalaSize, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setMalaSize(size);
  }

  const handleInteractionEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    handleTap();
  }

  const malaCount = isClient ? Math.floor(totalNavkarCount / malaSize) : 0;
  const themeIndex = isClient ? malaCount % themes.length : 0;
  const currentTheme = themes[themeIndex];
  const wordColors = currentTheme.wordColors || defaultWordColors;
  const gridFillColor = currentTheme.gridFill;

  const lineIndex = getLineIndex(currentWordIndex);

  const backgroundStyle = {
    background: lineIndex > -1 ? currentTheme.backgrounds[lineIndex] : currentTheme.backgrounds[0],
    transition: 'background 400ms ease',
  };

  const navkarsInCurrentMala = totalNavkarCount % malaSize;

  const currentWord = MANTRA[currentWordIndex];

  return (
    <div
      className="flex flex-col items-center justify-between min-h-screen w-full cursor-pointer select-none"
      onMouseUp={handleInteractionEnd}
      onTouchEnd={handleInteractionEnd}
      role="button"
      tabIndex={0}
      aria-label="Tap to reveal next word of the mantra"
      style={isClient ? backgroundStyle : {}}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleTap();
        }
      }}
    >
      <header className="w-full flex justify-between items-start p-4 sm:p-6 absolute top-0 left-0 z-10">
        <h1 className="text-xl sm:text-2xl font-bold font-headline leading-none" style={{ color: currentTheme.textColor }}>
          Navkar
          <br />
          Siddhi
          <br />
          Tap
        </h1>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="text-center bg-background/50 backdrop-blur-sm px-3 py-1 rounded-lg">
            <div className="text-xs sm:text-sm font-medium" style={{ color: currentTheme.textColor, opacity: 0.8 }}>
              Navkar
            </div>
            <div className="text-xl sm:text-2xl font-bold tabular-nums" style={{ color: currentTheme.textColor }}>
              {isClient ? totalNavkarCount : 0}
            </div>
          </div>
          <div className="text-center bg-background/50 backdrop-blur-sm px-3 py-1 rounded-lg">
            <div className="text-xs sm:text-sm font-medium" style={{ color: currentTheme.textColor, opacity: 0.8 }}>
              Mala ({malaSize})
            </div>
            <div className="text-xl sm:text-2xl font-bold tabular-nums" style={{ color: currentTheme.textColor }}>
              {isClient ? `${navkarsInCurrentMala}` : '0'}
            </div>
          </div>
          {isClient && (
            <div className="flex items-center gap-1 bg-background/50 backdrop-blur-sm p-1 rounded-lg">
              <Button variant={malaSize === 9 ? "secondary" : "ghost"} size="sm" onClick={(e) => handleMalaSizeChange(9, e)} className="text-xs h-auto px-2 py-1">9</Button>
              <Button variant={malaSize === 27 ? "secondary" : "ghost"} size="sm" onClick={(e) => handleMalaSizeChange(27, e)} className="text-xs h-auto px-2 py-1">27</Button>
              <Button variant={malaSize === 108 ? "secondary" : "ghost"} size="sm" onClick={(e) => handleMalaSizeChange(108, e)} className="text-xs h-auto px-2 py-1">108</Button>
            </div>
          )}
          {isClient && (
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-background/20"
              style={{ color: currentTheme.textColor, opacity: 0.7 }}
              onClick={handleReset}
              aria-label="Reset count"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          )}
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center w-full px-4 pt-24 pb-8">
        <div className="text-center text-4xl sm:text-5xl md:text-6xl font-bold font-headline flex flex-col justify-center items-center min-h-[72px] sm:min-h-[84px] z-10">
          {isClient && currentWordIndex === -1 && (
            <span className="animate-in fade-in duration-700" style={{ color: currentTheme.textColor }}>
              Tap to begin
            </span>
          )}

          <div className="flex flex-wrap justify-center items-center gap-x-3 sm:gap-x-4">
            {isClient && currentWord && (
              <span
                key={`${lineIndex}-${currentWordIndex}`}
                className={cn(
                  'leading-tight py-1',
                  'animate-in fade-in zoom-in-95 duration-500'
                )}
                style={{ color: wordColors[currentWord as keyof typeof wordColors] || currentTheme.textColor }}
              >
                {currentWord}
              </span>
            )}
          </div>
        </div>
      </main>

      <footer className="fixed inset-0 w-full h-full flex items-center justify-center -z-10">
        <Mala count={isClient ? totalNavkarCount : 0} beadColor={gridFillColor} totalBeads={malaSize} />
      </footer>
    </div>
  );
}
