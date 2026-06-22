import { useState } from 'react';
import Sidebar from './Sidebar';
import KPIGrid from './KPIGrid';
import LiveTicker from './LiveTicker';
import SystemHealth from './SystemHealth';
import SubsidiaryAndNetwork from './SubsidiaryAndNetwork';
import RiskExposure from './RiskExposure';
import AIAlerts from './AIAlerts';
import ChannelHexbin from './ChannelHexbin';

function AiDetectionBubbles() {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', boxShadow: 'var(--card-shadow)', height: 280, overflow: 'hidden' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', marginBottom: 8 }}>AI BASED FRAUD DETECTION · TRANSACTION RISK DISTRIBUTION</div>
      <svg viewBox="0 0 260 200" style={{ width: '100%', height: 200 }}>
        <defs>
          <style>{`
            @keyframes glow { 0%,100%{filter:drop-shadow(0 0 4px #EF4444)} 50%{filter:drop-shadow(0 0 10px #EF4444)} }
            .critical-bubble { animation: glow 2s infinite; }
          `}</style>
        </defs>
        <circle cx="100" cy="105" r="72" fill="#475569" opacity="0.9" />
        <text x="100" y="101" textAnchor="middle" fontSize="13" fontWeight="700" fill="white">1.87M</text>
        <text x="100" y="117" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.7)">Normal</text>
        <circle cx="200" cy="65" r="42" fill="#F59E0B" opacity="0.9" />
        <text x="200" y="61" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">288K</text>
        <text x="200" y="75" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.8)">Elevated</text>
        <circle cx="215" cy="148" r="32" fill="#EA580C" opacity="0.9" />
        <text x="215" y="144" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">168K</text>
        <text x="215" y="158" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.8)">High</text>
        <circle cx="162" cy="175" r="22" fill="#EF4444" className="critical-bubble" />
        <text x="162" y="172" textAnchor="middle" fontSize="9" fontWeight="700" fill="white">72K</text>
        <text x="162" y="184" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.8)">Critical</text>
      </svg>
    </div>
  );
}

function RegulatoryPulse() {
  return (
    <div style={{ background: 'var(--navy)', borderRadius: 8, padding: '10px 18px', marginBottom: 16, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      {[
        { label: 'CBN Mandate: March 2026', badge: 'Active', color: '#34D399' },
        { label: 'FATF Grey List: Removed Oct 2025', badge: 'Resolved', color: '#34D399' },
        { label: 'Compliance Deadline: Sept 2027', badge: null, color: 'var(--teal)' },
        { label: '15 months remaining', badge: null, color: '#FCD34D' },
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: item.color, fontWeight: 600 }}>
          {item.badge && <span style={{ background: item.color, color: '#fff', borderRadius: 10, padding: '1px 6px', fontSize: 9, fontWeight: 700 }}>{item.badge}</span>}
          {item.label}
          {i < 3 && <span style={{ color: '#4B5563', marginLeft: 8 }}>·</span>}
        </div>
      ))}
    </div>
  );
}

function FPTrendTable() {
  const rows = [
    { period: 'Q4 2025', ruleFP: '41.2%', rtseFP: '—', improvement: 'Baseline' },
    { period: 'Q1 2026', ruleFP: '35.8%', rtseFP: '12.1%', improvement: '↓ 13.7pp' },
    { period: 'Q2 2026 MTD', ruleFP: '28.4%', rtseFP: '8.2%', improvement: '↓ 20.2pp' },
  ];
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', marginBottom: 16, boxShadow: 'var(--card-shadow)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', marginBottom: 10 }}>FALSE POSITIVE TREND · RULE-BASED vs RTSE SHADOW</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
            {['Period', 'Rule-Based FP Rate', 'RTSE Shadow FP', 'Improvement'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '6px 10px', color: '#9CA3AF', fontWeight: 600, fontSize: 10 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #F3F4F6', background: i === 2 ? '#FFFBEB' : undefined }}>
              <td style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--navy)' }}>{r.period}</td>
              <td style={{ padding: '8px 10px', color: '#374151' }}>{r.ruleFP}</td>
              <td style={{ padding: '8px 10px', color: '#374151' }}>{r.rtseFP}</td>
              <td style={{ padding: '8px 10px', fontWeight: 700, color: r.improvement === 'Baseline' ? '#6B7280' : 'var(--good)' }}>{r.improvement}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SLADashboard() {
  const analysts = [
    { name: 'Chukwuemeka', open: 8 },
    { name: 'Ngozi', open: 11 },
    { name: 'Tunde', open: 6 },
    { name: 'Amaka', open: 14, highest: true },
    { name: 'Segun', open: 9 },
  ];
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', marginBottom: 16, boxShadow: 'var(--card-shadow)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', marginBottom: 12 }}>SLA STATUS · TODAY</div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
        {[
          { label: 'Breaching', count: 2, bg: '#FEF2F2', color: 'var(--bad)', dot: '#DC2626' },
          { label: 'At Risk (< 1h remaining)', count: 5, bg: '#FFFBEB', color: '#D97706', dot: '#D97706' },
          { label: 'On Track', count: 7, bg: '#F0FDF4', color: 'var(--good)', dot: '#059669' },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, background: s.bg, borderRadius: 20, padding: '6px 14px', fontSize: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
            <strong style={{ color: s.color }}>{s.count} alerts</strong>
            <span style={{ color: '#6B7280' }}>{s.label}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.06em', marginBottom: 8 }}>ANALYST WORKLOAD</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {analysts.map(a => (
          <div key={a.name} style={{
            background: a.highest ? '#FEF2F2' : '#F3F4F6',
            border: `1px solid ${a.highest ? '#FECACA' : '#E5E7EB'}`,
            borderRadius: 20, padding: '4px 12px', fontSize: 11, display: 'flex', gap: 5, alignItems: 'center',
          }}>
            <span style={{ fontWeight: 600, color: a.highest ? 'var(--bad)' : 'var(--navy)' }}>{a.name}</span>
            <span style={{ color: '#6B7280' }}>{a.open} open</span>
            {a.highest && <span style={{ color: 'var(--bad)', fontWeight: 700, fontSize: 9 }}>▲ highest</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

type Persona = 'GMD' | 'CRO' | 'Head of Fraud Ops';

interface Props {
  setView: (v: string) => void;
}

export default function GroupDashboard({ setView }: Props) {
  const [subView, setSubView] = useState('scorecard');
  const [persona, setPersona] = useState<Persona>('GMD');
  const isGMD = persona === 'GMD';
  const isCRO = persona === 'CRO';
  const isOps = persona === 'Head of Fraud Ops';

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      <Sidebar active={subView} setActive={setSubView} />
      <main style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        {subView === 'scorecard' && (
          <>
            {/* Dashboard header with persona selector */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A3A6B', margin: 0 }}>Group Dashboard</h2>
                <span style={{ fontSize: 11, color: '#6B7280' }}>Live · Updated just now</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: '#6B7280' }}>View as:</span>
                <select value={persona} onChange={e => setPersona(e.target.value as Persona)} style={{
                  fontSize: 12, fontWeight: 600, color: '#1A3A6B',
                  background: '#F4F7FB', border: '1px solid #CBD5E1',
                  borderRadius: 8, padding: '6px 12px', cursor: 'pointer', outline: 'none',
                }}>
                  <option value="GMD">GMD</option>
                  <option value="CRO">CRO</option>
                  <option value="Head of Fraud Ops">Head of Fraud Ops</option>
                </select>
              </div>
            </div>
            <CollapsibleBanner />
            <LiveTicker />
            <KPIGrid persona={persona} />

            {isOps && <SLADashboard />}
            {isGMD && <RegulatoryPulse />}

            {/* Alert Volume + AI Detection: side by side (hidden for GMD) */}
            {!isGMD && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <ChannelHexbin />
                <AiDetectionBubbles />
              </div>
            )}

            <SystemHealth />
            <SubsidiaryAndNetwork setView={setView} />
            <RiskExposure />

            {isCRO && <FPTrendTable />}
            {!isGMD && <AIAlerts setView={setView} />}
          </>
        )}
        {subView !== 'scorecard' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 40, textAlign: 'center', color: '#6B7280', boxShadow: 'var(--card-shadow)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--navy)' }}>{subView.charAt(0).toUpperCase() + subView.slice(1)} View</div>
            <div style={{ fontSize: 12, marginTop: 6 }}>This sub-view is available in the full deployment</div>
          </div>
        )}
      </main>
    </div>
  );
}

function CollapsibleBanner() {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ background: 'linear-gradient(135deg, var(--navy), #0F2347)', borderRadius: 12, padding: '16px 20px', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>FBN FRAML Programme · Group Dashboard</div>
            <div style={{ fontSize: 11, color: '#93C5FD' }}>Nigeria banking fraud context — click to {open ? 'collapse' : 'expand'}</div>
          </div>
        </div>
        <span style={{ color: '#fff', fontSize: 16 }}>{open ? '▾' : '▸'}</span>
      </div>
      {open && (
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ fontSize: 11, color: '#E2E8F0', lineHeight: 1.6 }}>
            FBN processes <strong style={{ color: 'var(--teal)' }}>₦2.4 trillion</strong> monthly across 4 subsidiaries and 830+ branches.
            Nigeria recorded <strong style={{ color: '#FCA5A5' }}>₦52.3B in fraud losses in 2024</strong> — a 196% increase over 5 years. 70% from digital channels.
          </div>
          <div style={{ fontSize: 11, color: '#E2E8F0', lineHeight: 1.6 }}>
            <strong style={{ color: '#FCD34D' }}>CBN AI/ML mandate</strong> active since March 2026. Compliance deadline: September 2027.
            FATF grey list removal: October 2025. Elevated international compliance expectations now apply.
          </div>
        </div>
      )}
    </div>
  );
}
