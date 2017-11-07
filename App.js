import { Font, AppLoading } from "expo";
import React from "react";
import MainTabNav from "./navigation/MainTabNav";
import Container from "./components/styled/AppContainer";

export default class App extends React.Component {
  state = {
    loaded: false
  };

  componentDidMount() {
    Font.loadAsync({
      InterMedium: require("./assets/fonts/Inter-UI-Medium.ttf")
    }).then(() => {
      this.setState({ loaded: true });
    });
  }

  render() {
    return (
      <Container>
        {this.state.loaded ? <MainTabNav /> : <AppLoading />}
      </Container>
    );
  }
}
