import { useState } from 'react';

export function useSidebarState() {
  const stored = localStorage.getItem('fbn_sidebar_collapsed') === '1';
  const [collapsed, setCollapsed] = useState(stored);
  const toggle = () => {
    setCollapsed(c => {
      localStorage.setItem('fbn_sidebar_collapsed', !c ? '1' : '0');
      return !c;
    });
  };
  return { collapsed, toggle };
}
