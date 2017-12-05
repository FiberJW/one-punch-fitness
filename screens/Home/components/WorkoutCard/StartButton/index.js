// @flow
import React from "react";
import Container from "./styled/Container";
import TouchableBase from "./styled/TouchableBase";
import Label from "./styled/Label";

type Props = {
  onPress: () => void,
};

export default ({ onPress }: Props) => (
  <Container>
    <TouchableBase
      feedbackEnabled
      elevation={1.5}
      activeElevation={0.5}
      onPress={onPress}
    >
      <Label>start</Label>
    </TouchableBase>
  </Container>
);
