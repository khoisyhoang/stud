'use client';

import type { StudySession } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, BookOpen, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SessionCardProps {
  session: StudySession;
  variant?: 'popup' | 'carousel';
  onClose?: () => void;
  onClick?: () => void;
}

const typeLabels: Record<StudySession['type'], string> = {
  silent: 'Silent Focus',
  discussion: 'Discussion',
  'exam-prep': 'Exam Prep',
};

const statusConfig: Record<
  StudySession['status'],
  { label: string; className: string }
> = {
  live: {
    label: 'Live Now',
    className: 'bg-live/20 text-live border-live/30',
  },
  'starting-soon': {
    label: 'Starting Soon',
    className: 'bg-starting-soon/20 text-starting-soon border-starting-soon/30',
  },
  finished: {
    label: 'Finished',
    className: 'bg-finished/20 text-finished border-finished/30',
  },
};

function formatTime(date: Date): string {
  // Use fixed format to avoid hydration issues
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function SessionCard({
  session,
  variant = 'popup',
  onClose,
  onClick,
}: SessionCardProps) {
  const statusStyle = statusConfig[session.status];
  const seatsLeft = session.maxParticipants - session.participants;

  if (variant === 'carousel') {
    return (
      <button
        onClick={onClick}
        className={cn(
          'group flex w-[280px] flex-shrink-0 cursor-pointer flex-col gap-3 rounded-xl border border-border/50 bg-card/80 p-4 text-left backdrop-blur-sm transition-all duration-200',
          'hover:-translate-y-1 hover:border-border hover:bg-card hover:shadow-lg hover:shadow-black/20'
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-medium text-foreground">
              {session.title}
            </h4>
            <p className="mt-0.5 text-xs text-muted-foreground">{session.subject}</p>
          </div>
          <Badge
            variant="outline"
            className={cn('shrink-0 text-[10px]', statusStyle.className)}
          >
            {statusStyle.label}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatTime(session.startTime)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>
              {session.participants}/{session.maxParticipants}
            </span>
          </div>
          {session.distance !== undefined && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{session.distance.toFixed(1)} km</span>
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {seatsLeft > 0 ? `${seatsLeft} seats left` : 'Full'}
          </span>
          <span className="text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            View on map →
          </span>
        </div>
      </button>
    );
  }

  // Popup variant for map markers
  return (
    <div className="w-[320px] overflow-hidden rounded-xl border border-border/50 bg-popover/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div className="border-b border-border/50 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-foreground">
              {session.title}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{session.subject}</span>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn('shrink-0 text-xs', statusStyle.className)}
          >
            {statusStyle.label}
          </Badge>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="truncate text-sm font-medium">
                {formatTime(session.startTime)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Participants</p>
              <p className="text-sm font-medium">
                {session.participants}/{session.maxParticipants}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary">
            <span className="text-xs">⏱️</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="text-sm font-medium">{formatDuration(session.duration)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
          <span className="text-xs text-muted-foreground">Session type:</span>
          <span className="text-sm font-medium">{typeLabels[session.type]}</span>
        </div>
      </div>

      <div className="border-t border-border/50 p-4">
        <Button
          className="w-full"
          disabled={session.status === 'finished' || seatsLeft === 0}
        >
          {session.status === 'finished'
            ? 'Session Ended'
            : seatsLeft === 0
              ? 'Session Full'
              : 'Join Session'}
        </Button>
      </div>
    </div>
  );
}
