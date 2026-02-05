'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  BookOpen, 
  MapPin, 
  Send,
  MessageCircle,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Settings
} from 'lucide-react';
import { mockSessions } from '@/lib/mock-data';
import type { StudySession } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

const mockMessages: Message[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Alice Chen',
    content: 'Hey everyone! Ready for some focused study time?',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Bob Smith',
    content: 'Yes! I have my calculus notes ready',
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Carol Davis',
    content: 'Great! Let me share my screen with the practice problems',
    timestamp: new Date(Date.now() - 180000),
  },
];

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

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  
  const [session, setSession] = useState<StudySession | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    // Find the session from mock data
    const foundSession = mockSessions.find(s => s.id === sessionId);
    if (foundSession) {
      setSession(foundSession);
    } else {
      // Session not found, redirect to home
      router.push('/');
    }
  }, [sessionId, router]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        userId: 'current-user',
        userName: 'You',
        content: newMessage.trim(),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleJoinSession = () => {
    setIsJoined(true);
  };

  const handleLeaveSession = () => {
    setIsJoined(false);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading session...</p>
        </div>
      </div>
    );
  }

  const statusStyle = statusConfig[session.status];
  const seatsLeft = session.maxParticipants - session.participants;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Header */}
        <div className="border-b border-border bg-card/50">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="shrink-0"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="min-w-0">
                  <h1 className="text-xl font-semibold truncate">{session.title}</h1>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge
                      variant="outline"
                      className={cn('text-xs', statusStyle.className)}
                    >
                      {statusStyle.label}
                    </Badge>
                    <span className="text-sm text-foreground/70">
                      {typeLabels[session.type]}
                    </span>
                    <span className="text-sm text-foreground/70">
                      {session.subject}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isJoined ? (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsMuted(!isMuted)}
                      className="shrink-0"
                    >
                      {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsVideoOff(!isVideoOff)}
                      className="shrink-0"
                    >
                      {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                    </Button>
                    <Button variant="destructive" onClick={handleLeaveSession}>
                      Leave Session
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={handleJoinSession}
                    disabled={session.status === 'finished' || seatsLeft === 0}
                    className="shrink-0"
                  >
                    {session.status === 'finished'
                      ? 'Session Ended'
                      : seatsLeft === 0
                        ? 'Session Full'
                        : 'Join Session'}
                  </Button>
                )}
                <Button variant="outline" size="icon" className="shrink-0">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video/Study Area */}
              <div className="aspect-video bg-card border border-border rounded-xl flex items-center justify-center">
                {isJoined ? (
                  <div className="text-center">
                    <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Study Session in Progress</h3>
                    <p className="text-muted-foreground">
                      {isVideoOff ? 'Camera is off' : 'Camera is on'} • {isMuted ? 'Muted' : 'Unmuted'}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Join to Start Studying</h3>
                    <p className="text-muted-foreground mb-4">
                      Click "Join Session" to enter the study room
                    </p>
                    <Button onClick={handleJoinSession}>
                      Join Session
                    </Button>
                  </div>
                )}
              </div>

              {/* Session Info */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Session Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{formatTime(session.startTime)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Participants</p>
                      <p className="font-medium">{session.participants}/{session.maxParticipants}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 flex items-center justify-center">
                      <span className="text-sm">⏱️</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{formatDuration(session.duration)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">Virtual Room</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Sidebar */}
            <div className="bg-card border border-border rounded-xl flex flex-col h-[600px]">
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  <h3 className="font-semibold">Session Chat</h3>
                  <Badge variant="secondary" className="ml-auto">
                    {messages.length}
                  </Badge>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="flex gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-xs">
                        {message.userName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-medium text-sm">{message.userName}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/90 break-words">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              {isJoined && (
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <Button
                      onClick={handleSendMessage}
                      size="icon"
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
