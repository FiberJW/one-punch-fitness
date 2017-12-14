module Styled = {
  module Touchable = {
    [@bs.module "./styled/Touchable"] external touchable : ReasonReact.reactClass = "default";
    let make = (~disabled, ~left, ~right, ~onPress, children) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=touchable,
        ~props={
          "disabled": Js.Boolean.to_js_boolean(disabled),
          "left": Js.Boolean.to_js_boolean(left),
          "right": Js.Boolean.to_js_boolean(right),
          "onPress": onPress
        },
        children
      );
  };
  module Base = {
    [@bs.module "./styled/Base"] external base : ReasonReact.reactClass = "default";
    let make = (~disabled, children) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=base,
        ~props={"disabled": Js.Boolean.to_js_boolean(disabled)},
        children
      );
  };
  module Icon = {
    [@bs.module "./styled/Icon"] external icon : ReasonReact.reactClass = "default";
    let make = (~source=?, ~resizeMode=?, ~disabled, children) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=icon,
        ~props={
          "disabled": Js.Boolean.to_js_boolean(disabled),
          "source": Js.Nullable.from_opt(source),
          "resizeMode": Js.Nullable.from_opt(resizeMode)
        },
        children
      );
  };
};

[@bs.module "Assets"] external icons : Js.t({..}) = "Icons";

let component = ReasonReact.statelessComponent("IntensityButton");

let make = (~onPress, ~action, ~disabled, _children) => {
  ...component,
  render: (_self) =>
    <Styled.Touchable
      disabled left=(action === "decrement") right=(action === "increment") onPress>
      <Styled.Base disabled>
        <Styled.Icon
          disabled
          source=(action === "decrement" ? icons##arrowLeft : icons##arrowRight)
          resizeMode="contain"
        />
      </Styled.Base>
    </Styled.Touchable>
};

let default =
  ReasonReact.wrapReasonForJs(
    ~component,
    (jsProps) =>
      make(~onPress=jsProps##onPress, ~action=jsProps##action, ~disabled=jsProps##disabled, [||])
  );