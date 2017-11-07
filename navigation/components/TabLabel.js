import React from "react";
import { TouchableOpacity } from "react-native";
import TabLabelContainer from "./styled/TabLabelContainer";
import TabLabelText from "./styled/TabLabelText";

export default ({ focused, text, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <TabLabelContainer focused={focused}>
      <TabLabelText focused={focused}>{text.toLowerCase()}</TabLabelText>
    </TabLabelContainer>
  </TouchableOpacity>
);
