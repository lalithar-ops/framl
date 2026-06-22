import { useState } from 'react';
import {
  AIRA_LAST_RUN,
  EMERGING_THREATS,
  RULE_PROPOSALS,
  GAP_ANALYSIS,
  REGULATORY_SOURCES,
  REGULATORY_PULSE,
} from '../../data/airaData';

type RuleStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
interface RuleEntry {
  id: string;
  type: 'HARD_STOP' | 'COMBINATION' | 'EMERGING';
  name: string;
  confidence: 'HIGH' | 'MEDIUM';
  conditions: { signal: string; operator: string; value: string }[];
  action: string;
  rationale: string;
  status: RuleStatus;
}

const NAVY = '#1A3A6B';
const TEAL = '#00A99D';

// ─── Coverage / risk badge helpers ───────────────────────────────────────────

function CoverageBadge({ coverage }: { coverage: 'PARTIAL' | 'NOT_COVERED' | 'COVERED' }) {
  const map = {
    PARTIAL: { bg: '#FFFBEB', color: '#D97706', label: '⚠ PARTIAL' },
    NOT_COVERED: { bg: '#FEF2F2', color: '#DC2626', label: '✗ NOT COVERED' },
    COVERED: { bg: '#F0FDF4', color: '#059669', label: '✓ COVERED' },
  };
  const s = map[coverage];
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 10, padding: '2px 10px', fontSize: 10, fontWeight: 700 }}>
      {s.label}
    </span>
  );
}

function RiskBadge({ risk }: { risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' }) {
  const map = {
    CRITICAL: { bg: '#FEF2F2', color: '#DC2626' },
    HIGH: { bg: '#FFFBEB', color: '#D97706' },
    MEDIUM: { bg: '#F0FDFA', color: '#0F766E' },
  };
  const s = map[risk];
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 10, padding: '2px 10px', fontSize: 10, fontWeight: 700 }}>
      {risk}
    </span>
  );
}

// ─── Agent processing strip ───────────────────────────────────────────────────

const AGENT_STEPS = [
  'Step 1: Sweeping CBN circulars and NFIU advisories...',
  'Step 2: Scanning FBN internal alert patterns (last 30 days)...',
  'Step 3: Running gap analysis against 47 active scenarios...',
  'Step 4: Generating rule proposals...',
];

function AgentStrip({ visibleSteps, complete }: { visibleSteps: number; complete: boolean }) {
  return (
    <div style={{ background: '#0F2347', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontFamily: 'monospace', fontSize: 11 }}>
      {AGENT_STEPS.slice(0, visibleSteps).map((s, i) => (
        <div key={i} style={{ color: '#93C5FD', marginBottom: 4 }}>
          <span style={{ color: TEAL }}>●</span> {s}
        </div>
      ))}
      {complete && (
        <div style={{ color: '#34D399', fontWeight: 700, marginTop: 4 }}>
          ✓ COMPLETE — 3 emerging threats · 4 rule proposals · 2 critical gaps
        </div>
      )}
    </div>
  );
}

// ─── TAB 1 — Intelligence Brief ───────────────────────────────────────────────

function ThreatCard({ threat }: { threat: typeof EMERGING_THREATS[0] }) {
  const isHigh = threat.severity === 'HIGH';
  const borderColor = isHigh ? '#DC2626' : '#D97706';
  const badgeBg = isHigh ? '#DC2626' : '#D97706';
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '16px 20px', marginBottom: 12,
      borderLeft: `4px solid ${borderColor}`, boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ background: badgeBg, color: '#fff', borderRadius: 6, padding: '2px 10px', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
            {threat.severity}
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{threat.name}</span>
        </div>
        <CoverageBadge coverage={threat.coverage} />
      </div>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 10, fontSize: 11, color: '#6B7280' }}>
        <span><strong style={{ color: '#374151' }}>Geography:</strong> {threat.geography}</span>
        <span><strong style={{ color: '#374151' }}>Source:</strong> {threat.source}</span>
        <span><strong style={{ color: '#374151' }}>Ref:</strong> <code style={{ fontFamily: 'monospace', color: NAVY, fontSize: 10 }}>{threat.ref}</code></span>
      </div>
      <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.7, margin: '0 0 10px' }}>{threat.description}</p>
      <div style={{ fontSize: 11, color: '#6B7280' }}>
        <strong>FBN Scenario Coverage:</strong>{' '}
        <CoverageBadge coverage={threat.coverage} />
        <span style={{ marginLeft: 8 }}>— {threat.coverageNote}</span>
      </div>
    </div>
  );
}

function RegulatoryPulseStrip() {
  const [tooltip, setTooltip] = useState<string | null>(null);
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', marginBottom: 12 }}>REGULATORY PULSE</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {REGULATORY_PULSE.map(grp => (
          <div key={grp.group}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.06em', marginBottom: 8, borderBottom: '1px solid #F3F4F6', paddingBottom: 4 }}>
              {grp.group.toUpperCase()}
            </div>
            {grp.items.map(item => (
              <div
                key={item.ref}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 8, cursor: 'pointer', position: 'relative' }}
                onMouseEnter={() => setTooltip(item.ref)}
                onMouseLeave={() => setTooltip(null)}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: item.fresh ? '#34D399' : '#D1D5DB', display: 'inline-block', marginTop: 3, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: NAVY, fontFamily: 'monospace' }}>{item.ref}</div>
                  <div style={{ fontSize: 10, color: '#6B7280' }}>{item.desc}</div>
                </div>
                {tooltip === item.ref && (
                  <div style={{
                    position: 'absolute', top: -8, left: '100%', marginLeft: 8, zIndex: 10,
                    background: NAVY, color: '#fff', borderRadius: 6, padding: '6px 10px',
                    fontSize: 10, whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}>
                    {item.fresh ? '● New — reviewed this run' : '● Previously reviewed'} · {item.ref}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function IntelligenceBrief({ agentRunning, agentSteps, agentComplete }: {
  agentRunning: boolean; agentSteps: number; agentComplete: boolean;
}) {
  return (
    <div>
      {agentRunning && <AgentStrip visibleSteps={agentSteps} complete={agentComplete} />}
      {agentComplete && (
        <>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', marginBottom: 10 }}>EMERGING THREATS · {EMERGING_THREATS.length} IDENTIFIED</div>
          {EMERGING_THREATS.map(t => <ThreatCard key={t.id} threat={t} />)}
          <RegulatoryPulseStrip />
        </>
      )}
      {!agentRunning && !agentComplete && (
        <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 40, textAlign: 'center', color: '#6B7280', border: '2px dashed #E2E8F0' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: NAVY, marginBottom: 6 }}>Run AIRA to generate Intelligence Brief</div>
          <div style={{ fontSize: 12 }}>Click "Run Agent Now" above to sweep CBN, NFIU, EFCC and NIBSS sources</div>
        </div>
      )}
    </div>
  );
}

// ─── TAB 2 — Rule Proposals ───────────────────────────────────────────────────

function RuleCard({ rule, onApprove, onReject }: {
  rule: RuleEntry;
  onApprove: () => void;
  onReject: () => void;
}) {
  const typeMap = {
    HARD_STOP: { color: '#DC2626', label: 'HARD STOP' },
    COMBINATION: { color: '#D97706', label: 'COMBINATION' },
    EMERGING: { color: TEAL, label: 'EMERGING' },
  };
  const confMap = {
    HIGH: { bg: '#F0FDF4', color: '#059669' },
    MEDIUM: { bg: '#FFFBEB', color: '#D97706' },
  };
  const tm = typeMap[rule.type];
  const cm = confMap[rule.confidence];

  if (rule.status === 'APPROVED') {
    return (
      <div style={{ background: '#F0FDF4', borderRadius: 12, padding: '14px 18px', marginBottom: 12, borderLeft: `4px solid #059669`, border: '1px solid #BBF7D0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>✓</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>{rule.id}: {rule.name}</div>
            <div style={{ fontSize: 11, color: '#15803D' }}>Approved — imported to Scenario Builder</div>
          </div>
        </div>
      </div>
    );
  }

  if (rule.status === 'REJECTED') {
    return (
      <div style={{ background: '#F9FAFB', borderRadius: 12, padding: '14px 18px', marginBottom: 12, borderLeft: `4px solid #9CA3AF`, opacity: 0.6 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', textDecoration: 'line-through' }}>{rule.id}: {rule.name}</div>
        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Rejected</div>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '16px 18px', marginBottom: 12, borderLeft: `4px solid ${tm.color}`, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ background: tm.color, color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: 9, fontWeight: 700, fontFamily: 'monospace', letterSpacing: '.06em' }}>
          {tm.label}
        </span>
        <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{rule.id}: {rule.name}</span>
        <span style={{ marginLeft: 'auto', background: cm.bg, color: cm.color, borderRadius: 10, padding: '2px 10px', fontSize: 10, fontWeight: 700 }}>
          {rule.confidence}
        </span>
      </div>
      <div style={{ overflowX: 'auto', marginBottom: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E5E7EB' }}>
              {['Signal', 'Operator', 'Value'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '7px 12px', color: '#9CA3AF', fontWeight: 600, fontSize: 10, fontFamily: 'monospace' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rule.conditions.map((c, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '7px 12px', fontFamily: 'monospace', color: NAVY, fontSize: 11 }}>{c.signal}</td>
                <td style={{ padding: '7px 12px', fontFamily: 'monospace', color: '#6B7280', fontSize: 11 }}>{c.operator}</td>
                <td style={{ padding: '7px 12px', fontFamily: 'monospace', color: '#374151', fontSize: 11, fontWeight: 600 }}>{c.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ background: '#F8FAFC', borderRadius: 6, padding: '8px 12px', marginBottom: 12, fontSize: 11, color: '#4B5563', fontStyle: 'italic', lineHeight: 1.6 }}>
        <strong style={{ fontStyle: 'normal', color: '#374151' }}>Action:</strong>{' '}
        <code style={{ fontFamily: 'monospace', background: '#E5E7EB', padding: '1px 6px', borderRadius: 3, fontSize: 10, fontStyle: 'normal' }}>{rule.action}</code>
      </div>
      <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.7, marginBottom: 14, fontStyle: 'italic' }}>{rule.rationale}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onApprove} style={{ background: NAVY, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
          ✓ Approve & Import
        </button>
        <button style={{ background: 'transparent', color: NAVY, border: `1px solid ${NAVY}`, borderRadius: 8, padding: '7px 16px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
          ✎ Modify
        </button>
        <button onClick={onReject} style={{ background: 'transparent', color: '#DC2626', border: '1px solid #DC2626', borderRadius: 8, padding: '7px 16px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
          ✗ Reject
        </button>
      </div>
    </div>
  );
}

function RuleProposals({ rules, onApprove, onReject }: {
  rules: RuleEntry[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const pending = rules.filter(r => r.status === 'PENDING').length;
  const approved = rules.filter(r => r.status === 'APPROVED').length;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: '#6B7280' }}>
          <strong style={{ color: NAVY }}>{rules.length}</strong> rule proposals generated ·{' '}
          <strong style={{ color: '#059669' }}>{approved}</strong> approved ·{' '}
          <strong style={{ color: '#D97706' }}>{pending}</strong> pending review
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <button style={{ background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 11, cursor: 'pointer', marginRight: 6 }}>Filter: All ▾</button>
          <button style={{ background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 11, cursor: 'pointer' }}>Sort: Severity ▾</button>
        </div>
      </div>
      {rules.map(r => (
        <RuleCard key={r.id} rule={r} onApprove={() => onApprove(r.id)} onReject={() => onReject(r.id)} />
      ))}
    </div>
  );
}

// ─── TAB 3 — Gap Analysis ─────────────────────────────────────────────────────

function GapDonut() {
  const cx = 60, cy = 60, r = 40, sw = 16;
  const circ = 2 * Math.PI * r;
  const segs = [
    { pct: 42 / 47, color: '#059669' },
    { pct: 2 / 47, color: '#D97706' },
    { pct: 3 / 47, color: '#DC2626' },
  ];
  let offset = 0;
  return (
    <svg width={120} height={120} viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E5E7EB" strokeWidth={sw} />
      {segs.map((s, i) => {
        const dash = s.pct * circ;
        const gap = circ - dash;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth={sw}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset + circ * 0.25}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
          />
        );
        offset += dash;
        return el;
      })}
      <text x={cx} y={cx - 5} textAnchor="middle" fontSize={16} fontWeight="700" fill={NAVY}>89%</text>
      <text x={cx} y={cx + 11} textAnchor="middle" fontSize={9} fill="#6B7280">coverage</text>
    </svg>
  );
}

function SourceList() {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', marginTop: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: open ? 12 : 0 }} onClick={() => setOpen(o => !o)}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em' }}>WHAT AIRA IS MONITORING</div>
        <span style={{ color: '#6B7280' }}>{open ? '▾' : '▸'}</span>
      </div>
      {open && REGULATORY_SOURCES.map(grp => (
        <div key={grp.group} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.06em', marginBottom: 8 }}>▾ {grp.group.toUpperCase()}</div>
          {grp.items.map(item => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 7, fontSize: 12 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: item.fresh ? '#34D399' : '#9CA3AF', display: 'inline-block', marginTop: 3, flexShrink: 0 }} />
              <div>
                <span style={{ fontWeight: 700, color: NAVY, cursor: 'pointer' }}>{item.name}</span>
                <span style={{ color: '#6B7280' }}> — {item.detail}</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function GapAnalysis() {
  const riskBorderMap: Record<string, string> = { CRITICAL: '#DC2626', HIGH: '#D97706', MEDIUM: TEAL };
  return (
    <div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 10, flexWrap: 'wrap', fontSize: 12, color: '#6B7280' }}>
            <span><strong style={{ color: NAVY }}>47</strong> active scenarios monitored</span>
            <span>·</span>
            <span><strong style={{ color: '#DC2626' }}>3</strong> critical gaps</span>
            <span>·</span>
            <span><strong style={{ color: '#D97706' }}>2</strong> partial gaps</span>
            <span>·</span>
            <span><strong style={{ color: '#059669' }}>42</strong> fully covered</span>
            <span>·</span>
            <span style={{ color: '#9CA3AF' }}>Last analysed: {AIRA_LAST_RUN}</span>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E5E7EB' }}>
                  {['Gap ID', 'Threat Type', 'CBN / Reg Reference', 'Current Coverage', 'Risk Level', 'Recommended Action'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '9px 12px', color: '#9CA3AF', fontWeight: 600, fontSize: 10 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GAP_ANALYSIS.map(g => (
                  <tr key={g.id} style={{ borderBottom: '1px solid #F3F4F6', borderLeft: `3px solid ${riskBorderMap[g.risk]}` }}>
                    <td style={{ padding: '9px 12px', fontFamily: 'monospace', color: NAVY, fontSize: 10, fontWeight: 700 }}>{g.id}</td>
                    <td style={{ padding: '9px 12px', fontWeight: 600, color: '#374151', fontSize: 11 }}>{g.threat}</td>
                    <td style={{ padding: '9px 12px', fontFamily: 'monospace', color: '#6B7280', fontSize: 10 }}>{g.ref}</td>
                    <td style={{ padding: '9px 12px' }}><CoverageBadge coverage={g.coverage} /></td>
                    <td style={{ padding: '9px 12px' }}><RiskBadge risk={g.risk} /></td>
                    <td style={{ padding: '9px 12px', fontSize: 10, color: TEAL, fontWeight: 600 }}>→ {g.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <GapDonut />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { color: '#059669', label: 'Covered', count: 42 },
              { color: '#D97706', label: 'Partial', count: 2 },
              { color: '#DC2626', label: 'Not Covered', count: 3 },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, display: 'inline-block' }} />
                <span style={{ color: '#374151' }}>{s.label}</span>
                <span style={{ fontWeight: 700, color: NAVY }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SourceList />
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

type InnerTab = 'brief' | 'rules' | 'gaps';

export default function AIRAIntelligence() {
  const [innerTab, setInnerTab] = useState<InnerTab>('brief');
  const [agentRunning, setAgentRunning] = useState(false);
  const [agentSteps, setAgentSteps] = useState(0);
  const [agentComplete, setAgentComplete] = useState(false);
  const [rules, setRules] = useState<RuleEntry[]>(RULE_PROPOSALS.map(r => ({ ...r, status: r.status as RuleStatus })));

  function runAgent() {
    if (agentRunning) return;
    setAgentRunning(true);
    setAgentSteps(0);
    setAgentComplete(false);
    setInnerTab('brief');
    [0, 1, 2, 3].forEach(i => {
      setTimeout(() => {
        setAgentSteps(i + 1);
        if (i === 3) setTimeout(() => setAgentComplete(true), 400);
      }, 600 * (i + 1));
    });
  }

  function approveRule(id: string) {
    setRules(rs => rs.map(r => r.id === id ? { ...r, status: 'APPROVED' as RuleStatus } : r));
  }
  function rejectRule(id: string) {
    setRules(rs => rs.map(r => r.id === id ? { ...r, status: 'REJECTED' as RuleStatus } : r));
  }

  const INNER_TABS: { key: InnerTab; label: string }[] = [
    { key: 'brief', label: 'Intelligence Brief' },
    { key: 'rules', label: 'Rule Proposals' },
    { key: 'gaps', label: 'Gap Analysis' },
  ];

  return (
    <div>
      {/* Header card */}
      <div style={{
        background: 'linear-gradient(135deg, #0F2347, #1A3A6B)',
        borderRadius: 12, padding: '18px 22px', marginBottom: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 2 }}>
              🔍 AIRA — AI Fraud Intelligence Agent
            </div>
            <div style={{ fontSize: 12, color: '#93C5FD', marginBottom: 8 }}>Nigeria Edition · First Bank of Nigeria</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: '#CBD5E1' }}>Last run: {AIRA_LAST_RUN}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: TEAL, display: 'inline-block', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 11, color: TEAL, fontWeight: 700 }}>LIVE</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['CBN', 'NFIU', 'EFCC', 'NIBSS', 'NCC', 'FATF'].map(src => (
                  <span key={src} style={{ background: 'rgba(255,255,255,0.1)', color: '#CBD5E1', borderRadius: 10, padding: '1px 8px', fontSize: 10 }}>{src}</span>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={runAgent}
            disabled={agentRunning && !agentComplete}
            style={{
              background: TEAL, color: '#fff', border: 'none', borderRadius: 8,
              padding: '10px 20px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              flexShrink: 0, opacity: agentRunning && !agentComplete ? 0.6 : 1,
            }}
          >
            {agentRunning && !agentComplete ? '● Running...' : 'Run Agent Now ▶'}
          </button>
        </div>
      </div>

      {/* Inner tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid #E5E7EB', paddingBottom: 0 }}>
        {INNER_TABS.map(t => (
          <button key={t.key} onClick={() => setInnerTab(t.key)} style={{
            background: 'transparent', border: 'none', padding: '8px 16px', fontSize: 12,
            fontWeight: innerTab === t.key ? 700 : 400,
            color: innerTab === t.key ? NAVY : '#6B7280',
            borderBottom: innerTab === t.key ? `2px solid ${NAVY}` : '2px solid transparent',
            cursor: 'pointer', whiteSpace: 'nowrap', marginBottom: -1,
          }}>
            {t.label}
            {t.key === 'rules' && rules.some(r => r.status === 'PENDING') && (
              <span style={{ marginLeft: 6, background: '#D97706', color: '#fff', borderRadius: 10, padding: '1px 6px', fontSize: 9, fontWeight: 700 }}>
                {rules.filter(r => r.status === 'PENDING').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Inner tab content */}
      {innerTab === 'brief' && (
        <IntelligenceBrief agentRunning={agentRunning} agentSteps={agentSteps} agentComplete={agentComplete} />
      )}
      {innerTab === 'rules' && (
        <RuleProposals rules={rules} onApprove={approveRule} onReject={rejectRule} />
      )}
      {innerTab === 'gaps' && <GapAnalysis />}
    </div>
  );
}
