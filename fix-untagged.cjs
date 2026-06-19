const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'mapping-project', 'src', 'data', 'chna-regions.geojson');

const EXTRA = {
  '33954': 'Q3', '33983': 'Q3', '33953': 'Q1', '33950': 'Q1',
  '34109': 'Q4', '34113': 'Q4', '33981': 'Q4', '33948': 'Q1',
  '34105': 'Q4', '34117': 'Q4', '33947': 'Q1', '33930': 'Q3',
  '33946': 'Q1', '33980': 'Q3', '34114': 'Q4', '33935': 'Q3',
  '34103': 'Q4', '33944': 'Q3', '33952': 'Q2', '34101': 'Q4',
  '34102': 'Q4', '34116': 'Q4', '34104': 'Q4', '34108': 'Q4',
  '34112': 'Q4', '33960': 'Q3'
};

const LABELS = {
  Q1: 'Market Area 1', Q2: 'Market Area 2',
  Q3: 'Market Area 3', Q4: 'Market Area 4',
};

const raw = fs.readFileSync(inputPath, 'utf8');
const geojson = JSON.parse(raw);

const features = geojson.features.map(f => {
  if (f.properties.chna_quadrant !== 'UNKNOWN') return f;
  const zip = f.properties.zip;
  const q = EXTRA[zip];
  if (!q) return f;
  return { ...f, properties: { ...f.properties, chna_quadrant: q, market_area: LABELS[q] } };
});

fs.writeFileSync(inputPath, JSON.stringify({ type: 'FeatureCollection', features }, null, 2));
console.log('Done! Remaining UNKNOWN zips left as-is (Collier/Charlotte).');
