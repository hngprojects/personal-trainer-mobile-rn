export interface Session {
  // Booking ID — use for /bookings/{id}/reschedule.
  id: string;
  trainerId: string | null;
  // Linked session row ID, when the booking has actually started. Discovery
  // calls and not-yet-started paid sessions have null here.
  sessionId: string | null;
  bookingType: 'session' | 'discovery';
  trainerName: string;
  trainerAvatar: string | null;
  type: string;
  date: string;
  time: string;
  duration: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'rescheduled';
  startsAt?: string;
  createdAt?: string | null;
  platform?: string;
  goals?: string[];
}

export const mockSessions: Session[] = [
  {
    id: '1',
    trainerId: null,
    sessionId: null,
    bookingType: 'session',
    trainerName: 'Charles Effiong',
    trainerAvatar: 'https://images.unsplash.com/photo-1540206276207-3af25c08abbb?w=400',
    type: 'Strength Training',
    date: 'Tuesday, May 23, 2026',
    time: '11:00 AM - 12:00 PM',
    duration: '60 mins',
    status: 'upcoming',
    platform: 'Zoom',
    goals: ['Cardio', 'Core Strength', 'Weight Loss', 'Mobility'],
  },
  {
    id: '2',
    trainerId: null,
    sessionId: null,
    bookingType: 'session',
    trainerName: 'Jane Doe',
    trainerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    type: 'Yoga',
    date: 'Wednesday, May 24, 2026',
    time: '09:00 AM - 10:00 AM',
    duration: '60 mins',
    status: 'rescheduled',
  },
  {
    id: '3',
    trainerId: null,
    sessionId: null,
    bookingType: 'discovery',
    trainerName: 'John Smith',
    trainerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    type: 'Weight Loss',
    date: 'Thursday, May 25, 2026',
    time: '02:00 PM - 03:00 PM',
    duration: '60 mins',
    status: 'upcoming',
  },
  {
    id: '4',
    trainerId: null,
    sessionId: null,
    bookingType: 'session',
    trainerName: 'Alice Johnson',
    trainerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    type: 'Mobility',
    date: 'Friday, May 26, 2026',
    time: '10:00 AM - 11:00 AM',
    duration: '60 mins',
    status: 'rescheduled',
  },
  {
    id: '5',
    trainerId: null,
    sessionId: null,
    bookingType: 'session',
    trainerName: 'Charles Effiong',
    trainerAvatar: 'https://images.unsplash.com/photo-1540206276207-3af25c08abbb?w=400',
    type: 'Strength Training',
    date: 'Monday, May 29, 2026',
    time: '11:00 AM - 12:00 PM',
    duration: '60 mins',
    status: 'upcoming',
  },
];
