import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import Container from "./styled/Container";

export default props => (
  <TouchableOpacity onPress={() => props.navigation.pop()}>
    <Container>
      <Feather name="chevron-left" color="white" size={16} />
    </Container>
  </TouchableOpacity>
);

export const PlaceHolder = styled.View`
  height: 24px;
  width: 24px;
  margin-right: 16px;
`;
