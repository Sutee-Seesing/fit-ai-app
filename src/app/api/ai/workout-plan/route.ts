import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, goal, fitnessLevel, age, weight, height } = body;

    // Mock AI-generated workout plan
    // In production, integrate with OpenAI, Anthropic, or custom AI model
    const workoutPlan = {
      id: `plan-${Date.now()}`,
      userId,
      name: `${goal === 'lose-weight' ? 'Weight Loss' : 'Muscle Building'} Plan`,
      description: `Personalized plan for ${fitnessLevel} level`,
      duration: 8, // weeks
      frequency: fitnessLevel === 'beginner' ? 3 : fitnessLevel === 'intermediate' ? 4 : 5,
      exercises: generateExercises(goal, fitnessLevel),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(workoutPlan);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate workout plan' },
      { status: 500 }
    );
  }
}

function generateExercises(goal: string, fitnessLevel: string) {
  const exercises = [
    {
      id: '1',
      name: 'Push-ups',
      type: 'strength',
      muscleGroup: ['chest', 'triceps', 'shoulders'],
      sets: fitnessLevel === 'beginner' ? 3 : 4,
      reps: fitnessLevel === 'beginner' ? 10 : 15,
      restTime: 60,
      intensity: 'medium',
      calories: 50,
      description: 'Classic bodyweight exercise for upper body strength',
    },
    {
      id: '2',
      name: 'Squats',
      type: 'strength',
      muscleGroup: ['quadriceps', 'glutes', 'hamstrings'],
      sets: fitnessLevel === 'beginner' ? 3 : 4,
      reps: fitnessLevel === 'beginner' ? 12 : 15,
      restTime: 60,
      intensity: 'medium',
      calories: 60,
      description: 'Fundamental lower body exercise',
    },
  ];

  if (goal === 'lose-weight') {
    exercises.push({
      id: '3',
      name: 'High Knees',
      type: 'cardio',
      muscleGroup: ['legs', 'core'],
      duration: 60,
      restTime: 30,
      intensity: 'high',
      calories: 100,
      description: 'High-intensity cardio exercise',
    } as any);
  }

  return exercises;
}
