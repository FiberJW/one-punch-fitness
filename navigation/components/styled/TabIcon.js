// @flow
import styled from "styled-components/native";
import colors from "../../../config/colors";

export default styled.Image`
  height: 24px;
  width: 24px;
  tint-color: ${({ focused, tintColor }) =>
    focused ? tintColor : colors.halfWhite};
`;
