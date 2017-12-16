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
import RoutineFacet from "./RoutineFacet/RoutineFacet.bs";
import StartButton from "./StartButton/WorkoutCardStartButton.bs";
import routines from "../../../../config/routineVariations.json";

type Props = {
  navigation: {
    navigate: string => void,
  },
};

type State = {
  level: number,
};

export default class WorkoutCard extends Component<Props, State> {
  state = {
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
            disabled={this.state.level === 4}
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
            <RoutineFacet
              sets={routines[this.state.level]["push-ups"].sets}
              reps={routines[this.state.level]["push-ups"].reps}
              name="push-ups"
            />
            <RoutineFacet
              sets={routines[this.state.level]["sit-ups"].sets}
              reps={routines[this.state.level]["sit-ups"].reps}
              name="sit-ups"
            />
            <RoutineFacet
              sets={routines[this.state.level]["squats"].sets}
              reps={routines[this.state.level]["squats"].reps}
              name="squats"
            />
            <RoutineFacet
              distance={routines[this.state.level]["run"].distance}
              units={routines[this.state.level]["run"].units}
              name="run"
            />
          </View>
          <View>
            <RoutineFacet
              amount={routines[this.state.level]["rest"].amount}
              units={routines[this.state.level]["rest"].units}
              name="rest"
            />
            <RoutineFacet
              amount={routines[this.state.level]["transition"].amount}
              units={routines[this.state.level]["transition"].units}
              name="transition"
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
