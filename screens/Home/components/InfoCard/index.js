// @flow
import React, { Component } from "react";
import { TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo";
import { Illustrations } from "Assets";
import * as Animatable from "react-native-animatable";
import colors from "../../../../config/colors";
import Container from "./styled/Container";
import Description from "./styled/Description";
import CoverImage from "./styled/CoverImage";
import Title from "./styled/Title";
import ButtonTouchable from "./styled/ButtonTouchable";
import OverflowButton from "./OverflowButton";
import PopupMenu from "./PopupMenu";

type Props = {
  navigation: {
    navigate: string => void,
  },
  title: string,
  description: string,
};

type State = {
  menuOpen: boolean,
};

export default class InfoCard extends Component<Props, State> {
  state = {
    menuOpen: false,
  };

  render() {
    return (
      <TouchableOpacity
        activeOpacity={this.state.menuOpen ? 1 : 0.9}
        onPress={
          this.state.menuOpen
            ? () => {
                this.refs.Button.slideOutRight(80).then(() => {
                  this.setState(prevState => ({
                    ...prevState,
                    menuOpen: false,
                  }));

                  this.refs.Button.slideInDown(150);
                });
              }
            : () => this.props.navigation.navigate("Info")
        }
      >
        <Container>
          <View>
            <CoverImage
              source={Illustrations.theSecretSauce}
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
            <ButtonTouchable
              activeOpacity={this.state.menuOpen ? 1 : 0.8}
              disabled={this.state.menuOpen}
              onPress={() =>
                this.refs.Button.slideOutUp(150).then(() => {
                  this.setState(prevState => ({
                    ...prevState,
                    menuOpen: true,
                  }));

                  this.refs.Button.slideInRight(150);
                })
              }
            >
              <Animatable.View ref="Button" easing="ease-out">
                {this.state.menuOpen ? (
                  <PopupMenu
                    actions={[
                      {
                        title: "archive card",
                        onPress: () => console.log("deleting this infocard"),
                      },
                    ]}
                  />
                ) : (
                  <OverflowButton />
                )}
              </Animatable.View>
            </ButtonTouchable>
            <Title>{this.props.title}</Title>
          </View>
          <Description>{this.props.description}</Description>
        </Container>
      </TouchableOpacity>
    );
  }
}
