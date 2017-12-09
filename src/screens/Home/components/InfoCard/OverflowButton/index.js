// @flow
import React from "react";
import { Icons } from "Assets";
import Icon from "./styled/Icon";
import Base from "./styled/Base";

type Props = {};

export default (props: Props) => (
  <Base>
    <Icon source={Icons.ChevronDown} resizeMode="contain" />
  </Base>
);
