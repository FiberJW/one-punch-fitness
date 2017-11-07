import { TabNavigator as tabNavigator } from "react-navigation";
import HomeScreen from "../screens/Home";
import CalendarScreen from "../screens/Calendar";
import SettingsScreen from "../screens/Settings";
import TabBar from "./components/TabBar";

export default tabNavigator(
  {
    Home: { screen: HomeScreen, path: "home" },
    Calendar: { screen: CalendarScreen, path: "calendar" },
    Settings: { screen: SettingsScreen, path: "settings" }
  },
  {
    tabBarPosition: "top",
    initialRouteName: "Home",
    swipeEnabled: true,
    animationEnabled: true,
    tabBarComponent: TabBar
  }
);
