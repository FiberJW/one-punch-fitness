import React, { Component } from "react";
import { ScrollView, StatusBar } from "react-native";
import Container from "./styled/Container";
import colors from "../../../config/colors";
import Label from "./Label";
import TabIconWrapper from "./IconWrapper";

export default class TabBar extends Component {
  render() {
    const { routes, index } = this.props.navigation.state;

    return (
      <Container>
        <StatusBar barStyle="light-content" backgroundColor={colors.purpp} />
        <ScrollView horizontal>
          {routes.map((route, i) => {
            const focused = index === i;

            return route.key !== "Settings" ? (
              <Label
                key={i}
                focused={focused}
                text={this.props.getLabel({
                  route,
                  tintColor: "white",
                  focused,
                })}
                onPress={() => this.props.jumpTo(route.key)}
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
              focused,
            });

            return (
              <TabIconWrapper
                key={i}
                focused={focused}
                icon={React.cloneElement(Icon)}
                onPress={() => this.props.jumpTo(route.key)}
              />
            );
          }
          return null;
        })}
      </Container>
    );
  }
}
