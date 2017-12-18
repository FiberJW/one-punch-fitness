// @flow
import React, { Component } from "react";
import { TabNavigator as tabNavigator } from "react-navigation";
import { Feather } from "@expo/vector-icons";
import colors from "ReColor";
import HomeScreen from "../screens/Home/HomeScreen.bs";
import CalendarScreen from "../screens/Calendar/CalendarScreen.bs";
import SettingsScreen from "../screens/Settings/SettingsScreen.bs";
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
        Settings: {
          screen: SettingsScreen,
          path: "settings",
          navigationOptions: {
            tabBarLabel: null,
            tabBarIcon: ({
              focused,
              tintColor,
            }: {
              focused: boolean,
              tintColor: string,
            }) => (
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
