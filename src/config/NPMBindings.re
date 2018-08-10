module RNCalendars = {
  module Calendar = {
    [@bs.module "react-native-calendars"]
    external calendar : ReasonReact.reactClass = "Calendar";
    let make =
        (
          ~minDate: option(string)=?,
          ~onDayPress: option(Js.t({..}) => unit)=?,
          ~hideArrows: option(bool)=?,
          ~monthFormat: option(string)=?,
          ~current: option(string)=?,
          ~onMonthChange: option(string => unit)=?,
          ~hideExtraDays: option(bool)=?,
          ~disableMonthChange: option(bool)=?,
          ~firstDay: option(int)=?,
          ~hideDayNames: option(bool)=?,
          ~markedDates:
             Js.Dict.t(
               {
                 .
                 "startingDay": bool,
                 "endingDay": bool,
                 "color": string,
                 "textColor": string,
               },
             ),
          ~style: option(BsReactNative.Style.t)=?,
          ~markingType: option(string)=?,
          children,
        ) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=calendar,
        ~props={
          "minDate": Js.Nullable.fromOption(minDate),
          "current": Js.Nullable.fromOption(current),
          "onDayPress": Js.Nullable.fromOption(onDayPress),
          "hideArrows": Js.Nullable.fromOption(hideArrows),
          "monthFormat": Js.Nullable.fromOption(monthFormat),
          "onMonthChange": Js.Nullable.fromOption(onMonthChange),
          "hideExtraDays": Js.Nullable.fromOption(hideExtraDays),
          "disableMonthChange": Js.Nullable.fromOption(disableMonthChange),
          "firstDay": Js.Nullable.fromOption(firstDay),
          "hideDayNames": Js.Nullable.fromOption(hideDayNames),
          "markedDates": markedDates,
          "markingType": Js.Nullable.fromOption(markingType),
          "style": Js.Nullable.fromOption(style),
        },
        children,
      );
  };
};

module Expo = {
  module Font = {
    [@bs.scope "Font"] [@bs.module "expo"]
    external loadAsync : Js.t({..}) => Js.Promise.t(unit) = "loadAsync";
  };
  module AppLoading = {
    [@bs.module "expo"]
    external appLoading : ReasonReact.reactClass = "AppLoading";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=appLoading,
        ~props=Js.Obj.empty(),
        children,
      );
  };
  module Permissions = {
    [@bs.scope "Permissions"] [@bs.module "expo"]
    external notifications : string = "NOTIFICATIONS";
    [@bs.scope "Permissions"] [@bs.module "expo"]
    external ask :
      string =>
      Js.Promise.t(
        {
          .
          "expires": string,
          "status": string,
        },
      ) =
      "askAsync";
    [@bs.scope "Permissions"] [@bs.module "expo"]
    external get :
      string =>
      Js.Promise.t(
        {
          .
          "expires": string,
          "status": string,
        },
      ) =
      "getAsync";
  };
  module Notifications = {
    type localNotification = {
      .
      "title": string,
      "body": string,
    };
    type schedulingOptions = {
      .
      "time": float,
      "repeat": string,
    };
    [@bs.scope "Notifications"] [@bs.module "expo"]
    external scheduleLocalNotificationAsync :
      (localNotification, schedulingOptions) => Js.Promise.t(string) =
      "scheduleLocalNotificationAsync";
    [@bs.scope "Notifications"] [@bs.module "expo"]
    external cancelAllScheduledNotifications : unit => unit =
      "cancelAllScheduledNotificationsAsync";
    [@bs.scope "Notifications"] [@bs.module "expo"]
    external cancelAllScheduledNotificationsAsync : unit => Js.Promise.t(unit) =
      "cancelAllScheduledNotificationsAsync";
  };
  module KeepAwake = {
    [@bs.module "expo"]
    external keepAwake : ReasonReact.reactClass = "KeepAwake";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=keepAwake,
        ~props=Js.Obj.empty(),
        children,
      );
  };
  module Util = {
    [@bs.scope "Util"] [@bs.module "expo"]
    external reload : unit => unit = "reload";
  };
};

module VectorIcons = {
  module Feather = {
    [@bs.module "@expo/vector-icons"]
    external feather : ReasonReact.reactClass = "Feather";
    let make = (~name: string, ~size: int, ~color: string, children) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=feather,
        ~props={"name": name, "size": size, "color": color},
        children,
      );
  };
};

module DateTimePicker = {
  [@bs.module "react-native-modal-datetime-picker"]
  external dateTimePicker : ReasonReact.reactClass = "default";
  let make =
      (
        ~isVisible: bool=false,
        ~onConfirm: option(Js.Date.t => unit)=?,
        ~onCancel: option(unit => unit)=?,
        ~mode: option(string)=?,
        ~titleIOS: option(string)=?,
        children,
      ) =>
    ReasonReact.wrapJsForReason(
      ~reactClass=dateTimePicker,
      ~props={
        "isVisible": isVisible,
        "onConfirm": Js.Nullable.fromOption(onConfirm),
        "onCancel": Js.Nullable.fromOption(onCancel),
        "titleIOS": Js.Nullable.fromOption(titleIOS),
        "mode": Js.Nullable.fromOption(mode),
      },
      children,
    );
};

module Moment = {
  [@bs.module] external make : string => Js.t({..}) = "moment";
};

module Chroma = {
  [@bs.module "chroma-js"]
  external scale :
    Js.Array.t(string) =>
    {
      .
      [@bs.meth]
      "mode": string => {. [@bs.meth] "colors": int => Js.Array.t(string)},
    } =
    "scale";
  [@bs.module "chroma-js"]
  external make : string => {. [@bs.meth] "luminance": unit => float} =
    "default";
};

module RNTicker = {
  [@bs.module "react-native-ticker"]
  external js : ReasonReact.reactClass = "default";
  let make =
      (~text: string, ~textStyle: option(BsReactNative.Style.t)=?, children) =>
    ReasonReact.wrapJsForReason(
      ~reactClass=js,
      ~props={"text": text, "textStyle": Js.Nullable.fromOption(textStyle)},
      children,
    );
};