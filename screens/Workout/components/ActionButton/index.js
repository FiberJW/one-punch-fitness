// @flow
import React from "react";
import colors from "colors";
import Label from "./styled/Label";
import TouchableBase from "./styled/TouchableBase";

export default ({ onPress, label }: { onPress: () => *, label: string }) => (
  <TouchableBase
    feedbackEnabled
    elevationColor={colors.start}
    activeElevation={6}
    onPress={onPress}
  >
    <Label>{label}</Label>
  </TouchableBase>
);
