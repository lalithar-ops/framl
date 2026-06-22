import { SYSTEMS_HEALTH } from '../../data/mockData';

export default function SystemHealth() {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', marginBottom: 16, boxShadow: 'var(--card-shadow)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', marginBottom: 10 }}>PLATFORM HEALTH · LIVE</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {SYSTEMS_HEALTH.map(s => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 20, padding: '5px 12px', fontSize: 11 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--good)', display: 'inline-block' }}/>
            <strong>{s.name}</strong> · {s.full} <span style={{ color: '#6B7280', marginLeft: 4 }}>{s.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
