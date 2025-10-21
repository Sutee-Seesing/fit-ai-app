import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/services/geminiService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Remove data:image/jpeg;base64, prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    const result = await GeminiService.analyzeFoodImage(base64Image);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing food:', error);
    return NextResponse.json(
      { error: 'Failed to analyze food', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
