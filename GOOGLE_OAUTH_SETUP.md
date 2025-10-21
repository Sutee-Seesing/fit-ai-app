# การตั้งค่า Google OAuth สำหรับ Login

## ขั้นตอนการตั้งค่า Google Cloud Console

### 1. สร้าง Project ใหม่
1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. คลิก "Select a project" ที่มุมบนซ้าย
3. คลิก "NEW PROJECT"
4. ตั้งชื่อโปรเจค (เช่น "Fit AI App")
5. คลิก "CREATE"

### 2. เปิดใช้งาน Google OAuth
1. ไปที่เมนู "APIs & Services" > "OAuth consent screen"
2. เลือก "External" (สำหรับ development)
3. กรอกข้อมูล:
   - App name: `Fit AI App`
   - User support email: อีเมลของคุณ
   - Developer contact: อีเมลของคุณ
4. คลิก "SAVE AND CONTINUE"
5. ข้าม Scopes (คลิก "SAVE AND CONTINUE")
6. เพิ่ม Test users (อีเมลที่ใช้ทดสอบ)
7. คลิก "SAVE AND CONTINUE"

### 3. สร้าง OAuth 2.0 Credentials
1. ไปที่ "APIs & Services" > "Credentials"
2. คลิก "+ CREATE CREDENTIALS" > "OAuth client ID"
3. Application type: เลือก "Web application"
4. Name: `Fit AI Web Client`
5. Authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
6. คลิก "CREATE"
7. คัดลอก **Client ID** และ **Client Secret**

### 4. ตั้งค่าใน `.env.local`

เปิดไฟล์ `.env.local` และแก้ไข:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here

# NextAuth Secret (สร้างด้วยคำสั่ง: openssl rand -base64 32)
AUTH_SECRET=your_generated_secret_here
```

### 5. สร้าง AUTH_SECRET

เปิด Terminal และรันคำสั่ง:

```bash
# Windows (Git Bash)
openssl rand -base64 32

# หรือใช้ online generator
# https://generate-secret.vercel.app/32
```

คัดลอกผลลัพธ์ใส่ใน `AUTH_SECRET`

### 6. เปลี่ยน Port (ถ้าจำเป็น)

ถ้า Next.js รันอยู่ที่ port อื่น (เช่น 3001):
1. กลับไปที่ Google Cloud Console > Credentials
2. แก้ไข Authorized redirect URIs เป็น:
   - `http://localhost:3001/api/auth/callback/google`

## การทดสอบ

1. รีสตาร์ท development server:
   ```bash
   npm run dev
   ```

2. เปิด browser ไปที่: `http://localhost:3000/login`

3. คลิก "เข้าสู่ระบบด้วย Google"

4. เลือกบัญชี Google (ต้องเป็น Test user ที่เพิ่มไว้)

5. หลังจาก login สำเร็จจะไปที่หน้า `/onboarding`

## Troubleshooting

### Error: "Access blocked: This app's request is invalid"
**สาเหตุ:** Redirect URI ไม่ตรงกับที่ตั้งค่าไว้
**แก้ไข:** 
- ตรวจสอบ port ที่ใช้ (3000 หรือ 3001)
- แก้ไข Authorized redirect URIs ใน Google Console ให้ตรงกับ port

### Error: "Redirect URI mismatch"
**สาเหตุ:** URI ที่ส่งไปไม่ตรงกับที่ลงทะเบียน
**แก้ไข:**
- ตรวจสอบให้แน่ใจว่า URI มีรูปแบบ: `http://localhost:PORT/api/auth/callback/google`
- ไม่มี trailing slash (/)

### Error: "Invalid client"
**สาเหตุ:** Client ID หรือ Secret ผิด
**แก้ไข:**
- คัดลอก Client ID และ Secret ใหม่จาก Google Console
- ตรวจสอบว่าไม่มีช่องว่างหรืออักขระพิเศษแปลกปลอม

### หน้าเว็บ Redirect กลับไปที่ Login ซ้ำๆ
**สาเหตุ:** AUTH_SECRET ไม่ถูกต้องหรือไม่มี
**แก้ไข:**
- สร้าง AUTH_SECRET ใหม่ด้วย `openssl rand -base64 32`
- ใส่ใน `.env.local`
- รีสตาร์ท dev server

## ไฟล์สำคัญที่เกี่ยวข้อง

- `/src/lib/auth.ts` - NextAuth configuration
- `/src/app/api/auth/[...nextauth]/route.ts` - API route สำหรับ authentication
- `/src/middleware.ts` - Middleware ป้องกันหน้าที่ต้อง login
- `/src/app/login/page.tsx` - หน้า Login
- `/src/app/onboarding/page.tsx` - หน้า Onboarding เก็บข้อมูลผู้ใช้

## Flow การทำงาน

1. User เข้าหน้า `/login`
2. คลิกปุ่ม "เข้าสู่ระบบด้วย Google"
3. Redirect ไปที่ Google OAuth
4. เลือกบัญชี Google และยินยอม
5. Callback กลับมาที่ `/api/auth/callback/google`
6. NextAuth สร้าง session
7. Redirect ไปหน้า `/onboarding` เพื่อกรอกข้อมูล
8. หลังกรอกข้อมูลเสร็จ → ไปหน้า `/dashboard`

## Security Notes

- **NEVER commit `.env.local` to Git**
- ใช้ `.env.example` แทนสำหรับ template
- Production ต้องใช้ HTTPS
- เปลี่ยน OAuth consent screen เป็น "Production" ก่อน deploy
