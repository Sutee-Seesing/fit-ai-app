export interface CompletedSet {
  id?: string;
  reps?: number;
  weightKg?: number;
  durationSec?: number;
}

export interface CompletedExercise {
  name: string;
  sets: CompletedSet[];
}

export interface WorkoutLog {
  id: string; // uuid or timestamp
  date: string; // ISO date
  planId?: number | string;
  planName?: string;
  durationMin?: number;
  calories?: number;
  exercises: CompletedExercise[];
  notes?: string;
}
