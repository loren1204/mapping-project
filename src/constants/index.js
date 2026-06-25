//Single source od truth for categories, CHNA (Q1-Q4), team members, cities, and engagement statuses. 

//Single source od truth for categories, CHNA (Q1-Q4), team members, cities, and engagement statuses. 
// ─── Stakeholder Categories ───────────────────────────────────────────────────
export const CATEGORIES = [
  { id: 'community',   label: 'Gated Community',   color: '#609dffff' },
  { id: 'employer',    label: 'Employer',         color: '#f59e0b' },
  { id: 'CHA',      label: 'Community Health Accounts',color: '#10b981' },
];

// ─── CHNA Quadrants ───────────────────────────────────────────────────────────
// Community Health Needs Assessment quadrants used as choropleth data source.
// Each quadrant has an id matching the GeoJSON feature property "chna_quadrant",
// a display label, a priority tier (1 = highest need), and a fill color.
// ─── CHNA Quadrants ───────────────────────────────────────────────────────────
export const CHNA_QUADRANTS = [
  { id: 'Q1', label: 'Market Area 1 — Cape Coral Hospital',     color: '#F47920' },
  { id: 'Q2', label: 'Market Area 2 — Lee Memorial Hospital',   color: '#7B2D8B' },
  { id: 'Q3', label: 'Market Area 3 — Gulf Coast Medical',      color: '#F5C518' },
  { id: 'Q4', label: 'Market Area 4 — HealthPark Medical',      color: '#3A7D35' },
];

export const CHNA_COLOR_EXPRESSION = [
  'match',
  ['get', 'chna_quadrant'],
  'Q1', '#F47920',
  'Q2', '#7B2D8B',
  'Q3', '#F5C518',
  'Q4', '#3A7D35',
  'rgba(0,0,0,0)',
];
// ─── Internal Team Members ────────────────────────────────────────────────────
export const TEAM_MEMBERS = [
  { id: 'tm1', name: 'Molly Grubbs',   role: 'Network Development Representative' },
  { id: 'tm2', name: 'Carrie Bloemers',   role: 'System Director of Wellness' },
  { id: 'tm3', name: 'Ben Hayden',     role: 'Network Development Representative' },
  { id: 'tm4', name: 'Urte Izdonaviciute',  role: 'Director of Healthy Life Center' },
  //{ id: 'tm5', name: 'Angela Torres',  role: 'Program Coordinator' },
];

// ─── Southwest Florida City Flypoints ─────────────────────────────────────────
export const CITIES = [
  { id: 'cape-coral',  label: 'Cape Coral',  coordinates: [-81.9495, 26.6406], zoom: 12 },
  { id: 'fort-myers',  label: 'Fort Myers',  coordinates: [-81.8723, 26.6400], zoom: 12 },
  { id: 'naples',      label: 'Naples',      coordinates: [-81.7948, 26.1420], zoom: 12 },
  { id: 'lehigh',      label: 'Lehigh Acres',coordinates: [-81.6470, 26.6118], zoom: 12 },
  { id: 'bonita',      label: 'Bonita Springs',coordinates:[-81.7784, 26.3398], zoom: 12 },
];

// ─── Engagement Status Options ────────────────────────────────────────────────
export const ENGAGEMENT_STATUSES = [
  { id: 'active',    label: 'Active',         color: '#10b981' },
  { id: 'pending',   label: 'Pending',        color: '#f59e0b' },
  { id: 'inactive',  label: 'Inactive',       color: '#94a3b8' },
  { id: 'prospect',  label: 'Prospect',       color: '#3b82f6' },
];

// ─── Map Display Modes ────────────────────────────────────────────────────────
export const MAP_MODES = [
  { id: 'light',     label: 'Light',     style: 'mapbox://styles/mapbox/light-v11' },
  { id: 'dark',      label: 'Dark',      style: 'mapbox://styles/mapbox/dark-v11' },
  { id: 'satellite', label: 'Satellite', style: 'mapbox://styles/mapbox/satellite-streets-v12' },
];