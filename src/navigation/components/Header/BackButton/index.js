// @flow
import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Icons } from "Assets";
import Container from "./styled/Container";
import Icon from "./styled/Icon";

type Props = {
  navigation: {
    goBack: () => void,
  },
};

export default (props: Props) => (
  <TouchableOpacity onPress={() => props.navigation.goBack()}>
    <Container>
      <Icon resizeMode="contain" source={Icons.ChevronLeft} />
    </Container>
  </TouchableOpacity>
);

export const PlaceHolder = styled.View`
  height: 24px;
  width: 24px;
  margin-right: 16px;
`;
