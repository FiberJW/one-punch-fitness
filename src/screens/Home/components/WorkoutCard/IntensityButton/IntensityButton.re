open NPMBindings;

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
};

let component = ReasonReact.statelessComponent("IntensityButton");

let make = (~onPress, ~action, ~disabled, _children) => {
  ...component,
  render: (_self) =>
    <Styled.Touchable
      disabled left=(action === "decrement") right=(action === "increment") onPress>
      <Styled.Base disabled>
        <VectorIcons.Feather
          name=(action === "decrement" ? "arrow-left" : "arrow-right")
          color="white"
          size=18
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