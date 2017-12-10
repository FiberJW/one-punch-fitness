open DailyProgressStyled;

type action =
  | MeasureContainerWidth(int);

type state = {containerWidth: int};

let component = ReasonReact.reducerComponent("DailyProgress");

let make = (_children) => {
  ...component,
  initialState: () => {containerWidth: 0},
  reducer: (action, _state) =>
    switch action {
    | MeasureContainerWidth(width) => ReasonReact.Update({containerWidth: width})
    },
  render: (self) =>
    <Container
      onLayout=(self.reduce((event) => MeasureContainerWidth(event##nativeEvent##layout##width)))>
      <Title> (ReasonReact.stringToElement("today's workout")) </Title>
      <Status> (ReasonReact.stringToElement("75% complete")) </Status>
      <DailyProgressFacet name="push-ups" parentContainerWidth=self.state.containerWidth />
      <DailyProgressFacet name="sit-ups" parentContainerWidth=self.state.containerWidth />
      <DailyProgressFacet name="squats" parentContainerWidth=self.state.containerWidth />
      <DailyProgressFacet name="running" parentContainerWidth=self.state.containerWidth />
    </Container>
};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));