# Onboarding System - Feature Documentation

## ภาพรวม
ระบบ Onboarding สำหรับเก็บข้อมูลผู้ใช้ตามเอกสาร QUICKSTART.md ส่วนที่ 1

## คุณสมบัติที่พัฒนาเสร็จแล้ว ✅

### 1. Authentication (Google OAuth)
- **NextAuth.js v5 (beta)** - รองรับ Next.js 15
- **Google Sign-In** - ปุ่ม Login with Google พร้อม styling สวยงาม
- **Session Management** - จัดการ session อัตโนมัติ
- **Protected Routes** - Middleware ป้องกันหน้าที่ต้อง login
- **Auto Redirect** - 
  - Login สำเร็จ → `/onboarding`
  - ไม่ได้ login เข้าหน้าที่ต้อง auth → `/login`
  - Login แล้วเข้า `/login` → `/dashboard`

### 2. Login Page (`/login`)
- **Modern UI Design** - Gradient background สวยงาม
- **Google OAuth Button** - พร้อมไอคอน Google สี
- **Feature Highlights** - แสดงจุดเด่นของแอป 3 ข้อ:
  1. สร้างแผนด้วย AI
  2. ติดตามความคืบหน้า
  3. Progressive Overload
- **Responsive** - ใช้งานได้ทั้งมือถือและเดสก์ท็อป

### 3. Onboarding Flow (6 ขั้นตอน)

#### Step 1: ข้อมูลส่วนตัว
- เพศ (ชาย/หญิง/อื่นๆ)
- อายุ (10-100 ปี)
- น้ำหนัก (30-200 กก.)
- ส่วนสูง (100-250 ซม.)

#### Step 2: เป้าหมายการออกกำลังกาย
- ลดน้ำหนัก/ลดไขมัน
- สร้างกล้ามเนื้อ
- เพิ่มความแข็งแรง
- รักษาสุขภาพโดยรวม
- เตรียมตัวสำหรับกิจกรรมเฉพาะ (พร้อม input รายละเอียด)

#### Step 3: ระดับความฟิต
- เพิ่งเริ่มต้น (ไม่เคยออกกำลังกาย)
- ระดับกลาง (1-3 วัน/สัปดาห์)
- ระดับสูง (4+ วัน/สัปดาห์)

#### Step 4: อุปกรณ์ที่มี
- มือเปล่า (Bodyweight)
- ดัมเบล (พร้อมตั้งค่าน้ำหนัก 1-50 กก. และจำนวน 1-2 มือ)
- ยางยืด
- บาร์โหน
- เสื่อโยคะ
- ฟิตเนส/ยิม (ครบทุกอุปกรณ์)
- **เลือกได้หลายรายการพร้อมกัน**

#### Step 5: ข้อจำกัด/อาการบาดเจ็บ
- ปวดหลัง
- เจ็บเข่า
- ข้อเท้าไม่ดี
- ไหล่มีปัญหา
- เจ็บข้อมือ
- ไม่มีข้อจำกัด
- **เลือกได้หลายรายการ** + textarea สำหรับรายละเอียดเพิ่มเติม

#### Step 6: ไลฟ์สไตล์
- จำนวนวันออกกำลังกาย (1-7 วัน/สัปดาห์) - ปุ่ม +/-
- ระยะเวลาต่อวัน (15-180 นาที) - ปุ่ม +/- ทีละ 15 นาที
- แสดงสรุปก่อนกดเสร็จสิ้น

### 4. User Profile Context
- **Global State Management** - `UserProfileContext` เก็บข้อมูลผู้ใช้
- **LocalStorage Persistence** - บันทึกข้อมูลใน localStorage อัตโนมัติ
- **Type-Safe** - TypeScript interfaces ครบทุก field
- **Helper Functions**:
  - `setProfile()` - บันทึกโปรไฟล์
  - `updateProfile()` - อัปเดตบางส่วน
  - `clearProfile()` - ลบข้อมูล

### 5. UI Components
- **Progress Bar** - แสดงความคืบหน้า 6 ขั้นตอน
- **Navigation Buttons** - ย้อนกลับ/ถัดไป พร้อม validation
- **Form Validation** - ป้องกันไปขั้นตอนถัดไปถ้าข้อมูลไม่ครบ
- **Conditional Rendering** - แสดง input เพิ่มเติมตามที่เลือก
- **Responsive Cards** - ใช้งานง่ายทั้งมือถือและ desktop

### 6. Header Integration
- **Dynamic Navigation** - ซ่อนเมนูถ้ายังไม่ login
- **User Dropdown** - แสดงชื่อ, อีเมล, รูปโปรไฟล์จาก Google
- **Menu Options**:
  - โปรไฟล์
  - แก้ไขข้อมูลส่วนตัว (กลับไปหน้า onboarding)
  - ออกจากระบบ
- **Avatar Display** - ใช้รูป Google account

## โครงสร้างไฟล์

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts        # NextAuth API endpoint
│   ├── login/
│   │   └── page.tsx                # หน้า Login with Google
│   ├── onboarding/
│   │   └── page.tsx                # หน้า Onboarding (6 steps)
│   ├── layout.tsx                  # Root layout + Providers
│   └── page.tsx                    # Homepage (updated button)
├── components/
│   ├── layout/
│   │   └── Header.tsx              # Header with auth dropdown
│   ├── ui/
│   │   ├── checkbox.tsx            # Checkbox component
│   │   ├── dropdown-menu.tsx       # Dropdown menu
│   │   ├── progress.tsx            # Progress bar
│   │   └── textarea.tsx            # Textarea
│   └── Providers.tsx               # SessionProvider + UserProfileProvider
├── contexts/
│   └── UserProfileContext.tsx      # User profile state management
├── lib/
│   └── auth.ts                     # NextAuth configuration
├── types/
│   ├── UserProfile.ts              # TypeScript types & labels
│   └── next-auth.d.ts              # NextAuth type extensions
└── middleware.ts                   # Route protection middleware
```

## Environment Variables

ต้องตั้งค่าใน `.env.local`:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth Secret
AUTH_SECRET=your_nextauth_secret

# Gemini API (มีอยู่แล้ว)
GEMINI_API_KEY=AIzaSy...
```

## การใช้งาน User Profile Context

```tsx
'use client'

import { useUserProfile } from '@/contexts/UserProfileContext'

function MyComponent() {
  const { profile, updateProfile } = useUserProfile()

  // เข้าถึงข้อมูล
  console.log(profile?.age) // อายุ
  console.log(profile?.goal) // เป้าหมาย
  console.log(profile?.availableEquipment) // อุปกรณ์ที่มี

  // อัปเดตข้อมูล
  const handleUpdate = () => {
    updateProfile({ weight: 75 })
  }
}
```

## User Flow

```
1. เข้าหน้าแรก (/) 
   → คลิก "เริ่มต้นใช้งาน"

2. หน้า Login (/login)
   → คลิก "เข้าสู่ระบบด้วย Google"
   → OAuth popup

3. Google Authentication
   → เลือก account
   → ยินยอม

4. Callback & Redirect
   → สร้าง session
   → ไปที่ /onboarding

5. Onboarding (6 steps)
   Step 1: ข้อมูลส่วนตัว
   Step 2: เป้าหมาย
   Step 3: ระดับความฟิต
   Step 4: อุปกรณ์
   Step 5: ข้อจำกัด
   Step 6: ไลฟ์สไตล์
   → คลิก "เสร็จสิ้น"

6. บันทึกข้อมูล
   → เก็บใน UserProfileContext
   → เก็บใน localStorage
   → redirect ไป /dashboard

7. Dashboard
   → แสดงข้อมูลผู้ใช้
   → เริ่มใช้งานแอปได้
```

## ข้อมูลที่เก็บใน UserProfile

```typescript
interface UserProfile {
  // Personal
  gender: 'male' | 'female' | 'other'
  age: number
  weight: number  // kg
  height: number  // cm
  
  // Goals
  goal: FitnessGoal
  goalDetails?: string
  
  // Fitness Level
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced'
  
  // Equipment
  availableEquipment: Equipment[]
  dumbbellWeight?: number
  dumbbellCount?: number  // 1 or 2
  
  // Limitations
  limitations: Limitation[]
  limitationDetails?: string
  
  // Lifestyle
  workoutDaysPerWeek: number  // 1-7
  workoutDuration: number     // minutes
  
  // Meta
  isProfileComplete: boolean
  createdAt: Date
  updatedAt: Date
}
```

## การใช้ข้อมูลกับ AI

ข้อมูลจาก Onboarding จะถูกส่งไปให้ Gemini AI เพื่อ:

1. **สร้างแผนการออกกำลังกาย** - ปรับท่าให้เหมาะกับ:
   - เป้าหมาย (ลดน้ำหนัก/สร้างกล้าม)
   - ระดับความฟิต
   - อุปกรณ์ที่มี
   - ข้อจำกัด/อาการบาดเจ็บ

2. **Progressive Overload** - เพิ่มความท้าทายตามความก้าวหน้า

3. **Personalized Recommendations** - แนะนำท่าและความหนักที่เหมาะสม

## Next Steps (จะพัฒนาต่อ)

### Phase 2: Dashboard
- [ ] แสดงข้อมูลสรุปผู้ใช้
- [ ] แนะนำแผนการออกกำลังกาย
- [ ] Quick actions
- [ ] Activity summary

### Phase 3: AI Workout Generator
- [ ] ปรับ Gemini prompt ให้รับข้อมูลจาก UserProfile
- [ ] สร้างแผนตาม equipment, limitations, goals
- [ ] ปรับ Progressive Overload

### Phase 4: Database Integration
- [ ] เชื่อมต่อ database (Supabase/PostgreSQL)
- [ ] บันทึก user profiles
- [ ] บันทึก workout history
- [ ] Sync across devices

## คู่มือการใช้งาน

ดูรายละเอียดการตั้งค่า Google OAuth ได้ที่:
📄 **GOOGLE_OAUTH_SETUP.md**

## Testing Checklist

- [ ] Login with Google ทำงานได้
- [ ] Session ถูกสร้างหลัง login
- [ ] Redirect ไป /onboarding หลัง login
- [ ] ทุก step ใน onboarding กรอกข้อมูลได้
- [ ] Validation ทำงาน (ไม่ให้ข้ามถ้าข้อมูลไม่ครบ)
- [ ] ข้อมูลถูกบันทึกใน localStorage
- [ ] Redirect ไป /dashboard หลัง complete
- [ ] Header แสดง user dropdown
- [ ] Logout ทำงานได้
- [ ] Protected routes ป้องกันการเข้าถึงโดยไม่ login

## Dependencies ที่เพิ่มเข้ามา

```json
{
  "next-auth": "^5.0.0-beta",
  "@radix-ui/react-checkbox": "latest",
  "@radix-ui/react-dropdown-menu": "latest",
  "@radix-ui/react-progress": "latest"
}
```

## สรุป

✅ **ส่วนที่ 1 (Onboarding & User Profile) เสร็จสมบูรณ์**

คุณสมบัติหลัก:
- Google OAuth Login
- Onboarding 6 ขั้นตอน
- User Profile Management
- Protected Routes
- LocalStorage Persistence
- TypeScript Type Safety
- Responsive UI

พร้อมใช้งานและพร้อมสำหรับการพัฒนา Phase ถัดไป! 🚀
