import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { addChoroplethLayers, attachChoroplethClickHandler, setChoroplethVisibility } from '../layers/choropleth.js';
import { CATEGORIES } from '../constants/index.js';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

const Map = ({ locations, selectedCity, choroplethVisible, onRegionClick }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerInstancesRef = useRef([]);
  const choroplethCleanupRef = useRef(null);

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-81.8723, 26.6400],
      zoom: 9,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    mapRef.current.addControl(new mapboxgl.ScaleControl(), 'bottom-right');

    mapRef.current.on('load', () => {
      addChoroplethLayers(mapRef.current);
      choroplethCleanupRef.current = attachChoroplethClickHandler(mapRef.current, onRegionClick);
    });

    return () => {
      if (choroplethCleanupRef.current) choroplethCleanupRef.current();
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current?.isStyleLoaded()) return;
    setChoroplethVisibility(mapRef.current, choroplethVisible);
  }, [choroplethVisible]);

  useEffect(() => {
    if (!mapRef.current) return;
    markerInstancesRef.current.forEach((m) => m.remove());
    markerInstancesRef.current = [];
    locations.forEach((feature) => {
      const { name, category, engagementStatus } = feature.properties;
      const [lng, lat] = feature.geometry.coordinates;
      const categoryColor = CATEGORIES.find((c) => c.id === category)?.color || '#64748b';
      const el = document.createElement('div');
      el.style.cssText = 'width:14px;height:14px;border-radius:50%;background:' + categoryColor + ';border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer;';
      const popup = new mapboxgl.Popup({ offset: 14, closeButton: false })
        .setHTML('<div style="font-family:system-ui;padding:4px 2px;"><strong>' + name + '</strong><div style="font-size:11px;color:#64748b;margin-top:2px;">' + category + ' · ' + engagementStatus + '</div></div>');
      const instance = new mapboxgl.Marker({ element: el }).setLngLat([lng, lat]).setPopup(popup).addTo(mapRef.current);
      markerInstancesRef.current.push(instance);
    });
  }, [locations]);

  useEffect(() => {
    if (mapRef.current && selectedCity) {
      mapRef.current.flyTo({ center: selectedCity.coordinates, zoom: selectedCity.zoom || 12, essential: true, duration: 1200 });
    }
  }, [selectedCity]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />;
};

export default Map;
