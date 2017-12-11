module Styled = {
  module Label = {
    [@bs.module "./styled/Label"] external label : ReasonReact.reactClass = "default";
    let make = (children) =>
      ReasonReact.wrapJsForReason(~reactClass=label, ~props=Js.Obj.empty(), children);
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

let component = ReasonReact.statelessComponent("ActionButton");

let make = (~onPress, ~label, _children) => {
  ...component, /* spread the template's other defaults into here  */
  render: (_self) =>
    <Styled.Touchable activeOpacity=0.75 onPress>
      <Styled.Base> <Styled.Label> label </Styled.Label> </Styled.Base>
    </Styled.Touchable>
};

let default =
  ReasonReact.wrapReasonForJs(
    ~component,
    (jsProps) => make(~onPress=jsProps##onPress, ~label=jsProps##label, [||])
  );