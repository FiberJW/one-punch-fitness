open InfoScreenStyled;

[@bs.module "Assets"] external illustrations : Js.t({..}) = "Illustrations";

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