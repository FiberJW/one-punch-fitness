// Ported verbatim from the legacy src/config/Routines.re.
// Index = workout level (0..4). push-ups/sit-ups/squats share sets/reps per
// level; the run is always 10km.
export interface RepWorkout {
  sets: number;
  reps: number;
}

export interface DistanceWorkout {
  distance: number;
  units: string;
}

export interface Variation {
  pushUps: RepWorkout;
  sitUps: RepWorkout;
  squats: RepWorkout;
  run: DistanceWorkout;
}

const rep = (sets: number, reps: number): RepWorkout => ({ sets, reps });
const run: DistanceWorkout = { distance: 10, units: 'km' };

export const routines: Variation[] = [
  { pushUps: rep(10, 10), sitUps: rep(10, 10), squats: rep(10, 10), run },
  { pushUps: rep(5, 20), sitUps: rep(5, 20), squats: rep(5, 20), run },
  { pushUps: rep(4, 25), sitUps: rep(4, 25), squats: rep(4, 25), run },
  { pushUps: rep(2, 50), sitUps: rep(2, 50), squats: rep(2, 50), run },
  { pushUps: rep(1, 100), sitUps: rep(1, 100), squats: rep(1, 100), run },
];
