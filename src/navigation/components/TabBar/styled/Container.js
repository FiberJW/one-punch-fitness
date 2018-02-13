import styled from "styled-components";
import { Constants } from "expo";
import { Platform } from "react-native";
import colors from "../../../../config/colors";

export default styled.View`
  background-color: ${colors.status};
  padding-top: ${Platform.OS !== "ios" ? Constants.statusBarHeight : 0};
  width: 100%;
  padding-left: 8px;
  padding-right: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
