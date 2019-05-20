import styled from "styled-components/native";

export default styled.TouchableOpacity`
  position: absolute;
  bottom: 16px;
  ${({ right }) => (right ? "right: 16px" : "")};
  ${({ left }) => (left ? "left: 16px" : "")};
`;
