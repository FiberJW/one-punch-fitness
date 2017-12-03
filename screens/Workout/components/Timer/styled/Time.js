// @flow
import styled from "styled-components/native";
import colors from "colors";

export default styled.Text`
  font-family: InterReg;
  background-color: transparent;
  font-size: ${({ deficit, remainingTime }) =>
    deficit ? 64 + Math.abs(remainingTime) : 64}px;
  color: ${({ deficit }) => (deficit ? colors.bRED : colors.spotiBlack)};
  text-align: center;
`;
