module Base = {
  open BsReactNative;
  [@bs.module "Assets"] external illustrations : Js.t({..}) = "Illustrations";
  module Styled = {
    module Container = {
      [@bs.module "./styled/Container"] external container : ReasonReact.reactClass = "default";
      let make = (children) =>
        ReasonReact.wrapJsForReason(~reactClass=container, ~props=Js.Obj.empty(), children);
    };
    module Header = {
      [@bs.module "./styled/Header"] external header : ReasonReact.reactClass = "default";
      let make = (children) =>
        ReasonReact.wrapJsForReason(~reactClass=header, ~props=Js.Obj.empty(), children);
    };
    module RoutineContainer = {
      [@bs.module "./styled/RoutineContainer"] external routineContainer : ReasonReact.reactClass =
        "default";
      let make = (children) =>
        ReasonReact.wrapJsForReason(~reactClass=routineContainer, ~props=Js.Obj.empty(), children);
    };
    module LevelLabel = {
      [@bs.module "./styled/LevelLabel"] external levelLabel : ReasonReact.reactClass = "default";
      let make = (children) =>
        ReasonReact.wrapJsForReason(~reactClass=levelLabel, ~props=Js.Obj.empty(), children);
    };
    module CoverImage = {
      [@bs.module "./styled/CoverImage"] external coverImage : ReasonReact.reactClass = "default";
      let make = (~source=?, ~resizeMode=?, children) =>
        ReasonReact.wrapJsForReason(
          ~reactClass=coverImage,
          ~props={
            "source": Js.Nullable.from_opt(source),
            "resizeMode": Js.Nullable.from_opt(resizeMode)
          },
          children
        );
    };
    module ImageGradient = {
      [@bs.module "./styled/ImageGradient"] external imageGradient : ReasonReact.reactClass =
        "default";
      let make = (~colors, children) =>
        ReasonReact.wrapJsForReason(
          ~reactClass=imageGradient,
          ~props={"colors": colors},
          children
        );
    };
  };
  let component = ReasonReact.statelessComponent("WorkoutCardBase");
  let make = (~navigation, ~state as reductiveState: Progenitor.state, ~dispatch, _children) => {
    ...component,
    render: (_self) =>
      <Styled.Container>
        <Styled.Header>
          <Styled.CoverImage
            source=(
              switch reductiveState.currentWorkout.level {
              | 0 => illustrations##workoutLevel1
              | 1 => illustrations##workoutLevel2
              | 2 => illustrations##workoutLevel3
              | 3 => illustrations##workoutLevel4
              | 4 => illustrations##workoutLevel5
              | _ => illustrations##workoutLevel1
              }
            )
            resizeMode="cover"
          />
          <Styled.ImageGradient colors=[|"rgba(0,0,0,0)", Colors.spotiBlack|] />
          <Styled.LevelLabel>
            (
              ReasonReact.stringToElement(
                "level " ++ string_of_int(reductiveState.currentWorkout.level + 1)
              )
            )
          </Styled.LevelLabel>
          <IntensityButton
            disabled=(reductiveState.currentWorkout.level === 0)
            action="decrement"
            onPress=(() => dispatch(Progenitor.DecrementLevel))
          />
          <IntensityButton
            disabled=(reductiveState.currentWorkout.level === 4)
            action="increment"
            onPress=(() => dispatch(Progenitor.IncrementLevel))
          />
        </Styled.Header>
        <Styled.RoutineContainer>
          <View>
            <RoutineFacet
              sets=Routines.variations[reductiveState.currentWorkout.level].pushUps.sets
              reps=Routines.variations[reductiveState.currentWorkout.level].pushUps.reps
              name="push-ups"
            />
            <RoutineFacet
              sets=Routines.variations[reductiveState.currentWorkout.level].sitUps.sets
              reps=Routines.variations[reductiveState.currentWorkout.level].sitUps.reps
              name="sit-ups"
            />
            <RoutineFacet
              sets=Routines.variations[reductiveState.currentWorkout.level].squats.sets
              reps=Routines.variations[reductiveState.currentWorkout.level].squats.reps
              name="squats"
            />
            <RoutineFacet
              distance=Routines.variations[reductiveState.currentWorkout.level].run.distance
              units=Routines.variations[reductiveState.currentWorkout.level].run.units
              name="run"
            />
          </View>
          <View>
            <RoutineFacet
              amount=Routines.variations[reductiveState.currentWorkout.level].rest.amount
              units=Routines.variations[reductiveState.currentWorkout.level].rest.units
              name="rest"
            />
            <RoutineFacet
              amount=Routines.variations[reductiveState.currentWorkout.level].transition.amount
              units=Routines.variations[reductiveState.currentWorkout.level].transition.units
              name="transition"
            />
          </View>
        </Styled.RoutineContainer>
        <View>
          <WorkoutCardStartButton
            onPress=(() => navigation##navigate("Workout", Js.Obj.empty()))
          />
        </View>
      </Styled.Container>
  };
};

module Provider = {
  let make = Reductive.Provider.createMake(Progenitor.store);
};

let component = ReasonReact.statelessComponent("WorkoutCard");

let make = (~navigation, _children) => {
  ...component,
  render: (_self) => <Provider component=(Base.make(~navigation)) />
};

let default =
  ReasonReact.wrapReasonForJs(
    ~component,
    (jsProps) => make(~navigation=jsProps##navigation, [||])
  );