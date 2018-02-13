import styled from "styled-components";

export default styled.View`
  align-self: stretch;
  justify-content: space-around;
  ${({ center }) => (center ? "flex: 1;" : "")};
`;
