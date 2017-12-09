// @flow
import React from "react";
import ReducerComponent from "ReducerComponent";
import Container from "./styled/Container";
import Time from "./styled/Time";

type Props = *;
type State = void;

export default class Timer extends ReducerComponent<Props, State> {
  render() {
    return (
      <Container>
        <Time>{this.props.time}</Time>
      </Container>
    );
  }
}
