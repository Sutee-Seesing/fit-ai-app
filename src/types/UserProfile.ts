export type Gender = 'male' | 'female' | 'other'

export type FitnessGoal = 
  | 'lose_weight'      // ลดน้ำหนัก/ลดไขมัน
  | 'build_muscle'     // สร้างกล้ามเนื้อ
  | 'gain_strength'    // เพิ่มความแข็งแรง
  | 'maintain_health'  // รักษาสุขภาพ/ความฟิตโดยรวม
  | 'sports_specific'  // เตรียมตัวสำหรับกิจกรรมเฉพาะ

export type FitnessLevel = 
  | 'beginner'      // เพิ่งเริ่มต้น (ไม่เคยออกกำลังกายเลย)
  | 'intermediate'  // ระดับกลาง (ออกกำลังกาย 1-3 วัน/สัปดาห์)
  | 'advanced'      // ระดับสูง (ออกกำลังกาย 4+ วัน/สัปดาห์)

export type Equipment = 
  | 'bodyweight'  // ไม่มีอุปกรณ์
  | 'dumbbell'    // ดัมเบล
  | 'resistance_band'  // ยางยืด
  | 'pull_up_bar'      // บาร์โหน
  | 'yoga_mat'         // เสื่อโยคะ
  | 'full_gym'         // เข้าถึงฟิตเนส/ยิม (อุปกรณ์ครบ)

export type Limitation = 
  | 'back_pain'       // ปวดหลัง
  | 'knee_injury'     // เจ็บเข่า
  | 'ankle_problem'   // ข้อเท้าไม่ดี
  | 'shoulder_issue'  // ไหล่มีปัญหา
  | 'wrist_pain'      // เจ็บข้อมือ
  | 'none'            // ไม่มีข้อจำกัด

export interface UserProfile {
  // ข้อมูลส่วนตัว
  gender: Gender
  age: number
  weight: number  // กิโลกรัม
  height: number  // เซนติเมตร
  
  // เป้าหมาย
  goal: FitnessGoal
  goalDetails?: string  // รายละเอียดเพิ่มเติม เช่น "วิ่งมาราธอน"
  
  // ระดับความฟิต
  fitnessLevel: FitnessLevel
  
  // อุปกรณ์ที่มี (เลือกได้หลายรายการ)
  availableEquipment: Equipment[]
  
  // อุปกรณ์เฉพาะ (ถ้ามี)
  dumbbellWeight?: number  // น้ำหนักดัมเบล (กก.)
  dumbbellCount?: number   // จำนวน 1=มือเดียว, 2=สองมือ (คู่)
  
  // ข้อจำกัดหรืออาการบาดเจ็บ (เลือกได้หลายรายการ)
  limitations: Limitation[]
  limitationDetails?: string  // รายละเอียดเพิ่มเติม
  
  // ไลฟ์สไตล์
  workoutDaysPerWeek: number  // จำนวนวันที่ต้องการออกกำลังกาย (1-7)
  workoutDuration: number     // ระยะเวลาต่อวัน (นาที)
  
  // ข้อมูล Session
  isProfileComplete: boolean
  createdAt: Date
  updatedAt: Date
}

export const FITNESS_GOAL_LABELS: Record<FitnessGoal, string> = {
  lose_weight: 'ลดน้ำหนัก/ลดไขมัน',
  build_muscle: 'สร้างกล้ามเนื้อ',
  gain_strength: 'เพิ่มความแข็งแรง',
  maintain_health: 'รักษาสุขภาพ/ความฟิตโดยรวม',
  sports_specific: 'เตรียมตัวสำหรับกิจกรรมเฉพาะ',
}

export const FITNESS_LEVEL_LABELS: Record<FitnessLevel, string> = {
  beginner: 'เพิ่งเริ่มต้น (ไม่เคยออกกำลังกายเลย)',
  intermediate: 'ระดับกลาง (ออกกำลังกาย 1-3 วัน/สัปดาห์)',
  advanced: 'ระดับสูง (ออกกำลังกาย 4+ วัน/สัปดาห์)',
}

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  bodyweight: 'มือเปล่า (Bodyweight Only)',
  dumbbell: 'ดัมเบล (Dumbbell)',
  resistance_band: 'ยางยืด (Resistance Band)',
  pull_up_bar: 'บาร์โหน (Pull-up Bar)',
  yoga_mat: 'เสื่อโยคะ (Yoga Mat)',
  full_gym: 'ฟิตเนส/ยิม (Full Gym Access)',
}

export const LIMITATION_LABELS: Record<Limitation, string> = {
  back_pain: 'ปวดหลัง',
  knee_injury: 'เจ็บเข่า',
  ankle_problem: 'ข้อเท้าไม่ดี',
  shoulder_issue: 'ไหล่มีปัญหา',
  wrist_pain: 'เจ็บข้อมือ',
  none: 'ไม่มีข้อจำกัด',
}
