import { useSidebarState } from '../../hooks/useSidebarState';

const ITEMS = [
  { key: 'scorecard', label: 'Scorecard', icon: '📊' },
  { key: 'signals', label: 'Signals', icon: '📡' },
  { key: 'digital', label: 'Digital', icon: '💻' },
  { key: 'framl', label: 'FRAML Intel', icon: '🔍' },
  { key: 'aml', label: 'AML', icon: '🛡' },
  { key: 'investigations', label: 'Investigations', icon: '🔎' },
];

interface Props {
  active: string;
  setActive: (k: string) => void;
}

export default function Sidebar({ active, setActive }: Props) {
  const { collapsed, toggle } = useSidebarState();

  return (
    <aside style={{
      width: collapsed ? 44 : 200, minWidth: collapsed ? 44 : 200,
      background: 'var(--navy)', transition: 'width .25s ease, min-width .25s ease',
      overflow: 'hidden', position: 'relative', flexShrink: 0,
    }}>
      <button onClick={toggle} style={{
        position: 'absolute', top: 12, right: collapsed ? 8 : -14,
        width: 28, height: 28, borderRadius: '50%', background: 'var(--navy)',
        border: '2px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 12,
        cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)', transition: 'right .25s ease',
      }}>{collapsed ? '›' : '‹'}</button>

      <div style={{ padding: '16px 8px', marginTop: 8 }}>
        {ITEMS.map(item => (
          <button key={item.key} onClick={() => setActive(item.key)} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 8px',
            background: active === item.key ? 'rgba(255,255,255,0.15)' : 'transparent',
            border: 'none', color: active === item.key ? 'white' : '#93C5FD',
            borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: active === item.key ? 700 : 400,
            whiteSpace: 'nowrap', transition: 'background .15s',
          }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
            {!collapsed && <span style={{ opacity: collapsed ? 0 : 1, transition: 'opacity .2s' }}>{item.label}</span>}
          </button>
        ))}
      </div>
    </aside>
  );
}
