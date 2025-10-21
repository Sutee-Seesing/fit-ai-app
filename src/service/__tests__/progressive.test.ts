import { describe, it, expect } from 'vitest';
import { suggestProgressiveOverload } from '../progressive';

// small helper to build a WorkoutLog-like object
const makeLog = (date: string, exerciseName: string, sets: Array<{ reps?: number; weightKg?: number }>) => ({
  id: String(Math.random()),
  date,
  planName: 't',
  durationMin: 30,
  calories: 200,
  exercises: [{ name: exerciseName, sets }],
});

describe('suggestProgressiveOverload', () => {
  it('returns suggestion only when there is a 3-session increasing volume trend', () => {
    const logs = [
      makeLog('2024-01-01', 'Squat', [{ reps: 5, weightKg: 80 }]),
      makeLog('2024-01-08', 'Squat', [{ reps: 5, weightKg: 85 }]),
      makeLog('2024-01-15', 'Squat', [{ reps: 5, weightKg: 90 }]),
    ];

  const suggestions = suggestProgressiveOverload(logs, 3);
  // debug when failing
  if (!suggestions || suggestions.length === 0) console.log('DEBUG suggestions', suggestions);
  expect(suggestions.length).toBeGreaterThan(0);
  expect(suggestions[0].exercise).toBe('Squat');
  });

  it('does not suggest when only 2 sessions present', () => {
    const logs = [
      makeLog('2024-01-01', 'Bench', [{ reps: 5, weightKg: 60 }]),
      makeLog('2024-01-08', 'Bench', [{ reps: 5, weightKg: 62 }]),
    ];
    const suggestions = suggestProgressiveOverload(logs, 3);
    expect(suggestions.find(s => s.exercise === 'Bench')).toBeUndefined();
  });

  it('does not suggest when trend is not strictly increasing', () => {
    const logs = [
      makeLog('2024-01-01', 'Press', [{ reps: 5, weightKg: 40 }]),
      makeLog('2024-01-08', 'Press', [{ reps: 5, weightKg: 42 }]),
      makeLog('2024-01-15', 'Press', [{ reps: 5, weightKg: 41 }]),
    ];
    const suggestions = suggestProgressiveOverload(logs, 3);
    expect(suggestions.find(s => s.exercise === 'Press')).toBeUndefined();
  });
});
