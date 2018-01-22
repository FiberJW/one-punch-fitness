import styled from "styled-components";
import colors from "../../../../../config/colors";

export default styled.Text`
  font-family: InterMedium;
  color: ${({ focused }) => (focused ? "white" : colors.halfWhite)};
  font-size: 24px;
`;
