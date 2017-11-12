// @flow
import React, { Component } from "react";
import { View } from "react-native";

type Props = {};
type State = void;

export default class InfoScreen extends Component<Props, State> {
  static navigationOptions = {
    title: "info",
  };

  render() {
    return <View style={{ flex: 1, backgroundColor: "lightblue" }} />;
  }
}
