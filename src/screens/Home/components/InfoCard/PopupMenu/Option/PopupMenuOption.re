open ReactNative;

module Styled = {
  module Label = {
    [@bs.module "./styled/Label"] external label : ReasonReact.reactClass = "default";
    let make = (children) =>
      ReasonReact.wrapJsForReason(~reactClass=label, ~props=Js.Obj.empty(), children);
  };
  module Base = {
    [@bs.module "./styled/Base"] external base : ReasonReact.reactClass = "default";
    let make = (~last, children) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=base,
        ~props={"last": Js.Boolean.to_js_boolean(last)},
        children
      );
  };
};

[@bs.module "Assets"] external icons : Js.t({..}) = "Icons";

let component = ReasonReact.statelessComponent("PopupMenuOption");

let make = (~last, ~action, _children) => {
  ...component,
  render: (_self) =>
    <TouchableOpacity activeOpacity=0.8 onPress=action##onPress>
      <Styled.Base last> <Styled.Label> action##title </Styled.Label> </Styled.Base>
    </TouchableOpacity>
};

let default =
  ReasonReact.wrapReasonForJs(
    ~component,
    (jsProps) => make(~last=jsProps##last, ~action=jsProps##action, [||])
  );