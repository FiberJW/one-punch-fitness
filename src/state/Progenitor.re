open BsReactNative;

type workout = {level: int};

type state = {currentWorkout: workout};

module Encode = {
  let workout = (w) => Json.Encode.(object_([("level", Js.Json.number(float_of_int(w.level)))]));
  let state = (s) => Json.Encode.(object_([("currentWorkout", workout(s.currentWorkout))]));
};

module Decode = {
  let workout = (json) => Json.Decode.{level: json |> field("level", int)};
  let state = (json) => Json.Decode.{currentWorkout: json |> field("currentWorkout", workout)};
};

type action =
  | Rehydrate(state)
  | IncrementLevel
  | DecrementLevel;

let reducer = (state: state, action: action) =>
  switch action {
  | Rehydrate(state) => state
  | IncrementLevel => {currentWorkout: {level: state.currentWorkout.level + 1}}
  | DecrementLevel => {currentWorkout: {level: state.currentWorkout.level - 1}}
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
    ~preloadedState={currentWorkout: {level: 0}},
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