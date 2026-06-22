import { useState } from 'react';
import AlertSankey from './AlertSankey';
import AIRAIntelligence from './AIRAIntelligence';

const NAVY = '#1A3A6B';

function ConvergenceSankey() {
  const stage1 = [
    { label: 'ATO / Account Takeover', amount: '₦2.1B', color: '#DC2626', h: 70 },
    { label: 'BEC / Payment Diversion', amount: '₦890M', color: '#D97706', h: 50 },
    { label: 'Card Fraud', amount: '₦340M', color: '#00A99D', h: 30 },
  ];
  const stage2 = [
    { label: 'Mule Account Network', sub: '87 accounts', h: 80 },
    { label: 'Crypto Conversion', sub: 'OPay/Binance', h: 60 },
  ];
  const stage3 = [
    { label: 'Structured Cash', sub: '', h: 40 },
    { label: 'Cross-Border Wire', sub: 'UAE/Panama', h: 50 },
    { label: 'DeFi Layering', sub: '', h: 40 },
  ];

  const GAP = 8, X1 = 10, X2 = 200, X3 = 390, W = 110;
  let y1 = 20, y2 = 20, y3 = 20;
  const s1 = stage1.map(s => { const n = { ...s, x: X1, y: y1, w: W }; y1 += s.h + GAP; return n; });
  const s2 = stage2.map(s => { const n = { ...s, x: X2, y: y2, w: W }; y2 += s.h + GAP; return n; });
  const s3 = stage3.map(s => { const n = { ...s, x: X3, y: y3, w: W }; y3 += s.h + GAP; return n; });

  function bezierBand(bx1: number, by1: number, bh1: number, bx2: number, by2: number, bh2: number, _color: string) {
    const mx = (bx1 + bx2) / 2;
    return `M${bx1},${by1} C${mx},${by1} ${mx},${by2} ${bx2},${by2} L${bx2},${by2+bh2} C${mx},${by2+bh2} ${mx},${by1+bh1} ${bx1},${by1+bh1}Z`;
  }

  const bands1 = [
    { si: 0, di: 0, sf: 0.6, df: 0.7 },
    { si: 0, di: 1, sf: 0.4, df: 0.5 },
    { si: 1, di: 0, sf: 0.7, df: 0.3 },
    { si: 1, di: 1, sf: 0.3, df: 0.4 },
    { si: 2, di: 0, sf: 1.0, df: 0.2 },
  ];
  const s1Off = s1.map(() => 0), s2Off = s2.map(() => 0);
  const s2Off2 = s2.map(() => 0), s3Off = s3.map(() => 0);

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: 'var(--card-shadow)', border: '1px solid #E5E7EB' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>Fund Flow: Fraud Proceeds → Laundered Funds</div>
        <span style={{ background: '#FEF3C7', color: '#92400E', borderRadius: 20, padding: '2px 10px', fontSize: 10, fontWeight: 700 }}>FRAML Convergence</span>
      </div>
      <svg viewBox="0 0 520 200" style={{ width: '100%', height: 200 }}>
        <text x={X1+W/2} y={12} textAnchor="middle" fontSize="8" fill="#9CA3AF" fontWeight="700">FRAUD SOURCE</text>
        <text x={X2+W/2} y={12} textAnchor="middle" fontSize="8" fill="#9CA3AF" fontWeight="700">INTERMEDIARY</text>
        <text x={X3+W/2} y={12} textAnchor="middle" fontSize="8" fill="#9CA3AF" fontWeight="700">DESTINATION</text>

        {bands1.map(({ si, di, sf, df }, idx) => {
          const src = s1[si], dst = s2[di];
          const bh1 = src.h * sf, bh2 = dst.h * df * 0.5;
          const by1 = src.y + s1Off[si], by2 = dst.y + s2Off[di];
          s1Off[si] += bh1 * 0.6;
          s2Off[di] += bh2 * 0.8;
          return <path key={idx} d={bezierBand(src.x+W, by1, bh1*0.7, dst.x, by2, bh2, src.color)} fill={src.color} opacity={0.3} />;
        })}

        {s2.flatMap((src, si) =>
          s3.map((dst, di) => {
            const bh1 = src.h * 0.3, bh2 = dst.h * 0.4;
            const by1 = src.y + s2Off2[si], by2 = dst.y + s3Off[di];
            s2Off2[si] += bh1 * 0.5;
            s3Off[di] += bh2 * 0.4;
            return <path key={`${si}-${di}`} d={bezierBand(src.x+W, by1, bh1, dst.x, by2, bh2, '#1A3A6B')} fill="#1A3A6B" opacity={0.25} />;
          })
        )}

        {s1.map(n => (
          <g key={n.label}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={4} fill={n.color} />
            <text x={n.x+n.w/2} y={n.y+n.h/2-5} textAnchor="middle" fontSize="8" fill="white" fontWeight="700">{n.label.split(' ')[0]}</text>
            <text x={n.x+n.w/2} y={n.y+n.h/2+6} textAnchor="middle" fontSize="9" fill="white">{n.amount}</text>
          </g>
        ))}

        {s2.map(n => (
          <g key={n.label}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={4} fill="#1A3A6B" />
            <text x={n.x+n.w/2} y={n.y+n.h/2-5} textAnchor="middle" fontSize="8" fill="white" fontWeight="700">{n.label.split(' ').slice(0,2).join(' ')}</text>
            <text x={n.x+n.w/2} y={n.y+n.h/2+7} textAnchor="middle" fontSize="8" fill="#93C5FD">{n.sub}</text>
          </g>
        ))}

        {s3.map(n => (
          <g key={n.label}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={4} fill="#374151" />
            <text x={n.x+n.w/2} y={n.y+n.h/2-4} textAnchor="middle" fontSize="8" fill="white" fontWeight="700">{n.label.split(' ')[0]}</text>
            {n.sub && <text x={n.x+n.w/2} y={n.y+n.h/2+6} textAnchor="middle" fontSize="7" fill="#D1D5DB">{n.sub}</text>}
          </g>
        ))}
      </svg>
    </div>
  );
}

function CountryBubbleMap() {
  const countries = [
    { code: 'RUS', name: 'Russia',    score: 97, x: 380, y: 38  },
    { code: 'UAE', name: 'UAE',       score: 94, x: 355, y: 78  },
    { code: 'NGA', name: 'Nigeria',   score: 84, x: 230, y: 135 },
    { code: 'MYS', name: 'Malaysia',  score: 81, x: 430, y: 120 },
    { code: 'PAN', name: 'Panama',    score: 78, x: 60,  y: 95  },
    { code: 'VEN', name: 'Venezuela', score: 76, x: 80,  y: 130 },
    { code: 'CYP', name: 'Cyprus',    score: 72, x: 310, y: 65  },
    { code: 'CHN', name: 'China',     score: 68, x: 445, y: 88  },
  ];
  const riskColor = (s: number) => s > 90 ? '#DC2626' : s >= 75 ? '#D97706' : '#B8943A';

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginTop: 12, boxShadow: 'var(--card-shadow)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', marginBottom: 8 }}>
        HIGH-RISK COUNTRY EXPOSURE · AML + FRAUD OVERLAP
      </div>
      <svg viewBox="0 0 500 200" style={{ width: '100%', height: 200 }}>
        <path d="M180,30 Q200,20 240,25 Q290,22 330,35 Q370,30 400,45 Q430,55 440,80 Q445,100 435,120 Q430,145 410,160 Q390,175 360,178 Q330,182 300,175 Q270,168 250,155 Q230,170 210,165 Q185,158 175,140 Q165,120 170,95 Q162,70 180,30Z"
          fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />

        {countries.map(c => {
          const r = c.score / 10;
          const col = riskColor(c.score);
          return (
            <g key={c.code}>
              <circle cx={c.x} cy={c.y} r={r + 4} fill={col} opacity={0.2} />
              <circle cx={c.x} cy={c.y} r={r} fill={col} opacity={0.85} />
              <text x={c.x} y={c.y - 1} textAnchor="middle" fontSize="7" fontWeight="700" fill="white">{c.code}</text>
              <text x={c.x} y={c.y + 7} textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.9)">{c.score}</text>
            </g>
          );
        })}

        <rect x={5} y={160} width={120} height={36} rx={4} fill="#F9FAFB" stroke="#E5E7EB" />
        <text x={12} y={172} fontSize="7" fill="#9CA3AF" fontWeight="700">RISK SCORE</text>
        {([['#DC2626','>90',12,184],['#D97706','75-90',42,184],['#B8943A','60-74',76,184]] as [string,string,number,number][]).map(([col,label,lx,ly]) => (
          <g key={label}>
            <circle cx={lx} cy={ly} r={5} fill={col} />
            <text x={lx+8} y={ly+4} fontSize="7" fill="#6B7280">{label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── Top-level sub-tab nav ────────────────────────────────────────────────────

type FITab = 'threats' | 'detection' | 'heatmap' | 'aml' | 'aira';

const TABS: { key: FITab; label: string; aira?: boolean }[] = [
  { key: 'threats', label: 'Fraud Threats' },
  { key: 'detection', label: 'Detection Performance' },
  { key: 'heatmap', label: 'Typology Heatmap' },
  { key: 'aml', label: 'AML Summary' },
  { key: 'aira', label: 'AIRA · Intelligence', aira: true },
];

export default function FRAMLIntelligence() {
  const [tab, setTab] = useState<FITab>('threats');

  return (
    <div style={{ padding: 20, overflow: 'auto', flex: 1 }}>
      {/* Sub-tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid #E5E7EB', paddingBottom: 0 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            background: 'transparent', border: 'none', padding: '8px 14px', fontSize: 12,
            fontWeight: tab === t.key ? 700 : 400,
            color: tab === t.key ? NAVY : '#6B7280',
            borderBottom: tab === t.key ? `2px solid ${NAVY}` : '2px solid transparent',
            cursor: 'pointer', whiteSpace: 'nowrap', marginBottom: -1, display: 'flex', alignItems: 'center', gap: 5,
          }}>
            {t.label}
            {t.aira && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 9, color: '#34D399', fontWeight: 700 }}>✦</span>
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'threats' && (
        <div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: 'var(--card-shadow)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', marginBottom: 14 }}>FRAUD THREAT LANDSCAPE · LIVE</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[
                { title: 'BEC / PAYMENT DIVERSION', value: '₦23M', sub: 'intercepted · 3 active rings', note: 'FBN Merchant Bank & Commercial', bg: '#FEF2F2', bc: '#FECACA', vc: 'var(--bad)' },
                { title: 'SIM SWAP / ATO', value: '14 flags', sub: 'today · Retail segment', note: '340% YoY increase', bg: '#FFFBEB', bc: '#FDE68A', vc: 'var(--amber)' },
                { title: 'MULE ACCOUNT ACTIVITY', value: '₦4.8M', sub: 'flagged · 6-week drift pattern', note: 'RTSE shadow detection', bg: '#F0FDFA', bc: '#99F6E4', vc: 'var(--teal)' },
              ].map(t => (
                <div key={t.title} style={{ background: t.bg, border: `1px solid ${t.bc}`, borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: t.vc, letterSpacing: '.05em', marginBottom: 6 }}>{t.title}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: t.vc }}>{t.value}</div>
                  <div style={{ fontSize: 11, color: '#374151', marginTop: 4 }}>{t.sub}</div>
                  <div style={{ fontSize: 10, color: '#6B7280', marginTop: 4 }}>{t.note}</div>
                </div>
              ))}
            </div>
          </div>
          <AlertSankey />
          <ConvergenceSankey />
          <CountryBubbleMap />
        </div>
      )}

      {tab === 'detection' && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: 'var(--card-shadow)', maxWidth: 600 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', marginBottom: 14 }}>FRAUD DETECTION PERFORMANCE</div>
          {[
            { label: 'Mobile Banking', pct: 41, color: 'var(--bad)' },
            { label: 'Internet Banking', pct: 29, color: 'var(--orange)' },
            { label: 'USSD', pct: 18, color: 'var(--amber)' },
            { label: 'Cards (POS/ATM)', pct: 8, color: 'var(--teal)' },
            { label: 'Other', pct: 4, color: '#6B7280' },
          ].map(c => (
            <div key={c.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span>{c.label}</span><span style={{ fontWeight: 600, color: c.color }}>{c.pct}%</span>
              </div>
              <div style={{ background: '#E5E7EB', borderRadius: 4, height: 8 }}>
                <div style={{ background: c.color, width: `${c.pct}%`, height: 8, borderRadius: 4 }}/>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'heatmap' && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: 'var(--card-shadow)', maxWidth: 500 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', marginBottom: 14 }}>TYPOLOGY HEATMAP</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { name: 'Account Takeover', level: 'HIGH', bg: '#FEF2F2', c: 'var(--bad)' },
              { name: 'BEC', level: 'HIGH', bg: '#FEF2F2', c: 'var(--bad)' },
              { name: 'Mule/Money Mule', level: 'MEDIUM', bg: '#FFFBEB', c: 'var(--amber)' },
              { name: 'Card Skimming', level: 'MEDIUM', bg: '#FFFBEB', c: 'var(--amber)' },
              { name: 'Internal Fraud', level: 'MEDIUM', bg: '#FFFBEB', c: 'var(--amber)' },
              { name: 'Social Engineering', level: 'LOW', bg: '#F0FDFA', c: 'var(--teal)' },
              { name: 'Advance Fee', level: 'LOW', bg: '#F0FDFA', c: 'var(--teal)' },
              { name: 'Loan Fraud', level: 'LOW', bg: '#F0FDFA', c: 'var(--teal)' },
              { name: 'Cyber Fraud', level: 'MEDIUM', bg: '#FFFBEB', c: 'var(--amber)' },
            ].map(t => (
              <div key={t.name} style={{ background: t.bg, borderRadius: 8, padding: 12, textAlign: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.c, margin: '0 auto 6px' }}/>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>{t.name}</div>
                <div style={{ fontSize: 10, color: t.c, fontWeight: 700, marginTop: 4 }}>{t.level}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'aml' && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.06em', marginBottom: 10 }}>AML COMPLIANCE SUMMARY</div>
          <div style={{ background: '#F9FAFB', borderRadius: 10, padding: 14, display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', marginBottom: 16 }}>
            {[
              { v: '8.42M', l: 'Txns Monitored MTD' },
              { v: '47', l: 'STRs Filed', sub: '37 Genie AI' },
              { v: '312', l: 'CTRs Filed' },
              { v: '9', l: 'Active Watchlist Hits', warn: true },
            ].map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: s.warn ? 'var(--amber)' : 'var(--navy)' }}>{s.v}</div>
                <div style={{ fontSize: 10, color: '#6B7280' }}>{s.l}{s.sub ? <> <span style={{ color: 'var(--teal)' }}>({s.sub})</span></> : null}</div>
              </div>
            ))}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--good)' }}>GoAML Connected</div>
              <div style={{ fontSize: 10, color: '#6B7280' }}>Last sync: 2h ago</div>
            </div>
            <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: 20, padding: '4px 12px', fontSize: 10, fontWeight: 700, color: 'var(--good)' }}>
              FATF Grey List REMOVED · Oct 2025
            </div>
          </div>
        </div>
      )}

      {tab === 'aira' && <AIRAIntelligence />}
    </div>
  );
}
