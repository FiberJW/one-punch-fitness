import React, { Component } from "react";
import { View } from "react-native";

export default class InfoScreen extends Component {
  static navigationOptions = {
    title: "info",
  };
  render() {
    return <View style={{ flex: 1, backgroundColor: "lightblue" }} />;
  }
}
