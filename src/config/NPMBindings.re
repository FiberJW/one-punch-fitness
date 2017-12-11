module RNCalendars = {
  module Calendar = {
    [@bs.module "react-native-calendars"] external calendar : ReasonReact.reactClass = "Calendar";
    let make =
        (
          ~minDate: option(string)=?,
          ~onDayPress: option((string => unit))=?,
          ~hideArrows: option(Js.boolean)=?,
          ~monthFormat: option(string)=?,
          ~onMonthChange: option((string => unit))=?,
          ~hideExtraDays: option(Js.boolean)=?,
          ~disableMonthChange: option(Js.boolean)=?,
          ~firstDay: option(int)=?,
          ~hideDayNames: option(Js.boolean)=?,
          ~markedDates: option({.})=?,
          ~style: option(ReactNative.Style.t)=?,
          ~markingType: option(string)=?,
          children
        ) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=calendar,
        ~props={
          "minDate": Js.Nullable.from_opt(minDate),
          "onDayPress": Js.Nullable.from_opt(onDayPress),
          "hideArrows": Js.Nullable.from_opt(hideArrows),
          "monthFormat": Js.Nullable.from_opt(monthFormat),
          "onMonthChange": Js.Nullable.from_opt(onMonthChange),
          "hideExtraDays": Js.Nullable.from_opt(hideExtraDays),
          "disableMonthChange": Js.Nullable.from_opt(disableMonthChange),
          "firstDay": Js.Nullable.from_opt(firstDay),
          "hideDayNames": Js.Nullable.from_opt(hideDayNames),
          "markedDates": Js.Nullable.from_opt(markedDates),
          "markingType": Js.Nullable.from_opt(markingType),
          "style": Js.Nullable.from_opt(style)
        },
        children
      );
  };
};