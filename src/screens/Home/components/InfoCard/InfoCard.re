open BsReactNative;

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
};

[@bs.module "Assets"] external illustrations : Js.t({..}) = "Illustrations";

let component = ReasonReact.statelessComponent("InfoCard");

let make = (~navigation, ~title, ~shortDescription, ~content, _children) => {
  ...component,
  render: (_self) =>
    <TouchableOpacity
      activeOpacity=0.9
      onPress=(() => navigation##navigate("Info", {"title": title, "content": content}))>
      <Styled.Container>
        <View>
          <Styled.CoverImage source=illustrations##theSecretSauce resizeMode="cover" />
          <Styled.ImageGradient colors=[|"rgba(0,0,0,0)", Colors.spotiBlack|] />
          <Styled.Title> title </Styled.Title>
        </View>
        <Styled.Description> shortDescription </Styled.Description>
      </Styled.Container>
    </TouchableOpacity>
};