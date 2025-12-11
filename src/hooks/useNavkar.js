import { useState, useEffect, useMemo, useCallback } from 'react';
import { MANTRA_WORDS, LINE_BREAKS, THEMES, AUTO_SCROLL_SPEEDS } from '../utils/constants';

const HISTORY_KEY = 'navkar_history';
const TOTAL_KEY = 'totalCount'; // Keeping legacy key for backward compatibility or migration
const PREF_KEY = 'navkar_prefs';

export const useNavkar = () => {
  // --- State ---
  const [totalNavkars, setTotalNavkars] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isClearing, setIsClearing] = useState(false);

  // Settings
  const [mode, setMode] = useState('GRID'); // 'GRID' | 'RING'
  const [autoScroll, setAutoScroll] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState('MEDIUM'); // 'SLOW', 'MEDIUM', 'FAST'
  const [showDashboard, setShowDashboard] = useState(false);

  // History [{ date: 'YYYY-MM-DD', navkars: 0, malas: 0 }]
  const [history, setHistory] = useState([]);

  // --- Initialization ---
  useEffect(() => {
    // Load persisted data
    const savedTotal = localStorage.getItem(TOTAL_KEY);
    if (savedTotal) setTotalNavkars(Number(savedTotal));

    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedPrefs = localStorage.getItem(PREF_KEY);
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setMode(prefs.mode || 'GRID');
      setScrollSpeed(prefs.scrollSpeed || 'MEDIUM');
    }
  }, []);

  // --- Persistence Wrappers ---
  const persistTotal = (newTotal) => {
    localStorage.setItem(TOTAL_KEY, newTotal.toString());
    setTotalNavkars(newTotal);
  };

  const persistHistory = (newTotal) => {
    // Update today's entry
    const today = new Date().toISOString().split('T')[0];
    const newHistory = [...history];
    const todayIndex = newHistory.findIndex(h => h.date === today);

    if (todayIndex >= 0) {
      newHistory[todayIndex].navkars += 1;
      // Recalculate malas for today?
      // Actually we just track navkars, Malas is derived.
      // But maybe we want to track Malas specifically?
      // The prompt said "Navkars today, Malas today".
      // Let's just store navkars, and we can derive Malas = floor(navkars/108) for display,
      // or simplistic:
      if ((newHistory[todayIndex].navkars % 108) === 0) {
        newHistory[todayIndex].malas = (newHistory[todayIndex].malas || 0) + 1;
      }
    } else {
      newHistory.push({ date: today, navkars: 1, malas: 0 });
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  const savePrefs = (newMode, newSpeed) => {
    const prefs = { mode: newMode, scrollSpeed: newSpeed };
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
  };

  // --- Computed Properties ---
  const malaCount = Math.floor(totalNavkars / 108);

  // Theme Logic: Cycle every 108.
  // Mala 0 -> Default (Line Based BG).
  // Mala 1 -> Theme 0 (Arihant)
  // Mala 2 -> Theme 1 (Siddha)
  // ...
  const themeIndex = malaCount > 0 ? (malaCount - 1) % THEMES.length : -1;
  const currentTheme = themeIndex >= 0 ? THEMES[themeIndex] : null;

  // Line Logic
  const currentLineIndex = useMemo(() => {
    if (currentIndex < 0) return 0; // Default to first line if reset
    let wordCount = 0;
    for (let i = 0; i < LINE_BREAKS.length; i++) {
      wordCount += LINE_BREAKS[i];
      if (currentIndex < wordCount) return i;
    }
    return LINE_BREAKS.length - 1;
  }, [currentIndex]);

  // --- Actions ---
  const handleTap = useCallback(() => {
    if (isClearing) return;

    // Vibration logic
    if (!autoScroll && navigator.vibrate) {
       navigator.vibrate(20);
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex < MANTRA_WORDS.length) {
      setCurrentIndex(nextIndex);

      // Completion check
      if (nextIndex === MANTRA_WORDS.length - 1) {
        completeMantra();
      }
    }
  }, [currentIndex, isClearing, autoScroll, totalNavkars]); // Added totalNavkars dependency indirectly via completeMantra call if I inlined it, but better separate.

  const completeMantra = () => {
    if (!autoScroll && navigator.vibrate) navigator.vibrate(100);

    const newTotal = totalNavkars + 1;
    persistTotal(newTotal);
    persistHistory(newTotal);

    setIsClearing(true);
    setTimeout(() => {
      setCurrentIndex(-1);
      setIsClearing(false);
    }, 1000);
  };

  // --- Auto Scroll Effect ---
  useEffect(() => {
    let interval;
    if (autoScroll && !isClearing) {
      interval = setInterval(() => {
        handleTap();
      }, AUTO_SCROLL_SPEEDS[scrollSpeed]);
    }
    return () => clearInterval(interval);
  }, [autoScroll, isClearing, scrollSpeed, handleTap]);

  // --- Preference Setters ---
  const toggleMode = () => {
    const newMode = mode === 'GRID' ? 'RING' : 'GRID';
    setMode(newMode);
    savePrefs(newMode, scrollSpeed);
  };

  const toggleAutoScroll = () => setAutoScroll(!autoScroll);

  const cycleSpeed = () => {
    const speeds = ['SLOW', 'MEDIUM', 'FAST'];
    const nextIdx = (speeds.indexOf(scrollSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setScrollSpeed(newSpeed);
    savePrefs(mode, newSpeed);
  };

  return {
    totalNavkars,
    malaCount,
    currentIndex,
    currentWord: currentIndex >= 0 ? MANTRA_WORDS[currentIndex] : null,
    isClearing,
    currentLineIndex,
    currentTheme,

    // Settings & History
    mode,
    autoScroll,
    scrollSpeed,
    history,
    showDashboard,
    setShowDashboard,

    // Actions
    handleTap,
    toggleMode,
    toggleAutoScroll,
    cycleSpeed
  };
};
