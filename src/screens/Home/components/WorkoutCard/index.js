// @flow
import React, { Component } from "react";
import { View } from "react-native";
import colors from "ReColor";
import { Illustrations } from "Assets";
import Container from "./styled/Container";
import CoverImage from "./styled/CoverImage";
import Header from "./styled/Header";
import IntensityButton from "./IntensityButton/IntensityButton.bs";
import ImageGradient from "./styled/ImageGradient";
import LevelLabel from "./styled/LevelLabel";
import RoutineContainer from "./styled/RoutineContainer";
import RoutineFacet from "./RoutineFacet";
import StartButton from "./StartButton";

type Props = {
  navigation: {
    navigate: string => void,
  },
};

type State = {
  menuOpen: boolean,
  level: number,
};

export default class WorkoutCard extends Component<Props, State> {
  state = {
    menuOpen: false,
    level: 0,
  };

  render() {
    return (
      <Container>
        <Header>
          <CoverImage source={Illustrations.saitamaLevel0} resizeMode="cover" />
          <ImageGradient colors={["rgba(0,0,0,0)", colors.spotiBlack]} />
          <LevelLabel>level {this.state.level}</LevelLabel>
          <IntensityButton
            disabled={this.state.level === 0}
            action="decrement"
            onPress={() => {
              this.setState(prevState => ({
                ...prevState,
                level: prevState.level - 1,
              }));
            }}
          />
          <IntensityButton
            disabled={this.state.level === 5}
            action="increment"
            onPress={() => {
              this.setState(prevState => ({
                ...prevState,
                level: prevState.level + 1,
              }));
            }}
          />
        </Header>
        <RoutineContainer>
          <View>
            <RoutineFacet type="active" sets={10} reps={10} name="push-ups" />
            <RoutineFacet type="active" sets={10} reps={10} name="sit-ups" />
            <RoutineFacet type="active" sets={10} reps={10} name="squats" />
            <RoutineFacet type="active" sets={10} reps={"km"} name="run" />
          </View>
          <View>
            <RoutineFacet
              type="rest"
              sets={"sec"}
              reps={30}
              name="rest intervals"
            />
            <RoutineFacet
              type="rest"
              sets={"min"}
              reps={1}
              name="transition period"
            />
          </View>
        </RoutineContainer>
        <View>
          <StartButton
            onPress={() => {
              this.props.navigation.navigate("Workout");
            }}
          />
        </View>
      </Container>
    );
  }
}
