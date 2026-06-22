
export default function SubsidiaryAndNetwork({ setView }: { setView: (v: string) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16, marginBottom: 16 }}>
      {/* Risk Matrix Heatmap */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: 'var(--card-shadow)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', marginBottom: 14 }}>SUBSIDIARY RISK VIEW</div>
        {(() => {
          const MATRIX_DATA = [
            {
              sub: 'FBN Retail',
              cells: [
                { val: '9 alerts', color: '#DC2626' },
                { val: '₦2.3B', color: '#DC2626' },
                { val: '78%', color: '#D97706' },
                { val: 'Clean', color: '#059669' },
                { val: '↑14%', color: '#DC2626' },
              ],
            },
            {
              sub: 'FBN Merchant',
              cells: [
                { val: '3 alerts', color: '#D97706' },
                { val: '₦340M', color: '#D97706' },
                { val: '81%', color: '#D97706' },
                { val: 'Review', color: '#D97706' },
                { val: '↓8%', color: '#059669' },
              ],
            },
            {
              sub: 'First Pension',
              cells: [
                { val: '1 alert', color: '#059669' },
                { val: '₦180M', color: '#DC2626' },
                { val: '94%', color: '#059669' },
                { val: 'STR Due', color: '#DC2626' },
                { val: '↑22%', color: '#DC2626' },
              ],
            },
            {
              sub: 'FBN Insurance',
              cells: [
                { val: '1 alert', color: '#059669' },
                { val: '₦45M', color: '#059669' },
                { val: '97%', color: '#059669' },
                { val: 'Clean', color: '#059669' },
                { val: '↓3%', color: '#059669' },
              ],
            },
          ];
          const COLS = ['Alerts', 'At Risk', 'SLA', 'Compliance', 'Trend'];
          const cellW = 68, cellH = 36, labelW = 90, headerH = 28;
          const svgW = labelW + COLS.length * cellW;
          const svgH = headerH + MATRIX_DATA.length * cellH;
          return (
            <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', height: svgH }}>
              {COLS.map((col, ci) => (
                <text key={col} x={labelW + ci * cellW + cellW / 2} y={18}
                  textAnchor="middle" fontSize="9" fill="#9CA3AF" fontWeight="600">{col}</text>
              ))}
              {MATRIX_DATA.map((row, ri) => (
                <g key={row.sub}>
                  <text x={labelW - 6} y={headerH + ri * cellH + cellH / 2 + 4}
                    textAnchor="end" fontSize="10" fill="#4A5568" fontWeight="600">{row.sub}</text>
                  {row.cells.map((cell, ci) => (
                    <g key={ci}>
                      <rect
                        x={labelW + ci * cellW + 2} y={headerH + ri * cellH + 2}
                        width={cellW - 4} height={cellH - 4}
                        rx={4} fill={cell.color} opacity={0.85}
                      />
                      <text
                        x={labelW + ci * cellW + cellW / 2}
                        y={headerH + ri * cellH + cellH / 2 + 4}
                        textAnchor="middle" fontSize="9" fill="white" fontWeight="600">{cell.val}</text>
                    </g>
                  ))}
                </g>
              ))}
            </svg>
          );
        })()}
      </div>

      {/* Network Intelligence Snapshot */}
      <div onClick={() => setView('network')} style={{ cursor: 'pointer', background: 'var(--navy)', borderRadius: 12, padding: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'box-shadow .2s' }}
        onMouseOver={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,169,157,0.4)')}
        onMouseOut={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)')}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Network Intelligence</div>
          <div style={{ fontSize: 11, color: '#93C5FD', marginTop: 2 }}>Cross-account connection analysis · Click to open →</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--teal)' }}>3</div>
            <div style={{ fontSize: 11, color: '#E2E8F0' }}>Active Rings</div>
            <div style={{ fontSize: 10, color: '#93C5FD', marginTop: 4 }}>18 accounts · ₦38.1M</div>
          </div>
          <div style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#FCA5A5' }}>NET-0017</div>
            <div style={{ fontSize: 11, color: '#E2E8F0' }}>7 accounts · ATO+BEC</div>
            <div style={{ fontSize: 10, color: '#93C5FD', marginTop: 4 }}>Same device fingerprint</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#34D399' }}>2</div>
            <div style={{ fontSize: 11, color: '#E2E8F0' }}>STRs Auto-Drafted</div>
            <div style={{ fontSize: 10, color: '#93C5FD', marginTop: 4 }}>GoAML filing pending</div>
          </div>
        </div>
        <svg viewBox="0 0 300 70" style={{ width: '100%', height: 70 }}>
          <line x1="60" y1="35" x2="120" y2="18" stroke="var(--teal)" strokeWidth="1.5" opacity=".6"/>
          <line x1="60" y1="35" x2="120" y2="52" stroke="var(--teal)" strokeWidth="1.5" opacity=".6"/>
          <line x1="120" y1="18" x2="180" y2="35" stroke="var(--bad)" strokeWidth="2" opacity=".8"/>
          <line x1="120" y1="52" x2="180" y2="35" stroke="var(--bad)" strokeWidth="2" opacity=".8"/>
          <line x1="180" y1="35" x2="240" y2="20" stroke="var(--amber)" strokeWidth="1.5" opacity=".6"/>
          <line x1="180" y1="35" x2="240" y2="50" stroke="var(--amber)" strokeWidth="1.5" opacity=".6"/>
          <circle cx="60" cy="35" r="9" fill="var(--teal)" opacity=".9"/>
          <circle cx="120" cy="18" r="7" fill="var(--teal)" opacity=".7"/>
          <circle cx="120" cy="52" r="7" fill="var(--teal)" opacity=".7"/>
          <circle cx="180" cy="35" r="11" fill="var(--bad)" opacity=".9"/>
          <circle cx="240" cy="20" r="6" fill="var(--amber)" opacity=".7"/>
          <circle cx="240" cy="50" r="6" fill="var(--amber)" opacity=".7"/>
          <text x="180" y="39" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">NET-17</text>
        </svg>
      </div>
    </div>
  );
}
