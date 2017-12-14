open ReactNative;

open NPMBindings;

module Styled = {
  module Container = {
    [@bs.module "./styled/Container"] external container : ReasonReact.reactClass = "default";
    let make = (children) =>
      ReasonReact.wrapJsForReason(~reactClass=container, ~props=Js.Obj.empty(), children);
  };
};

module Switch = {
  module Styled = {
    module Container = {
      [@bs.module "./styled/Switch/Container"] external container : ReasonReact.reactClass =
        "default";
      let make = (children) =>
        ReasonReact.wrapJsForReason(~reactClass=container, ~props=Js.Obj.empty(), children);
    };
    module Knob = {
      [@bs.module "./styled/Switch/Knob"] external knob : ReasonReact.reactClass = "default";
      let make = (~on: bool=false, children) =>
        ReasonReact.wrapJsForReason(~reactClass=knob, ~props={"on": on}, children);
    };
  };
  let component = ReasonReact.statelessComponent("Switch");
  let make = (~value, _children) => {
    ...component,
    render: (_self) => <Styled.Container> <Styled.Knob on=value /> </Styled.Container>
  };
};

module Option = {
  module Styled = {
    module Container = {
      [@bs.module "./styled/Option/Container"] external container : ReasonReact.reactClass =
        "default";
      let make = (~tint, children) =>
        ReasonReact.wrapJsForReason(~reactClass=container, ~props={"tint": tint}, children);
    };
    module Label = {
      [@bs.module "./styled/Option/Label"] external label : ReasonReact.reactClass = "default";
      let make = (children) =>
        ReasonReact.wrapJsForReason(~reactClass=label, ~props=Js.Obj.empty(), children);
    };
    module Text = {
      [@bs.module "./styled/Option/Text"] external text : ReasonReact.reactClass = "default";
      let make = (children) =>
        ReasonReact.wrapJsForReason(~reactClass=text, ~props=Js.Obj.empty(), children);
    };
  };
  let component = ReasonReact.statelessComponent("Option");
  let make = (~tint, ~label, ~onPress, ~render, _children) => {
    ...component,
    render: (_self) =>
      <TouchableOpacity onPress activeOpacity=0.95>
        <Styled.Container tint>
          <Styled.Label> (ReasonReact.stringToElement(label)) </Styled.Label>
          (render())
        </Styled.Container>
      </TouchableOpacity>
  };
};

type state = {
  remindersActive: bool,
  reminderTime: string,
  datePickerVisible: bool
};

type action =
  | ToggleReminders
  | SetTime(string)
  | ToggleDatePicker;

let component = ReasonReact.reducerComponent("SettingsScreen");

let make = (_children) => {
  ...component,
  initialState: () => {
    remindersActive: false,
    datePickerVisible: false,
    reminderTime: Js.Date.toUTCString(Js.Date.make())
  },
  reducer: (action, state) =>
    switch action {
    | ToggleReminders => ReasonReact.Update({...state, remindersActive: ! state.remindersActive})
    | ToggleDatePicker =>
      ReasonReact.Update({...state, datePickerVisible: ! state.datePickerVisible})
    | SetTime(datestring) =>
      ReasonReact.Update({
        ...state,
        datePickerVisible: ! state.datePickerVisible,
        reminderTime: datestring
      })
    },
  render: (self) =>
    <Styled.Container>
      <Option
        tint=(self.state.remindersActive ? Colors.start : Colors.disabled)
        label="reminders"
        onPress=(self.reduce(() => ToggleReminders))
        render=(() => <Switch value=self.state.remindersActive />)
      />
      (
        self.state.remindersActive ?
          <Option
            tint=Colors.status
            label="reminder time"
            onPress=(self.reduce(() => ToggleDatePicker))
            render=(
              () =>
                <Option.Styled.Text>
                  (
                    ReasonReact.stringToElement(
                      Moment.make(self.state.reminderTime)##format("h:mmA")
                    )
                  )
                </Option.Styled.Text>
            )
          /> :
          ReasonReact.nullElement
      )
      <DateTimePicker
        mode="time"
        titleIOS="Pick a time for your workout reminder"
        onConfirm=(
          (d) =>
            self.reduce(
              () => {
                Js.log(d);
                SetTime(Js.Date.toUTCString(d))
              },
              ()
            )
        )
        onCancel=(self.reduce(() => ToggleDatePicker))
        isVisible=self.state.datePickerVisible
      />
    </Styled.Container>
};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));