// @flow
import React from "react";
import Label from "./styled/Label";
import Base from "./styled/Base";
import Touchable from "./styled/Touchable";

export default ({
  onPress,
  label,
  color,
}: {
  onPress: () => *,
  label: string,
  color: string,
}) => (
  <Touchable activeOpacity={0.75} onPress={onPress}>
    <Base>
      <Label color={color}>{label}</Label>
    </Base>
  </Touchable>
);
