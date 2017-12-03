// @flow
import React from "react";
import ReducerComponent from "ReducerComponent";
import { ScrollView } from "react-native";
import Container from "./components/styled/Container";
import Background from "./components/styled/Background";
import ActionButton from "./components/ActionButton";
import Timer from "./components/Timer";
import Image from "./components/styled/Image";
import Progress from "./components/styled/Progress";
import SetType from "./components/styled/SetType";
import SetReps from "./components/styled/SetReps";

type Props = *;
type State = {
  inSession: boolean,
  timeUsed: number,
  timerHandle?: number,
};

type Action = {
  type: string,
  payload?: *,
};

export default class WorkoutScreen extends ReducerComponent<Props, State> {
  static navigationOptions = {
    title: "workout",
  };

  state: State = {
    inSession: false,
    timeUsed: 0,
  };

  startSession = () => {
    this.dispatch({
      type: "START_TIMER",
      payload: setInterval(() => {
        this.dispatch({ type: "INCREMENT" });
      }, 1000),
    });
  };

  componentWillUnmount() {
    clearInterval(this.state.timerHandle);
  }

  reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case "INCREMENT":
        return {
          ...state,
          timeUsed: state.timeUsed + 1,
        };
      case "TOGGLE_SESSION":
        return {
          ...state,
          inSession: !state.inSession,
        };
      case "SET_TIMER":
        return {
          ...state,
          timerHandle: action.payload,
        };
      default:
        return { ...state };
    }
  };

  transitionLayout: string[] = ["Image", "Progress", "SetInfo", "Action"];
  sessionLayout: string[] = [
    "SetInfo",
    "Timer",
    "Progress",
    "SessionControls",
    "Action",
  ];

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
                case "Timer":
                  return <Timer key={i} time={this.state.timeUsed} />;
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
                  return (
                    <ActionButton
                      key={i}
                      onPress={() => this.dispatch({ type: "TOGGLE_SESSION" })}
                      label={this.state.inSession ? "COMPLETE" : "GO"}
                    />
                  );
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
