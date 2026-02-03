export type SessionStatus = 'live' | 'starting-soon' | 'finished';
export type SessionType = 'silent' | 'discussion' | 'exam-prep';

export interface StudySession {
  id: string;
  title: string;
  subject: string;
  lat: number;
  lng: number;
  startTime: Date;
  duration: number; // in minutes
  participants: number;
  maxParticipants: number;
  type: SessionType;
  status: SessionStatus;
  distance?: number; // in km, calculated client-side
}
