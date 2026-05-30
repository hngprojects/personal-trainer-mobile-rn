import { createStore } from '@/shared/store/factory';

import type { FitnessGoal, FitnessLevel, Gender, ProfileDraft } from '../types/profile-setup.types';

export const TOTAL_STEPS = 4;

interface ProfileSetupState {
  step: number;
  draft: ProfileDraft;
}

interface ProfileSetupActions {
  setStep: (step: number) => void;
  next: () => void;
  prev: () => void;
  patchDraft: (patch: Partial<ProfileDraft>) => void;
  setBasicInfo: (name: string, email: string) => void;
  setGender: (gender: Gender) => void;
  toggleGoal: (goal: FitnessGoal) => void;
  setFitnessLevel: (level: FitnessLevel) => void;
  reset: () => void;
}

const initialDraft: ProfileDraft = {
  name: '',
  email: '',
  gender: null,
  goals: [],
  fitnessLevel: null,
};

export const useProfileSetupStore = createStore<ProfileSetupState & ProfileSetupActions>(
  (set, get) => ({
    step: 0,
    draft: initialDraft,

    setStep: (step) => set({ step: Math.max(0, Math.min(step, TOTAL_STEPS - 1)) }),

    next: () => {
      const { step } = get();
      if (step < TOTAL_STEPS - 1) set({ step: step + 1 });
    },

    prev: () => {
      const { step } = get();
      if (step > 0) set({ step: step - 1 });
    },

    patchDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),

    setBasicInfo: (name, email) =>
      set((s) => ({ draft: { ...s.draft, name: name.trim(), email: email.trim() } })),

    setGender: (gender) => set((s) => ({ draft: { ...s.draft, gender } })),

    toggleGoal: (goal) =>
      set((s) => {
        const has = s.draft.goals.includes(goal);
        return {
          draft: {
            ...s.draft,
            goals: has ? s.draft.goals.filter((g) => g !== goal) : [...s.draft.goals, goal],
          },
        };
      }),

    setFitnessLevel: (fitnessLevel) => set((s) => ({ draft: { ...s.draft, fitnessLevel } })),

    reset: () => set({ step: 0, draft: initialDraft }),
  }),
);
