import { useState, useEffect } from 'react';
import Map from './components/Map.jsx';
import Toolbar from './components/Toolbar.jsx';
import LocationList from './components/LocationList.jsx';
import AddLocationModal from './components/AddLocationModal.jsx';
import RegionPanel from './components/RegionPanel.jsx';
import { loadLocations, saveLocations, buildFeature, updateFeature, exportAsExcel } from './utils/storage.js';
import logo from './assets/lee-health-logo.png';
import './App.css';

function App() {
  // ─── State ──────────────────────────────────────────────────────────────────
  const [locations, setLocations] = useState(() => loadLocations());
  const [selectedCity, setSelectedCity] = useState(null);
  const [choroplethVisible, setChoroplethVisible] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);

  // ─── Persist to localStorage on every change ────────────────────────────────
  useEffect(() => {
    saveLocations(locations);
  }, [locations]);

  // ─── Location handlers ───────────────────────────────────────────────────────
  const handleAddLocation = (formData) => {
    const feature = buildFeature(formData);
    setLocations((prev) => [...prev, feature]);
  };

  const handleUpdateLocation = (id, fields) => {
    setLocations((prev) => updateFeature(prev, id, fields));
  };

  const handleDeleteLocation = (id) => {
    setLocations((prev) => prev.filter((f) => f.properties.id !== id));
  };

  return (
    <div className="app-root">
      {/* App header */}
      <div className="app-header">
        <img src={logo} alt="Lee Health Partners In Wellness" className="app-header-logo" />
      </div>

      {/* Top toolbar */}
      <div style={{ padding: '0 14px 14px' }}>
        <Toolbar
          onCitySelect={setSelectedCity}
          choroplethVisible={choroplethVisible}
          onToggleChoropleth={() => setChoroplethVisible((v) => !v)}
          onAddLocation={() => setShowAddModal(true)}
          onExport={() => exportAsExcel(locations)}
        />
      </div>

      {/* Main content */}
      <div className="app-body">
        {/* Left sidebar */}
        <aside className="sidebar glass">
          <div className="sidebar-header">
            <h1 className="sidebar-title">Stakeholder Locations</h1>
            <span className="sidebar-count">{locations.length}</span>
          </div>
          <LocationList
            locations={locations}
            onDelete={handleDeleteLocation}
            onUpdate={handleUpdateLocation}
          />
        </aside>

        {/* Map */}
        <div className="map-wrap">
          <Map
            locations={locations}
            selectedCity={selectedCity}
            choroplethVisible={choroplethVisible}
            onRegionClick={setSelectedRegion}
          />
          {/* Region info panel — overlays the map */}
          <RegionPanel
            region={selectedRegion}
            onClose={() => setSelectedRegion(null)}
          />
        </div>
      </div>

      {/* Add location modal */}
      {showAddModal && (
        <AddLocationModal
          onSave={handleAddLocation}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

export default App;