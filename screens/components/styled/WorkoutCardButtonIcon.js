// @flow
import styled from "styled-components/native";

export default styled.Image`
  height: 12px;
  width: 16px;
  ${({ disabled }: { disabled: boolean }) => (disabled ? "opacity: 0.3;" : "")};
`;
