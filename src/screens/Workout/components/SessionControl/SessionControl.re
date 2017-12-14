module Styled = {
  module Label = {
    [@bs.module "./styled/Label"] external label : ReasonReact.reactClass = "default";
    let make = (~color, children) =>
      ReasonReact.wrapJsForReason(~reactClass=label, ~props={"color": color}, children);
  };
  module Base = {
    [@bs.module "./styled/Base"] external base : ReasonReact.reactClass = "default";
    let make = (children) =>
      ReasonReact.wrapJsForReason(~reactClass=base, ~props=Js.Obj.empty(), children);
  };
  module Touchable = {
    [@bs.module "./styled/Touchable"] external touchable : ReasonReact.reactClass = "default";
    let make = (~onPress, ~activeOpacity, children) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=touchable,
        ~props={"onPress": onPress, "activeOpacity": activeOpacity},
        children
      );
  };
};

let component = ReasonReact.statelessComponent("SessionControl");

let make = (~onPress, ~label, ~color, _children) => {
  ...component,
  render: (_self) =>
    <Styled.Touchable activeOpacity=0.75 onPress>
      <Styled.Base> <Styled.Label color> label </Styled.Label> </Styled.Base>
    </Styled.Touchable>
};

let default =
  ReasonReact.wrapReasonForJs(
    ~component,
    (jsProps) =>
      make(~onPress=jsProps##onPress, ~label=jsProps##label, ~color=jsProps##color, [||])
  );