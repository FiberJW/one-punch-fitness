// @flow
import React, { Component } from "react";
import { ScrollView } from "react-native";
import ActionButton from "./ActionButton";
import Container from "./styled/Container";
import Image from "./styled/Image";
import Progress from "./styled/Progress";
import SetType from "./styled/SetType";
import SetReps from "./styled/SetReps";

export default class WorkoutTransition extends Component<*, void> {
  render() {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Container>
          <Image
            resizeMode="cover"
            source={require("../../../../assets/images/workout/prep.png")}
          />
          <Progress>set 1 of 10</Progress>
          <SetType>
            <SetReps>10</SetReps> push-ups
          </SetType>
          <ActionButton onPress={this.props.toggleProgress} />
        </Container>
      </ScrollView>
    );
  }
}
