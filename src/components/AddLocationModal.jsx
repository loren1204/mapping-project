import { useState } from 'react';
import { CATEGORIES, TEAM_MEMBERS, CHNA_QUADRANTS, ENGAGEMENT_STATUSES } from '../constants/index.js';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const AddLocationModal = ({ onSave, onClose }) => {
  const [form, setForm] = useState({
    name: '',
    address: '',
    category: 'community',
    description: '',
    households: '',
    chnaQuadrant: '',
    assignedTeam: [],
    engagementStatus: 'prospect',
  });
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState('');

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const toggleTeamMember = (id) => {
    set('assignedTeam', form.assignedTeam.includes(id)
      ? form.assignedTeam.filter((t) => t !== id)
      : [...form.assignedTeam, id]);
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.name.trim() || !form.address.trim()) {
      setError('Name and address are required.');
      return;
    }
    setGeocoding(true);
    try {
      const query = encodeURIComponent(form.address);
      const res = await fetch(
        'https://api.mapbox.com/search/geocode/v6/forward?q=' + query + '&country=us&proximity=-81.87,26.64&access_token=' + MAPBOX_TOKEN
      );
      const data = await res.json();
      if (!data.features || data.features.length === 0) {
        setError('Address not found. Try a more specific address.');
        setGeocoding(false);
        return;
      }
      const coords = data.features[0].geometry.coordinates;
      onSave({ ...form, coordinates: coords });
      onClose();
    } catch (e) {
      setError('Geocoding failed. Check your connection and try again.');
    } finally {
      setGeocoding(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Add Stakeholder Location</h2>
          <button onClick={onClose} style={styles.closeBtn}>X</button>
        </div>
        <div style={styles.body}>
          <Field label="Organization Name *">
            <input style={styles.input} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Cape Coral Community Center" />
          </Field>
          <Field label="Address *">
            <input style={styles.input} value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="e.g. 1600 Matthew Drive, Fort Myers, FL" />
            <span style={styles.hint}>Address will be geocoded to map coordinates automatically.</span>
          </Field>
          <div style={styles.row}>
            <Field label="Category" style={{ flex: 1 }}>
              <select style={styles.input} value={form.category} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((c) => (<option key={c.id} value={c.id}>{c.label}</option>))}
              </select>
            </Field>
            <Field label="Engagement Status" style={{ flex: 1 }}>
              <select style={styles.input} value={form.engagementStatus} onChange={(e) => set('engagementStatus', e.target.value)}>
                {ENGAGEMENT_STATUSES.map((s) => (<option key={s.id} value={s.id}>{s.label}</option>))}
              </select>
            </Field>
          </div>
          <div style={styles.row}>
            <Field label="CHNA Quadrant" style={{ flex: 1 }}>
              <select style={styles.input} value={form.chnaQuadrant} onChange={(e) => set('chnaQuadrant', e.target.value)}>
                <option value="">Select</option>
                {CHNA_QUADRANTS.map((q) => (<option key={q.id} value={q.id}>{q.label}</option>))}
              </select>
            </Field>
            <Field label="Number of Households" style={{ flex: 1 }}>
              <input style={styles.input} type="number" min="0" value={form.households} onChange={(e) => set('households', e.target.value)} placeholder="e.g. 4200" />
            </Field>
          </div>
          <Field label="Notes / Description">
            <textarea style={{ ...styles.input, height: 72, resize: 'vertical' }} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Any relevant context about this location..." />
          </Field>
          <Field label="Assign Internal Team Members">
            <div style={styles.teamGrid}>
              {TEAM_MEMBERS.map((tm) => {
                const selected = form.assignedTeam.includes(tm.id);
                return (
                  <button key={tm.id} onClick={() => toggleTeamMember(tm.id)} style={{ ...styles.teamChip, background: selected ? '#1d4ed8' : '#f1f5f9', color: selected ? '#fff' : '#334155', borderColor: selected ? '#1d4ed8' : '#e2e8f0' }}>
                    {tm.name}
                    <span style={styles.teamRole}>{tm.role}</span>
                  </button>
                );
              })}
            </div>
          </Field>
          {error && <p style={styles.error}>{error}</p>}
        </div>
        <div style={styles.footer}>
          <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
          <button onClick={handleSubmit} style={styles.saveBtn} disabled={geocoding}>
            {geocoding ? 'Locating address...' : 'Save Location'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children, style }) => (
  <div style={{ marginBottom: 14, ...style }}>
    <label style={styles.label}>{label}</label>
    {children}
  </div>
);

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(3px)' },
  modal: { background: '#fff', borderRadius: 12, width: 560, maxWidth: '95vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 14px', borderBottom: '1px solid #e2e8f0' },
  title: { margin: 0, fontSize: 17, fontWeight: 600, color: '#0f172a' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#94a3b8', padding: '2px 6px' },
  body: { padding: '18px 24px', overflowY: 'auto', flex: 1 },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 24px', borderTop: '1px solid #e2e8f0' },
  row: { display: 'flex', gap: 14 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' },
  input: { width: '100%', padding: '8px 10px', fontSize: 14, border: '1px solid #cbd5e1', borderRadius: 7, outline: 'none', color: '#0f172a', background: '#f8fafc', boxSizing: 'border-box' },
  hint: { fontSize: 11, color: '#94a3b8', marginTop: 4, display: 'block' },
  teamGrid: { display: 'flex', flexDirection: 'column', gap: 6 },
  teamChip: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '8px 12px', borderRadius: 7, border: '1px solid', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontSize: 13, fontWeight: 500 },
  teamRole: { fontSize: 11, opacity: 0.7, fontWeight: 400, marginTop: 1 },
  error: { color: '#dc2626', fontSize: 13, marginTop: 6 },
  saveBtn: { background: '#1d4ed8', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: 7, cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  cancelBtn: { background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', padding: '9px 20px', borderRadius: 7, cursor: 'pointer', fontSize: 14 },
};

export default AddLocationModal;
