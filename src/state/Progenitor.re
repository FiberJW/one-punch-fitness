type workout = {
  date: string,
  level: int
};

type appState = {
  initialized: bool,
  currentWorkout: workout
};

type action =
  | Initialize;

let reducer = (state: appState, action: action) =>
  switch action {
  | Initialize => {...state, initialized: true}
  };

let store =
  Reductive.Store.create(
    ~reducer,
    ~preloadedState={initialized: false, currentWorkout: {date: "", level: 0}},
    ()
  );