module Container = {
  [@bs.module "./Container"] external container : ReasonReact.reactClass = "default";
  let make = (children) =>
    ReasonReact.wrapJsForReason(~reactClass=container, ~props=Js.Obj.empty(), children);
};

module Title = {
  [@bs.module "./Title"] external title : ReasonReact.reactClass = "default";
  let make = (children) =>
    ReasonReact.wrapJsForReason(~reactClass=title, ~props=Js.Obj.empty(), children);
};