# วิธีการรันโปรเจกต์ Fit AI Web Application

## ขั้นตอนการติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
cd fit-ai-app
npm install
```

### 2. สร้างไฟล์ Environment Variables

```bash
cp .env.example .env.local
```

แก้ไขไฟล์ `.env.local` ตามต้องการ (ถ้ามี)

### 3. รันโปรเจกต์ในโหมด Development

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

## คำสั่งที่ใช้บ่อย

```bash
# Development
npm run dev         # รันในโหมด development

# Production
npm run build       # Build โปรเจกต์
npm start           # รัน production build

# Code Quality
npm run lint        # ตรวจสอบ code style
```

## โครงสร้างหน้าต่างๆ

### 🏠 หน้าหลัก (/)
- แสดงข้อมูลเกี่ยวกับแอป
- คุณสมบัติต่างๆ
- Call-to-action เพื่อเริ่มใช้งาน

### 📊 แดชบอร์ด (/dashboard)
- สรุปข้อมูลประจำวัน (แคลอรี่, โปรตีน, การออกกำลังกาย, น้ำหนัก)
- แผนการออกกำลังกายวันนี้
- แผนโภชนาการวันนี้
- คำแนะนำจาก AI

### 💪 ออกกำลังกาย (/workout)
- แผนการออกกำลังกายทั้งหมด
- รายละเอียดท่าออกกำลังกาย
- สร้างแผนเองได้
- ประวัติการออกกำลังกาย

### 🍎 โภชนาการ (/nutrition)
- สรุปแคลอรี่และมาโครประจำวัน
- บันทึกอาหารแต่ละมื้อ
- ค้นหาและเพิ่มอาหาร
- สแกนอาหารด้วย AI (ฟีเจอร์จำลอง)

### 📈 ความคืบหน้า (/progress)
- กราฟน้ำหนักและไขมัน
- สถิติการออกกำลังกาย
- ขนาดร่างกาย (รอบอก, เอว, ฯลฯ)
- รูปภาพเปรียบเทียบ

## AI Features (Mock Implementation)

ปัจจุบันเป็น Mock AI ที่จำลองการทำงาน สามารถพัฒนาต่อได้โดย:

### 1. API Endpoints ที่พร้อมใช้งาน

- `POST /api/ai/workout-plan` - สร้างแผนการออกกำลังกาย
- `POST /api/ai/nutrition-plan` - คำนวณแผนโภชนาการ
- `POST /api/ai/analyze-food` - วิเคราะห์อาหารจากรูปภาพ
- `GET /api/ai/recommendations/:userId` - รับคำแนะนำส่วนบุคคล

### 2. การเชื่อมต่อ AI จริง (สำหรับ Production)

#### Option A: OpenAI
```bash
npm install openai
```

เพิ่มใน `.env.local`:
```
OPENAI_API_KEY=your_api_key
```

#### Option B: Google AI (Gemini)
```bash
npm install @google/generative-ai
```

#### Option C: Anthropic (Claude)
```bash
npm install @anthropic-ai/sdk
```

### 3. Vision AI สำหรับการสแกนอาหาร

#### Google Cloud Vision API
```bash
npm install @google-cloud/vision
```

#### Clarifai
```bash
npm install clarifai
```

## การปรับแต่ง

### เปลี่ยนสีธีม
แก้ไขไฟล์ `src/app/globals.css` ในส่วน CSS Variables:

```css
:root {
  --primary: 142 76% 36%;  /* สีหลัก (เขียว) */
  --secondary: 210 40% 96.1%;  /* สีรอง */
  ...
}
```

### เพิ่ม Components ใหม่
ใช้ shadcn/ui CLI:

```bash
npx shadcn-ui@latest add [component-name]
```

เช่น:
```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
```

## การ Deploy

### Vercel (แนะนำ)
```bash
npm install -g vercel
vercel
```

หรือเชื่อมต่อ GitHub repository กับ Vercel

### Netlify
```bash
npm run build
# อัพโหลด folder .next ไปยัง Netlify
```

### Docker
```bash
docker build -t fit-ai-app .
docker run -p 3000:3000 fit-ai-app
```

## ฟีเจอร์ที่สามารถพัฒนาต่อ

- [ ] Authentication (NextAuth.js)
- [ ] Database Integration (Prisma + PostgreSQL)
- [ ] Real AI Integration (OpenAI, Google AI)
- [ ] Camera/Image Upload สำหรับสแกนอาหาร
- [ ] Progressive Web App (PWA)
- [ ] Real-time notifications
- [ ] Social features (เพื่อน, challenges)
- [ ] Export data (PDF reports)
- [ ] Multi-language support
- [ ] Dark/Light mode toggle

## เทคโนโลยีที่ใช้

- **Next.js 15** - React Framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful UI components
- **Recharts** - Charts and data visualization
- **Lucide React** - Icon library

## การช่วยเหลือ

หากพบปัญหา:
1. ลองรัน `npm install` ใหม่
2. ลบ folder `.next` และ `node_modules` แล้วติดตั้งใหม่
3. ตรวจสอบ Node.js version (ควรเป็น 18 ขึ้นไป)

สนุกกับการพัฒนา! 🎉
