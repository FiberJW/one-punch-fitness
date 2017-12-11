open DailyProgressStyled;

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
      <DailyProgressStyled.Stats.Container parentContainerWidth>
        <DailyProgressStyled.Stats.Column>
          (
            ReasonReact.arrayToElement(
              Js.Array.mapi(
                (rf, i) =>
                  <DailyProgressStyled.Stats.Title key=(string_of_int(i))>
                    (ReasonReact.stringToElement(rf.name))
                  </DailyProgressStyled.Stats.Title>,
                currentWorkout
              )
            )
          )
        </DailyProgressStyled.Stats.Column>
        <DailyProgressStyled.Stats.Column center=true>
          (
            ReasonReact.arrayToElement(
              Js.Array.mapi(
                (rf, i) =>
                  <DailyProgressStyled.Stats.BarContainer
                    key=(string_of_int(i))
                    onLayout=(
                      self.reduce((event) => MeasureMaxBarWidth(event##nativeEvent##layout##width))
                    )>
                    <DailyProgressStyled.Stats.Bar
                      width=(float(self.state.maxBarWidth) *. (rf.amountCompleted /. rf.max))
                    />
                  </DailyProgressStyled.Stats.BarContainer>,
                currentWorkout
              )
            )
          )
        </DailyProgressStyled.Stats.Column>
        <DailyProgressStyled.Stats.Column>
          (
            ReasonReact.arrayToElement(
              Js.Array.mapi(
                (rf, i) =>
                  <DailyProgressStyled.Stats.Amount key=(string_of_int(i))>
                    (
                      ReasonReact.stringToElement(
                        rf.name === "running" ?
                          rf.amountCompleted > 0. ?
                            string_of_float(rf.amountCompleted) ++ "km" :
                            string_of_int(int_of_float(rf.amountCompleted)) ++ " km" :
                          string_of_int(int_of_float(rf.amountCompleted))
                      )
                    )
                  </DailyProgressStyled.Stats.Amount>,
                currentWorkout
              )
            )
          )
        </DailyProgressStyled.Stats.Column>
      </DailyProgressStyled.Stats.Container>
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
    <Container
      onLayout=(self.reduce((event) => MeasureContainerWidth(event##nativeEvent##layout##width)))>
      <Title> (ReasonReact.stringToElement("today's workout")) </Title>
      <Status>
        (ReasonReact.stringToElement(string_of_int(int_of_float(percComplete)) ++ "% complete"))
      </Status>
      <Stats currentWorkout=workout parentContainerWidth=self.state.containerWidth />
    </Container>
  }
};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));