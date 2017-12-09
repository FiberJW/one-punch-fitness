// @flow
import React, { Component } from "react";
import { View } from "react-native";
import { Icons } from "Assets";
import TabIcon from "../navigation/components/TabBar/styled/Icon";

type Props = {};
type State = void;

export default class SettingsScreen extends Component<Props, State> {
  static navigationOptions = {
    tabBarLabel: null,
    tabBarIcon: ({
      focused,
      tintColor,
    }: {
      focused: boolean,
      tintColor: string,
    }) => (
      <TabIcon
        focused={focused}
        tintColor={tintColor}
        source={Icons.Settings}
      />
    ),
  };

  render() {
    return <View style={{ flex: 1, backgroundColor: "papayawhip" }} />;
  }
}
