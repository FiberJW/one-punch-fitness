// @flow
import styled from "styled-components/native";
import colors from "../../../../../config/colors";

export default styled.View`
  padding: 4px;
  background-color: ${({ focused }) =>
    focused ? colors.twentyWhite : "transparent"};
  border-radius: 24px;
`;
