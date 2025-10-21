import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/services/geminiService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      currentWeight,
      targetWeight,
      weeklyProgress,
      workoutFrequency,
      averageCalories,
    } = body;

    if (!currentWeight || !targetWeight) {
      return NextResponse.json(
        { error: 'Weight data is required' },
        { status: 400 }
      );
    }

    const advice = await GeminiService.getPersonalizedAdvice({
      currentWeight: Number(currentWeight),
      targetWeight: Number(targetWeight),
      weeklyProgress: Number(weeklyProgress) || 0,
      workoutFrequency: Number(workoutFrequency) || 0,
      averageCalories: Number(averageCalories) || 0,
    });

    return NextResponse.json({ advice });
  } catch (error) {
    console.error('Error getting advice:', error);
    return NextResponse.json(
      { error: 'Failed to get advice', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
