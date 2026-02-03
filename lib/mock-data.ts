import type { StudySession, SessionType, SessionStatus } from './types';

// Mock sessions around San Francisco (default center)
const baseDate = new Date('2024-01-15T10:00:00'); // Fixed base date

// Helper function to generate random sessions
const generateSession = (
  id: string,
  title: string,
  subject: string,
  lat: number,
  lng: number,
  timeOffset: number = 0,
  duration: number = 120,
  participants: number = 10,
  maxParticipants: number = 15,
  type: SessionType = 'silent',
  status: SessionStatus = 'live'
): StudySession => ({
  id,
  title,
  subject,
  lat,
  lng,
  startTime: timeOffset === 0 ? baseDate : new Date(baseDate.getTime() + timeOffset * 60 * 1000),
  duration,
  participants,
  maxParticipants,
  type,
  status,
});

// Cincinnati area coordinates (UC Cincinnati: 39.1324° N, 84.5150° W)
const cincinnatiLat = 39.1324;
const cincinnatiLng = -84.5150;

// Generate Cincinnati area sessions (especially UC Cincinnati)
const cincinnatiSessions = [
  // UC Cincinnati campus sessions
  generateSession('cinci-1', 'Engineering Study Hall', 'Engineering', 39.1324, -84.5150, 0, 180, 25, 30, 'discussion', 'live'),
  generateSession('cinci-2', 'Calculus III Tutoring', 'Mathematics', 39.1330, -84.5145, 15, 120, 8, 12, 'discussion', 'starting-soon'),
  generateSession('cinci-3', 'MCAT Prep Session', 'Medicine', 39.1318, -84.5155, -60, 150, 12, 15, 'exam-prep', 'live'),
  generateSession('cinci-4', 'Computer Science Lab', 'Computer Science', 39.1328, -84.5148, 30, 90, 18, 20, 'silent', 'starting-soon'),
  generateSession('cinci-5', 'Physics Problem Solving', 'Physics', 39.1320, -84.5152, -180, 120, 15, 15, 'discussion', 'finished'),
  generateSession('cinci-6', 'Business Case Study', 'Business', 39.1335, -84.5140, 45, 100, 20, 25, 'discussion', 'starting-soon'),
  generateSession('cinci-7', 'Chemistry Lab Review', 'Chemistry', 39.1315, -84.5158, -120, 90, 6, 10, 'silent', 'live'),
  generateSession('cinci-8', 'Psychology Research Group', 'Psychology', 39.1322, -84.5142, 60, 120, 14, 18, 'discussion', 'starting-soon'),
  generateSession('cinci-9', 'English Essay Workshop', 'English', 39.1332, -84.5155, -90, 80, 10, 15, 'discussion', 'live'),
  generateSession('cinci-10', 'Biology Study Session', 'Biology', 39.1312, -84.5145, 20, 110, 16, 20, 'silent', 'live'),
  
  // Greater Cincinnati area
  generateSession('cinci-11', 'Law School Prep', 'Law', 39.1400, -84.5200, 0, 140, 8, 12, 'exam-prep', 'live'),
  generateSession('cinci-12', 'Architecture Design', 'Architecture', 39.1250, -84.5100, 30, 160, 12, 15, 'discussion', 'starting-soon'),
  generateSession('cinci-13', 'Music Theory Study', 'Music', 39.1380, -84.5080, -60, 90, 6, 10, 'silent', 'live'),
  generateSession('cinci-14', 'Nursing Exam Prep', 'Nursing', 39.1280, -84.5180, 45, 130, 18, 20, 'exam-prep', 'starting-soon'),
  generateSession('cinci-15', 'History Discussion Group', 'History', 39.1350, -84.5120, -150, 100, 10, 15, 'discussion', 'finished'),
];

// Generate worldwide sessions
const worldwideSessions = [
  // North America
  generateSession('ny-1', 'NYC Data Science Meetup', 'Data Science', 40.7128, -74.0060, 0, 120, 30, 35, 'discussion', 'live'),
  generateSession('ny-2', 'Wall Street Finance Prep', 'Finance', 40.7074, -74.0113, 20, 90, 25, 30, 'exam-prep', 'starting-soon'),
  generateSession('la-1', 'Silicon Beach Tech Talk', 'Technology', 34.0522, -118.2437, -30, 150, 40, 50, 'discussion', 'live'),
  generateSession('la-2', 'UCLA Medical Study Group', 'Medicine', 34.0689, -118.4452, 60, 120, 20, 25, 'silent', 'starting-soon'),
  generateSession('chicago-1', 'Chicago Booth MBA Prep', 'Business', 41.8781, -87.6298, -90, 180, 35, 40, 'exam-prep', 'live'),
  generateSession('chicago-2', 'Art Institute Study Session', 'Art History', 41.8791, -87.6237, 30, 90, 15, 20, 'discussion', 'starting-soon'),
  generateSession('boston-1', 'MIT Robotics Lab', 'Engineering', 42.3601, -71.0589, 0, 200, 28, 30, 'silent', 'live'),
  generateSession('boston-2', 'Harvard Law Review', 'Law', 42.3770, -71.1167, 45, 120, 12, 15, 'discussion', 'starting-soon'),
  generateSession('miami-1', 'Marine Biology Research', 'Biology', 25.7617, -80.1918, -60, 140, 18, 22, 'silent', 'live'),
  generateSession('seattle-1', 'Amazon AWS Study Group', 'Cloud Computing', 47.6062, -122.3321, 15, 110, 32, 40, 'discussion', 'starting-soon'),
  generateSession('toronto-1', 'U of T Medical School Prep', 'Medicine', 43.6532, -79.3832, -120, 160, 24, 30, 'exam-prep', 'live'),
  generateSession('vancouver-1', 'UBC Computer Science', 'Computer Science', 49.2827, -123.1207, 30, 100, 22, 25, 'silent', 'starting-soon'),
  generateSession('mexico-1', 'UNAM Engineering Study', 'Engineering', 19.4326, -99.1332, 0, 130, 28, 35, 'discussion', 'live'),
  
  // Europe
  generateSession('london-1', 'Imperial College Physics', 'Physics', 51.5074, -0.1278, -45, 120, 20, 25, 'silent', 'live'),
  generateSession('london-2', 'LSE Economics Discussion', 'Economics', 51.5142, -0.1193, 60, 90, 30, 35, 'discussion', 'starting-soon'),
  generateSession('paris-1', 'Sorbonne Philosophy', 'Philosophy', 48.8566, 2.3522, -90, 110, 15, 20, 'discussion', 'live'),
  generateSession('paris-2', 'École Polytechnique Engineering', 'Engineering', 48.8474, 2.2627, 20, 150, 25, 30, 'silent', 'starting-soon'),
  generateSession('berlin-1', 'Humboldt University History', 'History', 52.5200, 13.4050, -30, 100, 18, 22, 'discussion', 'live'),
  generateSession('berlin-2', 'Technical University Berlin', 'Computer Science', 52.4582, 13.3750, 45, 120, 28, 32, 'silent', 'starting-soon'),
  generateSession('madrid-1', 'Complutense Medicine', 'Medicine', 40.4168, -3.7038, -60, 140, 22, 25, 'exam-prep', 'live'),
  generateSession('rome-1', 'Sapienza University Classics', 'Classics', 41.9028, 12.4964, 30, 90, 12, 15, 'discussion', 'starting-soon'),
  generateSession('amsterdam-1', 'University of Amsterdam AI', 'AI/ML', 52.3676, 4.9041, 0, 130, 26, 30, 'discussion', 'live'),
  generateSession('stockholm-1', 'KTH Royal Institute', 'Engineering', 59.3293, 18.0686, -120, 160, 20, 25, 'silent', 'live'),
  generateSession('zurich-1', 'ETH Zurich Mathematics', 'Mathematics', 47.3769, 8.5417, 15, 100, 16, 20, 'silent', 'starting-soon'),
  generateSession('vienna-1', 'University of Vienna Music', 'Music', 48.2082, 16.3738, 60, 80, 14, 18, 'discussion', 'starting-soon'),
  
  // Asia
  generateSession('tokyo-1', 'University of Tokyo Physics', 'Physics', 35.6762, 139.6503, -75, 120, 24, 30, 'silent', 'live'),
  generateSession('tokyo-2', 'Tokyo Institute of Technology', 'Engineering', 35.6812, 139.7649, 40, 140, 30, 35, 'discussion', 'starting-soon'),
  generateSession('beijing-1', 'Peking University Mathematics', 'Mathematics', 39.9042, 116.4074, -90, 110, 28, 32, 'silent', 'live'),
  generateSession('beijing-2', 'Tsinghua Computer Science', 'Computer Science', 40.0091, 116.3266, 20, 130, 35, 40, 'discussion', 'starting-soon'),
  generateSession('shanghai-1', 'Fudan University Medicine', 'Medicine', 31.2304, 121.4737, -45, 150, 26, 30, 'exam-prep', 'live'),
  generateSession('singapore-1', 'NUS Business School', 'Business', 1.3521, 103.8198, 30, 100, 32, 40, 'discussion', 'starting-soon'),
  generateSession('hongkong-1', 'HKU Finance Study', 'Finance', 22.3193, 114.1694, -60, 90, 25, 30, 'exam-prep', 'live'),
  generateSession('seoul-1', 'Seoul National University', 'Engineering', 37.5665, 126.9780, 45, 120, 22, 25, 'silent', 'starting-soon'),
  generateSession('mumbai-1', 'IIT Bombay Technology', 'Technology', 19.0760, 72.8777, 0, 140, 38, 45, 'discussion', 'live'),
  generateSession('bangalore-1', 'Indian Institute of Science', 'Computer Science', 12.9716, 77.5946, -120, 160, 30, 35, 'silent', 'live'),
  generateSession('dubai-1', 'UAE University Business', 'Business', 25.2048, 55.2708, 15, 110, 20, 25, 'discussion', 'starting-soon'),
  
  // South America
  generateSession('saopaulo-1', 'USP Engineering', 'Engineering', -23.5505, -46.6333, -30, 120, 26, 30, 'discussion', 'live'),
  generateSession('saopaulo-2', 'FGV Business School', 'Business', -23.5644, -46.6522, 50, 90, 24, 28, 'silent', 'starting-soon'),
  generateSession('buenosaires-1', 'University of Buenos Aires', 'Medicine', -34.6037, -58.3816, -90, 140, 20, 25, 'exam-prep', 'live'),
  generateSession('lima-1', 'Pontifical Catholic University', 'Law', -12.0464, -77.0428, 20, 100, 18, 22, 'discussion', 'starting-soon'),
  generateSession('bogota-1', 'University of the Andes', 'Economics', 4.7110, -74.0721, -60, 110, 22, 25, 'silent', 'live'),
  
  // Africa
  generateSession('cairo-1', 'Cairo University Engineering', 'Engineering', 30.0444, 31.2357, 0, 130, 28, 32, 'discussion', 'live'),
  generateSession('capetown-1', 'University of Cape Town', 'Medicine', -33.9249, 18.4241, 40, 120, 24, 30, 'exam-prep', 'starting-soon'),
  generateSession('lagos-1', 'University of Lagos Business', 'Business', 6.5244, 3.3792, -75, 90, 20, 25, 'silent', 'live'),
  generateSession('nairobi-1', 'University of Nairobi', 'Computer Science', -1.2921, 36.8219, 30, 110, 18, 22, 'discussion', 'starting-soon'),
  
  // Oceania
  generateSession('sydney-1', 'University of Sydney Medicine', 'Medicine', -33.8688, 151.2093, -45, 140, 26, 30, 'exam-prep', 'live'),
  generateSession('sydney-2', 'UNSW Technology', 'Technology', -33.9173, 151.2306, 60, 100, 30, 35, 'discussion', 'starting-soon'),
  generateSession('melbourne-1', 'University of Melbourne', 'Arts', -37.8136, 144.9631, -90, 90, 16, 20, 'silent', 'live'),
  generateSession('auckland-1', 'University of Auckland', 'Engineering', -36.8485, 174.7633, 15, 120, 22, 25, 'discussion', 'starting-soon'),
];

export const mockSessions: StudySession[] = [
  // Original San Francisco sessions
  {
    id: '1',
    title: 'Deep Focus: Algorithms',
    subject: 'Computer Science',
    lat: 37.7849,
    lng: -122.4094,
    startTime: baseDate,
    duration: 120,
    participants: 12,
    maxParticipants: 20,
    type: 'silent',
    status: 'live',
  },
  {
    id: '2',
    title: 'Calculus Study Group',
    subject: 'Mathematics',
    lat: 37.7799,
    lng: -122.4144,
    startTime: new Date(baseDate.getTime() + 15 * 60 * 1000), // 15 min from base
    duration: 90,
    participants: 8,
    maxParticipants: 15,
    type: 'discussion',
    status: 'starting-soon',
  },
  {
    id: '3',
    title: 'MCAT Prep Session',
    subject: 'Medicine',
    lat: 37.7919,
    lng: -122.4014,
    startTime: baseDate,
    duration: 180,
    participants: 6,
    maxParticipants: 10,
    type: 'exam-prep',
    status: 'live',
  },
  {
    id: '4',
    title: 'Physics Problem Solving',
    subject: 'Physics',
    lat: 37.7749,
    lng: -122.4194,
    startTime: new Date(baseDate.getTime() - 3 * 60 * 60 * 1000), // 3 hours before base
    duration: 120,
    participants: 15,
    maxParticipants: 15,
    type: 'silent',
    status: 'finished',
  },
  {
    id: '5',
    title: 'Machine Learning Workshop',
    subject: 'AI/ML',
    lat: 37.7879,
    lng: -122.3964,
    startTime: new Date(baseDate.getTime() + 30 * 60 * 1000), // 30 min from base
    duration: 150,
    participants: 18,
    maxParticipants: 25,
    type: 'discussion',
    status: 'starting-soon',
  },
  {
    id: '6',
    title: 'Organic Chemistry Review',
    subject: 'Chemistry',
    lat: 37.7699,
    lng: -122.4294,
    startTime: baseDate,
    duration: 90,
    participants: 4,
    maxParticipants: 12,
    type: 'silent',
    status: 'live',
  },
  {
    id: '7',
    title: 'GRE Verbal Practice',
    subject: 'Test Prep',
    lat: 37.7829,
    lng: -122.4244,
    startTime: baseDate,
    duration: 60,
    participants: 9,
    maxParticipants: 15,
    type: 'exam-prep',
    status: 'live',
  },
  {
    id: '8',
    title: 'Data Structures Sprint',
    subject: 'Computer Science',
    lat: 37.7769,
    lng: -122.4044,
    startTime: new Date(baseDate.getTime() - 2 * 60 * 60 * 1000),
    duration: 90,
    participants: 20,
    maxParticipants: 20,
    type: 'silent',
    status: 'finished',
  },
  
  // Add Cincinnati sessions
  ...cincinnatiSessions,
  
  // Add worldwide sessions
  ...worldwideSessions,
];

// Mock live count that can be connected to API later
export const getMockLiveCount = (): number => {
  return 1284 + Math.floor(Math.random() * 50);
};
