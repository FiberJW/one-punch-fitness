open BsReactNative;

open NPMBindings.RNCalendars;

let component = ReasonReact.statelessComponent("CalendarScreen");

let make = (_children) => {
  ...component,
  render: (_self) =>
    <ScrollView
      showsVerticalScrollIndicator=false
      contentContainerStyle=Style.(
                              style([flexGrow(1.), paddingVertical(Pt(16.)), alignItems(Center)])
                            )>
      <Calendar
        style=Style.(style([width(Pt(float(Dimensions.get(`window)##width - 32))), flex(0.)]))
      />
      <DailyProgress />
    </ScrollView>
};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));