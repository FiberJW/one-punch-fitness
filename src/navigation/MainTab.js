import React, { Component } from "react";
import { createTabNavigator } from "react-navigation";
import { Feather } from "@expo/vector-icons";
import colors from "ReColor";
import HomeScreen from "../screens/Home/HomeScreen.bs";
import CalendarScreen from "../screens/Calendar/CalendarScreen.bs";
import SettingsScreen from "../screens/Settings/SettingsScreen.bs";
import TabBar from "./components/TabBar";

export default class MainTab extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const Tabs = createTabNavigator(
      {
        Home: { screen: HomeScreen, path: "home" },
        Calendar: {
          screen: CalendarScreen,
          path: "calendar",
          navigationOptions: {
            title: "calendar",
          },
        },
        Settings: {
          screen: SettingsScreen,
          path: "settings",
          navigationOptions: {
            tabBarLabel: null,
            tabBarIcon: ({ focused, tintColor }) => (
              <Feather
                color={focused ? tintColor : colors.halfWhite}
                name="settings"
                size={24}
              />
            ),
          },
        },
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
