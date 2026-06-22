import { useState } from 'react';
import React from 'react';

interface Props {
  alertId: string | null;
  onClose: () => void;
  setView: (v: string) => void;
}

type TabKey = 'fraud' | 'aml' | 'timeline' | 'related';

export default function CaseDetailPanel({ alertId, onClose, setView }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('fraud');
  const [note, setNote] = useState('');

  if (!alertId) return null;

  const isPrestige = alertId === 'ALT-9841';

  const header = isPrestige ? {
    caseId: 'CASE-2841', alertId: 'ALT-9841', severity: 'CRITICAL', type: 'BEC / Payment Diversion',
    entity: 'Prestige Foods Ltd · CIF 8841-FBN · FBN Merchant Banking',
    amount: '₦23,000,000', rtse: '0.94', opened: '14 Jun 2026',
    assignee: 'Chukwuemeka A.', status: 'IN PROGRESS', sla: '6h remaining',
  } : {
    caseId: 'CASE-2839', alertId: 'ALT-9837', severity: 'CRITICAL', type: 'Account Takeover / SIM Swap',
    entity: 'Adaeze Okonkwo · CIF 2291-FBN · FirstBank Retail Banking',
    amount: '₦4,800,000', rtse: '0.89', opened: '14 Jun 2026',
    assignee: 'Chukwuemeka A.', status: 'IN PROGRESS', sla: '8h remaining',
  };

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'fraud', label: 'Fraud Details' },
    { key: 'aml', label: 'AML Details' },
    { key: 'timeline', label: 'Timeline & Notes' },
    { key: 'related', label: 'Related Entities' },
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 999 }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '75vw', maxWidth: 960,
        background: '#fff', boxShadow: '-4px 0 32px rgba(0,0,0,0.18)',
        zIndex: 1000, display: 'flex', flexDirection: 'column',
        animation: 'slideIn 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <style>{`
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        `}</style>

        <div style={{ background: 'var(--navy)', padding: '16px 24px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#93C5FD' }}>{header.caseId}</span>
                <span style={{ color: '#475569' }}>|</span>
                <span style={{ fontSize: 12, color: '#93C5FD' }}>{header.alertId}</span>
                <span style={{ background: 'var(--bad)', color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>{header.severity}</span>
                <span style={{ fontSize: 12, color: '#FCD34D', fontWeight: 600 }}>{header.type}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{header.entity}</div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[
                  ['Amount at Risk', header.amount],
                  ['RTSE Score', header.rtse],
                  ['Opened', header.opened],
                  ['Assigned', header.assignee],
                  ['Status', header.status],
                  ['SLA', header.sla],
                ].map(([l, v]) => (
                  <div key={l} style={{ fontSize: 11 }}>
                    <span style={{ color: '#93C5FD' }}>{l}: </span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13 }}>✕ Close</button>
          </div>

          <div style={{ display: 'flex', gap: 2, marginTop: 14 }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                padding: '7px 16px', border: 'none', borderRadius: '6px 6px 0 0',
                background: activeTab === t.key ? '#fff' : 'transparent',
                color: activeTab === t.key ? 'var(--navy)' : '#93C5FD',
                fontSize: 12, fontWeight: activeTab === t.key ? 700 : 400, cursor: 'pointer',
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {activeTab === 'fraud' && <FraudTab isPrestige={isPrestige} />}
          {activeTab === 'aml' && <AMLTab isPrestige={isPrestige} />}
          {activeTab === 'timeline' && <TimelineTab isPrestige={isPrestige} note={note} setNote={setNote} />}
          {activeTab === 'related' && <RelatedTab isPrestige={isPrestige} setView={setView} onClose={onClose} />}
        </div>

        <div style={{ padding: '14px 24px', borderTop: '1px solid #E5E7EB', display: 'flex', gap: 10, flexShrink: 0, background: '#F9FAFB' }}>
          <button style={{ flex: 1, background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Review Genie AI Draft</button>
          <button style={{ flex: 1, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>File STR via GoAML</button>
          <button style={{ flex: 1, background: 'var(--amber)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{isPrestige ? 'Escalate to Supervisor' : 'Notify Customer'}</button>
          <button onClick={onClose} style={{ flex: 1, background: '#94A3B8', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Close Alert</button>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid #F3F4F6' }}>{title}</div>
      {children}
    </div>
  );
}

function InfoRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 6, fontSize: 12 }}>
      <span style={{ color: '#6B7280', width: 200, flexShrink: 0 }}>{label}</span>
      <span style={{ color: valueColor || '#374151', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function FraudTab({ isPrestige }: { isPrestige: boolean }) {
  const prestigeTimeline = [
    { date: '8 Jun 2026', score: '0.61', event: 'Baseline drift begins — minor' },
    { date: '11 Jun 2026', score: '0.74', event: 'Velocity increase — new beneficiary added' },
    { date: '15 Jun 2026', score: '0.83', event: 'Email domain lookalike detected by EFM' },
    { date: '18 Jun 2026', score: '0.94', event: 'RTSE ML Alert triggered — transfer blocked' },
  ];
  const adaezeTimeline = [
    { event: 'SIM swap detected', score: '0.71', signal: 'TrustArmour trigger' },
    { event: 'New device login', score: '0.84', signal: 'Device mismatch' },
    { event: 'First-time beneficiary + full balance transfer', score: '0.89', signal: 'RTSE ML alert' },
  ];
  const actions = isPrestige ? [
    'Block outward transfer (already done by RTSE)',
    'Freeze CIF 8841 pending investigation',
    'Contact Prestige Foods relationship manager to verify authorisation',
    'Preserve SWIFT message evidence',
    'Refer to Network Analytics for ring context',
  ] : [
    'Block transfer (already done)',
    'Freeze account CIF 2291 pending customer verification',
    'Contact Adaeze Okonkwo via alternate KYC contact (not mobile — SIM compromised)',
    'Notify MTN Nigeria fraud team re: high-risk agent at Surulere',
    'Flag beneficiary account at Access Bank via NIP fraud alert',
    'Reset mobile banking credentials after identity re-verification',
  ];

  return (
    <div>
      <Section title="INCIDENT SUMMARY">
        <p style={{ fontSize: 13, lineHeight: 1.7, color: '#374151' }}>
          {isPrestige
            ? 'Prestige Foods Ltd (importer, registered Lagos) initiated a ₦23M outward SWIFT transfer to a beneficiary account at GTB Lagos on 14 Jun 2026. RTSE ML scoring engine flagged anomaly score 0.94 after 11 days of gradual drift (Day 1: 0.61 → Day 11: 0.94). No existing rule triggered at any point. The beneficiary account was newly added 3 days prior. The company email used to authorise the transfer was a lookalike domain (presti9efoods.com vs. prestigefoods.com) — BEC indicator.'
            : "Adaeze Okonkwo, a FirstBank retail customer (salary account), experienced a SIM swap on 14 Jun 2026 at 02:17 via an MTN Nigeria channel. Within 22 minutes of the SIM swap, a ₦4.8M transfer was initiated via Mobile Banking to a previously unknown account. TrustArmour device intelligence flagged the new SIM's first login as anomalous — different device fingerprint from 90-day baseline. RTSE scored 0.89. The transfer was blocked."}
        </p>
        <div style={{ marginTop: 8, fontSize: 12 }}>
          <strong>Fraud Typology: </strong>
          <span style={{ color: 'var(--bad)' }}>{isPrestige ? 'Business Email Compromise (BEC) · Payment Diversion' : 'Account Takeover (ATO) via SIM Swap · Unauthorised Fund Transfer'}</span>
        </div>
      </Section>

      {isPrestige ? (
        <Section title="RTSE ANOMALY TIMELINE">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead><tr style={{ borderBottom: '2px solid #E5E7EB' }}>
              {['Date','Score','Event'].map(h => <th key={h} style={{ textAlign: 'left', padding: '6px 8px', color: '#6B7280', fontWeight: 600 }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {prestigeTimeline.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F3F4F6', background: i % 2 ? '#F9FAFB' : '#fff' }}>
                  <td style={{ padding: '6px 8px', color: '#6B7280' }}>{r.date}</td>
                  <td style={{ padding: '6px 8px', fontWeight: 700, color: parseFloat(r.score) >= 0.85 ? 'var(--bad)' : 'var(--amber)' }}>{r.score}</td>
                  <td style={{ padding: '6px 8px' }}>{r.event}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      ) : (
        <Section title="RTSE SCORE PROGRESSION">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead><tr style={{ borderBottom: '2px solid #E5E7EB' }}>
              {['Event','Score','Signal'].map(h => <th key={h} style={{ textAlign: 'left', padding: '6px 8px', color: '#6B7280', fontWeight: 600 }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {adaezeTimeline.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F3F4F6', background: i % 2 ? '#F9FAFB' : '#fff' }}>
                  <td style={{ padding: '6px 8px' }}>{r.event}</td>
                  <td style={{ padding: '6px 8px', fontWeight: 700, color: parseFloat(r.score) >= 0.85 ? 'var(--bad)' : 'var(--amber)' }}>{r.score}</td>
                  <td style={{ padding: '6px 8px', color: '#6B7280' }}>{r.signal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      <Section title="TRANSACTION DETAILS">
        {isPrestige ? (<>
          <InfoRow label="Transaction Ref" value="TXN-FBN-2026-0041882" />
          <InfoRow label="From" value="Prestige Foods Ltd · CIF 8841 · FBN Merchant Bank · Acc 0023441782" />
          <InfoRow label="To" value="GTB Lagos · Acc 0187234401 (beneficiary added 11 Jun 2026)" />
          <InfoRow label="Amount" value="₦23,000,000" valueColor="var(--bad)" />
          <InfoRow label="Channel" value="SWIFT / Corporate Internet Banking" />
          <InfoRow label="Email domain" value="presti9efoods.com (lookalike — flagged)" valueColor="var(--bad)" />
          <InfoRow label="Transfer status" value="BLOCKED by RTSE" valueColor="var(--good)" />
        </>) : (<>
          <InfoRow label="Transaction Ref" value="TXN-FBN-2026-0041799" />
          <InfoRow label="From" value="Adaeze Okonkwo · CIF 2291 · Acc 3304412280" />
          <InfoRow label="To" value="Unknown payee · Access Bank · Acc 0091234560 (first-time)" />
          <InfoRow label="Amount" value="₦4,800,000" valueColor="var(--bad)" />
          <InfoRow label="Channel" value="FirstBank Mobile App" />
          <InfoRow label="Auth method" value="OTP to new SIM (post-swap) — fraudulently passed" valueColor="var(--bad)" />
          <InfoRow label="Transfer status" value="BLOCKED by TrustArmour + RTSE" valueColor="var(--good)" />
          <div style={{ marginTop: 10, padding: 12, background: '#FEF3C7', borderRadius: 8, fontSize: 12 }}>
            <strong>SIM Swap Details:</strong> MTN swap at 02:17 · Surulere agent (flagged high-risk) · First login 02:39 (22 min post-swap) · TrustArmour: device fingerprint mismatch
          </div>
        </>)}
      </Section>

      <Section title="DEVICE X — CONVERGENCE FLAG">
        <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 8, padding: 12, fontSize: 12 }}>
          <div style={{ fontWeight: 700, color: '#7C3AED', marginBottom: 4 }}>Device X · FP-D-4471</div>
          <div style={{ color: '#374151' }}>Same device fingerprint used for {isPrestige ? "Prestige Foods SWIFT initiation and Adaeze Okonkwo's SIM swap ATO" : "this SIM swap ATO and Prestige Foods Ltd's SWIFT BEC initiation (CIF 8841)"}. Cross-segment convergence flag. Part of NET-0017 ring.</div>
        </div>
      </Section>

      <Section title="RECOMMENDED ACTIONS">
        {actions.map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12 }}>
            <input type="checkbox" style={{ marginTop: 1, cursor: 'pointer' }} />
            <span style={{ color: '#374151' }}>{a}</span>
          </div>
        ))}
      </Section>
    </div>
  );
}

function AMLTab({ isPrestige }: { isPrestige: boolean }) {
  return (
    <div>
      <Section title="AML ASSESSMENT">
        <p style={{ fontSize: 13, lineHeight: 1.7, color: '#374151' }}>
          {isPrestige
            ? 'The ₦23M SWIFT transfer exhibits structuring characteristics consistent with a potential money laundering scheme. The BEC mechanism may have been used to divert legitimate business payments into a controlled account for layering. Cross-reference with NET-0017 ring indicates coordinated movement across multiple accounts.'
            : 'While primarily a fraud case, the immediate post-SIM-swap transfer to a first-time beneficiary with full account balance is consistent with mule account layering. The shared Device X fingerprint with the Prestige Foods BEC case suggests this may be part of a coordinated criminal operation rather than an opportunistic SIM swap.'}
        </p>
        <div style={{ marginTop: 8, fontSize: 12 }}>
          <strong>AML Typology: </strong>
          <span style={{ color: 'var(--navy)' }}>{isPrestige ? 'Trade-Based Money Laundering (TBML) · Layering via Corporate Account' : 'Proceeds of Fraud · Potential Mule Account Funding · Network Layering'}</span>
        </div>
      </Section>

      <Section title="CBN REGULATORY FLAGS">
        {isPrestige ? (<>
          <InfoRow label="STR Requirement" value="YES — MANDATORY" valueColor="var(--bad)" />
          <InfoRow label="AML Risk Rating" value="HIGH (82/100 per FBN AML risk matrix)" valueColor="var(--orange)" />
          <InfoRow label="EDD Triggered" value="YES — Beneficial ownership, source of funds, PEP/sanctions re-run" />
          <InfoRow label="NFIU Deadline" value="20 Jun 2026 09:42 (24h from detection)" valueColor="var(--bad)" />
          <InfoRow label="GoAML Status" value="Draft pending review" valueColor="var(--amber)" />
        </>) : (<>
          <InfoRow label="STR Requirement" value="YES — RECOMMENDED" valueColor="var(--amber)" />
          <InfoRow label="AML Risk Rating" value="HIGH (74/100)" valueColor="var(--orange)" />
          <InfoRow label="EDD Required" value="NO — but flag for next KYC review cycle" />
          <InfoRow label="NIBSS Fraud Alert" value="Mandatory — notify Access Bank" valueColor="var(--bad)" />
          <InfoRow label="CBN Notification" value="Customer notification within 24h required" />
        </>)}
      </Section>

      <Section title="STR / GENIE AI">
        <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12 }}>
            <div style={{ fontWeight: 700, color: 'var(--good)' }}>Genie AI Draft Ready</div>
            <div style={{ color: '#6B7280', marginTop: 2 }}>STR narrative generated — review before GoAML submission</div>
          </div>
          <button style={{ background: 'var(--teal)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Review Genie Draft</button>
        </div>
      </Section>
    </div>
  );
}

function TimelineTab({ isPrestige, note, setNote }: { isPrestige: boolean; note: string; setNote: (n: string) => void }) {
  const prestigeEvents = [
    { time: '19 Jun 09:43', event: 'ALT-9841 created · Assigned to Chukwuemeka A.' },
    { time: '19 Jun 09:42', event: 'RTSE ML Alert triggered · Score 0.94 · Transfer blocked' },
    { time: '18 Jun 16:20', event: 'EFM rule: lookalike email domain flagged (presti9efoods.com)' },
    { time: '15 Jun 11:05', event: 'RTSE score 0.83 · Shadow alert (not escalated)' },
    { time: '11 Jun 09:30', event: 'New beneficiary account added to Prestige Foods profile' },
    { time: '8 Jun 14:00', event: 'RTSE anomaly drift begins · Score 0.61' },
  ];
  const adaezeEvents = [
    { time: '19 Jun 09:42', event: 'Prestige Foods BEC confirmed — ring escalated to CRITICAL' },
    { time: '14 Jun 10:00', event: 'NET-0017 ring created linking both cases' },
    { time: '14 Jun 09:15', event: 'TrustArmour confirms Device X (D-4471) match with Prestige Foods case' },
    { time: '14 Jun 02:42', event: 'ALT-9837 created · Assigned to Chukwuemeka A.' },
    { time: '14 Jun 02:41', event: 'RTSE score 0.89 · Transfer blocked' },
    { time: '14 Jun 02:41', event: 'Transfer initiated: ₦4.8M to Access Bank Acc 0091234560' },
    { time: '14 Jun 02:39', event: 'First login on new device · TrustArmour flag triggered' },
    { time: '14 Jun 02:17', event: 'SIM swap executed via MTN Surulere agent' },
  ];
  const events = isPrestige ? prestigeEvents : adaezeEvents;
  return (
    <div>
      <Section title="EVENT TIMELINE">
        {events.map((e, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #F3F4F6', fontSize: 12 }}>
            <div style={{ color: '#9CA3AF', whiteSpace: 'nowrap', width: 120, flexShrink: 0 }}>{e.time}</div>
            <div style={{ color: '#374151' }}>{e.event}</div>
          </div>
        ))}
      </Section>
      <Section title="CASE NOTES">
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Add case note..."
          style={{ width: '100%', minHeight: 80, padding: 10, borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12, fontFamily: 'inherit', resize: 'vertical' }}
        />
        <button style={{ marginTop: 8, background: 'var(--navy)', color: '#fff', border: 'none', padding: '7px 16px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Save Note</button>
      </Section>
    </div>
  );
}

function RelatedTab({ isPrestige, setView, onClose }: { isPrestige: boolean; setView: (v: string) => void; onClose: () => void }) {
  const rows = isPrestige ? [
    { entity: 'Adaeze Okonkwo', ref: 'CIF 2291-FBN', rel: 'Device X match (D-4471)', risk: 'CRITICAL' },
    { entity: 'Mule Acct A', ref: 'CIF 3341-FBN', rel: 'Transfer recipient', risk: 'HIGH' },
    { entity: 'GTB Beneficiary', ref: 'External', rel: 'Payment destination', risk: 'HIGH' },
    { entity: 'Staging Wallet', ref: 'Firstmonie', rel: 'Layering hop', risk: 'MEDIUM' },
  ] : [
    { entity: 'Prestige Foods Ltd', ref: 'CIF 8841', rel: 'Device X match (D-4471)', risk: 'CRITICAL' },
    { entity: 'Access Bank Beneficiary', ref: 'External', rel: 'Transfer destination', risk: 'HIGH' },
    { entity: 'MTN Agent · Surulere', ref: 'External', rel: 'SIM swap enabler', risk: 'HIGH' },
    { entity: 'NET-0017 Ring', ref: 'Network', rel: 'Part of coordinated ring', risk: 'CRITICAL' },
  ];
  const riskColor = (r: string) => r === 'CRITICAL' ? 'var(--bad)' : r === 'HIGH' ? 'var(--orange)' : 'var(--amber)';
  return (
    <div>
      <Section title="RELATED ENTITIES">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead><tr style={{ borderBottom: '2px solid #E5E7EB' }}>
            {['Entity','CIF / Ref','Relationship','Risk'].map(h => <th key={h} style={{ textAlign: 'left', padding: '6px 8px', color: '#6B7280', fontWeight: 600 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F3F4F6', background: i % 2 ? '#F9FAFB' : '#fff' }}>
                <td style={{ padding: '8px', fontWeight: 600 }}>{r.entity}</td>
                <td style={{ padding: '8px', color: '#6B7280' }}>{r.ref}</td>
                <td style={{ padding: '8px' }}>{r.rel}</td>
                <td style={{ padding: '8px' }}><span style={{ fontSize: 10, background: riskColor(r.risk) + '20', color: riskColor(r.risk), borderRadius: 4, padding: '2px 8px', fontWeight: 700 }}>{r.risk}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
      <button onClick={() => { setView('network'); onClose(); }} style={{ background: 'var(--teal)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
        Open in Network Intelligence →
      </button>
    </div>
  );
}
