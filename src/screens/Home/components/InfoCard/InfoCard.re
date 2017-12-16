open BsReactNative;

open NPMBindings;

module Styled = {
  module Container = {
    [@bs.module "./styled/Container"] external container : ReasonReact.reactClass = "default";
    let make = (children) =>
      ReasonReact.wrapJsForReason(~reactClass=container, ~props=Js.Obj.empty(), children);
  };
  module Description = {
    [@bs.module "./styled/Description"] external description : ReasonReact.reactClass = "default";
    let make = (children) =>
      ReasonReact.wrapJsForReason(~reactClass=description, ~props=Js.Obj.empty(), children);
  };
  module CoverImage = {
    [@bs.module "./styled/CoverImage"] external coverImage : ReasonReact.reactClass = "default";
    let make = (~source=?, ~resizeMode=?, children) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=coverImage,
        ~props={
          "source": Js.Nullable.from_opt(source),
          "resizeMode": Js.Nullable.from_opt(resizeMode)
        },
        children
      );
  };
  module ImageGradient = {
    [@bs.module "./styled/ImageGradient"] external imageGradient : ReasonReact.reactClass =
      "default";
    let make = (~colors, children) =>
      ReasonReact.wrapJsForReason(~reactClass=imageGradient, ~props={"colors": colors}, children);
  };
  module Title = {
    [@bs.module "./styled/Title"] external title : ReasonReact.reactClass = "default";
    let make = (children) =>
      ReasonReact.wrapJsForReason(~reactClass=title, ~props=Js.Obj.empty(), children);
  };
  module ButtonTouchable = {
    [@bs.module "./styled/ButtonTouchable"] external buttonTouchable : ReasonReact.reactClass =
      "default";
    let make = (~onPress, ~activeOpacity, ~disabled, children) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=buttonTouchable,
        ~props={
          "onPress": onPress,
          "activeOpacity": activeOpacity,
          "disabled": Js.Boolean.to_js_boolean(disabled)
        },
        children
      );
  };
};

[@bs.module "Assets"] external illustrations : Js.t({..}) = "Illustrations";

type state = {
  menuOpen: bool,
  popupAnimatedViewRef: ref(option(ReasonReact.reactRef))
};

type action =
  | ToggleMenu;

let setPopupAnimatedViewRef = (theRef, {ReasonReact.state}) =>
  state.popupAnimatedViewRef := Js.Nullable.to_opt(theRef);

let component = ReasonReact.reducerComponent("InfoCard");

let make = (~navigation, ~title, ~description, _children) => {
  ...component,
  initialState: () => {menuOpen: false, popupAnimatedViewRef: ref(None)},
  reducer: (action, state) =>
    switch action {
    | ToggleMenu => ReasonReact.Update({...state, menuOpen: ! state.menuOpen})
    },
  render: (self) =>
    <TouchableOpacity
      activeOpacity=(self.state.menuOpen ? 1. : 0.9)
      onPress=(
        self.state.menuOpen ?
          () =>
            switch self.state.popupAnimatedViewRef^ {
            | Some(r) =>
              let ref = ReasonReact.refToJsObj(r);
              Js.Promise.(
                ref##slideOutRight(80)
                |> then_(
                     () =>
                       {
                         self.reduce(() => ToggleMenu, ());
                         ref##slideInDown(150)
                       }
                       |> resolve
                   )
                |> ignore
              )
            | None => ()
            } :
          (() => navigation##navigate("Info"))
      )>
      <Styled.Container>
        <View>
          <Styled.CoverImage source=illustrations##theSecretSauce resizeMode="cover" />
          <Styled.ImageGradient colors=[|"rgba(0,0,0,0)", Colors.spotiBlack|] />
          <Styled.ButtonTouchable
            activeOpacity=(self.state.menuOpen ? 1. : 0.8)
            disabled=self.state.menuOpen
            onPress=(
              () =>
                switch self.state.popupAnimatedViewRef^ {
                | Some(r) =>
                  let ref = ReasonReact.refToJsObj(r);
                  Js.Promise.(
                    ref##slideOutUp(150)
                    |> then_(
                         () =>
                           {
                             self.reduce(() => ToggleMenu, ());
                             ref##slideInRight(150)
                           }
                           |> resolve
                       )
                    |> ignore
                  )
                | None => ()
                }
            )>
            <RNAnimatable.View ref=(self.handle(setPopupAnimatedViewRef)) easing="ease-out">
              (
                self.state.menuOpen ?
                  <PopupMenu
                    actions=[|
                      {"title": "archive card", "onPress": () => Js.log("deleting this infocard")}
                    |]
                  /> :
                  <OverflowButton />
              )
            </RNAnimatable.View>
          </Styled.ButtonTouchable>
          <Styled.Title> title </Styled.Title>
        </View>
        <Styled.Description> description </Styled.Description>
      </Styled.Container>
    </TouchableOpacity>
};

let default =
  ReasonReact.wrapReasonForJs(
    ~component,
    (jsProps) =>
      make(
        ~navigation=jsProps##navigation,
        ~title=jsProps##title,
        ~description=jsProps##description,
        [||]
      )
  );