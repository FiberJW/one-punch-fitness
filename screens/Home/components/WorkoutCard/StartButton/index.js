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
    <TouchableBase feedbackEnabled activeElevation={4.6} onPress={onPress}>
      <Label>start</Label>
    </TouchableBase>
  </Container>
);
