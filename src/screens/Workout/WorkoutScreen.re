module Base = {
  open BsReactNative;
  [@bs.val] external setInterval : (unit => unit, int) => int = "setInterval";
  [@bs.val] external clearInterval : int => unit = "clearInterval";
  [@bs.module "Assets"] external illustrations : Js.t({..}) = "Illustrations";
  module Styled = {
    module Background = {
      [@bs.module "./components/styled/Background"] external background : ReasonReact.reactClass =
        "default";
      let make = (children) =>
        ReasonReact.wrapJsForReason(~reactClass=background, ~props=Js.Obj.empty(), children);
    };
    module Container = {
      [@bs.module "./components/styled/Container"] external container : ReasonReact.reactClass =
        "default";
      let make = (children) =>
        ReasonReact.wrapJsForReason(~reactClass=container, ~props=Js.Obj.empty(), children);
    };
    module Progress = {
      [@bs.module "./components/styled/Progress"] external progress : ReasonReact.reactClass =
        "default";
      let make = (children) =>
        ReasonReact.wrapJsForReason(~reactClass=progress, ~props=Js.Obj.empty(), children);
    };
    module SetType = {
      [@bs.module "./components/styled/SetType"] external setType : ReasonReact.reactClass =
        "default";
      let make = (children) =>
        ReasonReact.wrapJsForReason(~reactClass=setType, ~props=Js.Obj.empty(), children);
    };
    module SetReps = {
      [@bs.module "./components/styled/SetReps"] external setReps : ReasonReact.reactClass =
        "default";
      let make = (children) =>
        ReasonReact.wrapJsForReason(~reactClass=setReps, ~props=Js.Obj.empty(), children);
    };
    module SessionControlGroup = {
      [@bs.module "./components/SessionControl/styled/Group"]
      external sessionControlGroup : ReasonReact.reactClass =
        "default";
      let make = (children) =>
        ReasonReact.wrapJsForReason(
          ~reactClass=sessionControlGroup,
          ~props=Js.Obj.empty(),
          children
        );
    };
    module Image = {
      [@bs.module "./components/styled/Image"] external image : ReasonReact.reactClass = "default";
      let make = (~source, ~resizeMode, children) =>
        ReasonReact.wrapJsForReason(
          ~reactClass=image,
          ~props={"source": source, "resizeMode": resizeMode},
          children
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
  type exercise =
    | PushUps
    | SitUps
    | Squats
    | Running;
  let workoutOrder = [|PushUps, SitUps, Squats, Running|];
  type timerState = {
    timeUsed: int,
    handle: option(int),
    status: timerStatusType
  };
  type state = {
    timer: timerState,
    inSession: bool,
    currentExercise: exercise
  };
  type action =
    | Tick
    | ToggleSession
    | StartTimer(option(int))
    | StopTimer(option(int))
    | PauseTimer
    | ResumeTimer;
  let startTimer = (self) => setInterval(self.ReasonReact.reduce(() => Tick), 1000);
  let component = ReasonReact.reducerComponent("WorkoutScreenBase");
  let make = (~state as reductiveState: Progenitor.state, ~dispatch, _children) => {
    ...component,
    initialState: () => {
      timer: {status: `active, timeUsed: 0, handle: None},
      inSession: false,
      currentExercise: PushUps
    },
    didMount: (_self) => {
      Js.log("zero-based-level " ++ string_of_int(reductiveState.currentWorkout.level));
      ReasonReact.NoUpdate
    },
    reducer: (action, state) =>
      switch action {
      | Tick =>
        if (state.timer.status !== `paused) {
          ReasonReact.Update({
            ...state,
            timer: {...state.timer, timeUsed: state.timer.timeUsed + 1}
          })
        } else {
          ReasonReact.NoUpdate
        }
      | ToggleSession => ReasonReact.Update({...state, inSession: ! state.inSession})
      | StartTimer(handle) =>
        ReasonReact.Update({...state, timer: {handle, timeUsed: 0, status: `active}})
      | StopTimer(handle) =>
        ReasonReact.Update({...state, timer: {...state.timer, handle, status: `stopped}})
      | PauseTimer => ReasonReact.Update({...state, timer: {...state.timer, status: `paused}})
      | ResumeTimer => ReasonReact.Update({...state, timer: {...state.timer, status: `active}})
      },
    willUnmount: (self) =>
      switch self.state.timer.handle {
      | Some(h) => clearInterval(h)
      | None => ()
      },
    render: (self) => {
      let layout = self.state.inSession ? sessionLayout : transitionLayout;
      <Styled.Background>
        <ScrollView
          contentContainerStyle=Style.(style([flexGrow(1.)]))
          alwaysBounceVertical=false
          showsVerticalScrollIndicator=false>
          <Styled.Container>
            (
              ReasonReact.arrayToElement(
                Array.mapi(
                  (i, it) =>
                    switch it {
                    | Image =>
                      <Styled.Image
                        key=(string_of_int(i))
                        resizeMode="cover"
                        source=(
                          switch self.state.currentExercise {
                          | PushUps => illustrations##pushups
                          | SitUps => illustrations##situps
                          | Squats => illustrations##squats
                          | Running => illustrations##run
                          }
                        )
                      />
                    | Timer => <Timer key=(string_of_int(i)) time=self.state.timer.timeUsed />
                    | Progress =>
                      <Styled.Progress key=(string_of_int(i))>
                        (
                          ReasonReact.stringToElement(
                            "set 1 of "
                            ++ string_of_int(
                                 Routines.variations[reductiveState.currentWorkout.level].sitUps.
                                   sets
                               )
                            ++ ""
                          )
                        )
                      </Styled.Progress>
                    | SetInfo =>
                      <Styled.SetType key=(string_of_int(i))>
                        <Styled.SetReps>
                          (
                            ReasonReact.stringToElement(
                              string_of_int(
                                Routines.variations[reductiveState.currentWorkout.level].sitUps.
                                  reps
                              )
                            )
                          )
                        </Styled.SetReps>
                        (
                          ReasonReact.stringToElement(
                            " "
                            ++ (
                              switch self.state.currentExercise {
                              | PushUps => "push-ups"
                              | SitUps => "sit-ups"
                              | Squats => "squats"
                              | Running => "run"
                              }
                            )
                          )
                        )
                      </Styled.SetType>
                    | SessionControls =>
                      <Styled.SessionControlGroup key=(string_of_int(i))>
                        <SessionControl
                          color=Colors.blueLeftUsTooSoon
                          onPress=(
                            switch self.state.timer.status {
                            | `paused => self.reduce(() => ResumeTimer)
                            | `stopped => self.reduce(() => StartTimer(Some(startTimer(self))))
                            | `active => self.reduce(() => PauseTimer)
                            }
                          )
                          label=(
                            switch self.state.timer.status {
                            | `active => "PAUSE"
                            | `paused => "RESUME"
                            | `stopped => "START"
                            }
                          )
                        />
                        <SessionControl
                          color=Colors.bRED
                          onPress=(
                            self.reduce(
                              () => {
                                switch self.state.timer.handle {
                                | Some(h) => clearInterval(h)
                                | None => ()
                                };
                                StopTimer(None)
                              }
                            )
                          )
                          label="STOP"
                        />
                      </Styled.SessionControlGroup>
                    },
                  layout
                )
              )
            )
            <ActionButton
              onPress=(
                self.reduce(
                  () => {
                    if (self.state.inSession) {
                      switch self.state.timer.handle {
                      | Some(h) => clearInterval(h)
                      | None => self.reduce(() => StopTimer(None), ())
                      }
                    } else {
                      self.reduce(() => StartTimer(Some(startTimer(self))), ())
                    };
                    ToggleSession
                  }
                )
              )
              label=(self.state.inSession ? "COMPLETE" : "GO")
            />
          </Styled.Container>
        </ScrollView>
      </Styled.Background>
    }
  };
};

module Provider = {
  let make = Reductive.Provider.createMake(Progenitor.store);
};

let component = ReasonReact.statelessComponent("WorkoutScreen");

let make = (_children) => {...component, render: (_self) => <Provider component=Base.make />};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));