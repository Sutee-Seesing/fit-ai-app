import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image } = body;

    // Mock AI food analysis
    // In production, integrate with Google Vision AI, Clarifai, or custom model
    const foodAnalysis = {
      foodName: 'Grilled Chicken Breast with Rice',
      calories: 450,
      protein: 45,
      carbs: 50,
      fats: 8,
      confidence: 0.85,
    };

    return NextResponse.json(foodAnalysis);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to analyze food image' },
      { status: 500 }
    );
  }
}
