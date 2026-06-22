import { RISK_EXPOSURE_BARS, RISK_SUMMARY_TILES } from '../../data/mockData';

const COLOR_MAP: Record<string, string> = {
  teal: 'var(--teal)', navy: 'var(--navy)', amber: 'var(--amber)',
  good: 'var(--good)', muted: '#6B7280', bad: 'var(--bad)',
};

function fmtValue(v: number) {
  if (v >= 1_000_000_000) return `₦${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `₦${(v / 1_000_000).toFixed(0)}M`;
  return `₦${v.toLocaleString()}`;
}

function ScoreViolin() {
  return (
    <svg viewBox="0 0 300 110" style={{ width: '100%', height: 110 }}>
      <defs>
        <linearGradient id="distGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#EA580C" stopOpacity="0.6" />
          <stop offset="76%" stopColor="#EA580C" stopOpacity="0.6" />
          <stop offset="76%" stopColor="#EF4444" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <path d="M30,95 C50,95 55,20 80,18 C100,16 110,25 130,45 C145,58 148,30 165,28 C180,26 185,40 200,55 C220,72 240,80 280,90 L280,95 Z"
        fill="url(#distGrad)" />
      <path d="M30,95 C50,95 55,20 80,18 C100,16 110,25 130,45 C145,58 148,30 165,28 C180,26 185,40 200,55 C220,72 240,80 280,90"
        fill="none" stroke="#6B7280" strokeWidth="1.5" />

      <line x1={150} y1={10} x2={150} y2={92} stroke="#94A3B8" strokeWidth="1" strokeDasharray="3,2" />
      <line x1={240} y1={10} x2={240} y2={92} stroke="#94A3B8" strokeWidth="1" strokeDasharray="3,2" />

      {([['0.75',30],['0.85',150],['0.95',240],['1.00',280]] as [string,number][]).map(([l,x]) => (
        <text key={l} x={x} y={105} textAnchor="middle" fontSize="8" fill="#94A3B8">{l}</text>
      ))}

      <text x="80" y="10" textAnchor="middle" fontSize="9" fill="#F59E0B" fontWeight="700">1,204 Elevated</text>
      <text x="165" y="20" textAnchor="middle" fontSize="9" fill="#EA580C" fontWeight="700">387 High</text>
      <text x="265" y="20" textAnchor="middle" fontSize="9" fill="#EF4444" fontWeight="700">143 Critical</text>
    </svg>
  );
}

export default function RiskExposure() {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: 'var(--card-shadow)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', marginBottom: 14 }}>RISK EXPOSURE ANALYSIS</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Exposure by Channel</div>
          {RISK_EXPOSURE_BARS.map(c => (
            <div key={c.channel} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                <span>{c.channel}</span>
                <span style={{ fontWeight: 600 }}>{fmtValue(c.value)} · {c.pct}%</span>
              </div>
              <div style={{ background: '#E5E7EB', borderRadius: 4, height: 7 }}>
                <div style={{ background: COLOR_MAP[c.color] || '#6B7280', width: `${c.pct}%`, height: 7, borderRadius: 4 }}/>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Risk Summary</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {RISK_SUMMARY_TILES.map(t => (
              <div key={t.label} style={{ background: '#F9FAFB', borderRadius: 8, padding: 10 }}>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>{t.label}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--navy)', marginTop: 4 }}>{t.value}</div>
                <div style={{ fontSize: 10, color: '#6B7280' }}>{t.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 12, fontSize: 10, color: '#9CA3AF', borderTop: '1px solid #F3F4F6', paddingTop: 8 }}>
        Risk exposure calculated from active alert values + RTSE ML-flagged transactions. Source: Clari5 FRAML Engine · CBN Industry Data 2024.
      </div>
      <ScoreViolin />
    </div>
  );
}
