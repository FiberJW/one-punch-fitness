import styled from "styled-components";

export default styled.View`
  background-color: white;
  border-radius: 16px;
  flex: 1;
  max-height: 4px;
  max-width: ${({ width }) => width}px;
`;
