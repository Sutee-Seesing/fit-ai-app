"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Apple, Camera, Plus, Search } from "lucide-react";

export default function NutritionPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const todayMeals = [
    {
      type: "อาหารเช้า",
      time: "08:00",
      foods: [
        { name: "ข้าวกล้อง", calories: 150, protein: 3, carbs: 32, fats: 1 },
        { name: "ไข่ต้ม", calories: 155, protein: 13, carbs: 1, fats: 11 },
        { name: "กล้วยหอม", calories: 105, protein: 1, carbs: 27, fats: 0.4 },
      ],
    },
    {
      type: "อาหารกลางวัน",
      time: "12:30",
      foods: [
        { name: "ข้าวกล้อง", calories: 200, protein: 4, carbs: 43, fats: 1.5 },
        { name: "ไก่ย่าง", calories: 284, protein: 53, carbs: 0, fats: 7.5 },
        { name: "ผักสด", calories: 50, protein: 2, carbs: 10, fats: 0.5 },
      ],
    },
  ];

  const calculateMealTotal = (foods: typeof todayMeals[0]['foods']) => {
    return foods.reduce(
      (acc, food) => ({
        calories: acc.calories + food.calories,
        protein: acc.protein + food.protein,
        carbs: acc.carbs + food.carbs,
        fats: acc.fats + food.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  const todayTotal = todayMeals.reduce((acc, meal) => {
    const mealTotal = calculateMealTotal(meal.foods);
    return {
      calories: acc.calories + mealTotal.calories,
      protein: acc.protein + mealTotal.protein,
      carbs: acc.carbs + mealTotal.carbs,
      fats: acc.fats + mealTotal.fats,
    };
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const goals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 65,
  };

  return (
  <div className="w-full px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">โภชนาการ</h1>
        <p className="text-muted-foreground">
          ติดตามและวิเคราะห์การบริโภคอาหารของคุณ
        </p>
      </div>

      {/* Daily Summary */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">แคลอรี่</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayTotal.calories} / {goals.calories}
            </div>
            <Progress
              value={(todayTotal.calories / goals.calories) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              เหลืออีก {goals.calories - todayTotal.calories} kcal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">โปรตีน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayTotal.protein.toFixed(1)} / {goals.protein}g
            </div>
            <Progress
              value={(todayTotal.protein / goals.protein) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              เหลืออีก {(goals.protein - todayTotal.protein).toFixed(1)}g
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">คาร์โบไฮเดรต</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayTotal.carbs.toFixed(1)} / {goals.carbs}g
            </div>
            <Progress
              value={(todayTotal.carbs / goals.carbs) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              เหลืออีก {(goals.carbs - todayTotal.carbs).toFixed(1)}g
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">ไขมัน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayTotal.fats.toFixed(1)} / {goals.fats}g
            </div>
            <Progress
              value={(todayTotal.fats / goals.fats) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              เหลืออีก {(goals.fats - todayTotal.fats).toFixed(1)}g
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList>
          <TabsTrigger value="today">วันนี้</TabsTrigger>
          <TabsTrigger value="add">เพิ่มอาหาร</TabsTrigger>
          <TabsTrigger value="scan">สแกนอาหาร</TabsTrigger>
          <TabsTrigger value="history">ประวัติ</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          {todayMeals.map((meal, idx) => {
            const mealTotal = calculateMealTotal(meal.foods);
            return (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{meal.type}</CardTitle>
                      <CardDescription>{meal.time}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {mealTotal.calories} kcal
                      </p>
                      <p className="text-xs text-muted-foreground">
                        P: {mealTotal.protein.toFixed(0)}g | C:{" "}
                        {mealTotal.carbs.toFixed(0)}g | F:{" "}
                        {mealTotal.fats.toFixed(0)}g
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {meal.foods.map((food, foodIdx) => (
                      <div
                        key={foodIdx}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{food.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {food.calories} kcal • P: {food.protein}g • C:{" "}
                            {food.carbs}g • F: {food.fats}g
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          แก้ไข
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 gap-2">
                    <Plus className="h-4 w-4" />
                    เพิ่มอาหาร
                  </Button>
                </CardContent>
              </Card>
            );
          })}

          <Card>
            <CardHeader>
              <CardTitle>เพิ่มมื้ออาหารใหม่</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                สร้างมื้อใหม่
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ค้นหาและเพิ่มอาหาร</CardTitle>
              <CardDescription>
                ค้นหาอาหารจากฐานข้อมูลหรือเพิ่มของคุณเอง
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาอาหาร..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button>ค้นหา</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                ลองค้นหา: ข้าว, ไก่, ไข่, ผลไม้
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>สแกนอาหารด้วย AI</CardTitle>
              <CardDescription>
                ถ่ายรูปอาหารเพื่อให้ AI วิเคราะห์สารอาหาร
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  ถ่ายรูปหรืออัพโหลดรูปอาหาร
                </p>
                <Button className="gap-2">
                  <Camera className="h-4 w-4" />
                  เปิดกล้อง
                </Button>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                AI จะวิเคราะห์อาหารและคำนวณสารอาหารโดยประมาณ
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ประวัติการบริโภคอาหาร</CardTitle>
              <CardDescription>ดูข้อมูลย้อนหลัง</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">กำลังพัฒนาฟีเจอร์นี้...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
