export const AIRA_LAST_RUN = '19 Jun 2026 · 06:00 WAT';

// ─── Intelligence Brief — Threat Cards ───────────────────────────────────────

export interface ThreatData {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  name: string;
  whatIsHappening: string;
  missingScenario: {
    name: string;
    proposedId: string;
    status: string;
    closestExisting: string;
    gap: string;
  };
  riskOfInaction: string;
  recommendation: string;
  recommendationTab2Id: string;
}

export const EMERGING_THREATS: ThreatData[] = [
  {
    id: 'T-NG-01',
    severity: 'CRITICAL',
    name: 'Account Takeover via SIM Swap + BVN Spoofing Combo',
    whatIsHappening:
      'Fraudsters obtain customer BVN data from dark web brokers (₦500–₦2,000 per record), bribe telecom agents to execute SIM swap, then use the hijacked SIM to receive OTPs and complete NIP/mobile transfers. The full attack cycle takes under 4 hours. FBN logged 187 confirmed SIM swap ATOs in Q1 2026, concentrated in Retail and MSME segments. Average loss per incident: ₦312,000.\nSource: NCC/FRAUD/2026/004 · NFIU/2026/TYP/03',
    missingScenario: {
      name: 'SIM Swap + BVN Mismatch Combo — Hard Stop',
      proposedId: 'FBN-FRAUD-091',
      status: 'NOT IN SUITE',
      closestExisting:
        'SCN-FBN-042 (SIM Swap Alert) — fires on SIM age alone, does not combine BVN mismatch or NIP velocity',
      gap:
        'SCN-FBN-042 generates 340 alerts/month; only 12% are true positives because it lacks the BVN mismatch condition. The combo scenario would raise precision to ~78% based on Q1 2026 cohort data.',
    },
    riskOfInaction:
      'Estimated undetected exposure (Q2 2026): ₦58.4M\nProjected case volume without new scenario: 240 ATOs/quarter\nCBN regulatory exposure: CBN/FRAML/2026/003 requires institutions to demonstrate adaptive scenario coverage for FATF-flagged typologies. Failure to add this scenario creates a documented CBN audit gap.',
    recommendation: 'SAT Proposal FBN-FRAUD-091 (Tab 2, Card 1)',
    recommendationTab2Id: 'FBN-FRAUD-091',
  },
  {
    id: 'T-NG-02',
    severity: 'HIGH',
    name: 'Business Email Compromise — AI Voice Clone Variant',
    whatIsHappening:
      'Fraudsters use publicly available voice cloning tools (ElevenLabs, RVC) to clone the voice of a corporate client\'s CEO or CFO. They call the finance team instructing an urgent SWIFT or NIP transfer to a "pre-approved" beneficiary added 24–72 hours earlier. The clone passes callback verification in 4 of 5 tested cases. 3 FBN corporate clients (Merchant Banking segment) were targeted in Q1 2026; 1 resulted in a ₦47.2M loss (Case CASE-2841, ALT-9841, currently open).\nSource: CBN/RBS/DIR/2026/012 · FinCEN BEC Advisory 2026-03',
    missingScenario: {
      name: 'BEC — New Beneficiary + Out-of-Pattern SWIFT',
      proposedId: 'FBN-FRAUD-094',
      status: 'NOT IN SUITE',
      closestExisting:
        'SCN-FBN-031 (BEC Alert) — triggers on email domain lookalike only; does not factor in beneficiary age, SWIFT amount deviation from 90-day average, or instruction channel (phone/email vs portal)',
      gap:
        'SCN-FBN-031 missed ALT-9841 at instruction stage. The alert fired only after RTSE ML engine scored 0.94 on Day 11 of drift — 9 business days after the fraudulent beneficiary was added. A combined scenario would have flagged this within 2 hours.',
    },
    riskOfInaction:
      'Estimated undetected exposure (next 90 days): ₦180–₦220M (based on 3 incidents × ₦47M avg × growth trajectory)\nReputational risk: Merchant Banking segment, high-value corporate clients — loss of 1 account at this tier costs FBN ₦80–₦120M AUM.\nRegulatory: STR filing obligation under NFIU/2026/STR/11 triggered only after loss; proactive detection avoids post-hoc filing risk.',
    recommendation: 'SAT Proposal FBN-FRAUD-094 (Tab 2, Card 2)',
    recommendationTab2Id: 'FBN-FRAUD-094',
  },
  {
    id: 'T-NG-03',
    severity: 'HIGH',
    name: 'USSD Session Hijack — Firstmonie & *894# Channel',
    whatIsHappening:
      'Fraudsters impersonate Clari5 or FBN USSD technical support, call customers and guide them through a "re-verification" sequence on *894# that re-registers their USSD profile on the fraudster\'s device. Within 3–10 minutes of re-registration, multiple NIP transfers go to new beneficiaries, exhausting the daily limit. Primarily targets low-income retail and rural customers. Average loss: ₦55,000. Predominantly affects customers who also recently received a SIM (< 7 days old) — telecom-fraud convergence.\nSource: NIBSS/IFR/2025/H2 · FBN Internal Fraud Report Q1 2026',
    missingScenario: {
      name: 'USSD Re-registration + Transfer Velocity',
      proposedId: 'FBN-FRAUD-097',
      status: 'NOT IN SUITE',
      closestExisting:
        'SCN-FBN-018 (USSD Velocity) — monitors transfer frequency on USSD channel but does NOT check for profile re-registration event as a precursor signal',
      gap:
        '8 confirmed USSD hijack cases in FBN Q1 2026 — zero were caught by SCN-FBN-018 at detection stage. All 8 were identified only during post-incident reconciliation. Average time-to-detect: 18h. A re-registration trigger would reduce TTD to under 6 minutes.',
    },
    riskOfInaction:
      'Confirmed undetected losses Q1 2026: ₦4.4M (8 cases)\nProjected Q2 2026 without scenario: ₦6–₦9M (growth trend)\nCBN Consumer Protection framework: FBN is liable for USSD fraud losses where detection controls are demonstrably absent. Lack of a re-registration scenario creates direct liability exposure.\nNIBSS reporting: NIBSS/IFR requires member banks to demonstrate corrective action within 90 days of published typology.',
    recommendation: 'SAT Proposal FBN-FRAUD-097 (Tab 2, Card 3)',
    recommendationTab2Id: 'FBN-FRAUD-097',
  },
];

// ─── SAT Scenario Proposals ───────────────────────────────────────────────────

export type SATStatus = 'DRAFT' | 'REVIEW' | 'UAT' | 'ACTIVE' | 'REJECTED';
export type SATModule = 'Fraud Detection' | 'AML' | 'FRAML';
export type SATConditionLogic = 'AND' | 'SEQUENTIAL';

export interface SATCondition {
  signal: string;
  operator: string;
  value: string;
}

export interface SATScenarioCard {
  proposedId: string;
  name: string;
  satModule: SATModule;
  scenarioType: string;
  channels: string[];
  segments: string[];
  priority: 'P1' | 'P2' | 'P3';
  priorityLabel: string;
  estFpRate: string;
  conditions: {
    logic: SATConditionLogic;
    rules: SATCondition[];
  };
  actions: string[];
  regulatoryBasis: string[];
  replacesScenario?: string;
  gapNote?: string;
  status: SATStatus;
}

export const SAT_PROPOSALS: SATScenarioCard[] = [
  {
    proposedId: 'FBN-FRAUD-091',
    name: 'SIM Swap + BVN Mismatch Combo — Hard Stop',
    satModule: 'Fraud Detection',
    scenarioType: 'Combination Rule — Multi-Signal (AND Logic)',
    channels: ['NIP', 'Mobile Banking', 'Internet Banking'],
    segments: ['Retail', 'MSME'],
    priority: 'P1',
    priorityLabel: 'P1 — Hard Stop (blocks transaction, raises alert)',
    estFpRate: '~22%  (current SCN-FBN-042 FP rate: 88%)',
    conditions: {
      logic: 'AND',
      rules: [
        { signal: 'sim_swap_confirmed', operator: '=', value: 'true' },
        { signal: 'sim_age', operator: '<', value: '48 hours' },
        { signal: 'bvn_device_mismatch', operator: '=', value: 'true' },
        { signal: 'nip_transfer_amount', operator: '≥', value: '5× customer_income_band_estimate' },
      ],
    },
    actions: [
      'Hard Stop — block NIP transfer pending review',
      'P1 Alert — Fraud Ops queue (15-min SLA)',
      'Account Freeze — manual review hold',
      'Customer Notification — "Transaction blocked for your security"',
    ],
    regulatoryBasis: [
      'NCC/FRAUD/2026/004 · NFIU/2026/TYP/03 · FATF Digital Identity 2026',
      'FBN Internal: 187 ATO cases Q1 2026 match this pattern',
    ],
    replacesScenario: 'SCN-FBN-042 (SIM Swap Alert — single signal)',
    status: 'DRAFT',
  },
  {
    proposedId: 'FBN-FRAUD-094',
    name: 'BEC — New Beneficiary + Out-of-Pattern SWIFT/NIP',
    satModule: 'Fraud Detection',
    scenarioType: 'Combination Rule — Behavioural + Velocity',
    channels: ['SWIFT', 'NIP', 'Corporate Internet Banking'],
    segments: ['Corporate', 'Merchant Banking'],
    priority: 'P1',
    priorityLabel: 'P1 — Hard Stop + Mandatory Callback Flag',
    estFpRate: '~18%  (current SCN-FBN-031 FP rate: 71%)',
    conditions: {
      logic: 'AND',
      rules: [
        { signal: 'corporate_account', operator: '=', value: 'true' },
        { signal: 'beneficiary_age_days', operator: '<', value: '4 days' },
        { signal: 'transfer_amount', operator: '≥', value: '3× customer_90d_avg_outward' },
        { signal: 'instruction_channel', operator: '=', value: 'email OR phone (not portal)' },
        { signal: 'time_beneficiary_to_txn', operator: '≤', value: '30 minutes' },
      ],
    },
    actions: [
      'Hard Stop — block SWIFT/NIP transfer',
      'P1 Alert — Senior Fraud Analyst queue (immediate SLA)',
      'Mandatory Callback Flag — system forces RM verification call',
      'Supervisor Escalation — auto-notify team lead for amounts ≥ ₦10M',
    ],
    regulatoryBasis: [
      'CBN/RBS/DIR/2026/012 (AI fraud) · FinCEN BEC Advisory 2026-03',
      'FBN Internal: Case CASE-2841 (ALT-9841) — ₦47.2M BEC, Q2 2026',
    ],
    replacesScenario: 'SCN-FBN-031 (BEC — email domain lookalike only)',
    gapNote:
      'SCN-FBN-031 missed CASE-2841 at Day 1; this scenario would have flagged it within 2 hours of beneficiary add.',
    status: 'DRAFT',
  },
  {
    proposedId: 'FBN-FRAUD-097',
    name: 'USSD Re-registration + Transfer Velocity — Alert',
    satModule: 'Fraud Detection',
    scenarioType: 'Sequential Event Rule — Precursor + Velocity',
    channels: ['USSD (*894#)', 'Firstmonie'],
    segments: ['Retail — Mass Market'],
    priority: 'P2',
    priorityLabel: 'P2 — Alert + Step-Up Auth',
    estFpRate: '~31%  (current SCN-FBN-018 detection rate: 0%)',
    conditions: {
      logic: 'SEQUENTIAL',
      rules: [
        { signal: 'ussd_profile_reregistration', operator: '=', value: 'true' },
        { signal: 'time_since_reregistration', operator: '≤', value: '15 minutes' },
        { signal: 'nip_transfer_count_post_rereg', operator: '≥', value: '2 transfers' },
        { signal: 'transfer_to_new_payee_ratio', operator: '≥', value: '75%' },
      ],
    },
    actions: [
      'P2 Alert — Fraud Ops queue (30-min SLA)',
      'Step-Up Authentication — OTP re-challenge before transfer completes',
      'USSD Session Freeze — block further transfers pending verification',
      'Customer Notification — "Unusual activity on your USSD profile"',
    ],
    regulatoryBasis: [
      'NIBSS/IFR/2025/H2 · CBN Consumer Protection Framework 2023',
      'FBN Internal: 8 confirmed USSD hijack cases Q1 2026; 0 detected by existing scenarios',
    ],
    gapNote:
      'New scenario — no existing coverage. Closest: SCN-FBN-018 (USSD Velocity — misses re-registration precursor, hence 0% detection).',
    status: 'DRAFT',
  },
  {
    proposedId: 'FBN-FRAUD-099',
    name: 'Crypto P2P Off-Ramp — Structuring Pattern',
    satModule: 'FRAML',
    scenarioType: 'Pattern Rule — Structuring Detection',
    channels: ['NIP', 'Corporate Internet Banking', 'USSD'],
    segments: ['All segments'],
    priority: 'P2',
    priorityLabel: 'P2 — AML Review Queue + SAR Candidate Flag',
    estFpRate: '~27%  (no existing scenario — new coverage area)',
    conditions: {
      logic: 'AND',
      rules: [
        { signal: 'counterparty_type', operator: '=', value: 'crypto_p2p_exchange OR fintech_wallet' },
        { signal: 'nip_transaction_count', operator: '≥', value: '5 within 24 hours' },
        { signal: 'avg_transaction_amount', operator: 'between', value: '₦50,000 and ₦499,999' },
        { signal: 'unique_counterparty_count', operator: '≥', value: '4 distinct accounts' },
        { signal: 'cumulative_daily_amount', operator: '≥', value: '₦1,500,000' },
      ],
    },
    actions: [
      'P2 AML Alert — Compliance queue (4-hour SLA)',
      'SAR Candidate Flag — case marked for potential STR to NFIU via GoAML',
      'Enhanced Due Diligence prompt — system requests RM to update CDD',
    ],
    regulatoryBasis: [
      'CBN/AML/2026/008 · EFCC Q2 2026 Bulletin · FATF Typology 2026',
      'NFIU GoAML threshold: transactions structured below ₦500K to avoid CBN reporting threshold of ₦5M per transaction',
    ],
    gapNote:
      'New scenario — no existing coverage. FATF and EFCC both identify crypto P2P structuring as dominant ML proceeds mechanism in Nigeria post-2025.',
    status: 'DRAFT',
  },
];

export const GAP_ANALYSIS = [
  {
    id: 'GAP-NG-01',
    threat: 'SIM Swap + BVN Combo ATO',
    ref: 'NCC/FRAUD/2026/004',
    coverage: 'PARTIAL' as const,
    risk: 'CRITICAL' as const,
    recommendation: 'HS-NG-01',
    proposedScenario: 'FBN-FRAUD-091',
  },
  {
    id: 'GAP-NG-02',
    threat: 'USSD Session Hijack',
    ref: 'NIBSS/IFR/2025/H2',
    coverage: 'NOT_COVERED' as const,
    risk: 'CRITICAL' as const,
    recommendation: 'COMBO-NG-04',
    proposedScenario: 'FBN-FRAUD-097',
  },
  {
    id: 'GAP-NG-03',
    threat: 'AI Voice Clone / BEC',
    ref: 'CBN/RBS/DIR/2026/012',
    coverage: 'PARTIAL' as const,
    risk: 'HIGH' as const,
    recommendation: 'COMBO-NG-07',
    proposedScenario: 'FBN-FRAUD-094',
  },
  {
    id: 'GAP-NG-04',
    threat: 'Crypto P2P Layering',
    ref: 'CBN/AML/2026/008',
    coverage: 'NOT_COVERED' as const,
    risk: 'HIGH' as const,
    recommendation: 'EMERGING-NG-02',
    proposedScenario: 'FBN-FRAUD-099',
  },
  {
    id: 'GAP-NG-05',
    threat: 'Romance Scam Mule Funding',
    ref: 'EFCC Alert Q2 2026',
    coverage: 'NOT_COVERED' as const,
    risk: 'MEDIUM' as const,
    recommendation: 'Propose new scenario',
    proposedScenario: '—',
  },
];

export const REGULATORY_SOURCES = [
  {
    group: 'Nigerian Regulatory Sources',
    items: [
      { name: 'CBN', detail: 'centralbank.gov.ng (fraud circulars, FRAML mandate updates)', fresh: true },
      { name: 'NFIU', detail: 'nfiu.gov.ng (STR typologies, ML advisories, GoAML guidance)', fresh: true },
      { name: 'EFCC', detail: 'efcc.gov.ng (financial crime bulletins, enforcement actions)', fresh: true },
      { name: 'NIBSS', detail: 'nibss-nigeria.com (industry fraud reports, NIP anomalies)', fresh: false },
      { name: 'NCC', detail: 'ncc.gov.ng (SIM swap advisories, telecom fraud)', fresh: true },
      { name: 'SEC Nigeria', detail: 'sec.gov.ng (investment fraud, Ponzi scheme alerts)', fresh: false },
    ],
  },
  {
    group: 'Global Sources',
    items: [
      { name: 'FATF', detail: 'fatf-gafi.org (typology reports, grey/black list updates)', fresh: true },
      { name: 'FinCEN', detail: 'fincen.gov (wire fraud, BEC, crypto advisories)', fresh: false },
      { name: 'Interpol WACFC', detail: 'interpol.int (West Africa cybercrime bulletins)', fresh: true },
      { name: 'BioCatch / ThreatMetrix', detail: 'Device & behavioural fraud intelligence', fresh: false },
    ],
  },
];

export const REGULATORY_PULSE = [
  {
    group: 'CBN Circulars (2026)',
    items: [
      { ref: 'CBN/RBS/DIR/2026/012', desc: 'AI/biometric fraud', fresh: true },
      { ref: 'CBN/AML/2026/008', desc: 'Crypto-linked ML', fresh: true },
      { ref: 'CBN/FRAML/2026/003', desc: 'FRAML mandate update', fresh: false },
    ],
  },
  {
    group: 'NFIU Advisories',
    items: [
      { ref: 'NFIU/2026/TYP/03', desc: 'Mule network patterns', fresh: true },
      { ref: 'NFIU/2026/STR/11', desc: 'STR filing guidance', fresh: false },
      { ref: 'EFCC Alert Q2 2026', desc: 'Romance scam typology', fresh: true },
    ],
  },
  {
    group: 'FATF / Global',
    items: [
      { ref: 'FATF Typology 2026', desc: 'Digital identity fraud', fresh: true },
      { ref: 'FinCEN Advisory', desc: 'BEC + wire fraud', fresh: false },
      { ref: 'Interpol WACFC', desc: 'W. Africa fraud rings', fresh: true },
    ],
  },
];
