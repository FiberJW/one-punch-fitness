// @flow
import React from "react";
import type { Node } from "react";
import { TouchableOpacity } from "react-native";
import Container from "./styled/Container";

type Props = {
  focused: boolean,
  icon: Node,
  onPress: () => void,
};

export default ({ focused, icon, onPress }: Props) => (
  <TouchableOpacity onPress={onPress}>
    <Container focused={focused}>{icon}</Container>
  </TouchableOpacity>
);
