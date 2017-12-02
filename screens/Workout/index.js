// @flow
import React, { Component } from "react";
import { View } from "react-native";
import Transition from "./components/Transition";
import Container from "./components/styled/Container";

type Props = *;
type State = {
  inProgress: boolean,
};

export default class WorkoutScreen extends Component<Props, State> {
  static navigationOptions = {
    title: "workout",
  };

  state = {
    inProgress: false,
  };

  toggleProgress = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        inProgress: !prevState.inProgress,
      };
    });
  };

  render() {
    return (
      <Container>
        {this.state.inProgress ? (
          <InWorkout />
        ) : (
          <Transition toggleProgress={this.toggleProgress} />
        )}
      </Container>
    );
  }
}

class InWorkout extends Component<*, void> {
  render() {
    return <View />;
  }
}
