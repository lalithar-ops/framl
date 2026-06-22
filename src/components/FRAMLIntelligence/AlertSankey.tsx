export default function AlertSankey() {
  const VB_W = 560, VB_H = 180;

  const srcTotal = 4817;
  const H = 160;
  const GAP = 6;

  const sources = [
    { label: 'Digital', count: 2100, color: '#E8913A' },
    { label: 'Corporate', count: 1847, color: '#4A9EE8' },
    { label: 'Cross-Border', count: 870, color: '#089BB2' },
  ];
  const types = [
    { label: 'Fraud Alerts', count: 2876, color: '#E8913A' },
    { label: 'AML Alerts', count: 1941, color: '#4A9EE8' },
  ];
  const dispositions = [
    { label: 'Filed STR', count: 143, color: '#059669' },
    { label: 'Pending', count: 87, color: '#D97706' },
    { label: 'Under Review', count: 312, color: '#4A9EE8' },
    { label: 'Closed', count: 399, color: '#94A3B8' },
  ];

  function calcNodes(items: { label: string; count: number; color: string }[], x: number, total: number, nodeW: number) {
    const scale = (H - GAP * (items.length - 1)) / total;
    let y = 10;
    return items.map(item => {
      const h = item.count * scale;
      const node = { ...item, x, y, h, w: nodeW };
      y += h + GAP;
      return node;
    });
  }

  const srcNodes = calcNodes(sources, 10, srcTotal, 90);
  const typeNodes = calcNodes(types, 215, srcTotal, 90);
  const dispNodes = calcNodes(dispositions, 420, srcTotal, 90);

  function band(x1: number, y1: number, h1: number, x2: number, y2: number, h2: number, color: string) {
    const mx = (x1 + x2) / 2;
    return (
      <path
        d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2} L${x2},${y2 + h2} C${mx},${y2 + h2} ${mx},${y1 + h1} ${x1},${y1 + h1}Z`}
        fill={color} opacity={0.35}
      />
    );
  }

  const srcToType = [
    { si: 0, ti: 0, frac: 0.60 },
    { si: 0, ti: 1, frac: 0.40 },
    { si: 1, ti: 0, frac: 0.50 },
    { si: 1, ti: 1, frac: 0.50 },
    { si: 2, ti: 0, frac: 0.30 },
    { si: 2, ti: 1, frac: 0.70 },
  ];

  const srcOffsets = srcNodes.map(() => 0);
  const typeOffsets = typeNodes.map(() => 0);

  const srcTypeBands = srcToType.map(({ si, ti, frac }) => {
    const src = srcNodes[si], typ = typeNodes[ti];
    const h1 = src.h * frac;
    const h2 = typ.h * (src.count * frac / typ.count);
    const y1 = src.y + srcOffsets[si];
    const y2 = typ.y + typeOffsets[ti];
    srcOffsets[si] += h1;
    typeOffsets[ti] += h2;
    return band(src.x + src.w, y1, h1, typ.x, y2, h2, src.color);
  });

  const typeOffsets2 = typeNodes.map(() => 0);
  const dispOffsets2 = dispNodes.map(() => 0);
  const typeToDisp = [
    { ti: 0, di: 0, frac: 0.08 }, { ti: 0, di: 1, frac: 0.05 }, { ti: 0, di: 2, frac: 0.45 }, { ti: 0, di: 3, frac: 0.42 },
    { ti: 1, di: 0, frac: 0.06 }, { ti: 1, di: 1, frac: 0.04 }, { ti: 1, di: 2, frac: 0.30 }, { ti: 1, di: 3, frac: 0.60 },
  ];
  const typeDispBands = typeToDisp.map(({ ti, di, frac }) => {
    const typ = typeNodes[ti], disp = dispNodes[di];
    const h1 = typ.h * frac;
    const h2 = disp.h * (typ.count * frac / disp.count);
    const y1 = typ.y + typeOffsets2[ti];
    const y2 = disp.y + dispOffsets2[di];
    typeOffsets2[ti] += h1;
    dispOffsets2[di] += Math.min(h2, disp.h - dispOffsets2[di]);
    return band(typ.x + typ.w, y1, h1, disp.x, y2, Math.min(h2, 20), typ.color);
  });

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: 'var(--card-shadow)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', marginBottom: 4 }}>SAR PIPELINE & ALERT FLOW</div>
      <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 12 }}>Source → Risk Type → Disposition · MTD 4,817 alerts</div>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} style={{ width: '100%', height: 180 }}>
        <defs>
          <linearGradient id="fraudGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8913A" /><stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
          <linearGradient id="amlGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A9EE8" /><stop offset="100%" stopColor="#1A3A6B" />
          </linearGradient>
        </defs>

        <text x={55} y={6} textAnchor="middle" fontSize="8" fill="#9CA3AF" fontWeight="700">SOURCES</text>
        <text x={260} y={6} textAnchor="middle" fontSize="8" fill="#9CA3AF" fontWeight="700">RISK TYPE</text>
        <text x={465} y={6} textAnchor="middle" fontSize="8" fill="#9CA3AF" fontWeight="700">DISPOSITION</text>

        {srcTypeBands}
        {typeDispBands}

        {srcNodes.map(n => (
          <g key={n.label}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={3} fill={n.color} />
            <text x={n.x + n.w / 2} y={n.y + n.h / 2 - 4} textAnchor="middle" fontSize="8" fill="white" fontWeight="700">{n.label}</text>
            <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 7} textAnchor="middle" fontSize="9" fill="white">{n.count.toLocaleString()}</text>
          </g>
        ))}

        {typeNodes.map((n, i) => (
          <g key={n.label}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={3} fill={`url(#${i === 0 ? 'fraudGrad' : 'amlGrad'})`} />
            <text x={n.x + n.w / 2} y={n.y + n.h / 2 - 4} textAnchor="middle" fontSize="8" fill="white" fontWeight="700">{i === 0 ? 'Fraud' : 'AML'}</text>
            <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 7} textAnchor="middle" fontSize="9" fill="white">{n.count.toLocaleString()}</text>
          </g>
        ))}

        {dispNodes.map(n => (
          <g key={n.label}>
            <rect x={n.x} y={n.y} width={n.w} height={Math.max(n.h, 18)} rx={3} fill={n.color} />
            <text x={n.x + n.w / 2} y={n.y + Math.max(n.h, 18) / 2 - 4} textAnchor="middle" fontSize="8" fill="white" fontWeight="700">{n.label}</text>
            <text x={n.x + n.w / 2} y={n.y + Math.max(n.h, 18) / 2 + 7} textAnchor="middle" fontSize="9" fill="white">{n.count}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
