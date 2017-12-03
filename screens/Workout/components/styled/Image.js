// @flow
import styled from "styled-components/native";
import { Dimensions } from "react-native";

export default styled.Image`
  width: ${Dimensions.get("window").width * 0.8};
  height: ${Dimensions.get("window").width * 0.8};
  border-radius: ${Dimensions.get("window").width * 0.8 / 2};
`;
