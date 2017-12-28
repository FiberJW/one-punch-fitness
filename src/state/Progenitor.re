open BsReactNative;

let dateString = (date) =>
  string_of_int(int_of_float(Js.Date.getFullYear(date)))
  ++ "-"
  ++ string_of_int(int_of_float(Js.Date.getMonth(date)) + 1)
  ++ "-"
  ++ string_of_int(int_of_float(Js.Date.getDate(date)));

type exercise =
  | PushUps
  | SitUps
  | Squats
  | Running;

type setsCompleted = {
  pushUps: int,
  sitUps: int,
  squats: int,
  run: bool
};

type timeUsedPerSet = {
  pushUps: Js.Array.t(float),
  sitUps: Js.Array.t(float),
  squats: Js.Array.t(float),
  run: float
};

type workout = {
  level: int,
  date: string,
  started: bool,
  completed: bool,
  setsCompleted,
  timeUsedPerSet
};

type state = {
  currentWorkout: workout,
  history: Js.Array.t(workout)
};

type action =
  | Rehydrate(state)
  | IncrementLevel
  | DecrementLevel
  | StartWorkout
  | CompleteWorkout
  | CompleteSet(exercise, float);

module Encode = {
  let timeUsedPerSet = (tps: timeUsedPerSet) =>
    Json.Encode.(
      object_([
        ("pushUps", Js.Json.numberArray(tps.pushUps)),
        ("sitUps", Js.Json.numberArray(tps.sitUps)),
        ("squats", Js.Json.numberArray(tps.squats)),
        ("run", Js.Json.number(tps.run))
      ])
    );
  let setsCompleted = (sc: setsCompleted) =>
    Json.Encode.(
      object_([
        ("pushUps", Js.Json.number(float_of_int(sc.pushUps))),
        ("sitUps", Js.Json.number(float_of_int(sc.sitUps))),
        ("squats", Js.Json.number(float_of_int(sc.squats))),
        ("run", Js.Json.boolean(Js.Boolean.to_js_boolean(sc.run)))
      ])
    );
  let workout = (w: workout) =>
    Json.Encode.(
      object_([
        ("level", Js.Json.number(float_of_int(w.level))),
        ("date", Js.Json.string(w.date)),
        ("started", Js.Json.boolean(Js.Boolean.to_js_boolean(w.started))),
        ("completed", Js.Json.boolean(Js.Boolean.to_js_boolean(w.completed))),
        ("setsCompleted", setsCompleted(w.setsCompleted)),
        ("timeUsedPerSet", timeUsedPerSet(w.timeUsedPerSet))
      ])
    );
  let history = Json.Encode.arrayOf(workout);
  let state = (s) =>
    Json.Encode.(
      object_([("currentWorkout", workout(s.currentWorkout)), ("history", history(s.history))])
    );
};

module Decode = {
  let timeUsedPerSet = (json) : timeUsedPerSet =>
    Json.Decode.{
      pushUps: json |> field("pushUps", Json.Decode.array(Json.Decode.float)),
      sitUps: json |> field("sitUps", Json.Decode.array(Json.Decode.float)),
      squats: json |> field("squats", Json.Decode.array(Json.Decode.float)),
      run: json |> field("run", Json.Decode.float)
    };
  let setsCompleted = (json) : setsCompleted =>
    Json.Decode.{
      pushUps: json |> field("pushUps", int),
      sitUps: json |> field("sitUps", int),
      squats: json |> field("squats", int),
      run: json |> field("run", bool)
    };
  let workout = (json) : workout =>
    Json.Decode.{
      level: json |> field("level", int),
      date: json |> field("date", string),
      started: json |> field("started", bool),
      completed: json |> field("completed", bool),
      setsCompleted: json |> field("setsCompleted", setsCompleted),
      timeUsedPerSet: json |> field("timeUsedPerSet", timeUsedPerSet)
    };
  let history = Json.Decode.array(workout);
  let state = (json) =>
    Json.Decode.{
      currentWorkout: json |> field("currentWorkout", workout),
      history: json |> field("history", history)
    };
};

let persist = (store, next, action) => {
  let returnValue = next(action);
  let stateAsJson = Encode.state(Reductive.Store.getState(store)) |> Js.Json.stringify;
  AsyncStorage.setItem(
    "@state",
    stateAsJson,
    ~callback=
      (e) =>
        switch e {
        | None => ()
        | Some(err) => Js.log(err)
        },
    ()
  )
  |> ignore;
  returnValue
};

let hydrate = (dispatch) =>
  Js.Promise.(
    AsyncStorage.getItem("@state", ())
    |> then_(
         (json) =>
           (
             switch json {
             | None => ()
             | Some(s) =>
               let state = Js.Json.parseExn(s) |> Decode.state;
               dispatch(Rehydrate(state))
             }
           )
           |> resolve
       )
    |> ignore
  );

let genNewWorkout = (level) => {
  level,
  date: dateString(Js.Date.make()),
  started: false,
  completed: false,
  setsCompleted: {pushUps: 0, sitUps: 0, squats: 0, run: false},
  timeUsedPerSet: {pushUps: [||], sitUps: [||], squats: [||], run: 0.}
};

let reducer = (state: state, action: action) =>
  switch action {
  | Rehydrate(state) =>
    if (state.currentWorkout.date !== dateString(Js.Date.make())) {
      {
        history: Array.append(state.history, [|state.currentWorkout|]),
        currentWorkout: genNewWorkout(state.currentWorkout.level)
      }
    } else {
      state
    }
  | IncrementLevel => {
      ...state,
      currentWorkout: {...state.currentWorkout, level: state.currentWorkout.level + 1}
    }
  | DecrementLevel => {
      ...state,
      currentWorkout: {...state.currentWorkout, level: state.currentWorkout.level - 1}
    }
  | StartWorkout => {...state, currentWorkout: {...state.currentWorkout, started: true}}
  | CompleteWorkout => {...state, currentWorkout: {...state.currentWorkout, completed: true}}
  | CompleteSet(e, t) =>
    switch e {
    | PushUps => {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          setsCompleted: {
            ...state.currentWorkout.setsCompleted,
            pushUps: state.currentWorkout.setsCompleted.pushUps + 1
          },
          timeUsedPerSet: {
            ...state.currentWorkout.timeUsedPerSet,
            pushUps: Js.Array.append(t, state.currentWorkout.timeUsedPerSet.pushUps)
          }
        }
      }
    | SitUps => {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          setsCompleted: {
            ...state.currentWorkout.setsCompleted,
            sitUps: state.currentWorkout.setsCompleted.sitUps + 1
          },
          timeUsedPerSet: {
            ...state.currentWorkout.timeUsedPerSet,
            sitUps: Js.Array.append(t, state.currentWorkout.timeUsedPerSet.sitUps)
          }
        }
      }
    | Squats => {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          setsCompleted: {
            ...state.currentWorkout.setsCompleted,
            squats: state.currentWorkout.setsCompleted.squats + 1
          },
          timeUsedPerSet: {
            ...state.currentWorkout.timeUsedPerSet,
            squats: Js.Array.append(t, state.currentWorkout.timeUsedPerSet.squats)
          }
        }
      }
    | Running => {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          setsCompleted: {...state.currentWorkout.setsCompleted, run: true},
          timeUsedPerSet: {...state.currentWorkout.timeUsedPerSet, run: t}
        }
      }
    }
  };

let store =
  Reductive.Store.create(
    ~reducer,
    ~preloadedState={currentWorkout: genNewWorkout(0), history: [||]},
    ~enhancer=persist,
    ()
  );

hydrate(Reductive.Store.dispatch(store));