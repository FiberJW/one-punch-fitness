module Styled = {
  module Container = {
    [@bs.module "./styled/Container"]
    external container : ReasonReact.reactClass = "default";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=container,
        ~props=Js.Obj.empty(),
        children
      );
  };
  module Amount = {
    [@bs.module "./styled/Amount"]
    external amount : ReasonReact.reactClass = "default";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=amount,
        ~props=Js.Obj.empty(),
        children
      );
  };
  module Name = {
    [@bs.module "./styled/Name"]
    external name : ReasonReact.reactClass = "default";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=name,
        ~props=Js.Obj.empty(),
        children
      );
  };
};

let component = ReasonReact.statelessComponent("RoutineFacet");

let make =
    (~name, ~sets=0, ~reps=0, ~distance=0, ~units="km", ~amount=0, _children) => {
  ...component,
  render: _self =>
    <Styled.Container>
      (
        switch name {
        | "run" =>
          <Styled.Amount>
            (ReasonReact.stringToElement(string_of_int(distance) ++ units))
          </Styled.Amount>
        | "rest"
        | "transition" =>
          <Styled.Amount>
            (ReasonReact.stringToElement(string_of_int(amount) ++ units))
          </Styled.Amount>
        | _ =>
          <Styled.Amount>
            (
              ReasonReact.stringToElement(
                string_of_int(sets) ++ "x" ++ string_of_int(reps)
              )
            )
          </Styled.Amount>
        }
      )
      <Styled.Name> (ReasonReact.stringToElement(" " ++ name)) </Styled.Name>
    </Styled.Container>
};
