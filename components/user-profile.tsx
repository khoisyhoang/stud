'use client';

import { useState } from 'react';
import { User, Calendar, Trophy, Star, BookOpen, Clock, MapPin, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'study' | 'social' | 'hosting';
}

interface StudySession {
  id: string;
  title: string;
  subject: string;
  date: Date;
  duration: number;
  participants: number;
  rating?: number;
  role: 'host' | 'participant';
}

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Session',
    description: 'Joined your first study session',
    icon: '🎯',
    unlockedAt: new Date(Date.now() - 86400000 * 7),
    category: 'study',
  },
  {
    id: '2',
    title: 'Focus Master',
    description: 'Completed 10 hours of study sessions',
    icon: '⏰',
    unlockedAt: new Date(Date.now() - 86400000 * 3),
    category: 'study',
  },
  {
    id: '3',
    title: 'Social Butterfly',
    description: 'Joined 5 different sessions',
    icon: '🦋',
    unlockedAt: new Date(Date.now() - 86400000),
    category: 'social',
  },
  {
    id: '4',
    title: 'Host Hero',
    description: 'Hosted your first session',
    icon: '🏠',
    unlockedAt: new Date(Date.now() - 86400000 * 2),
    category: 'hosting',
  },
];

const mockStudyHistory: StudySession[] = [
  {
    id: '1',
    title: 'Deep Focus: Algorithms',
    subject: 'Computer Science',
    date: new Date(Date.now() - 86400000),
    duration: 120,
    participants: 8,
    rating: 5,
    role: 'participant',
  },
  {
    id: '2',
    title: 'Calculus Study Group',
    subject: 'Mathematics',
    date: new Date(Date.now() - 86400000 * 2),
    duration: 90,
    participants: 6,
    rating: 4,
    role: 'host',
  },
  {
    id: '3',
    title: 'Physics Problem Solving',
    subject: 'Physics',
    date: new Date(Date.now() - 86400000 * 3),
    duration: 150,
    participants: 10,
    rating: 5,
    role: 'participant',
  },
];

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const totalStudyTime = mockStudyHistory.reduce((acc, session) => acc + session.duration, 0);
  const averageRating = mockStudyHistory
    .filter(session => session.rating)
    .reduce((acc, session, _, arr) => acc + (session.rating! / arr.length), 0);
  const sessionsHosted = mockStudyHistory.filter(session => session.role === 'host').length;
  const sessionsJoined = mockStudyHistory.filter(session => session.role === 'participant').length;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  const getCategoryColor = (category: Achievement['category']) => {
    switch (category) {
      case 'study': return 'bg-blue-500/30 text-blue-200 border-blue-400/50';
      case 'social': return 'bg-green-500/30 text-green-200 border-green-400/50';
      case 'hosting': return 'bg-purple-500/30 text-purple-200 border-purple-400/50';
      default: return 'bg-gray-500/30 text-gray-200 border-gray-400/50';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl border border-border bg-popover shadow-2xl shadow-black/40 backdrop-blur-xl">
        {/* Header */}
        <div className="border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">John Doe</h2>
                <p className="text-foreground/80">@johndoe</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              ×
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
              <Clock className="h-5 w-5" />
              {Math.floor(totalStudyTime / 60)}h
            </div>
            <p className="text-sm text-foreground/70">Total Study Time</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
              <Star className="h-5 w-5" />
              {averageRating.toFixed(1)}
            </div>
            <p className="text-sm text-foreground/70">Average Rating</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
              <BookOpen className="h-5 w-5" />
              {sessionsHosted}
            </div>
            <p className="text-sm text-foreground/70">Sessions Hosted</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
              <Trophy className="h-5 w-5" />
              {mockAchievements.length}
            </div>
            <p className="text-sm text-foreground/70">Achievements</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 m-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Session History</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="px-6 pb-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Sessions */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Sessions</h3>
                <div className="space-y-3">
                  {mockStudyHistory.slice(0, 3).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
                      <div className="flex-1">
                        <h4 className="font-medium">{session.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-foreground/70">
                          <Badge variant="secondary" className="text-xs">
                            {session.subject}
                          </Badge>
                          <span>{formatDate(session.date)}</span>
                          <span>{formatDuration(session.duration)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {session.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="text-sm">{session.rating}</span>
                          </div>
                        )}
                        <Badge variant="outline" className="text-xs mt-1">
                          {session.role}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Achievements */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
                <div className="space-y-3">
                  {mockAchievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card/50">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-foreground/70">{achievement.description}</p>
                      </div>
                      <Badge className={cn("text-xs", getCategoryColor(achievement.category))}>
                        {achievement.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="px-6 pb-6">
            <div className="space-y-3">
              {mockStudyHistory.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{session.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-foreground/70">
                        <span>{session.subject}</span>
                        <span>{formatDate(session.date)}</span>
                        <span>{formatDuration(session.duration)}</span>
                        <span>{session.participants} participants</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {session.rating && (
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm">{session.rating}</span>
                      </div>
                    )}
                    <Badge variant="outline">
                      {session.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="px-6 pb-6">
            <div className="grid md:grid-cols-2 gap-4">
              {mockAchievements.map((achievement) => (
                <div key={achievement.id} className="p-4 rounded-lg border border-border bg-card/50">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <p className="text-sm text-foreground/70 mb-2">{achievement.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge className={cn("text-xs", getCategoryColor(achievement.category))}>
                          {achievement.category}
                        </Badge>
                        <span className="text-xs text-foreground/60">
                          Unlocked {formatDate(achievement.unlockedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
