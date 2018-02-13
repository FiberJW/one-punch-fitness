open NPMBindings;

[@bs.module "Assets"] external fonts : Js.t({..}) = "Fonts";

module Styled = {
  module Container = {
    [@bs.module "./components/styled/Container"]
    external container : ReasonReact.reactClass = "default";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=container,
        ~props=Js.Obj.empty(),
        children
      );
  };
};

module MainStack = {
  [@bs.module "./navigation/MainStack"]
  external mainStack : ReasonReact.reactClass = "default";
  let make = children =>
    ReasonReact.wrapJsForReason(
      ~reactClass=mainStack,
      ~props=Js.Obj.empty(),
      children
    );
};

type state = {
  fontsLoaded: bool,
  rehydrated: bool
};

type action =
  | Rehydrated
  | FontsLoaded;

let component = ReasonReact.reducerComponent("App");

let make = _children => {
  ...component,
  initialState: () => {fontsLoaded: false, rehydrated: false},
  reducer: (action, state) =>
    switch (action) {
    | FontsLoaded => ReasonReact.Update({...state, fontsLoaded: true})
    | Rehydrated => ReasonReact.Update({...state, rehydrated: true})
    },
  didMount: self => {
    Progenitor.hydrate(Reductive.Store.dispatch(Progenitor.store), () =>
      self.send(Rehydrated)
    );
    Js.Promise.(
      Expo.Font.loadAsync(fonts)
      |> then_(() => self.send(FontsLoaded) |> resolve)
      |> ((_) => ReasonReact.NoUpdate)
    );
  },
  render: self =>
    <Styled.Container>
      (
        self.state.fontsLoaded && self.state.rehydrated ?
          <MainStack /> : <Expo.AppLoading />
      )
    </Styled.Container>
};

let default = ReasonReact.wrapReasonForJs(~component, _jsProps => make([||]));
