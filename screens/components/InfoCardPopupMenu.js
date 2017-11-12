// @flow
import React from "react";
import Option from "./InfoCardPopupMenuOption";
import Container from "./styled/InfoCardPopupMenuContainer";

type Props = {
  actions: Array<Action>,
};

export type Action = {
  title: string,
  onPress: () => void,
};

export default (props: Props) => (
  <Container>
    {props.actions.map((action, i) => (
      <Option key={i} action={action} last={i === props.actions.length - 1} />
    ))}
  </Container>
);
