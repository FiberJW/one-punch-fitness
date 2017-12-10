open DailyProgressStyled;

open ReactNative;

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
  render: (self) =>
    <Container
      onLayout=(self.reduce((event) => MeasureContainerWidth(event##nativeEvent##layout##width)))>
      <Title> (ReasonReact.stringToElement("today's workout")) </Title>
      <Status> (ReasonReact.stringToElement("75% complete")) </Status>
      <DailyProgressFacetStyled.Container parentContainerWidth=self.state.containerWidth>
        <View style=Style.(style([alignSelf(`stretch), justifyContent(`spaceAround)]))>
          <DailyProgressFacetStyled.Title>
            (ReasonReact.stringToElement("push-ups"))
          </DailyProgressFacetStyled.Title>
          <DailyProgressFacetStyled.Title>
            (ReasonReact.stringToElement("sit-ups"))
          </DailyProgressFacetStyled.Title>
          <DailyProgressFacetStyled.Title>
            (ReasonReact.stringToElement("squats"))
          </DailyProgressFacetStyled.Title>
          <DailyProgressFacetStyled.Title>
            (ReasonReact.stringToElement("running"))
          </DailyProgressFacetStyled.Title>
        </View>
        <View style=Style.(style([alignSelf(`stretch), flex(1.), justifyContent(`spaceAround)]))>
          <DailyProgressFacetStyled.BarContainer
            onLayout=(
              self.reduce((event) => MeasureMaxBarWidth(event##nativeEvent##layout##width))
            )>
            <DailyProgressFacetStyled.Bar width=(float(self.state.maxBarWidth) *. 0.75) />
          </DailyProgressFacetStyled.BarContainer>
          <DailyProgressFacetStyled.BarContainer>
            <DailyProgressFacetStyled.Bar width=(float(self.state.maxBarWidth) *. 0.75) />
          </DailyProgressFacetStyled.BarContainer>
          <DailyProgressFacetStyled.BarContainer>
            <DailyProgressFacetStyled.Bar width=(float(self.state.maxBarWidth) *. 0.75) />
          </DailyProgressFacetStyled.BarContainer>
          <DailyProgressFacetStyled.BarContainer>
            <DailyProgressFacetStyled.Bar width=(float(self.state.maxBarWidth) *. 0.75) />
          </DailyProgressFacetStyled.BarContainer>
        </View>
        <View style=Style.(style([alignSelf(`stretch), justifyContent(`spaceAround)]))>
          <DailyProgressFacetStyled.Amount>
            (ReasonReact.stringToElement("75"))
          </DailyProgressFacetStyled.Amount>
          <DailyProgressFacetStyled.Amount>
            (ReasonReact.stringToElement("75"))
          </DailyProgressFacetStyled.Amount>
          <DailyProgressFacetStyled.Amount>
            (ReasonReact.stringToElement("75"))
          </DailyProgressFacetStyled.Amount>
          <DailyProgressFacetStyled.Amount>
            (ReasonReact.stringToElement("7.5km"))
          </DailyProgressFacetStyled.Amount>
        </View>
      </DailyProgressFacetStyled.Container>
    </Container>
};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));