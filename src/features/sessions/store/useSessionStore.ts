import { create } from 'zustand';

export type SessionStatus = 'upcoming' | 'completed' | 'canceled';

export interface Session {
  id: string;
  trainerName: string;
  trainerAvatar: string;
  date: string; // ISO date string 'YYYY-MM-DD'
  startTime: string; // '10:30 AM'
  endTime: string; // '11:30 AM'
  platform: string; // 'Video Call (Zoom)'
  status: SessionStatus;
  link?: string;
  price?: number;
}

const mockSessions: Session[] = [
  {
    id: '1',
    trainerName: 'Chantelle Mbonu',
    trainerAvatar: 'https://i.pravatar.cc/150?u=1',
    date: '2024-08-24',
    startTime: '10:30 AM',
    endTime: '11:30 AM',
    platform: 'Video Call',
    status: 'upcoming',
    link: 'https://zoom.us/j/123456789',
    price: 50.0,
  },
  {
    id: '2',
    trainerName: 'John',
    trainerAvatar: 'https://i.pravatar.cc/150?u=2',
    date: '2024-08-26',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    platform: 'Video Call',
    status: 'upcoming',
    price: 45.0,
  },
  {
    id: '3',
    trainerName: 'Sarah Lee',
    trainerAvatar: 'https://i.pravatar.cc/150?u=3',
    date: '2024-08-10',
    startTime: '10:30 AM',
    endTime: '11:30 AM',
    platform: 'Video Call',
    status: 'completed',
  },
  {
    id: '4',
    trainerName: 'Emma',
    trainerAvatar: 'https://i.pravatar.cc/150?u=4',
    date: '2024-08-05',
    startTime: '15:00 PM',
    endTime: '16:00 PM',
    platform: 'Video Call',
    status: 'canceled',
  },
];

interface SessionStore {
  sessions: Session[];
  rescheduleSession: (id: string, newDate: string, newStartTime: string, newEndTime: string) => void;
  cancelSession: (id: string) => void;
  clearSessions: () => void;
  resetMockSessions: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  sessions: [...mockSessions],
  rescheduleSession: (id, newDate, newStartTime, newEndTime) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id ? { ...s, date: newDate, startTime: newStartTime, endTime: newEndTime } : s
      ),
    })),
  cancelSession: (id) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id ? { ...s, status: 'canceled' } : s
      ),
    })),
  clearSessions: () => set({ sessions: [] }),
  resetMockSessions: () => set({ sessions: [...mockSessions] }),
}));
