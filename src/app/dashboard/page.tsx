"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// ui helpers removed (unused)
import { Activity, Dumbbell, Apple, TrendingUp, Target, Calendar, Zap, Sparkles, User, AlertCircle } from "lucide-react";
import Link from "next/link";
// removed unused profile label constants import

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { profile } = useUserProfile();
  // Calculate BMI
  const calculateBMI = () => {
    if (!profile) return 0;
    const heightInMeters = profile.height / 100;
    const bmiValue = profile.weight / (heightInMeters * heightInMeters);
    // return numeric value with one decimal
    return Number.parseFloat(bmiValue.toFixed(1));
  };

  // Calculate calories based on profile
  const calculateDailyCalories = () => {
    if (!profile) return 2000;
    // Harris-Benedict Formula (simplified)
    let bmr: number;
    if (profile.gender === 'male') {
      bmr = 88.362 + 13.397 * profile.weight + 4.799 * profile.height - 5.677 * profile.age;
    } else {
      bmr = 447.593 + 9.247 * profile.weight + 3.098 * profile.height - 4.33 * profile.age;
    }

  // Activity multiplier
  let activityMultiplier: number;
  if (profile.fitnessLevel === 'beginner') activityMultiplier = 1.375;
  else if (profile.fitnessLevel === 'intermediate') activityMultiplier = 1.55;
  else activityMultiplier = 1.725;

    let calories = bmr * activityMultiplier;

    // Goal adjustment
    if (profile.goal === 'lose_weight') calories -= 500;
    if (profile.goal === 'build_muscle') calories += 300;

    return Math.round(calories);
  };

  // Calculate protein needs (g)
  const calculateProtein = () => {
    if (!profile) return 150;

    // 1.6-2.2g per kg for muscle building, 1.2-1.6g for weight loss
    let multiplier = 1.6;
    if (profile.goal === 'build_muscle') multiplier = 2;
    else if (profile.goal === 'lose_weight') multiplier = 1.4;

    return Math.round(profile.weight * multiplier);
  };

  const dailyCalories = calculateDailyCalories();
  const proteinGoal = calculateProtein();
  const bmi = calculateBMI();

  // small helpers
  const getGoalLabel = () => {
    if (!profile) return '';
    switch (profile.goal) {
      case 'lose_weight': return 'ลดน้ำหนัก';
      case 'build_muscle': return 'สร้างกล้ามเนื้อ';
      case 'gain_strength': return 'เพิ่มความแข็งแรง';
      default: return 'รักษาสุขภาพ';
    }
  };

  function getEquipmentLabel() {
    if (!profile) return '';
    if (profile.availableEquipment.includes('dumbbell')) return `ดัมเบล ${profile.dumbbellWeight}kg`;
    return 'มือเปล่า';
  }

  function getFitnessLevelLabel() {
    if (!profile) return '';
    if (profile.fitnessLevel === 'beginner') return 'เริ่มต้น';
    if (profile.fitnessLevel === 'intermediate') return 'ปานกลาง';
    return 'ขั้นสูง';
  }

  function getCalorieGoalTag() {
    if (!profile) return '';
    return profile.goal === 'build_muscle' ? '(เพิ่มกล้าม)' : '';
  }

  function getBmiCategory() {
    if (bmi < 18.5) return 'ผอม';
    if (bmi < 25) return 'ปกติ';
    if (bmi < 30) return 'เริ่มอ้วน';
    return 'อ้วน';
  }

  // Redirect if no profile
  useEffect(() => {
    if (status === 'authenticated' && profile?.isProfileComplete === false) {
      router.push('/onboarding');
    }
  }, [status, profile, router]);

  if (status === 'loading') {
    return (
      <div className="w-full px-4 md:px-6 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!profile?.isProfileComplete) {
    return (
      <div className="w-full px-4 md:px-6 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="h-5 w-5" />
              <CardTitle>ยังไม่ได้ตั้งค่าโปรไฟล์</CardTitle>
            </div>
            <CardDescription>
              กรุณากรอกข้อมูลส่วนตัวเพื่อให้ AI สามารถสร้างแผนที่เหมาะสมกับคุณได้
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/onboarding">
              <Button className="w-full gap-2">
                <User className="h-4 w-4" />
                ไปที่หน้าตั้งค่าโปรไฟล์
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
  <div className="w-full px-4 md:px-6 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          สวัสดี, {session?.user?.name?.split(' ')[0] || 'คุณ'}! 👋
        </h1>
        <p className="text-muted-foreground">
          มาเริ่มต้นวันใหม่ด้วยการออกกำลังกายกันเถอะ
        </p>
      </div>

      {/* Profile Summary Card */}
      <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                ข้อมูลของคุณ
              </CardTitle>
              <CardDescription className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>เป้าหมาย: <strong>{getGoalLabel()}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Dumbbell className="h-4 w-4" />
                  <span>อุปกรณ์: <strong>{getEquipmentLabel()}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>แผน: <strong>{profile.workoutDaysPerWeek} วัน/สัปดาห์</strong> • <strong>{profile.workoutDuration} นาที/วัน</strong></span>
                </div>
              </CardDescription>
            </div>
            <Link href="/onboarding">
              <Button variant="outline" size="sm">แก้ไข</Button>
            </Link>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เป้าแคลอรี่/วัน</CardTitle>
            <Apple className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyCalories.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-2">
              kcal {profile.goal === 'lose_weight' ? '(ลดน้ำหนัก)' : getCalorieGoalTag()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">โปรตีนต่อวัน</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proteinGoal}g</div>
            <p className="text-xs text-muted-foreground mt-2">
              {(proteinGoal / profile.weight).toFixed(1)}g/kg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BMI</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{bmi.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-2">{getBmiCategory()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">น้ำหนักปัจจุบัน</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.weight} kg</div>
            <p className="text-xs text-muted-foreground mt-2">
              ส่วนสูง {profile.height} cm
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Link href="/workout" className="block">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">สร้างแผน AI</CardTitle>
                  <CardDescription className="text-xs">ให้ AI สร้างแผนให้คุณ</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/workout" className="block">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Dumbbell className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base">เริ่มออกกำลังกาย</CardTitle>
                  <CardDescription className="text-xs">เลือกแผนและเริ่มทำทันที</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/progress" className="block">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-base">ดูความคืบหน้า</CardTitle>
                  <CardDescription className="text-xs">ติดตามผลของคุณ</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* AI Recommendations */}
      <Card className="border-2 border-purple-200 dark:border-purple-900">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <CardTitle>คำแนะนำจาก AI</CardTitle>
          </div>
          <CardDescription>แผนที่เหมาะสมกับคุณวันนี้</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">💪 แนะนำสำหรับคุณ</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>ระดับของคุณ: <strong>{getFitnessLevelLabel()}</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>AI แนะนำให้เริ่มด้วยท่า {profile.availableEquipment.includes('dumbbell') 
                  ? 'Dumbbell Press และ Dumbbell Rows' 
                  : 'Push-ups และ Squats'}</span>
              </li>
              {profile.limitations && profile.limitations.length > 0 && !profile.limitations.includes('none') && (
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">⚠️</span>
                  <span>มีข้อจำกัด: {profile.limitations.join(', ')} - AI จะหลีกเลี่ยงท่าที่ไม่เหมาะสม</span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">💡</span>
                <span>ทำ {profile.workoutDaysPerWeek} วัน/สัปดาห์ เพื่อผลลัพธ์ที่ดีที่สุด</span>
              </li>
            </ul>
          </div>
          
          <Link href="/workout">
            <Button className="w-full gap-2">
              <Sparkles className="h-4 w-4" />
              สร้างแผนการออกกำลังกายด้วย AI
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
