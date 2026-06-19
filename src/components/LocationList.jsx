// sidebar list with search, expand/collapse functionality for each location, inline editing for any field, last updated date display. 
// sidebar list with search, expand/collapse functionality for each location, inline editing for any field, last updated date display. 

import { useState } from 'react';
import { CATEGORIES, TEAM_MEMBERS, CHNA_QUADRANTS, ENGAGEMENT_STATUSES } from '../constants/index.js';

const LocationList = ({ locations, onDelete, onUpdate }) => {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = locations.filter((f) => {
    const q = search.toLowerCase();
    const p = f.properties;
    return (
      p.name.toLowerCase().includes(q) ||
      p.address?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div style={styles.container}>
      <div style={styles.searchWrap}>
        <input
          style={styles.search}
          placeholder="Search locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={styles.count}>
        {filtered.length} location{filtered.length !== 1 ? 's' : ''}
      </div>

      <div style={styles.list}>
        {filtered.length === 0 && (
          <p style={styles.empty}>No locations yet. Use "Add Location" to get started.</p>
        )}
        {filtered.map((feature) => (
          <LocationItem
            key={feature.properties.id}
            feature={feature}
            expanded={expandedId === feature.properties.id}
            onToggle={() =>
              setExpandedId(
                expandedId === feature.properties.id ? null : feature.properties.id
              )
            }
            onDelete={() => onDelete(feature.properties.id)}
            onUpdate={(fields) => onUpdate(feature.properties.id, fields)}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Individual Location Item ─────────────────────────────────────────────────
const LocationItem = ({ feature, expanded, onToggle, onDelete, onUpdate }) => {
  const p = feature.properties;
  const category = CATEGORIES.find((c) => c.id === p.category);
  const chna = CHNA_QUADRANTS.find((q) => q.id === p.chnaQuadrant);
  const status = ENGAGEMENT_STATUSES.find((s) => s.id === p.engagementStatus);
  const assignedNames = TEAM_MEMBERS
    .filter((tm) => (p.assignedTeam || []).includes(tm.id))
    .map((tm) => tm.name);

  return (
    <div style={styles.item}>
      {/* Header row */}
      <div style={styles.itemHeader} onClick={onToggle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <span style={{ ...styles.dot, background: category?.color || '#94a3b8' }} />
          <span style={styles.itemName}>{p.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {status && (
            <span style={{ ...styles.statusBadge, background: status.color + '22', color: status.color }}>
              {status.label}
            </span>
          )}
          <span style={styles.chevron}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Collapsed preview */}
      {!expanded && (
        <div style={styles.preview}>
          {p.address && <span style={styles.previewText}>{p.address}</span>}
          {p.lastUpdated && (
            <span style={styles.dateText}>Updated {p.lastUpdated}</span>
          )}
        </div>
      )}

      {/* Expanded detail */}
      {expanded && (
        <div style={styles.detail}>
          <EditableField label="Name" value={p.name} onSave={(v) => onUpdate({ name: v })} />
          <EditableField label="Address" value={p.address || ''} onSave={(v) => onUpdate({ address: v })} />
          <EditableField label="Description" value={p.description || ''} multiline onSave={(v) => onUpdate({ description: v })} />

          <div style={styles.detailRow}>
            <DetailItem label="Category" value={category?.label || p.category} />
            <DetailItem label="CHNA Quadrant" value={chna?.label || '—'} />
          </div>

          <div style={styles.detailRow}>
            <DetailItem label="Households" value={p.households ? p.households.toLocaleString() : '—'} />
            <EditableField label="Status" value={status?.label || p.engagementStatus} onSave={(v) => onUpdate({ engagementStatus: v })} />
          </div>

          {assignedNames.length > 0 && (
            <DetailItem label="Assigned Team" value={assignedNames.join(', ')} />
          )}

          <div style={styles.detailRow}>
            <DetailItem label="Date Added" value={p.dateAdded || '—'} />
            <DetailItem label="Last Updated" value={p.lastUpdated || '—'} />
          </div>

          <div style={styles.coords}>
            {feature.geometry.coordinates[1].toFixed(5)}°N,{' '}
            {feature.geometry.coordinates[0].toFixed(5)}°W
          </div>

          <button onClick={onDelete} style={styles.deleteBtn}>
            Remove Location
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Inline editable field ────────────────────────────────────────────────────
const EditableField = ({ label, value, onSave, multiline }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => {
    onSave(draft);
    setEditing(false);
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
        <span style={styles.detailLabel}>{label}</span>
        {!editing && (
          <button onClick={() => setEditing(true)} style={styles.editBtn}>Edit</button>
        )}
      </div>
      {editing ? (
        <div>
          {multiline ? (
            <textarea
              style={{ ...styles.editInput, height: 60, resize: 'vertical' }}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
            />
          ) : (
            <input
              style={styles.editInput}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
            />
          )}
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <button onClick={commit} style={styles.saveBtn}>Save</button>
            <button onClick={() => { setDraft(value); setEditing(false); }} style={styles.cancelBtn}>Cancel</button>
          </div>
        </div>
      ) : (
        <p style={styles.detailValue}>{value || <em style={{ color: '#94a3b8' }}>Not set</em>}</p>
      )}
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div style={{ flex: 1, marginBottom: 8 }}>
    <span style={styles.detailLabel}>{label}</span>
    <p style={styles.detailValue}>{value}</p>
  </div>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
  searchWrap: { padding: '12px 14px 8px' },
  search: {
    width: '100%', padding: '8px 10px', fontSize: 13,
    border: '1px solid #e2e8f0', borderRadius: 7,
    outline: 'none', background: '#f8fafc', boxSizing: 'border-box',
  },
  count: { fontSize: 11, color: '#94a3b8', padding: '0 14px 8px', fontWeight: 500 },
  list: { flex: 1, overflowY: 'auto', padding: '0 10px 12px' },
  empty: { fontSize: 13, color: '#94a3b8', textAlign: 'center', marginTop: 24, lineHeight: 1.6 },
  item: {
    background: '#fff', border: '1px solid #e2e8f0',
    borderRadius: 8, marginBottom: 8, overflow: 'hidden',
  },
  itemHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 12px', cursor: 'pointer',
    userSelect: 'none',
  },
  dot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  itemName: { fontSize: 13, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  statusBadge: { fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.04em' },
  chevron: { fontSize: 10, color: '#94a3b8' },
  preview: { padding: '0 12px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  previewText: { fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 },
  dateText: { fontSize: 11, color: '#94a3b8', flexShrink: 0, marginLeft: 8 },
  detail: { padding: '4px 12px 12px', borderTop: '1px solid #f1f5f9', background: '#fafbfc' },
  detailRow: { display: 'flex', gap: 12 },
  detailLabel: { display: 'block', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 },
  detailValue: { margin: 0, fontSize: 13, color: '#334155' },
  coords: { fontSize: 10, color: '#94a3b8', fontFamily: 'monospace', margin: '8px 0' },
  editInput: {
    width: '100%', padding: '6px 8px', fontSize: 13,
    border: '1px solid #cbd5e1', borderRadius: 6,
    outline: 'none', boxSizing: 'border-box',
  },
  editBtn: { background: 'none', border: 'none', color: '#3b82f6', fontSize: 11, cursor: 'pointer', padding: 0, fontWeight: 600 },
  saveBtn: { background: '#1d4ed8', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: 5, cursor: 'pointer', fontSize: 12 },
  cancelBtn: { background: '#f1f5f9', color: '#64748b', border: 'none', padding: '4px 10px', borderRadius: 5, cursor: 'pointer', fontSize: 12 },
  deleteBtn: {
    marginTop: 10, background: 'none', border: '1px solid #fca5a5',
    color: '#dc2626', padding: '6px 12px', borderRadius: 6,
    cursor: 'pointer', fontSize: 12, fontWeight: 500, width: '100%',
  },
};

export default LocationList;
