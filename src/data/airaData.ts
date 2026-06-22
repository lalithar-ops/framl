export const AIRA_LAST_RUN = '19 Jun 2026 · 06:00 WAT';

export const EMERGING_THREATS = [
  {
    id: 'T-NG-01',
    severity: 'HIGH' as const,
    name: 'AI Voice Cloning for CEO / CFO Impersonation',
    geography: 'Nigeria (Lagos, Abuja) · West Africa',
    source: 'CBN Risk-Based Supervision Circular 2026',
    ref: 'CBN/RBS/DIR/2026/012',
    description:
      'Fraudsters use AI-generated voice clones of corporate executives to instruct finance staff to initiate urgent SWIFT or NIP transfers to "approved" accounts. 3 FBN corporate clients reported variants of this pattern in Q1 2026. The voice clone bypasses callback verification in 4 of 5 cases observed.',
    coverage: 'PARTIAL' as const,
    coverageNote: 'BEC rule exists but voice-channel trigger not included',
  },
  {
    id: 'T-NG-02',
    severity: 'HIGH' as const,
    name: 'SIM Swap + BVN Spoofing Combo Attack',
    geography: 'Nigeria-wide · MTN, Airtel, Glo networks',
    source: 'NCC Fraud Advisory Q1 2026 + NFIU Typology 2025',
    ref: 'NCC/FRAUD/2026/004 · NFIU/2026/TYP/03',
    description:
      'Fraudsters execute SIM swap via compromised telecom agents, then use the new SIM to receive OTPs. BVN details are obtained from dark web data brokers selling Nigerian financial records. The combination — live SIM + valid BVN + OTP intercept — bypasses standard identity verification in mobile and internet banking. FBN sees 340% YoY increase in this pattern (see RTSE NET-0017).',
    coverage: 'PARTIAL' as const,
    coverageNote: 'SIM swap signal exists; BVN mismatch not combined as joint condition',
  },
  {
    id: 'T-NG-03',
    severity: 'MEDIUM' as const,
    name: 'USSD Session Hijacking via Social Engineering',
    geography: 'Nigeria · Rural and semi-urban segments',
    source: 'NIBSS Industry Fraud Report H2 2025',
    ref: 'NIBSS/IFR/2025/H2',
    description:
      'Fraudsters impersonate USSD technical support agents, guide customers through a "verification" sequence that re-registers their USSD profile on the fraudster\'s device. Transfers follow within 3–8 minutes of the re-registration. Predominantly targets Firstmonie and USSD *894# channel customers. Average loss: ₦55,000.',
    coverage: 'NOT_COVERED' as const,
    coverageNote: 'No scenario currently monitors USSD re-registration + transfer velocity as a combined signal',
  },
];

export const RULE_PROPOSALS = [
  {
    id: 'HS-NG-01',
    type: 'HARD_STOP' as const,
    name: 'SIM Swap + BVN Mismatch + High-Value NIP Transfer',
    confidence: 'HIGH' as const,
    conditions: [
      { signal: 'sim_swap_detected', operator: 'eq', value: 'true' },
      { signal: 'sim_age_hours', operator: 'lte', value: '48' },
      { signal: 'bvn_device_mismatch', operator: 'eq', value: 'true' },
      { signal: 'nip_transfer_amount', operator: 'gte', value: '5× income_estimate' },
    ],
    action: 'BLOCK + ALERT + FREEZE_PENDING_REVIEW',
    rationale:
      'NCC/FRAUD/2026/004 + NFIU/2026/TYP/03 confirm SIM swap combined with BVN mismatch and velocity as the dominant ATO vector in Nigeria. FBN\'s own Q1 2026 cohort confirms 9 ATO cases match this exact signal combination. No current hard-stop covers this.',
    status: 'PENDING' as const,
  },
  {
    id: 'COMBO-NG-04',
    type: 'COMBINATION' as const,
    name: 'USSD Re-registration + Transfer Velocity',
    confidence: 'HIGH' as const,
    conditions: [
      { signal: 'ussd_reregistration', operator: 'eq', value: 'true' },
      { signal: 'time_to_first_transfer', operator: 'lte', value: '10 min' },
      { signal: 'new_beneficiary_count', operator: 'gte', value: '2' },
      { signal: 'transfer_to_new_payee', operator: 'gte', value: '80%' },
    ],
    action: 'ALERT + STEP_UP_AUTH',
    rationale:
      'NIBSS/IFR/2025/H2 identifies USSD session hijack as gap typology. FBN cohort Q1 2026 — all 8 USSD intercept cases had re-registration within 10 min of first fraudulent transfer. No current scenario combines these two signals.',
    status: 'PENDING' as const,
  },
  {
    id: 'COMBO-NG-07',
    type: 'COMBINATION' as const,
    name: 'CEO Voice Clone Indicator (BEC + Audio Channel Flag)',
    confidence: 'MEDIUM' as const,
    conditions: [
      { signal: 'corporate_account', operator: 'eq', value: 'true' },
      { signal: 'new_beneficiary_added', operator: 'eq', value: 'true' },
      { signal: 'payment_instruction_src', operator: 'eq', value: 'phone_or_email' },
      { signal: 'transfer_amount', operator: 'gte', value: '3× avg_30d' },
      { signal: 'time_payee_to_transfer', operator: 'lte', value: '30 min' },
    ],
    action: 'ALERT + MANUAL_CALLBACK_REQUIRED',
    rationale:
      'CBN/RBS/DIR/2026/012 flags AI voice cloning as emerging threat for corporate accounts. FBN has 3 confirmed BEC cases in Q1 2026 where callback protocol was bypassed. Adding payment_instruction_src as a signal strengthens BEC rule precision for corporate segment.',
    status: 'PENDING' as const,
  },
  {
    id: 'EMERGING-NG-02',
    type: 'EMERGING' as const,
    name: 'Crypto Off-Ramp Layering via P2P',
    confidence: 'MEDIUM' as const,
    conditions: [
      { signal: 'counterparty_type', operator: 'eq', value: 'crypto_exchange_p2p' },
      { signal: 'transaction_count_24h', operator: 'gte', value: '5' },
      { signal: 'avg_transaction_amount', operator: 'between', value: '₦50K – ₦500K' },
      { signal: 'counterparty_diversity', operator: 'gte', value: '4 unique accts' },
    ],
    action: 'ALERT + AML_REVIEW_QUEUE',
    rationale:
      'CBN/AML/2026/008 and EFCC Q2 2026 bulletin identify P2P crypto off-ramp as the dominant layering mechanism for Nigerian fraud proceeds post-2025. FATF Typology 2026 confirms globally. No current FBN scenario covers crypto-linked structuring.',
    status: 'PENDING' as const,
  },
];

export const GAP_ANALYSIS = [
  { id: 'GAP-NG-01', threat: 'SIM Swap + BVN Combo ATO', ref: 'NCC/FRAUD/2026/004', coverage: 'PARTIAL' as const, risk: 'CRITICAL' as const, recommendation: 'HS-NG-01' },
  { id: 'GAP-NG-02', threat: 'USSD Session Hijack', ref: 'NIBSS/IFR/2025/H2', coverage: 'NOT_COVERED' as const, risk: 'CRITICAL' as const, recommendation: 'COMBO-NG-04' },
  { id: 'GAP-NG-03', threat: 'AI Voice Clone / BEC', ref: 'CBN/RBS/DIR/2026/012', coverage: 'PARTIAL' as const, risk: 'HIGH' as const, recommendation: 'COMBO-NG-07' },
  { id: 'GAP-NG-04', threat: 'Crypto P2P Layering', ref: 'CBN/AML/2026/008', coverage: 'NOT_COVERED' as const, risk: 'HIGH' as const, recommendation: 'EMERGING-NG-02' },
  { id: 'GAP-NG-05', threat: 'Romance Scam Mule Funding', ref: 'EFCC Alert Q2 2026', coverage: 'NOT_COVERED' as const, risk: 'MEDIUM' as const, recommendation: 'Propose new scenario' },
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
