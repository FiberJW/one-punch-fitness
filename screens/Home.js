import React, { Component } from "react";
import { View, Button } from "react-native";

export default class HomeScreen extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "papayawhip",
        }}
      >
        <Button
          title="skrrrahh"
          onPress={() => {
            this.props.screenProps.navigation.navigate("Workout");
          }}
        />
      </View>
    );
  }
}
