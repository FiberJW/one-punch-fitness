open ReactNative;

let component = ReasonReact.statelessComponent("SettingsScreen");

let make = (_children) => {
  ...component,
  render: (_self) => <View style=Style.(style([flex(1.)])) />
};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));