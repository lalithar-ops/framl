import { useState, useEffect } from 'react';

export function useLiveTicker(initial: number) {
  const [count, setCount] = useState(initial);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + Math.floor(Math.random() * 40 + 20));
    }, 3000);
    return () => clearInterval(id);
  }, []);
  return count;
}
