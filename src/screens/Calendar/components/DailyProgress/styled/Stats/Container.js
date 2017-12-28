import styled from "styled-components/native";

export default styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  flex: 1;
  width: ${({ parentContainerWidth }) => parentContainerWidth - 32}px;
`;
