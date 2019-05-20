import styled from "styled-components/native";
import { Dimensions } from "react-native";

export default styled.Image`
  width: ${Dimensions.get("window").width - 32}px;
  height: ${Dimensions.get("window").width * 0.7}px;
  border-radius: 12px;
`;
