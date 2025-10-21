'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserProfile } from '@/contexts/UserProfileContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import {
  Gender,
  FitnessGoal,
  FitnessLevel,
  Equipment,
  Limitation,
  FITNESS_GOAL_LABELS,
  FITNESS_LEVEL_LABELS,
  EQUIPMENT_LABELS,
  LIMITATION_LABELS,
} from '@/types/UserProfile'
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'

const TOTAL_STEPS = 6

export default function OnboardingPage() {
  const router = useRouter()
  const { setProfile } = useUserProfile()
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1: ข้อมูลส่วนตัว
  const [gender, setGender] = useState<Gender>('male')
  const [age, setAge] = useState<string>('')
  const [weight, setWeight] = useState<string>('')
  const [height, setHeight] = useState<string>('')

  // Step 2: เป้าหมาย
  const [goal, setGoal] = useState<FitnessGoal>('maintain_health')
  const [goalDetails, setGoalDetails] = useState<string>('')

  // Step 3: ระดับความฟิต
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>('beginner')

  // Step 4: อุปกรณ์
  const [availableEquipment, setAvailableEquipment] = useState<Equipment[]>(['bodyweight'])
  const [dumbbellWeight, setDumbbellWeight] = useState<string>('5')
  const [dumbbellCount, setDumbbellCount] = useState<number>(2)

  // Step 5: ข้อจำกัด
  const [limitations, setLimitations] = useState<Limitation[]>(['none'])
  const [limitationDetails, setLimitationDetails] = useState<string>('')

  // Step 6: ไลฟ์สไตล์
  const [workoutDaysPerWeek, setWorkoutDaysPerWeek] = useState<string>('3')
  const [workoutDuration, setWorkoutDuration] = useState<string>('45')

  const progress = (currentStep / TOTAL_STEPS) * 100

  const handleEquipmentToggle = (equipment: Equipment) => {
    if (equipment === 'bodyweight' && availableEquipment.includes('bodyweight')) {
      // ถ้าเลือก bodyweight อยู่แล้ว อนุญาตให้เลือกอันอื่นเพิ่ม
      return
    }

    if (availableEquipment.includes(equipment)) {
      // ถ้ามีอยู่แล้ว ให้ลบออก แต่ต้องเหลืออย่างน้อย 1 อัน
      if (availableEquipment.length > 1) {
        setAvailableEquipment(availableEquipment.filter(e => e !== equipment))
      }
    } else {
      // เพิ่มใหม่
      setAvailableEquipment([...availableEquipment, equipment])
    }
  }

  const handleLimitationToggle = (limitation: Limitation) => {
    if (limitation === 'none') {
      // ถ้าเลือก "ไม่มีข้อจำกัด" ให้ลบทุกอันและเหลือแค่ none
      setLimitations(['none'])
      return
    }

    // ถ้าเลือกอื่นๆ ให้ลบ "none" ออกก่อน
    const withoutNone = limitations.filter(l => l !== 'none')

    if (limitations.includes(limitation)) {
      const newLimitations = withoutNone.filter(l => l !== limitation)
      // ถ้าลบหมดแล้ว ให้ใส่ "none" กลับไป
      setLimitations(newLimitations.length === 0 ? ['none'] : newLimitations)
    } else {
      setLimitations([...withoutNone, limitation])
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return age && weight && height && Number(age) > 0 && Number(weight) > 0 && Number(height) > 0
      case 2:
        return goal
      case 3:
        return fitnessLevel
      case 4:
        return availableEquipment.length > 0
      case 5:
        return limitations.length > 0
      case 6:
        return workoutDaysPerWeek && workoutDuration && Number(workoutDaysPerWeek) > 0 && Number(workoutDuration) > 0
      default:
        return true
    }
  }

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    } else {
      // บันทึกข้อมูลและไปหน้า Dashboard
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    const userProfile = {
      gender,
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      goal,
      goalDetails: goalDetails || undefined,
      fitnessLevel,
      availableEquipment,
      dumbbellWeight: availableEquipment.includes('dumbbell') ? Number(dumbbellWeight) : undefined,
      dumbbellCount: availableEquipment.includes('dumbbell') ? dumbbellCount : undefined,
      limitations,
      limitationDetails: limitationDetails || undefined,
      workoutDaysPerWeek: Number(workoutDaysPerWeek),
      workoutDuration: Number(workoutDuration),
      isProfileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setProfile(userProfile)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">ขั้นตอนที่ {currentStep} จาก {TOTAL_STEPS}</p>
            <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {currentStep === 1 && 'ข้อมูลส่วนตัว'}
              {currentStep === 2 && 'เป้าหมายของคุณ'}
              {currentStep === 3 && 'ระดับความฟิตปัจจุบัน'}
              {currentStep === 4 && 'อุปกรณ์ที่มี'}
              {currentStep === 5 && 'ข้อจำกัดหรืออาการบาดเจ็บ'}
              {currentStep === 6 && 'ไลฟ์สไตล์การออกกำลังกาย'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'กรุณากรอกข้อมูลพื้นฐานของคุณ'}
              {currentStep === 2 && 'คุณต้องการออกกำลังกายเพื่ออะไร?'}
              {currentStep === 3 && 'คุณมีประสบการณ์การออกกำลังกายมาก่อนหรือไม่?'}
              {currentStep === 4 && 'คุณมีอุปกรณ์อะไรบ้างที่สามารถใช้ออกกำลังกายได้?'}
              {currentStep === 5 && 'มีอาการบาดเจ็บหรือข้อจำกัดใดๆ ที่ AI ควรรู้ไหม?'}
              {currentStep === 6 && 'คุณต้องการออกกำลังกายบ่อยแค่ไหน?'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>เพศ</Label>
                  <RadioGroup value={gender} onValueChange={(v) => setGender(v as Gender)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">ชาย</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">หญิง</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">อื่นๆ</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">อายุ (ปี)</Label>
                    <Input
                      id="age"
                      type="number"
                      min="10"
                      max="100"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="25"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">น้ำหนัก (กก.)</Label>
                    <Input
                      id="weight"
                      type="number"
                      min="30"
                      max="200"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">ส่วนสูง (ซม.)</Label>
                    <Input
                      id="height"
                      type="number"
                      min="100"
                      max="250"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="170"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Goal */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <RadioGroup value={goal} onValueChange={(v) => setGoal(v as FitnessGoal)}>
                  {(Object.keys(FITNESS_GOAL_LABELS) as FitnessGoal[]).map((g) => (
                    <div key={g} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value={g} id={g} />
                      <Label htmlFor={g} className="flex-1 cursor-pointer">
                        {FITNESS_GOAL_LABELS[g]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {goal === 'sports_specific' && (
                  <div className="space-y-2">
                    <Label htmlFor="goalDetails">รายละเอียดเพิ่มเติม (เช่น วิ่งมาราธอน, เล่นฟุตบอล)</Label>
                    <Input
                      id="goalDetails"
                      value={goalDetails}
                      onChange={(e) => setGoalDetails(e.target.value)}
                      placeholder="ระบุกิจกรรมที่ต้องการเตรียมตัว"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Fitness Level */}
            {currentStep === 3 && (
              <RadioGroup value={fitnessLevel} onValueChange={(v) => setFitnessLevel(v as FitnessLevel)}>
                {(Object.keys(FITNESS_LEVEL_LABELS) as FitnessLevel[]).map((level) => (
                  <div key={level} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value={level} id={level} />
                    <Label htmlFor={level} className="flex-1 cursor-pointer">
                      {FITNESS_LEVEL_LABELS[level]}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {/* Step 4: Equipment */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>เลือกอุปกรณ์ที่คุณมี (เลือกได้หลายอัน)</Label>
                  <div className="space-y-2">
                    {(Object.keys(EQUIPMENT_LABELS) as Equipment[]).map((eq) => (
                      <div key={eq} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <Checkbox
                          id={eq}
                          checked={availableEquipment.includes(eq)}
                          onCheckedChange={() => handleEquipmentToggle(eq)}
                        />
                        <Label htmlFor={eq} className="flex-1 cursor-pointer">
                          {EQUIPMENT_LABELS[eq]}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {availableEquipment.includes('dumbbell') && (
                  <div className="p-4 bg-muted rounded-lg space-y-4">
                    <h4 className="font-medium">ตั้งค่าดัมเบล</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dumbbellWeight">น้ำหนักดัมเบล (กก.)</Label>
                        <Input
                          id="dumbbellWeight"
                          type="number"
                          min="1"
                          max="50"
                          value={dumbbellWeight}
                          onChange={(e) => setDumbbellWeight(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>จำนวน</Label>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={dumbbellCount === 1 ? 'default' : 'outline'}
                            className="flex-1"
                            onClick={() => setDumbbellCount(1)}
                          >
                            1 มือ
                          </Button>
                          <Button
                            type="button"
                            variant={dumbbellCount === 2 ? 'default' : 'outline'}
                            className="flex-1"
                            onClick={() => setDumbbellCount(2)}
                          >
                            2 มือ (คู่)
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Limitations */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>เลือกข้อจำกัด (เลือกได้หลายอัน)</Label>
                  <div className="space-y-2">
                    {(Object.keys(LIMITATION_LABELS) as Limitation[]).map((lim) => (
                      <div key={lim} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <Checkbox
                          id={lim}
                          checked={limitations.includes(lim)}
                          onCheckedChange={() => handleLimitationToggle(lim)}
                        />
                        <Label htmlFor={lim} className="flex-1 cursor-pointer">
                          {LIMITATION_LABELS[lim]}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {!limitations.includes('none') && limitations.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="limitationDetails">รายละเอียดเพิ่มเติม (ถ้ามี)</Label>
                    <Textarea
                      id="limitationDetails"
                      value={limitationDetails}
                      onChange={(e) => setLimitationDetails(e.target.value)}
                      placeholder="เช่น ปวดหลังส่วนล่างเมื่อก้มนาน, เจ็บเข่าขวาจากการบาดเจ็บเก่า"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Lifestyle */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="workoutDays">จำนวนวันที่ต้องการออกกำลังกายต่อสัปดาห์</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const val = Number(workoutDaysPerWeek)
                        if (val > 1) setWorkoutDaysPerWeek(String(val - 1))
                      }}
                    >
                      -
                    </Button>
                    <Input
                      id="workoutDays"
                      type="number"
                      min="1"
                      max="7"
                      value={workoutDaysPerWeek}
                      onChange={(e) => setWorkoutDaysPerWeek(e.target.value)}
                      className="text-center text-lg font-semibold"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const val = Number(workoutDaysPerWeek)
                        if (val < 7) setWorkoutDaysPerWeek(String(val + 1))
                      }}
                    >
                      +
                    </Button>
                    <span className="text-muted-foreground">วัน/สัปดาห์</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workoutDuration">ระยะเวลาที่สามารถออกกำลังกายต่อวัน</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const val = Number(workoutDuration)
                        if (val > 15) setWorkoutDuration(String(val - 15))
                      }}
                    >
                      -
                    </Button>
                    <Input
                      id="workoutDuration"
                      type="number"
                      min="15"
                      max="180"
                      step="15"
                      value={workoutDuration}
                      onChange={(e) => setWorkoutDuration(e.target.value)}
                      className="text-center text-lg font-semibold"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const val = Number(workoutDuration)
                        if (val < 180) setWorkoutDuration(String(val + 15))
                      }}
                    >
                      +
                    </Button>
                    <span className="text-muted-foreground">นาที/วัน</span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        เกือบเสร็จแล้ว!
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        AI จะใช้ข้อมูลเหล่านี้สร้างโปรแกรมการออกกำลังกายที่เหมาะสมที่สุดสำหรับคุณ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                ย้อนกลับ
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed()}
              >
                {currentStep === TOTAL_STEPS ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    เสร็จสิ้น
                  </>
                ) : (
                  <>
                    ถัดไป
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
