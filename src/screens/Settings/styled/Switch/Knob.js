// @flow
import styled from "styled-components/native";

export default styled.View`
  height: 24px;
  width: 24px;
  border-radius: 12px;
  background-color: white;
  align-self: ${({ on }) => (on ? "flex-end" : "flex-start")};
`;
