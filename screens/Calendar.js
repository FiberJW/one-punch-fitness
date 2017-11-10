import React, { Component } from "react";
import { View, Button } from "react-native";

export default class CalendarScreen extends Component {
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
