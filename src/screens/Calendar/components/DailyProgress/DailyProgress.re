open DailyProgressStyled;

open ReactNative;

type action =
  | MeasureContainerWidth(int)
  | MeasureMaxBarWidth(int);

type state = {
  containerWidth: int,
  maxBarWidth: int
};

type routineFacet = {
  name: string,
  amountCompleted: float,
  max: float
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
      {name: "running", amountCompleted: 0.3, max: 10.}
    |];
    <Container
      onLayout=(self.reduce((event) => MeasureContainerWidth(event##nativeEvent##layout##width)))>
      <Title> (ReasonReact.stringToElement("today's workout")) </Title>
      <Status> (ReasonReact.stringToElement("75% complete")) </Status>
      <DailyProgressFacetStyled.Container parentContainerWidth=self.state.containerWidth>
        <View style=Style.(style([alignSelf(`stretch), justifyContent(`spaceAround)]))>
          (
            ReasonReact.arrayToElement(
              Js.Array.mapi(
                (rf, i) =>
                  <DailyProgressFacetStyled.Title key=(string_of_int(i))>
                    (ReasonReact.stringToElement(rf.name))
                  </DailyProgressFacetStyled.Title>,
                workout
              )
            )
          )
        </View>
        <View style=Style.(style([alignSelf(`stretch), flex(1.), justifyContent(`spaceAround)]))>
          (
            ReasonReact.arrayToElement(
              Js.Array.mapi(
                (rf, i) =>
                  <DailyProgressFacetStyled.BarContainer
                    key=(string_of_int(i))
                    onLayout=(
                      self.reduce((event) => MeasureMaxBarWidth(event##nativeEvent##layout##width))
                    )>
                    <DailyProgressFacetStyled.Bar
                      width=(float(self.state.maxBarWidth) *. (rf.amountCompleted /. rf.max))
                    />
                  </DailyProgressFacetStyled.BarContainer>,
                workout
              )
            )
          )
        </View>
        <View style=Style.(style([alignSelf(`stretch), justifyContent(`spaceAround)]))>
          (
            ReasonReact.arrayToElement(
              Js.Array.mapi(
                (rf, i) =>
                  <DailyProgressFacetStyled.Amount key=(string_of_int(i))>
                    (
                      ReasonReact.stringToElement(
                        rf.name == "running" ?
                          rf.amountCompleted > 0. ?
                            string_of_float(rf.amountCompleted) ++ "km" :
                            string_of_int(int_of_float(rf.amountCompleted)) ++ " km" :
                          string_of_int(int_of_float(rf.amountCompleted))
                      )
                    )
                  </DailyProgressFacetStyled.Amount>,
                workout
              )
            )
          )
        </View>
      </DailyProgressFacetStyled.Container>
    </Container>
  }
};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));