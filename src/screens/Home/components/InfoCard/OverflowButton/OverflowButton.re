open NPMBindings;

module Styled = {
  module Base = {
    [@bs.module "./styled/Base"] external base : ReasonReact.reactClass = "default";
    let make = (children) =>
      ReasonReact.wrapJsForReason(~reactClass=base, ~props=Js.Obj.empty(), children);
  };
};

let component = ReasonReact.statelessComponent("OverflowButton");

let make = (_children) => {
  ...component,
  render: (_self) =>
    <Styled.Base> <VectorIcons.Feather name="chevron-down" color="white" size=18 /> </Styled.Base>
};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));