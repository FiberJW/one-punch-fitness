open BsReactNative;

module Styled = {
  module HeroImage = {
    [@bs.module "./styled/HeroImage"]
    external heroImage: ReasonReact.reactClass = "default";
    let make = (~source, ~resizeMode, children) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=heroImage,
        ~props={"source": source, "resizeMode": resizeMode},
        children,
      );
  };
  module Container = {
    [@bs.module "./styled/Container"]
    external container: ReasonReact.reactClass = "default";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=container,
        ~props=Js.Obj.empty(),
        children,
      );
  };
  module TextContentContainer = {
    [@bs.module "./styled/TextContentContainer"]
    external textContentContainer: ReasonReact.reactClass = "default";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=textContentContainer,
        ~props=Js.Obj.empty(),
        children,
      );
  };
  module Title = {
    [@bs.module "./styled/Title"]
    external title: ReasonReact.reactClass = "default";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=title,
        ~props=Js.Obj.empty(),
        children,
      );
  };
  module Description = {
    [@bs.module "./styled/Description"]
    external description: ReasonReact.reactClass = "default";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=description,
        ~props=Js.Obj.empty(),
        children,
      );
  };
};

[@bs.module "../../../assets/index.js"]
external illustrations: Js.t({..}) = "Illustrations";

let component = ReasonReact.statelessComponent("InfoScreen");

let make = (~navigation, _children) => {
  ...component,
  render: _self =>
    switch (navigation##state##params##url) {
    | Some(url) =>
      <WebView
        source=(WebView.sourceUri(~uri=url, ()))
        startInLoadingState=true
      />
    | None =>
      <Styled.Container>
        <Styled.HeroImage
          source=navigation##state##params##coverImage
          resizeMode="cover"
        />
        <Styled.TextContentContainer>
          <Styled.Title>
            (ReasonReact.string(navigation##state##params##title))
          </Styled.Title>
          <Styled.Description>
            (ReasonReact.string(navigation##state##params##content))
          </Styled.Description>
        </Styled.TextContentContainer>
      </Styled.Container>
    },
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(~navigation=jsProps##navigation, [||])
  );