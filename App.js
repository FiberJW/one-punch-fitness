// @flow
import { Font, AppLoading } from "expo";
import React, { Component } from "react";
import MainStack from "./navigation/MainStack";
import Container from "./components/styled/AppContainer";

type Props = void;
type State = {
  loaded: boolean,
};

export default class App extends Component<Props, State> {
  state = {
    loaded: false,
  };

  componentDidMount() {
    Font.loadAsync({
      InterMedium: require("./assets/fonts/Inter-UI-Medium.ttf"),
      InterBold: require("./assets/fonts/Inter-UI-Bold.ttf"),
      InterReg: require("./assets/fonts/Inter-UI-Regular.ttf"),
    }).then(() => {
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
