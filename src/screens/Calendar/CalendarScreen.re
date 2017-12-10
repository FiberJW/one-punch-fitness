open ReactNative;

open NPMBindings.RNCalendars;

[@bs.module "colors"] external colors : Js.t({..}) = "default";

let component = ReasonReact.statelessComponent("CalendarScreen");

let make = (_children) => {
  ...component,
  render: (_self) =>
    <ScrollView
      contentContainerStyle=Style.(style([flex(1.), paddingVertical(16.), alignItems(`center)]))>
      <Calendar
        style=Style.(
                style([
                  height(float(Dimensions.get(`window)##width - 32)),
                  width(float(Dimensions.get(`window)##width - 32)),
                  flex(0.)
                ])
              )
      />
    </ScrollView>
};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));