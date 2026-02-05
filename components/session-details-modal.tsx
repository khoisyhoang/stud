'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Users, MessageCircle, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { StudySession } from '@/lib/types';

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isHost?: boolean;
  joinedAt: Date;
}

interface SessionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: StudySession | null;
  onLeaveSession?: (sessionId: string) => void;
  isUserJoined?: boolean;
  isUserHost?: boolean;
}

const mockParticipants: Participant[] = [
  { id: '1', name: 'Alex Chen', isHost: true, joinedAt: new Date(Date.now() - 3600000) },
  { id: '2', name: 'Sarah Johnson', joinedAt: new Date(Date.now() - 1800000) },
  { id: '3', name: 'Mike Davis', joinedAt: new Date(Date.now() - 900000) },
  { id: '4', name: 'Emma Wilson', joinedAt: new Date(Date.now() - 300000) },
];

const mockMessages: Message[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Alex Chen',
    content: 'Welcome everyone! Ready to focus on algorithms?',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    userId: '2',
    userName: 'Sarah Johnson',
    content: 'Hi! Yes, I\'m working on dynamic programming problems',
    timestamp: new Date(Date.now() - 1800000),
  },
  {
    id: '3',
    userId: '3',
    userName: 'Mike Davis',
    content: 'Great! I need help with recursion concepts',
    timestamp: new Date(Date.now() - 900000),
  },
];

export function SessionDetailsModal({
  isOpen,
  onClose,
  session,
  onLeaveSession,
  isUserJoined = false,
  isUserHost = false,
}: SessionDetailsModalProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      content: newMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatJoinTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just joined';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return date.toLocaleDateString();
  };

  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl font-semibold">{session.title}</DialogTitle>
              <Badge variant="outline" className="text-xs">
                {session.subject}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {isUserHost && (
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Host Settings
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="chat" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="participants" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Participants ({participants.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex flex-col h-[500px] mt-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 max-w-[80%]",
                    message.userId === 'current-user' && "ml-auto flex-row-reverse"
                  )}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs">
                      {message.userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "flex flex-col gap-1",
                    message.userId === 'current-user' && "items-end"
                  )}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {message.userName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <div className={cn(
                      "rounded-lg px-3 py-2 text-sm",
                      message.userId === 'current-user'
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}>
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {isUserJoined && (
              <div className="border-t border-border/50 p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="participants" className="h-[500px] mt-0">
            <div className="p-4 space-y-3">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{participant.name}</span>
                        {participant.isHost && (
                          <Badge variant="secondary" className="text-xs">
                            Host
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Joined {formatJoinTime(participant.joinedAt)}
                      </span>
                    </div>
                  </div>
                  
                  {isUserHost && participant.id !== 'current-user' && (
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {isUserJoined && (
          <div className="border-t border-border/50 p-4">
            <Button
              variant="outline"
              onClick={() => onLeaveSession?.(session.id)}
              className="w-full"
            >
              Leave Session
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
