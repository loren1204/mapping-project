//adds the CHNA fill, outline, and label layers to Mapbox. Has a toggle function and a click handler so clicking a regions shows info. 

import chnaRegions from '../data/fl_florida_zip_codes_geo.min.json?url';
import { CHNA_COLOR_EXPRESSION } from '../constants/index.js';

const SOURCE_ID = 'chna-regions';
const FILL_LAYER_ID = 'chna-fill';
const LINE_LAYER_ID = 'chna-outline';
const LABEL_LAYER_ID = 'chna-labels';

// ─── Add choropleth layers to an existing map instance ────────────────────────
export function addChoroplethLayers(map) {
  if (map.getSource(SOURCE_ID)) return; // already added

map.addSource(SOURCE_ID, {
  type: 'geojson',
  data: '/src/data/fl_florida_zip_codes_geo.min.json',
});

  // Fill layer — colored by CHNA quadrant
  map.addLayer({
    id: FILL_LAYER_ID,
    type: 'fill',
    source: SOURCE_ID,
    paint: {
      'fill-color': CHNA_COLOR_EXPRESSION,
      'fill-opacity': 0.35,
    },
  });

  // Outline layer
  map.addLayer({
    id: LINE_LAYER_ID,
    type: 'line',
    source: SOURCE_ID,
    paint: {
      'line-color': '#1e293b',
      'line-width': 1.5,
      'line-opacity': 0.6,
    },
  });

  // Label layer — shows region name
  map.addLayer({
    id: LABEL_LAYER_ID,
    type: 'symbol',
    source: SOURCE_ID,
    layout: {
      'text-field': ['get', 'name'],
      'text-size': 11,
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-anchor': 'center',
    },
    paint: {
      'text-color': '#0f172a',
      'text-halo-color': '#ffffff',
      'text-halo-width': 1.5,
    },
  });
}

// ─── Toggle visibility ────────────────────────────────────────────────────────
export function setChoroplethVisibility(map, visible) {
  const val = visible ? 'visible' : 'none';
  [FILL_LAYER_ID, LINE_LAYER_ID, LABEL_LAYER_ID].forEach((id) => {
    if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', val);
  });
}

// ─── Attach click handler to choropleth regions ───────────────────────────────
// Returns a cleanup function — call it on unmount.
export function attachChoroplethClickHandler(map, onRegionClick) {
  const handler = (e) => {
    if (!e.features?.length) return;
    const props = e.features[0].properties;
    onRegionClick(props);
  };

  map.on('click', FILL_LAYER_ID, handler);

  // Pointer cursor on hover
  const mouseenter = () => (map.getCanvas().style.cursor = 'pointer');
  const mouseleave = () => (map.getCanvas().style.cursor = '');
  map.on('mouseenter', FILL_LAYER_ID, mouseenter);
  map.on('mouseleave', FILL_LAYER_ID, mouseleave);

  return () => {
    map.off('click', FILL_LAYER_ID, handler);
    map.off('mouseenter', FILL_LAYER_ID, mouseenter);
    map.off('mouseleave', FILL_LAYER_ID, mouseleave);
  };
}

export { FILL_LAYER_ID, SOURCE_ID };