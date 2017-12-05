/**
 * @providesModule ElevatedView
 * @flow
 */

import * as React from "react";
import { Animated, TouchableWithoutFeedback } from "react-native";

type State = {
  height: number,
  width: number,
  elevation: Animated.Value,
};

type Props = {
  feedbackEnabled: boolean,
  activeElevation?: number,
  elevation: number,
  elevationColor: string,
  children?: React.Node,
  style?: any,
  onPress?: () => any,
  onLongPress?: () => any,
};

type ElevationStyle = {
  elevation: number,
  shadowColor: string,
  shadowOpacity: number,
  shadowRadius: number,
  shadowOffset: {
    height: number,
  },
};

export default class ElevatedView extends React.Component<Props, State> {
  static defaultProps = {
    feedbackEnabled: false,
    activeElevation: 0,
    elevation: 0,
    elevationColor: "black",
    style: {},
    onPress: () => {},
    onLongPress: () => {},
  };

  static Elevation = (
    elevation: number = 0,
    color: string = "black"
  ): ElevationStyle => ({
    elevation,
    shadowColor: color,
    shadowOpacity: 0.03 * elevation + 0.068,
    shadowRadius: 0.64 * elevation + -0.16,
    shadowOffset: {
      height: 0.6 * elevation + -0.34,
    },
  });

  listenerId: string;

  state = {
    height: 0,
    width: 0,
    elevation: new Animated.Value(this.props.elevation),
  };

  animateTo = (elevation: number = 0) => {
    if (this.props.feedbackEnabled) {
      Animated.spring(this.state.elevation, {
        toValue: elevation,
        useNativeDriver: true,
      }).start();
    }
  };

  componentDidMount() {
    this.listenerId = this.state.elevation.addListener(({ value }) =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.state.elevation.removeListener(this.listenerId);
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onLayout={({ nativeEvent: { layout: { width, height } } }) => {
          this.setState((prevState: State) => ({
            ...prevState,
            height,
            width,
          }));
        }}
        onPressIn={() => this.animateTo(this.props.activeElevation)}
        onPressOut={() => this.animateTo(this.props.elevation)}
        onPress={this.props.onPress}
        onLongPress={this.props.onLongPress}
      >
        <Animated.View
          style={[
            this.props.style,
            ElevatedView.Elevation(
              this.state.elevation._value,
              this.props.elevationColor
            ),
          ]}
        >
          {this.props.children}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}
