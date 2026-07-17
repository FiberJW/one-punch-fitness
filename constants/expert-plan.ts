// The owner's real calisthenics + resistance-band program. A second training
// mode alongside the Saitama routine. Copy is verbatim from the owner's plan;
// coaching notes trimmed to one clause each.

// Guidance strings shown in the expert workout header.
export const expertGuidance = {
  frequency: 'train 2–3 times per week',
  effort: 'rest 60–90s between sets · finish each set with 1–2 reps in reserve',
  progression: 'at the top of a rep range, increase band tension or use a harder variation',
} as const;

export type ExpertSectionName = 'UPPER BODY' | 'LOWER BODY' | 'CORE';

export interface ExpertExercise {
  id: string; // stable slug
  name: string; // lowercase display name
  sets: { min: number; max: number }; // e.g. 2–3 sets -> {2,3}; fixed 4 -> {4,4}
  reps: string; // display target, e.g. "50", "10–30", "8–20 per leg"
  muscles: string; // short muscles line
  note?: string; // coaching note
  barDay?: 'add' | 'skip' | 'optionalSkip'; // pull-up-bar-day behavior; undefined = keep
  perLeg?: boolean;
}

export interface ExpertSection {
  name: ExpertSectionName;
  exercises: ExpertExercise[];
}

const sets = (min: number, max: number) => ({ min, max });

export const expertSections: ExpertSection[] = [
  {
    name: 'UPPER BODY',
    exercises: [
      {
        id: 'push-ups',
        name: 'push-ups',
        sets: sets(4, 4),
        reps: '50',
        muscles: 'chest, front delts, triceps',
        note: 'band, elevate feet, deficit, or slow reps once ordinary reps get easy',
      },
      {
        id: 'seated-band-rows',
        name: 'seated band rows',
        sets: sets(3, 3),
        reps: '10–30',
        muscles: 'lats, mid-back',
        barDay: 'skip',
        note: 'on bar days do pull-ups instead',
      },
      {
        id: 'pull-ups',
        name: 'pull-ups or chin-ups',
        sets: sets(3, 4),
        reps: 'hard sets',
        muscles: 'lats, upper back, biceps, grip',
        barDay: 'add',
        note: 'controlled full-range reps',
      },
      {
        id: 'seated-band-face-pulls',
        name: 'seated band face pulls',
        sets: sets(2, 2),
        reps: '15–30',
        muscles: 'rear delts, upper back',
        note: 'band around feet: works like a low-to-high row',
      },
      {
        id: 'band-pull-aparts',
        name: 'band pull-aparts',
        sets: sets(2, 2),
        reps: '15–30',
        muscles: 'rear delts, rhomboids',
        note: 'palms-up grip adds external rotation',
      },
      {
        id: 'band-external-rotations',
        name: 'band external rotations',
        sets: sets(2, 2),
        reps: '12–25',
        muscles: 'rotator cuff',
        note: "light band, controlled — don't take to failure",
      },
      {
        id: 'band-lateral-raises',
        name: 'band lateral raises',
        sets: sets(2, 3),
        reps: '12–30',
        muscles: 'side delts',
      },
      {
        id: 'band-shrugs',
        name: 'band shrugs',
        sets: sets(2, 3),
        reps: '12–30',
        muscles: 'upper traps',
        note: "keep on bar days — pull-ups don't hit upper traps",
      },
      {
        id: 'band-curls',
        name: 'band curls',
        sets: sets(2, 3),
        reps: '10–30',
        muscles: 'biceps',
        barDay: 'optionalSkip',
        note: 'skip on bar days if pull-ups fried your biceps',
      },
    ],
  },
  {
    name: 'LOWER BODY',
    exercises: [
      {
        id: 'squats',
        name: 'band or bodyweight squats',
        sets: sets(3, 3),
        reps: '10–30',
        muscles: 'quads, glutes',
      },
      {
        id: 'lunges',
        name: 'lunges or bulgarian split squats',
        sets: sets(2, 3),
        reps: '8–20 per leg',
        muscles: 'quads, glutes, stability',
        perLeg: true,
      },
      {
        id: 'band-rdls',
        name: 'band romanian deadlifts',
        sets: sets(3, 3),
        reps: '10–30',
        muscles: 'hamstrings, glutes, erectors',
        note: 'slow lowering, neutral spine',
      },
      {
        id: 'single-leg-calf-raises',
        name: 'single-leg calf raises',
        sets: sets(2, 3),
        reps: '12–30 per leg',
        muscles: 'calves',
        perLeg: true,
        note: 'pause at the top, controlled stretch at the bottom',
      },
    ],
  },
  {
    name: 'CORE',
    exercises: [
      {
        id: 'core',
        name: 'planks and/or sit-ups',
        sets: sets(2, 3),
        reps: '30–60s / 10–30',
        muscles: 'trunk',
        note: 'progress to RKC planks when proficient',
      },
    ],
  },
];

export const expertExercises: ExpertExercise[] = expertSections.flatMap((s) => s.exercises);

// True for an 'optionalSkip' row on a bar day — visible but not counted toward
// the session target (pull-ups may have already fried the muscle).
export function isOptionalToday(ex: ExpertExercise, barDay: boolean): boolean {
  return ex.barDay === 'optionalSkip' && barDay;
}

function isVisible(ex: ExpertExercise, barDay: boolean): boolean {
  if (ex.barDay === 'add') return barDay; // pull-ups only appear on bar days
  if (ex.barDay === 'skip') return !barDay; // band rows drop out on bar days
  return true; // undefined + optionalSkip always show
}

// Sections with their exercises filtered for the day; empty sections are kept
// (all current sections always have at least one always-visible row).
export function visibleSections(barDay: boolean): ExpertSection[] {
  return expertSections.map((s) => ({
    name: s.name,
    exercises: s.exercises.filter((ex) => isVisible(ex, barDay)),
  }));
}

export function visibleExercises(barDay: boolean): ExpertExercise[] {
  return expertExercises.filter((ex) => isVisible(ex, barDay));
}

// The completion basis for a single exercise: the bottom of its set range.
export function targetSets(ex: ExpertExercise): number {
  return ex.sets.min;
}

// Sum of targetSets over visible, non-optional exercises.
export function sessionTarget(barDay: boolean): number {
  return visibleExercises(barDay)
    .filter((ex) => !isOptionalToday(ex, barDay))
    .reduce((sum, ex) => sum + targetSets(ex), 0);
}

export interface ExpertSessionShape {
  barDay: boolean;
  setsDone: Record<string, number>;
}

// 0..100 completion. Per-exercise done is capped at its target so extra sets
// never push past 100; optional-on-bar-day rows are excluded entirely.
export function sessionPercent(session: ExpertSessionShape): number {
  const target = sessionTarget(session.barDay);
  if (target === 0) return 0;
  const cappedDone = visibleExercises(session.barDay)
    .filter((ex) => !isOptionalToday(ex, session.barDay))
    .reduce((sum, ex) => sum + Math.min(session.setsDone[ex.id] ?? 0, targetSets(ex)), 0);
  return Math.min(100, (100 * cappedDone) / target);
}
