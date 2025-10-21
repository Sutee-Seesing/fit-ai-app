"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dumbbell, User, Weight } from "lucide-react";

interface EquipmentSelectorProps {
  onSelect: (equipment: 'bodyweight' | 'dumbbell', dumbbellWeight?: number) => void;
  defaultEquipment?: 'bodyweight' | 'dumbbell';
  defaultWeight?: number;
}

export function EquipmentSelector({
  onSelect,
  defaultEquipment = 'bodyweight',
  defaultWeight = 5,
}: EquipmentSelectorProps) {
  const [equipment, setEquipment] = useState<'bodyweight' | 'dumbbell'>(defaultEquipment);
  const [dumbbellWeight, setDumbbellWeight] = useState(defaultWeight);

  const handleApply = () => {
    onSelect(equipment, equipment === 'dumbbell' ? dumbbellWeight : undefined);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Weight className="h-5 w-5" />
          เลือกอุปกรณ์ออกกำลังกาย
        </CardTitle>
        <CardDescription>
          เลือกว่าคุณจะใช้อุปกรณ์อะไรในการออกกำลังกาย
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={equipment}
          onValueChange={(value) => setEquipment(value as 'bodyweight' | 'dumbbell')}
        >
          <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent">
            <RadioGroupItem value="bodyweight" id="bodyweight" />
            <Label htmlFor="bodyweight" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">มือเปล่า (Bodyweight)</p>
                  <p className="text-sm text-muted-foreground">
                    ไม่ต้องใช้อุปกรณ์ ออกกำลังกายได้ทุกที่
                  </p>
                </div>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent">
            <RadioGroupItem value="dumbbell" id="dumbbell" />
            <Label htmlFor="dumbbell" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-3">
                <Dumbbell className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">ดัมเบล (Dumbbell)</p>
                  <p className="text-sm text-muted-foreground">
                    ใช้ดัมเบลเพิ่มความท้าทายและเผาผลาญแคลอรี่มากขึ้น
                  </p>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {equipment === 'dumbbell' && (
          <div className="space-y-2 animate-in slide-in-from-top">
            <Label htmlFor="weight">น้ำหนักดัมเบล (kg)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="weight"
                type="number"
                min="1"
                max="50"
                step="0.5"
                value={dumbbellWeight}
                onChange={(e) => setDumbbellWeight(parseFloat(e.target.value))}
                className="flex-1"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDumbbellWeight(Math.max(1, dumbbellWeight - 0.5))}
                >
                  -
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDumbbellWeight(Math.min(50, dumbbellWeight + 0.5))}
                >
                  +
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              * น้ำหนักมากขึ้น = เผาผลาญแคลอรี่มากขึ้น
            </p>
          </div>
        )}

        <Button onClick={handleApply} className="w-full">
          ใช้การตั้งค่านี้
        </Button>

        {equipment === 'dumbbell' && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
              💡 การคำนวณแคลอรี่
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              น้ำหนักดัมเบล {dumbbellWeight} kg จะเพิ่มการเผาผลาญแคลอรี่ประมาณ{" "}
              {Math.round((dumbbellWeight / 20) * 100)}% จากแบบมือเปล่า
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
