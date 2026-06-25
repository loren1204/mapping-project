import { useState, useEffect } from 'react';
import Map from './components/Map.jsx';
import Toolbar from './components/Toolbar.jsx';
import LocationList from './components/LocationList.jsx';
import AddLocationModal from './components/AddLocationModal.jsx';
import RegionPanel from './components/RegionPanel.jsx';
import { loadLocations, addLocation, updateLocation, deleteLocation, exportAsExcel } from './utils/storage.js';
import logo from './assets/PartnersInWellness(1).png';
import './App.css';

function App() {
  const [locations, setLocations] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [choroplethVisible, setChoroplethVisible] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [mapStyle, setMapStyle] = useState('light');
  const [is3D, setIs3D] = useState(false);

  useEffect(() => {
    loadLocations().then(setLocations);
  }, []);

  const handleAddLocation = async (formData) => {
    const feature = await addLocation(formData);
    if (feature) setLocations((prev) => [...prev, feature]);
  };

  const handleUpdateLocation = async (id, fields) => {
    const updated = await updateLocation(id, fields);
    if (updated) {
      setLocations((prev) => prev.map((f) => (f.properties.id === id ? updated : f)));
    }
  };

  const handleDeleteLocation = async (id) => {
    const success = await deleteLocation(id);
    if (success) setLocations((prev) => prev.filter((f) => f.properties.id !== id));
  };

  return (
    <div className="app-root">
      <div className="app-header">
        <img src={logo} alt="Lee Health Partners In Wellness" className="app-header-logo" />
      </div>

      <div style={{ padding: '0 14px 14px' }}>
        <Toolbar
          onCitySelect={setSelectedCity}
          choroplethVisible={choroplethVisible}
          onToggleChoropleth={() => setChoroplethVisible((v) => !v)}
          onAddLocation={() => setShowAddModal(true)}
          onExport={() => exportAsExcel(locations)}
          mapStyle={mapStyle}
          onMapStyleChange={setMapStyle}
          is3D={is3D}
          onToggle3D={() => setIs3D((v) => !v)}
        />
      </div>

      <div className="app-body">
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

        <div className="map-wrap">
          <Map
            locations={locations}
            selectedCity={selectedCity}
            choroplethVisible={choroplethVisible}
            onRegionClick={setSelectedRegion}
            mapStyle={mapStyle}
            is3D={is3D}
          />
          <RegionPanel
            region={selectedRegion}
            onClose={() => setSelectedRegion(null)}
          />
        </div>
      </div>

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