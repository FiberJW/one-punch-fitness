// @flow
import React from "react";
import { Icons } from "Assets";
import Touchable from "./styled/Touchable";
import Base from "./styled/Base";
import Icon from "./styled/Icon";

type Props = {
  action: "increment" | "decrement",
  disabled: boolean,
  onPress: () => void,
};

export default ({ disabled, action, onPress }: Props) => (
  <Touchable
    disabled={disabled}
    left={action === "decrement"}
    right={action === "increment"}
    onPress={onPress}
  >
    <Base disabled={disabled}>
      <Icon
        disabled={disabled}
        source={action === "decrement" ? Icons.ArrowLeft : Icons.ArrowRight}
        resizeMode="contain"
      />
    </Base>
  </Touchable>
);
