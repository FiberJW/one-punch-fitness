module Styled = {
  module Container = {
    [@bs.module "./styled/Container"]
    external container : ReasonReact.reactClass = "default";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=container,
        ~props=Js.Obj.empty(),
        children
      );
  };
  module TouchableBase = {
    [@bs.module "./styled/TouchableBase"]
    external touchableBase : ReasonReact.reactClass = "default";
    let make = (~onPress, ~disabled, children) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=touchableBase,
        ~props={
          "onPress": onPress,
          "disabled": Js.Boolean.to_js_boolean(disabled)
        },
        children
      );
  };
  module Label = {
    [@bs.module "./styled/Label"]
    external label : ReasonReact.reactClass = "default";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=label,
        ~props=Js.Obj.empty(),
        children
      );
  };
};

let component = ReasonReact.statelessComponent("WorkoutCardStartButton");

let make = (~disabled, ~label, ~onPress, _children) => {
  ...component,
  render: _self =>
    <Styled.Container>
      <Styled.TouchableBase onPress disabled>
        <Styled.Label> (ReasonReact.stringToElement(label)) </Styled.Label>
      </Styled.TouchableBase>
    </Styled.Container>
};
