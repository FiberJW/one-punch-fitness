import styled from "styled-components";
import colors from "ReColor";

export default styled.View`
  background-color: ${colors.fortyBlack};
  padding-vertical: 2px;
  padding-horizontal: 8px;
  margin-bottom: ${({ last }) => (last ? 0 : 4)}px;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
`;
