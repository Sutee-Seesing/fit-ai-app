import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Apple, TrendingUp, Brain, Dumbbell, Calendar } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-background">
      <div className="w-full px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                เปลี่ยนชีวิตด้วย <span className="text-primary">AI Fitness Coach</span>
              </h1>
              <p className="mx-auto w-full text-gray-500 md:text-xl dark:text-gray-400">
                แผนการออกกำลังกายและโภชนาการส่วนบุคคลที่ปรับเปลี่ยนตามความต้องการของคุณ
                พร้อมการติดตามความคืบหน้าแบบเรียลไทม์
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  <Activity className="h-5 w-5" />
                  เริ่มต้นใช้งาน
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg">
                  เรียนรู้เพิ่มเติม
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className=" px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              คุณสมบัติที่โดดเด่น
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl">
              เครื่องมือครบครันสำหรับการดูแลสุขภาพแบบครบวงจร
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
            <Card>
              <CardHeader>
                <Dumbbell className="h-10 w-10 text-primary mb-2" />
                <CardTitle>แผนการออกกำลังกายส่วนบุคคล</CardTitle>
                <CardDescription>
                  สร้างแผนการออกกำลังกายที่เหมาะกับระดับความฟิตและเป้าหมายของคุณ
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Apple className="h-10 w-10 text-primary mb-2" />
                <CardTitle>การติดตามโภชนาการ</CardTitle>
                <CardDescription>
                  สแกนอาหารและติดตามแคลอรี่พร้อมคำแนะนำทางโภชนาการจาก AI
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-2" />
                <CardTitle>ติดตามความคืบหน้า</CardTitle>
                <CardDescription>
                  วิเคราะห์และแสดงผลความคืบหน้าของคุณด้วยกราฟและชาร์ตที่เข้าใจง่าย
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Brain className="h-10 w-10 text-primary mb-2" />
                <CardTitle>AI-Powered คำแนะนำ</CardTitle>
                <CardDescription>
                  รับคำแนะนำที่ปรับเปลี่ยนอัตโนมัติตามผลการออกกำลังกายของคุณ
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-10 w-10 text-primary mb-2" />
                <CardTitle>วางแผนรายวัน</CardTitle>
                <CardDescription>
                  จัดการตารางออกกำลังกายและมื้ออาหารประจำวันอย่างง่ายดาย
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Activity className="h-10 w-10 text-primary mb-2" />
                <CardTitle>สร้างแรงจูงใจ</CardTitle>
                <CardDescription>
                  ระบบรางวัลและความท้าทายที่ช่วยให้คุณมีแรงจูงใจในการออกกำลังกาย
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className=" px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center w-full">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                พร้อมที่จะเริ่มต้นหรือยัง?
              </h2>
              <p className="mx-auto w-full text-gray-500 md:text-xl dark:text-gray-400">
                เริ่มต้นการเปลี่ยนแปลงชีวิตของคุณวันนี้ด้วย AI Fitness Coach
              </p>
            </div>
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                <Activity className="h-5 w-5" />
                เริ่มต้นฟรี
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
