import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/services/geminiService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      age,
      weight,
      height,
      gender,
      goal,
      fitnessLevel,
      equipment,
      dumbbellWeight,
    } = body;

    // Validate required fields
    if (!age || !weight || !height || !gender || !goal || !fitnessLevel || !equipment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate workout plan using Gemini AI
    const workoutPlan = await GeminiService.generateWorkoutPlan({
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      gender,
      goal,
      fitnessLevel,
      equipment,
      dumbbellWeight: equipment === 'dumbbell' ? Number(dumbbellWeight) : undefined,
    });

    return NextResponse.json(workoutPlan);
  } catch (error) {
    console.error('Error generating workout plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate workout plan', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
