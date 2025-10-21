import type { WorkoutLog } from "../types/WorkoutLog";

// Progressive overload heuristic (improved):
// - For each exercise, gather the most recent N sessions that include the exercise.
// - Require a monotonic improvement across the chosen metric for the last N sessions
//   (N = 3 by default). Metrics: total session volume (sum reps*weight) or max
//   working weight if available. Only when a clear upward trend exists do we
//   suggest a small increase (2-5%). This reduces noisy / premature suggestions.
export function suggestProgressiveOverload(logs: WorkoutLog[], minSessions = 3) {
  const byExercise: Record<string, WorkoutLog[]> = {};
  for (const l of logs || []) {
    for (const ex of l.exercises || []) {
      const name = ex.name;
      byExercise[name] = byExercise[name] || [];
      byExercise[name].push(l);
    }
  }

  // (no-op) -- keep function small and deterministic

  const suggestions: Array<{ exercise: string; suggestion: string }> = [];

  for (const [exercise, sessions] of Object.entries(byExercise)) {
    // sort sessions newest -> oldest without mutating original
    const sorted = sessions.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (sorted.length < minSessions) continue; // need enough data points

  // take the most recent minSessions sessions and order them oldest->newest
  const recent = sorted.slice(0, minSessions).slice().reverse();

    // For each session, find the exercise instance and compute metrics
    const metrics = recent.map((s) => {
      const ex = s.exercises.find((e) => e.name === exercise);
      if (!ex) return { volume: 0, maxWeight: 0 };
      const volume = (ex.sets || []).reduce((acc, set) => {
        const reps = set.reps || 0;
        const w = set.weightKg || 0;
        return acc + reps * w;
      }, 0);
      const maxWeight = (ex.sets || []).reduce((a, b) => Math.max(a, b.weightKg || 0), 0);
      return { volume, maxWeight };
    });

    // Compute arrays of the chosen metrics
    const volumes = metrics.map((m) => m.volume);
    const maxWeights = metrics.map((m) => m.maxWeight);

    // Helper: requires every value to be strictly greater than previous
    const hasUpwardTrend = (arr: number[]) => {
      if (arr.length < 2) return false;
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] <= arr[i - 1]) return false;
      }
      return true;
    };

    // Prefer volume trend first, fallback to maxWeight trend
    if (volumes.every((v) => v >= 0) && hasUpwardTrend(volumes)) {
      const lastVolume = volumes.at(-1) ?? 0;
      // compute percent change over window
      const rawPercent = Math.round(((lastVolume - volumes[0]) / (volumes[0] || 1)) * 100);
      // cap suggestion magnitude
      const percentCap = 5; // maximum suggested percent
      const suggestPercent = Math.min(percentCap, Math.max(1, Math.round(rawPercent * 0.03)));
      suggestions.push({
        exercise,
        suggestion: `ปริมาณงานของ '${exercise}' มีแนวโน้มเพิ่มขึ้น ${rawPercent}% — แนะนำเพิ่มประมาณ ${suggestPercent}% หรือเพิ่ม 1–2 ครั้ง/เซต เพื่อความปลอดภัย`,
      });
    } else if (maxWeights.every((w) => w >= 0) && hasUpwardTrend(maxWeights)) {
      const lastMax = maxWeights.at(-1) ?? 0;
      const rawAddKg = Math.max(1, Math.round(lastMax * 0.025));
      const kgCap = 5; // never suggest > 5kg at once
      const addKg = Math.min(kgCap, rawAddKg);
      suggestions.push({
        exercise,
        suggestion: `น้ำหนักสูงสุดมีแนวโน้มเพิ่ม — พิจารณาเพิ่มประมาณ ${addKg} kg (≈ +2.5%) หรือเพิ่มทีละน้อยจนคงที่`,
      });
    }

    // no clear trend -> skip suggestion to avoid noisy coaching
  }

  return suggestions.slice(0, 6);
}

export default { suggestProgressiveOverload };
