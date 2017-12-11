module Styled = {
  module HeroImage = {
    [@bs.module "./styled/HeroImage"] external heroImage : ReasonReact.reactClass = "default";
    let make = (~source, ~resizeMode, children) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=heroImage,
        ~props={"source": source, "resizeMode": resizeMode},
        children
      );
  };
  module Container = {
    [@bs.module "./styled/Container"] external container : ReasonReact.reactClass = "default";
    let make = (children) =>
      ReasonReact.wrapJsForReason(~reactClass=container, ~props=Js.Obj.empty(), children);
  };
  module TextContentContainer = {
    [@bs.module "./styled/TextContentContainer"]
    external textContentContainer : ReasonReact.reactClass =
      "default";
    let make = (children) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=textContentContainer,
        ~props=Js.Obj.empty(),
        children
      );
  };
  module Title = {
    [@bs.module "./styled/Title"] external title : ReasonReact.reactClass = "default";
    let make = (children) =>
      ReasonReact.wrapJsForReason(~reactClass=title, ~props=Js.Obj.empty(), children);
  };
  module Description = {
    [@bs.module "./styled/Description"] external description : ReasonReact.reactClass = "default";
    let make = (children) =>
      ReasonReact.wrapJsForReason(~reactClass=description, ~props=Js.Obj.empty(), children);
  };
};

[@bs.module "Assets"] external illustrations : Js.t({..}) = "Illustrations";

let component = ReasonReact.statelessComponent("InfoScreen");

let make = (_children) => {
  ...component,
  render: (_self) =>
    <Styled.Container>
      <Styled.HeroImage source=illustrations##theSecretSauce resizeMode="cover" />
      <Styled.TextContentContainer>
        <Styled.Title> (ReasonReact.stringToElement("What is Saitama's secret?")) </Styled.Title>
        <Styled.Description>
          (
            ReasonReact.stringToElement(
              "Lorem ipsum dolor sit amet, quidam corrumpit ad eam, duo graeco nostrud temporibus in. His suas veritus mentitum eu, in debet dicant vidisse sit. Oratio splendide vim ei, quaeque assentior sit ex, cibo clita ne sit. Exerci impedit no ius. Quidam regione consetetur cu vel. Vix ei dolor veniam periculis, porro luptatum an vel, ea eum blandit instructior."
            )
          )
        </Styled.Description>
      </Styled.TextContentContainer>
    </Styled.Container>
};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));