module Styled = {
  module Container = {
    [@bs.module "./styled/Container"]
    external container : ReasonReact.reactClass = "default";
    let make = (~onLayout=?, children) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=container,
        ~props={"onLayout": Js.Nullable.from_opt(onLayout)},
        children
      );
  };
  module Title = {
    [@bs.module "./styled/Title"]
    external title : ReasonReact.reactClass = "default";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=title,
        ~props=Js.Obj.empty(),
        children
      );
  };
  module Status = {
    [@bs.module "./styled/Status"]
    external status : ReasonReact.reactClass = "default";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=status,
        ~props=Js.Obj.empty(),
        children
      );
  };
  module Stats = {
    module Container = {
      [@bs.module "./styled/Stats/Container"]
      external container : ReasonReact.reactClass = "default";
      let make = (~parentContainerWidth, children) =>
        ReasonReact.wrapJsForReason(
          ~reactClass=container,
          ~props={"parentContainerWidth": parentContainerWidth},
          children
        );
    };
    module Column = {
      [@bs.module "./styled/Stats/Column"]
      external column : ReasonReact.reactClass = "default";
      let make = (~center=?, children) =>
        ReasonReact.wrapJsForReason(
          ~reactClass=column,
          ~props={"center": Js.Nullable.from_opt(center)},
          children
        );
    };
    module BarContainer = {
      [@bs.module "./styled/Stats/BarContainer"]
      external barContainer : ReasonReact.reactClass = "default";
      let make = (~onLayout=?, children) =>
        ReasonReact.wrapJsForReason(
          ~reactClass=barContainer,
          ~props={"onLayout": Js.Nullable.from_opt(onLayout)},
          children
        );
    };
    module Bar = {
      [@bs.module "./styled/Stats/Bar"]
      external bar : ReasonReact.reactClass = "default";
      let make = (~width, children) =>
        ReasonReact.wrapJsForReason(
          ~reactClass=bar,
          ~props={"width": width},
          children
        );
    };
    module Title = {
      [@bs.module "./styled/Stats/Title"]
      external title : ReasonReact.reactClass = "default";
      let make = children =>
        ReasonReact.wrapJsForReason(
          ~reactClass=title,
          ~props=Js.Obj.empty(),
          children
        );
    };
    module Amount = {
      [@bs.module "./styled/Stats/Amount"]
      external amount : ReasonReact.reactClass = "default";
      let make = children =>
        ReasonReact.wrapJsForReason(
          ~reactClass=amount,
          ~props=Js.Obj.empty(),
          children
        );
    };
  };
};

module Stats = {
  type action =
    | MeasureMaxBarWidth(int);
  type state = {maxBarWidth: int};
  let component = ReasonReact.reducerComponent("DailyProgressFacet");
  let make = (~workout: Progenitor.workout, ~parentContainerWidth, _children) => {
    ...component,
    initialState: () => {maxBarWidth: 0},
    reducer: (action, _state) =>
      switch action {
      | MeasureMaxBarWidth(width) => ReasonReact.Update({maxBarWidth: width})
      },
    render: self =>
      <Styled.Stats.Container parentContainerWidth>
        <Styled.Stats.Column>
          <Styled.Stats.Title>
            (ReasonReact.stringToElement("push-ups"))
          </Styled.Stats.Title>
          <Styled.Stats.Title>
            (ReasonReact.stringToElement("sit-ups"))
          </Styled.Stats.Title>
          <Styled.Stats.Title>
            (ReasonReact.stringToElement("squats"))
          </Styled.Stats.Title>
          <Styled.Stats.Title>
            (ReasonReact.stringToElement("running"))
          </Styled.Stats.Title>
        </Styled.Stats.Column>
        <Styled.Stats.Column center=true>
          <Styled.Stats.BarContainer
            onLayout=(
              self.reduce(event =>
                MeasureMaxBarWidth(event##nativeEvent##layout##width)
              )
            )>
            <Styled.Stats.Bar
              width=(
                float(self.state.maxBarWidth)
                *. (
                  float(workout.setsCompleted.pushUps)
                  /. float(Routines.variations[workout.level].pushUps.sets)
                )
              )
            />
          </Styled.Stats.BarContainer>
          <Styled.Stats.BarContainer>
            <Styled.Stats.Bar
              width=(
                float(self.state.maxBarWidth)
                *. (
                  float(workout.setsCompleted.sitUps)
                  /. float(Routines.variations[workout.level].sitUps.sets)
                )
              )
            />
          </Styled.Stats.BarContainer>
          <Styled.Stats.BarContainer>
            <Styled.Stats.Bar
              width=(
                float(self.state.maxBarWidth)
                *. (
                  float(workout.setsCompleted.squats)
                  /. float(Routines.variations[workout.level].squats.sets)
                )
              )
            />
          </Styled.Stats.BarContainer>
          <Styled.Stats.BarContainer>
            <Styled.Stats.Bar
              width=(
                float(self.state.maxBarWidth)
                *. (workout.setsCompleted.run ? 1. : 0.)
              )
            />
          </Styled.Stats.BarContainer>
        </Styled.Stats.Column>
        <Styled.Stats.Column>
          <Styled.Stats.Amount>
            (
              ReasonReact.stringToElement(
                string_of_int(
                  workout.setsCompleted.pushUps
                  * Routines.variations[workout.level].pushUps.reps
                )
              )
            )
          </Styled.Stats.Amount>
          <Styled.Stats.Amount>
            (
              ReasonReact.stringToElement(
                string_of_int(
                  workout.setsCompleted.sitUps
                  * Routines.variations[workout.level].sitUps.reps
                )
              )
            )
          </Styled.Stats.Amount>
          <Styled.Stats.Amount>
            (
              ReasonReact.stringToElement(
                string_of_int(
                  workout.setsCompleted.squats
                  * Routines.variations[workout.level].squats.reps
                )
              )
            )
          </Styled.Stats.Amount>
          <Styled.Stats.Amount>
            (
              ReasonReact.stringToElement(
                workout.setsCompleted.run ? "10km" : "0 km"
              )
            )
          </Styled.Stats.Amount>
        </Styled.Stats.Column>
      </Styled.Stats.Container>
  };
  let default =
    ReasonReact.wrapReasonForJs(~component, jsProps =>
      make(
        ~workout=jsProps##workout,
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

let make = (~workout: Progenitor.workout, ~percComplete, _children) => {
  ...component,
  initialState: () => {containerWidth: 0, maxBarWidth: 0},
  reducer: (action, state) =>
    switch action {
    | MeasureContainerWidth(width) =>
      ReasonReact.Update({...state, containerWidth: width})
    | MeasureMaxBarWidth(width) =>
      ReasonReact.Update({...state, maxBarWidth: width})
    },
  render: self =>
    <Styled.Container
      onLayout=(
        self.reduce(event =>
          MeasureContainerWidth(event##nativeEvent##layout##width)
        )
      )>
      <Styled.Title>
        (ReasonReact.stringToElement("today's workout"))
      </Styled.Title>
      <Styled.Status>
        (
          ReasonReact.stringToElement(
            string_of_int(int_of_float(percComplete)) ++ "% complete"
          )
        )
      </Styled.Status>
      <Stats workout parentContainerWidth=self.state.containerWidth />
    </Styled.Container>
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(~workout=jsProps##workout, ~percComplete=jsProps##percComplete, [||])
  );
