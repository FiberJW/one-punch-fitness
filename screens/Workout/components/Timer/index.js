// @flow
import React from "react";
import ReducerComponent from "ReducerComponent";
import Container from "./styled/Container";
import Time from "./styled/Time";

type Props = {
  duration: number,
};

type State = {
  timeUsed: number,
};

type Action = {
  type: string,
  payload?: *,
};

export default class Timer extends ReducerComponent<Props, State> {
  state = {
    timeUsed: 0,
  };

  componentDidMount() {
    this.timerHandle = setInterval(() => {
      this.dispatch({ type: "INCREMENT" });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerHandle);
  }

  reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case "INCREMENT":
        return {
          ...state,
          timeUsed: state.timeUsed + 1,
        };
      default:
        return { ...state };
    }
  };

  render() {
    return (
      <Container>
        <Time>{this.state.timeUsed}</Time>
      </Container>
    );
  }
}
