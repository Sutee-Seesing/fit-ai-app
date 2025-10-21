"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Clock, Flame, Play, CheckCircle, Sparkles, Loader2 } from "lucide-react";
import { EquipmentSelector } from "@/components/workout/EquipmentSelector";
import storage from "@/service/storage";
import type { WorkoutLog } from "@/types/WorkoutLog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Type definitions
interface Exercise {
  name: string;
  sets: number;
  reps?: number;
  duration?: number;
  rest?: number;
}

interface Workout {
  day: string;
  focus: string;
  exercises: Exercise[];
}

interface WorkoutPlan {
  id: number;
  name: string;
  description: string;
  duration: number;
  calories: number;
  difficulty: string;
  exercises: Exercise[];
  isAIGenerated?: boolean;
  // Fields from AI response
  planName?: string;
  frequency?: number;
  equipment?: string;
  dumbbellWeight?: number;
  workouts?: Workout[];
}

const workoutPlans: WorkoutPlan[] = [
  {
    id: 1,
    name: "Full Body Workout",
    description: "แผนออกกำลังกายทั่วทั้งตัว เหมาะสำหรับผู้เริ่มต้น",
    duration: 45,
    calories: 350,
    difficulty: "beginner",
    exercises: [
      { name: "Push-ups", sets: 3, reps: 12, rest: 60 },
      { name: "Squats", sets: 3, reps: 15, rest: 60 },
      { name: "Plank", sets: 3, duration: 30, rest: 45 },
      { name: "Lunges", sets: 3, reps: 12, rest: 60 },
    ],
  },
  {
    id: 2,
    name: "Upper Body Strength",
    description: "เน้นการเล่นส่วนบน สร้างกล้ามเนื้อแขนและหลัง",
    duration: 50,
    calories: 400,
    difficulty: "intermediate",
    exercises: [
      { name: "Bench Press", sets: 4, reps: 10, rest: 90 },
      { name: "Barbell Row", sets: 4, reps: 10, rest: 90 },
      { name: "Overhead Press", sets: 3, reps: 12, rest: 75 },
      { name: "Pull-ups", sets: 3, reps: 8, rest: 90 },
      { name: "Bicep Curls", sets: 3, reps: 12, rest: 60 },
      { name: "Tricep Dips", sets: 3, reps: 12, rest: 60 },
    ],
  },
  {
    id: 3,
    name: "Lower Body Power",
    description: "เน้นขาและสะโพก สร้างความแข็งแรงส่วนล่าง",
    duration: 55,
    calories: 450,
    difficulty: "intermediate",
    exercises: [
      { name: "Barbell Squats", sets: 4, reps: 10, rest: 120 },
      { name: "Deadlifts", sets: 4, reps: 8, rest: 120 },
      { name: "Leg Press", sets: 3, reps: 12, rest: 90 },
      { name: "Bulgarian Split Squat", sets: 3, reps: 10, rest: 90 },
      { name: "Calf Raises", sets: 4, reps: 15, rest: 60 },
    ],
  },
  {
    id: 4,
    name: "HIIT Cardio",
    description: "เผาผลาญแคลอรี่สูง ปรับปรุงสมรรถภาพหัวใจและปอด",
    duration: 30,
    calories: 400,
    difficulty: "advanced",
    exercises: [
      { name: "Burpees", sets: 5, reps: 15, rest: 30 },
      { name: "Mountain Climbers", sets: 5, duration: 45, rest: 30 },
      { name: "Jump Squats", sets: 5, reps: 20, rest: 30 },
      { name: "High Knees", sets: 5, duration: 45, rest: 30 },
    ],
  },
];

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
};

const difficultyLabels = {
  beginner: "ผู้เริ่มต้น",
  intermediate: "ปานกลาง",
  advanced: "ขั้นสูง",
};

export default function WorkoutPage() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [equipment, setEquipment] = useState<'bodyweight' | 'dumbbell'>('bodyweight');
  const [dumbbellWeight, setDumbbellWeight] = useState<number>(5);
  const [dumbbellCount, setDumbbellCount] = useState<number>(2); // 1 = มือเดียว, 2 = สองมือ (คู่)
  const [workoutDays, setWorkoutDays] = useState<number>(3); // จำนวนวัน
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPlan, setAiPlan] = useState<WorkoutPlan | null>(null);
  const [aiGeneratedPlans, setAiGeneratedPlans] = useState<WorkoutPlan[]>([]); // เก็บแผนที่ AI สร้าง

  // Load persisted AI plans on mount
  useEffect(() => {
    try {
      const persisted = storage.getAiPlans();
      if (persisted && persisted.length > 0) {
        setAiGeneratedPlans(persisted as WorkoutPlan[]);
      }
    } catch (e) {
      console.warn('Failed to read persisted AI plans', e);
    }
  }, []);

  // รวมแผนที่มีอยู่กับแผนที่ AI สร้าง
  const allPlans = [...workoutPlans, ...aiGeneratedPlans];

  // Filter workout plans based on equipment
  const filteredPlans = allPlans.filter(plan => {
    if (equipment === 'bodyweight') {
      // Show bodyweight-friendly plans
      return plan.difficulty === 'beginner' || plan.id === 4; // HIIT
    }
    return true; // Show all plans for dumbbell
  });

  const handleEquipmentSelect = (selectedEquipment: 'bodyweight' | 'dumbbell', weight?: number) => {
    setEquipment(selectedEquipment);
    if (weight) setDumbbellWeight(weight);
  };

  const handleDeleteAIPlan = (planId: number) => {
    if (confirm('ต้องการลบแผนนี้?')) {
      setAiGeneratedPlans(prev => {
        const next = prev.filter(p => p.id !== planId);
        try { storage.saveAiPlans(next); } catch {}
        return next;
      });
      if (selectedPlan === planId) setSelectedPlan(null);
    }
  };

  const handleGenerateAIPlan = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/gemini/workout-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: 30, // ควรมาจาก user profile
          weight: 70,
          height: 170,
          gender: 'male',
          goal: 'สร้างกล้ามเนื้อ',
          fitnessLevel: 'intermediate',
          equipment,
          dumbbellWeight: equipment === 'dumbbell' ? dumbbellWeight : undefined,
          dumbbellCount: equipment === 'dumbbell' ? dumbbellCount : undefined,
          workoutDays,
        }),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        let data = await response.json();
        console.log('AI Plan received (raw):', data);
        
        // Fix: ถ้า API ส่งกลับมาเป็น Array ให้เอา element แรก
        if (Array.isArray(data) && data.length > 0) {
          console.log('⚠️ Data is array, extracting first element');
          data = data[0];
        }
        
        console.log('AI Plan (processed):', data);
        
        // เพิ่ม ID และข้อมูลเพิ่มเติมสำหรับแสดงในรายการ
        const planWithId = {
          ...data,
          id: Date.now(), // ใช้ timestamp เป็น ID
          isAIGenerated: true,
          difficulty: 'intermediate',
          duration: (data.workouts?.length || workoutDays) * 45, // ประมาณเวลารวม (นาที)
          calories: data.workouts?.reduce((sum: number, w: any) => sum + (w.estimatedCalories || 0), 0) || 0,
          exercises: data.workouts?.flatMap((w: any) => w.exercises || []) || [],
        };
        
        setAiPlan(data);
        // เพิ่มแผนที่สร้างเข้าไปในรายการ และ persist
        setAiGeneratedPlans(prev => {
          const next = [planWithId, ...prev];
          try { storage.saveAiPlans(next); } catch {}
          return next;
        });
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        alert('เกิดข้อผิดพลาดในการสร้างแผน: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error generating AI plan:', error);
      alert('ไม่สามารถเชื่อมต่อกับ AI ได้ กรุณาตรวจสอบ API Key');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogWorkoutSimple = (plan: WorkoutPlan) => {
    const log: WorkoutLog = {
      id: String(Date.now()),
      date: new Date().toISOString(),
      planId: plan.id,
      planName: plan.name || plan.planName,
      durationMin: plan.duration,
      calories: plan.calories,
      exercises: plan.exercises.map(e => ({ name: e.name, sets: [{ reps: e.reps ?? undefined, weightKg: undefined, durationSec: e.duration ?? undefined }] })),
    };

    try {
      storage.addWorkoutLog(log);
      alert('บันทึกการออกกำลังกายเรียบร้อย');
    } catch (err) {
      console.error(err);
      alert('ไม่สามารถบันทึกการออกกำลังกายได้');
    }
  };

  return (
  <div className="w-full px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">แผนการออกกำลังกาย</h1>
        <p className="text-muted-foreground">
          แผนที่ AI สร้างขึ้นเพื่อคุณตามเป้าหมายและความสามารถ
        </p>
      </div>

      {/* Equipment Selector */}
      <div className="mb-6">
        <EquipmentSelector
          onSelect={handleEquipmentSelect}
          defaultEquipment={equipment}
          defaultWeight={dumbbellWeight}
        />
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plans">แผนทั้งหมด</TabsTrigger>
          <TabsTrigger value="custom">สร้างด้วย AI</TabsTrigger>
          <TabsTrigger value="history">ประวัติ</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>อุปกรณ์ที่เลือก:</strong> {equipment === 'bodyweight' ? 'มือเปล่า' : `ดัมเบล ${dumbbellWeight} kg`}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {equipment === 'bodyweight' 
                ? 'แสดงแผนที่เหมาะสำหรับการออกกำลังกายแบบมือเปล่า' 
                : 'แสดงแผนทั้งหมด รวมถึงแผนที่ใช้ดัมเบล'}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {filteredPlans.map((plan) => (
              <Card key={plan.id} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle>{plan.name || plan.planName}</CardTitle>
                        {plan.isAIGenerated && (
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="mt-2">
                        {plan.description}
                      </CardDescription>
                    </div>
                    <Badge
                      className={difficultyColors[plan.difficulty as keyof typeof difficultyColors]}
                    >
                      {difficultyLabels[plan.difficulty as keyof typeof difficultyLabels]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{plan.duration} นาที</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-muted-foreground" />
                      <span>{plan.calories} kcal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dumbbell className="h-4 w-4 text-muted-foreground" />
                      <span>{plan.exercises.length} ท่า</span>
                    </div>
                  </div>

                  {selectedPlan === plan.id && (
                    <div className="space-y-3 pt-4 border-t">
                      <h4 className="font-semibold">รายละเอียดท่า:</h4>
                      {plan.exercises.map((exercise, idx) => (
                        <div
                          key={`${plan.id}-exercise-${exercise.name}-${idx}`}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{exercise.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {exercise.sets} เซต × {exercise.reps ? `${exercise.reps} ครั้ง` : `${exercise.duration} วินาที`}
                              {exercise.rest && ` • พัก ${exercise.rest}s`}
                            </p>
                          </div>
                          <CheckCircle className="h-5 w-5 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button className="flex-1 gap-2" onClick={() => handleLogWorkoutSimple(plan)}>
                      <Play className="h-4 w-4" />
                      เริ่มออกกำลังกาย
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setSelectedPlan(selectedPlan === plan.id ? null : plan.id)
                      }
                    >
                      {selectedPlan === plan.id ? "ซ่อน" : "ดู"}
                    </Button>
                    {plan.isAIGenerated && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteAIPlan(plan.id)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                สร้างแผนด้วย AI
              </CardTitle>
              <CardDescription>
                ให้ AI สร้างแผนการออกกำลังกายส่วนตัวที่เหมาะกับคุณ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal">เป้าหมายของคุณ</Label>
                <Input
                  id="goal"
                  placeholder="เช่น สร้างกล้ามเนื้อ, ลดน้ำหนัก, เพิ่มความแข็งแรง"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">อายุ (ปี)</Label>
                  <Input id="age" type="number" placeholder="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">น้ำหนัก (kg)</Label>
                  <Input id="weight" type="number" placeholder="70" />
                </div>
              </div>

              {/* จำนวนวันออกกำลังกาย */}
              <div className="space-y-2">
                <Label htmlFor="workoutDays">จำนวนวันต่อสัปดาห์</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="workoutDays"
                    type="number"
                    min="1"
                    max="7"
                    value={workoutDays}
                    onChange={(e) => setWorkoutDays(Number.parseInt(e.target.value) || 3)}
                    className="text-center"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setWorkoutDays(Math.max(1, workoutDays - 1))}
                    >
                      -
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setWorkoutDays(Math.min(7, workoutDays + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  แนะนำ: ผู้เริ่มต้น 3 วัน, ระดับกลาง 4-5 วัน, ขั้นสูง 6-7 วัน
                </p>
              </div>

              {/* จำนวนดัมเบล (แสดงเฉพาะเมื่อเลือกโหมดดัมเบล) */}
              {equipment === 'dumbbell' && (
                <div className="space-y-2">
                  <Label htmlFor="dumbbellCount">จำนวนดัมเบล</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={dumbbellCount === 1 ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setDumbbellCount(1)}
                    >
                      1 มือ
                    </Button>
                    <Button
                      type="button"
                      variant={dumbbellCount === 2 ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setDumbbellCount(2)}
                    >
                      2 มือ (คู่)
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dumbbellCount === 1 && '1 มือ - เหมาะสำหรับท่าที่ใช้มือเดียวสลับข้าง (Single-arm exercises)'}
                    {dumbbellCount === 2 && '2 มือ (คู่) - มาตรฐาน เหมาะสำหรับท่าส่วนใหญ่ (เช่น Dumbbell Press, Curls)'}
                  </p>
                </div>
              )}

              <div className="p-4 bg-muted rounded-lg space-y-2">
                <p className="text-sm font-medium">สรุปแผนที่จะสร้าง:</p>
                <div className="space-y-1 text-sm">
                  <p>
                    {equipment === 'bodyweight' 
                      ? '✓ มือเปล่า - ไม่ต้องใช้อุปกรณ์'
                      : (() => {
                          const handCount = dumbbellCount === 1 ? '1 มือ' : '2 มือ';
                          return `✓ ดัมเบล ${dumbbellWeight} kg (${handCount})`;
                        })()}
                  </p>
                  <p>✓ ออกกำลังกาย {workoutDays} วัน/สัปดาห์</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  AI จะสร้างแผนที่เหมาะสมตามข้อมูลเหล่านี้
                </p>
              </div>

              <Button 
                className="w-full gap-2" 
                onClick={handleGenerateAIPlan}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    กำลังสร้างแผน... (อาจใช้เวลา 10-15 วินาที)
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    สร้างแผนด้วย AI
                  </>
                )}
              </Button>

              {isGenerating && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    ⏳ กำลังติดต่อ Gemini AI... กรุณารอสักครู่
                  </p>
                </div>
              )}

              {/* Debug Info */}
              {aiPlan && process.env.NODE_ENV === 'development' && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground">
                    🔍 Debug: ดูข้อมูล JSON
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto max-h-40">
                    {JSON.stringify(aiPlan, null, 2)}
                  </pre>
                </details>
              )}

              {aiPlan && (
                <div className="mt-6 p-4 border rounded-lg space-y-4 bg-green-50 dark:bg-green-950">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Sparkles className="h-5 w-5" />
                    <span className="font-semibold">✓ สร้างแผนสำเร็จ!</span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">{aiPlan.planName || 'แผนการออกกำลังกาย'}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{aiPlan.description || 'ไม่มีคำอธิบาย'}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <span>⏱️ {aiPlan.duration || 1} สัปดาห์</span>
                    <span>📅 {aiPlan.frequency || 3} วัน</span>
                    {aiPlan.equipment && (
                      <span>🏋️ {aiPlan.equipment === 'bodyweight' ? 'มือเปล่า' : `ดัมเบล ${aiPlan.dumbbellWeight || 0}kg`}</span>
                    )}
                  </div>

                  {aiPlan.workouts && aiPlan.workouts.length > 0 ? (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">รายการ Workout ({aiPlan.workouts.length} วัน):</h4>
                      {aiPlan.workouts.map((workout: Workout, idx: number) => (
                        <div key={`workout-${workout.day || idx}`} className="p-3 bg-white dark:bg-gray-800 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{workout.day || `วันที่ ${idx + 1}`}</span>
                            <span className="text-sm text-muted-foreground">{workout.focus || 'Full Body'}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>⏱️ 30-45 นาที</span>
                            <span>🔥 ~200-300 kcal</span>
                            <span>💪 {workout.exercises?.length || 0} ท่า</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        ⚠️ ไม่มีข้อมูล workout ในแผนนี้
                      </p>
                    </div>
                  )}

                  <Button className="w-full mt-4">
                    เริ่มออกกำลังกาย
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ประวัติการออกกำลังกาย</CardTitle>
              <CardDescription>บันทึกการออกกำลังกายที่ผ่านมา</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">ยังไม่มีประวัติการออกกำลังกาย</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
