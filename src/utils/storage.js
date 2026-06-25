import { supabase } from './supabaseClient.js';
import * as XLSX from 'xlsx';

function rowToFeature(row) {
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [row.lng, row.lat] },
    properties: {
      id: row.id,
      name: row.name,
      address: row.address,
      category: row.category,
      description: row.description,
      households: row.households,
      chnaQuadrant: row.chna_quadrant,
      assignedTeam: row.assigned_team || [],
      engagementStatus: row.engagement_status,
      dateAdded: row.date_added,
      lastUpdated: row.last_updated,
    },
  };
}

function formToRow({ name, address, coordinates, category, description, households, chnaQuadrant, assignedTeam, engagementStatus }) {
  return {
    name, address, category, description,
    households: households ? parseInt(households, 10) : null,
    chna_quadrant: chnaQuadrant || null,
    assigned_team: assignedTeam || [],
    engagement_status: engagementStatus || 'prospect',
    lng: coordinates[0],
    lat: coordinates[1],
  };
}

export async function loadLocations() {
  const { data, error } = await supabase.from('locations').select('*');
  if (error) { console.error('Failed to load locations:', error); return []; }
  return data.map(rowToFeature);
}

export async function addLocation(formData) {
  const { data, error } = await supabase.from('locations').insert(formToRow(formData)).select().single();
  if (error) { console.error('Failed to add location:', error); return null; }
  return rowToFeature(data);
}

export async function updateLocation(id, fields) {
  const patch = {};
  if (fields.name !== undefined) patch.name = fields.name;
  if (fields.address !== undefined) patch.address = fields.address;
  if (fields.category !== undefined) patch.category = fields.category;
  if (fields.description !== undefined) patch.description = fields.description;
  if (fields.households !== undefined) patch.households = fields.households ? parseInt(fields.households, 10) : null;
  if (fields.chnaQuadrant !== undefined) patch.chna_quadrant = fields.chnaQuadrant;
  if (fields.assignedTeam !== undefined) patch.assigned_team = fields.assignedTeam;
  if (fields.engagementStatus !== undefined) patch.engagement_status = fields.engagementStatus;
  patch.last_updated = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase.from('locations').update(patch).eq('id', id).select().single();
  if (error) { console.error('Failed to update location:', error); return null; }
  return rowToFeature(data);
}

export async function deleteLocation(id) {
  const { error } = await supabase.from('locations').delete().eq('id', id);
  if (error) { console.error('Failed to delete location:', error); return false; }
  return true;
}

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