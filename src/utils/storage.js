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


import * as XLSX from 'xlsx'; 
// ─── Export all locations as a downloadable Excel file ───────────────────────
export function exportAsExcel(features) {
  const rows = features.map((f) => ({
    Name: f.properties.name,
    Address: f.properties.address,
    Category: f.properties.category,
    'CHNA Quadrant': f.properties.chnaQuadrant,
    'Engagement Status': f.properties.engagementStatus,
    Households: f.properties.households,
    'Assigned Team': (f.properties.assignedTeam || []).join(', '),
    Description: f.properties.description,
    Longitude: f.geometry.coordinates[0],
    Latitude: f.geometry.coordinates[1],
    'Date Added': f.properties.dateAdded,
    'Last Updated': f.properties.lastUpdated,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Stakeholders');
  XLSX.writeFile(workbook, `leehealth-stakeholders-${new Date().toISOString().split('T')[0]}.xlsx`);
}