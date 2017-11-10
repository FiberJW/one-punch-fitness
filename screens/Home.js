import React, { Component } from "react";
import { Dimensions, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient, BlurView } from "expo";
import styled from "styled-components/native";
import colors from "../config/colors";

const Container = styled.View`
  background-color: ${colors.offWhite};
  flex: 1;
  align-items: center;
`;

const CardContainer = styled.View`
  background-color: white;
  width: ${Dimensions.get("window").width - 16}px;
  margin-horizontal: 8px;
  margin-top: 8px;
  overflow: hidden;
  border-radius: 12px;
`;

const TopSecContainer = styled.View``;

const InfoCardDescription = styled.Text`
  font-family: InterReg;
  background-color: transparent;
  font-size: 12px;
  color: ${colors.spotiBlack};
  margin: 16px;
`;

const CoverImage = styled.Image`
  height: 148px;
  width: 100%;
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
`;

const OverlayButtonContainer = styled.View`
  height: 32px;
  width: 32px;
  border-radius: 8px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
`;

const CardTitle = styled.Text`
  color: white;
  font-size: 24px;
  font-family: InterMedium;
  position: absolute;
  left: 16;
  right: 16;
  bottom: 16;
  background-color: transparent;
`;

// this is displaying a basic informational card
export default class HomeScreen extends Component {
  render() {
    return (
      <Container>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => this.props.screenProps.rootNavigation.navigate("Info")}
        >
          <CardContainer>
            <TopSecContainer>
              <CoverImage
                source={require("../assets/images/saitama-secret-training.png")}
                resizeMode="cover"
              />
              <LinearGradient
                colors={["rgba(0,0,0,0)", colors.spotiBlack]}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  height: 148,
                }}
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                }}
                onPress={() =>
                  this.props.screenProps.rootNavigation.navigate("Info")}
              >
                <OverlayButtonContainer>
                  <BlurView
                    tint="light"
                    intensity={30}
                    style={StyleSheet.absoluteFill}
                  />
                  <Image
                    source={require("../assets/images/icon-chevron-down.png")}
                    style={{ height: 6, width: 12 }}
                    resizeMode="cover"
                  />
                </OverlayButtonContainer>
              </TouchableOpacity>
              <CardTitle>inspiration</CardTitle>
            </TopSecContainer>
            <InfoCardDescription>
              Learn about this routine from Saitama himself!
            </InfoCardDescription>
          </CardContainer>
        </TouchableOpacity>
      </Container>
    );
  }
}
