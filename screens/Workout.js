import React, { Component } from "react";
import { View } from "react-native";

export default class WorkoutScreen extends Component {
  static navigationOptions = {
    title: "workout",
  };
  render() {
    return <View style={{ flex: 1, backgroundColor: "lightblue" }} />;
  }
}
