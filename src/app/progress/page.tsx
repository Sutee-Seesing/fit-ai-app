"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import storage from "@/service/storage";
import progressive from "@/service/progressive";
import type { WeightEntry } from "@/types/WeightEntry";
import WorkoutSessionLogger from "@/components/workout/WorkoutSessionLogger";
import { TrendingDown, TrendingUp, Calendar, Weight } from "lucide-react";
import { useEffect, useState } from "react";

// weightData will be loaded from persisted weight entries

function computeWorkoutData(logs: any[]) {
  const buckets = [0, 0, 0, 0];
  const dur = [0, 0, 0, 0];
  const cal = [0, 0, 0, 0];
  const vol = [0, 0, 0, 0];
  const now = new Date();

  for (const l of logs || []) {
    const d = new Date(l.date);
    const daysAgo = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    const weekIndex = Math.min(3, Math.floor(daysAgo / 7));
    buckets[weekIndex] += 1;
    dur[weekIndex] += l.durationMin || 0;
    cal[weekIndex] += l.calories || 0;
    // compute volume from exercises: sum(reps * weightKg)
    const v = (l.exercises || []).reduce((es: number, ex: any) => {
      return es + (ex.sets || []).reduce((sAcc: number, s: any) => sAcc + ((s.reps || 0) * (s.weightKg || 0)), 0);
    }, 0);
    vol[weekIndex] += v;
  }

  return buckets.map((sessions, i) => ({ week: `สัปดาห์ ${i + 1}`, sessions, duration: dur[i], calories: cal[i], volume: vol[i] }));
}

const measurementData = {
  current: {
    chest: 95,
    waist: 82,
    hips: 98,
    arms: 35,
    thighs: 56,
  },
  previous: {
    chest: 97,
    waist: 86,
    hips: 101,
    arms: 34,
    thighs: 58,
  },
};

export default function ProgressPage() {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(() => storage.getWeightEntries());

  useEffect(() => {
    setWeightEntries(storage.getWeightEntries());
  }, []);

  const weightData = (weightEntries || []).map((e) => ({ date: new Date(e.date).toLocaleDateString(), weight: e.weightKg, bodyFat: e.bodyFat }));
  const currentWeight = weightData.at(-1)?.weight ?? 0;
  const previousWeight = weightData[0]?.weight ?? currentWeight;
  const weightChange = currentWeight - previousWeight;

  const [logs, setLogs] = useState(() => storage.getWorkoutLogs());
  useEffect(() => {
    setLogs(storage.getWorkoutLogs());
  }, []);

  const workoutData = computeWorkoutData(logs);
  const suggestions = progressive.suggestProgressiveOverload(logs);

  const handleDeleteLog = (id: string) => {
    if (!confirm('ลบบันทึกนี้?')) return;
    const next = storage.removeWorkoutLog(id);
    setLogs(next);
  };

  const handleQuickLog = () => {
    // Quick workout log example
    const sample = {
      id: String(Date.now()),
      date: new Date().toISOString(),
      planName: 'Quick Log',
      durationMin: 30,
      calories: 250,
      exercises: [{ name: 'Bodyweight Circuit', sets: [{ reps: 10 }] }],
    };
    const next = storage.addWorkoutLog(sample as any);
    setLogs(next);
    alert('บันทึกเซสชันเรียบร้อย');
  };

  const handleRecordTodayWeight = () => {
    const val = prompt('กรอกน้ำหนักวันนี้ (kg)');
    if (!val) return;
    const num = Number.parseFloat(val);
    if (Number.isNaN(num)) {
      alert('ค่าที่กรอกไม่ถูกต้อง');
      return;
    }
    const entry: WeightEntry = { id: String(Date.now()), date: new Date().toISOString(), weightKg: num };
    const next = storage.addWeightEntry(entry as any);
    setWeightEntries(next);
    alert('บันทึกน้ำหนักเรียบร้อย');
  };

  return (
  <div className="w-full px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">ความคืบหน้า</h1>
        <p className="text-muted-foreground">
          ติดตามและวิเคราะห์ผลลัพธ์ของคุณ
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">น้ำหนักปัจจุบัน</CardTitle>
            <Weight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentWeight} kg</div>
            <div className="flex items-center text-xs">
              {weightChange < 0 ? (
                <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-600 mr-1" />
              )}
              <span className={weightChange < 0 ? "text-green-600" : "text-red-600"}>
                {Math.abs(weightChange).toFixed(1)} kg
              </span>
              <span className="text-muted-foreground ml-1">จากเริ่มต้น</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ไขมันในร่างกาย</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20.5%</div>
            <p className="text-xs text-green-600">
              -1.5% จากเริ่มต้น
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ออกกำลังกายทั้งหมด</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workoutData.reduce((s, w) => s + w.sessions, 0)} ครั้ง</div>
            <p className="text-xs text-muted-foreground">
              ในเดือนนี้
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">แคลอรี่เผาผลาญ</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,400</div>
            <p className="text-xs text-muted-foreground">
              ในเดือนนี้
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>บันทึกการออกกำลังกายล่าสุด</CardTitle>
            <CardDescription>ดูและจัดการบันทึกที่บันทึกไว้</CardDescription>
          </CardHeader>
          <CardContent>
            <WorkoutSessionLogger onSaved={() => setLogs(storage.getWorkoutLogs())} />
            <div className="mt-4">
              {logs && logs.length > 0 ? (
                <div className="space-y-2">
                  {logs.slice(0, 5).map((l: any) => (
                    <div key={l.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{l.planName || 'Workout'}</div>
                        <div className="text-xs text-muted-foreground">{new Date(l.date).toLocaleString()} • {l.durationMin || 0} นาที</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-red-600" onClick={() => { handleDeleteLog(l.id); setLogs(storage.getWorkoutLogs()); }} title="ลบ">
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">ยังไม่มีบันทึก</p>
              )}
              <div className="mt-3">
                <Button variant="ghost" onClick={handleQuickLog}>บันทึกเซสชันอย่างรวดเร็ว</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>น้ำหนักล่าสุด</CardTitle>
            <CardDescription>บันทึกน้ำหนักและติดตาม</CardDescription>
          </CardHeader>
            <CardContent>
            <div className="text-xl font-semibold">{currentWeight} kg</div>
            <div className="mt-4">
              <Button variant="outline" onClick={handleRecordTodayWeight}>บันทึกน้ำหนักวันนี้</Button>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">บันทึกล่าสุด</h4>
              {weightEntries && weightEntries.length > 0 ? (
                <div className="space-y-2">
                  {weightEntries.slice(0, 5).map((w) => (
                    <div key={w.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="text-sm">{new Date(w.date).toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{w.weightKg} kg {w.bodyFat ? `• ${w.bodyFat}%` : ''}</div>
                      </div>
                      <div>
                        <button className="text-red-600" onClick={() => {
                          if (!confirm('ลบบันทึกน้ำหนักนี้?')) return;
                          const next = storage.removeWeightEntry(w.id);
                          setWeightEntries(next);
                        }}>×</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground">ยังไม่มีบันทึกน้ำหนัก</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="weight" className="space-y-6">
        <TabsList>
          <TabsTrigger value="weight">น้ำหนักและไขมัน</TabsTrigger>
          <TabsTrigger value="workout">การออกกำลังกาย</TabsTrigger>
          <TabsTrigger value="measurements">ขนาดร่างกาย</TabsTrigger>
          <TabsTrigger value="photos">รูปภาพ</TabsTrigger>
        </TabsList>

        <TabsContent value="weight" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>กราฟน้ำหนักและไขมันในร่างกาย</CardTitle>
              <CardDescription>
                การเปลี่ยนแปลงในช่วง 30 วันที่ผ่านมา
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" domain={[65, 75]} />
                  <YAxis yAxisId="right" orientation="right" domain={[18, 24]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="weight"
                    stroke="hsl(142 76% 36%)"
                    strokeWidth={2}
                    name="น้ำหนัก (kg)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="bodyFat"
                    stroke="hsl(30 80% 55%)"
                    strokeWidth={2}
                    name="ไขมัน (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>สถิติน้ำหนัก</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">น้ำหนักเริ่มต้น</span>
                  <span className="font-semibold">{previousWeight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">น้ำหนักปัจจุบัน</span>
                  <span className="font-semibold">{currentWeight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">เปลี่ยนแปลง</span>
                  <span className="font-semibold text-green-600">
                    {weightChange.toFixed(1)} kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">เป้าหมาย</span>
                  <span className="font-semibold">65 kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">เหลืออีก</span>
                  <span className="font-semibold">{(currentWeight - 65).toFixed(1)} kg</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>บันทึกน้ำหนักใหม่</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full">บันทึกน้ำหนักวันนี้</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>สถิติการออกกำลังกาย</CardTitle>
              <CardDescription>ข้อมูลการออกกำลังกายรายสัปดาห์</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={workoutData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="sessions" stackId="1" stroke="hsl(142 76% 36%)" fill="hsl(142 76% 36%)" name="จำนวนครั้ง" />
                  <Area type="monotone" dataKey="duration" stackId="2" stroke="hsl(160 60% 45%)" fill="hsl(160 60% 45%)" name="เวลา (นาที)" />
                  <Area type="monotone" dataKey="volume" stackId="3" stroke="hsl(220 60% 40%)" fill="hsl(220 60% 40%)" name="Volume (kg×reps)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>ข้อเสนอ Progressive Overload</CardTitle>
              <CardDescription>คำแนะนำเล็กๆ สำหรับท่าที่ทำล่าสุด</CardDescription>
            </CardHeader>
            <CardContent>
              {suggestions.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {suggestions.map((s) => (
                    <li key={s.exercise}><strong>{s.exercise}</strong>: {s.suggestion}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">ยังไม่มีข้อมูลพอสำหรับข้อเสนอ</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="measurements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ขนาดร่างกาย</CardTitle>
              <CardDescription>การวัดส่วนต่างๆ ของร่างกาย (ซม.)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(measurementData.current).map(([key, value]) => {
                  const previous = measurementData.previous[key as keyof typeof measurementData.previous];
                  const change = value - previous;
                  const labels: Record<string, string> = {
                    chest: "รอบอก",
                    waist: "รอบเอว",
                    hips: "รอบสะโพก",
                    arms: "รอบแขน",
                    thighs: "รอบขา",
                  };

                  return (
                    <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{labels[key]}</p>
                        <p className="text-sm text-muted-foreground">
                          ก่อนหน้า: {previous} ซม.
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{value} ซม.</p>
                        <p className={`text-sm ${change < 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {change > 0 ? '+' : ''}{change} ซม.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button className="w-full mt-6">บันทึกขนาดใหม่</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>รูปภาพความคืบหน้า</CardTitle>
              <CardDescription>ถ่ายรูปเพื่อเปรียบเทียบการเปลี่ยนแปลง</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <p className="text-muted-foreground mb-4">
                  ยังไม่มีรูปภาพ
                </p>
                <Button>อัพโหลดรูปภาพ</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
