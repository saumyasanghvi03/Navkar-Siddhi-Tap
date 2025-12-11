import React, { useState, useEffect } from 'react';
import WritingArea from './components/WritingArea';
import ProgressGrid from './components/ProgressGrid';
import CounterHeader from './components/CounterHeader';

function App() {
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const savedCount = localStorage.getItem('totalCount');
    if (savedCount) {
      setTotalCount(Number(savedCount));
    }
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-parchment">
      <CounterHeader totalCount={totalCount} />
      <WritingArea totalCount={totalCount} setTotalCount={setTotalCount} />
      <ProgressGrid totalCount={totalCount} />
    </div>
  );
}

export default App;
