import styled from "styled-components";

export default styled.TouchableOpacity`
  position: absolute;
  bottom: 16px;
  ${({ right }) => (right ? "right: 16px" : "")};
  ${({ left }) => (left ? "left: 16px" : "")};
`;
