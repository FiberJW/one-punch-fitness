// @flow
import React from "react";
import Option from "./Option/PopupMenuOption.bs";
import Container from "./styled/Container";

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
