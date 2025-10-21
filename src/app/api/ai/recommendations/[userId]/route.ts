import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    // Mock AI recommendations
    // In production, analyze user's workout history, nutrition, and progress
    const recommendations = [
      'ความคืบหน้าดีมาก! ขอแนะนำให้เพิ่มน้ำหนักในท่า Bench Press จาก 40kg เป็น 42.5kg',
      'คุณควรเพิ่มโปรตีนอีก 20g ต่อวันเพื่อผลลัพธ์ที่ดีขึ้น',
      'พักผ่อนให้เพียงพอ ควรนอนอย่างน้อย 7-8 ชั่วโมงต่อคืน',
      'ลองเพิ่มท่า Cardio HIIT 1-2 ครั้งต่อสัปดาห์เพื่อเพิ่มการเผาผลาญแคลอรี่',
    ];

    return NextResponse.json({ recommendations });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}
