// @flow
import styled from "styled-components/native";
import { Dimensions } from "react-native";
import colors from "colors";

export default styled.View`
  background-color: ${colors.status};
  width: ${Dimensions.get("window").width - 32}px;
  margin-top: 16px;
  justify-content: space-around;
  align-items: center;
  flex: 1;
  padding: 16px;
  border-radius: 12px;
`;
