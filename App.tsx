
import React, { useState, useCallback, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import { Coordinates, AppStatus } from './types';

const FALLBACK_LOCATION: Coordinates = { lat: 37.7749, lng: -122.4194 };

const App: React.FC = () => {
  const [coords, setCoords] = useState<Coordinates>(FALLBACK_LOCATION);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);

  const handleLocationDiscovery = useCallback((newCoords: Coordinates) => {
    setCoords(newCoords);
    setStatus(AppStatus.SUCCESS);
  }, []);

  const fetchLocation = useCallback(() => {
    setStatus(AppStatus.LOADING);

    if (!navigator.geolocation) {
      handleLocationDiscovery(FALLBACK_LOCATION);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        handleLocationDiscovery(newCoords);
      },
      (error) => {
        console.warn(`Geolocation error: ${error.message}`);
        setStatus(AppStatus.ERROR);
        handleLocationDiscovery(FALLBACK_LOCATION);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, [handleLocationDiscovery]);

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-white font-sans text-slate-800">
      <div className="flex flex-col items-center justify-center py-8 px-4 border-b border-gray-100 bg-white">
        <button
          onClick={fetchLocation}
          className="px-8 py-2 rounded-full border border-gray-300 bg-white text-slate-800 text-base font-medium hover:bg-gray-50 transition-colors mb-4 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
        >
          My Location
        </button>

        <div className="text-center space-y-0.5">
          <p className="text-sm font-medium text-slate-700">
            Latitude: <span className="text-slate-500 font-normal">{coords.lat}</span>
          </p>
          <p className="text-sm font-medium text-slate-700">
            Longitude: <span className="text-slate-500 font-normal">{coords.lng}</span>
          </p>
        </div>
      </div>
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 relative order-2 md:order-1 h-[50vh] md:h-full">
          <MapComponent location={coords} />
        </div>
      </div>
    </div>
  );
};

export default App;
