import { useState } from 'react';
import './styles/variables.css';
import TopBar from './components/Shell/TopBar';
import GroupDashboard from './components/GroupDashboard';
import FRAMLIntelligence from './components/FRAMLIntelligence';
import FRAMLOperations from './components/FRAMLOperations';
import CohortAnalyser from './components/CohortAnalyser';
import NetworkAnalytics from './components/NetworkAnalytics';
import BoardView from './components/BoardView';

export type ViewKey = 'cockpit' | 'framl' | 'operational' | 'cohort' | 'network' | 'board';

export default function App() {
  const [view, setView] = useState<ViewKey>('cockpit');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)', minWidth: 1280 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', Arial, sans-serif; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        button:hover { opacity: .9; }
        * { box-sizing: border-box; }
      `}</style>
      <TopBar activeView={view} setView={setView} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {view === 'cockpit' && <GroupDashboard setView={(v) => setView(v as ViewKey)} />}
        {view === 'framl' && <FRAMLIntelligence />}
        {view === 'operational' && <FRAMLOperations setView={(v) => setView(v as ViewKey)} />}
        {view === 'cohort' && <CohortAnalyser />}
        {view === 'network' && <NetworkAnalytics setView={(v) => setView(v as ViewKey)} />}
        {view === 'board' && <BoardView />}
      </div>
    </div>
  );
}
