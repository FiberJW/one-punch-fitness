import { Platform } from "react-native";
import { Constants } from "expo";
import styled from "styled-components/native";
import colors from "../../../config/colors";

export default styled.View`
  padding-top: ${Platform.OS !== "ios" ? Constants.statusBarHeight : 0};
  background-color: ${colors.purpp};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
