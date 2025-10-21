// Lightweight localStorage wrapper for AI plans and workout logs
import type { WorkoutLog } from "../types/WorkoutLog";

const AI_PLANS_KEY = "fitai:aiPlans";
const WORKOUT_LOGS_KEY = "fitai:workoutLogs";
const WEIGHT_KEY = "fitai:weights";

function safeGetItem(key: string) {
  if (typeof globalThis === "undefined" || !globalThis.window) return null;
  try {
    return globalThis.window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string) {
  if (typeof globalThis === "undefined" || !globalThis.window) return;
  try {
    globalThis.window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function getAiPlans(): any[] {
  const raw = safeGetItem(AI_PLANS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveAiPlans(plans: any[]) {
  try {
    safeSetItem(AI_PLANS_KEY, JSON.stringify(plans || []));
  } catch {}
}

export function addAiPlan(plan: any) {
  const list = getAiPlans();
  const next = [plan, ...list];
  saveAiPlans(next);
  return next;
}

export function removeAiPlan(id: number | string) {
  const list = getAiPlans();
  const next = list.filter((p: any) => p.id !== id);
  saveAiPlans(next);
  return next;
}

export function getWorkoutLogs(): WorkoutLog[] {
  const raw = safeGetItem(WORKOUT_LOGS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as WorkoutLog[];
  } catch {
    return [];
  }
}

export function saveWorkoutLogs(logs: WorkoutLog[]) {
  try {
    safeSetItem(WORKOUT_LOGS_KEY, JSON.stringify(logs || []));
  } catch {}
}

export function addWorkoutLog(log: WorkoutLog) {
  const logs = getWorkoutLogs();
  const next = [log, ...logs];
  saveWorkoutLogs(next);
  return next;
}

export function removeWorkoutLog(id: string) {
  const logs = getWorkoutLogs();
  const next = logs.filter(l => l.id !== id);
  saveWorkoutLogs(next);
  return next;
}

export function getWeightEntries() {
  const raw = safeGetItem(WEIGHT_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveWeightEntries(entries: any[]) {
  try {
    safeSetItem(WEIGHT_KEY, JSON.stringify(entries || []));
  } catch {}
}

export function addWeightEntry(entry: any) {
  const list = getWeightEntries();
  const next = [entry, ...list];
  saveWeightEntries(next);
  return next;
}

export function removeWeightEntry(id: string) {
  const list = getWeightEntries();
  const next = list.filter((e: any) => e.id !== id);
  saveWeightEntries(next);
  return next;
}

export default {
  getAiPlans,
  saveAiPlans,
  addAiPlan,
  removeAiPlan,
  getWorkoutLogs,
  saveWorkoutLogs,
  addWorkoutLog,
  removeWorkoutLog,
  getWeightEntries,
  saveWeightEntries,
  addWeightEntry,
  removeWeightEntry,
};
