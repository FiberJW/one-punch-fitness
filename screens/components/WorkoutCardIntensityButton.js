// @flow
import React from "react";
import Touchable from "./styled/WorkoutCardButtonTouchable";
import Base from "./styled/WorkoutCardButtonBase";
import Icon from "./styled/WorkoutCardButtonIcon";

type Props = {
  direction: "up" | "down",
  disabled: boolean,
  onPress: () => void,
};

export default ({ disabled, direction, onPress }: Props) => (
  <Touchable
    disabled={disabled}
    left={direction === "down"}
    right={direction === "up"}
    onPress={onPress}
  >
    <Base disabled={disabled}>
      <Icon
        disabled={disabled}
        source={
          direction === "down"
            ? require("../../assets/images/icon-arrow-left.png")
            : require("../../assets/images/icon-arrow-right.png")
        }
        resizeMode="contain"
      />
    </Base>
  </Touchable>
);
