// @flow
import React, { Component } from "react";
import { View } from "react-native";

type Props = {};
type State = void;

export default class WorkoutScreen extends Component<Props, State> {
  static navigationOptions = {
    title: "workout",
  };

  render() {
    return <View style={{ flex: 1, backgroundColor: "lightblue" }} />;
  }
}
