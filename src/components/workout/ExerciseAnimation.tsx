"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExerciseAnimationProps {
  exerciseName: string;
  gifUrl?: string;
  imageUrl?: string;
  autoPlay?: boolean;
}

export function ExerciseAnimation({
  exerciseName,
  gifUrl,
  imageUrl,
  autoPlay = true,
}: ExerciseAnimationProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // ถ้าไม่มี GIF ใช้ภาพนิ่งแทน
  const displayUrl = gifUrl || imageUrl || `/exercises/${exerciseName.toLowerCase().replace(/\s+/g, '-')}.gif`;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative">
        <div className="relative aspect-video bg-muted">
          {gifUrl || imageUrl ? (
            <Image
              src={displayUrl}
              alt={exerciseName}
              fill
              className="object-cover"
              unoptimized={!!gifUrl} // GIF ต้องใช้ unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-muted-foreground">ไม่มีภาพเคลื่อนไหว</p>
            </div>
          )}
        </div>
        
        {gifUrl && (
          <div className="absolute bottom-2 right-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
