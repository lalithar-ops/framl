import { useLiveTicker } from '../../hooks/useLiveTicker';
import { KPI_DATA } from '../../data/mockData';

export default function LiveTicker() {
  const count = useLiveTicker(KPI_DATA.transactionsBase);
  return (
    <div style={{ background: 'var(--navy)', borderRadius: 8, padding: '10px 16px', marginBottom: 12, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ fontSize: 10, color: '#93C5FD', fontWeight: 600 }}>LIVE METRICS</span>
      <span style={{ fontSize: 11, color: '#fff' }}>Transactions Today: <strong style={{ color: 'var(--teal)' }}>{count.toLocaleString()}</strong></span>
      <span style={{ fontSize: 11, color: '#fff' }}>Decisions: <strong style={{ color: 'var(--teal)' }}>284,409</strong> <span style={{ color: '#6B7280' }}>(98.99% automated)</span></span>
      <span style={{ fontSize: 11, color: '#fff' }}>Avg Decision: <strong style={{ color: 'var(--teal)' }}>48ms</strong></span>
      <span style={{ fontSize: 11, color: '#fff' }}>Uptime: <strong style={{ color: '#34D399' }}>99.99%</strong></span>
    </div>
  );
}
