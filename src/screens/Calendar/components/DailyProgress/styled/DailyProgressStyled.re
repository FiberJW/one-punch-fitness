module Container = {
  [@bs.module "./Container"] external container : ReasonReact.reactClass = "default";
  let make = (~onLayout=?, children) =>
    ReasonReact.wrapJsForReason(
      ~reactClass=container,
      ~props={"onLayout": Js.Nullable.from_opt(onLayout)},
      children
    );
};

module Title = {
  [@bs.module "./Title"] external title : ReasonReact.reactClass = "default";
  let make = (children) =>
    ReasonReact.wrapJsForReason(~reactClass=title, ~props=Js.Obj.empty(), children);
};

module Status = {
  [@bs.module "./Status"] external status : ReasonReact.reactClass = "default";
  let make = (children) =>
    ReasonReact.wrapJsForReason(~reactClass=status, ~props=Js.Obj.empty(), children);
};

module Stats = {
  module Container = {
    [@bs.module "./Stats/Container"] external container : ReasonReact.reactClass = "default";
    let make = (~parentContainerWidth, children) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=container,
        ~props={"parentContainerWidth": parentContainerWidth},
        children
      );
  };
  module Column = {
    [@bs.module "./Stats/Column"] external column : ReasonReact.reactClass = "default";
    let make = (~center=?, children) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=column,
        ~props={"center": Js.Nullable.from_opt(center)},
        children
      );
  };
  module BarContainer = {
    [@bs.module "./Stats/BarContainer"] external barContainer : ReasonReact.reactClass = "default";
    let make = (~onLayout=?, children) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=barContainer,
        ~props={"onLayout": Js.Nullable.from_opt(onLayout)},
        children
      );
  };
  module Bar = {
    [@bs.module "./Stats/Bar"] external bar : ReasonReact.reactClass = "default";
    let make = (~width, children) =>
      ReasonReact.wrapJsForReason(~reactClass=bar, ~props={"width": width}, children);
  };
  module Title = {
    [@bs.module "./Stats/Title"] external title : ReasonReact.reactClass = "default";
    let make = (children) =>
      ReasonReact.wrapJsForReason(~reactClass=title, ~props=Js.Obj.empty(), children);
  };
  module Amount = {
    [@bs.module "./Stats/Amount"] external amount : ReasonReact.reactClass = "default";
    let make = (children) =>
      ReasonReact.wrapJsForReason(~reactClass=amount, ~props=Js.Obj.empty(), children);
  };
};