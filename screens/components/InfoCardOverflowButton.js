// @flow
import React from "react";
import Container from "./styled/InfoCardOverflowButtonContainer";
import Icon from "./styled/InfoCardOverflowButtonIcon";

type Props = {};

export default (props: Props) => (
  <Container>
    <Icon
      source={require("../../assets/images/icon-chevron-down.png")}
      resizeMode="contain"
    />
  </Container>
);
