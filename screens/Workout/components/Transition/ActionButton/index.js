// @flow
import React from "react";
import colors from "colors";
import Label from "./styled/Label";
import TouchableBase from "./styled/TouchableBase";

export default ({ onPress }: { onPress: () => * }) => (
  <TouchableBase
    feedbackEnabled
    elevationColor={colors.start}
    activeElevation={6}
    onPress={onPress}
  >
    <Label>GO</Label>
  </TouchableBase>
);
