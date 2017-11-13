// @flow
import styled from "styled-components/native";

export default styled.TouchableOpacity`
  position: absolute;
  bottom: 16px;
  ${({ right }: { right: boolean }) => (right ? "right: 16px" : "")};
  ${({ left }: { left: boolean }) => (left ? "left: 16px" : "")};
`;
