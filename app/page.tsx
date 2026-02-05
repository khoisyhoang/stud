'use client';

import { useState, useMemo, useCallback } from 'react';
import { Navbar } from '@/components/navbar';
import { LiveCounter } from '@/components/live-counter';
import { StudyMap } from '@/components/study-map';
import { SessionCarousel } from '@/components/session-carousel';
import { CreateSessionModal } from '@/components/create-session-modal';
import { FloatingActionButton } from '@/components/floating-action-button';
import { mockSessions } from '@/lib/mock-data';
import type { StudySession } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sessions, setSessions] = useState(mockSessions);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [joinedSessions, setJoinedSessions] = useState<Set<string>>(new Set());
  const [hostedSessions, setHostedSessions] = useState<Set<string>>(new Set());

  // Calculate mock distances for carousel
  const sessionsWithDistance = useMemo(() => {
    const fixedDistances = [1.2, 2.4, 3.1, 4.1, 2.8, 1.5, 3.4, 2.1];
    return sessions.map((session, index) => ({
      ...session,
      distance: fixedDistances[index % fixedDistances.length],
    }));
  }, [sessions]);

  const handleSessionSelect = useCallback((session: StudySession) => {
    setSelectedSessionId(session?.id ?? null);
  }, []);

  const handleViewDetails = useCallback((sessionId: string) => {
    router.push(`/session/${sessionId}`);
  }, [router]);

  const handleCreateSession = useCallback((sessionData: any & { lat: number; lng: number }) => {
    const newSession: StudySession = {
      id: `user-${Date.now()}`,
      title: sessionData.title,
      subject: sessionData.subject,
      type: sessionData.type,
      maxParticipants: sessionData.maxParticipants,
      duration: sessionData.duration,
      lat: sessionData.lat,
      lng: sessionData.lng,
      startTime: new Date(),
      status: 'starting-soon',
      participants: 1, // Host counts as first participant
    };
    
    setSessions(prev => [newSession, ...prev]);
    setHostedSessions(prev => new Set([...prev, newSession.id]));
    setSelectedSessionId(newSession.id);
  }, []);

  const handleJoinSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, participants: Math.min(session.participants + 1, session.maxParticipants) }
        : session
    ));
    setJoinedSessions(prev => new Set([...prev, sessionId]));
  }, []);

  const handleLeaveSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, participants: Math.max(session.participants - 1, 0) }
        : session
    ));
    setJoinedSessions(prev => {
      const newSet = new Set(prev);
      newSet.delete(sessionId);
      return newSet;
    });
  }, []);

  const handleSessionClick = useCallback((session: StudySession) => {
    setSelectedSessionId(session.id);
  }, []);

  const selectedSession = sessions.find(s => s.id === selectedSessionId) || null;

  return (
    <>
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-16">
          {/* Hero Section with Map */}
          <section className="relative">
            {/* Live Counter - positioned above map */}
            <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2">
              <LiveCounter />
            </div>

            {/* Full-width Map */}
            <div className="h-[70vh] min-h-[500px] w-full">
              <StudyMap
                sessions={sessionsWithDistance}
                onSessionSelect={handleSessionClick}
                selectedSessionId={selectedSessionId}
                onViewDetails={handleViewDetails}
              />
            </div>
          </section>

          {/* Upcoming Sessions Section */}
          <section className="border-t border-border/50 bg-background">
            <div className="mx-auto max-w-7xl px-6 py-12">
              <SessionCarousel
                sessions={sessionsWithDistance}
                onSessionSelect={handleSessionClick}
                onJoinSession={handleJoinSession}
                onLeaveSession={handleLeaveSession}
                joinedSessions={joinedSessions}
                hostedSessions={hostedSessions}
              />
            </div>
          </section>

          {/* Footer placeholder for future expansion */}
          <footer className="border-t border-border/50 py-8">
            <div className="mx-auto max-w-7xl px-6">
              <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
                <p>DeepWork Map — Find your focus</p>
                <div className="flex items-center gap-6">
                  <a href="#" className="hover:text-foreground transition-colors">
                    About
                  </a>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </a>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </main>

        {/* Floating Action Button */}
        <FloatingActionButton 
          onClick={() => setIsCreateModalOpen(true)}
          isExpanded={isCreateModalOpen}
        />

        {/* Create Session Modal */}
        <CreateSessionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateSession={handleCreateSession}
          userLocation={userLocation}
        />
      </div>
    </>
  );
}
