// @flow
import React from "react";
import ReducerComponent from "ReducerComponent";
import { ScrollView } from "react-native";
import colors from "colors";
import { Illustrations } from "Assets";
import Container from "./components/styled/Container";
import Background from "./components/styled/Background";
import ActionButton from "./components/ActionButton/index.bs";
import Timer from "./components/Timer";
import Image from "./components/styled/Image";
import Progress from "./components/styled/Progress";
import SetType from "./components/styled/SetType";
import SetReps from "./components/styled/SetReps";
import SessionControl from "./components/SessionControl";
import SessionControlGroup from "./components/SessionControl/styled/Group";

type Props = *;
type State = {
  inSession: boolean,
  timeUsed: number,
  timerHandle?: number,
  status: string,
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
    status: "ACTIVE",
    timeUsed: 0,
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
      case "START_TIMER":
        return {
          ...state,
          timerHandle: action.payload,
          timeUsed: 0,
          status: "ACTIVE",
        };
      case "STOP_TIMER":
        return {
          ...state,
          timerHandle: action.payload,
          status: "STOPPED",
        };
      case "PAUSE_TIMER":
        return {
          ...state,
          status: "PAUSED",
        };

      case "RESUME_TIMER":
        return {
          ...state,
          status: "ACTIVE",
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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
        >
          <Container>
            {Layout.map((it: string, i: number) => {
              switch (it) {
                case "Image":
                  return (
                    <Image
                      key={i}
                      resizeMode="cover"
                      source={Illustrations.WorkoutPrep}
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
                  return (
                    <SessionControlGroup key={i}>
                      <SessionControl
                        color={colors.blueLeftUsTooSoon}
                        onPress={() => {
                          if (this.state.status === "PAUSED") {
                            this.dispatch({
                              type: "RESUME_TIMER",
                            });
                          } else if (this.state.status === "STOPPED") {
                            this.dispatch({
                              type: "START_TIMER",
                              payload: setInterval(() => {
                                if (this.state.status !== "PAUSED") {
                                  this.dispatch({ type: "INCREMENT" });
                                }
                              }, 1000),
                            });
                          } else {
                            this.dispatch({
                              type: "PAUSE_TIMER",
                            });
                          }
                        }}
                        label={(() => {
                          switch (this.state.status) {
                            case "ACTIVE":
                              return "PAUSE";
                            case "PAUSED":
                              return "RESUME";
                            case "STOPPED":
                              return "START";
                            default:
                              return "";
                          }
                        })()}
                      />
                      <SessionControl
                        color={colors.bRED}
                        onPress={() => {
                          this.dispatch({
                            type: "STOP_TIMER",
                            payload: clearInterval(this.state.timerHandle),
                          });
                        }}
                        label={"STOP"}
                      />
                    </SessionControlGroup>
                  );
                case "Action":
                  return (
                    <ActionButton
                      key={i}
                      onPress={() => {
                        if (this.state.inSession) {
                          this.dispatch({
                            type: "STOP_TIMER",
                            payload: clearInterval(this.state.timerHandle),
                          });
                        } else {
                          this.dispatch({
                            type: "START_TIMER",
                            payload: setInterval(() => {
                              if (this.state.status !== "PAUSED") {
                                this.dispatch({ type: "INCREMENT" });
                              }
                            }, 1000),
                          });
                        }
                        this.dispatch({ type: "TOGGLE_SESSION" });
                      }}
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
