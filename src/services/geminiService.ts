import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Gemini AI Service for Fit AI Application
 */
export class GeminiService {
  private static model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  /**
   * Generate personalized workout plan using Gemini AI
   */
  static async generateWorkoutPlan(userProfile: {
    age: number;
    weight: number;
    height: number;
    gender: string;
    goal: string;
    fitnessLevel: string;
    equipment: 'bodyweight' | 'dumbbell';
    dumbbellWeight?: number; // kg
    dumbbellCount?: number; // จำนวนดัมเบล
    workoutDays?: number; // จำนวนวันต่อสัปดาห์
  }): Promise<any> {
    const workoutDays = userProfile.workoutDays || 3;
    const dumbbellCount = userProfile.dumbbellCount || 2;
    
    const equipmentDesc = userProfile.equipment === 'bodyweight' 
      ? 'มือเปล่า (Bodyweight) - ไม่ต้องใช้อุปกรณ์เสริม ออกกำลังกายได้ทุกที่'
      : `ดัมเบล ${userProfile.dumbbellWeight} kg (${dumbbellCount} ข้าง) - ใช้ดัมเบลเพื่อเพิ่มความท้าทายและประสิทธิภาพ`;

    const equipmentConstraints = userProfile.equipment === 'bodyweight'
      ? `
**ข้อกำหนดสำคัญ**:
- ใช้เฉพาะท่าที่ใช้น้ำหนักตัวเอง ห้ามใช้อุปกรณ์
- ท่าต้องทำได้ที่บ้านหรือที่ไหนก็ได้
- เน้นความปลอดภัยและท่าพื้นฐาน
- ตัวอย่างท่า: Push-ups, Squats, Planks, Lunges, Burpees, Mountain Climbers
      `
      : `
**ข้อกำหนดสำคัญ**:
- ใช้ดัมเบล ${userProfile.dumbbellWeight} kg จำนวน ${dumbbellCount} ข้าง
- ${dumbbellCount === 1 ? 'ท่าที่ใช้มือเดียว (Unilateral exercises)' : 'ท่าที่ใช้สองมือ (Bilateral exercises)'}
- สามารถผสมท่ามือเปล่าได้บ้าง
- คำนวณแคลอรี่เพิ่มขึ้นจากการใช้ดัมเบล
- ตัวอย่างท่า: Dumbbell Press, Dumbbell Rows, Goblet Squats, Dumbbell Curls
- แคลอรี่ = แคลอรี่พื้นฐาน × (1 + น้ำหนักดัมเบล/20)
      `;

    const prompt = `
คุณเป็น AI Personal Trainer ที่เชี่ยวชาญด้านฟิตเนส

ข้อมูลผู้ใช้:
- อายุ: ${userProfile.age} ปี
- น้ำหนัก: ${userProfile.weight} kg
- ส่วนสูง: ${userProfile.height} cm
- เพศ: ${userProfile.gender}
- เป้าหมาย: ${userProfile.goal}
- ระดับความฟิต: ${userProfile.fitnessLevel}
- อุปกรณ์: ${equipmentDesc}
- จำนวนวัน: ${workoutDays} วัน/สัปดาห์

${equipmentConstraints}

กรุณาสร้างแผนการออกกำลังกาย 1 สัปดาห์ (${workoutDays} วัน) ในรูปแบบ JSON ที่สั้นและกระชับ:

{
  "planName": "ชื่อแผน",
  "duration": 1,
  "frequency": ${workoutDays},
  "description": "คำอธิบายสั้นๆ",
  "equipment": "${userProfile.equipment}",
  "dumbbellWeight": ${userProfile.equipment === 'dumbbell' ? userProfile.dumbbellWeight : 'null'},
  "dumbbellCount": ${userProfile.equipment === 'dumbbell' ? dumbbellCount : 'null'},
  "workouts": [
    {
      "day": "วันที่ 1",
      "focus": "Upper Body",
      "duration": 30,
      "estimatedCalories": 200,
      "exercises": [
        {
          "name": "ชื่อท่า",
          "nameEn": "Exercise name",
          "sets": 3,
          "reps": 12,
          "restSeconds": 60,
          "equipment": "${userProfile.equipment}",
          "dumbbellWeight": ${userProfile.equipment === 'dumbbell' ? userProfile.dumbbellWeight : 0},
          "calories": 30,
          "muscleGroups": ["Chest"],
          "difficulty": "medium"
        }
      ]
    }
  ]
}

**สำคัญ**: 
- ให้แค่ ${workoutDays} workouts (${workoutDays} วัน)
- แต่ละ workout มี 4-5 ท่าเท่านั้น
- ไม่ต้องใส่ instructions และ tips (เพื่อลดขนาด JSON)
${userProfile.equipment === 'dumbbell' 
  ? `- คำนวณแคลอรี่: Base × (1 + ${userProfile.dumbbellWeight}/20)
- ใช้ดัมเบล ${userProfile.dumbbellWeight} kg (${dumbbellCount} ข้าง)`
  : `- ท่ามือเปล่าเท่านั้น`}
- **ตอบเป็น JSON Object เดียว ไม่ใช่ Array**
- **ห้ามใส่ [...] รอบนอก ให้เป็น {...} เท่านั้น**
- ตอบเป็น JSON เท่านั้น ไม่ต้องมีข้อความอื่น
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // With JSON mode enabled, the response should be valid JSON
      try {
        let parsed = JSON.parse(text);
        
        // Fix: ถ้า Gemini ส่งกลับมาเป็น Array ให้เอา element แรก
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('⚠️ Gemini returned array, extracting first element');
          parsed = parsed[0];
        }
        
        return parsed;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response text:', text.substring(0, 500));
        
        // Return a fallback workout plan
        return {
          planName: `แผน${userProfile.equipment === 'bodyweight' ? 'มือเปล่า' : 'ดัมเบล'} พื้นฐาน`,
          duration: 1,
          frequency: 3,
          description: 'แผนพื้นฐานสำหรับเริ่มต้น (AI มีปัญหา กรุณาลองใหม่)',
          equipment: userProfile.equipment,
          dumbbellWeight: userProfile.dumbbellWeight,
          workouts: []
        };
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Return a fallback workout plan
      return {
        planName: `แผน${userProfile.equipment === 'bodyweight' ? 'มือเปล่า' : 'ดัมเบล'} พื้นฐาน`,
        duration: 1,
        frequency: 3,
        description: 'ไม่สามารถเชื่อมต่อ AI ได้ กรุณาตรวจสอบ API Key',
        equipment: userProfile.equipment,
        dumbbellWeight: userProfile.dumbbellWeight,
        workouts: []
      };
    }
  }

  /**
   * Calculate calories burned with dumbbell weight factor
   */
  static calculateCaloriesWithDumbbell(
    baseCalories: number,
    dumbbellWeight: number,
    duration: number // minutes
  ): number {
    // Weight factor: heavier weights = more calories
    const weightFactor = 1 + (dumbbellWeight / 20);
    const caloriesPerMinute = baseCalories * weightFactor;
    return Math.round(caloriesPerMinute * duration);
  }

  /**
   * Get exercise recommendations based on equipment
   */
  static async getExerciseRecommendations(
    equipment: 'bodyweight' | 'dumbbell',
    dumbbellWeight?: number,
    targetMuscle?: string
  ): Promise<any[]> {
    const prompt = `
คุณเป็นผู้เชี่ยวชาญด้านฟิตเนส

กรุณาแนะนำท่าออกกำลังกาย 10 ท่า ที่ใช้:
- อุปกรณ์: ${equipment === 'bodyweight' ? 'มือเปล่า' : `ดัมเบล ${dumbbellWeight} kg`}
${targetMuscle ? `- กล้ามเนื้อเป้าหมาย: ${targetMuscle}` : ''}

ตอบกลับในรูปแบบ JSON array:
[
  {
    "name": "ชื่อท่าภาษาไทย",
    "nameEn": "English name",
    "equipment": "bodyweight/dumbbell",
    "dumbbellWeight": น้ำหนัก (ถ้ามี),
    "muscleGroups": ["กล้ามเนื้อหลัก"],
    "difficulty": "easy/medium/hard",
    "caloriesBurned": แคลอรี่ต่อ 10 ครั้ง,
    "description": "คำอธิบายสั้นๆ",
    "gifUrl": "ชื่อไฟล์ GIF (เช่น pushup.gif)"
  }
]
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return [];
    } catch (error) {
      console.error('Gemini API Error:', error);
      return [];
    }
  }

  /**
   * Analyze food image and return nutrition info
   */
  static async analyzeFoodImage(imageBase64: string): Promise<any> {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `
วิเคราะห์รูปอาหารนี้และบอกข้อมูลโภชนาการในรูปแบบ JSON:

{
  "foodName": "ชื่ออาหาร",
  "foodNameEn": "Food name in English",
  "servingSize": "ขนาดหนึ่งที่",
  "calories": แคลอรี่,
  "protein": โปรตีน (g),
  "carbs": คาร์โบไฮเดรต (g),
  "fats": ไขมัน (g),
  "fiber": ใยอาหาร (g),
  "sugar": น้ำตาล (g),
  "ingredients": ["ส่วนประกอบ"],
  "confidence": ความมั่นใจ 0-1
}
`;

    try {
      const imageParts = [
        {
          inlineData: {
            data: imageBase64,
            mimeType: 'image/jpeg',
          },
        },
      ];

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to analyze food');
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  /**
   * Get personalized fitness advice
   */
  static async getPersonalizedAdvice(userStats: {
    currentWeight: number;
    targetWeight: number;
    weeklyProgress: number;
    workoutFrequency: number;
    averageCalories: number;
  }): Promise<string[]> {
    const prompt = `
คุณเป็น AI Fitness Coach ที่ให้คำปรึกษา

สถิติผู้ใช้:
- น้ำหนักปัจจุบัน: ${userStats.currentWeight} kg
- น้ำหนักเป้าหมาย: ${userStats.targetWeight} kg
- ความคืบหน้าต่อสัปดาห์: ${userStats.weeklyProgress} kg
- ความถี่ออกกำลังกาย: ${userStats.workoutFrequency} ครั้ง/สัปดาห์
- แคลอรี่เฉลี่ย: ${userStats.averageCalories} kcal/วัน

ให้คำแนะนำ 3-5 ข้อ ในรูปแบบ JSON array:
["คำแนะนำที่ 1", "คำแนะนำที่ 2", ...]

คำแนะนำควรเฉพาะเจาะจง สร้างสรรค์ และเป็นประโยชน์
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return ['ออกกำลังกายสม่ำเสมอ', 'กินอาหารให้ครบ 5 หมู่', 'พักผ่อนให้เพียงพอ'];
    } catch (error) {
      console.error('Gemini API Error:', error);
      return ['ออกกำลังกายสม่ำเสมอ', 'กินอาหารให้ครบ 5 หมู่', 'พักผ่อนให้เพียงพอ'];
    }
  }
}
