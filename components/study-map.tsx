'use client';

import { useCallback, useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import type { StudySession } from '@/lib/types';
import { SessionCard } from './session-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StudyMapProps {
  sessions: StudySession[];
  onSessionSelect?: (session: StudySession) => void;
  selectedSessionId?: string | null;
}

interface MapState {
  center: { lat: number; lng: number };
  zoom: number;
}

const DEFAULT_CENTER = { lat: 37.7849, lng: -122.4094 }; // San Francisco
const DEFAULT_ZOOM = 14;

const mapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a2a4a' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1a1a2e' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e0e1a' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1f1f3a' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1a2a1a' }] },
];

export function StudyMap({
  sessions,
  onSessionSelect,
  selectedSessionId,
}: StudyMapProps) {
  const [mapState, setMapState] = useState<MapState>({
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
  });
  const [selectedSession, setSelectedSession] = useState<StudySession | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Request user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
          setMapState((prev) => ({ ...prev, center: loc }));
        },
        () => {
          console.log('[v0] Using default location');
        }
      );
    }
  }, [navigator.geolocation]);

  // Handle external session selection (from carousel)
  useEffect(() => {
    if (selectedSessionId) {
      const session = sessions.find((s) => s.id === selectedSessionId);
      if (session && map) {
        map.panTo({ lat: session.lat, lng: session.lng });
        map.setZoom(16);
        setSelectedSession(session);
      }
    }
  }, [selectedSessionId, sessions, map]);

  const getMarkerIcon = useCallback((session: StudySession, isSelected: boolean) => {
    const statusColors = {
      live: '#22c55e',
      'starting-soon': '#eab308',
      finished: '#6b7280',
    };

    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: statusColors[session.status],
      fillOpacity: 1,
      strokeColor: 'white',
      strokeWeight: 2,
      scale: isSelected ? 10 : 7,
    };
  }, []);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMarkerClick = useCallback((session: StudySession) => {
    setSelectedSession(session);
    onSessionSelect?.(session);
    if (map) {
      map.panTo({ lat: session.lat, lng: session.lng });
      map.setZoom(16);
    }
  }, [map, onSessionSelect]);

  const handleMapClick = useCallback(() => {
    setSelectedSession(null);
    onSessionSelect?.(null as unknown as StudySession);
  }, [onSessionSelect]);

  const handleFocusOnCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const loc = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      
      setUserLocation(loc);
      setMapState({ center: loc, zoom: 16 });
      
      if (map) {
        map.panTo(loc);
        map.setZoom(16);
      }
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('Location access denied. Please enable location permissions in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            alert('Location request timed out.');
            break;
          default:
            alert('An unknown error occurred while getting your location.');
        }
      } else {
        alert('Failed to get your location.');
      }
    }
  }, [map]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-border/50">
      {!isLoaded ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-foreground" />
            <span className="text-sm text-muted-foreground">Loading map...</span>
          </div>
        </div>
      ) : (
        <GoogleMap
          mapContainerStyle={{
            width: '100%',
            height: '100%',
            minHeight: '500px',
          }}
          center={mapState.center}
          zoom={mapState.zoom}
          options={{
            styles: mapStyles,
            gestureHandling: 'auto',
            scrollwheel: true,
            zoomControl: true,
            mapId: 'deepwork-map',
          }}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
        >
          {/* User location marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#3b82f6',
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 3,
                scale: 8,
              }}
              title="Your location"
            />
          )}

          {/* Session markers */}
          {sessions.map((session) => {
            const isSelected = selectedSession?.id === session.id;
            return (
              <Marker
                key={session.id}
                position={{ lat: session.lat, lng: session.lng }}
                icon={getMarkerIcon(session, isSelected)}
                onClick={() => handleMarkerClick(session)}
              />
            );
          })}
        </GoogleMap>
      )}

      {/* Session popup */}
      {selectedSession && (
        <div
          className={cn(
            'absolute left-4 top-4 z-20 animate-in fade-in slide-in-from-left-2 duration-200',
            'sm:left-6 sm:top-6'
          )}
        >
          <SessionCard
            session={selectedSession}
            variant="popup"
            onClose={() => setSelectedSession(null)}
          />
        </div>
      )}

      {/* Map controls */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform">
        <Button
          onClick={handleFocusOnCurrentLocation}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 border-0 px-8"
          title="Focus on my location"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Sessions nearby
        </Button>
      </div>

      {/* Map legend */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2 rounded-lg border border-border/50 bg-card/90 p-3 text-xs backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-live shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          <span className="text-muted-foreground">Live now</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-starting-soon" />
          <span className="text-muted-foreground">Starting soon</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-finished" />
          <span className="text-muted-foreground">Finished</span>
        </div>
      </div>
    </div>
  );
}
