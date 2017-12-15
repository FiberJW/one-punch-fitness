module Option = {
  open ReactNative;
  module Styled = {
    module Label = {
      [@bs.module "./styled/Option/Label"] external label : ReasonReact.reactClass = "default";
      let make = (children) =>
        ReasonReact.wrapJsForReason(~reactClass=label, ~props=Js.Obj.empty(), children);
    };
    module Base = {
      [@bs.module "./styled/Option/Base"] external base : ReasonReact.reactClass = "default";
      let make = (~last, children) =>
        ReasonReact.wrapJsForReason(
          ~reactClass=base,
          ~props={"last": Js.Boolean.to_js_boolean(last)},
          children
        );
    };
  };
  [@bs.module "Assets"] external icons : Js.t({..}) = "Icons";
  let component = ReasonReact.statelessComponent("PopupMenuOption");
  let make = (~last, ~action, _children) => {
    ...component,
    render: (_self) =>
      <TouchableOpacity activeOpacity=0.8 onPress=action##onPress>
        <Styled.Base last>
          <Styled.Label> (ReasonReact.stringToElement(action##title)) </Styled.Label>
        </Styled.Base>
      </TouchableOpacity>
  };
  let default =
    ReasonReact.wrapReasonForJs(
      ~component,
      (jsProps) => make(~last=jsProps##last, ~action=jsProps##action, [||])
    );
};

module Styled = {
  module Container = {
    [@bs.module "./styled/Container"] external container : ReasonReact.reactClass = "default";
    let make = (children) =>
      ReasonReact.wrapJsForReason(~reactClass=container, ~props=Js.Obj.empty(), children);
  };
};

let component = ReasonReact.statelessComponent("PopupMenu");

let make = (~actions, _children) => {
  ...component,
  render: (_self) =>
    <Styled.Container>
      (
        ReasonReact.arrayToElement(
          Js.Array.mapi(
            (action, i) =>
              <Option key=(string_of_int(i)) action last=(i === Js.Array.length(actions) - 1) />,
            actions
          )
        )
      )
    </Styled.Container>
};

let default =
  ReasonReact.wrapReasonForJs(~component, (jsProps) => make(~actions=jsProps##actions, [||]));