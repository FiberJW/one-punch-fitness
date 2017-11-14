// @flow
import React, { Component } from "react";
import { View } from "react-native";
import colors from "../../config/colors";
import Container from "./styled/WorkoutCardContainer";
import CoverImage from "./styled/WorkoutCardCoverImage";
import Header from "./styled/WorkoutCardHeader";
import IntensityButton from "./WorkoutCardIntensityButton";
import ImageGradient from "./styled/WorkoutCardImageGradient";
import RoutineFacet from "./WorkoutCardRoutineFacet";
import LevelLabel from "./styled/WorkoutCardLevelLabel";
import StartButton from "./WorkoutCardStartButton";
import RoutineContainer from "./styled/WorkoutCardRoutineContainer";

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
          <CoverImage
            source={require("../../assets/images/level-0.png")}
            resizeMode="cover"
          />
          <ImageGradient colors={["rgba(0,0,0,0)", colors.spotiBlack]} />
          <LevelLabel>level {this.state.level}</LevelLabel>
          <IntensityButton
            disabled={this.state.level === 0}
            direction="down"
            onPress={() => {
              this.setState(prevState => ({
                ...prevState,
                level: prevState.level - 1,
              }));
            }}
          />
          <IntensityButton
            disabled={this.state.level === 5}
            direction="up"
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
              console.log("starting workout");
            }}
          />
        </View>
      </Container>
    );
  }
}
