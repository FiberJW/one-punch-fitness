import React, { Component } from "react";
import { View, Button } from "react-native";
import { withNavigation } from "react-navigation";

export default withNavigation(
  class HomeScreen extends Component {
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
);
