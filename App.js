// @flow
import { Font, AppLoading } from "expo";
import React, { Component } from "react";
import { Fonts } from "Assets";
import MainStack from "./navigation/MainStack";
import Container from "./components/styled/Container";
import { log } from "./re/log";

type Props = void;
type State = {
  loaded: boolean,
};

export default class App extends Component<Props, State> {
  state = {
    loaded: false,
  };

  componentDidMount() {
    log();
    Font.loadAsync(Fonts).then(() => {
      this.setState({ loaded: true });
    });
  }

  render() {
    return (
      <Container>
        {this.state.loaded ? <MainStack /> : <AppLoading />}
      </Container>
    );
  }
}
