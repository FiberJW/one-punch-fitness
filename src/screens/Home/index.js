// @flow
import React, { Component } from "react";
import InfoCard from "./components/InfoCard/InfoCard.bs";
import Container from "./components/styled/Container";
import SectionLabel from "./components/styled/SectionLabel";
import WorkoutCard from "./components/WorkoutCard/WorkoutCard.bs";

type Props = { screenProps: { rootNavigation: { navigate: string => void } } };
type State = void;

export default class HomeScreen extends Component<Props, State> {
  render() {
    return (
      <Container
        contentContainerStyle={{ flexGrow: 1 }}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
      >
        <WorkoutCard navigation={this.props.screenProps.rootNavigation} />
        <SectionLabel>GOODIES</SectionLabel>
        <InfoCard
          title="inspiration"
          description="Learn about this routine from Saitama himself!"
          navigation={this.props.screenProps.rootNavigation}
        />
      </Container>
    );
  }
}
