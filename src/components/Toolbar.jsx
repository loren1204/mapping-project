//city pfly-to buttons, chloropleth toggle with legend, location button, Export GeoJSON button. 

//city pfly-to buttons, chloropleth toggle with legend, location button, Export GeoJSON button. 

import { CITIES, CHNA_QUADRANTS } from '../constants/index.js';

const Toolbar = ({ onCitySelect, choroplethVisible, onToggleChoropleth, onAddLocation, onExport }) => {
  return (
    <div style={styles.toolbar}>
      {/* City navigation */}
      <div style={styles.group}>
        <span style={styles.groupLabel}>Fly to</span>
        {CITIES.map((city) => (
          <button
            key={city.id}
            style={styles.cityBtn}
            onClick={() => onCitySelect(city)}
          >
            {city.label}
          </button>
        ))}
      </div>

      <div style={styles.divider} />

      {/* CHNA Legend + Toggle */}
      <div style={styles.group}>
        <span style={styles.groupLabel}>CHNA</span>
        <button
          style={{ ...styles.toggleBtn, background: choroplethVisible ? '#1d4ed8' : '#f1f5f9', color: choroplethVisible ? '#fff' : '#334155' }}
          onClick={onToggleChoropleth}
        >
          {choroplethVisible ? 'Hide Regions' : 'Show Regions'}
        </button>
        {choroplethVisible && (
          <div style={styles.legend}>
            {CHNA_QUADRANTS.map((q) => (
              <span key={q.id} style={styles.legendItem}>
                <span style={{ ...styles.legendDot, background: q.color }} />
                {q.id}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={styles.divider} />

      {/* Actions */}
      <div style={styles.group}>
        <button style={styles.addBtn} onClick={onAddLocation}>
          + Add Location
        </button>
        <button style={styles.exportBtn} onClick={onExport}>
          Export GeoJSON
        </button>
      </div>
    </div>
  );
};

const styles = {
  toolbar: {
    display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8,
    padding: '10px 16px',
    background: '#fff',
    borderBottom: '1px solid #e2e8f0',
    zIndex: 10,
  },
  group: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  groupLabel: { fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 2 },
  cityBtn: {
    padding: '5px 11px', fontSize: 12, border: '1px solid #e2e8f0',
    borderRadius: 6, background: '#f8fafc', color: '#334155',
    cursor: 'pointer', fontWeight: 500,
  },
  toggleBtn: {
    padding: '5px 11px', fontSize: 12, border: 'none',
    borderRadius: 6, cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s',
  },
  legend: { display: 'flex', gap: 8, alignItems: 'center' },
  legendItem: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#475569', fontWeight: 500 },
  legendDot: { width: 10, height: 10, borderRadius: 3 },
  divider: { width: 1, height: 24, background: '#e2e8f0', margin: '0 4px' },
  addBtn: {
    padding: '6px 14px', fontSize: 12, border: 'none',
    borderRadius: 6, background: '#1d4ed8', color: '#fff',
    cursor: 'pointer', fontWeight: 600,
  },
  exportBtn: {
    padding: '5px 11px', fontSize: 12,
    border: '1px solid #e2e8f0', borderRadius: 6,
    background: '#f8fafc', color: '#334155', cursor: 'pointer', fontWeight: 500,
  },
};

export default Toolbar;
