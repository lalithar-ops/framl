import { useState } from 'react';
import {
  AIRA_LAST_RUN,
  EMERGING_THREATS,
  SAT_PROPOSALS,
  GAP_ANALYSIS,
  REGULATORY_SOURCES,
  REGULATORY_PULSE,
  type SATScenarioCard,
  type SATStatus,
} from '../../data/airaData';

const NAVY = '#1A3A6B';
const TEAL = '#00A99D';

// ─── Badge helpers ────────────────────────────────────────────────────────────

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

function PriorityBadge({ priority }: { priority: 'P1' | 'P2' | 'P3' }) {
  const map = {
    P1: { bg: '#DC2626', color: '#fff' },
    P2: { bg: '#D97706', color: '#fff' },
    P3: { bg: TEAL, color: '#fff' },
  };
  const s = map[priority];
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 6, padding: '2px 10px', fontSize: 10, fontWeight: 700 }}>
      {priority}
    </span>
  );
}

// ─── Agent strip ──────────────────────────────────────────────────────────────

const AGENT_STEPS = [
  'Step 1: Sweeping CBN circulars and NFIU advisories...',
  'Step 2: Scanning FBN internal alert patterns (last 30 days)...',
  'Step 3: Running gap analysis against 47 active scenarios...',
  'Step 4: Generating SAT scenario proposals...',
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
          ✓ COMPLETE — 3 emerging threats · 4 SAT proposals · 2 CBN audit gaps · ₦238M+ undetected exposure
        </div>
      )}
    </div>
  );
}

// ─── TAB 1 — Intelligence Brief ───────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{
      fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: '#9CA3AF',
      textTransform: 'uppercase', marginBottom: 5, marginTop: 12,
      borderBottom: '1px solid #F3F4F6', paddingBottom: 4,
    }}>
      {text}
    </div>
  );
}

function ThreatCard({
  threat,
  onReviewProposal,
}: {
  threat: typeof EMERGING_THREATS[0];
  onReviewProposal: () => void;
}) {
  const severityMap: Record<string, { border: string; badge: string }> = {
    CRITICAL: { border: '#DC2626', badge: '#DC2626' },
    HIGH: { border: '#D97706', badge: '#D97706' },
    MEDIUM: { border: TEAL, badge: TEAL },
  };
  const sv = severityMap[threat.severity];

  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '16px 20px', marginBottom: 14,
      borderLeft: `4px solid ${sv.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ background: sv.badge, color: '#fff', borderRadius: 6, padding: '2px 10px', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
          {threat.severity}
        </span>
        <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{threat.name}</span>
      </div>

      {/* What is happening */}
      <SectionLabel text="What is happening" />
      <p style={{ fontSize: 11.5, color: '#374151', lineHeight: 1.75, margin: '0 0 4px', whiteSpace: 'pre-line' }}>
        {threat.whatIsHappening}
      </p>

      {/* Missing scenario */}
      <SectionLabel text="Missing from Clari5 FRAML Suite" />
      <div style={{ background: '#FEF2F2', borderRadius: 8, padding: '10px 14px', fontSize: 11 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
          <span><strong style={{ color: '#374151' }}>Scenario Name:</strong> <span style={{ color: NAVY, fontWeight: 600 }}>{threat.missingScenario.name}</span></span>
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 6 }}>
          <span>
            <strong style={{ color: '#374151' }}>Proposed ID:</strong>{' '}
            <code style={{ fontFamily: 'monospace', color: '#DC2626', fontSize: 10, fontWeight: 700 }}>{threat.missingScenario.proposedId}</code>
          </span>
          <span>
            <strong style={{ color: '#374151' }}>Status:</strong>{' '}
            <span style={{ color: '#DC2626', fontWeight: 700 }}>{threat.missingScenario.status}</span>
          </span>
        </div>
        <div style={{ color: '#6B7280', marginBottom: 5 }}>
          <strong style={{ color: '#374151' }}>Closest existing:</strong> {threat.missingScenario.closestExisting}
        </div>
        <div style={{ color: '#6B7280' }}>
          <strong style={{ color: '#374151' }}>Gap:</strong> {threat.missingScenario.gap}
        </div>
      </div>

      {/* Risk of Inaction */}
      <SectionLabel text="Risk of Inaction" />
      <div style={{ background: '#FFFBEB', borderRadius: 8, padding: '10px 14px', fontSize: 11, color: '#374151', lineHeight: 1.75, whiteSpace: 'pre-line', border: '1px solid #FDE68A' }}>
        {threat.riskOfInaction}
      </div>

      {/* Recommendation */}
      <SectionLabel text="Recommendation" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 11, color: '#374151' }}>→ {threat.recommendation}</span>
        <button
          onClick={onReviewProposal}
          style={{
            background: NAVY, color: '#fff', border: 'none', borderRadius: 6,
            padding: '4px 12px', fontSize: 10, fontWeight: 700, cursor: 'pointer',
          }}
        >
          Review SAT Proposal →
        </button>
      </div>
    </div>
  );
}

function RiskOfInactionBanner({ onReviewProposals }: { onReviewProposals: () => void }) {
  return (
    <div style={{
      border: '1.5px solid #DC2626', borderLeft: '4px solid #DC2626',
      background: '#FEF2F2', borderRadius: 10, padding: '14px 18px',
      marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#DC2626', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>⚠</span> COMBINED RISK OF INACTION
          </div>
          <div style={{ fontSize: 11, color: NAVY, lineHeight: 1.8 }}>
            <strong>3 missing scenarios</strong> · <strong>₦238M+ estimated undetected exposure (next 90 days)</strong>
            <br />
            <strong>2 CBN audit gaps</strong> · <strong>0 scenarios currently covering AI-assisted fraud vectors</strong>
            <br />
            Each day without FBN-FRAUD-091, -094, -097 in the active suite is a documented control failure under{' '}
            <code style={{ fontFamily: 'monospace', fontSize: 10 }}>CBN/FRAML/2026/003</code>.
          </div>
        </div>
        <button
          onClick={onReviewProposals}
          style={{
            background: '#DC2626', color: '#fff', border: 'none', borderRadius: 8,
            padding: '8px 16px', fontSize: 11, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
          }}
        >
          Review SAT Proposals →
        </button>
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

function IntelligenceBrief({
  agentRunning, agentSteps, agentComplete, onReviewProposals,
}: {
  agentRunning: boolean; agentSteps: number; agentComplete: boolean; onReviewProposals: () => void;
}) {
  return (
    <div>
      {agentRunning && <AgentStrip visibleSteps={agentSteps} complete={agentComplete} />}
      {agentComplete && (
        <>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', marginBottom: 10 }}>
            EMERGING THREATS · {EMERGING_THREATS.length} IDENTIFIED
          </div>
          {EMERGING_THREATS.map(t => (
            <ThreatCard key={t.id} threat={t} onReviewProposal={onReviewProposals} />
          ))}
          <RiskOfInactionBanner onReviewProposals={onReviewProposals} />
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

// ─── TAB 2 — SAT Scenario Cards ───────────────────────────────────────────────

const SAT_MODULE_COLORS: Record<string, string> = {
  'Fraud Detection': '#DC2626',
  'AML': '#1D4ED8',
  'FRAML': '#7C3AED',
};

const SAT_WORKFLOW_STEPS: SATStatus[] = ['DRAFT', 'REVIEW', 'UAT', 'ACTIVE'];

function SATWorkflowBar({ status }: { status: SATStatus }) {
  const stepIdx = SAT_WORKFLOW_STEPS.indexOf(status);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 8 }}>
      {SAT_WORKFLOW_STEPS.map((step, i) => (
        <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{
              width: 12, height: 12, borderRadius: '50%',
              background: i <= stepIdx ? NAVY : 'transparent',
              border: `2px solid ${i <= stepIdx ? NAVY : '#D1D5DB'}`,
            }} />
            <span style={{ fontSize: 9, color: i <= stepIdx ? NAVY : '#9CA3AF', fontWeight: i === stepIdx ? 700 : 400, whiteSpace: 'nowrap' }}>
              {step}
            </span>
          </div>
          {i < SAT_WORKFLOW_STEPS.length - 1 && (
            <div style={{ width: 32, height: 1, background: i < stepIdx ? NAVY : '#D1D5DB', margin: '0 4px', marginBottom: 12 }} />
          )}
        </div>
      ))}
    </div>
  );
}

function SATCard({
  card,
  satStatus,
  onOpenInSAT,
  onReject,
}: {
  card: SATScenarioCard;
  satStatus: SATStatus;
  onOpenInSAT: () => void;
  onReject: () => void;
}) {
  const [backtestMsg, setBacktestMsg] = useState<string | null>(null);
  const moduleColor = SAT_MODULE_COLORS[card.satModule] || NAVY;

  if (satStatus === 'REJECTED') {
    return (
      <div style={{ background: '#F9FAFB', borderRadius: 12, padding: '14px 18px', marginBottom: 14, borderLeft: `4px solid #9CA3AF`, opacity: 0.6 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', textDecoration: 'line-through' }}>
          {card.proposedId}: {card.name}
        </div>
        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Rejected</div>
      </div>
    );
  }

  function runBacktest() {
    setBacktestMsg('Backtest running…');
    setTimeout(() => {
      setBacktestMsg('Backtest complete — 187 historical matches, Est. FP rate: 22%');
      setTimeout(() => setBacktestMsg(null), 5000);
    }, 2000);
  }

  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '18px 20px', marginBottom: 16,
      borderLeft: `4px solid ${moduleColor}`, boxShadow: '0 1px 6px rgba(0,0,0,0.09)',
    }}>
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{ background: moduleColor, color: '#fff', borderRadius: 5, padding: '2px 9px', fontSize: 9, fontWeight: 700, letterSpacing: '.07em' }}>
          {card.satModule.toUpperCase()}
        </span>
        <PriorityBadge priority={card.priority} />
        <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{card.proposedId}</span>
        <span style={{ color: '#6B7280', fontSize: 13 }}>·</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{card.name}</span>
        <span style={{
          marginLeft: 'auto', background: '#F0FDF4', color: '#059669',
          borderRadius: 10, padding: '2px 10px', fontSize: 10, fontWeight: 700,
        }}>
          AIRA Confidence: HIGH
        </span>
      </div>

      {/* Meta grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px',
        fontSize: 11, color: '#374151', marginBottom: 14,
        background: '#F8FAFC', borderRadius: 8, padding: '10px 14px',
      }}>
        {[
          ['SAT MODULE', card.satModule],
          ['SCENARIO TYPE', card.scenarioType],
          ['CHANNEL', card.channels.join(' · ')],
          ['SEGMENT', card.segments.join(' · ')],
          ['PRIORITY', card.priorityLabel],
          ['EST. FP RATE', card.estFpRate],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.07em', minWidth: 90, paddingTop: 2 }}>
              {label}
            </span>
            <span style={{ fontWeight: 500, color: NAVY }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Conditions */}
      <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.07em', marginBottom: 6 }}>
        ── SIGNAL CONDITIONS ({card.conditions.logic === 'AND' ? 'ALL must be true' : 'SEQUENTIAL — must occur in order'}) ──
      </div>
      <div style={{ overflowX: 'auto', marginBottom: 14 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ textAlign: 'left', padding: '6px 10px', color: '#9CA3AF', fontSize: 9, fontWeight: 600, fontFamily: 'monospace', letterSpacing: '.05em' }}>
                {card.conditions.logic}
              </th>
              <th style={{ textAlign: 'left', padding: '6px 10px', color: '#9CA3AF', fontSize: 9, fontWeight: 600, fontFamily: 'monospace' }}>SIGNAL</th>
              <th style={{ textAlign: 'left', padding: '6px 10px', color: '#9CA3AF', fontSize: 9, fontWeight: 600, fontFamily: 'monospace' }}>OP</th>
              <th style={{ textAlign: 'left', padding: '6px 10px', color: '#9CA3AF', fontSize: 9, fontWeight: 600, fontFamily: 'monospace' }}>VALUE</th>
            </tr>
          </thead>
          <tbody>
            {card.conditions.rules.map((c, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '6px 10px', fontFamily: 'monospace', color: '#6B7280', fontSize: 10 }}>
                  [{card.conditions.logic}]
                </td>
                <td style={{ padding: '6px 10px', fontFamily: 'monospace', color: NAVY, fontSize: 11, fontWeight: 600 }}>{c.signal}</td>
                <td style={{ padding: '6px 10px', fontFamily: 'monospace', color: '#9CA3AF', fontSize: 11 }}>{c.operator}</td>
                <td style={{ padding: '6px 10px', fontFamily: 'monospace', color: '#374151', fontSize: 11 }}>{c.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.07em', marginBottom: 6 }}>── ACTION ON TRIGGER ──</div>
      <div style={{ background: '#F0FDF4', borderRadius: 8, padding: '10px 14px', marginBottom: 14 }}>
        {card.actions.map((a, i) => (
          <div key={i} style={{ fontSize: 11, color: '#374151', marginBottom: i < card.actions.length - 1 ? 4 : 0 }}>
            <span style={{ color: '#059669', marginRight: 6, fontWeight: 700 }}>{i + 1}.</span>{a}
          </div>
        ))}
      </div>

      {/* Regulatory basis */}
      <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.07em', marginBottom: 6 }}>── REGULATORY BASIS ──</div>
      <div style={{ background: '#EFF6FF', borderRadius: 8, padding: '8px 14px', marginBottom: 14 }}>
        {card.regulatoryBasis.map((r, i) => (
          <div key={i} style={{ fontSize: 11, color: '#374151', fontFamily: 'monospace', marginBottom: i < card.regulatoryBasis.length - 1 ? 4 : 0 }}>{r}</div>
        ))}
        {card.replacesScenario && (
          <div style={{ fontSize: 11, color: '#6B7280', marginTop: 6 }}>
            <strong>Replaces / Upgrades:</strong> {card.replacesScenario}
          </div>
        )}
        {card.gapNote && (
          <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4, fontStyle: 'italic' }}>{card.gapNote}</div>
        )}
      </div>

      {/* Workflow */}
      <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.07em', marginBottom: 8 }}>── SAT WORKFLOW STATUS ──</div>
      <SATWorkflowBar status={satStatus} />

      {/* Backtest toast */}
      {backtestMsg && (
        <div style={{
          background: backtestMsg.startsWith('Backtest complete') ? '#F0FDF4' : '#FFFBEB',
          color: backtestMsg.startsWith('Backtest complete') ? '#059669' : '#D97706',
          borderRadius: 6, padding: '6px 12px', fontSize: 11, fontWeight: 600, marginTop: 10,
        }}>
          {backtestMsg}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
        <button
          onClick={onOpenInSAT}
          style={{ background: NAVY, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
        >
          ▶ Open in SAT
        </button>
        <button
          style={{ background: 'transparent', color: NAVY, border: `1px solid ${NAVY}`, borderRadius: 8, padding: '7px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
        >
          ✎ Edit Conditions
        </button>
        <button
          onClick={runBacktest}
          style={{ background: 'transparent', color: TEAL, border: `1px solid ${TEAL}`, borderRadius: 8, padding: '7px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
        >
          ▷ Run Backtest
        </button>
        <button
          onClick={onReject}
          style={{ background: 'transparent', color: '#DC2626', border: '1px solid #DC2626', borderRadius: 8, padding: '7px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
        >
          ✗ Reject
        </button>
      </div>
    </div>
  );
}

function RuleProposals({
  cardStatuses,
  onOpenInSAT,
  onReject,
}: {
  cardStatuses: Record<string, SATStatus>;
  onOpenInSAT: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const pending = SAT_PROPOSALS.filter(c => cardStatuses[c.proposedId] === 'DRAFT').length;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: '#6B7280' }}>
          <strong style={{ color: NAVY }}>{SAT_PROPOSALS.length}</strong> SAT proposals generated ·{' '}
          <strong style={{ color: '#D97706' }}>{pending}</strong> awaiting review
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <button style={{ background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 11, cursor: 'pointer', marginRight: 6 }}>Filter: All ▾</button>
          <button style={{ background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 11, cursor: 'pointer' }}>Sort: Priority ▾</button>
        </div>
      </div>
      {SAT_PROPOSALS.map(card => (
        <SATCard
          key={card.proposedId}
          card={card}
          satStatus={cardStatuses[card.proposedId]}
          onOpenInSAT={() => onOpenInSAT(card.proposedId)}
          onReject={() => onReject(card.proposedId)}
        />
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

function GapAnalysis({ onJumpToSAT }: { onJumpToSAT: (id: string) => void }) {
  const riskBorderMap: Record<string, string> = { CRITICAL: '#DC2626', HIGH: '#D97706', MEDIUM: TEAL };
  return (
    <div>
      {/* Updated header strip */}
      <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 16px', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: '#6B7280' }}>
          <span><strong style={{ color: NAVY }}>47</strong> active scenarios</span>
          <span>·</span>
          <span><strong style={{ color: '#DC2626' }}>4</strong> missing scenarios</span>
          <span>·</span>
          <span><strong style={{ color: '#D97706' }}>2</strong> partial gaps</span>
          <span>·</span>
          <span><strong style={{ color: '#059669' }}>42</strong> fully covered</span>
          <span>·</span>
          <span><strong style={{ color: '#DC2626' }}>₦238M+</strong> undetected exposure</span>
          <span>·</span>
          <span><strong style={{ color: '#DC2626' }}>2</strong> CBN audit gaps</span>
          <span>·</span>
          <span style={{ color: '#9CA3AF' }}>Last analysed: {AIRA_LAST_RUN}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E5E7EB' }}>
                  {['Gap ID', 'Threat Type', 'CBN / Reg Reference', 'Current Coverage', 'Risk Level', 'Proposed Scenario', 'Recommended Action'].map(h => (
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
                    <td style={{ padding: '9px 12px' }}>
                      {g.proposedScenario !== '—' ? (
                        <button
                          onClick={() => onJumpToSAT(g.proposedScenario)}
                          style={{
                            background: 'transparent', border: 'none', color: '#DC2626',
                            fontFamily: 'monospace', fontSize: 10, fontWeight: 700, cursor: 'pointer',
                            padding: 0, textDecoration: 'underline',
                          }}
                        >
                          {g.proposedScenario}
                        </button>
                      ) : (
                        <span style={{ color: '#9CA3AF', fontSize: 10 }}>—</span>
                      )}
                    </td>
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
              { color: '#DC2626', label: 'Not Covered', count: 4 },
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

  const initialStatuses = Object.fromEntries(SAT_PROPOSALS.map(c => [c.proposedId, 'DRAFT' as SATStatus]));
  const [cardStatuses, setCardStatuses] = useState<Record<string, SATStatus>>(initialStatuses);

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

  function openInSAT(id: string) {
    setCardStatuses(s => ({ ...s, [id]: 'REVIEW' }));
  }
  function rejectCard(id: string) {
    setCardStatuses(s => ({ ...s, [id]: 'REJECTED' }));
  }

  const pendingCount = Object.values(cardStatuses).filter(s => s === 'DRAFT').length;

  const INNER_TABS: { key: InnerTab; label: string }[] = [
    { key: 'brief', label: 'Intelligence Brief' },
    { key: 'rules', label: 'Rule Proposals' },
    { key: 'gaps', label: 'Gap Analysis' },
  ];

  function goToRules() { setInnerTab('rules'); }
  function jumpToSATCard(id: string) {
    setInnerTab('rules');
    setTimeout(() => {
      const el = document.getElementById(`sat-card-${id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  return (
    <div>
      {/* Header */}
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
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: TEAL, display: 'inline-block' }} />
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
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid #E5E7EB' }}>
        {INNER_TABS.map(t => (
          <button key={t.key} onClick={() => setInnerTab(t.key)} style={{
            background: 'transparent', border: 'none', padding: '8px 16px', fontSize: 12,
            fontWeight: innerTab === t.key ? 700 : 400,
            color: innerTab === t.key ? NAVY : '#6B7280',
            borderBottom: innerTab === t.key ? `2px solid ${NAVY}` : '2px solid transparent',
            cursor: 'pointer', whiteSpace: 'nowrap', marginBottom: -1,
          }}>
            {t.label}
            {t.key === 'rules' && pendingCount > 0 && (
              <span style={{ marginLeft: 6, background: '#D97706', color: '#fff', borderRadius: 10, padding: '1px 6px', fontSize: 9, fontWeight: 700 }}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {innerTab === 'brief' && (
        <IntelligenceBrief
          agentRunning={agentRunning}
          agentSteps={agentSteps}
          agentComplete={agentComplete}
          onReviewProposals={goToRules}
        />
      )}
      {innerTab === 'rules' && (
        <RuleProposals
          cardStatuses={cardStatuses}
          onOpenInSAT={openInSAT}
          onReject={rejectCard}
        />
      )}
      {innerTab === 'gaps' && <GapAnalysis onJumpToSAT={jumpToSATCard} />}
    </div>
  );
}
