// @flow
import React from "react";
import { TouchableOpacity } from "react-native";
import type { Action } from "../index";
import Label from "./styled/Label";
import Base from "./styled/Base";

type Props = { action: Action, last: boolean };

export default ({ action, last }: Props) => (
  <TouchableOpacity activeOpacity={0.8} onPress={action.onPress}>
    <Base last={last}>
      <Label>{action.title}</Label>
    </Base>
  </TouchableOpacity>
);
