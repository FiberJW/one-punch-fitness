module State = {
  type routine = {
    .
    pushUps: {. sets: int, reps: int},
    sitUps: {. sets: int, reps: int},
    squats: {. sets: int, reps: int},
    run: {. distance: int, unit: string},
    rest: {. amount: int, unit: string},
    transition: {. amount: int, unit: string}
  };
  type workout = {
    .
    date: string,
    level: int,
    started: Js.boolean,
    completed: Js.boolean,
    currentRoutineFacet: string,
    setsCompleted: {. pushUps: int, sitUps: int, squats: int, run: Js.boolean},
    timeUsedPerSet: {
      .
      pushUps: Js.Array.t(float), sitUps: Js.Array.t(float), squats: Js.Array.t(float), run: float
    }
  };
  type settings = {. notification: {. enabled: Js.boolean, time: string}};
  type infoNugget = {
    .
    title: string, description: string, coverImageRes: int, archived: Js.boolean
  };
  type tree = {
    .
    workoutHistory: Js.Array.t(workout),
    currentWorkout: workout,
    nugs: Js.Array.t(infoNugget),
    settings: settings
  };
};