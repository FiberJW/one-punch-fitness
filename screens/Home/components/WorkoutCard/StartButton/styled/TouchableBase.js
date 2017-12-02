// @flow
import styled from "styled-components/native";
import colors from "colors";
import ElevatedView from "ElevatedView";

export default styled(ElevatedView)`
  background-color: ${colors.twentyWhite};
  border-radius: 8px;
  flex: 1;
  margin: 16px;
  justify-content: center;
  align-items: center;
`;
