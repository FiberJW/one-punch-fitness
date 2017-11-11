import React, { Component } from "react";
import { Dimensions, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo";
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

const OverflowContainer = styled.View`
  height: 32px;
  width: 32px;
  border-radius: 8px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  background-color: ${colors.twentyWhite};
`;

const PopupMenuContainer = styled.View`
  border-radius: 8px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  max-width: 200px;
  max-height: 200px;
  padding: 4px;
  align-items: stretch;
  background-color: ${colors.twentyWhite};
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

const PopupOptionTitle = styled.Text`
  color: white;
  font-size: 16px;
  font-family: InterMedium;
  background-color: transparent;
`;

const PopupOptionContainer = styled.View`
  background-color: ${colors.fortyBlack};
  padding-vertical: 2px;
  padding-horizontal: 8px;
  margin-bottom: ${({ last }) => (last ? 0 : 4)}px;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
`;

const PopupMenu = props => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={{
      position: "absolute",
      top: 8,
      right: 8,
    }}
    onPress={props.actions[0].onPress}
  >
    <PopupMenuContainer>
      {props.actions.map((action, i) => (
        <TouchableOpacity key={i} activeOpacity={0.8} onPress={action.onPress}>
          <PopupOptionContainer last={i === props.actions.length - 1}>
            <PopupOptionTitle>{action.title}</PopupOptionTitle>
          </PopupOptionContainer>
        </TouchableOpacity>
      ))}
    </PopupMenuContainer>
  </TouchableOpacity>
);

const OverflowButton = props => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={{
      position: "absolute",
      top: 8,
      right: 8,
    }}
    onPress={props.onPress}
  >
    <OverflowContainer>
      <Image
        source={require("../assets/images/icon-chevron-down.png")}
        style={{ height: 6, width: 12 }}
        resizeMode="cover"
      />
    </OverflowContainer>
  </TouchableOpacity>
);

class InfoCard extends Component {
  state = {
    menuOpen: false,
  };

  render() {
    return (
      <TouchableOpacity
        activeOpacity={this.state.menuOpen ? 1 : 0.9}
        onPress={
          this.state.menuOpen
            ? () =>
                this.setState(prevState => ({
                  ...prevState,
                  menuOpen: false,
                }))
            : () => this.props.navigation.navigate("Info")
        }
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
            {this.state.menuOpen ? (
              <PopupMenu
                actions={[
                  {
                    title: "share",
                    onPress: () => console.log("sharing!"),
                  },
                  {
                    title: "remind me later",
                    onPress: () => console.log("postponing this infocard"),
                  },
                  {
                    title: "remove card",
                    onPress: () => console.log("deleting this infocard"),
                  },
                ]}
              />
            ) : (
              <OverflowButton
                onPress={() =>
                  this.setState(prevState => ({
                    ...prevState,
                    menuOpen: true,
                  }))}
              />
            )}
            <CardTitle>{this.props.title}</CardTitle>
          </TopSecContainer>
          <InfoCardDescription>{this.props.description}</InfoCardDescription>
        </CardContainer>
      </TouchableOpacity>
    );
  }
}

// this is displaying a basic informational card
export default class HomeScreen extends Component {
  render() {
    return (
      <Container>
        <InfoCard
          title="inspiration"
          description="Learn about this routine from Saitama himself!"
          navigation={this.props.screenProps.rootNavigation}
        />
      </Container>
    );
  }
}
