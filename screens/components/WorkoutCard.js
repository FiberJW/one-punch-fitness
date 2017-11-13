// @flow
import React, { Component } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo";
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
};

export default class WorkoutCard extends Component<Props, State> {
  state = {
    menuOpen: false,
  };

  render() {
    return (
      <Container>
        <View>
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
          <ButtonContainer left>
            <Button>
              <ButtonIcon
                source={require("../../assets/images/icon-arrow-left.png")}
                resizeMode="contain"
              />
            </Button>
          </ButtonContainer>
          <ButtonContainer right>
            <Button>
              <ButtonIcon
                source={require("../../assets/images/icon-arrow-right.png")}
                resizeMode="contain"
              />
            </Button>
          </ButtonContainer>
        </View>
      </Container>
    );
  }
}
