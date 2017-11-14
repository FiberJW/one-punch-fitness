// @flow
import React from "react";
import Container from "./styled/WorkoutCardStartButtonContainer";
import Touchable from "./styled/WorkoutCardStartButtonTouchable";
import Base from "./styled/WorkoutCardStartButtonBase";
import Label from "./styled/WorkoutCardStartButtonLabel";

type Props = {
  onPress: () => void,
};

export default ({ onPress }: Props) => (
  <Container>
    <Touchable onPress={onPress}>
      <Base>
        <Label>start</Label>
      </Base>
    </Touchable>
  </Container>
);
