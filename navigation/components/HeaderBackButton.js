// @flow
import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import Container from "./styled/HeaderBackContainer";
import Icon from "./styled/HeaderBackIcon";

type Props = {
  navigation: {
    goBack: () => void,
  },
};

export default (props: Props) => (
  <TouchableOpacity onPress={() => props.navigation.goBack()}>
    <Container>
      <Icon
        resizeMode="contain"
        source={require("../../assets/images/icon-chevron-left.png")}
      />
    </Container>
  </TouchableOpacity>
);

export const PlaceHolder = styled.View`
  height: 24px;
  width: 24px;
  margin-right: 16px;
`;
