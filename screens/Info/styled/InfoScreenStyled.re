module HeroImage = {
  [@bs.module "./HeroImage"] external heroImage : ReasonReact.reactClass = "default";
  let make = (~source, ~resizeMode, children) =>
    ReasonReact.wrapJsForReason(
      ~reactClass=heroImage,
      ~props={"source": source, "resizeMode": resizeMode},
      children
    );
};

module Container = {
  [@bs.module "./Container"] external container : ReasonReact.reactClass = "default";
  let make = (children) =>
    ReasonReact.wrapJsForReason(~reactClass=container, ~props=Js.Obj.empty(), children);
};

module TextContentContainer = {
  [@bs.module "./TextContentContainer"] external textContentContainer : ReasonReact.reactClass =
    "default";
  let make = (children) =>
    ReasonReact.wrapJsForReason(~reactClass=textContentContainer, ~props=Js.Obj.empty(), children);
};

module Title = {
  [@bs.module "./Title"] external title : ReasonReact.reactClass = "default";
  let make = (children) =>
    ReasonReact.wrapJsForReason(~reactClass=title, ~props=Js.Obj.empty(), children);
};

module Description = {
  [@bs.module "./Description"] external description : ReasonReact.reactClass = "default";
  let make = (children) =>
    ReasonReact.wrapJsForReason(~reactClass=description, ~props=Js.Obj.empty(), children);
};