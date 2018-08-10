open BsReactNative;

open NPMBindings;

[@bs.val] external setInterval : (unit => unit, int) => int = "setInterval";

[@bs.val] external clearInterval : int => unit = "clearInterval";

[@bs.module "Assets"] external illustrations : Js.t({..}) = "Illustrations";

module Styled = {
  module Background = {
    [@bs.module "./components/styled/Background"]
    external background : ReasonReact.reactClass = "default";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=background,
        ~props=Js.Obj.empty(),
        children,
      );
  };
  module Container = {
    [@bs.module "./components/styled/Container"]
    external container : ReasonReact.reactClass = "default";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=container,
        ~props=Js.Obj.empty(),
        children,
      );
  };
  module Progress = {
    [@bs.module "./components/styled/Progress"]
    external progress : ReasonReact.reactClass = "default";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=progress,
        ~props=Js.Obj.empty(),
        children,
      );
  };
  module SetType = {
    [@bs.module "./components/styled/SetType"]
    external setType : ReasonReact.reactClass = "default";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=setType,
        ~props=Js.Obj.empty(),
        children,
      );
  };
  module SetReps = {
    [@bs.module "./components/styled/SetReps"]
    external setReps : ReasonReact.reactClass = "default";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=setReps,
        ~props=Js.Obj.empty(),
        children,
      );
  };
  module SessionControlGroup = {
    [@bs.module "./components/SessionControl/styled/Group"]
    external sessionControlGroup : ReasonReact.reactClass = "default";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=sessionControlGroup,
        ~props=Js.Obj.empty(),
        children,
      );
  };
  module Image = {
    [@bs.module "./components/styled/Image"]
    external image : ReasonReact.reactClass = "default";
    let make = (~source, ~resizeMode, children) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=image,
        ~props={"source": source, "resizeMode": resizeMode},
        children,
      );
  };
};

type timerStatusType = [ | `active | `paused | `stopped];

type widgets =
  | Image
  | Progress
  | SetInfo
  | SessionControls
  | Timer;

let transitionLayout = [|Image, Progress, SetInfo|];

let sessionLayout = [|SetInfo, Timer, Progress, SessionControls|];

type timerState = {
  timeUsed: int,
  handle: option(int),
  status: timerStatusType,
};

type state = {
  timer: timerState,
  inSession: bool,
  currentExercise: Progenitor.exercise,
};

type action =
  | Tick
  | ToggleSession
  | StartTimer(option(int))
  | StopTimer(option(int))
  | PauseTimer
  | ResumeTimer;

let startTimer = self =>
  setInterval(() => self.ReasonReact.send(Tick), 1000);

let currentExercise = (s: Progenitor.state) =>
  /* returns exercise and if the whole routine is complete */
  if (s.currentWorkout.setsCompleted.pushUps
      < Routines.variations[s.currentWorkout.level].pushUps.sets) {
    Progenitor.PushUps;
  } else if (s.currentWorkout.setsCompleted.sitUps
             < Routines.variations[s.currentWorkout.level].sitUps.sets) {
    Progenitor.SitUps;
  } else if (s.currentWorkout.setsCompleted.squats
             < Routines.variations[s.currentWorkout.level].squats.sets) {
    Progenitor.Squats;
  } else {
    Progenitor.Running;
  };

let baseComponent = ReasonReact.reducerComponent("WorkoutScreenBase");

let baseMake =
    (
      ~navigation,
      ~state as reductiveState: Progenitor.state,
      ~dispatch,
      _children,
    ) => {
  ...baseComponent,
  initialState: () => {
    timer: {
      status: `active,
      timeUsed: 0,
      handle: None,
    },
    inSession: false,
    currentExercise: currentExercise(reductiveState),
  },
  reducer: (action, state) =>
    switch (action) {
    | Tick =>
      if (state.timer.status !== `paused) {
        ReasonReact.Update({
          ...state,
          timer: {
            ...state.timer,
            timeUsed: state.timer.timeUsed + 1,
          },
        });
      } else {
        ReasonReact.NoUpdate;
      }
    | ToggleSession =>
      ReasonReact.Update({...state, inSession: ! state.inSession})
    | StartTimer(handle) =>
      ReasonReact.Update({
        ...state,
        timer: {
          handle,
          timeUsed: 0,
          status: `active,
        },
      })
    | StopTimer(handle) =>
      ReasonReact.Update({
        ...state,
        timer: {
          ...state.timer,
          handle,
          status: `stopped,
        },
      })
    | PauseTimer =>
      ReasonReact.Update({
        ...state,
        timer: {
          ...state.timer,
          status: `paused,
        },
      })
    | ResumeTimer =>
      ReasonReact.Update({
        ...state,
        timer: {
          ...state.timer,
          status: `active,
        },
      })
    },
  willUnmount: self =>
    switch (self.state.timer.handle) {
    | Some(h) => clearInterval(h)
    | None => ()
    },
  willReceiveProps: self => {
    ...self.state,
    currentExercise: currentExercise(reductiveState),
  },
  render: self => {
    let layout = self.state.inSession ? sessionLayout : transitionLayout;
    <Styled.Background>
      <ScrollView
        contentContainerStyle=Style.(style([flexGrow(1.)]))
        alwaysBounceVertical=false
        showsVerticalScrollIndicator=false>
        <Styled.Container>
          <Expo.KeepAwake />
          (
            ReasonReact.array(
              Array.mapi(
                (i, it) =>
                  switch (it) {
                  | Image =>
                    <Styled.Image
                      key=(string_of_int(i))
                      resizeMode="cover"
                      source=(
                        switch (self.state.currentExercise) {
                        | PushUps => illustrations##pushups
                        | SitUps => illustrations##situps
                        | Squats => illustrations##squats
                        | Running => illustrations##run
                        }
                      )
                    />
                  | Timer =>
                    <Timer
                      key=(string_of_int(i))
                      time=self.state.timer.timeUsed
                    />
                  | Progress =>
                    self.state.currentExercise === Running ?
                      ReasonReact.null :
                      <Styled.Progress key=(string_of_int(i))>
                        (
                          ReasonReact.string(
                            "set "
                            ++ string_of_int(
                                 switch (self.state.currentExercise) {
                                 | PushUps =>
                                   reductiveState.currentWorkout.setsCompleted.
                                     pushUps
                                   + 1
                                 | SitUps =>
                                   reductiveState.currentWorkout.setsCompleted.
                                     sitUps
                                   + 1
                                 | Squats =>
                                   reductiveState.currentWorkout.setsCompleted.
                                     squats
                                   + 1
                                 | _ => 1
                                 },
                               )
                            ++ " of "
                            ++ string_of_int(
                                 switch (self.state.currentExercise) {
                                 | PushUps =>
                                   Routines.variations[reductiveState.
                                                         currentWorkout.
                                                         level].
                                     pushUps.
                                     sets
                                 | SitUps =>
                                   Routines.variations[reductiveState.
                                                         currentWorkout.
                                                         level].
                                     sitUps.
                                     sets
                                 | Squats =>
                                   Routines.variations[reductiveState.
                                                         currentWorkout.
                                                         level].
                                     squats.
                                     sets
                                 | _ => 1
                                 },
                               )
                            ++ "",
                          )
                        )
                      </Styled.Progress>
                  | SetInfo =>
                    <Styled.SetType key=(string_of_int(i))>
                      <Styled.SetReps>
                        (
                          ReasonReact.string(
                            self.state.currentExercise === Running ?
                              string_of_int(
                                Routines.variations[reductiveState.
                                                      currentWorkout.
                                                      level].
                                  run.
                                  distance,
                              )
                              ++ Routines.variations[reductiveState.
                                                       currentWorkout.
                                                       level].
                                   run.
                                   units :
                              string_of_int(
                                Routines.variations[reductiveState.
                                                      currentWorkout.
                                                      level].
                                  sitUps.
                                  reps,
                              ),
                          )
                        )
                      </Styled.SetReps>
                      (
                        ReasonReact.string(
                          " "
                          ++ (
                            switch (self.state.currentExercise) {
                            | PushUps => "push-ups"
                            | SitUps => "sit-ups"
                            | Squats => "squats"
                            | Running => "run"
                            }
                          ),
                        )
                      )
                    </Styled.SetType>
                  | SessionControls =>
                    <Styled.SessionControlGroup key=(string_of_int(i))>
                      <SessionControl
                        color=Colors.blueLeftUsTooSoon
                        onPress=(
                          switch (self.state.timer.status) {
                          | `paused => (() => self.send(ResumeTimer))
                          | `stopped => (
                              () =>
                                self.send(
                                  StartTimer(Some(startTimer(self))),
                                )
                            )
                          | `active => (() => self.send(PauseTimer))
                          }
                        )
                        label=(
                          switch (self.state.timer.status) {
                          | `active => "PAUSE"
                          | `paused => "RESUME"
                          | `stopped => "START"
                          }
                        )
                      />
                      <SessionControl
                        color=Colors.bRED
                        onPress=(
                          () => {
                            switch (self.state.timer.handle) {
                            | Some(h) => clearInterval(h)
                            | None => ()
                            };
                            self.send(StopTimer(None));
                          }
                        )
                        label="STOP"
                      />
                    </Styled.SessionControlGroup>
                  },
                layout,
              ),
            )
          )
          <ActionButton
            onPress=(
              () => {
                if (self.state.inSession) {
                  switch (self.state.timer.handle) {
                  | Some(h) => clearInterval(h)
                  | None => self.send(StopTimer(None))
                  };
                  dispatch(
                    Progenitor.CompleteSet(
                      self.state.currentExercise,
                      float(self.state.timer.timeUsed),
                    ),
                  );
                  if (self.state.currentExercise === Running) {
                    dispatch(Progenitor.CompleteWorkout);
                    Alert.alert(
                      ~title="Congrats!",
                      ~message="You've completed today's workout. Rock on!",
                      (),
                    );
                    navigation##pop();
                  };
                } else {
                  self.send(StartTimer(Some(startTimer(self))));
                };
                self.send(ToggleSession);
              }
            )
            label=(self.state.inSession ? "COMPLETE" : "GO")
          />
        </Styled.Container>
      </ScrollView>
    </Styled.Background>;
  },
};

module Provider = {
  let make = Reductive.Provider.createMake(Progenitor.store);
};

let component = ReasonReact.statelessComponent("WorkoutScreen");

let make = (~navigation, _children) => {
  ...component,
  render: _self => <Provider component=(baseMake(~navigation)) />,
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(~navigation=jsProps##navigation, [||])
  );