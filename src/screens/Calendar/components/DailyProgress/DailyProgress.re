module Styled = {
  module Container = {
    [@bs.module "./styled/Container"] external container : ReasonReact.reactClass = "default";
    let make = (~onLayout=?, children) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=container,
        ~props={"onLayout": Js.Nullable.from_opt(onLayout)},
        children
      );
  };
  module Title = {
    [@bs.module "./styled/Title"] external title : ReasonReact.reactClass = "default";
    let make = (children) =>
      ReasonReact.wrapJsForReason(~reactClass=title, ~props=Js.Obj.empty(), children);
  };
  module Status = {
    [@bs.module "./styled/Status"] external status : ReasonReact.reactClass = "default";
    let make = (children) =>
      ReasonReact.wrapJsForReason(~reactClass=status, ~props=Js.Obj.empty(), children);
  };
  module Stats = {
    module Container = {
      [@bs.module "./styled/Stats/Container"] external container : ReasonReact.reactClass =
        "default";
      let make = (~parentContainerWidth, children) =>
        ReasonReact.wrapJsForReason(
          ~reactClass=container,
          ~props={"parentContainerWidth": parentContainerWidth},
          children
        );
    };
    module Column = {
      [@bs.module "./styled/Stats/Column"] external column : ReasonReact.reactClass = "default";
      let make = (~center=?, children) =>
        ReasonReact.wrapJsForReason(
          ~reactClass=column,
          ~props={"center": Js.Nullable.from_opt(center)},
          children
        );
    };
    module BarContainer = {
      [@bs.module "./styled/Stats/BarContainer"] external barContainer : ReasonReact.reactClass =
        "default";
      let make = (~onLayout=?, children) =>
        ReasonReact.wrapJsForReason(
          ~reactClass=barContainer,
          ~props={"onLayout": Js.Nullable.from_opt(onLayout)},
          children
        );
    };
    module Bar = {
      [@bs.module "./styled/Stats/Bar"] external bar : ReasonReact.reactClass = "default";
      let make = (~width, children) =>
        ReasonReact.wrapJsForReason(~reactClass=bar, ~props={"width": width}, children);
    };
    module Title = {
      [@bs.module "./styled/Stats/Title"] external title : ReasonReact.reactClass = "default";
      let make = (children) =>
        ReasonReact.wrapJsForReason(~reactClass=title, ~props=Js.Obj.empty(), children);
    };
    module Amount = {
      [@bs.module "./styled/Stats/Amount"] external amount : ReasonReact.reactClass = "default";
      let make = (children) =>
        ReasonReact.wrapJsForReason(~reactClass=amount, ~props=Js.Obj.empty(), children);
    };
  };
};

type routineStat = {
  name: string,
  amountCompleted: float,
  max: float
};

module Stats = {
  type action =
    | MeasureMaxBarWidth(int);
  type state = {maxBarWidth: int};
  let component = ReasonReact.reducerComponent("DailyProgressFacet");
  let make = (~currentWorkout, ~parentContainerWidth, _children) => {
    ...component,
    initialState: () => {maxBarWidth: 0},
    reducer: (action, _state) =>
      switch action {
      | MeasureMaxBarWidth(width) => ReasonReact.Update({maxBarWidth: width})
      },
    render: (self) =>
      <Styled.Stats.Container parentContainerWidth>
        <Styled.Stats.Column>
          (
            ReasonReact.arrayToElement(
              Js.Array.mapi(
                (rf, i) =>
                  <Styled.Stats.Title key=(string_of_int(i))>
                    (ReasonReact.stringToElement(rf.name))
                  </Styled.Stats.Title>,
                currentWorkout
              )
            )
          )
        </Styled.Stats.Column>
        <Styled.Stats.Column center=true>
          (
            ReasonReact.arrayToElement(
              Js.Array.mapi(
                (rf, i) =>
                  <Styled.Stats.BarContainer
                    key=(string_of_int(i))
                    onLayout=(
                      self.reduce((event) => MeasureMaxBarWidth(event##nativeEvent##layout##width))
                    )>
                    <Styled.Stats.Bar
                      width=(float(self.state.maxBarWidth) *. (rf.amountCompleted /. rf.max))
                    />
                  </Styled.Stats.BarContainer>,
                currentWorkout
              )
            )
          )
        </Styled.Stats.Column>
        <Styled.Stats.Column>
          (
            ReasonReact.arrayToElement(
              Js.Array.mapi(
                (rf, i) =>
                  <Styled.Stats.Amount key=(string_of_int(i))>
                    (
                      ReasonReact.stringToElement(
                        rf.name === "running" ?
                          rf.amountCompleted > 0. ?
                            string_of_float(rf.amountCompleted) ++ "km" :
                            string_of_int(int_of_float(rf.amountCompleted)) ++ " km" :
                          string_of_int(int_of_float(rf.amountCompleted))
                      )
                    )
                  </Styled.Stats.Amount>,
                currentWorkout
              )
            )
          )
        </Styled.Stats.Column>
      </Styled.Stats.Container>
  };
  let default =
    ReasonReact.wrapReasonForJs(
      ~component,
      (jsProps) =>
        make(
          ~currentWorkout=jsProps##currentWorkout,
          ~parentContainerWidth=jsProps##parentContainerWidth,
          [||]
        )
    );
};

type action =
  | MeasureContainerWidth(int)
  | MeasureMaxBarWidth(int);

type state = {
  containerWidth: int,
  maxBarWidth: int
};

let component = ReasonReact.reducerComponent("DailyProgress");

let make = (_children) => {
  ...component,
  initialState: () => {containerWidth: 0, maxBarWidth: 0},
  reducer: (action, state) =>
    switch action {
    | MeasureContainerWidth(width) => ReasonReact.Update({...state, containerWidth: width})
    | MeasureMaxBarWidth(width) => ReasonReact.Update({...state, maxBarWidth: width})
    },
  render: (self) => {
    let workout = [|
      {name: "push-ups", amountCompleted: 75., max: 100.},
      {name: "sit-ups", amountCompleted: 75., max: 100.},
      {name: "squats", amountCompleted: 75., max: 100.},
      {name: "running", amountCompleted: 2.3, max: 10.}
    |];
    let totalComplete = ref(0.);
    let max = ref(0.);
    Js.Array.forEach(
      (rf) => {
        totalComplete := totalComplete^ +. rf.amountCompleted;
        max := max^ +. rf.max
      },
      workout
    );
    let percComplete = totalComplete^ /. max^ *. 100.;
    <Styled.Container
      onLayout=(self.reduce((event) => MeasureContainerWidth(event##nativeEvent##layout##width)))>
      <Styled.Title> (ReasonReact.stringToElement("today's workout")) </Styled.Title>
      <Styled.Status>
        (ReasonReact.stringToElement(string_of_int(int_of_float(percComplete)) ++ "% complete"))
      </Styled.Status>
      <Stats currentWorkout=workout parentContainerWidth=self.state.containerWidth />
    </Styled.Container>
  }
};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));