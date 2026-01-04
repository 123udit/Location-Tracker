
import React, { useEffect, useRef } from 'react';
import { Coordinates } from '../types';

interface MapComponentProps {
  location: Coordinates;
}

declare global {
  interface Window {
    google: any;
  }
}

const MapComponent: React.FC<MapComponentProps> = ({ location }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  useEffect(() => {
    const initInterval = setInterval(() => {
      if (mapRef.current && window.google && window.google.maps) {
        clearInterval(initInterval);

        if (!mapInstance.current) {
          mapInstance.current = new window.google.maps.Map(mapRef.current, {
            center: { lat: location.lat, lng: location.lng },
            zoom: 12,
            disableDefaultUI: true,
            zoomControl: false,
            gestureHandling: 'greedy',
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#e9e9e9" }, { lightness: 17 }]
              }
            ],
          });

          markerInstance.current = new window.google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: mapInstance.current,
            animation: window.google.maps.Animation.DROP,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#3b82f6",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#ffffff",
            }
          });
        }
      }
    }, 100);

    return () => clearInterval(initInterval);
  }, []);

  // Handle location changes with animation
  useEffect(() => {
    if (mapInstance.current && markerInstance.current && window.google && window.google.maps) {
      const newPos = { lat: location.lat, lng: location.lng };

      markerInstance.current.setPosition(newPos);
      mapInstance.current.panTo(newPos);

      if (mapInstance.current.getZoom() < 14) {
        mapInstance.current.setZoom(15);
      }
    }
  }, [location]);

  return <div ref={mapRef} className="w-full h-full shadow-inner bg-gray-100" />;
};

export default MapComponent;
