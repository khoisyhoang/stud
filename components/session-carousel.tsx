'use client';

import { useRef } from 'react';
import type { StudySession } from '@/lib/types';
import { SessionCard } from './session-card';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SessionCarouselProps {
  sessions: StudySession[];
  onSessionSelect: (session: StudySession) => void;
  onJoinSession?: (sessionId: string) => void;
  onLeaveSession?: (sessionId: string) => void;
  joinedSessions?: Set<string>;
  hostedSessions?: Set<string>;
}

export function SessionCarousel({ 
  sessions, 
  onSessionSelect, 
  onJoinSession, 
  onLeaveSession, 
  joinedSessions = new Set(), 
  hostedSessions = new Set() 
}: SessionCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 300;
    const newScrollLeft =
      scrollContainerRef.current.scrollLeft +
      (direction === 'left' ? -scrollAmount : scrollAmount);
    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  // Filter for upcoming sessions (live or starting soon)
  const upcomingSessions = sessions.filter(
    (s) => s.status === 'live' || s.status === 'starting-soon'
  );

  if (upcomingSessions.length === 0) return null;

  return (
    <section className="relative">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Upcoming Sessions</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Join a study session near you
          </p>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Scroll left</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Scroll right</span>
          </Button>
        </div>
      </div>

      <div className="relative -mx-6 px-6">
        {/* Gradient overlays for scroll indication */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-background to-transparent" />

        <div
          ref={scrollContainerRef}
          className="scrollbar-hide flex gap-4 overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {upcomingSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              variant="carousel"
              onClick={() => onSessionSelect(session)}
              onJoinSession={onJoinSession}
              onLeaveSession={onLeaveSession}
              isUserJoined={joinedSessions.has(session.id)}
              isUserHost={hostedSessions.has(session.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
