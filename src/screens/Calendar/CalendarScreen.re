open ReactNative;

[@bs.module "colors"] external colors : Js.t({..}) = "default";

let component = ReasonReact.statelessComponent("CalendarScreen");

let make = (_children) => {
  ...component,
  render: (_self) =>
    <View
      style=Style.(
              style([
                flex(1.),
                justifyContent(`center),
                alignItems(`center),
                backgroundColor("#db7093")
              ])
            )
    />
};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));