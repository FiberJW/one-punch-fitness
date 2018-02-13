open BsReactNative;

open Info;

module Styled = {
  module Container = {
    [@bs.module "./components/styled/Container"]
    external container : ReasonReact.reactClass = "default";
    let make =
        (
          ~contentContainerStyle,
          ~alwaysBounceVertical,
          ~showsVerticalScrollIndicator,
          children
        ) =>
      ReasonReact.wrapJsForReason(
        ~reactClass=container,
        ~props={
          "contentContainerStyle": contentContainerStyle,
          "alwaysBounceVertical":
            Js.Boolean.to_js_boolean(alwaysBounceVertical),
          "showsVerticalScrollIndicator":
            Js.Boolean.to_js_boolean(showsVerticalScrollIndicator)
        },
        children
      );
  };
  module SectionLabel = {
    [@bs.module "./components/styled/SectionLabel"]
    external sectionLabel : ReasonReact.reactClass = "default";
    let make = children =>
      ReasonReact.wrapJsForReason(
        ~reactClass=sectionLabel,
        ~props=Js.Obj.empty(),
        children
      );
  };
};

let component = ReasonReact.statelessComponent("CalendarScreen");

let make = (~screenProps, _children) => {
  ...component,
  render: _self =>
    <Styled.Container
      contentContainerStyle=Style.(style([flexGrow(1.)]))
      alwaysBounceVertical=false
      showsVerticalScrollIndicator=false>
      <WorkoutCard navigation=screenProps##rootNavigation />
      <Styled.SectionLabel>
        (ReasonReact.stringToElement("GUIDES (swipe left for more)"))
      </Styled.SectionLabel>
      <FlatList
        style=Style.(style([flexGrow(0.)]))
        horizontal=true
        pagingEnabled=true
        removeClippedSubviews=true
        data=cards
        keyExtractor=((_, i) => string_of_int(i))
        renderItem=(
          FlatList.renderItem(({item}) =>
            switch (item.url) {
            | Some(u) =>
              <InfoCard
                coverImage=item.coverImage
                title=item.title
                shortDescription=item.shortDescription
                url=u
                navigation=screenProps##rootNavigation
              />
            | None =>
              <InfoCard
                coverImage=item.coverImage
                title=item.title
                shortDescription=item.shortDescription
                content=item.content
                navigation=screenProps##rootNavigation
              />
            }
          )
        )
      />
    </Styled.Container>
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(~screenProps=jsProps##screenProps, [||])
  );
