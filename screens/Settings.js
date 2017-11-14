// @flow
import React, { Component } from "react";
import { View } from "react-native";
import TabIcon from "../navigation/components/styled/TabIcon";

type Props = {};
type State = void;

export default class SettingsScreen extends Component<Props, State> {
  static navigationOptions = {
    tabBarLabel: null,
    tabBarIcon: ({ focused, tintColor }) => (
      <TabIcon
        focused={focused}
        tintColor={tintColor}
        source={require("../assets/images/icon-settings.png")}
      />
    ),
  };

  render() {
    return <View style={{ flex: 1, backgroundColor: "papayawhip" }} />;
  }
}
