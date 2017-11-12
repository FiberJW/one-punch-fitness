// @flow
import React, { Component } from "react";
import styled from "styled-components/native";
import colors from "../config/colors";
import InfoCard from "./components/InfoCard";

type Props = { screenProps: { rootNavigation: any } };
type State = void;

const Container = styled.View`
  background-color: ${colors.offWhite};
  flex: 1;
  align-items: center;
`;

export default class HomeScreen extends Component<Props, State> {
  render() {
    return (
      <Container>
        <InfoCard
          title="inspiration"
          description="Learn about this routine from Saitama himself!"
          navigation={this.props.screenProps.rootNavigation}
        />
      </Container>
    );
  }
}
