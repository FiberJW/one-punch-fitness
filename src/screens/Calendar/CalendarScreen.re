open ReactNative;

open NPMBindings.RNCalendars;

let component = ReasonReact.statelessComponent("CalendarScreen");

let make = (_children) => {
  ...component,
  render: (_self) =>
    <ScrollView
      showsVerticalScrollIndicator=false
      contentContainerStyle=Style.(
                              style([flexGrow(1.), paddingVertical(16.), alignItems(`center)])
                            )>
      <Calendar
        style=Style.(style([width(float(Dimensions.get(`window)##width - 32)), flex(0.)]))
      />
      <DailyProgress />
    </ScrollView>
};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));