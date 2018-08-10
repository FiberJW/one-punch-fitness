import React from "react";
import { createStackNavigator } from "react-navigation";
import MainTab from "./MainTab";
import WorkoutScreen from "../screens/Workout/WorkoutScreen.bs";
import InfoScreen from "../screens/Info/InfoScreen.bs";
import Header from "./components/Header";

export default createStackNavigator(
  {
    MainTab: {
      screen: MainTab,
    },
    Workout: {
      screen: WorkoutScreen,
      navigationOptions: {
        header: headerProps => <Header {...headerProps} />,
        title: "workout",
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
