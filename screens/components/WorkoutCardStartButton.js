// @flow
import React from "react";
import Container from "./styled/WorkoutCardStartButtonContainer";
import TouchableBase from "./styled/WorkoutCardStartButtonTouchableBase";
import Label from "./styled/WorkoutCardStartButtonLabel";

type Props = {
  onPress: () => void,
};

export default ({ onPress }: Props) => (
  <Container>
    <TouchableBase feedbackEnabled activeElevation={4.6} onPress={onPress}>
      <Label>start</Label>
    </TouchableBase>
  </Container>
);
