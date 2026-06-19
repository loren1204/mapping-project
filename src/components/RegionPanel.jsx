// floating card that appears over the map when a CHNA region is clicked. Displays information about the region and its associated locations. name, .quadrant, priority and households. 

// floating card that appears over the map when a CHNA region is clicked. Displays information about the region and its associated locations. name, .quadrant, priority and households. 

import { CHNA_QUADRANTS } from '../constants/index.js';

const RegionPanel = ({ region, onClose }) => {
  if (!region) return null;

  const chna = CHNA_QUADRANTS.find((q) => q.id === region.chna_quadrant);

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.name}>{region.name}</h3>
          {chna && (
            <span style={{ ...styles.badge, background: chna.color + '22', color: chna.color }}>
              {chna.label}
            </span>
          )}
        </div>
        <button onClick={onClose} style={styles.close}>✕</button>
      </div>

      <div style={styles.stats}>
        <Stat label="Priority Score" value={region.priority_score ?? '—'} />
        <Stat label="Households" value={region.households ? Number(region.households).toLocaleString() : '—'} />
      </div>

      {region.description && (
        <p style={styles.description}>{region.description}</p>
      )}
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div style={styles.stat}>
    <span style={styles.statLabel}>{label}</span>
    <span style={styles.statValue}>{value}</span>
  </div>
);

const styles = {
  panel: {
    position: 'absolute', bottom: 32, left: '50%',
    transform: 'translateX(-50%)',
    background: '#fff', borderRadius: 10,
    boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
    padding: '14px 18px',
    minWidth: 280, maxWidth: 360,
    zIndex: 500,
    border: '1px solid #e2e8f0',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  name: { margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' },
  badge: { display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, marginTop: 4 },
  close: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 14, padding: '0 4px' },
  stats: { display: 'flex', gap: 20, marginBottom: 10 },
  stat: { display: 'flex', flexDirection: 'column' },
  statLabel: { fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' },
  statValue: { fontSize: 18, fontWeight: 700, color: '#0f172a' },
  description: { margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.5 },
};

export default RegionPanel;
