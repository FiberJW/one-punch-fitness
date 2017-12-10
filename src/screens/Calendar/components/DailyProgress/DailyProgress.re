open DailyProgressStyled;

open ReactNative;

let component = ReasonReact.statelessComponent("InfoScreen");

let make = (_children) => {
  ...component,
  render: (_self) =>
    <Container> <Title> (ReasonReact.stringToElement("today's workout")) </Title> </Container>
};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));