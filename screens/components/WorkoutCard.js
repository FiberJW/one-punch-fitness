// @flow
import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo";
import styled from "styled-components/native";
import colors from "../../config/colors";
import Container from "./styled/WorkoutCardContainer";
import CoverImage from "./styled/WorkoutCardCoverImage";
import ButtonContainer from "./styled/WorkoutCardButtonContainer";
import Button from "./styled/WorkoutCardButton";
import ButtonIcon from "./styled/WorkoutCardButtonIcon";

type Props = {
  navigation: {
    navigate: string => void,
  },
};

type State = {
  menuOpen: boolean,
  level: number,
};

const LevelLabel = styled.Text`
  color: white;
  font-size: 24px;
  font-family: InterMedium;
  background-color: transparent;
  position: absolute;
  bottom: 18px;
`;

const RoutineAmount = styled.Text`
  font-family: InterBold;
  color: ${colors.spotiBlack};
  font-size: 14px;
`;

const RoutineType = styled.Text`
  font-family: InterReg;
  color: ${colors.spotiBlack};
  font-size: 14px;
`;

const RoutineFacet = ({
  type,
  sets,
  reps,
  name,
  time,
}: {
  type: "active" | "rest",
  sets: number | string,
  reps: number | string,
  name: string,
}) => (
  <View
    style={{
      flexDirection: "row",
    }}
  >
    <RoutineAmount>
      {type === "active"
        ? `${sets}${name === "run" ? "" : "x"}${reps} `
        : `${reps}${sets} `}
    </RoutineAmount>
    <RoutineType>{name}</RoutineType>
  </View>
);

const StartButtonBase = styled.View`
  background-color: ${colors.twentyWhite};
  border-radius: 8px;
  flex: 1;
  margin: 16px;
  justify-content: center;
  align-items: center;
`;

const StartButtonText = styled.Text`
  font-family: InterMedium;
  font-size: 16px;
  color: white;
  background-color: transparent;
`;

export default class WorkoutCard extends Component<Props, State> {
  state = {
    menuOpen: false,
    level: 0,
  };

  render() {
    return (
      <Container>
        <View style={{ alignItems: "center" }}>
          <CoverImage
            source={require("../../assets/images/level-0.png")}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0)", colors.spotiBlack]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 200,
            }}
          />
          <LevelLabel>level {this.state.level}</LevelLabel>
          <ButtonContainer
            disabled={this.state.level === 0}
            left
            onPress={() => {
              this.setState(prevState => ({
                ...prevState,
                level: prevState.level - 1,
              }));
            }}
          >
            <Button>
              <ButtonIcon
                source={require("../../assets/images/icon-arrow-left.png")}
                resizeMode="contain"
              />
            </Button>
          </ButtonContainer>
          <ButtonContainer
            disabled={this.state.level === 5}
            right
            onPress={() => {
              this.setState(prevState => ({
                ...prevState,
                level: prevState.level + 1,
              }));
            }}
          >
            <Button>
              <ButtonIcon
                source={require("../../assets/images/icon-arrow-right.png")}
                resizeMode="contain"
              />
            </Button>
          </ButtonContainer>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            margin: 16,
          }}
        >
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
        </View>
        <View>
          <View
            style={{
              height: 64,
              backgroundColor: colors.start,
              borderBottomRightRadius: 12,
              borderBottomLeftRadius: 12,
            }}
          >
            <TouchableOpacity style={{ flex: 1 }}>
              <StartButtonBase>
                <StartButtonText>start</StartButtonText>
              </StartButtonBase>
            </TouchableOpacity>
          </View>
        </View>
      </Container>
    );
  }
}
