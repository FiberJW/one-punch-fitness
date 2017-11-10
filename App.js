import { Font, AppLoading } from "expo";
import React from "react";
import MainStack from "./navigation/MainStack";
import Container from "./components/styled/AppContainer";

export default class App extends React.Component {
  state = {
    loaded: false,
  };

  componentDidMount() {
    Font.loadAsync({
      InterMedium: require("./assets/fonts/Inter-UI-Medium.ttf"),
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
