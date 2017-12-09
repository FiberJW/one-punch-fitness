// @flow
import React, { Component } from "react";
import { View, Button } from "react-native";

type Props = { screenProps: { rootNavigation: { navigate: string => void } } };
type State = void;

export default class CalendarScreen extends Component<Props, State> {
  static navigationOptions = {
    title: "calendar",
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "palevioletred",
        }}
      >
        <Button
          title="pap, pap, ka-ka-ka"
          onPress={() => {
            this.props.screenProps.rootNavigation.navigate("Info");
          }}
        />
      </View>
    );
  }
}
