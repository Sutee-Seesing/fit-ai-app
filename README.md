# Fit AI Web Application

เว็บแอปพลิเคชันฟิตเนสที่ใช้ปัญญาประดิษฐ์ (AI) สร้างแผนการออกกำลังกายและโภชนาการส่วนบุคคล

## คุณสมบัติหลัก

### 🏋️ แผนการออกกำลังกายส่วนบุคคล
- สร้างแผนการออกกำลังกายที่ปรับเปลี่ยนตามเป้าหมาย
- ปรับตามระดับความฟิตและประวัติการออกกำลังกาย
- แผนการยกน้ำหนักและคาร์ดิโอที่หลากหลาย
- **รองรับ 2 โหมด: มือเปล่า (Bodyweight) และดัมเบล (Dumbbell)**
- **คำนวณแคลอรี่อัตโนมัติตามน้ำหนักดัมเบล**
- **ระบบแนะนำท่าออกกำลังกายตามอุปกรณ์ที่มี**

### 🎯 ระบบเลือกอุปกรณ์
- **มือเปล่า**: ออกกำลังกายได้ทุกที่ ไม่ต้องใช้อุปกรณ์
- **ดัมเบล**: ระบุน้ำหนักได้ (1-50 kg) เพื่อเพิ่มประสิทธิภาพ
- Filter แผนการออกกำลังกายอัตโนมัติตามอุปกรณ์
- AI สร้างแผนที่เหมาะสมกับอุปกรณ์ที่เลือก

### 🍎 การติดตามโภชนาการ
- สแกนอาหารเพื่อวิเคราะห์แคลอรี่และสารอาหาร
- ติดตามการบริโภคอาหารรายวัน
- ตั้งเป้าหมายทางโภชนาการ

### 📊 การติดตามความคืบหน้า
- Dashboard แสดงผลความคืบหน้า
- กราฟและชาร์ตเพื่อวิเคราะห์ผล
- ระบบสร้างแรงจูงใจ

### 🤖 AI-Powered (Gemini 2.0 Flash)
- ปรับเปลี่ยนแผนอัตโนมัติตามความคืบหน้า
- คำแนะนำที่เหมาะสมกับแต่ละบุคคลและอุปกรณ์
- โค้ชส่วนตัวด้วย AI
- **รองรับการสร้างแผนตามอุปกรณ์ที่มี**

## เริ่มต้นใช้งาน

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` และเพิ่ม Gemini API Key:

```env
GEMINI_API_KEY=your_api_key_here
```

วิธีรับ API Key:
1. ไปที่ [Google AI Studio](https://makersuite.google.com/app/apikey)
2. สร้าง API Key ใหม่
3. Copy และใส่ใน `.env.local`

ดูรายละเอียดเพิ่มเติมใน [GEMINI_SETUP.md](./GEMINI_SETUP.md)

### 3. รันโปรเจกต์

```bash
# Development mode
npm run dev

# Development mode (ไม่แสดง deprecation warnings)
npm run dev:quiet
```

เปิดเบราว์เซอร์ที่ http://localhost:3000

## คู่มือการใช้งาน

### 📚 เอกสารประกอบ

- **[README.md](./README.md)** - คู่มือหลัก
- **[SETUP.md](./SETUP.md)** - คู่มือติดตั้งและตั้งค่าโปรเจกต์
- **[GEMINI_SETUP.md](./GEMINI_SETUP.md)** - คู่มือตั้งค่า Gemini AI
- **[QUICKSTART.md](./QUICKSTART.md)** - คู่มือเริ่มต้นใช้งานอย่างรวดเร็ว
- **[EQUIPMENT_GUIDE.md](./EQUIPMENT_GUIDE.md)** - คู่มือการใช้งานฟีเจอร์อุปกรณ์

### 🏋️ การใช้งานระบบเลือกอุปกรณ์

1. เข้าหน้า **แผนการออกกำลังกาย** (`/workout`)
2. เลือกอุปกรณ์ที่ต้องการ:
   - **มือเปล่า**: ไม่ต้องใช้อุปกรณ์ ออกกำลังกายได้ทุกที่
   - **ดัมเบล**: ระบุน้ำหนัก 1-50 kg เพื่อเพิ่มประสิทธิภาพ
3. ระบบจะ Filter แผนอัตโนมัติ
4. สร้างแผนด้วย AI ที่แท็บ "สร้างด้วย AI"

#### ตัวอย่างการใช้งาน

**โหมดมือเปล่า:**
- แสดงแผนสำหรับผู้เริ่มต้น
- แสดงท่า Bodyweight เท่านั้น
- เหมาะสำหรับการออกกำลังกายที่บ้าน

**โหมดดัมเบล:**
- แสดงแผนทั้งหมด
- คำนวณแคลอรี่: `Base × (1 + น้ำหนัก/20) × เวลา`
- ตัวอย่าง: ดัมเบล 10kg เผาผลาญแคลอรี่มากกว่ามือเปล่า 50%

ดูคู่มือฉบับเต็มที่ [EQUIPMENT_GUIDE.md](./EQUIPMENT_GUIDE.md)

## เทคโนโลยีที่ใช้

- **Next.js 15** - React Framework with App Router
- **TypeScript** - Type Safety
- **Tailwind CSS** - Utility-first CSS Framework
- **shadcn/ui** - Beautiful UI Components
- **Recharts** - Data Visualization
- **Radix UI** - Accessible Unstyled Components
- **Gemini 2.0 Flash** - Google's AI for Workout Planning
- **@google/generative-ai** - Gemini AI SDK

## API Endpoints

### Gemini AI Endpoints

```bash
POST /api/gemini/workout-plan      # สร้างแผนออกกำลังกาย
POST /api/gemini/exercises          # แนะนำท่าออกกำลังกาย
POST /api/gemini/analyze-food       # วิเคราะห์อาหารจากรูป
POST /api/gemini/advice             # คำแนะนำส่วนบุคคล
POST /api/gemini/calculate-calories # คำนวณแคลอรี่
```

ดูตัวอย่างการใช้งานใน [QUICKSTART.md](./QUICKSTART.md)

## โครงสร้างโปรเจกต์

```
fit-ai-app/
├── src/
│   ├── app/                    # App Router
│   │   ├── api/               # API Routes
│   │   │   └── gemini/       # Gemini AI endpoints
│   │   ├── dashboard/         # Dashboard page
│   │   ├── workout/           # Workout planning page
│   │   ├── nutrition/         # Nutrition tracking page
│   │   ├── progress/          # Progress tracking page
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React Components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Layout components
│   │   ├── workout/          # Workout components
│   │   │   ├── EquipmentSelector.tsx
│   │   │   └── ExerciseAnimation.tsx
│   │   ├── nutrition/        # Nutrition components
│   │   └── dashboard/        # Dashboard components
│   ├── lib/                   # Utilities
│   ├── types/                 # TypeScript types
│   └── services/              # API services
│       ├── apiClient.ts       # HTTP client
│       ├── aiService.ts       # Mock AI service
│       └── geminiService.ts   # Gemini AI service
├── public/                    # Static files
│   └── exercises/            # Exercise GIF animations
├── EQUIPMENT_GUIDE.md         # Equipment usage guide
├── GEMINI_SETUP.md           # Gemini AI setup guide
├── QUICKSTART.md             # Quick start guide
└── ...config files
```

## คุณสมบัติพิเศษ

### 🎨 UI/UX
- Responsive Design ใช้งานได้ทุกอุปกรณ์
- Dark/Light Mode
- Smooth Animations
- Accessible Components (ARIA)

### 💪 Workout Features
- Equipment-based filtering (Bodyweight/Dumbbell)
- Dumbbell weight selection (1-50 kg)
- Dynamic calorie calculation
- Exercise animations (GIF support)
- AI-generated personalized plans
- Progress tracking

### 📊 Analytics
- Weight tracking over time
- Calories burned tracking
- Workout frequency analysis
- Goal achievement metrics

### 🔐 Security
- Environment variable protection
- API key security
- Input validation
- Error handling

## การพัฒนา

สร้างโดยใช้ Next.js App Router และ shadcn/ui สำหรับ UI components ที่สวยงามและใช้งานง่าย

## License

MIT
