import type { ViewKey } from '../../App';
import { FirstBankLogo } from './FirstBankLogo';

interface Props {
  activeView: ViewKey;
  setView: (v: ViewKey) => void;
}

const NAV: { key: ViewKey; label: string }[] = [
  { key: 'cockpit', label: 'Group Dashboard' },
  { key: 'framl', label: 'FRAML Intelligence' },
  { key: 'operational', label: 'FRAML Operations' },
  { key: 'cohort', label: 'Cohort Analyser' },
  { key: 'network', label: 'Network Analytics' },
  { key: 'board', label: 'Board View' },
];

export default function TopBar({ activeView, setView }: Props) {
  return (
    <header style={{ background: 'var(--navy)', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16, height: 56, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
      {/* Logo */}
      <div style={{ background: 'white', borderRadius: 6, padding: '3px 10px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <FirstBankLogo height={44} />
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', gap: 2, flex: 1 }}>
        {NAV.map(n => (
          <button key={n.key} onClick={() => setView(n.key)} style={{
            background: activeView === n.key ? 'rgba(255,255,255,0.15)' : 'transparent',
            border: 'none', color: activeView === n.key ? 'white' : '#93C5FD',
            padding: '6px 11px', borderRadius: 6, fontSize: 11, fontWeight: activeView === n.key ? 700 : 400,
            cursor: 'pointer', transition: 'all .15s', whiteSpace: 'nowrap',
          }}>{n.label}</button>
        ))}
      </nav>

      {/* CBN countdown */}
      <div style={{ background: '#FEF3C7', color: '#92400E', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 6, whiteSpace: 'nowrap', flexShrink: 0 }}>
        CBN Mandate: Sept 2027 · 15 months
      </div>

      {/* Live badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34D399', display: 'inline-block', animation: 'pulse 2s infinite' }}/>
        <span style={{ fontSize: 11, color: '#34D399', fontWeight: 600 }}>LIVE</span>
      </div>
    </header>
  );
}
