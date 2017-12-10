// @flow
import React, { Component } from "react";
import { TabNavigator as tabNavigator } from "react-navigation";
import HomeScreen from "../screens/Home";
import CalendarScreen from "../screens/Calendar/CalendarScreen.bs";
import SettingsScreen from "../screens/Settings";
import TabBar from "./components/TabBar";

type Props = {
  navigation: {},
};

type State = void;

export default class MainTab extends Component<Props, State> {
  static navigationOptions = {
    header: null,
  };

  render() {
    const Tabs = tabNavigator(
      {
        Home: { screen: HomeScreen, path: "home" },
        Calendar: {
          screen: CalendarScreen,
          path: "calendar",
          navigationOptions: {
            title: "calendar",
          },
        },
        Settings: { screen: SettingsScreen, path: "settings" },
      },
      {
        tabBarPosition: "top",
        initialRouteName: "Home",
        swipeEnabled: true,
        animationEnabled: true,
        tabBarComponent: TabBar,
      }
    );

    return <Tabs screenProps={{ rootNavigation: this.props.navigation }} />;
  }
}
