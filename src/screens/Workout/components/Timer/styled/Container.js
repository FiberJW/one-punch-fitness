import styled from "styled-components";
import { Dimensions } from "react-native";
import colors from "ReColor";

export default styled.View`
  width: ${Dimensions.get("window").width * 0.6};
  height: ${Dimensions.get("window").width * 0.6};
  border-radius: ${Dimensions.get("window").width * 0.6 / 2};
  border-width: 8px;
  justify-content: center;
  align-items: center;
  border-color: ${colors.status};
`;
