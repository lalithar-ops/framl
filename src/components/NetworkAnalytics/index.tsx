import { useState } from 'react';
import { NETWORK_RINGS } from '../../data/mockData';
import type { NetworkRing, NetworkNode } from '../../data/mockData';

const NODE_COLORS: Record<string, string> = {
  origin: '#1A3A6B', corporate: '#00A99D', mule: '#DC2626',
  external: '#D97706', device: '#7C3AED', staging: '#E8541A', internal: '#991B1B',
};


const SEV_COLORS: Record<string, string> = {
  bad: '#DC2626', orange: '#E8541A', amber: '#D97706', teal: '#00A99D',
};

function NetworkGraph({
  ring, selectedNode, onNodeClick,
}: {
  ring: NetworkRing;
  selectedNode: string | null;
  onNodeClick: (id: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const connectedToHovered = hovered
    ? new Set(ring.edges.filter(e => e.from === hovered || e.to === hovered).flatMap(e => [e.from, e.to]))
    : null;

  const hoveredNode = hovered ? ring.nodes.find(n => n.id === hovered) : null;

  return (
    <svg viewBox="0 0 720 440" style={{ width: '100%', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E5E7EB' }}>
      {/* Edges */}
      {ring.edges.map((edge, i) => {
        const from = ring.nodes.find(n => n.id === edge.from);
        const to = ring.nodes.find(n => n.id === edge.to);
        if (!from || !to) return null;
        const mx = (from.x + to.x) / 2;
        const my = (from.y + to.y) / 2;
        const dim = connectedToHovered && !connectedToHovered.has(edge.from);
        return (
          <g key={i} opacity={dim ? 0.15 : 0.8}>
            <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#94A3B8" strokeWidth="1.5" strokeDasharray={edge.label.includes('Device') ? '5,3' : undefined} />
            <text x={mx} y={my - 5} textAnchor="middle" fontSize="9" fill="#6B7280">{edge.label}</text>
          </g>
        );
      })}
      {/* Nodes — no labels below circles */}
      {ring.nodes.map(node => {
        const isSelected = selectedNode === node.id;
        const isHovered = hovered === node.id;
        const isDimmed = connectedToHovered && !connectedToHovered.has(node.id) && hovered !== node.id;
        const color = NODE_COLORS[node.type] || '#6B7280';
        const isDeviceX = node.type === 'device' && node.id === 'DX';
        return (
          <g key={node.id}
            style={{ cursor: 'pointer' }}
            opacity={isDimmed ? 0.25 : 1}
            onClick={() => onNodeClick(node.id)}
            onMouseEnter={() => setHovered(node.id)}
            onMouseLeave={() => setHovered(null)}>
            {isSelected && <circle cx={node.x} cy={node.y} r={34} fill={isDeviceX ? '#7C3AED' : color} opacity={0.2} />}
            {isHovered && <circle cx={node.x} cy={node.y} r={32} fill={isDeviceX ? '#7C3AED' : color} opacity={0.15} />}
            {isDeviceX ? (
              <circle cx={node.x} cy={node.y} r={26} fill="#EDE9FE" stroke="#7C3AED" strokeDasharray="5,3" strokeWidth={2.5} />
            ) : (
              <circle cx={node.x} cy={node.y} r={26} fill={color} stroke={isSelected ? '#fff' : 'transparent'} strokeWidth={2} />
            )}
            {isDeviceX ? (
              <>
                <text x={node.x} y={node.y + 1} textAnchor="middle" fontSize="9" fontWeight="700" fill="#7C3AED">Device X</text>
                <text x={node.x} y={node.y + 13} textAnchor="middle" fontSize="8" fill="#7C3AED">FP-D-4471</text>
              </>
            ) : (
              <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize="9" fontWeight="600" fill="white">
                {node.label.split('\n')[0].substring(0, 10)}
              </text>
            )}
          </g>
        );
      })}
      {/* Tooltip — rendered last so it sits on top */}
      {hoveredNode && (() => {
        const n = hoveredNode;
        const lines = n.label.split('\n');
        const tooltipH = lines.length > 1 ? 36 : 24;
        return (
          <g style={{ pointerEvents: 'none' }}>
            <rect x={n.x - 64} y={n.y - 58} width={128} height={tooltipH} rx={5} fill="#1A3A6B" opacity={0.93} />
            {lines.map((line, i) => (
              <text key={i} x={n.x} y={n.y - 44 + i * 14}
                textAnchor="middle" fontSize={10}
                fill={i === 0 ? '#ffffff' : '#a0c4e8'}
                fontWeight={i === 0 ? '600' : '400'}
              >{line}</text>
            ))}
          </g>
        );
      })()}
    </svg>
  );
}

function RingDetail({ ring, onInvestigate }: { ring: NetworkRing; onInvestigate: () => void }) {
  const sevColor = SEV_COLORS[ring.severityColor] || '#6B7280';
  const timeline = [
    { time: ring.firstDetected + ' · 08:11', event: 'RTSE ML anomaly score crossed 0.85' },
    { time: ring.firstDetected + ' · 09:34', event: 'TrustArmour: device fingerprint match confirmed' },
    { time: ring.lastActivity.split(' · ')[0] + ' · 07:20', event: 'Genie AI: STR narrative draft generated' },
    { time: ring.lastActivity, event: 'Alert escalated to Fraud Operations' },
  ];
  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ background: sevColor, color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>{ring.severity}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>{ring.id}</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: sevColor, marginBottom: 4 }}>{ring.totalExposure}</div>
      <div style={{ fontSize: 12, color: '#374151', marginBottom: 12, lineHeight: 1.5 }}>{ring.description}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {ring.typologies.map(t => (
          <span key={t} style={{ background: '#F3F4F6', borderRadius: 20, padding: '3px 10px', fontSize: 10, fontWeight: 600 }}>{t}</span>
        ))}
      </div>
      <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>Subsidiaries: {ring.subsidiaries.join(' · ')}</div>
      <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>First detected: {ring.firstDetected}</div>
      <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 16 }}>Last activity: {ring.lastActivity}</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {ring.genieReady && (
          <button onClick={onInvestigate} style={{ flex: 1, background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
            View Genie AI Draft
          </button>
        )}
        <button style={{ flex: 1, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
          File STR via GoAML
        </button>
      </div>
      {ring.strsGenerated > 0 && (
        <div style={{ background: '#F0FDF4', borderRadius: 8, padding: '8px 12px', fontSize: 11, color: 'var(--good)', fontWeight: 600, marginBottom: 16 }}>
          {ring.strsGenerated} STR{ring.strsGenerated > 1 ? 's' : ''} auto-drafted · GoAML filing pending
        </div>
      )}
      <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.06em', marginBottom: 8 }}>TIMELINE</div>
      {timeline.map((t, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 11 }}>
          <div style={{ color: '#9CA3AF', whiteSpace: 'nowrap', flexShrink: 0 }}>{t.time}</div>
          <div style={{ color: '#374151' }}>{t.event}</div>
        </div>
      ))}
    </div>
  );
}

function NodeDetail({ node, ring }: { node: NetworkNode; ring: NetworkRing }) {
  const connected = ring.edges.filter(e => e.from === node.id || e.to === node.id)
    .map(e => e.from === node.id ? e.to : e.from);

  if (node.id === 'DX') {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EDE9FE', border: '2px dashed #7C3AED' }} />
          <div style={{ fontSize: 14, fontWeight: 700, color: '#7C3AED' }}>Device X · FP-D-4471</div>
        </div>
        <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 12 }}>Shared device fingerprint — convergence node</div>
        {[
          ['Device Fingerprint', 'D-4471'],
          ['Linked Accounts', 'Adaeze Okonkwo (CIF 2291), Prestige Foods Ltd (CIF 8841), Mule Acct A (CIF 3341)'],
          ['First seen', '8 Jun 2026'],
          ['Last active', '19 Jun 2026 · 09:42'],
          ['Device type', 'Android · Samsung Galaxy A54'],
          ['IP cluster', '196.43.xx.xx (Lagos ISP)'],
          ['TrustArmour flag', 'SIM swap detected on CIF 2291 · 14 Jun 2026'],
          ['Risk signal', 'Same device used for retail ATO and corporate SWIFT initiation — cross-segment convergence flag'],
        ].map(([l, v]) => (
          <div key={l} style={{ display: 'flex', gap: 10, marginBottom: 6, fontSize: 11 }}>
            <span style={{ color: '#6B7280', width: 130, flexShrink: 0 }}>{l}</span>
            <span style={{ color: '#374151', fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>
    );
  }

  const txns = [
    { date: '19 Jun 2026', type: 'Debit Transfer', amount: node.amount || '–', counterparty: 'Internal' },
    { date: '18 Jun 2026', type: 'Credit', amount: '₦240K', counterparty: 'Salary' },
    { date: '15 Jun 2026', type: 'Debit Transfer', amount: '₦180K', counterparty: 'POS' },
  ];
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>{node.label}</div>
      <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 2 }}>Type: <strong>{node.type}</strong></div>
      {node.channel && <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 2 }}>Channel: {node.channel}</div>}
      {node.amount && <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--bad)', margin: '8px 0' }}>{node.amount}</div>}
      <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 12 }}>Connected to: {connected.join(', ')}</div>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.06em', marginBottom: 8 }}>TRANSACTION HISTORY</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
            {['Date', 'Type', 'Amount', 'Counterparty'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '4px 6px', color: '#9CA3AF', fontWeight: 600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {txns.map((t, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
              <td style={{ padding: '5px 6px', color: '#6B7280' }}>{t.date}</td>
              <td style={{ padding: '5px 6px' }}>{t.type}</td>
              <td style={{ padding: '5px 6px', fontWeight: 600, color: 'var(--bad)' }}>{t.amount}</td>
              <td style={{ padding: '5px 6px', color: '#6B7280' }}>{t.counterparty}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button style={{ marginTop: 12, width: '100%', background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
        Investigate this account →
      </button>
    </div>
  );
}

export default function NetworkAnalytics({ setView }: { setView: (v: string) => void }) {
  const [selectedRingId, setSelectedRingId] = useState<string>('NET-0017');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const ring = NETWORK_RINGS.find(r => r.id === selectedRingId) || NETWORK_RINGS[0];
  const selectedNode = selectedNodeId ? ring.nodes.find(n => n.id === selectedNodeId) || null : null;

  const handleRingClick = (id: string) => { setSelectedRingId(id); setSelectedNodeId(null); };
  const handleNodeClick = (id: string) => { setSelectedNodeId(prev => prev === id ? null : id); };

  const sevBg: Record<string, string> = { bad: '#FEF2F2', orange: '#FFF7ED', amber: '#FFFBEB', teal: '#F0FDFA' };
  const sevText: Record<string, string> = { bad: '#DC2626', orange: '#EA580C', amber: '#D97706', teal: '#00A99D' };

  return (
    <div style={{ padding: 20, flex: 1, overflow: 'auto' }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)' }}>Network Intelligence</h2>
        <p style={{ fontSize: 12, color: '#6B7280' }}>Cross-account connection analysis · Fraud ring detection</p>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
        {[
          { label: '3 Active Rings', sub: '18 Accounts Linked · ₦38.1M Total Exposure', color: 'var(--teal)' },
          { label: 'NET-0017 Critical', sub: '7 accounts · ATO + BEC · Same device fingerprint', color: 'var(--bad)' },
          { label: '2 STRs Auto-Drafted', sub: 'Genie AI narrative ready · GoAML filing pending', color: 'var(--good)' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 10, padding: '12px 14px', boxShadow: 'var(--card-shadow)', borderLeft: `4px solid ${s.color}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.label}</div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '65% 35%', gap: 16 }}>
        {/* Left: graph + ring list */}
        <div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: 'var(--card-shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{ring.id} — {ring.label}</span>
                <span style={{ marginLeft: 8, background: SEV_COLORS[ring.severityColor] || '#6B7280', color: '#fff', borderRadius: 4, padding: '1px 7px', fontSize: 10, fontWeight: 700 }}>{ring.severity}</span>
              </div>
              <span style={{ fontSize: 11, color: '#6B7280' }}>{ring.accountCount} accounts · {ring.totalExposure}</span>
            </div>
            <NetworkGraph ring={ring} selectedNode={selectedNodeId} onNodeClick={handleNodeClick} />
            <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
              {Object.entries(NODE_COLORS).map(([type, color]) => (
                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#6B7280' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
                  {type}
                </div>
              ))}
            </div>
          </div>

          {/* Ring list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {NETWORK_RINGS.map(r => (
              <div key={r.id} onClick={() => handleRingClick(r.id)} style={{
                background: '#fff', borderRadius: 10, padding: '12px 14px',
                boxShadow: 'var(--card-shadow)', cursor: 'pointer',
                borderLeft: `4px solid ${SEV_COLORS[r.severityColor] || '#6B7280'}`,
                outline: selectedRingId === r.id ? `2px solid ${SEV_COLORS[r.severityColor]}` : 'none',
                transition: 'box-shadow .15s',
              }}
                onMouseOver={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = 'var(--card-shadow)'; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ background: sevBg[r.severityColor], color: sevText[r.severityColor], borderRadius: 4, padding: '1px 7px', fontSize: 10, fontWeight: 700 }}>{r.id}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--navy)' }}>{r.label}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {r.typologies.map(t => <span key={t} style={{ background: '#F3F4F6', borderRadius: 20, padding: '2px 8px', fontSize: 10 }}>{t}</span>)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: SEV_COLORS[r.severityColor] }}>{r.totalExposure}</div>
                    <div style={{ fontSize: 10, color: '#6B7280' }}>{r.accountCount} accounts</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  {r.genieReady && <span style={{ background: '#F0FDFA', color: 'var(--teal)', borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 600 }}>✓ Genie Ready</span>}
                  {r.strsGenerated > 0 && <span style={{ background: '#DCFCE7', color: 'var(--good)', borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 600 }}>{r.strsGenerated} STR drafted</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: detail panel */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: 'var(--card-shadow)', overflow: 'auto', maxHeight: 'calc(100vh - 200px)', position: 'sticky', top: 20 }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.06em' }}>
            {selectedNode ? 'NODE DETAIL' : 'RING DETAIL'}
          </div>
          {selectedNode
            ? <NodeDetail node={selectedNode} ring={ring} />
            : <RingDetail ring={ring} onInvestigate={() => setView('operational')} />
          }
        </div>
      </div>
    </div>
  );
}
