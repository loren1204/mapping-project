//handles all localStorage read/writes and the buildFeature() function that turns form data into a proper GeoJSON Feature as exportAsGeoJSON() which downloads everything as a real .geojson file 

//handles all localStorage read/writes and the buildFeature() function that turns form data into a proper GeoJSON Feature as exportAsGeoJSON() which downloads everything as a real .geojson file 
const STORAGE_KEY = 'leehealth_locations';

// ─── Read ─────────────────────────────────────────────────────────────────────
export function loadLocations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ─── Write ────────────────────────────────────────────────────────────────────
export function saveLocations(locations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
  } catch (err) {
    console.error('Failed to save locations:', err);
  }
}

// ─── Build a GeoJSON Feature from form data ───────────────────────────────────
// This is the core structure. Every location stored is a valid GeoJSON Feature.
export function buildFeature({ name, address, coordinates, category, description, households, chnaQuadrant, assignedTeam, engagementStatus }) {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates, // [lng, lat]
    },
    properties: {
      id: crypto.randomUUID(),
      name,
      address,
      category,
      description,
      households: households ? parseInt(households, 10) : null,
      chnaQuadrant: chnaQuadrant || null, //replace with Fiscal Year 
      assignedTeam: assignedTeam || [],   // array of team member ids
      engagementStatus: engagementStatus || 'prospect',
      dateAdded: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    },
  };
}

// ─── Update a feature's properties and stamp lastUpdated ─────────────────────
export function updateFeature(features, id, fields) {
  return features.map((f) => {
    if (f.properties.id !== id) return f;
    return {
      ...f,
      properties: {
        ...f.properties,
        ...fields,
        lastUpdated: new Date().toISOString().split('T')[0],
      },
    };
  });
}

// ─── Export all locations as a downloadable GeoJSON file ─────────────────────
export function exportAsGeoJSON(features) {
  const collection = { type: 'FeatureCollection', features };
  const blob = new Blob([JSON.stringify(collection, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `leehealth-stakeholders-${new Date().toISOString().split('T')[0]}.geojson`;
  a.click();
  URL.revokeObjectURL(url);
}