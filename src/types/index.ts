export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  goal: 'lose-weight' | 'gain-muscle' | 'maintain' | 'improve-fitness';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  description: string;
  duration: number; // weeks
  frequency: number; // days per week
  exercises: Exercise[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Exercise {
  id: string;
  name: string;
  nameEn?: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'balance';
  muscleGroup: string[];
  sets?: number;
  reps?: number;
  duration?: number; // minutes
  restTime?: number; // seconds
  intensity: 'low' | 'medium' | 'high';
  calories: number;
  description: string;
  videoUrl?: string;
  imageUrl?: string;
  gifUrl?: string; // Animation GIF
  equipment: 'bodyweight' | 'dumbbell' | 'barbell' | 'machine' | 'other';
  dumbbellWeight?: number; // kg for dumbbell exercises
  instructions?: string[];
  tips?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface WorkoutSession {
  id: string;
  userId: string;
  workoutPlanId: string;
  date: Date;
  exercises: CompletedExercise[];
  totalDuration: number; // minutes
  totalCalories: number;
  notes?: string;
  completed: boolean;
  equipment: 'bodyweight' | 'dumbbell';
  dumbbellWeight?: number; // kg
}

export interface CompletedExercise {
  exerciseId: string;
  name: string;
  sets?: number;
  reps?: number;
  weight?: number; // kg
  duration?: number; // minutes
  completed: boolean;
  dumbbellWeight?: number; // kg for dumbbell exercises
  caloriesBurned?: number;
}

export interface NutritionPlan {
  id: string;
  userId: string;
  name: string;
  dailyCalories: number;
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
  createdAt: Date;
}

export interface Food {
  id: string;
  name: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  sugar?: number;
  imageUrl?: string;
}

export interface MealLog {
  id: string;
  userId: string;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: FoodEntry[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  notes?: string;
}

export interface FoodEntry {
  foodId: string;
  name: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface ProgressData {
  userId: string;
  date: Date;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
  photos?: string[];
  notes?: string;
}

export interface AIRecommendation {
  type: 'workout' | 'nutrition' | 'general';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}
