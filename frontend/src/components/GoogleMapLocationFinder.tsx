import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { 
  Search, 
  Crosshair, 
  ExternalLink 
} from 'lucide-react';
import { NATIONAL_ACTIVE_ASSETS } from '../services/proximityValidator';

// Custom Map Marker Icons using Leaflet divIcon for high aesthetics
const createCustomPin = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
        <div style="background: ${color}; color: #ffffff; font-weight: 800; font-size: 11px; padding: 4px 8px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); border: 2px solid #ffffff; white-space: nowrap; display: flex; align-items: center; gap: 4px;">
          <span>📍</span> ${label}
        </div>
        <div style="width: 2px; height: 10px; background: ${color};"></div>
        <div style="width: 8px; height: 8px; border-radius: 50%; background: ${color}; box-shadow: 0 0 10px ${color};"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

interface LocationFinderProps {
  initialLat?: number;
  initialLon?: number;
  initialName?: string;
  onLocationSelected?: (lat: number, lon: number, name: string) => void;
  showFacilityBuffer?: boolean;
}

// Map helper to re-center dynamically
function MapCenterController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

// Map click listener to drop/move pin
function MapClickHandler({ onSelect }: { onSelect: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const PRESET_INDIAN_LOCATIONS = [
  { name: 'Vellore, Tamil Nadu', lat: 12.9165, lon: 79.1325, sector: 'HEALTHCARE' },
  { name: 'Banda, Uttar Pradesh', lat: 25.4764, lon: 80.3344, sector: 'WATER' },
  { name: 'Anantapur, Andhra Pradesh', lat: 14.4137, lon: 77.7126, sector: 'EDUCATION' },
  { name: 'Uttara Kannada, Karnataka', lat: 14.6195, lon: 74.8354, sector: 'ROADS' },
  { name: 'Varanasi, Uttar Pradesh', lat: 25.3176, lon: 82.9739, sector: 'INFRA' },
];

export const GoogleMapLocationFinder: React.FC<LocationFinderProps> = ({
  initialLat = 12.9165,
  initialLon = 79.1325,
  initialName = 'Vellore, Tamil Nadu',
  onLocationSelected,
  showFacilityBuffer = true
}) => {
  const [selectedCoords, setSelectedCoords] = useState<[number, number]>([initialLat, initialLon]);
  const [locationName, setLocationName] = useState(initialName);
  const [mapType, setMapType] = useState<'STREET' | 'SATELLITE'>('STREET');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  // Google Maps Tile URL schemes
  // lyrs=m : Standard Google Roadmap
  // lyrs=y : Hybrid Google Satellite with Labels
  const googleTileUrl = mapType === 'STREET'
    ? 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
    : 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';

  const handleSelectCoords = (lat: number, lon: number, name?: string) => {
    const latFixed = Math.round(lat * 10000) / 10000;
    const lonFixed = Math.round(lon * 10000) / 10000;
    setSelectedCoords([latFixed, lonFixed]);
    const computedName = name || `Pinned Location (${latFixed}° N, ${lonFixed}° E)`;
    setLocationName(computedName);
    if (onLocationSelected) {
      onLocationSelected(latFixed, lonFixed, computedName);
    }
  };

  const handleUseCurrentGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        handleSelectCoords(pos.coords.latitude, pos.coords.longitude, 'My Real GPS Location');
      },
      () => {
        setIsLocating(false);
        // Fallback to Vellore if denied
        handleSelectCoords(12.9165, 79.1325, 'Vellore, Tamil Nadu');
      }
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = PRESET_INDIAN_LOCATIONS.find(
      l => l.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (found) {
      handleSelectCoords(found.lat, found.lon, found.name);
    } else {
      // Simulate fuzzy geocoding around India
      handleSelectCoords(selectedCoords[0] + (Math.random() * 0.04 - 0.02), selectedCoords[1] + (Math.random() * 0.04 - 0.02), searchQuery);
    }
    setSearchQuery('');
  };

  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${selectedCoords[0]},${selectedCoords[1]}`;

  return (
    <div style={{
      background: 'rgba(2, 6, 23, 0.95)',
      border: '1px solid var(--border-glass)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 15px 35px -10px rgba(0,0,0,0.6)'
    }}>
      {/* Top Controls Bar */}
      <div style={{
        padding: '0.85rem 1.25rem',
        background: 'rgba(15, 23, 42, 0.85)',
        borderBottom: '1px solid var(--border-glass)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 240 }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Indian District, Town, or Landmark (e.g. Vellore, Banda)..."
              style={{
                width: '100%',
                background: 'rgba(2, 6, 23, 0.7)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.45rem 0.8rem 0.45rem 2.2rem',
                color: 'var(--text-main)',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            />
          </div>
          <button type="submit" className="btn-secondary" style={{ padding: '0.45rem 0.8rem', fontSize: '0.75rem' }}>
            Find
          </button>
        </form>

        {/* GPS and Map Style Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={handleUseCurrentGPS}
            disabled={isLocating}
            className="btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.45rem 0.8rem' }}
          >
            <Crosshair size={14} color="#10b981" className={isLocating ? 'animate-spin' : ''} />
            <span>{isLocating ? 'Locating...' : 'Use My GPS'}</span>
          </button>

          <div style={{ display: 'flex', background: 'rgba(2, 6, 23, 0.8)', padding: 2, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <button
              type="button"
              onClick={() => setMapType('STREET')}
              style={{
                background: mapType === 'STREET' ? '#10b981' : 'transparent',
                color: mapType === 'STREET' ? '#022c22' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.7rem',
                border: 'none',
                borderRadius: 4,
                padding: '0.35rem 0.65rem',
                cursor: 'pointer'
              }}
            >
              Google Streets
            </button>
            <button
              type="button"
              onClick={() => setMapType('SATELLITE')}
              style={{
                background: mapType === 'SATELLITE' ? '#06b6d4' : 'transparent',
                color: mapType === 'SATELLITE' ? '#022c22' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.7rem',
                border: 'none',
                borderRadius: 4,
                padding: '0.35rem 0.65rem',
                cursor: 'pointer'
              }}
            >
              Google Satellite
            </button>
          </div>
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div style={{
        padding: '0.45rem 1.25rem',
        background: 'rgba(10, 15, 29, 0.8)',
        borderBottom: '1px solid var(--border-glass)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto'
      }}>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 800, whiteSpace: 'nowrap' }}>
          Quick Locations:
        </span>
        {PRESET_INDIAN_LOCATIONS.map((loc, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectCoords(loc.lat, loc.lon, loc.name)}
            style={{
              padding: '0.2rem 0.55rem',
              borderRadius: 4,
              border: locationName === loc.name ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
              background: locationName === loc.name ? 'rgba(16, 185, 129, 0.2)' : 'rgba(15, 23, 42, 0.6)',
              color: locationName === loc.name ? '#34d399' : 'var(--text-muted)',
              fontSize: '0.7rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {loc.name.split(',')[0]}
          </button>
        ))}
      </div>

      {/* Interactive Leaflet Map Container with Google Maps Tiles */}
      <div style={{ position: 'relative', width: '100%', height: 320, zIndex: 10 }}>
        <MapContainer
          center={selectedCoords}
          zoom={13}
          style={{ width: '100%', height: '100%' }}
          zoomControl={true}
        >
          <MapCenterController center={selectedCoords} zoom={13} />
          <MapClickHandler onSelect={(lat, lon) => handleSelectCoords(lat, lon)} />

          {/* Google Maps TileLayer */}
          <TileLayer
            attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
            url={googleTileUrl}
            maxZoom={20}
          />

          {/* 3.5 km Ground-Truth Proximity Buffer Circle */}
          {showFacilityBuffer && (
            <Circle
              center={selectedCoords}
              radius={3500}
              pathOptions={{
                color: '#f59e0b',
                fillColor: '#f59e0b',
                fillOpacity: 0.1,
                dashArray: '4, 6',
                weight: 1.5
              }}
            >
              <Popup>
                <div style={{ color: '#0f172a', fontSize: '11px', fontWeight: 600 }}>
                  <strong>3.5 KM Proximity Buffer Limit</strong><br />
                  Facilities within this boundary trigger Capex De-prioritization.
                </div>
              </Popup>
            </Circle>
          )}

          {/* Main Selected Location Pin */}
          <Marker
            position={selectedCoords}
            icon={createCustomPin('#10b981', locationName)}
          >
            <Popup>
              <div style={{ color: '#0f172a', fontSize: '12px' }}>
                <strong style={{ color: '#059669' }}>Selected Citizen Location</strong><br />
                {locationName}<br />
                <span style={{ fontSize: '10px', color: '#64748b' }}>
                  Lat: {selectedCoords[0]}, Lon: {selectedCoords[1]}
                </span>
              </div>
            </Popup>
          </Marker>

          {/* Existing Public Facilities Markers nearby */}
          {NATIONAL_ACTIVE_ASSETS.map((fac) => (
            <Marker
              key={fac.id}
              position={[fac.latitude, fac.longitude]}
              icon={createCustomPin('#6366f1', fac.name)}
            >
              <Popup>
                <div style={{ color: '#0f172a', fontSize: '11px' }}>
                  <strong style={{ color: '#4f46e5' }}>Active Public Facility</strong><br />
                  {fac.name}<br />
                  Type: {fac.type}<br />
                  Status: {fac.operationalStatus} ({100 - fac.capacityUtilizationPct}% Vacant)
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Bottom Location Telemetry Ribbon */}
      <div style={{
        padding: '0.75rem 1.25rem',
        background: 'rgba(15, 23, 42, 0.95)',
        borderTop: '1px solid var(--border-glass)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
          <span style={{ color: '#f8fafc', fontWeight: 700 }}>
            {locationName}
          </span>
          <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            ({selectedCoords[0]}° N, {selectedCoords[1]}° E)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#38bdf8', fontSize: '0.7rem' }}>
            Click anywhere on Google Map to re-pin location
          </span>
          <a
            href={googleMapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#34d399',
              fontWeight: 700,
              textDecoration: 'none',
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '0.3rem 0.65rem',
              borderRadius: 6,
              border: '1px solid rgba(16, 185, 129, 0.25)'
            }}
          >
            <span>Open in Google Maps</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};
