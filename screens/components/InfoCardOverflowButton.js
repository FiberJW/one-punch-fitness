// @flow
import React from "react";
import Base from "./styled/InfoCardOverflowButtonBase";
import Icon from "./styled/InfoCardOverflowButtonIcon";

type Props = {};

export default (props: Props) => (
  <Base>
    <Icon
      source={require("../../assets/images/icon-chevron-down.png")}
      resizeMode="contain"
    />
  </Base>
);
