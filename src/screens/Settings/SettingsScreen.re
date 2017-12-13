open ReactNative;

[@bs.module "colors"] external colors : Js.t({..}) = "default";

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
  let make = (~tint, ~label, ~onPress, ~render, children) => {
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

type state = {remindersActive: bool};

type action =
  | ToggleReminders;

let component = ReasonReact.reducerComponent("SettingsScreen");

let make = (_children) => {
  ...component,
  initialState: () => {remindersActive: false},
  reducer: (action, state) =>
    switch action {
    | ToggleReminders => ReasonReact.Update({remindersActive: ! state.remindersActive})
    },
  render: (self) =>
    <Styled.Container>
      <Option
        tint=(self.state.remindersActive ? colors##start : colors##disabled)
        label="reminders"
        onPress=(self.reduce(() => ToggleReminders))
        render=(() => <Switch value=self.state.remindersActive />)
      />
      <Option
        tint=colors##status
        label="reminder time"
        onPress=(() => ())
        render=(
          () => <Option.Styled.Text> (ReasonReact.stringToElement("12:05pm")) </Option.Styled.Text>
        )
      />
    </Styled.Container>
};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));