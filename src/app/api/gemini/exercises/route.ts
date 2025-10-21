import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/services/geminiService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { equipment, dumbbellWeight, targetMuscle } = body;

    if (!equipment) {
      return NextResponse.json(
        { error: 'Equipment type is required' },
        { status: 400 }
      );
    }

    const exercises = await GeminiService.getExerciseRecommendations(
      equipment,
      equipment === 'dumbbell' ? Number(dumbbellWeight) : undefined,
      targetMuscle
    );

    return NextResponse.json({ exercises });
  } catch (error) {
    console.error('Error getting exercise recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
