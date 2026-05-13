import { trainers as mockTrainers } from '../data/trainers.data';
import { Trainer } from '../types/trainer.types';

// TODO: swap this stub for a real client.get('/trainers') call once the
// backend endpoint is ready. The 800ms delay lets the skeleton state breathe
// during development.
export async function fetchTrainers(): Promise<Trainer[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockTrainers;
}
