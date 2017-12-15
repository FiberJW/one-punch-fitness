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

module Expo = {
  module Font = {
    [@bs.scope "Font"] [@bs.module "expo"] external loadAsync : Js.t({..}) => Js.Promise.t(unit) =
      "loadAsync";
  };
  module AppLoading = {
    [@bs.module "expo"] external appLoading : ReasonReact.reactClass = "AppLoading";
    let make = (children) =>
      ReasonReact.wrapJsForReason(~reactClass=appLoading, ~props=Js.Obj.empty(), children);
  };
};

module DateTimePicker = {
  [@bs.module "react-native-modal-datetime-picker"]
  external dateTimePicker : ReasonReact.reactClass =
    "default";
  let make =
      (
        ~isVisible: bool=false,
        ~onConfirm: option((Js.Date.t => unit))=?,
        ~onCancel: option((unit => unit))=?,
        ~mode: option(string)=?,
        ~titleIOS: option(string)=?,
        children
      ) =>
    ReasonReact.wrapJsForReason(
      ~reactClass=dateTimePicker,
      ~props={
        "isVisible": Js.Boolean.to_js_boolean(isVisible),
        "onConfirm": Js.Nullable.from_opt(onConfirm),
        "onCancel": Js.Nullable.from_opt(onCancel),
        "titleIOS": Js.Nullable.from_opt(titleIOS),
        "mode": Js.Nullable.from_opt(mode)
      },
      children
    );
};

module Moment = {
  type t;
  [@bs.module] external make : string => Js.t({..}) = "moment";
};

module RNAnimatable = {
  module View = {
    [@bs.module "react-native-animatable"] external view : ReasonReact.reactClass = "View";
    let make = (~easing, children) =>
      ReasonReact.wrapJsForReason(~reactClass=view, ~props={"easing": easing}, children);
  };
};