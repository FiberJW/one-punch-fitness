import styled from "styled-components/native";
import colors from "../../../../../../config/colors";

export default styled.View`
  height: 32px;
  width: 32px;
  border-radius: 8px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  background-color: ${colors.twentyWhite};
  ${({ disabled }) => (disabled ? "opacity: 0.3;" : "")};
`;
