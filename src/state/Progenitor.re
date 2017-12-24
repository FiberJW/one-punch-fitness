open BsReactNative;

AsyncStorage.clear();

type workout = {
  level: int,
  date: string,
  started: bool,
  completed: bool
};

type state = {currentWorkout: workout};

type action =
  | Rehydrate(state)
  | IncrementLevel
  | DecrementLevel
  | StartWorkout;

module Encode = {
  let workout = (w) =>
    Json.Encode.(
      object_([
        ("level", Js.Json.number(float_of_int(w.level))),
        ("date", Js.Json.string(w.date)),
        ("started", Js.Json.boolean(Js.Boolean.to_js_boolean(w.started))),
        ("completed", Js.Json.boolean(Js.Boolean.to_js_boolean(w.completed)))
      ])
    );
  let state = (s) => Json.Encode.(object_([("currentWorkout", workout(s.currentWorkout))]));
};

module Decode = {
  let workout = (json) =>
    Json.Decode.{
      level: json |> field("level", int),
      date: json |> field("date", string),
      started: json |> field("started", bool),
      completed: json |> field("completed", bool)
    };
  let state = (json) => Json.Decode.{currentWorkout: json |> field("currentWorkout", workout)};
};

let reducer = (state: state, action: action) =>
  switch action {
  | Rehydrate(state) => state
  | IncrementLevel => {
      currentWorkout: {...state.currentWorkout, level: state.currentWorkout.level + 1}
    }
  | DecrementLevel => {
      currentWorkout: {...state.currentWorkout, level: state.currentWorkout.level - 1}
    }
  | StartWorkout => {currentWorkout: {...state.currentWorkout, started: true}}
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

let store =
  Reductive.Store.create(
    ~reducer,
    ~preloadedState={
      currentWorkout: {
        level: 0,
        date: Js.Date.toUTCString(Js.Date.make()),
        started: false,
        completed: false
      }
    },
    ~enhancer=persist,
    ()
  );

let dispatch = Reductive.Store.dispatch(store);

let hydrate = () =>
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

hydrate();
/* TODO:
   when ready, when rehydrating if hydrated currentworkout doesn't exist on the currentday,
    do the calculations to push it into the history and create a new currentWorkout
    */