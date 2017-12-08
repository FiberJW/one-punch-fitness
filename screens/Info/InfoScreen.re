open ReactNative;

[@bs.module "colors"] external colors : Js.t({..}) = "default";

[@bs.module "Assets"] external illustrations : Js.t({..}) = "Illustrations";

module HeroImage = {
  [@bs.module "./styled/HeroImage"] external heroImage : ReasonReact.reactClass = "default";
  let make = (~source, ~resizeMode, children) =>
    ReasonReact.wrapJsForReason(
      ~reactClass=heroImage,
      ~props={"source": source, "resizeMode": resizeMode},
      children
    );
};

let component = ReasonReact.statelessComponent("InfoScreen");

let make = (_children) => {
  ...component,
  render: (_self) =>
    <View style=Style.(style([flex(1.), backgroundColor("white")]))>
      <HeroImage source=illustrations##theSecretSauce resizeMode="cover" />
    </View>
};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));