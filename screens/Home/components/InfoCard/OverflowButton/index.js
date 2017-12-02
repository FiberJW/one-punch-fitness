// @flow
import React from "react";
import Base from "./styled/Base";
import Icon from "./styled/Icon";

type Props = {};

export default (props: Props) => (
  <Base>
    <Icon
      source={require("../../../../../assets/images/icon-chevron-down.png")}
      resizeMode="contain"
    />
  </Base>
);
