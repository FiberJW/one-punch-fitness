// @flow
import React from "react";
import { StackNavigator } from "react-navigation";
import MainTab from "./MainTab";
import WorkoutScreen from "../screens/Workout";
import InfoScreen from "../screens/Info/InfoScreen.bs";
import Header from "./components/Header";

export default StackNavigator(
  {
    MainTab: {
      screen: MainTab,
    },
    Workout: {
      screen: WorkoutScreen,
      navigationOptions: {
        header: headerProps => <Header {...headerProps} />,
      },
    },
    Info: {
      screen: InfoScreen,
      navigationOptions: {
        title: "info",
        header: headerProps => <Header {...headerProps} />,
      },
    },
  },
  {
    initialRouteName: "MainTab",
    headerMode: "screen",
    cardStyle: {
      shadowColor: "transparent",
    },
  }
);
