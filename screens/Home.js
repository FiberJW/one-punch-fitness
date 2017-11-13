// @flow
import React, { Component } from "react";
import styled from "styled-components/native";
import InfoCard from "./components/InfoCard";
import Container from "./components/styled/HomeScreenContainer";
import WorkoutCard from "./components/WorkoutCard";
import colors from "../config/colors";

const Label = styled.Text`
  font-family: InterReg;
  font-size: 14px;
  margin-left: 16px;
  color: ${colors.halfBlack};
`;

type Props = { screenProps: { rootNavigation: { navigate: string => void } } };
type State = void;

export default class HomeScreen extends Component<Props, State> {
  render() {
    return (
      <Container>
        <WorkoutCard navigation={this.props.screenProps.rootNavigation} />
        <Label>GOODIES</Label>
        <InfoCard
          title="inspiration"
          description="Learn about this routine from Saitama himself!"
          navigation={this.props.screenProps.rootNavigation}
        />
      </Container>
    );
  }
}
