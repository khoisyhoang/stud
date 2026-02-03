'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { StudySession } from '@/lib/types';
import { SessionCard } from './session-card';
import { cn } from '@/lib/utils';
import * as google from 'google.maps'; // Import Google Maps

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

export function StudyMap({
  sessions,
  onSessionSelect,
  selectedSessionId,
}: StudyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());
  const [mapState, setMapState] = useState<MapState>({
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
  });
  const [selectedSession, setSelectedSession] = useState<StudySession | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
          // User denied location or error - use default
          console.log('[v0] Using default location');
        }
      );
    }
  }, []);

  // Handle external session selection (from carousel)
  useEffect(() => {
    if (selectedSessionId) {
      const session = sessions.find((s) => s.id === selectedSessionId);
      if (session && mapRef.current) {
        mapRef.current.panTo({ lat: session.lat, lng: session.lng });
        mapRef.current.setZoom(16);
        setSelectedSession(session);
      }
    }
  }, [selectedSessionId, sessions]);

  const getMarkerContent = useCallback((session: StudySession, isSelected: boolean) => {
    const statusColors = {
      live: { bg: '#22c55e', glow: 'rgba(34, 197, 94, 0.4)' },
      'starting-soon': { bg: '#eab308', glow: 'rgba(234, 179, 8, 0.4)' },
      finished: { bg: '#6b7280', glow: 'transparent' },
    };

    const colors = statusColors[session.status];
    const size = isSelected ? 20 : 14;
    const glowSize = isSelected ? 32 : 24;

    const container = document.createElement('div');
    container.className = 'marker-container';
    container.style.cssText = `
      position: relative;
      cursor: pointer;
      transition: transform 0.2s ease;
    `;

    if (session.status === 'live') {
      const glow = document.createElement('div');
      glow.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: ${glowSize}px;
        height: ${glowSize}px;
        background: ${colors.glow};
        border-radius: 50%;
        animation: pulse 2s ease-in-out infinite;
      `;
      container.appendChild(glow);
    }

    const dot = document.createElement('div');
    dot.style.cssText = `
      position: relative;
      width: ${size}px;
      height: ${size}px;
      background: ${colors.bg};
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    `;
    container.appendChild(dot);

    return container;
  }, []);

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      if (!mapContainerRef.current || mapRef.current) return;

      try {
        const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;
        await google.maps.importLibrary('marker');

        const map = new Map(mapContainerRef.current, {
          center: mapState.center,
          zoom: mapState.zoom,
          mapId: 'deepwork-map',
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a2a4a' }] },
            { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1a1a2e' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e0e1a' }] },
            { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1f1f3a' }] },
            { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1a2a1a' }] },
          ],
        });

        mapRef.current = map;

        // Add click listener to close popup when clicking map
        map.addListener('click', () => {
          setSelectedSession(null);
          onSessionSelect?.(null as unknown as StudySession);
        });

        setIsLoading(false);
      } catch (error) {
        console.error('[v0] Error initializing map:', error);
        setIsLoading(false);
      }
    };

    // Load Google Maps script
    if (!window.google?.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=marker&v=weekly`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [mapState.center, mapState.zoom, onSessionSelect]);

  // Update markers when sessions change
  useEffect(() => {
    if (!mapRef.current || !window.google?.maps?.marker) return;

    const { AdvancedMarkerElement } = google.maps.marker;

    // Remove old markers that are no longer in sessions
    markersRef.current.forEach((marker, id) => {
      if (!sessions.find((s) => s.id === id)) {
        marker.map = null;
        markersRef.current.delete(id);
      }
    });

    // Add/update markers
    sessions.forEach((session) => {
      let marker = markersRef.current.get(session.id);
      const isSelected = selectedSession?.id === session.id;

      if (!marker) {
        marker = new AdvancedMarkerElement({
          map: mapRef.current,
          position: { lat: session.lat, lng: session.lng },
          content: getMarkerContent(session, isSelected),
        });

        marker.addListener('click', () => {
          setSelectedSession(session);
          onSessionSelect?.(session);
          mapRef.current?.panTo({ lat: session.lat, lng: session.lng });
        });

        markersRef.current.set(session.id, marker);
      } else {
        // Update marker content if selection changed
        marker.content = getMarkerContent(session, isSelected);
      }
    });
  }, [sessions, selectedSession, getMarkerContent, onSessionSelect]);

  // Add user location marker
  useEffect(() => {
    if (!mapRef.current || !userLocation || !window.google?.maps?.marker) return;

    const { AdvancedMarkerElement } = google.maps.marker;

    const userMarkerContent = document.createElement('div');
    userMarkerContent.innerHTML = `
      <div style="
        width: 16px;
        height: 16px;
        background: #3b82f6;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0, 0, 0, 0.3);
      "></div>
    `;

    new AdvancedMarkerElement({
      map: mapRef.current,
      position: userLocation,
      content: userMarkerContent,
      title: 'Your location',
    });
  }, [userLocation]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-border/50">
      {/* Add pulse animation styles */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.3; transform: translate(-50%, -50%) scale(1.3); }
        }
      `}</style>

      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-foreground" />
            <span className="text-sm text-muted-foreground">Loading map...</span>
          </div>
        </div>
      )}

      <div
        ref={mapContainerRef}
        className="h-full w-full"
        style={{ minHeight: '500px' }}
      />

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
