// @flow
import React from "react";
import { TouchableOpacity } from "react-native";
import TabLabelContainer from "./styled/TabLabelContainer";
import TabLabelText from "./styled/TabLabelText";

type Props = {
  focused: boolean,
  text: string,
  onPress?: () => void,
  disabled?: boolean,
};

export default ({ focused, text, onPress, disabled }: Props) => (
  <TouchableOpacity onPress={onPress} disabled={disabled}>
    <TabLabelContainer focused={focused}>
      <TabLabelText focused={focused}>{text.toLowerCase()}</TabLabelText>
    </TabLabelContainer>
  </TouchableOpacity>
);
