export default function ChannelHexbin() {
  const channels = [
    { name: 'Mobile', count: 47 },
    { name: 'Agent', count: 38 },
    { name: 'Internet', count: 24 },
    { name: 'USSD', count: 14 },
    { name: 'ATM', count: 9 },
    { name: 'Branch', count: 5 },
  ];

  const maxCount = 47;
  const baseR = 18;
  const maxR = 36;

  const heatColor = (n: number) =>
    n > 35 ? '#DC2626' : n >= 20 ? '#D97706' : n >= 10 ? '#F59E0B' : '#059669';

  const hexPositions = [
    { x: 50,  y: 60 },
    { x: 120, y: 60 },
    { x: 200, y: 60 },
    { x: 275, y: 60 },
    { x: 345, y: 60 },
    { x: 410, y: 60 },
  ];

  function hexPath(cx: number, cy: number, r: number) {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 180) * (60 * i - 30);
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    });
    return `M${pts.join('L')}Z`;
  }

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', marginBottom: 16, boxShadow: 'var(--card-shadow)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', marginBottom: 10 }}>
        ALERT VOLUME BY CHANNEL — THIS WEEK
      </div>
      <svg viewBox="0 0 460 120" style={{ width: '100%', height: 120 }}>
        <defs>
          <filter id="hexshadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
          </filter>
          <style>{`
            @keyframes hexPulse {
              0%,100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
            .pulse-hex { animation: hexPulse 1.5s ease-in-out infinite; }
          `}</style>
        </defs>
        {channels.map((ch, i) => {
          const pos = hexPositions[i];
          const r = baseR + ((ch.count / maxCount) * (maxR - baseR));
          const color = heatColor(ch.count);
          const isPulsing = color === '#DC2626';
          return (
            <g key={ch.name} filter="url(#hexshadow)" className={isPulsing ? 'pulse-hex' : undefined}>
              <path d={hexPath(pos.x, pos.y, r)} fill={color} />
              <text x={pos.x} y={pos.y - 4} textAnchor="middle" fontSize="9" fontWeight="700" fill="white">{ch.name}</text>
              <text x={pos.x} y={pos.y + 9} textAnchor="middle" fontSize="12" fontWeight="700" fill="white">{ch.count}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
