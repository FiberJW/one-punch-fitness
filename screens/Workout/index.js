// @flow
import React, { Component } from "react";
import { ScrollView } from "react-native";
import Container from "./components/styled/Container";
import Background from "./components/styled/Background";
import ActionButton from "./components/ActionButton";
import Image from "./components/styled/Image";
import Progress from "./components/styled/Progress";
import SetType from "./components/styled/SetType";
import SetReps from "./components/styled/SetReps";

type Props = *;
type State = {
  inSession: boolean,
};

export default class WorkoutScreen extends Component<Props, State> {
  static navigationOptions = {
    title: "workout",
  };

  state = {
    inSession: false,
  };

  transitionLayout: string[] = ["Image", "Progress", "SetInfo", "Action"];
  sessionLayout: string[] = [
    "SetInfo",
    "Progress",
    "SessionControls",
    "Action",
  ];

  toggleSession = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        inSession: !prevState.inSession,
      };
    });
  };

  render() {
    const Layout = this.state.inSession
      ? this.sessionLayout
      : this.transitionLayout;

    return (
      <Background>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Container>
            {Layout.map((it: string, i: number) => {
              switch (it) {
                case "Image":
                  return (
                    <Image
                      key={i}
                      resizeMode="cover"
                      source={require("../../assets/images/workout/prep.png")}
                    />
                  );
                case "Progress":
                  return <Progress key={i}>set 1 of 10</Progress>;
                case "SetInfo":
                  return (
                    <SetType key={i}>
                      <SetReps>10</SetReps> push-ups
                    </SetType>
                  );
                case "SessionControls":
                  return null;
                case "Action":
                  return <ActionButton key={i} onPress={this.toggleSession} />;
                default:
                  return null;
              }
            })}
          </Container>
        </ScrollView>
      </Background>
    );
  }
}
