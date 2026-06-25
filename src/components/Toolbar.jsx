//city fly-to buttons, choropleth toggle with legend, location button, Export Excel button.

import { CITIES, CHNA_QUADRANTS, MAP_MODES } from '../constants/index.js';

const Toolbar = ({ onCitySelect, choroplethVisible, onToggleChoropleth, onAddLocation, onExport, mapStyle, onMapStyleChange, is3D, onToggle3D }) => {  return (
    <div className="glass" style={styles.toolbar}>
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

{/* Map mode switcher */}
<div style={styles.group}>
  <span style={styles.groupLabel}>View</span>
  {MAP_MODES.map((mode) => (
    <button
      key={mode.id}
      style={{
        ...styles.cityBtn,
        background: mapStyle === mode.id ? 'linear-gradient(135deg, #1A6FB5, #2F8FE0)' : 'rgba(255,255,255,0.5)',
        color: mapStyle === mode.id ? '#fff' : '#0B2538',
        boxShadow: mapStyle === mode.id ? '0 4px 14px rgba(26, 111, 181, 0.4)' : 'none',
      }}
      onClick={() => onMapStyleChange(mode.id)}
    >
      {mode.label}
    </button>
  ))}
  <button
    style={{
      ...styles.toggleBtn,
      background: is3D ? 'linear-gradient(135deg, #2FA66B, #3DBE7E)' : 'rgba(11, 37, 56, 0.06)',
      color: is3D ? '#fff' : '#5B7A8C',
      boxShadow: is3D ? '0 4px 14px rgba(47, 166, 107, 0.4)' : 'none',
    }}
    onClick={onToggle3D}
  >
    3D
  </button>
</div>

      <div style={styles.divider} />

      {/* CHNA Legend + Toggle */}
      <div style={styles.group}>
        <span style={styles.groupLabel}>CHNA</span>
        <button
          style={{
            ...styles.toggleBtn,
            background: choroplethVisible
              ? 'linear-gradient(135deg, #1A6FB5, #2F8FE0)'
              : 'rgba(11, 37, 56, 0.06)',
            color: choroplethVisible ? '#fff' : '#5B7A8C',
            boxShadow: choroplethVisible ? '0 4px 14px rgba(26, 111, 181, 0.4)' : 'none',
          }}
          onClick={onToggleChoropleth}
        >
          {choroplethVisible ? 'Hide Regions' : 'Show Regions'}
        </button>
        {choroplethVisible && (
          <div style={styles.legend}>
            {CHNA_QUADRANTS.map((q) => (
              <span key={q.id} style={styles.legendItem}>
                <span
                  style={{
                    ...styles.legendDot,
                    background: q.color,
                    boxShadow: `0 0 0 3px ${q.color}26, 0 0 8px ${q.color}66`,
                  }}
                />
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
          Export Excel
        </button>
      </div>
    </div>
  );
};

const styles = {
  toolbar: {
    display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8,
    padding: '10px 16px',
    zIndex: 10,
    flexShrink: 0,
    marginBottom: 0,
  },
  group: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  groupLabel: { fontSize: 10, fontWeight: 700, color: '#5B7A8C', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 2 },
  cityBtn: {
    padding: '5px 11px', fontSize: 12, border: '1px solid rgba(11, 37, 56, 0.1)',
    borderRadius: 8, background: 'rgba(255,255,255,0.5)', color: '#0B2538',
    cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s',
  },
  toggleBtn: {
    padding: '5px 11px', fontSize: 12, border: 'none',
    borderRadius: 8, cursor: 'pointer', fontWeight: 700, transition: 'all 0.15s',
  },
  legend: { display: 'flex', gap: 10, alignItems: 'center' },
  legendItem: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#0B2538', fontWeight: 600 },
  legendDot: { width: 10, height: 10, borderRadius: '50%' },
  divider: { width: 1, height: 24, background: 'rgba(11, 37, 56, 0.12)', margin: '0 4px' },
  addBtn: {
    padding: '6px 14px', fontSize: 12, border: 'none',
    borderRadius: 8, background: 'linear-gradient(135deg, #2FA66B, #3DBE7E)', color: '#fff',
    cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 14px rgba(47, 166, 107, 0.4)',
  },
  exportBtn: {
    padding: '5px 11px', fontSize: 12,
    border: '1px solid rgba(11, 37, 56, 0.1)', borderRadius: 8,
    background: 'rgba(255,255,255,0.5)', color: '#0B2538', cursor: 'pointer', fontWeight: 600,
  },
};

export default Toolbar;