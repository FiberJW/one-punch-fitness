module Styled = {
  module Container = {
    [@bs.module "./styled/Container"] external container : ReasonReact.reactClass = "default";
    let make = (children) =>
      ReasonReact.wrapJsForReason(~reactClass=container, ~props=Js.Obj.empty(), children);
  };
  module TouchableBase = {
    [@bs.module "./styled/TouchableBase"] external touchableBase : ReasonReact.reactClass =
      "default";
    let make = (~onPress, children) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=touchableBase,
        ~props={"onPress": onPress},
        children
      );
  };
  module Label = {
    [@bs.module "./styled/Label"] external label : ReasonReact.reactClass = "default";
    let make = (children) =>
      ReasonReact.wrapJsForReason(~reactClass=label, ~props=Js.Obj.empty(), children);
  };
};

let component = ReasonReact.statelessComponent("WorkoutCardStartButton");

let make = (~onPress, _children) => {
  ...component,
  render: (_self) =>
    <Styled.Container>
      <Styled.TouchableBase onPress>
        <Styled.Label> (ReasonReact.stringToElement("start")) </Styled.Label>
      </Styled.TouchableBase>
    </Styled.Container>
};

let default =
  ReasonReact.wrapReasonForJs(~component, (jsProps) => make(~onPress=jsProps##onPress, [||]));