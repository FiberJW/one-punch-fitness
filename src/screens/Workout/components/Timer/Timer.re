open BsReactNative;

open NPMBindings;

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
  module Time = {
    [@bs.module "./styled/Time"]
    external time : ReasonReact.reactClass = "default";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=time,
        ~props=Js.Obj.empty(),
        children
      );
  };
};

let component = ReasonReact.statelessComponent("Timer");

let make = (~time, _children) => {
  ...component,
  render: _self =>
    <Styled.Container>
      <RNTicker
        text=(string_of_int(time))
        textStyle=Style.(
                    style([
                      fontFamily("InterReg"),
                      backgroundColor("transparent"),
                      fontSize(Float(64.)),
                      color(Colors.spotiBlack),
                      textAlign(Center)
                    ])
                  )
      />
    </Styled.Container>
};