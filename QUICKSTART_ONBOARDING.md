# Quick Start Guide - Onboarding System

## 🚀 เริ่มต้นใช้งาน (5 นาที)

### 1. ติดตั้ง Dependencies (ทำแล้ว ✅)
```bash
npm install
```

### 2. ตั้งค่า Google OAuth

#### A. สร้าง Google OAuth Credentials
1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. สร้างโปรเจคใหม่หรือเลือกโปรเจคที่มี
3. ไปที่ "OAuth consent screen" → เลือก "External" → กรอกข้อมูลพื้นฐาน
4. ไปที่ "Credentials" → "+ CREATE CREDENTIALS" → "OAuth client ID"
5. เลือก "Web application"
6. เพิ่ม Authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   (ถ้าใช้ port อื่น เช่น 3001 ให้แก้ตรงนี้)
7. คัดลอก **Client ID** และ **Client Secret**

#### B. แก้ไขไฟล์ `.env.local`
```bash
# Google OAuth (ใส่ค่าจริงที่ได้จาก Google Console)
GOOGLE_CLIENT_ID=1234567890-abcdefghijk.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcd1234efgh5678

# NextAuth Secret (สร้างด้วยคำสั่งด้านล่าง)
AUTH_SECRET=your_generated_secret_here

# Gemini API Key (มีอยู่แล้ว)
GEMINI_API_KEY=AIzaSyD9hpQ6PCZwsRumSxstq1XPpVjUZt_80RE
```

#### C. สร้าง AUTH_SECRET
```bash
# บน Git Bash / Linux / Mac
openssl rand -base64 32

# หรือใช้ online generator
# https://generate-secret.vercel.app/32
```

คัดลอกผลลัพธ์ใส่ใน `AUTH_SECRET`

### 3. รัน Development Server
```bash
npm run dev
```

### 4. ทดสอบระบบ

#### A. เปิด Browser
```
http://localhost:3000
```

#### B. Login Flow
1. คลิก "เริ่มต้นใช้งาน" ที่หน้าแรก
2. หน้า Login → คลิก "เข้าสู่ระบบด้วย Google"
3. เลือกบัญชี Google ของคุณ
4. ยินยอมให้สิทธิ์

#### C. Onboarding (กรอกข้อมูล 6 ขั้นตอน)
- **Step 1:** เพศ, อายุ, น้ำหนัก, ส่วนสูง
- **Step 2:** เป้าหมาย (ลดน้ำหนัก/สร้างกล้าม/ฯลฯ)
- **Step 3:** ระดับความฟิต (เริ่มต้น/กลาง/สูง)
- **Step 4:** อุปกรณ์ที่มี (เลือกได้หลายอัน)
- **Step 5:** ข้อจำกัด/อาการบาดเจ็บ
- **Step 6:** จำนวนวันและระยะเวลาออกกำลังกาย

#### D. เสร็จสิ้น
- กดปุ่ม "เสร็จสิ้น"
- ระบบจะบันทึกข้อมูลและพาไปหน้า `/dashboard`

## ✅ ตรวจสอบการทำงาน

### Browser Console (F12)
ตรวจสอบ localStorage:
```javascript
// เปิด Console แล้วพิมพ์
console.log(JSON.parse(localStorage.getItem('userProfile')))
```

ควรเห็นข้อมูลแบบนี้:
```json
{
  "gender": "male",
  "age": 25,
  "weight": 70,
  "height": 175,
  "goal": "build_muscle",
  "fitnessLevel": "intermediate",
  "availableEquipment": ["dumbbell", "bodyweight"],
  "dumbbellWeight": 10,
  "dumbbellCount": 2,
  "limitations": ["none"],
  "workoutDaysPerWeek": 4,
  "workoutDuration": 60,
  "isProfileComplete": true,
  "createdAt": "2025-10-21T...",
  "updatedAt": "2025-10-21T..."
}
```

### ทดสอบ Protected Routes
1. Logout (คลิกรูปโปรไฟล์ → ออกจากระบบ)
2. ลองเข้า `http://localhost:3000/dashboard`
3. ควรถูก redirect ไปหน้า `/login` อัตโนมัติ ✅

### ทดสอบ Session
1. Login แล้ว
2. รีเฟรชหน้า (F5)
3. ยังคง login อยู่ (ไม่ต้อง login ใหม่) ✅

## 🎯 สิ่งที่ทำได้หลัง Onboarding

### 1. เข้าถึงข้อมูล User Profile
```tsx
'use client'
import { useUserProfile } from '@/contexts/UserProfileContext'

function MyComponent() {
  const { profile } = useUserProfile()
  
  return <div>อายุ: {profile?.age} ปี</div>
}
```

### 2. อัปเดตข้อมูล
```tsx
const { updateProfile } = useUserProfile()

updateProfile({ weight: 75 }) // เปลี่ยนน้ำหนัก
```

### 3. ตรวจสอบ Session
```tsx
'use client'
import { useSession } from 'next-auth/react'

function MyComponent() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') return <div>Loading...</div>
  if (!session) return <div>กรุณา login</div>
  
  return <div>สวัสดี {session.user?.name}</div>
}
```

## 🛠️ Troubleshooting

### ❌ "Access blocked: This app's request is invalid"
**สาเหตุ:** Redirect URI ไม่ตรง
**แก้ไข:** 
1. ตรวจสอบ port ที่ Next.js ใช้ (ดูใน terminal)
2. ไปแก้ Authorized redirect URIs ใน Google Console
   ```
   http://localhost:3001/api/auth/callback/google  (ถ้า port 3001)
   ```

### ❌ "Redirect URI mismatch"
**แก้ไข:**
- ตรวจสอบให้แน่ใจว่า URI ไม่มี trailing slash (/)
- รูปแบบที่ถูก: `http://localhost:3000/api/auth/callback/google`

### ❌ หลัง Login แล้ว redirect กลับไป /login ซ้ำๆ
**สาเหตุ:** `AUTH_SECRET` ไม่ถูกต้อง
**แก้ไข:**
```bash
# สร้างใหม่
openssl rand -base64 32

# ใส่ใน .env.local
AUTH_SECRET=ค่าที่ได้

# รีสตาร์ท server
# Ctrl+C แล้วรัน npm run dev ใหม่
```

### ❌ TypeScript Errors ใน VS Code
**แก้ไข:**
```bash
# รีสตาร์ท TS Server
# ใน VS Code กด: Ctrl+Shift+P
# พิมพ์: "TypeScript: Restart TS Server"
```

### ❌ Module not found errors
**แก้ไข:**
```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules package-lock.json
npm install
```

## 📁 โครงสร้างไฟล์สำคัญ

```
src/
├── app/
│   ├── login/page.tsx          # หน้า Login
│   ├── onboarding/page.tsx     # หน้ากรอกข้อมูล 6 ขั้นตอน
│   └── api/auth/[...nextauth]/ # API endpoint สำหรับ NextAuth
├── components/
│   ├── layout/Header.tsx       # Header มี Logout dropdown
│   └── Providers.tsx           # Wrap SessionProvider + UserProfileProvider
├── contexts/
│   └── UserProfileContext.tsx  # จัดเก็บข้อมูล user profile
├── lib/
│   └── auth.ts                 # NextAuth config
├── types/
│   └── UserProfile.ts          # Type definitions
└── middleware.ts               # ป้องกันหน้าที่ต้อง login
```

## 📚 เอกสารเพิ่มเติม

- **GOOGLE_OAUTH_SETUP.md** - ขั้นตอนละเอียดการตั้งค่า Google OAuth
- **ONBOARDING_FEATURE.md** - รายละเอียดทุกฟีเจอร์ที่พัฒนาแล้ว
- **QUICKSTART.md** - เอกสารออกแบบระบบ (blueprint)

## 🎉 เสร็จแล้ว!

ตอนนี้คุณมี:
- ✅ Google Login ที่ทำงานได้
- ✅ Onboarding 6 ขั้นตอน
- ✅ User Profile Management
- ✅ Protected Routes
- ✅ Session Management

**Next Steps:**
1. พัฒนา Dashboard (แสดงข้อมูลสรุปผู้ใช้)
2. ปรับ AI Workout Generator ให้รับข้อมูลจาก UserProfile
3. เพิ่มการบันทึกข้อมูลลง Database

---

**ต้องการความช่วยเหลือ?**
- ดู Troubleshooting section ด้านบน
- ตรวจสอบ browser console (F12)
- ตรวจสอบ terminal ที่รัน `npm run dev`
