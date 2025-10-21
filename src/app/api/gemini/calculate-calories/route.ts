import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/services/geminiService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { baseCalories, dumbbellWeight, duration } = body;

    if (!baseCalories || !dumbbellWeight || !duration) {
      return NextResponse.json(
        { error: 'All parameters are required' },
        { status: 400 }
      );
    }

    const calories = GeminiService.calculateCaloriesWithDumbbell(
      Number(baseCalories),
      Number(dumbbellWeight),
      Number(duration)
    );

    return NextResponse.json({
      calories,
      baseCalories: Number(baseCalories),
      dumbbellWeight: Number(dumbbellWeight),
      duration: Number(duration),
      weightFactor: 1 + (Number(dumbbellWeight) / 20),
    });
  } catch (error) {
    console.error('Error calculating calories:', error);
    return NextResponse.json(
      { error: 'Failed to calculate calories' },
      { status: 500 }
    );
  }
}
