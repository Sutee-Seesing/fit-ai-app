import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, goal, weight, height, age, gender } = body;

    // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Adjust for activity level and goal
    let dailyCalories = bmr * 1.55; // Moderate activity

    if (goal === 'lose-weight') {
      dailyCalories -= 500; // 500 calorie deficit for weight loss
    } else if (goal === 'gain-muscle') {
      dailyCalories += 300; // 300 calorie surplus for muscle gain
    }

    // Calculate macros
    const proteinPerKg = goal === 'gain-muscle' ? 2.0 : 1.6;
    const protein = Math.round(weight * proteinPerKg);
    
    const fatsCalories = dailyCalories * 0.25;
    const fats = Math.round(fatsCalories / 9);
    
    const proteinCalories = protein * 4;
    const carbsCalories = dailyCalories - proteinCalories - fatsCalories;
    const carbs = Math.round(carbsCalories / 4);

    const nutritionPlan = {
      dailyCalories: Math.round(dailyCalories),
      protein,
      carbs,
      fats,
    };

    return NextResponse.json(nutritionPlan);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate nutrition plan' },
      { status: 500 }
    );
  }
}
