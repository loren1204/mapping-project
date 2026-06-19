// tag-chna-precise.js
// Based on 2023 PRC CHNA Lee County market area map (exact visual read)
// Run: node tag-chna-precise.js
// Place in same folder as CHNAmap.json
// Output: chna-regions-precise.geojson — ready for Mapbox / mapshaper

import { readFileSync, writeFileSync } from 'fs';

// ─── Complete zip-to-market-area mapping (read directly from CHNA map image) ─
const MARKET_AREAS = {

  // ── Market Area 1 (Orange) — Cape Coral Hospital ─────────────────────────
  '33921': 'Q1',   // Pine Island North / Bokeelia island
  '33922': 'Q1',   // Pine Island (Matlacha area)
  '33924': 'Q1',   // Captiva / outer islands
  '33945': 'Q1',   // Pineland / SW Pine Island
  '33956': 'Q1',   // St. James City / lower Pine Island
  '33957': 'Q1',   // Sanibel Island — appears as green (MA4) — see note below
  '33993': 'Q1',   // NW Cape Coral
  '33991': 'Q1',   // W Cape Coral
  '33990': 'Q1',   // Central Cape Coral / E Cape Coral
  '33909': 'Q1',   // NE Cape Coral
  '33904': 'Q1',   // SE Cape Coral / Cape Coral core
  '33914': 'Q1',   // SW Cape Coral

  // ── Market Area 2 (Purple) — Lee Memorial Hospital ───────────────────────
  '33903': 'Q2',   // North Fort Myers
  '33917': 'Q2',   // North Fort Myers / Bayshore
  '33905': 'Q2',   // East Fort Myers / Buckingham
  '33916': 'Q2',   // Downtown Fort Myers core
  '33901': 'Q2',   // Fort Myers central
  '33920': 'Q2',   // Alva / far east Lee County
  '33955': 'Q2',   // Punta Gorda Isles (Charlotte border)
  '33982': 'Q2',   // Punta Gorda / Charlotte County border zip

  // ── Market Area 3 (Yellow) — Gulf Coast Medical Center ───────────────────
  '33907': 'Q3',   // Fort Myers / south central
  '33912': 'Q3',   // Fort Myers SE / Daniels corridor
  '33913': 'Q3',   // Gateway / Ft Myers East
  '33966': 'Q3',   // Fort Myers / Colonial area
  '33967': 'Q3',   // Three Oaks / Ben Hill Griffin
  '33965': 'Q3',   // Fort Myers / US41 corridor
  '33971': 'Q3',   // Lehigh Acres West
  '33972': 'Q3',   // Lehigh Acres Central
  '33973': 'Q3',   // Lehigh Acres SW
  '33974': 'Q3',   // Lehigh Acres SE
  '33976': 'Q3',   // Lehigh Acres East
  '33936': 'Q3',   // Lehigh Acres / La Belle border

  // ── Market Area 4 (Green) — HealthPark Medical Center ────────────────────
  '33919': 'Q4',   // McGregor / south Fort Myers
  '33908': 'Q4',   // Fort Myers Beach area / Iona
  '33931': 'Q4',   // Fort Myers Beach / Estero Island
  '33957': 'Q4',   // Sanibel Island  ← overrides MA1 assignment above
  '33928': 'Q4',   // Estero
  '34134': 'Q4',   // Bonita Springs North / Barefoot Beach
  '34135': 'Q4',   // Bonita Springs core
  '34110': 'Q4',   // Naples North / Immokalee Rd corridor
  '34119': 'Q4',   // Naples NW / Vanderbilt Beach area
  // 33946 intentionally excluded — Charlotte County, outside Lee Health service area
};

// Fix: 33957 (Sanibel) is GREEN (MA4) on the map, not orange — correct the duplicate
// The object key is overwritten by the second assignment above, so Q4 wins. ✓

const LABELS = {
  Q1: 'Market Area 1',
  Q2: 'Market Area 2',
  Q3: 'Market Area 3',
  Q4: 'Market Area 4',
};

const COLORS = {
  Q1: '#F47920',   // Orange
  Q2: '#7B2D8B',   // Purple
  Q3: '#F5C518',   // Yellow/Gold
  Q4: '#3A7D35',   // Green
};

// ─── Read input ───────────────────────────────────────────────────────────────
let raw;
try {
  raw = readFileSync('./fl_florida_zip_codes_geo.json', 'utf8');
} catch {
  console.error('❌  fl_florida_zip_codes_geo.json not found. Place this script in the same folder as CHNAmap.json');
  process.exit(1);
}

const geojson = JSON.parse(raw);
let tagged = 0;
const untagged = [];

const features = geojson.features.map((feature) => {
  const zip = feature.properties?.ZCTA5CE20 || feature.properties?.zip || '';
  const quadrant = MARKET_AREAS[zip];

  if (quadrant) {
    tagged++;
    return {
      ...feature,
      properties: {
        ...feature.properties,
        zip,
        chna_quadrant: quadrant,
        market_area: LABELS[quadrant],
        fill_color: COLORS[quadrant],
      },
    };
  } else {
    untagged.push(zip);
    return {
      ...feature,
      properties: {
        ...feature.properties,
        zip,
        chna_quadrant: 'UNASSIGNED',
        market_area: 'Outside Lee Health Service Area',
        fill_color: '#cccccc',
      },
    };
  }
});

const output = { type: 'FeatureCollection', features };
writeFileSync('./fl_florida_zip_codes_geo.json', JSON.stringify(output, null, 2));

console.log('\n✅  Done!');
console.log(`   Tagged:   ${tagged} zip codes`);
console.log(`   Untagged: ${untagged.length} zip codes`);
if (untagged.length > 0) {
  console.log(`\n   Untagged zips (outside Lee Health service area or not on map):`);
  console.log(`   ${untagged.join(', ')}`);
}

console.log('\n   Market Area Summary:');
['Q1','Q2','Q3','Q4'].forEach(q => {
  const count = features.filter(f => f.properties.chna_quadrant === q).length;
  console.log(`   ${LABELS[q]}: ${count} zips`);
});

console.log('\n   Output: fl_florida_zip_codes_geo.json\n');
