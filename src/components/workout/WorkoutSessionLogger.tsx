"use client";

import { useState } from "react";
import {
  Dialog as ShadDialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import storage from "@/service/storage";
import type { CompletedExercise } from "@/types/WorkoutLog";
import { useToast } from '@/components/ui/Toast';

interface WorkoutSessionLoggerProps {
  readonly onSaved?: () => void;
}

export function WorkoutSessionLogger({ onSaved }: WorkoutSessionLoggerProps) {
  const [open, setOpen] = useState(false);
  const [planName, setPlanName] = useState("");
  const [duration, setDuration] = useState<number>(30);
  const [calories, setCalories] = useState<number>(200);
  const [exercises, setExercises] = useState<(CompletedExercise & { id: string })[]>([]);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [errors, setErrors] = useState<string | null>(null);
  const { show, Toast } = useToast();

  const addExercise = () => {
    if (!newExerciseName) return;
    setExercises((s) => [...s, { id: String(Date.now()) + Math.random().toString(36).slice(2), name: newExerciseName, sets: [] }]);
    setNewExerciseName("");
  };

  const addSet = (exerciseId: string) => {
    const newSetId = String(Date.now()) + Math.random().toString(36).slice(2);
    const set: any = { id: newSetId, reps: undefined, weightKg: undefined };
    setExercises((prev) => prev.map((ex) => (ex.id === exerciseId ? { ...ex, sets: [...ex.sets, set] } : ex)));
  };

  const updateSetField = (exerciseId: string, setId: string, field: string, value: any) => {
    setExercises((prev) => {
      const out = [] as typeof prev;
      for (const pe of prev) {
        if (pe.id !== exerciseId) {
          out.push(pe);
          continue;
        }
        const newSets: any[] = [];
        for (const ps of pe.sets || []) {
          if (ps.id === setId) newSets.push({ ...ps, [field]: value });
          else newSets.push(ps);
        }
        out.push({ ...pe, sets: newSets });
      }
      return out;
    });
  };

  const validate = () => {
    if ((exercises || []).length === 0) {
      setErrors("โปรดเพิ่มท่าอย่างน้อยหนึ่งท่า");
      return false;
    }
    for (const ex of exercises) {
      for (const s of ex.sets || []) {
        if (s.reps != null && (s.reps < 0 || !Number.isFinite(s.reps))) {
          setErrors("จำนวนครั้งต้องเป็นตัวเลขบวก");
          return false;
        }
        if (s.weightKg != null && (s.weightKg < 0 || !Number.isFinite(s.weightKg))) {
          setErrors("น้ำหนักต้องเป็นตัวเลขบวก");
          return false;
        }
      }
    }
    setErrors(null);
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;
    const log = {
      id: String(Date.now()),
      date: new Date().toISOString(),
      planName: planName || "Manual Session",
      durationMin: duration,
      calories,
      exercises: exercises || [],
    } as any;

    storage.addWorkoutLog(log);
    if (onSaved) onSaved();
    // reset
    setPlanName("");
    setDuration(30);
    setCalories(200);
    setExercises([]);
    setOpen(false);
  // lightweight feedback via toast if available
  if (show) show('บันทึกการออกกำลังกายเรียบร้อย', 'success');
  };

  return (
    <div>
      <ShadDialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>บันทึกเซสชันใหม่</Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="animate-fade-in">
            <DialogTitle className="text-lg font-medium mb-2">บันทึกเซสชัน</DialogTitle>
            <div className="space-y-3">
              <div>
                <label htmlFor="ws-planName" className="text-sm">ชื่อเซสชัน</label>
                <Input id="ws-planName" autoFocus value={planName} onChange={(e: any) => setPlanName(e.target.value)} placeholder="เช่น Upper Body" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="ws-duration" className="text-sm">ระยะเวลา (นาที)</label>
                  <Input id="ws-duration" type="number" value={String(duration)} onChange={(e: any) => setDuration(Number.parseInt(e.target.value) || 0)} />
                </div>
                <div>
                  <label htmlFor="ws-calories" className="text-sm">ประมาณแคลอรี่</label>
                  <Input id="ws-calories" type="number" value={String(calories)} onChange={(e: any) => setCalories(Number.parseInt(e.target.value) || 0)} />
                </div>
              </div>

              <div>
                <label htmlFor="new-exercise" className="text-sm">เพิ่มท่า</label>
                <div className="flex gap-2 mt-1">
                  <Input id="new-exercise" value={newExerciseName} onChange={(e: any) => setNewExerciseName(e.target.value)} placeholder="เช่น Bench Press" />
                  <Button onClick={addExercise}>เพิ่ม</Button>
                </div>
              </div>

              <div className="space-y-2 mt-2 max-h-64 overflow-auto">
                {exercises.map((ex) => (
                  <div key={ex.id} className="p-2 border rounded">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{ex.name}</div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={() => addSet(ex.id)}>เพิ่มเซต</Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 space-y-2">
                      {ex.sets && ex.sets.length > 0 ? ex.sets.map((s: any, i: number) => (
                        <div key={s.id ?? i} className="flex items-center gap-2">
                          <div className="text-sm">เซต {i + 1}:</div>
                          <Input className="w-20" value={s.reps ?? ''} placeholder="reps" onChange={(ev: any) => {
                            const v = ev.target.value ? Number.parseInt(ev.target.value) : undefined;
                            updateSetField(ex.id, s.id, 'reps', v);
                          }} />
                          <Input className="w-24" value={s.weightKg ?? ''} placeholder="kg" onChange={(ev: any) => {
                            const v = ev.target.value ? Number.parseFloat(ev.target.value) : undefined;
                            updateSetField(ex.id, s.id, 'weightKg', v);
                          }} />
                        </div>
                      )) : <div>ยังไม่มีเซต</div>}
                    </div>
                  </div>
                ))}
              </div>

              {errors ? <div className="text-sm text-red-600">{errors}</div> : null}

              <div className="flex justify-end gap-2 pt-2">
                <DialogClose asChild>
                  <Button variant="ghost">ยกเลิก</Button>
                </DialogClose>
                <Button onClick={handleSave}>บันทึก</Button>
              </div>
              {Toast}
            </div>
          </DialogContent>
        </DialogPortal>
      </ShadDialog>
    </div>
  );
}

export default WorkoutSessionLogger;
