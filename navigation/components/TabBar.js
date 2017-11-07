import React, { Component } from "react";
import { ScrollView, StatusBar } from "react-native";
import PropTypes from "prop-types";
import Container from "./styled/TabBarContainer";
import colors from "../../config/colors";
import TabLabel from "./TabLabel";
import TabIconWrapper from "./TabIconWrapper";

export default class TabBar extends Component {
  static propTypes = {
    navigation: PropTypes.object
  };

  render() {
    const { routes, index } = this.props.navigation.state;

    return (
      <Container>
        <StatusBar barStyle="light-content" backgroundColor={colors.purpp} />
        <ScrollView horizontal>
          {routes.map((route, i) => {
            const focused = index === i;

            return route.key !== "Settings" ? (
              <TabLabel
                key={i}
                focused={focused}
                text={this.props.getLabel({
                  route,
                  tintColor: "white",
                  focused
                })}
                onPress={() => this.props.jumpToIndex(i)}
              />
            ) : null;
          })}
        </ScrollView>
        {routes.map((route, i) => {
          const focused = index === i;
          if (route.key === "Settings") {
            const Icon = this.props.renderIcon({
              route,
              tintColor: "white",
              focused
            });

            return (
              <TabIconWrapper
                key={i}
                focused={focused}
                icon={React.cloneElement(Icon)}
                onPress={() => this.props.jumpToIndex(i)}
              />
            );
          }
          return null;
        })}
      </Container>
    );
  }
}
