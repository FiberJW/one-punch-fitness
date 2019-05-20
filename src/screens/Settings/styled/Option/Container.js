import styled from "styled-components/native";
import { Dimensions } from "react-native";

export default styled.View`
  width: ${Dimensions.get("window").width - 32}px;
  padding: 24px;
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
  justify-content: space-between;
  background-color: ${({ tint }) => tint};
`;
