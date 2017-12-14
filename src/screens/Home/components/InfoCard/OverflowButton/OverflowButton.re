module Styled = {
  module Icon = {
    [@bs.module "./styled/Icon"] external icon : ReasonReact.reactClass = "default";
    let make = (~source=?, ~resizeMode=?, children) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=icon,
        ~props={
          "source": Js.Nullable.from_opt(source),
          "resizeMode": Js.Nullable.from_opt(resizeMode)
        },
        children
      );
  };
  module Base = {
    [@bs.module "./styled/Base"] external base : ReasonReact.reactClass = "default";
    let make = (children) =>
      ReasonReact.wrapJsForReason(~reactClass=base, ~props=Js.Obj.empty(), children);
  };
};

[@bs.module "Assets"] external icons : Js.t({..}) = "Icons";

let component = ReasonReact.statelessComponent("OverflowButton");

let make = (_children) => {
  ...component,
  render: (_self) =>
    <Styled.Base> <Styled.Icon resizeMode="contain" source=icons##chevronDown /> </Styled.Base>
};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));