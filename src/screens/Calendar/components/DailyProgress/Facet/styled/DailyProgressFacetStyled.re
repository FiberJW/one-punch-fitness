module Container = {
  [@bs.module "./Container"] external container : ReasonReact.reactClass = "default";
  let make = (~parentContainerWidth, children) =>
    ReasonReact.wrapJsForReason(
      ~reactClass=container,
      ~props={"parentContainerWidth": parentContainerWidth},
      children
    );
};

module BarContainer = {
  [@bs.module "./BarContainer"] external barContainer : ReasonReact.reactClass = "default";
  let make = (children) =>
    ReasonReact.wrapJsForReason(~reactClass=barContainer, ~props=Js.Obj.empty(), children);
};