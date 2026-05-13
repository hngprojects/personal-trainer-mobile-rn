export type Gender = 'male' | 'female';

export type FitnessGoal =
  | 'lose_weight'
  | 'build_muscle'
  | 'flexibility'
  | 'endurance'
  | 'habits'
  | 'strength';

export type FitnessLevel = 'easy' | 'intermediate' | 'challenging';

export interface ProfileDraft {
  name: string;
  email: string;
  gender: Gender | null;
  goals: FitnessGoal[];
  fitnessLevel: FitnessLevel | null;
}
