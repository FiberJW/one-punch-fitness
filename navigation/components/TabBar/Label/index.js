// @flow
import React from "react";
import { TouchableOpacity } from "react-native";
import Container from "./styled/Container";
import Text from "./styled/Text";

type Props = {
  focused: boolean,
  text: string,
  onPress?: () => void,
  disabled?: boolean,
};

export default ({ focused, text, onPress, disabled }: Props) => (
  <TouchableOpacity onPress={onPress} disabled={disabled}>
    <Container focused={focused}>
      <Text focused={focused}>{text.toLowerCase()}</Text>
    </Container>
  </TouchableOpacity>
);
