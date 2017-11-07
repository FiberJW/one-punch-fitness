import { TabNavigator as tabNavigator } from "react-navigation";
import HomeScreen, { HoeScreen } from "../screens/Home";
import TabBar from "./components/TabBar";

export default tabNavigator(
  {
    Home: { screen: HomeScreen, path: "home" },
    Calendar: { screen: HoeScreen, path: "calendar" },
    Settings: { screen: HomeScreen, path: "settings" }
  },
  {
    tabBarPosition: "top",
    initialRouteName: "Home",
    swipeEnabled: true,
    animationEnabled: true,
    tabBarComponent: TabBar
  }
);
