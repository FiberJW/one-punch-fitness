// @flow
import React, { Component } from "react";
import Transition from "./components/Transition";
import Session from "./components/Session";
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
          <Session />
        ) : (
          <Transition toggleProgress={this.toggleProgress} />
        )}
      </Container>
    );
  }
}
