// @flow
import React from "react";
import ReducerComponent from "ReducerComponent";
import Container from "./styled/Container";
import Time from "./styled/Time";

type Props = {
  duration: number,
};

type State = {
  remainingTime: number,
};

type Action = {
  type: string,
  payload?: *,
};

export default class Timer extends ReducerComponent<Props, State> {
  state = {
    remainingTime: 0,
  };

  componentDidMount() {
    this.dispatch({ type: "INIT" });

    this.timerHandle = setInterval(() => {
      this.dispatch({ type: "DECREMENT" });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerHandle);
  }

  reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case "INIT":
        return {
          ...state,
          remainingTime: this.props.duration,
        };
      case "DECREMENT":
        return {
          ...state,
          remainingTime: state.remainingTime - 1,
        };
      default:
        return { ...state };
    }
  };

  render() {
    return (
      <Container deficit={this.state.remainingTime < 0}>
        <Time
          remainingTime={this.state.remainingTime}
          deficit={this.state.remainingTime < 0}
        >
          {this.state.remainingTime}
        </Time>
      </Container>
    );
  }
}
