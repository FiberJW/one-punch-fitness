// @flow
import React, { Component } from "react";
import { Dimensions } from "react-native";
import styled from "styled-components/native";
import colors from "../config/colors";
import ElevatedView from "ElevatedView";

const Container = styled.View`
  flex: 1;
  background-color: #faf8ff;
  padding-vertical: 16px;
`;

const View = styled.View``;
const WorkoutTransitionScreenContainer = styled.View`
  justify-content: space-between;
  flex: 1;
`;

const TransitionImage = styled.Image`
  width: ${Dimensions.get("window").width}px;
  height: ${Dimensions.get("window").width}px;
`;

const ProgressText = styled.Text`
  font-family: InterReg;
  font-size: 14px;
  text-align: center;
  color: ${colors.halfBlack};
`;

const SetTypeText = styled.Text`
  font-family: InterReg;
  font-size: 36px;
  text-align: center;
  color: ${colors.status};
`;

const SetRepsText = styled.Text`
  font-family: InterBold;
  font-size: 36px;
  text-align: center;
  color: ${colors.status};
`;

const TransitionActionButtonBase = styled.View`
  width: 100%;
  background-color: ${colors.start};
  border-radius: 12px;
  padding-vertical: 16px;
`;
const TransitionActionButtonLabel = styled.Text`
  font-family: InterBold;
  font-size: 36px;
  color: white;
  text-align: center;
`;
const TransitionActionButtonTouchable = styled.TouchableOpacity`
  margin-horizontal: 16px;
`;

const TransitionActionButtonElevation = styled(ElevatedView)`
  border-radius: 12px;
`;

const TransitionActionButton = p => (
  <TransitionActionButtonTouchable>
    <TransitionActionButtonElevation
      feedbackEnabled
      elevationColor={colors.start}
      activeElevation={6}
      onPress={p.onPress}
    >
      <TransitionActionButtonBase>
        <TransitionActionButtonLabel>GO</TransitionActionButtonLabel>
      </TransitionActionButtonBase>
    </TransitionActionButtonElevation>
  </TransitionActionButtonTouchable>
);

type Props = {};
type State = {
  inProgress: boolean,
};

export default class WorkoutScreen extends Component<Props, State> {
  static navigationOptions = {
    title: "workout",
  };

  state = {
    inProgress: false,
  };

  toggleProgress = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        inProgress: !prevState.inProgress,
      };
    });
  };

  render() {
    return (
      <Container>
        {this.state.inProgress ? (
          <InWorkout />
        ) : (
          <WorkoutTransition toggleProgress={this.toggleProgress} />
        )}
      </Container>
    );
  }
}

class InWorkout extends Component<*, void> {
  render() {
    return <View />;
  }
}
class WorkoutTransition extends Component<*, void> {
  render() {
    return (
      <WorkoutTransitionScreenContainer>
        <TransitionImage
          resizeMode="cover"
          source={require("../assets/images/workout/prep.png")}
        />
        <ProgressText>set 1 of 10</ProgressText>
        <SetTypeText>
          <SetRepsText>10</SetRepsText> push-ups
        </SetTypeText>
        <TransitionActionButton onPress={this.props.toggleProgress} />
      </WorkoutTransitionScreenContainer>
    );
  }
}
