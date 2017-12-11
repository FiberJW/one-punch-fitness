// @flow
import styled from "styled-components/native";

export default styled.View`
  align-self: stretch;
  justify-content: space-around;
  ${({ center }) => (center ? "flex: 1;" : "")};
`;
