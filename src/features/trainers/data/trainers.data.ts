import { Trainer } from '../types/trainer.types';

const CLIENT_AVATARS = [
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/12.jpg',
  'https://randomuser.me/api/portraits/men/55.jpg',
  'https://randomuser.me/api/portraits/women/22.jpg',
];
const DEFAULT_BENEFITS = [
  {
    id: 'personalized-training',
    title: 'Personalized Training Plans',
    text: 'Custom coaching designed for your goals.',
  },
  {
    id: 'accountability',
    title: 'Real Accountability',
    text: 'Weekly check-ins and consistent support.',
  },
];

export const trainers: Trainer[] = [
  {
    id: '1',
    name: 'Jane Marian',
    specialty: 'Strength Coach',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800',
    coverImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200',
    rating: 4.5,
    clients: 12,
    experience: '4 yrs',
    bio: 'Strength and conditioning specialist with a focus on hypertrophy and powerlifting fundamentals.',
    videoUrl:
      'https://videos.pexels.com/video-files/5528012/5528012-hd_1080_1920_25fps.mp4',
    tags: ['Yoga', 'Strength', 'Mobility'],
    trainingStyles: ['Strength', 'Conditioning'],
    benefits: DEFAULT_BENEFITS,
    clientAvatars: CLIENT_AVATARS,
  },
  {
    id: '2',
    name: 'Charles Effiong',
    specialty: 'Mobility Coach',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=800',
    coverImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200',
    rating: 4.5,
    clients: 12,
    experience: '5 yrs',
    bio: 'I help busy professionals lose weight, gain strength and improve confidence through personalized training.',
    videoUrl:
      'https://videos.pexels.com/video-files/5528012/5528012-hd_1080_1920_25fps.mp4',
    tags: ['Yoga', 'Strength', 'Mobility'],
    trainingStyles: ['Mobility', 'Functional Movement'],
    benefits: DEFAULT_BENEFITS,
    clientAvatars: CLIENT_AVATARS,
  },
  {
    id: '3',
    name: 'Jack Chucks',
    specialty: 'Endurance Coach',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800',
    coverImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1200',
    rating: 4.5,
    clients: 12,
    experience: '6 yrs',
    bio: 'Distance running coach helping athletes break their personal records through smart programming.',
    videoUrl:
      'https://videos.pexels.com/video-files/5528012/5528012-hd_1080_1920_25fps.mp4',
    tags: ['Yoga', 'Strength', 'Mobility'],
    trainingStyles: ['Endurance', 'Running'],
    benefits: DEFAULT_BENEFITS,
    clientAvatars: CLIENT_AVATARS,
  },
  {
    id: '4',
    name: 'Mike Odii',
    specialty: 'Yoga Instructor',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800',
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200',
    rating: 4.5,
    clients: 12,
    experience: '7 yrs',
    bio: 'Bringing mindful movement and flexibility to people who think they could never touch their toes.',
    videoUrl:
      'https://videos.pexels.com/video-files/5528012/5528012-hd_1080_1920_25fps.mp4',
    tags: ['Yoga', 'Strength', 'Mobility'],
    trainingStyles: ['Yoga', 'Breathwork'],
    benefits: DEFAULT_BENEFITS,
    clientAvatars: CLIENT_AVATARS,
  },
];
