import { useState } from 'react';
import { ALERT_QUEUE, ANALYST_ROWS, INVESTIGATOR_STATS } from '../../data/mockData';

const TABS = ['alert-queue', 'my-cases', 'reports', 'actions', 'productivity'] as const;
type Tab = typeof TABS[number];

const TAB_LABELS: Record<Tab, string> = {
  'alert-queue': 'Alert Queue',
  'my-cases': 'My Cases',
  'reports': 'Reports',
  'actions': 'Actions',
  'productivity': 'Investigator Productivity',
};

const okColor = (s: string) =>
  s === 'green' ? 'var(--good)' : s === 'amber' ? 'var(--amber)' : 'var(--bad)';

const severityColor = (s: string) =>
  s === 'CRITICAL' ? 'var(--bad)' : s === 'HIGH' ? 'var(--orange)' : s === 'MEDIUM' ? 'var(--amber)' : 'var(--good)';

const statusBg = (s: string) => {
  if (s === 'IN REVIEW') return { bg: '#F0FDFA', color: 'var(--teal)' };
  if (s === 'PENDING') return { bg: '#FFFBEB', color: 'var(--amber)' };
  if (s === 'ESCALATED') return { bg: '#FFF7ED', color: 'var(--orange)' };
  if (s === 'SLA BREACH') return { bg: '#FEF2F2', color: 'var(--bad)' };
  return { bg: '#F3F4F6', color: '#6B7280' };
};

function PolarAreaChart() {
  const data = [
    { name: 'ATO', count: 31, color: '#00A99D', amount: '₦2.1B' },
    { name: 'Mule', count: 22, color: '#1A3A6B', amount: '₦430M' },
    { name: 'SIM Swap', count: 17, color: '#E8541A', amount: '₦310M' },
    { name: 'BEC', count: 8, color: '#DC2626', amount: '₦890M' },
    { name: 'Structuring', count: 11, color: '#D97706', amount: '₦180M' },
  ];
  const total = data.reduce((s,d) => s+d.count, 0);
  const maxCount = 31;
  const CX = 80, CY = 80, MAX_R = 65;
  const refs = [0.25, 0.5, 0.75, 1.0];

  return (
    <div>
      <svg viewBox="0 0 280 160" style={{ width: '100%', height: 160 }}>
        {refs.map(r => (
          <circle key={r} cx={CX} cy={CY} r={MAX_R * r} fill="none" stroke="#E2E8F0" strokeWidth="0.5" />
        ))}

        {data.map((d, i) => {
          const startAngle = (i / data.length) * 2 * Math.PI - Math.PI / 2;
          const endAngle = ((i + 1) / data.length) * 2 * Math.PI - Math.PI / 2;
          const r = (d.count / maxCount) * MAX_R;
          const x1 = CX + r * Math.cos(startAngle);
          const y1 = CY + r * Math.sin(startAngle);
          const x2 = CX + r * Math.cos(endAngle);
          const y2 = CY + r * Math.sin(endAngle);
          const midAngle = (startAngle + endAngle) / 2;
          const labelR = r + 12;
          const lx = CX + labelR * Math.cos(midAngle);
          const ly = CY + labelR * Math.sin(midAngle);
          return (
            <g key={d.name}>
              <path
                d={`M${CX},${CY} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2}Z`}
                fill={d.color} opacity={0.7} stroke="white" strokeWidth="1.5"
              />
              <text x={lx} y={ly-3} textAnchor="middle" fontSize="8" fill="#374151">{d.name}</text>
              <text x={lx} y={ly+7} textAnchor="middle" fontSize="9" fontWeight="700" fill={d.color}>{d.count}</text>
            </g>
          );
        })}

        <circle cx={CX} cy={CY} r={14} fill="white" stroke="#E5E7EB" strokeWidth="1" />
        <text x={CX} y={CY+4} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--navy)">{total}</text>

        {data.map((d, i) => (
          <g key={d.name} transform={`translate(175, ${18 + i * 26})`}>
            <rect width={10} height={10} rx={2} fill={d.color} opacity={0.8} />
            <text x={14} y={9} fontSize="10" fill="#374151" fontWeight="600">{d.name}</text>
            <text x={14} y={20} fontSize="9" fill="#6B7280">{d.amount}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function FraudOperations() {
  const [tab, setTab] = useState<Tab>('alert-queue');

  return (
    <div style={{ padding: 20, flex: 1, overflow: 'auto' }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>Fraud Operations</h2>
        <p style={{ fontSize: 12, color: '#6B7280' }}>Real-time alert management and case workflow</p>
      </div>

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid #E5E7EB', marginBottom: 20 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 16px', border: 'none', background: 'transparent', cursor: 'pointer',
            fontSize: 12, fontWeight: tab === t ? 700 : 400,
            color: tab === t ? 'var(--navy)' : '#6B7280',
            borderBottom: tab === t ? '2px solid var(--navy)' : '2px solid transparent',
            marginBottom: -2, transition: 'all .15s',
          }}>{TAB_LABELS[t]}</button>
        ))}
      </div>

      {tab === 'alert-queue' && (
        <div>
          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ background: '#FEF2F2', border: '2px solid var(--bad)', borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--bad)', letterSpacing: '.06em' }}>OPEN CRITICAL ALERTS</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--bad)', margin: '8px 0' }}>14</div>
              <div style={{ fontSize: 12, color: '#991B1B', fontWeight: 600 }}>3 breaching SLA</div>
            </div>
            <div style={{ background: '#FFFBEB', border: '2px solid var(--amber)', borderRadius: 12, padding: 18, cursor: 'pointer' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--amber)', letterSpacing: '.06em' }}>ESCALATION QUEUE</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--amber)', margin: '8px 0' }}>47 <span style={{ fontSize: 16 }}>cases</span></div>
              <div style={{ fontSize: 12, color: '#92400E', fontWeight: 600 }}>12 breaching SLA — tap to manage</div>
            </div>
          </div>

          {/* Alert Queue Table */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 0, boxShadow: 'var(--card-shadow)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #F3F4F6', fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em' }}>
              ACTIVE ALERT QUEUE · {ALERT_QUEUE.length} alerts
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5E7EB', background: '#F9FAFB' }}>
                    {['Alert ID', 'Severity', 'Type', 'Entity', 'Amount', 'Channel', 'Assignee', 'Age', 'Status'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: '#6B7280', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ALERT_QUEUE.map((a, i) => {
                    const st = statusBg(a.status);
                    return (
                      <tr key={a.id} style={{ background: i % 2 ? '#FAFAFA' : '#fff', borderBottom: '1px solid #F3F4F6' }}
                        onMouseOver={e => { e.currentTarget.style.background = '#F0F9FF'; }}
                        onMouseOut={e => { e.currentTarget.style.background = i % 2 ? '#FAFAFA' : '#fff'; }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--navy)', whiteSpace: 'nowrap' }}>{a.id}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ background: severityColor(a.severity) + '18', color: severityColor(a.severity), borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap' }}>{a.severity}</span>
                        </td>
                        <td style={{ padding: '10px 12px', color: '#374151' }}>{a.type}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 600, maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.entity}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--bad)', whiteSpace: 'nowrap' }}>{a.amount}</td>
                        <td style={{ padding: '10px 12px', color: '#6B7280', whiteSpace: 'nowrap' }}>{a.channel}</td>
                        <td style={{ padding: '10px 12px', color: '#374151', whiteSpace: 'nowrap' }}>{a.assignee}</td>
                        <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                          <span>{a.age}</span>
                          {a.slaBreached && (
                            <span style={{ marginLeft: 6, background: '#FEF2F2', color: 'var(--bad)', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3 }}>SLA!</span>
                          )}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ background: st.bg, color: st.color, borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap' }}>{a.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'productivity' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'CASES CLOSED TODAY', value: String(INVESTIGATOR_STATS.casesClosedToday), sub: INVESTIGATOR_STATS.casesClosedDelta, color: 'var(--teal)' },
              { label: 'AVG RESOLUTION TIME', value: INVESTIGATOR_STATS.avgResolutionTime, sub: `Target: ${INVESTIGATOR_STATS.avgResolutionTarget} ✓`, color: 'var(--good)' },
              { label: 'STRs FILED MTD', value: String(INVESTIGATOR_STATS.strsMTD), sub: `${INVESTIGATOR_STATS.strsViaGenie} via Genie AI`, color: 'var(--navy)' },
              { label: 'SLA COMPLIANCE', value: INVESTIGATOR_STATS.slaCompliance, sub: INVESTIGATOR_STATS.slaComplianceDelta, color: 'var(--good)' },
            ].map(s => (
              <div key={s.label} style={{ background: '#fff', borderRadius: 10, padding: 14, boxShadow: 'var(--card-shadow)', borderTop: `3px solid ${s.color}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#6B7280' }}>{s.label}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--navy)', margin: '6px 0' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: s.color }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginBottom: 20, boxShadow: 'var(--card-shadow)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginBottom: 12, letterSpacing: '.05em' }}>ANALYST PERFORMANCE</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                  {['Analyst', 'Cases Open', 'Closed Today', 'Avg Handle Time', 'SLA %', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: h === 'Analyst' ? 'left' : 'center', padding: '8px', color: '#6B7280', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ANALYST_ROWS.map((a, i) => (
                  <tr key={a.name} style={{ background: i % 2 ? '#F9FAFB' : '#fff', borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: 8, fontWeight: 600 }}>{a.name}</td>
                    <td style={{ padding: 8, textAlign: 'center' }}>{a.open}</td>
                    <td style={{ padding: 8, textAlign: 'center' }}>{a.closedToday}</td>
                    <td style={{ padding: 8, textAlign: 'center' }}>{a.avgHandleTime}</td>
                    <td style={{ padding: 8, textAlign: 'center', color: okColor(a.ok), fontWeight: 700 }}>{a.sla}%</td>
                    <td style={{ padding: 8, textAlign: 'center' }}>
                      <span style={{ color: okColor(a.ok), fontSize: 16 }}>●</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: 'var(--card-shadow)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginBottom: 12, letterSpacing: '.05em' }}>TOP ACTIVE TYPOLOGIES — THIS WEEK</div>
            <PolarAreaChart />
          </div>
        </div>
      )}

      {(tab === 'my-cases' || tab === 'reports' || tab === 'actions') && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 40, textAlign: 'center', color: '#6B7280', boxShadow: 'var(--card-shadow)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🗂</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--navy)' }}>{TAB_LABELS[tab]}</div>
          <div style={{ fontSize: 12, marginTop: 6 }}>Connect to live case management system</div>
        </div>
      )}
    </div>
  );
}
