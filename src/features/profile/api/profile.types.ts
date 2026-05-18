// Wire types match the backend exactly (snake_case).
export interface RawProfile {
  id: string;
  email: string;
  name: string;
  gender: string | null;
  fitness_goals: string[] | null;
  fitness_level: string | null;
  avatar_url: string | null;
  profile_complete: boolean;
}

export interface UpdateProfileRequest {
  name?: string;
  gender?: string | null;
  fitness_goals?: string[];
  fitness_level?: string;
  avatar_url?: string | null;
}

export interface RawAvatarUploadResponse {
  avatar_url: string;
  status: string;
}

// App-shaped equivalent of RawProfile (camelCase). The auth UserProfile shape
// is the canonical store representation; this is the API-layer projection
// before unwrapping into UserProfile.
export interface ProfilePayload {
  id: string;
  email: string;
  name: string;
  gender: string | null;
  fitnessGoals: string[] | null;
  fitnessLevel: string | null;
  avatarUrl: string | null;
  profileComplete: boolean;
}

export interface AvatarUploadResult {
  avatarUrl: string;
  status: string;
}

// Local profile-setup → server enum mappers. The screen uses friendly labels
// ('easy', 'challenging', 'habits', 'strength') while the backend expects
// standard fitness terminology.
export const FITNESS_LEVEL_TO_API: Record<string, string> = {
  easy: 'beginner',
  intermediate: 'intermediate',
  challenging: 'advanced',
};

export const FITNESS_GOAL_TO_API: Record<string, string> = {
  lose_weight: 'lose_weight',
  build_muscle: 'build_muscle',
  flexibility: 'improve_flexibility',
  endurance: 'boost_endurance',
  habits: 'build_healthy_habits',
  strength: 'build_strength',
};

export function toApiFitnessLevel(level: string | null | undefined): string | undefined {
  if (!level) return undefined;
  return FITNESS_LEVEL_TO_API[level] ?? level;
}

export function toApiFitnessGoals(goals: string[] | null | undefined): string[] | undefined {
  if (!goals?.length) return undefined;
  return goals.map((g) => FITNESS_GOAL_TO_API[g] ?? g);
}
