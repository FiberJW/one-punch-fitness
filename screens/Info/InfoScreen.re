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
        <Description>
          (
            ReasonReact.stringToElement(
              "Lorem ipsum dolor sit amet, quidam corrumpit ad eam, duo graeco nostrud temporibus in. His suas veritus mentitum eu, in debet dicant vidisse sit. Oratio splendide vim ei, quaeque assentior sit ex, cibo clita ne sit. Exerci impedit no ius. Quidam regione consetetur cu vel. Vix ei dolor veniam periculis, porro luptatum an vel, ea eum blandit instructior."
            )
          )
        </Description>
      </TextContentContainer>
    </Container>
};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));