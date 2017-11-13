// @flow
import React, { Component } from "react";
import InfoCard from "./components/InfoCard";
import Container from "./components/styled/HomeScreenContainer";
import WorkoutCard from "./components/WorkoutCard";

type Props = { screenProps: { rootNavigation: { navigate: string => void } } };
type State = void;

export default class HomeScreen extends Component<Props, State> {
  render() {
    return (
      <Container
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
        <InfoCard
          title="inspiration"
          description="Learn about this routine from Saitama himself!"
          navigation={this.props.screenProps.rootNavigation}
        />
        <WorkoutCard navigation={this.props.screenProps.rootNavigation} />
      </Container>
    );
  }
}
