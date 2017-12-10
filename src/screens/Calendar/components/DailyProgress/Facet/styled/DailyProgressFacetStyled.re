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
  let make = (~onLayout=?, children) =>
    ReasonReact.wrapJsForReason(
      ~reactClass=barContainer,
      ~props={"onLayout": Js.Nullable.from_opt(onLayout)},
      children
    );
}; 


module Bar = {
  [@bs.module "./Bar"] external bar : ReasonReact.reactClass = "default";
  let make = (~width, children) =>
    ReasonReact.wrapJsForReason(
      ~reactClass=bar,
      ~props={"width": width},
      children
    );
};

module Title = {
  [@bs.module "./Title"] external title : ReasonReact.reactClass = "default";
  let make = ( children) =>
    ReasonReact.wrapJsForReason(
      ~reactClass=title,
      ~props=Js.Obj.empty(),
      children
    );
}; 

module Amount = {
  [@bs.module "./Amount"] external amount : ReasonReact.reactClass = "default";
  let make = ( children) =>
    ReasonReact.wrapJsForReason(
      ~reactClass=amount,
      ~props=Js.Obj.empty(),
      children
    );
}; 