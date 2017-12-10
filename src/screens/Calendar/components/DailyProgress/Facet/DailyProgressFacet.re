open DailyProgressFacetStyled;

open ReactNative;

let component = ReasonReact.statelessComponent("DailyProgressFacet");

let make = (~name, ~parentContainerWidth, _children) => {
  ...component,
  render: (_self) =>
    <Container parentContainerWidth>
      <Text> (ReasonReact.stringToElement(name)) </Text>
      <BarContainer />
      <Text> (ReasonReact.stringToElement("100")) </Text>
    </Container>
};

let default =
  ReasonReact.wrapReasonForJs(
    ~component,
    (jsProps) =>
      make(~name=jsProps##name, ~parentContainerWidth=jsProps##parentContainerWidth, [||])
  );