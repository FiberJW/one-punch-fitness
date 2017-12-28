import React from "react";
import { TouchableOpacity } from "react-native";
import Container from "./styled/Container";
import Text from "./styled/Text";

export default ({ focused, text, onPress, disabled }) => (
  <TouchableOpacity onPress={onPress} disabled={disabled}>
    <Container focused={focused}>
      <Text focused={focused}>{text.toLowerCase()}</Text>
    </Container>
  </TouchableOpacity>
);
