import { Dimensions } from "react-native";
import styled from "styled-components";

export default styled.View`
  background-color: white;
  width: ${Dimensions.get("window").width - 16}px;
  margin-horizontal: 8px;
  margin-vertical: 8px;
  overflow: hidden;
  border-radius: 12px;
`;
