'use client';

import { useState, useMemo } from 'react';
import { Navbar } from '@/components/navbar';
import { LiveCounter } from '@/components/live-counter';
import { StudyMap } from '@/components/study-map';
import { SessionCarousel } from '@/components/session-carousel';
import { mockSessions } from '@/lib/mock-data';
import type { StudySession } from '@/lib/types';

export default function HomePage() {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // Calculate mock distances for carousel
  const sessionsWithDistance = useMemo(() => {
    return mockSessions.map((session) => ({
      ...session,
      distance: Math.random() * 5 + 0.2, // Mock distance 0.2-5.2 km
    }));
  }, []);

  const handleSessionSelect = (session: StudySession) => {
    setSelectedSessionId(session?.id ?? null);
  };

  return (
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
              onSessionSelect={handleSessionSelect}
              selectedSessionId={selectedSessionId}
            />
          </div>
        </section>

        {/* Upcoming Sessions Section */}
        <section className="border-t border-border/50 bg-background">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <SessionCarousel
              sessions={sessionsWithDistance}
              onSessionSelect={handleSessionSelect}
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
    </div>
  );
}
