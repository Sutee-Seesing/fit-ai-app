# คู่มือแก้ปัญหา (Troubleshooting)

## ปัญหาที่พบบ่อย

### 1. Gemini API JSON Parse Error

#### อาการ:
```
SyntaxError: Expected ',' or ']' after array element in JSON at position 26949
```

#### สาเหตุ:
- AI สร้าง JSON ที่มี syntax error
- Response ใหญ่เกินไป (ขอข้อมูล 4 สัปดาห์เต็ม)
- AI ใส่ข้อมูลที่ไม่ได้เป็น valid JSON

#### วิธีแก้:
✅ **แก้ไขแล้ว** ในเวอร์ชันล่าสุด:

1. **ใช้ JSON Mode**
   ```typescript
   private static model = genAI.getGenerativeModel({ 
     model: 'gemini-2.0-flash-exp',
     generationConfig: {
       responseMimeType: 'application/json', // บังคับให้ตอบเป็น JSON
     },
   });
   ```

2. **ลดขนาด Response**
   - เปลี่ยนจาก 4 สัปดาห์ → 1 สัปดาห์ (3 วัน)
   - ลดจำนวนท่าต่อ workout จาก 6 → 4-5 ท่า
   - ลบฟิลด์ที่ไม่จำเป็น (instructions, tips, gifUrl)

3. **เพิ่ม Fallback**
   - ถ้า parse error จะส่งแผนพื้นฐานกลับไป
   - แจ้งให้ผู้ใช้รู้ว่ามีปัญหา

#### ตัวอย่าง Prompt ที่ปรับปรุงแล้ว:
```typescript
// ❌ ก่อนแก้ไข (ใหญ่เกิน)
{
  duration: 4, // 4 สัปดาห์
  weeks: [ ... ], // มาก
  instructions: [...], // ละเอียดเกิน
  tips: [...]
}

// ✅ หลังแก้ไข (กระชับ)
{
  duration: 1, // 1 สัปดาห์
  workouts: [ ... ], // 3 วันเท่านั้น
  // ไม่มี instructions/tips
}
```

---

### 2. EPERM: operation not permitted (.next/trace)

#### อาการ:
```
Error: EPERM: operation not permitted, open '.next\trace'
```

#### สาเหตุ:
- Dev server ยังทำงานอยู่
- ไฟล์ถูก lock โดย process อื่น
- Permission ของโฟลเดอร์ผิดพลาด

#### วิธีแก้:
```bash
# 1. หยุด dev server ทั้งหมด (Ctrl+C)

# 2. ลบโฟลเดอร์ .next
rm -rf .next

# 3. เริ่ม dev server ใหม่
npm run dev
```

---

### 3. Missing Gemini API Key

#### อาการ:
- API ตอบกลับ 500 error
- Console log: "ไม่สามารถเชื่อมต่อ AI ได้"

#### วิธีแก้:
1. สร้างไฟล์ `.env.local`
2. เพิ่ม API Key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. รีสตาร์ท dev server
4. ทดสอบอีกครั้ง

---

### 4. TypeScript Errors (Red Underlines)

#### อาการ:
- Import statements มีขีดแดง
- "Cannot find module" errors

#### วิธีแก้:
```bash
# 1. ลบ node_modules และติดตั้งใหม่
rm -rf node_modules package-lock.json
npm install

# 2. รีสตาร์ท VS Code TypeScript Server
# - เปิด Command Palette (Ctrl+Shift+P)
# - พิมพ์: TypeScript: Restart TS Server
```

---

### 5. Deprecation Warning (punycode)

#### อาการ:
```
[DEP0040] DeprecationWarning: The `punycode` module is deprecated
```

#### วิธีแก้:
```bash
# ใช้ script พิเศษที่ปิด warning
npm run dev:quiet
```

---

## การ Debug

### ดู Gemini API Response

เพิ่มการ log ใน `geminiService.ts`:

```typescript
const text = response.text();
console.log('=== Gemini Response ===');
console.log(text.substring(0, 1000)); // 1000 ตัวอักษรแรก
console.log('======================');
```

### ทดสอบ API ด้วย curl

```bash
# Test workout plan generation
curl -X POST http://localhost:3000/api/gemini/workout-plan \
  -H "Content-Type: application/json" \
  -d '{
    "age": 25,
    "weight": 70,
    "height": 170,
    "gender": "male",
    "goal": "สร้างกล้ามเนื้อ",
    "fitnessLevel": "beginner",
    "equipment": "bodyweight"
  }'
```

### ตรวจสอบ API Key

```bash
# ใน terminal
echo $GEMINI_API_KEY

# หรือในโค้ด
console.log('API Key:', process.env.GEMINI_API_KEY ? 'Set ✓' : 'Missing ✗');
```

---

## Performance Tips

### 1. ลด Response Size
- ขอเฉพาะข้อมูลที่จำเป็น
- ลด duration จาก 4 สัปดาห์ → 1 สัปดาห์
- ลดจำนวนท่า workout

### 2. ใช้ JSON Mode
```typescript
generationConfig: {
  responseMimeType: 'application/json',
}
```

### 3. Timeout และ Retry
```typescript
// เพิ่ม timeout
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 วินาที

try {
  const result = await fetch('/api/gemini/workout-plan', {
    signal: controller.signal,
  });
} finally {
  clearTimeout(timeoutId);
}
```

---

## Best Practices

### ✅ ควรทำ
- ใช้ JSON Mode ของ Gemini
- จำกัดขนาด response ให้เล็ก
- มี fallback plan เสมอ
- Log error เพื่อ debug
- ตรวจสอบ API Key ก่อนใช้

### ❌ ไม่ควรทำ
- ขอข้อมูลมากเกินไปในครั้งเดียว
- Parse JSON โดยไม่มี error handling
- Hard-code API Key ในโค้ด
- Commit .env.local เข้า git

---

## การติดต่อขอความช่วยเหลือ

ถ้าปัญหายังไม่หาย:

1. เช็ค [GEMINI_SETUP.md](./GEMINI_SETUP.md)
2. เช็ค [QUICKSTART.md](./QUICKSTART.md)
3. ดู error logs ใน terminal
4. ลองใช้ fallback plan ก่อน
5. ตรวจสอบ API quota ที่ Google AI Studio

---

## เวอร์ชันที่แก้ไข

- **v1.0** - ใช้ prompt ขนาดใหญ่ (4 สัปดาห์)
- **v1.1** - ลดเป็น 1 สัปดาห์ + เพิ่ม JSON Mode ✅
- **v1.2** - เพิ่ม fallback และ error handling ✅

---

## สรุป

ปัญหา JSON Parse Error **แก้ไขแล้ว** โดย:
1. ✅ ใช้ JSON Mode (`responseMimeType: 'application/json'`)
2. ✅ ลดขนาด response (1 สัปดาห์ แทน 4 สัปดาห์)
3. ✅ ลบฟิลด์ที่ไม่จำเป็น
4. ✅ เพิ่ม fallback plan
5. ✅ ปรับปรุง error handling

ลองใช้งานใหม่ได้เลย! 🚀
