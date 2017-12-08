// @flow
import styled from "styled-components/native";
import { Dimensions } from "react-native";

export default styled.Image`
  height: ${Dimensions.get("window").height * 0.25}px;
  width: 100%;
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
`;
