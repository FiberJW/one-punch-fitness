open NPMBindings.Expo;

[@bs.module "Assets"] external fonts : Js.t({..}) = "Fonts";

module Styled = {
  module Container = {
    [@bs.module "./components/styled/Container"] external container : ReasonReact.reactClass =
      "default";
    let make = (children) =>
      ReasonReact.wrapJsForReason(~reactClass=container, ~props=Js.Obj.empty(), children);
  };
};

module MainStack = {
  [@bs.module "./navigation/MainStack"] external mainStack : ReasonReact.reactClass = "default";
  let make = (children) =>
    ReasonReact.wrapJsForReason(~reactClass=mainStack, ~props=Js.Obj.empty(), children);
};

type state = {fontsLoaded: bool};

type action =
  | FontsLoaded;

let component = ReasonReact.reducerComponent("App");

let make = (_children) => {
  ...component,
  initialState: () => {fontsLoaded: false},
  reducer: (action, _state) =>
    switch action {
    | FontsLoaded => ReasonReact.Update({fontsLoaded: true})
    },
  didMount: (self) =>
    Js.Promise.(
      Font.loadAsync(fonts)
      |> then_(() => self.reduce(() => FontsLoaded, ()) |> resolve)
      |> ((_) => ReasonReact.NoUpdate)
    ),
  render: (self) =>
    <Styled.Container>
      (self.state.fontsLoaded ? <MainStack /> : <AppLoading />)
    </Styled.Container>
};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));