import { Platform } from "react-native";
import { Constants } from "expo";
import styled from "styled-components";
import colors from "ReColor";

export default styled.View`
  padding-top: ${Platform.OS !== "ios" ? Constants.statusBarHeight : 0};
  background-color: ${colors.status};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
