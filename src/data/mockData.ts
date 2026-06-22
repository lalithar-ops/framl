// src/data/mockData.ts

export const KPI_CARDS = [
  {
    label: 'Fraud Prevented MTD',
    value: '₦4.83B',
    delta: '+₦340M vs last month',
    deltaPositive: true,
    sparkline: [38, 42, 39, 47, 51, 48, 55],
    accent: 'teal',
  },
  {
    label: 'Confirmed Fraud Loss MTD',
    value: '₦187M',
    delta: '↓ 22% vs prior month',
    deltaPositive: true,
    accent: 'bad',
  },
  {
    label: 'Current Fraud Rate',
    value: '4.2 bps',
    sub: 'Target ≤3.0 bps',
    subColor: 'amber',
    delta: '▼ 0.8 bps vs prior month',
    deltaPositive: true,
    note: 'Nigeria industry avg: 8.1 bps',
    sparkline: [5.8, 5.4, 5.1, 4.9, 4.6, 4.4, 4.2],
    accent: 'amber',
  },
  {
    label: 'False Positive Ratio',
    value: '28.4%',
    sub: '→ 8.2% (RTSE shadow)',
    subColor: 'good',
    delta: '↓ 71% reduction projected',
    deltaPositive: true,
    note: 'ML auto-suppression active',
    accent: 'teal',
  },
  {
    label: 'Mean Time to Detect',
    value: '4.2 min',
    delta: '↓ 38% vs manual baseline',
    deltaPositive: true,
    sub: 'CBN target: <10 min ✓',
    accent: 'teal',
  },
  {
    label: 'Mean Time to Respond',
    value: '11.8 min',
    delta: '↓ 52% vs prior quarter',
    deltaPositive: true,
    sub: 'Alert → decision · Target: <15 min ✓',
    accent: 'good',
  },
  {
    label: 'Fraud Prevented YTD',
    value: '₦23.1B',
    delta: '+18% vs full-year prior',
    deltaPositive: true,
    accent: 'teal',
  },
  {
    label: 'AI Detection Alerts (24h)',
    value: '23',
    sub: 'ML-only · no rule triggered',
    delta: '5 escalated to Fraud Ops',
    deltaPositive: false,
    accent: 'orange',
  },
];

export const SYSTEM_HEALTH = [
  { name: 'EFM', full: 'Enterprise Fraud Management', status: 'OPERATIONAL', detail: '<50ms · 10K TPS · 99.99% uptime', ok: true },
  { name: 'AML Suite', full: 'Transaction Monitoring', status: 'OPERATIONAL', detail: 'GoAML live · 29 typologies active', ok: true },
  { name: 'TrustArmour', full: 'Device Intelligence', status: 'OPERATIONAL', detail: 'SIM swap intercept · biometrics live', ok: true },
  { name: 'Genie AI', full: 'Investigator Assistant', status: 'OPERATIONAL', detail: 'STR drafting active · 42s avg', ok: true },
  { name: 'RTSE', full: 'ML Scoring Engine', status: 'OPERATIONAL', detail: 'Shadow mode active · 23 ML alerts today', ok: true },
];

export const SUBSIDIARY_RISK = [
  { name: 'FBN Merchant Banking', riskScore: 94, riskLevel: 'CRITICAL', alertsOpen: 3, exposureValue: '₦23.4M', topThreat: 'BEC / Payment Diversion', trend: 'up' },
  { name: 'FirstBank Retail Banking', riskScore: 78, riskLevel: 'HIGH', alertsOpen: 11, exposureValue: '₦4.8M', topThreat: 'ATO / SIM Swap', trend: 'up' },
  { name: 'FBN Commercial Banking', riskScore: 61, riskLevel: 'MEDIUM', alertsOpen: 4, exposureValue: '₦14.2M', topThreat: 'Cross-border velocity', trend: 'stable' },
  { name: 'FirstBank Digital (Firstmonie)', riskScore: 47, riskLevel: 'LOW', alertsOpen: 7, exposureValue: '₦2.1M', topThreat: 'Rapid layering / wallet bridge', trend: 'down' },
];

export const RISK_EXPOSURE_BARS = [
  { channel: 'Digital (IB + Mobile + USSD)', value: 2140000000, pct: 62, color: 'teal' },
  { channel: 'Cards (Debit / Credit / Prepaid)', value: 820000000, pct: 24, color: 'navy' },
  { channel: 'Corporate / B2B Payments', value: 280000000, pct: 8, color: 'amber' },
  { channel: 'Branch / Teller', value: 140000000, pct: 4, color: 'good' },
  { channel: 'ATM / Other', value: 70000000, pct: 2, color: 'muted' },
];

export const RISK_SUMMARY_TILES = [
  { label: 'Total Portfolio at Risk', value: '₦3.41B', sub: '0.14% of AUM' },
  { label: 'Highest Risk Segment', value: 'Digital Channels', sub: '62% of exposure' },
  { label: 'Emerging Threat', value: 'SIM Swap +340%', sub: 'vs same period last year' },
  { label: 'Nigeria Industry 2024', value: '₦52.3B losses', sub: '196% rise over 5 years' },
];

export const AI_ALERT_TILES = [
  { id: 'RTSE-0094', score: 0.94, scoreColor: 'bad', entity: 'Prestige Foods Ltd', description: 'BEC payment diversion · 11-day anomaly drift · FBN Merchant Bank', amount: '₦23M at risk', subsidiary: 'FBN Merchant Banking', age: '38 min ago' },
  { id: 'RTSE-0089', score: 0.89, scoreColor: 'bad', entity: 'Retail CIF 2847-FBN', description: 'Mule precursor behaviour · Salary account · 6-week baseline drift', amount: '₦4.8M', subsidiary: 'FirstBank Retail', age: '1h 12m ago' },
  { id: 'RTSE-0081', score: 0.81, scoreColor: 'amber', entity: 'Logistics SME · FBN Commercial', description: 'Cross-border velocity spike · SWIFT payment anomaly', amount: '₦14M', subsidiary: 'FBN Commercial', age: '2h 5m ago' },
  { id: 'RTSE-0077', score: 0.77, scoreColor: 'amber', entity: 'Digital Wallet Bridge', description: 'Rapid layering · OPay bridge · 4 hops in 38 min', amount: '₦2.1M', subsidiary: 'Firstmonie Digital', age: '3h 41m ago' },
  { id: 'RTSE-0071', score: 0.71, scoreColor: 'teal', entity: 'Branch Teller · FCT Abuja', description: 'Override pattern · Off-hours cluster · Internal fraud risk', amount: '₦680K', subsidiary: 'FBN Retail – FCT', age: '5h 20m ago' },
];

export const FRAUD_THREAT_TILES = [
  { type: 'BEC / Payment Diversion', value: '₦23M intercepted', detail: '3 active rings · FBN Merchant Bank & Commercial', color: 'bad' },
  { type: 'SIM Swap / ATO', value: '14 flags today', detail: 'Retail segment · 340% YoY increase', color: 'orange' },
  { type: 'Mule Account Activity', value: '₦4.8M flagged', detail: '6-week drift pattern · RTSE shadow detection', color: 'amber' },
];

export const CHANNEL_FRAUD_BREAKDOWN = [
  { channel: 'Mobile Banking', pct: 41 },
  { channel: 'Internet Banking', pct: 29 },
  { channel: 'USSD', pct: 18 },
  { channel: 'Cards (POS/ATM)', pct: 8 },
  { channel: 'Other', pct: 4 },
];

export const TYPOLOGY_HEATMAP = [
  { name: 'Account Takeover', level: 'HIGH', color: 'bad' },
  { name: 'Business Email Compromise', level: 'HIGH', color: 'bad' },
  { name: 'Mule/Money Mule', level: 'MEDIUM', color: 'amber' },
  { name: 'Card Skimming', level: 'MEDIUM', color: 'amber' },
  { name: 'Internal Fraud', level: 'MEDIUM', color: 'amber' },
  { name: 'Social Engineering', level: 'LOW', color: 'teal' },
  { name: 'Advance Fee', level: 'LOW', color: 'teal' },
  { name: 'Loan Fraud', level: 'LOW', color: 'teal' },
  { name: 'Cyber Fraud', level: 'MEDIUM', color: 'amber' },
];

export const AML_SUMMARY = {
  transactionsMonitoredMTD: '8.42M',
  strsFiledMTD: 47,
  strsViaGenie: 37,
  ctrsFiled: 312,
  activeWatchlistHits: 9,
  goAMLStatus: 'Connected',
  goAMLLastSync: '2h ago',
  fatfStatus: 'REMOVED',
  fatfDate: 'Oct 2025',
};

export const ALERT_QUEUE = [
  { id: 'ALT-9841', severity: 'CRITICAL', type: 'BEC Payment Diversion', entity: 'Prestige Foods Ltd', amount: '₦23,000,000', channel: 'SWIFT / Corporate Banking', assignee: 'Chukwuemeka A.', age: '38 min', slaBreached: false, status: 'IN REVIEW' },
  { id: 'ALT-9837', severity: 'CRITICAL', type: 'Account Takeover', entity: 'Adaeze Okonkwo · CIF 2291-FBN', amount: '₦4,800,000', channel: 'Mobile Banking', assignee: 'Ngozi F.', age: '1h 12m', slaBreached: false, status: 'PENDING' },
  { id: 'ALT-9829', severity: 'HIGH', type: 'Cross-border Velocity', entity: 'Logistics SME · FBN Commercial', amount: '₦14,200,000', channel: 'SWIFT', assignee: 'Tunde B.', age: '2h 5m', slaBreached: false, status: 'IN REVIEW' },
  { id: 'ALT-9814', severity: 'HIGH', type: 'Rapid Layering', entity: 'Digital Wallet Bridge · Firstmonie', amount: '₦2,100,000', channel: 'Digital / OPay Bridge', assignee: 'Amaka O.', age: '3h 41m', slaBreached: true, status: 'ESCALATED' },
  { id: 'ALT-9802', severity: 'MEDIUM', type: 'Internal Override Pattern', entity: 'Branch Teller · FCT Abuja', amount: '₦680,000', channel: 'Branch / Teller', assignee: 'Segun K.', age: '5h 20m', slaBreached: false, status: 'PENDING' },
  { id: 'ALT-9791', severity: 'HIGH', type: 'SIM Swap ATO', entity: 'Retail CIF 5512-FBN', amount: '₦1,240,000', channel: 'Mobile Banking', assignee: 'Chukwuemeka A.', age: '6h 55m', slaBreached: true, status: 'SLA BREACH' },
];

export const INVESTIGATOR_STATS = {
  casesClosedToday: 34,
  casesClosedDelta: '+12% vs avg',
  avgResolutionTime: '2.4 hrs',
  avgResolutionTarget: '<3 hrs',
  strsMTD: 47,
  strsViaGenie: 37,
  slaCompliance: '94.2%',
  slaComplianceDelta: '+3.1pp this week',
};

export const ANALYST_ROWS = [
  { name: 'Chukwuemeka A.', open: 8,  closedToday: 7, avgHandleTime: '2.1h', sla: 97, ok: 'green' as const },
  { name: 'Ngozi F.',        open: 11, closedToday: 5, avgHandleTime: '3.4h', sla: 82, ok: 'amber' as const },
  { name: 'Tunde B.',        open: 6,  closedToday: 9, avgHandleTime: '1.8h', sla: 99, ok: 'green' as const },
  { name: 'Amaka O.',        open: 14, closedToday: 3, avgHandleTime: '4.2h', sla: 71, ok: 'red'   as const },
  { name: 'Segun K.',        open: 9,  closedToday: 6, avgHandleTime: '2.7h', sla: 91, ok: 'green' as const },
];

export const TYPOLOGY_BARS = [
  { name: 'Account Takeover',        count: 34, color: 'bad' },
  { name: 'BEC / Payment Diversion', count: 28, color: 'orange' },
  { name: 'Mule Account',            count: 19, color: 'amber' },
  { name: 'Card Fraud',              count: 14, color: 'teal' },
  { name: 'Internal Fraud',          count: 8,  color: 'navy' },
];

export type NodeType = 'origin' | 'corporate' | 'mule' | 'external' | 'device' | 'staging' | 'internal';

export interface NetworkNode {
  id: string;
  label: string;
  type: NodeType;
  amount: string | null;
  channel: string | null;
  x: number;
  y: number;
}

export interface NetworkEdge {
  from: string;
  to: string;
  label: string;
}

export interface NetworkRing {
  id: string;
  severity: string;
  severityColor: string;
  label: string;
  accountCount: number;
  totalExposure: string;
  description: string;
  typologies: string[];
  subsidiaries: string[];
  firstDetected: string;
  lastActivity: string;
  strsGenerated: number;
  genieReady: boolean;
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

export const NETWORK_RINGS: NetworkRing[] = [
  {
    id: 'NET-0017', severity: 'CRITICAL', severityColor: 'bad',
    label: 'ATO + BEC Convergence Ring',
    accountCount: 7, totalExposure: '₦27.8M',
    description: 'Device X (FP-D-4471) is the convergence point — same physical device used for Adaeze Okonkwo\'s SIM swap ATO and Prestige Foods Ltd\'s SWIFT BEC initiation. 7 accounts linked across retail and corporate segments.',
    typologies: ['Account Takeover', 'BEC Payment Diversion', 'Mule Layering'],
    subsidiaries: ['FBN Retail', 'FBN Merchant Bank'],
    firstDetected: '14 Jun 2026', lastActivity: '19 Jun 2026 · 09:42',
    strsGenerated: 2, genieReady: true,
    nodes: [
      { id: 'N1', label: 'Adaeze Okonkwo',  type: 'origin' as NodeType,    amount: '₦4.8M',  channel: 'Mobile ATO',          x: 140, y: 80  },
      { id: 'N2', label: 'Prestige Foods',   type: 'corporate' as NodeType, amount: '₦23M',   channel: 'SWIFT BEC',            x: 480, y: 80  },
      { id: 'DX', label: 'Device X · FP-D-4471', type: 'device' as NodeType, amount: null, channel: 'Shared fingerprint',   x: 310, y: 160 },
      { id: 'N3', label: 'Mule Acct A',      type: 'mule' as NodeType,      amount: '₦2.1M',  channel: 'Digital transfer',     x: 200, y: 300 },
      { id: 'N4', label: 'Mule Acct B',      type: 'mule' as NodeType,      amount: '₦1.2M',  channel: 'USSD',                 x: 420, y: 300 },
      { id: 'N5', label: 'GTB Lagos',        type: 'external' as NodeType,  amount: '₦18.4M', channel: 'Interbank',            x: 580, y: 220 },
      { id: 'N7', label: 'Staging Wallet',   type: 'staging' as NodeType,   amount: '₦3.4M',  channel: 'Wallet bridge',        x: 380, y: 380 },
    ],
    edges: [
      { from: 'DX', to: 'N1', label: 'Device match' },
      { from: 'DX', to: 'N2', label: 'Device match' },
      { from: 'DX', to: 'N3', label: 'Device match' },
      { from: 'N1', to: 'N3', label: '₦2.1M transfer' },
      { from: 'N2', to: 'N5', label: '₦18.4M SWIFT' },
      { from: 'N3', to: 'N7', label: '₦1.8M wallet' },
      { from: 'N7', to: 'N5', label: '₦3.4M bridge' },
      { from: 'N1', to: 'N2', label: 'BEC email link' },
    ],
  },
  {
    id: 'NET-0014', severity: 'HIGH', severityColor: 'orange',
    label: 'USSD Micro-transfer Ring',
    accountCount: 5, totalExposure: '₦8.4M',
    description: 'Structured micro-transfers via USSD below ₦500K threshold to avoid automated flags. 5 mule accounts.',
    typologies: ['Structuring', 'Mule Network'],
    subsidiaries: ['FBN Retail', 'Firstmonie Digital'],
    firstDetected: '11 Jun 2026', lastActivity: '18 Jun 2026 · 22:17',
    strsGenerated: 1, genieReady: true,
    nodes: [
      { id: 'M1', label: 'Origin CIF 7720', type: 'origin',   amount: '₦8.4M total', channel: 'USSD',       x: 160, y: 200 },
      { id: 'M2', label: 'Mule 1 CIF 8812', type: 'mule',    amount: '₦1.9M',       channel: 'USSD',       x: 340, y: 100 },
      { id: 'M3', label: 'Mule 2 CIF 9043', type: 'mule',    amount: '₦2.1M',       channel: 'USSD',       x: 400, y: 270 },
      { id: 'M4', label: 'Mule 3 CIF 6631', type: 'mule',    amount: '₦1.7M',       channel: 'USSD',       x: 270, y: 330 },
      { id: 'M5', label: 'Exit OPay Wallet', type: 'external',amount: '₦6.2M',       channel: 'OPay bridge',x: 540, y: 190 },
    ],
    edges: [
      { from: 'M1', to: 'M2', label: '₦1.9M' },
      { from: 'M1', to: 'M3', label: '₦2.1M' },
      { from: 'M1', to: 'M4', label: '₦1.7M' },
      { from: 'M2', to: 'M5', label: '₦1.6M' },
      { from: 'M3', to: 'M5', label: '₦2.0M' },
      { from: 'M4', to: 'M5', label: '₦1.5M' },
    ],
  },
  {
    id: 'NET-0009', severity: 'MEDIUM', severityColor: 'amber',
    label: 'Branch Teller Internal Ring',
    accountCount: 3, totalExposure: '₦1.9M',
    description: 'Off-hours override pattern. Single teller across 3 accounts. Timing cluster 23:10–02:40.',
    typologies: ['Internal Fraud', 'Override Abuse'],
    subsidiaries: ['FBN Retail – FCT Abuja'],
    firstDetected: '17 Jun 2026', lastActivity: '19 Jun 2026 · 02:40',
    strsGenerated: 0, genieReady: false,
    nodes: [
      { id: 'T1', label: 'Teller A FCT',   type: 'internal', amount: null,    channel: 'Branch',    x: 220, y: 200 },
      { id: 'T2', label: 'CIF 4401 Dormant', type: 'origin', amount: '₦680K', channel: 'Teller',    x: 420, y: 110 },
      { id: 'T3', label: 'CIF 3309 Dormant', type: 'origin', amount: '₦720K', channel: 'Teller',    x: 420, y: 300 },
      { id: 'T4', label: 'UBA Account',    type: 'external', amount: '₦1.2M', channel: 'Interbank', x: 590, y: 200 },
    ],
    edges: [
      { from: 'T1', to: 'T2', label: 'Override' },
      { from: 'T1', to: 'T3', label: 'Override' },
      { from: 'T2', to: 'T4', label: '₦680K' },
      { from: 'T3', to: 'T4', label: '₦720K' },
    ],
  },
];

export const BOARD_DATA = {
  fraudPreventedYTD: '₦23.1B',
  fraudLossYTD: '₦1.87B',
  preventionRate: '92.5%',
  cbnComplianceScore: 87,
  cbnComplianceTarget: 90,
  platformUptime: '99.99%',
  avgDecisionSpeed: '48ms',
  quarterlyTrend: [
    { quarter: 'Q1 2026', prevented: '₦10.4B', loss: '₦1.1B', fpRate: '31.2%', mttd: '6.8 min' },
    { quarter: 'Q2 2026 (MTD)', prevented: '₦12.7B', loss: '₦770M', fpRate: '28.4%', mttd: '4.2 min' },
  ],
};

export const MY_CASES = [
  { id: 'CASE-2841', type: 'BEC Investigation', entity: 'Prestige Foods Ltd', amount: '₦23,000,000', opened: '14 Jun 2026', lastUpdated: '19 Jun 2026', status: 'IN PROGRESS', priority: 'CRITICAL', assignee: 'Chukwuemeka A.', daysOpen: 5, slaBreached: false, rtseScore: 0.94, genieReady: true, strRequired: true },
  { id: 'CASE-2839', type: 'ATO + SIM Swap', entity: 'Adaeze Okonkwo · CIF 2291', amount: '₦4,800,000', opened: '14 Jun 2026', lastUpdated: '19 Jun 2026', status: 'IN PROGRESS', priority: 'CRITICAL', assignee: 'Chukwuemeka A.', daysOpen: 5, slaBreached: false, rtseScore: 0.89, genieReady: true, strRequired: true },
  { id: 'CASE-2831', type: 'SWIFT Velocity Anomaly', entity: 'Logistics SME · CIF 7712', amount: '₦14,200,000', opened: '12 Jun 2026', lastUpdated: '18 Jun 2026', status: 'PENDING REVIEW', priority: 'HIGH', assignee: 'Tunde B.', daysOpen: 7, slaBreached: false, rtseScore: 0.81, genieReady: false, strRequired: false },
  { id: 'CASE-2820', type: 'Structuring / Layering', entity: 'Digital Wallet Bridge · Firstmonie', amount: '₦2,100,000', opened: '10 Jun 2026', lastUpdated: '17 Jun 2026', status: 'ESCALATED', priority: 'HIGH', assignee: 'Amaka O.', daysOpen: 9, slaBreached: true, rtseScore: 0.77, genieReady: false, strRequired: true },
  { id: 'CASE-2811', type: 'Internal Override Abuse', entity: 'Branch Teller · FCT Abuja', amount: '₦680,000', opened: '17 Jun 2026', lastUpdated: '19 Jun 2026', status: 'UNDER INVESTIGATION', priority: 'MEDIUM', assignee: 'Segun K.', daysOpen: 2, slaBreached: false, rtseScore: 0.71, genieReady: false, strRequired: false },
  { id: 'CASE-2798', type: 'AML — Watchlist Hit', entity: 'Import/Export Co. · CIF 9901', amount: '₦8,900,000', opened: '9 Jun 2026', lastUpdated: '16 Jun 2026', status: 'CLOSED — SAR FILED', priority: 'HIGH', assignee: 'Ngozi F.', daysOpen: 10, slaBreached: false, rtseScore: null, genieReady: false, strRequired: false },
];

export const REPORTS = [
  { id: 'RPT-0041', title: 'Weekly Fraud Intelligence Summary', period: 'Week of 13–19 Jun 2026', generatedBy: 'Clari5 Genie AI', generatedAt: '19 Jun 2026 · 06:00', type: 'FRAUD', status: 'READY', highlights: ['₦4.83B fraud prevented MTD — highest month on record', '23 ML-only detections with zero rule triggers', 'NET-0017 ring: Device X convergence confirmed across 7 accounts', 'SIM swap ATO attempts up 340% YoY — recommend enhanced USSD friction'] },
  { id: 'RPT-0038', title: 'AML Monthly Typology Analysis — June 2026', period: 'Jun 2026 MTD', generatedBy: 'AML Compliance Team', generatedAt: '15 Jun 2026 · 14:30', type: 'AML', status: 'READY', highlights: ['47 STRs filed MTD — 37 via Genie AI auto-draft', '312 CTRs submitted to NFIU on schedule', '9 active watchlist hits under review', 'GoAML integration stable — last sync 2h ago'] },
  { id: 'RPT-0034', title: 'CBN FRAML Compliance Scorecard — Q2 2026', period: 'Apr–Jun 2026', generatedBy: 'Risk & Compliance', generatedAt: '10 Jun 2026 · 09:15', type: 'COMPLIANCE', status: 'READY', highlights: ['Overall CBN compliance score: 87/100 (target 90+)', 'AI/ML mandate partially compliant — RTSE parallel run active', 'Deadline: Sept 2027 · 15 months remaining', 'FATF grey list removal confirmed Oct 2025 — elevated expectations apply'] },
];

export const PENDING_ACTIONS = [
  { id: 'ACT-0091', title: 'File STR for CASE-2841 (Prestige Foods BEC) via GoAML', priority: 'CRITICAL', dueDate: '20 Jun 2026', assignee: 'Chukwuemeka A.', type: 'STR_FILING', genieReady: true, note: 'Genie AI draft ready — review and submit. GoAML ref: pending.' },
  { id: 'ACT-0090', title: 'File STR for CASE-2839 (Adaeze Okonkwo ATO) via GoAML', priority: 'CRITICAL', dueDate: '20 Jun 2026', assignee: 'Chukwuemeka A.', type: 'STR_FILING', genieReady: true, note: 'Linked to NET-0017 ring. Include Device X evidence in narrative.' },
  { id: 'ACT-0087', title: 'Escalate CASE-2820 (Digital Wallet Layering) — SLA breached', priority: 'HIGH', dueDate: 'OVERDUE', assignee: 'Amaka O.', type: 'ESCALATION', genieReady: false, note: 'SLA breached by 9 hours. Requires supervisor sign-off for STR.' },
  { id: 'ACT-0085', title: 'Review and approve NET-0017 STR narrative in Genie AI', priority: 'HIGH', dueDate: '21 Jun 2026', assignee: 'Chukwuemeka A.', type: 'GENIE_REVIEW', genieReady: true, note: '2 STR narratives drafted. Legal review recommended before GoAML submission.' },
  { id: 'ACT-0082', title: 'Submit Q2 2026 CBN FRAML compliance report', priority: 'MEDIUM', dueDate: '30 Jun 2026', assignee: 'Risk & Compliance', type: 'COMPLIANCE', genieReady: false, note: 'Draft in Reports tab. Requires Head of Compliance sign-off.' },
];

// Keep legacy exports for backward compat
export const SUBSIDIARIES = SUBSIDIARY_RISK;
export const SYSTEMS_HEALTH = SYSTEM_HEALTH;
export const AI_ALERTS = AI_ALERT_TILES;
export const ANALYSTS = ANALYST_ROWS;
export const TYPOLOGIES = TYPOLOGY_BARS;
export const KPI_DATA = {
  fraudPreventedMTD: { value: '₦4.83B', delta: '+₦340M vs last month' },
  currentFraudRate: { value: '4.2', unit: 'bps', target: '≤3.0 bps', delta: '▼ 0.8 bps vs prior month', benchmark: 'Nigeria industry avg: 8.1 bps' },
  falsePositiveRatio: { current: '28.4%', rtse: '8.2%', reduction: '71%' },
  mttd: { value: '4.2 min', delta: '↓ 38%', sub: 'Avg across all fraud typologies · CBN target: <10 min' },
  mttr: { value: '11.8 min', delta: '↓ 52%', sub: 'Alert → decision · Target: <15 min' },
  transactionsBase: 284441,
};
