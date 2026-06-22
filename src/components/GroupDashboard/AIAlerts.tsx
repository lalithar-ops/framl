import { AI_ALERT_TILES } from '../../data/mockData';

const scoreColor = (c: string) =>
  c === 'bad' ? 'var(--bad)' : c === 'amber' ? 'var(--amber)' : 'var(--teal)';
const scoreBg = (c: string) =>
  c === 'bad' ? '#FEF2F2' : c === 'amber' ? '#FFFBEB' : '#F0FDFA';

export default function AIAlerts({ setView }: { setView: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 14 }}>&#9889;</span>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#374151' }}>AI Detection Alerts</div>
        <span style={{ fontSize: 10, color: '#6B7280' }}>ML alerts — no rule triggered on any of these</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {AI_ALERT_TILES.map(a => (
          <div key={a.id} onClick={() => setView('operational')} style={{
            cursor: 'pointer', background: '#fff', borderRadius: 10, borderTop: `4px solid ${scoreColor(a.scoreColor)}`,
            boxShadow: 'var(--card-shadow)', padding: 12, minHeight: 170, display: 'flex', flexDirection: 'column',
            transition: 'transform .15s, box-shadow .15s',
          }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--card-shadow)'; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>{a.id}</div>
              <div style={{ background: scoreBg(a.scoreColor), color: scoreColor(a.scoreColor), fontSize: 13, fontWeight: 800, padding: '2px 7px', borderRadius: 6, flexShrink: 0 }}>{a.score.toFixed(2)}</div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', lineHeight: 1.3, marginBottom: 4 }}>{a.entity}</div>
            <div style={{ fontSize: 10, color: '#6B7280', lineHeight: 1.5, flex: 1 }}>{a.description}</div>
            <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>{a.subsidiary} · {a.age}</div>
            <div style={{ marginTop: 8 }}>
              <div style={{ background: scoreBg(a.scoreColor), borderRadius: 3, height: 4, marginBottom: 6 }}>
                <div style={{ background: scoreColor(a.scoreColor), width: `${a.score * 100}%`, height: 4, borderRadius: 3 }}/>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--teal)', textAlign: 'right' }}>INVESTIGATE →</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
