import { useState } from 'react';

const NAVY = '#1A3A6B';
const TEAL = '#00A99D';
const P_VISHING = '#D94F3D';
const P_ATO = '#E07B2A';
const P_UPI = '#1754A7';
const P_MULE = '#6B4FA8';
const P_GREEN = '#56B686';

// ─── Sub-tab bar ─────────────────────────────────────────────────────────────

const STEPS = [
  { n: 1, label: 'Input Cohort' },
  { n: 2, label: 'Data Fetch & Features' },
  { n: 3, label: 'Pattern Clustering' },
  { n: 4, label: 'Pattern Deep-Dive' },
  { n: 5, label: 'Recommendations' },
  { n: 6, label: 'Outcome & Actions' },
];

function StepBar({ active, setStep }: { active: number; setStep: (n: number) => void }) {
  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: '12px 16px', marginBottom: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {STEPS.map(s => {
          const isDone = s.n < active;
          const isActive = s.n === active;
          return (
            <button key={s.n} onClick={() => setStep(s.n)} style={{
              fontFamily: 'monospace', fontSize: 11, padding: '5px 14px', borderRadius: 20,
              cursor: 'pointer', border: isActive ? 'none' : isDone ? 'none' : '1px solid #D1D5DB',
              background: isActive ? NAVY : isDone ? P_GREEN : 'transparent',
              color: isActive || isDone ? '#fff' : '#6B7280',
              fontWeight: isActive ? 700 : 400, transition: 'all .15s',
            }}>
              {isDone && !isActive ? '✓ ' : ''}{s.n} · {s.label}
            </button>
          );
        })}
      </div>
      <div style={{ height: 3, background: '#E2E8F0', borderRadius: 2, marginTop: 10, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: NAVY, borderRadius: 2, width: `${(active / 6) * 100}%`, transition: 'width .4s ease' }} />
      </div>
    </div>
  );
}

function AgentBar({ status, text }: { status: 'triggered' | 'processing' | 'complete'; text: string }) {
  const colors: Record<string, string> = { triggered: TEAL, processing: P_ATO, complete: P_GREEN };
  const labels: Record<string, string> = { triggered: 'AGENT TRIGGERED', processing: 'PROCESSING', complete: 'COMPLETE' };
  const c = colors[status];
  return (
    <div style={{ borderLeft: `4px solid ${c}`, background: '#F8FAFC', borderRadius: '0 8px 8px 0', padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block', marginTop: 3, flexShrink: 0, animation: status !== 'complete' ? 'pulse 2s infinite' : undefined }} />
      <div>
        <span style={{ fontSize: 10, fontWeight: 700, color: c, letterSpacing: '.06em', marginRight: 8 }}>{labels[status]}</span>
        <span style={{ fontSize: 12, color: '#374151' }}>{text}</span>
      </div>
    </div>
  );
}

// ─── Step 1 ──────────────────────────────────────────────────────────────────

const SOURCE_COLORS: Record<string, { bg: string; color: string }> = {
  'Call Centre': { bg: '#FEF2F2', color: '#B91C1C' },
  'Dispute Mgmt': { bg: '#F5F3FF', color: '#6D28D9' },
  'Branch': { bg: '#F0FDFA', color: '#0F766E' },
  'Online Portal': { bg: '#F0FDF4', color: '#15803D' },
};

const COHORT_ROWS = [
  { cif: 'CIF-908410', name: 'Emeka Okafor',      source: 'Call Centre',  type: 'Unauthorised transfer',      loss: '₦140,000', date: '14 Jan 2026' },
  { cif: 'CIF-772341', name: 'Fatima Bello',       source: 'Call Centre',  type: 'OTP fraud',                  loss: '₦85,000',  date: '16 Jan 2026' },
  { cif: 'CIF-334892', name: 'Chinedu Eze',        source: 'Dispute Mgmt', type: 'Unknown debit',              loss: '₦210,000', date: '18 Jan 2026' },
  { cif: 'CIF-561204', name: 'Adaeze Nwosu',       source: 'Call Centre',  type: 'USSD unauthorised transfer', loss: '₦55,000',  date: '22 Jan 2026' },
  { cif: 'CIF-419087', name: 'Babatunde Adeyemi',  source: 'Dispute Mgmt', type: 'Account takeover',           loss: '₦320,000', date: '28 Jan 2026' },
  { cif: 'CIF-203456', name: 'Ngozi Okonkwo',      source: 'Branch',       type: 'Fraudulent NIP transfer',    loss: '₦175,000', date: '02 Feb 2026' },
  { cif: 'CIF-687234', name: 'Segun Adeleke',      source: 'Call Centre',  type: 'Vishing / callback fraud',   loss: '₦95,000',  date: '05 Feb 2026' },
  { cif: 'CIF-112890', name: 'Amaka Obi',          source: 'Online Portal',type: 'New payee + transfer',       loss: '₦125,000', date: '08 Feb 2026' },
  { cif: 'CIF-445678', name: 'Ibrahim Musa',       source: 'Call Centre',  type: 'SIM swap + transfer',        loss: '₦68,000',  date: '11 Feb 2026' },
  { cif: 'CIF-789012', name: 'Kemi Afolabi',       source: 'Dispute Mgmt', type: 'Mule account abuse',         loss: '₦450,000', date: '15 Feb 2026' },
];

function Step1({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <div style={{ marginBottom: 4, fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.08em' }}>STEP 1 OF 6 — INPUT</div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: NAVY, marginBottom: 4 }}>Complaint Cohort Received</h2>
      <p style={{ fontSize: 13, color: '#4B5563', marginBottom: 16 }}>
        A batch of 34 customers has been submitted for pattern analysis — sourced from the Call Centre escalation queue and the Dispute Management team.
      </p>
      <AgentBar status="triggered" text="Cohort batch received from Call Centre (22 customers) and Dispute Management (12 customers). Period: 01-Jan-2026 to 31-Mar-2026. Cohort reference: CFPA-2026-Q1-034" />
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Source', value: 'Call Centre Escalations + Dispute Management' },
          { label: 'Period', value: 'Q1 2026 (90 days)' },
          { label: 'Cohort size', value: '34 customers' },
          { label: 'Total exposure', value: '₦24.3 Million' },
        ].map(c => (
          <div key={c.label} style={{ background: '#F3F4F6', borderRadius: 8, padding: '6px 14px', fontSize: 12 }}>
            <span style={{ color: '#9CA3AF', fontWeight: 600 }}>{c.label}: </span>
            <span style={{ color: NAVY, fontWeight: 700 }}>{c.value}</span>
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E5E7EB' }}>
              {['Customer ID', 'Name', 'Source', 'Complaint Type', 'Reported Loss', 'Date Reported'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: '#9CA3AF', fontWeight: 600, fontSize: 10 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COHORT_ROWS.map((r, i) => {
              const sc = SOURCE_COLORS[r.source] || { bg: '#F3F4F6', color: '#374151' };
              return (
                <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '9px 14px', color: '#6B7280', fontFamily: 'monospace', fontSize: 11 }}>{r.cif}</td>
                  <td style={{ padding: '9px 14px', fontWeight: 600, color: NAVY }}>{r.name}</td>
                  <td style={{ padding: '9px 14px' }}>
                    <span style={{ background: sc.bg, color: sc.color, borderRadius: 10, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>{r.source}</span>
                  </td>
                  <td style={{ padding: '9px 14px', color: '#374151' }}>{r.type}</td>
                  <td style={{ padding: '9px 14px', fontWeight: 600, color: '#DC2626' }}>{r.loss}</td>
                  <td style={{ padding: '9px 14px', color: '#6B7280' }}>{r.date}</td>
                </tr>
              );
            })}
            <tr style={{ background: '#F8FAFC' }}>
              <td colSpan={6} style={{ padding: '10px 14px', fontSize: 11, color: '#6B7280', fontStyle: 'italic' }}>
                + 24 more customers in cohort (not shown)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <NavRow onNext={onNext} disablePrev />
    </div>
  );
}

// ─── Step 2 ──────────────────────────────────────────────────────────────────

function FeatureBar({ label, pct, value }: { label: string; pct: number; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7, fontSize: 11 }}>
      <span style={{ flex: 1, color: '#374151' }}>{label}</span>
      <div style={{ width: 80, height: 4, background: '#E2E8F0', borderRadius: 2, flexShrink: 0 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: NAVY, borderRadius: 2 }} />
      </div>
      <span style={{ width: 52, textAlign: 'right', color: '#6B7280', fontWeight: 600 }}>{value}</span>
    </div>
  );
}

const FEATURE_PROFILES = [
  {
    name: 'Emeka Okafor', cif: 'CIF-908410', risk: 'High', riskColor: '#DC2626',
    features: [
      { label: 'Pre-fraud mobile logins (7d)', pct: 80, value: '8' },
      { label: 'New beneficiaries added', pct: 60, value: '3' },
      { label: 'Txn to new payee ratio', pct: 90, value: '91%' },
      { label: 'Time: payee add → NIP transfer', pct: 30, value: '4 min' },
      { label: 'BVN mismatch flag prior 48h', pct: 100, value: 'Yes' },
    ],
  },
  {
    name: 'Fatima Bello', cif: 'CIF-772341', risk: 'High', riskColor: '#DC2626',
    features: [
      { label: 'Pre-fraud mobile logins (7d)', pct: 70, value: '7' },
      { label: 'New beneficiaries added', pct: 40, value: '2' },
      { label: 'Txn to new payee ratio', pct: 100, value: '100%' },
      { label: 'Time: payee add → transfer', pct: 20, value: '2 min' },
      { label: 'Outbound call before txn', pct: 100, value: 'Yes' },
    ],
  },
  {
    name: 'Kemi Afolabi', cif: 'CIF-789012', risk: 'Medium', riskColor: '#D97706',
    features: [
      { label: 'Login from new device', pct: 100, value: 'Yes' },
      { label: 'Login IP location mismatch', pct: 100, value: 'Yes' },
      { label: 'Password reset before txn', pct: 100, value: 'Yes' },
      { label: 'Time: login → transfer', pct: 15, value: '1.5 min' },
      { label: 'Transfer amount vs 90d avg', pct: 95, value: '18× avg' },
    ],
  },
  {
    name: 'Adaeze Nwosu', cif: 'CIF-561204', risk: 'Medium', riskColor: '#D97706',
    features: [
      { label: 'USSD code change (pre-fraud)', pct: 100, value: 'Yes' },
      { label: 'Txn count in 1hr window', pct: 85, value: '5 txns' },
      { label: 'Avg USSD txn amount (7d)', pct: 70, value: '₦11,000' },
      { label: 'Beneficiary known before', pct: 0, value: 'No' },
      { label: 'Time: USSD change → transfer', pct: 25, value: '6 min' },
    ],
  },
];

function Step2({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <div>
      <div style={{ marginBottom: 4, fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.08em' }}>STEP 2 OF 6 — DATA FETCH & FEATURES</div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: NAVY, marginBottom: 16 }}>Fetching Data & Building Behavioural Profiles</h2>
      <AgentBar status="processing" text="Fetching data for 34 entities across 5 data sources. Computing 18 behavioural features per customer." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
        <div style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', marginBottom: 10 }}>DATA SOURCES</div>
          {[
            ['Transaction history', 'FT_AccountTxnEvent · 90 days'],
            ['Alert & case history', 'cl5_icms_alert · all statuses'],
            ['Non-financial events', 'NFT_IBLogin · NFT_IBPayeeReg'],
            ['Customer & account master', 'DDA · BVN · CRC risk score · KYC'],
            ['Clari5 EFM behavioural profile', 'Cumulative debit/credit · CTR'],
          ].map(([name, sub]) => (
            <div key={name} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 11 }}>
              <span style={{ color: P_GREEN, flexShrink: 0 }}>✓</span>
              <div>
                <div style={{ fontWeight: 600, color: NAVY }}>{name}</div>
                <div style={{ color: '#6B7280', fontSize: 10 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', marginBottom: 10 }}>FEATURE COMPUTATION</div>
          {[
            ['Transaction velocity features', 'Txn count, avg amt, peak hour'],
            ['Channel behaviour features', 'Mobile / USSD / ATM / Branch mix'],
            ['Pre-fraud event sequence', 'Login anomalies, payee adds, USSD resets'],
            ['Money flow structure', 'New vs known beneficiaries, NIP layering'],
            ['Alert trigger history', 'Scenarios fired vs missed'],
          ].map(([name, sub]) => (
            <div key={name} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 11 }}>
              <span style={{ color: P_GREEN, flexShrink: 0 }}>✓</span>
              <div>
                <div style={{ fontWeight: 600, color: NAVY }}>{name}</div>
                <div style={{ color: '#6B7280', fontSize: 10 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', marginBottom: 10 }}>FEATURE SUMMARY</div>
          {[
            ['Features per customer', '18'],
            ['Transaction events fetched', '12,840'],
            ['Non-financial events', '3,204'],
            ['Alert records pulled', '97'],
            ['Scenarios evaluated', '34'],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
              <span style={{ color: '#6B7280' }}>{label}</span>
              <span style={{ fontWeight: 700, color: NAVY }}>{val}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
            <span style={{ color: '#6B7280' }}>Profiles built</span>
            <span style={{ fontWeight: 700, color: P_GREEN }}>34 / 34</span>
          </div>
        </div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', marginBottom: 10 }}>SAMPLE FEATURE PROFILES</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {FEATURE_PROFILES.map(p => (
          <div key={p.cif} style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 700, color: NAVY, fontSize: 13 }}>{p.name}</div>
                <div style={{ fontSize: 10, color: '#6B7280', fontFamily: 'monospace' }}>{p.cif}</div>
              </div>
              <span style={{ background: p.riskColor + '20', color: p.riskColor, borderRadius: 10, padding: '2px 10px', fontSize: 10, fontWeight: 700 }}>{p.risk}</span>
            </div>
            {p.features.map(f => <FeatureBar key={f.label} {...f} />)}
          </div>
        ))}
      </div>
      <NavRow onPrev={onPrev} onNext={onNext} />
    </div>
  );
}

// ─── Step 3 ──────────────────────────────────────────────────────────────────

const PATTERNS = [
  {
    name: 'Vishing-Induced Transfer', pct: 38, count: 13, color: P_VISHING,
    desc: 'Customer receives a call from a fraudster posing as FBN staff or CBN officer. During the call, they are guided to add a new payee and initiate a NIP transfer. The entire sequence — call, payee registration, transfer — completes within minutes. Amounts and accounts differ across all 13 cases; the manipulation sequence is identical.',
    cifs: ['CIF-908410', 'CIF-772341', 'CIF-687234', 'CIF-203456', '+9 more'],
  },
  {
    name: 'Account Takeover (ATO)', pct: 26, count: 9, color: P_ATO,
    desc: 'Login from a new device or unrecognised IP, immediately followed by password or MPIN change, then a high-value NIP transfer within 1–2 minutes. Account drained before the customer is aware. Device, IP, and destination accounts vary across all 9 cases; the login-to-drain sequence is structurally identical.',
    cifs: ['CIF-419087', 'CIF-789012', 'CIF-112890', '+6 more'],
  },
  {
    name: 'USSD Code Intercept', pct: 24, count: 8, color: P_UPI,
    desc: 'A USSD code reset or mobile banking re-registration is performed — often triggered by a fake tech support call — and followed within minutes by rapid small-value NIP transfers to multiple new beneficiaries. The structuring behaviour is consistent across all 8 cases, though account numbers and amounts differ.',
    cifs: ['CIF-561204', 'CIF-445678', '+6 more'],
  },
  {
    name: 'Mule Account Channelling', pct: 12, count: 4, color: P_MULE,
    desc: 'Customer accounts are being used as intermediate hops in a layering chain — receiving funds from suspicious sources and immediately forwarding to unknown destinations via NIP/NIBSS. These customers may or may not be willing participants. The transit-and-forward structure is consistent across all 4 cases.',
    cifs: ['CIF-334892', 'CIF-789012', '+2 more'],
  },
];

function DonutChart() {
  const cx = 80, cy = 80, r = 55, sw = 22;
  const circ = 2 * Math.PI * r;
  const segments = [
    { pct: 0.38, color: P_VISHING },
    { pct: 0.26, color: P_ATO },
    { pct: 0.24, color: P_UPI },
    { pct: 0.12, color: P_MULE },
  ];
  let offset = 0;
  return (
    <svg width={160} height={160} viewBox="0 0 160 160">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E5E7EB" strokeWidth={sw} />
      {segments.map((s, i) => {
        const dash = s.pct * circ;
        const gap = circ - dash;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth={sw}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset + circ * 0.25}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '80px 80px' }}
          />
        );
        offset += dash;
        return el;
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize={22} fontWeight="700" fill={NAVY}>34</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize={10} fill="#6B7280">customers</text>
    </svg>
  );
}

function Step3({ onPrev, onNext, onSelectPattern }: { onPrev: () => void; onNext: () => void; onSelectPattern: (i: number) => void }) {
  return (
    <div>
      <div style={{ marginBottom: 4, fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.08em' }}>STEP 3 OF 6 — PATTERN CLUSTERING</div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: NAVY, marginBottom: 16 }}>Fraud Pattern Distribution Identified</h2>
      <AgentBar status="complete" text="34 customers clustered into 4 fraud patterns." />
      <div style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', gap: 24, alignItems: 'center' }}>
        <DonutChart />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PATTERNS.map(p => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: p.color, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ color: '#374151' }}>{p.name}</span>
              <span style={{ fontWeight: 700, color: NAVY, marginLeft: 4 }}>{p.pct}%</span>
              <span style={{ color: '#6B7280' }}>({p.count})</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {PATTERNS.map((p, i) => (
          <div key={p.name} onClick={() => { onSelectPattern(i); onNext(); }} style={{
            background: '#fff', borderRadius: 10, padding: '14px 16px',
            borderLeft: `4px solid ${p.color}`, boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            cursor: 'pointer', transition: 'box-shadow .15s',
          }}
            onMouseOver={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; }}
            onMouseOut={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)'; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: p.color }}>{p.name}</div>
              <span style={{ fontSize: 22, fontWeight: 800, color: p.color }}>{p.pct}%</span>
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 8 }}>{p.count} customers</div>
            <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, marginBottom: 10 }}>{p.desc}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {p.cifs.map(c => (
                <span key={c} style={{ background: p.color + '15', color: p.color, borderRadius: 10, padding: '2px 8px', fontSize: 10, fontWeight: 600 }}>{c}</span>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 10, color: p.color, fontWeight: 600 }}>Click to deep-dive →</div>
          </div>
        ))}
      </div>
      <NavRow onPrev={onPrev} onNext={onNext} />
    </div>
  );
}

// ─── Step 4 ──────────────────────────────────────────────────────────────────

function Step4({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  const seqSteps = [
    { n: 1, label: 'Inbound Call', sub: 'Fraudster poses as FBN staff / CBN officer' },
    { n: 2, label: 'Mobile Banking Login', sub: 'Customer logs in during call' },
    { n: 3, label: 'New Payee Registered', sub: '1–3 new NIP beneficiaries added' },
    { n: 4, label: 'NIP Transfer Initiated', sub: 'High-value transfer within 2–8 min of payee add' },
    { n: 5, label: 'Funds Moved', sub: 'Transferred to mule accounts via NIBSS; call ends' },
  ];
  return (
    <div>
      <div style={{ marginBottom: 4, fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.08em' }}>STEP 4 OF 6 — PATTERN DEEP-DIVE</div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: NAVY, marginBottom: 4 }}>Dominant Pattern: Vishing-Induced Transfer</h2>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {[
          { label: 'Pattern', val: 'Vishing-Induced Transfer', color: P_VISHING },
          { label: 'Affected', val: '13 customers', color: NAVY },
          { label: 'Total exposure', val: '₦9.8 Million', color: '#DC2626' },
          { label: 'Avg time to drain', val: '6.2 minutes', color: P_ATO },
          { label: 'Scenario coverage', val: 'PARTIAL', color: '#DC2626' },
        ].map(c => (
          <div key={c.label} style={{ background: '#F8FAFC', borderRadius: 8, padding: '5px 12px', fontSize: 11 }}>
            <span style={{ color: '#9CA3AF' }}>{c.label}: </span>
            <span style={{ fontWeight: 700, color: c.color }}>{c.val}</span>
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', marginBottom: 14 }}>COMMON FRAUD SEQUENCE</div>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {seqSteps.map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: P_VISHING, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{s.n}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginTop: 8, textAlign: 'center' }}>{s.label}</div>
                <div style={{ fontSize: 10, color: '#6B7280', textAlign: 'center', marginTop: 3, lineHeight: 1.4 }}>{s.sub}</div>
              </div>
              {i < seqSteps.length - 1 && <div style={{ height: 2, background: '#D1D5DB', flex: 0.3, marginTop: 13 }} />}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Median time: payee add → transfer', val: '4.1 minutes', color: '#374151' },
          { label: '% transfers to first-time NIP payees', val: '94%', color: '#374151' },
          { label: 'Existing scenario coverage', val: 'Partial — 7 of 13 caught', color: '#DC2626' },
          { label: 'Avg transaction amount', val: '₦141,500', color: '#374151' },
          { label: 'All occurred between', val: '10:00 AM – 2:00 PM', color: '#374151' },
          { label: 'Detection gap', val: 'Time threshold too loose', color: '#DC2626' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 10, padding: '12px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>
      <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '14px 18px', marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#DC2626', marginBottom: 6 }}>⚠ DETECTION GAP — IB_NEWPAYEE_HIVAL_TRF</div>
        <div style={{ fontSize: 12, color: '#7F1D1D', lineHeight: 1.7 }}>
          The existing scenario <strong>IB_NEWPAYEE_HIVAL_TRF</strong> has a condition: time between new NIP payee registration and transfer ≤ 30 minutes.
          For 6 of the 13 cases, the gap was 32–41 minutes — fraudsters are deliberately waiting just past the threshold.
          The scenario caught 7 cases, missed 6. Tightening the threshold to ≤ 45 minutes AND adding a supporting condition on the transfer amount being{' '}
          <code style={{ background: '#FECACA', padding: '1px 5px', borderRadius: 3 }}>&gt; 3× the 30-day average</code> would have caught all 13 cases.
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 10, padding: '12px 16px', borderLeft: `4px solid ${P_ATO}`, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: P_ATO }}>Account Takeover (ATO)</span>
          <span style={{ fontSize: 10, color: '#6B7280' }}>2nd Largest · 26%</span>
        </div>
        <div style={{ fontSize: 11, color: '#374151' }}>Key sequence: New device → MPIN reset → NIP drain</div>
        <div style={{ fontSize: 11, color: '#374151', marginTop: 4 }}>Median time to drain: <strong>1.8 minutes</strong></div>
        <div style={{ fontSize: 11, color: '#D97706', marginTop: 4, fontWeight: 600 }}>Scenario gap: IP location change not in condition</div>
      </div>
      <NavRow onPrev={onPrev} onNext={onNext} />
    </div>
  );
}

// ─── Step 5 ──────────────────────────────────────────────────────────────────

const RECS = [
  {
    n: 1, title: 'Tighten time window on IB_NEWPAYEE_HIVAL_TRF',
    desc: 'Current threshold: new NIP payee → transfer ≤ 30 min. 6 of 13 vishing cases fell between 32–41 min. Proposed fix: extend to ≤ 45 min AND add condition transfer_amount > 3× avg_30d_debit. This modification would retrospectively cover all 13 vishing cases.',
    tags: ['Scenario: IB_NEWPAYEE_HIVAL_TRF', 'Threshold change'],
    action: '→ Send to Scenario Builder', actionColor: P_GREEN,
  },
  {
    n: 2, title: 'New scenario: Login new device + MPIN change + NIP transfer within 3 min',
    desc: 'All 9 ATO cases share this exact sequence. No existing scenario covers the combination of device change AND MPIN reset AND immediate high-value NIP transfer as a single correlated rule. SECs: NFT_IBLoginEvent + NFT_IBMPINChangeEvent + FT_NIPTxnEvent.',
    tags: ['New scenario', 'Workspace: Customer', '3 SECs required'],
    action: '→ Send to Scenario Builder', actionColor: P_GREEN,
  },
  {
    n: 3, title: 'Add USSD code change as mandatory pre-condition in USSD structuring scenario',
    desc: 'Current USSD structuring scenario monitors velocity and value only. It does not condition on a prior USSD re-registration or code change. All 8 USSD intercept cases had a code change or re-registration within 10 minutes of the first fraudulent transaction. Adding NFT_USSDCodeChangeEvent as a pre-condition would sharply reduce false positives while catching the fraud pattern.',
    tags: ['Scenario: USSD_STRUCT_RAPID', 'Add UDV: code change in 10 min'],
    action: '→ Send to Scenario Builder', actionColor: P_GREEN,
  },
  {
    n: 4, title: 'Flag 4 mule-pattern accounts for entity tagging and CBN reporting',
    desc: 'CIF-334892, CIF-789012, and 2 others show consistent transit-and-forward behaviour across NIBSS channels. Tag as Close Monitoring in CMS. Review mule channelling scenario threshold — current 3-hop threshold may be too conservative. Note: under CBN AML/CFT Regulations, these accounts may require STR filing.',
    tags: ['Entity Tagging: 4 accounts', 'Tag: Close Monitoring', 'STR review required'],
    action: '→ Tag entities in CMS', actionColor: P_UPI,
  },
  {
    n: 5, title: 'Operational — All 4 patterns cluster between 10:00 AM – 2:00 PM weekdays',
    desc: '29 of 34 cases occurred in the same time window. This aligns with active hours of known Lagos-based fraud rings operating phone-based social engineering. Additional investigator capacity during this window would improve detection response time. Relevant for shift planning and CBN fraud reporting cadence.',
    tags: ['Operational insight', 'Time window: 10 AM – 2 PM', 'Lagos fraud ring profile'],
    action: '→ Share with AI Briefing', actionColor: '#6B7280',
  },
];

function Step5({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <div>
      <div style={{ marginBottom: 4, fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.08em' }}>STEP 5 OF 6 — RECOMMENDATIONS</div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: NAVY, marginBottom: 16 }}>Corrections & Detection Improvements</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {RECS.map(r => (
          <div key={r.n} style={{ background: '#fff', borderRadius: 10, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', gap: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: NAVY, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{r.n}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 6 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: '#374151', marginBottom: 10, lineHeight: 1.6 }}>{r.desc}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {r.tags.map(t => (
                  <span key={t} style={{ background: '#F3F4F6', color: '#374151', borderRadius: 10, padding: '2px 10px', fontSize: 10 }}>{t}</span>
                ))}
                <span style={{ background: r.actionColor + '15', color: r.actionColor, borderRadius: 10, padding: '2px 10px', fontSize: 10, fontWeight: 700 }}>{r.action}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <NavRow onPrev={onPrev} onNext={onNext} />
    </div>
  );
}

// ─── Step 6 ──────────────────────────────────────────────────────────────────

function Step6({ onPrev, onReset }: { onPrev: () => void; onReset: () => void }) {
  return (
    <div>
      <div style={{ marginBottom: 4, fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.08em' }}>STEP 6 OF 6 — OUTCOME & ACTIONS</div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: NAVY, marginBottom: 16 }}>Analysis Complete</h2>
      <div style={{ background: 'linear-gradient(135deg, #EFF6FF, #fff)', border: `1px solid ${NAVY}30`, borderRadius: 12, padding: '18px 22px', marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: NAVY, marginBottom: 4 }}>Cohort CFPA-2026-Q1-034 — Analysis Summary</div>
        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 14 }}>34 customers · Q1 2026 · Call Centre + Dispute Management · Total exposure ₦24.3 Million</div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            { val: '4', label: 'Distinct fraud patterns' },
            { val: '38%', label: 'Largest pattern (Vishing)' },
            { val: '3', label: 'Scenario fixes identified' },
            { val: '1', label: 'New scenario required' },
            { val: '4', label: 'Accounts to tag immediately' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: NAVY }}>{s.val}</div>
              <div style={{ fontSize: 10, color: '#6B7280' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', fontSize: 13, color: '#374151', lineHeight: 1.8 }}>
        Of the 34 confirmed frauds in this cohort, 21 were caught by existing Clari5 EFM scenarios — but 13 slipped through.
        The slippage was not random. It was systematic: all 6 missed vishing cases were within 6–15 minutes of the NIP payee threshold.
        All 9 ATO cases used a device + MPIN combination that no single scenario captured. The fraud ring adapted to the rule boundaries.
        The 3 scenario modifications and 1 new scenario proposed here, if implemented, would retrospectively cover all 34 cases and prospectively detect this fraud pattern going forward — directly addressing the detection gap ahead of FBN's CBN FRAML compliance deadline.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 16 }}>
        {[
          { icon: '🔧', title: 'Send 3 Fixes to Scenario Builder', desc: 'AG-09 builds the scenario modifications and routes for approval.', btnLabel: 'Send to AG-09', btnBg: NAVY, btnColor: '#fff' },
          { icon: '🏷️', title: 'Tag 4 Mule Accounts', desc: 'Tag CIF-334892, CIF-789012 and 2 others as Close Monitoring in CMS.', btnLabel: 'Open Entity Tagging', btnBg: 'transparent', btnColor: NAVY },
          { icon: '📋', title: 'Export Full Report', desc: 'Download the complete cohort analysis report for CPO review or audit file.', btnLabel: 'Download Report', btnBg: 'transparent', btnColor: NAVY },
        ].map(a => (
          <div key={a.title} style={{ background: '#fff', borderRadius: 12, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{a.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 6 }}>{a.title}</div>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 12, lineHeight: 1.5 }}>{a.desc}</div>
            <button style={{ background: a.btnBg, color: a.btnColor, border: `1px solid ${NAVY}`, borderRadius: 8, padding: '8px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', width: '100%' }}>
              {a.btnLabel}
            </button>
          </div>
        ))}
      </div>
      <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '14px 18px', marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: P_GREEN, marginBottom: 6 }}>✓ Human Gate — Awaiting Review</div>
        <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.7 }}>
          This analysis has been delivered to the fraud head and risk team for review. No scenario changes, entity tags,
          or rule deployments have been made. All actions above require human approval before execution.
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onPrev} style={{ background: 'transparent', color: '#6B7280', border: '1px solid #D1D5DB', borderRadius: 8, padding: '9px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>← Back</button>
        <button onClick={onReset} style={{ background: NAVY, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>↺ Run New Cohort</button>
      </div>
    </div>
  );
}

// ─── Nav row ──────────────────────────────────────────────────────────────────

function NavRow({ onPrev, onNext, disablePrev }: { onPrev?: () => void; onNext?: () => void; disablePrev?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
      <button onClick={onPrev} disabled={disablePrev} style={{
        background: 'transparent', color: disablePrev ? '#D1D5DB' : '#6B7280',
        border: '1px solid #D1D5DB', borderRadius: 8, padding: '9px 18px',
        fontSize: 12, fontWeight: 600, cursor: disablePrev ? 'default' : 'pointer',
      }}>← Previous</button>
      {onNext && (
        <button onClick={onNext} style={{ background: NAVY, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          {disablePrev ? 'Begin Data Fetch →' : 'Next →'}
        </button>
      )}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function CohortAnalyser() {
  const [step, setStep] = useState(1);
  const [_selectedPattern, setSelectedPattern] = useState(0);

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 24, background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 12 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: NAVY, marginBottom: 2 }}>Cohort Fraud Pattern Analyser</h1>
          <p style={{ fontSize: 12, color: '#6B7280' }}>AI-powered cohort analysis · Pattern clustering · Scenario correction</p>
        </div>
        <StepBar active={step} setStep={setStep} />
        <div style={{ marginTop: 20, background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          {step === 1 && <Step1 onNext={() => setStep(2)} />}
          {step === 2 && <Step2 onPrev={() => setStep(1)} onNext={() => setStep(3)} />}
          {step === 3 && <Step3 onPrev={() => setStep(2)} onNext={() => setStep(4)} onSelectPattern={setSelectedPattern} />}
          {step === 4 && <Step4 onPrev={() => setStep(3)} onNext={() => setStep(5)} />}
          {step === 5 && <Step5 onPrev={() => setStep(4)} onNext={() => setStep(6)} />}
          {step === 6 && <Step6 onPrev={() => setStep(5)} onReset={() => setStep(1)} />}
        </div>
      </div>
    </div>
  );
}
