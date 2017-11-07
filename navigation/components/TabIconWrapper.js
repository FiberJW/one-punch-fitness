import React from "react";
import { TouchableOpacity } from "react-native";
import TabIconContainer from "./styled/TabIconContainer";

export default ({ focused, icon, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <TabIconContainer focused={focused}>{icon}</TabIconContainer>
  </TouchableOpacity>
);
