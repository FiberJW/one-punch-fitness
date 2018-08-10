open BsReactNative;

open NPMBindings;

module Styled = {
  module Container = {
    [@bs.module "./styled/Container"]
    external container : ReasonReact.reactClass = "default";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=container,
        ~props=Js.Obj.empty(),
        children,
      );
  };
};

module Switch = {
  module Styled = {
    module Container = {
      [@bs.module "./styled/Switch/Container"]
      external container : ReasonReact.reactClass = "default";
      let make = children =>
        ReasonReact.wrapJsForReason(
          ~reactClass=container,
          ~props=Js.Obj.empty(),
          children,
        );
    };
    module Knob = {
      [@bs.module "./styled/Switch/Knob"]
      external knob : ReasonReact.reactClass = "default";
      let make = (~on: bool=false, children) =>
        ReasonReact.wrapJsForReason(
          ~reactClass=knob,
          ~props={"on": on},
          children,
        );
    };
  };
  let component = ReasonReact.statelessComponent("Switch");
  let make = (~value, _children) => {
    ...component,
    render: _self =>
      <Styled.Container> <Styled.Knob on=value /> </Styled.Container>,
  };
};

module Option = {
  module Styled = {
    module Container = {
      [@bs.module "./styled/Option/Container"]
      external container : ReasonReact.reactClass = "default";
      let make = (~tint, children) =>
        ReasonReact.wrapJsForReason(
          ~reactClass=container,
          ~props={"tint": tint},
          children,
        );
    };
    module Label = {
      [@bs.module "./styled/Option/Label"]
      external label : ReasonReact.reactClass = "default";
      let make = children =>
        ReasonReact.wrapJsForReason(
          ~reactClass=label,
          ~props=Js.Obj.empty(),
          children,
        );
    };
    module Text = {
      [@bs.module "./styled/Option/Text"]
      external text : ReasonReact.reactClass = "default";
      let make = children =>
        ReasonReact.wrapJsForReason(
          ~reactClass=text,
          ~props=Js.Obj.empty(),
          children,
        );
    };
  };
  let component = ReasonReact.statelessComponent("Option");
  let make = (~tint, ~label, ~onPress, ~render, _children) => {
    ...component,
    render: _self =>
      <TouchableOpacity onPress activeOpacity=0.95>
        <Styled.Container tint>
          <Styled.Label> (ReasonReact.string(label)) </Styled.Label>
          (render())
        </Styled.Container>
      </TouchableOpacity>,
  };
};

type state = {
  remindersActive: bool,
  reminderTime: string,
  timeSet: bool,
  datePickerVisible: bool,
};

type action =
  | Rehydrate(state)
  | ToggleReminders
  | SetTime(string)
  | UnsetNotification
  | ToggleDatePicker;

let persist = state => {
  let stateAsJson =
    Json.Encode.(
      object_([
        ("remindersActive", Js.Json.boolean(state.remindersActive)),
        ("datePickerVisible", Js.Json.boolean(state.datePickerVisible)),
        ("timeSet", Js.Json.boolean(state.timeSet)),
        ("reminderTime", Js.Json.string(state.reminderTime)),
      ])
      |> Js.Json.stringify
    );
  AsyncStorage.setItem(
    "settings",
    stateAsJson,
    ~callback=
      e =>
        switch (e) {
        | None => ()
        | Some(err) => Js.log(err)
        },
    (),
  )
  |> ignore;
};

let hydrate = self => {
  Js.Promise.(
    AsyncStorage.getItem("settings", ())
    |> then_(json =>
         (
           switch (json) {
           | None => ()
           | Some(s) =>
             let parsedJson = Js.Json.parseExn(s);
             let state =
               Json.Decode.{
                 remindersActive:
                   parsedJson |> field("remindersActive", bool),
                 reminderTime: parsedJson |> field("reminderTime", string),
                 datePickerVisible:
                   parsedJson |> field("datePickerVisible", bool),
                 timeSet: parsedJson |> field("timeSet", bool),
               };
             self.ReasonReact.send(Rehydrate(state));
             ();
           }
         )
         |> resolve
       )
    |> ignore
  );
  ReasonReact.NoUpdate;
};

let cancelNotifications = (self, callback) =>
  Platform.(
    switch (os()) {
    | IOS(_) =>
      Expo.Notifications.cancelAllScheduledNotifications() |> ignore;
      self.ReasonReact.send(UnsetNotification);
      callback();
    | Android =>
      Js.Promise.(
        Expo.Notifications.cancelAllScheduledNotificationsAsync()
        |> then_(() =>
             {
               self.ReasonReact.send(UnsetNotification);
               callback();
             }
             |> resolve
           )
        |> ignore
      )
    }
  );

let component = ReasonReact.reducerComponent("SettingsScreen");

let make = _children => {
  ...component,
  initialState: () => {
    remindersActive: false,
    datePickerVisible: false,
    reminderTime: Js.Date.toUTCString(Js.Date.make()),
    timeSet: false,
  },
  reducer: (action, state) =>
    switch (action) {
    | ToggleReminders =>
      ReasonReact.Update({...state, remindersActive: ! state.remindersActive})
    | Rehydrate(s) => ReasonReact.Update(s)
    | UnsetNotification => ReasonReact.Update({...state, timeSet: false})
    | ToggleDatePicker =>
      ReasonReact.Update({
        ...state,
        datePickerVisible: ! state.datePickerVisible,
      })
    | SetTime(datestring) =>
      ReasonReact.Update({
        ...state,
        datePickerVisible: ! state.datePickerVisible,
        reminderTime: datestring,
        timeSet: true,
      })
    },
  didUpdate: ({newSelf}) => persist(newSelf.state),
  didMount: self => hydrate(self) |> ignore,
  render: self =>
    <Styled.Container>
      <Option
        tint=(self.state.remindersActive ? Colors.start : Colors.disabled)
        label="reminders"
        onPress=(
          () =>
            if (self.state.remindersActive) {
              cancelNotifications(self, () => self.send(ToggleReminders));
            } else {
              Js.Promise.(
                Expo.Permissions.ask(Expo.Permissions.notifications)
                |> then_(res =>
                     (
                       if (res##status === "granted") {
                         self.send(ToggleReminders);
                       } else {
                         Alert.alert(
                           ~title=
                             "Hey! If you want to remember to change yourself everyday, enable notifications!",
                           (),
                         );
                       }
                     )
                     |> resolve
                   )
                |> ignore
              );
            }
        )
        render=(() => <Switch value=self.state.remindersActive />)
      />
      (
        self.state.remindersActive ?
          <Option
            tint=(self.state.timeSet ? Colors.status : Colors.disabled)
            label="reminder time"
            onPress=(() => self.send(ToggleDatePicker))
            render=(
              () =>
                <Option.Styled.Text>
                  (
                    ReasonReact.string(
                      Moment.make(self.state.reminderTime)##format("h:mmA"),
                    )
                  )
                </Option.Styled.Text>
            )
          /> :
          ReasonReact.null
      )
      <Option
        tint=Colors.bRED
        label="clear workout data"
        onPress=(
          () =>
            Alert.alert(
              ~title="Are you sure?",
              ~message=
                "Removing your data destroys any progress you were storing in this app.",
              ~buttons=[
                {text: Some("cancel"), onPress: None, style: Some(`cancel)},
                {
                  text: Some("OK"),
                  onPress:
                    Some(
                      () => {
                        AsyncStorage.clear() |> ignore;
                        Expo.Util.reload();
                      },
                    ),
                  style: Some(`destructive),
                },
              ],
              ~options={cancelable: Some(true), onDismiss: None},
              (),
            )
        )
        render=(() => ReasonReact.null)
      />
      <DateTimePicker
        mode="time"
        titleIOS="Pick a time for your workout reminder"
        onConfirm=(
          d =>
            cancelNotifications(self, () =>
              Js.Promise.(
                Expo.Notifications.scheduleLocalNotificationAsync(
                  {"title": "One Punch Fitness", "body": "move forward."},
                  {
                    "time":
                      Js.Date.getTime(
                        Moment.make(Js.Date.toUTCString(d))##toDate(),
                      )
                      < Js.Date.now() ?
                        Js.Date.getTime(
                          Moment.make(Js.Date.toUTCString(d))##add(
                            1,
                            "days",
                          )##toDate(),
                        ) :
                        Js.Date.getTime(
                          Moment.make(Js.Date.toUTCString(d))##toDate(),
                        ),
                    "repeat": "day",
                  },
                )
                |> then_(_localNotificationId =>
                     self.send(SetTime(Js.Date.toUTCString(d))) |> resolve
                   )
                |> ignore
              )
            )
        )
        onCancel=(() => self.send(ToggleDatePicker))
        isVisible=self.state.datePickerVisible
      />
    </Styled.Container>,
};

let default = ReasonReact.wrapReasonForJs(~component, _jsProps => make([||]));