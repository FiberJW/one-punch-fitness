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