// @flow
import React from "react";
import type { Node } from "react";
import { TouchableOpacity } from "react-native";
import TabIconContainer from "./styled/TabIconContainer";

type Props = {
  focused: boolean,
  icon: Node,
  onPress: () => void,
};

export default ({ focused, icon, onPress }: Props) => (
  <TouchableOpacity onPress={onPress}>
    <TabIconContainer focused={focused}>{icon}</TabIconContainer>
  </TouchableOpacity>
);
