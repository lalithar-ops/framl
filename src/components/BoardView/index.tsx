import { BOARD_DATA } from '../../data/mockData';

export default function BoardView() {
  const { fraudPreventedYTD, fraudLossYTD, preventionRate, cbnComplianceScore, cbnComplianceTarget, platformUptime, avgDecisionSpeed, quarterlyTrend } = BOARD_DATA;

  return (
    <div style={{ padding: 20, flex: 1, overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--navy)' }}>Board Report — FRAML Programme</h2>
          <p style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>First Bank of Nigeria · June 2026 · Confidential</p>
        </div>
        <button onClick={() => window.print()} style={{ background: 'var(--navy)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Print / Export PDF</button>
      </div>

      {/* Headline KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Fraud Prevented YTD', value: fraudPreventedYTD, color: 'var(--good)' },
          { label: 'Fraud Loss YTD', value: fraudLossYTD, color: 'var(--bad)' },
          { label: 'Prevention Rate', value: preventionRate, color: 'var(--teal)' },
        ].map(k => (
          <div key={k.label} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: 'var(--card-shadow)', textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* CBN Compliance */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: 'var(--card-shadow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>CBN Compliance Score</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--amber)' }}>{cbnComplianceScore}</span>
            <span style={{ fontSize: 14, color: '#6B7280' }}>/ 100</span>
            <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>Target: {cbnComplianceTarget}+</span>
          </div>
        </div>
        <div style={{ background: '#E5E7EB', borderRadius: 4, height: 10 }}>
          <div style={{ background: 'var(--amber)', width: `${cbnComplianceScore}%`, height: 10, borderRadius: 4 }} />
        </div>
        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 6 }}>CBN AI/ML mandate active since March 2026 · Deadline September 2027 · 15 months remaining</div>
      </div>

      {/* Quarterly trend */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: 'var(--card-shadow)' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 14 }}>Quarterly Performance Trend</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
              {['Quarter', 'Fraud Prevented', 'Fraud Loss', 'FP Rate', 'MTTD'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px', color: '#6B7280', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quarterlyTrend.map((q, i) => (
              <tr key={q.quarter} style={{ background: i % 2 ? '#F9FAFB' : '#fff', borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: 8, fontWeight: 600 }}>{q.quarter}</td>
                <td style={{ padding: 8, color: 'var(--good)', fontWeight: 700 }}>{q.prevented}</td>
                <td style={{ padding: 8, color: 'var(--bad)', fontWeight: 600 }}>{q.loss}</td>
                <td style={{ padding: 8, color: 'var(--amber)' }}>{q.fpRate}</td>
                <td style={{ padding: 8, color: 'var(--teal)' }}>{q.mttd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Platform + Regulatory */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: 'var(--card-shadow)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 12 }}>Platform Performance</div>
          {[
            { label: 'System Uptime', value: platformUptime, color: 'var(--good)' },
            { label: 'Avg Decision Speed', value: avgDecisionSpeed, color: 'var(--teal)' },
            { label: 'Digital Channel Risk', value: '62% of exposure', color: 'var(--amber)' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6', fontSize: 12 }}>
              <span style={{ color: '#6B7280' }}>{s.label}</span>
              <span style={{ fontWeight: 700, color: s.color }}>{s.value}</span>
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--navy)', borderRadius: 12, padding: 20, boxShadow: 'var(--card-shadow)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Regulatory Timeline</div>
          {[
            { date: 'Oct 2025', event: 'FATF Grey List Removal', status: '✓ COMPLETE', color: '#34D399' },
            { date: 'Mar 2026', event: 'CBN AI/ML Mandate Active', status: '✓ ACTIVE', color: '#34D399' },
            { date: 'Sept 2027', event: 'CBN Compliance Deadline', status: '⏳ 15 months', color: '#FCD34D' },
          ].map(r => (
            <div key={r.date} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: 11 }}>
              <div>
                <div style={{ color: '#93C5FD', fontWeight: 600 }}>{r.date}</div>
                <div style={{ color: '#E2E8F0' }}>{r.event}</div>
              </div>
              <span style={{ color: r.color, fontWeight: 700, alignSelf: 'center' }}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
