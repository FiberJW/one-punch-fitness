type repBasedWorkout = {
  sets: int,
  reps: int
};

type distanceBasedWorkout = {
  distance: int,
  units: string
};

type workoutRecovery = {
  amount: int,
  units: string
};

type variation = {
  pushUps: repBasedWorkout,
  sitUps: repBasedWorkout,
  squats: repBasedWorkout,
  run: distanceBasedWorkout,
  rest: workoutRecovery,
  transition: workoutRecovery
};

let variations = [|
  {
    pushUps: {sets: 10, reps: 10},
    sitUps: {sets: 10, reps: 10},
    squats: {sets: 10, reps: 10},
    run: {distance: 10, units: "km"},
    rest: {amount: 30, units: "sec"},
    transition: {amount: 60, units: "sec"}
  },
  {
    pushUps: {sets: 5, reps: 20},
    sitUps: {sets: 5, reps: 20},
    squats: {sets: 5, reps: 20},
    run: {distance: 10, units: "km"},
    rest: {amount: 30, units: "sec"},
    transition: {amount: 60, units: "sec"}
  },
  {
    pushUps: {sets: 4, reps: 25},
    sitUps: {sets: 4, reps: 25},
    squats: {sets: 4, reps: 25},
    run: {distance: 10, units: "km"},
    rest: {amount: 30, units: "sec"},
    transition: {amount: 60, units: "sec"}
  },
  {
    pushUps: {sets: 2, reps: 50},
    sitUps: {sets: 2, reps: 50},
    squats: {sets: 2, reps: 50},
    run: {distance: 10, units: "km"},
    rest: {amount: 60, units: "sec"},
    transition: {amount: 120, units: "sec"}
  },
  {
    pushUps: {sets: 1, reps: 100},
    sitUps: {sets: 1, reps: 100},
    squats: {sets: 1, reps: 100},
    run: {distance: 10, units: "km"},
    rest: {amount: 120, units: "sec"},
    transition: {amount: 180, units: "sec"}
  }
|];