open NPMBindings;

module Styled = {
  module Touchable = {
    [@bs.module "./styled/Touchable"]
    external touchable : ReasonReact.reactClass = "default";
    let make = (~disabled, ~left, ~right, ~onPress, children) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=touchable,
        ~props={
          "disabled": disabled,
          "left": left,
          "right": right,
          "onPress": onPress,
        },
        children,
      );
  };
  module Base = {
    [@bs.module "./styled/Base"]
    external base : ReasonReact.reactClass = "default";
    let make = (~disabled, children) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=base,
        ~props={"disabled": disabled},
        children,
      );
  };
};

let component = ReasonReact.statelessComponent("IntensityButton");

let make = (~onPress, ~action, ~disabled, _children) => {
  ...component,
  render: _self =>
    <Styled.Touchable
      disabled
      left=(action === "decrement")
      right=(action === "increment")
      onPress>
      <Styled.Base disabled>
        <VectorIcons.Feather
          name=(action === "decrement" ? "arrow-left" : "arrow-right")
          color="white"
          size=18
        />
      </Styled.Base>
    </Styled.Touchable>,
};