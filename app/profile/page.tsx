'use client';

import { useState } from 'react';
import { User, Calendar, Trophy, Star, BookOpen, Clock, MapPin, Award, TrendingUp, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

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
  {
    id: '5',
    title: 'Study Streak',
    description: '7 days of consecutive studying',
    icon: '🔥',
    unlockedAt: new Date(Date.now() - 86400000 * 5),
    category: 'study',
  },
  {
    id: '6',
    title: 'Community Builder',
    description: 'Hosted 10 sessions',
    icon: '👥',
    unlockedAt: new Date(Date.now() - 86400000 * 4),
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
  {
    id: '4',
    title: 'Literature Discussion',
    subject: 'English',
    date: new Date(Date.now() - 86400000 * 4),
    duration: 75,
    participants: 5,
    rating: 4,
    role: 'participant',
  },
  {
    id: '5',
    title: 'Chemistry Lab Prep',
    subject: 'Chemistry',
    date: new Date(Date.now() - 86400000 * 5),
    duration: 100,
    participants: 7,
    rating: 5,
    role: 'host',
  },
];

export default function ProfilePage() {
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
      case 'study': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'social': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'hosting': return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Map
          </Link>
          <h1 className="text-lg font-semibold">Profile</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Profile Header */}
        <div className="mb-8 rounded-xl border border-border/50 bg-popover/50 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg">
                <User className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-3xl font-bold">John Doe</h2>
              <p className="text-lg text-muted-foreground">@johndoe</p>
              <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                <span>Joined January 2024</span>
                <span>•</span>
                <span>San Francisco, CA</span>
              </div>
            </div>
            <Button variant="outline">
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border/50 bg-popover/50 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
              <Clock className="h-5 w-5" />
              {Math.floor(totalStudyTime / 60)}h
            </div>
            <p className="text-sm text-muted-foreground text-center">Total Study Time</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-popover/50 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
              <Star className="h-5 w-5" />
              {averageRating.toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground text-center">Average Rating</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-popover/50 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
              <BookOpen className="h-5 w-5" />
              {sessionsHosted}
            </div>
            <p className="text-sm text-muted-foreground text-center">Sessions Hosted</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-popover/50 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
              <Trophy className="h-5 w-5" />
              {mockAchievements.length}
            </div>
            <p className="text-sm text-muted-foreground text-center">Achievements</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Session History</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Sessions */}
              <div className="rounded-xl border border-border/50 bg-popover/50 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4">Recent Sessions</h3>
                <div className="space-y-3">
                  {mockStudyHistory.slice(0, 3).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                      <div className="flex-1">
                        <h4 className="font-medium">{session.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
              <div className="rounded-xl border border-border/50 bg-popover/50 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
                <div className="space-y-3">
                  {mockAchievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/50">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
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

          <TabsContent value="history" className="space-y-4">
            <div className="rounded-xl border border-border/50 bg-popover/50 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">Session History</h3>
              <div className="space-y-3">
                {mockStudyHistory.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{session.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
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
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="rounded-xl border border-border/50 bg-popover/50 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">All Achievements</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {mockAchievements.map((achievement) => (
                  <div key={achievement.id} className="p-4 rounded-lg border border-border/50">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge className={cn("text-xs", getCategoryColor(achievement.category))}>
                            {achievement.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Unlocked {formatDate(achievement.unlockedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
