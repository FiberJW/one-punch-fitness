[@bs.module "colors"] external colors : Js.t({..}) = "default";

[@bs.module "Assets"] external illustrations : Js.t({..}) = "Illustrations";

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
    ReasonReact.wrapJsForReason(~reactClass=textContentContainer, ~props=Js.Obj.empty(), children);
};

module Title = {
  [@bs.module "./styled/Title"] external title : ReasonReact.reactClass = "default";
  let make = (children) =>
    ReasonReact.wrapJsForReason(~reactClass=title, ~props=Js.Obj.empty(), children);
};

let component = ReasonReact.statelessComponent("InfoScreen");

let make = (_children) => {
  ...component,
  render: (_self) =>
    <Container>
      <HeroImage source=illustrations##theSecretSauce resizeMode="cover" />
      <TextContentContainer>
        <Title> (ReasonReact.stringToElement("What is Saitama's secret?")) </Title>
      </TextContentContainer>
    </Container>
};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));