import { KPI_CARDS } from '../../data/mockData';

const ACCENT: Record<string, string> = {
  teal: 'var(--teal)', bad: 'var(--bad)', amber: 'var(--amber)',
  good: 'var(--good)', orange: 'var(--orange)', navy: 'var(--navy)',
};

const GMD_VISIBLE = ['Fraud Prevented MTD', 'Fraud Prevented YTD', 'Current Fraud Rate'];
const CRO_VISIBLE = ['Current Fraud Rate', 'False Positive Ratio', 'Fraud Prevented YTD'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyCard = any;

const CBN_CARD: AnyCard = {
  label: 'CBN Compliance Score', value: '87/100',
  delta: '↑ 3pts this quarter', deltaPositive: true,
  sub: 'Sept 2027 deadline', subColor: 'amber', accent: 'amber',
  sparkline: [81, 82, 83, 84, 85, 85, 87],
};
const OPEN_CRITICAL_CARD: AnyCard = {
  label: 'Open Critical Alerts', value: '14',
  delta: '↑ 3 since yesterday', deltaPositive: false,
  sub: 'Require immediate action', subColor: 'bad', accent: 'bad',
};
const ESC_QUEUE_CARD: AnyCard = {
  label: 'Escalation Queue', value: '47',
  delta: '↑ 12 new today', deltaPositive: false,
  sub: 'Mobile channel highest', subColor: 'bad', accent: 'orange',
};

function Sparkline({ data, up }: { data?: number[]; up: boolean }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 78},${22 - ((v - min) / range) * 20}`).join(' ');
  return (
    <svg viewBox="0 0 80 24" style={{ width: 80, height: 24, margin: '4px 0' }}>
      <polyline points={pts} fill="none" stroke={up ? 'var(--good)' : 'var(--bad)'} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function KPICard({ card }: { card: typeof KPI_CARDS[0] }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '14px 16px',
      boxShadow: 'var(--card-shadow)', borderTop: `3px solid ${ACCENT[card.accent] || 'var(--navy)'}`,
      display: 'flex', flexDirection: 'column', gap: 2,
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', textTransform: 'uppercase' }}>{card.label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--navy)', lineHeight: 1.2 }}>{card.value}</div>
      {card.sparkline && <Sparkline data={card.sparkline} up={card.deltaPositive} />}
      {card.sub && <div style={{ fontSize: 11, color: card.subColor ? ACCENT[card.subColor] : '#6B7280' }}>{card.sub}</div>}
      <div style={{ fontSize: 11, color: card.deltaPositive ? 'var(--good)' : 'var(--bad)', fontWeight: 600 }}>{card.delta}</div>
      {card.note && <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{card.note}</div>}
    </div>
  );
}

export default function KPIGrid({ persona }: { persona: string }) {
  let cards: typeof KPI_CARDS;

  if (persona === 'GMD') {
    cards = [...KPI_CARDS.filter(c => GMD_VISIBLE.includes(c.label)), CBN_CARD];
  } else if (persona === 'CRO') {
    cards = [...KPI_CARDS.filter(c => CRO_VISIBLE.includes(c.label)), CBN_CARD];
  } else {
    // Head of Fraud Ops — all 8 + 2 operational cards
    cards = [...KPI_CARDS, OPEN_CRITICAL_CARD, ESC_QUEUE_CARD];
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: 12, marginBottom: 16 }}>
      {cards.map(card => <KPICard key={card.label} card={card} />)}
    </div>
  );
}
