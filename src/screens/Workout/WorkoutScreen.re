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

type statusType = [ | `active | `paused | `stopped];

type widgets =
  | Image
  | Progress
  | SetInfo
  | SessionControls
  | Timer;

let transitionLayout = [|Image, Progress, SetInfo|];

let sessionLayout = [|SetInfo, Timer, Progress, SessionControls|];

type state = {
  inSession: bool,
  timeUsed: int,
  timerHandle: option(int),
  status: statusType
};

type action =
  | Tick
  | ToggleSession
  | StartTimer(option(int))
  | StopTimer(option(int))
  | PauseTimer
  | ResumeTimer;

let startTimer = (self) => setInterval(self.ReasonReact.reduce(() => Tick), 1000);

let component = ReasonReact.reducerComponent("WorkoutScreen");

let make = (_children) => {
  ...component,
  initialState: () => {inSession: false, status: `active, timeUsed: 0, timerHandle: None},
  reducer: (action, state) =>
    switch action {
    | Tick =>
      if (state.status !== `paused) {
        ReasonReact.Update({...state, timeUsed: state.timeUsed + 1})
      } else {
        ReasonReact.Update({...state, timeUsed: state.timeUsed})
      }
    | ToggleSession => ReasonReact.Update({...state, inSession: ! state.inSession})
    | StartTimer(timerHandle) =>
      ReasonReact.Update({...state, timerHandle, timeUsed: 0, status: `active})
    | StopTimer(timerHandle) => ReasonReact.Update({...state, timerHandle, status: `stopped})
    | PauseTimer => ReasonReact.Update({...state, status: `paused})
    | ResumeTimer => ReasonReact.Update({...state, status: `active})
    },
  willUnmount: (self) =>
    switch self.state.timerHandle {
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
                      source=illustrations##workoutPrep
                    />
                  | Timer => <Timer key=(string_of_int(i)) time=self.state.timeUsed />
                  | Progress =>
                    <Styled.Progress key=(string_of_int(i))>
                      (ReasonReact.stringToElement("set 1 of 10"))
                    </Styled.Progress>
                  | SetInfo =>
                    <Styled.SetType key=(string_of_int(i))>
                      <Styled.SetReps>
                        (ReasonReact.stringToElement(string_of_int(10)))
                      </Styled.SetReps>
                      (ReasonReact.stringToElement(" push-ups"))
                    </Styled.SetType>
                  | SessionControls =>
                    <Styled.SessionControlGroup key=(string_of_int(i))>
                      <SessionControl
                        color=Colors.blueLeftUsTooSoon
                        onPress=(
                                  if (self.state.status === `paused) {
                                    self.reduce(() => ResumeTimer)
                                  } else if (self.state.status === `stopped) {
                                    self.reduce(() => StartTimer(Some(startTimer(self))))
                                  } else {
                                    self.reduce(() => PauseTimer)
                                  }
                                )
                        label=(
                          switch self.state.status {
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
                            switch self.state.timerHandle {
                            | Some(h) => clearInterval(h)
                            | None => ()
                            };
                            self.reduce(() => StopTimer(None), ())
                          }
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
              () => {
                if (self.state.inSession) {
                  switch self.state.timerHandle {
                  | Some(h) => clearInterval(h)
                  | None => ()
                  };
                  self.reduce(() => StopTimer(None), ())
                } else {
                  self.reduce(() => StartTimer(Some(startTimer(self))), ())
                };
                self.reduce(() => ToggleSession, ())
              }
            )
            label=(self.state.inSession ? "COMPLETE" : "GO")
          />
        </Styled.Container>
      </ScrollView>
    </Styled.Background>
  }
};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));