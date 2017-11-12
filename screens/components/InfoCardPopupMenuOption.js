// @flow
import React from "react";
import { TouchableOpacity } from "react-native";
import type { Action } from "./InfoCardPopupMenu";
import Label from "./styled/InfoCardPopupMenuOptionLabel";
import Container from "./styled/InfoCardPopupMenuOptionContainer";

type Props = { action: Action, last: boolean };

export default ({ action, last }: Props) => (
  <TouchableOpacity activeOpacity={0.8} onPress={action.onPress}>
    <Container last={last}>
      <Label>{action.title}</Label>
    </Container>
  </TouchableOpacity>
);
