open BsReactNative;

open NPMBindings;

type action =
  | ChangeVisibleWorkout(Progenitor.workout);

type state = {currentWorkout: Progenitor.workout};

let baseComponent = ReasonReact.reducerComponent("CalendarScreenBase");

let percComplete = (workout: Progenitor.workout) =>
  (
    float(workout.setsCompleted.pushUps)
    /. float(Routines.variations[workout.level].pushUps.sets)
    +. float(workout.setsCompleted.sitUps)
    /. float(Routines.variations[workout.level].sitUps.sets)
    +. float(workout.setsCompleted.squats)
    /. float(Routines.variations[workout.level].squats.sets)
    +. (workout.setsCompleted.run ? 1. : 0.)
  )
  /. 4.
  *. 100.;

let baseMake =
    (~state as reductiveState: Progenitor.state, ~dispatch, _children) => {
  ...baseComponent,
  didMount: _self => {
    dispatch(Progenitor.SupressUnusedWarningError);
    ReasonReact.NoUpdate;
  },
  initialState: () => {currentWorkout: reductiveState.currentWorkout},
  reducer: (action, _state) =>
    switch action {
    | ChangeVisibleWorkout(w) => ReasonReact.Update({currentWorkout: w})
    },
  render: self => {
    let hist =
      Array.append([|reductiveState.currentWorkout|], reductiveState.history);
    let markedDates = Js.Dict.empty();
    Js.Array.forEach(
      (w: Progenitor.workout) => {
        let progress = percComplete(w);
        if (progress > 0.) {
          let color = Chroma.scale([|
                        Colors.bRED,
                        "orangered",
                        "yellow",
                        Colors.start
                      |])##mode(
                        "hsl"
                      )##colors(
                        100
                      )[int_of_float(progress) - 1];
          Js.Dict.set(
            markedDates,
            w.date,
            {
              "startingDay": Js.true_,
              "color": color,
              "endingDay": Js.true_,
              "textColor":
                Chroma.make(color)##luminance() > 0.5 ?
                  Colors.spotiBlack : "white"
            }
          );
        } else {
          ();
        };
      },
      hist
    );
    <ScrollView
      showsVerticalScrollIndicator=false
      alwaysBounceVertical=false
      contentContainerStyle=Style.(
                              style([
                                flexGrow(1.),
                                paddingVertical(Pt(16.)),
                                alignItems(Center)
                              ])
                            )>
      <RNCalendars.Calendar
        markedDates
        current=self.state.currentWorkout.date
        markingType="period"
        onDayPress=(
          day =>
            Js.Array.forEach(
              (w: Progenitor.workout) =>
                if (w.date == day##dateString) {
                  self.send(ChangeVisibleWorkout(w));
                },
              hist
            )
        )
        style=Style.(
                style([
                  width(Pt(float(Dimensions.get(`window)##width - 32))),
                  flex(0.)
                ])
              )
      />
      <DailyProgress
        workout=(
          reductiveState.currentWorkout.date == self.state.currentWorkout.date ?
            reductiveState.currentWorkout : self.state.currentWorkout
        )
        percComplete=(
          percComplete(
            reductiveState.currentWorkout.date
            == self.state.currentWorkout.date ?
              reductiveState.currentWorkout : self.state.currentWorkout
          )
        )
      />
    </ScrollView>;
  }
};

module Provider = {
  let make = Reductive.Provider.createMake(Progenitor.store);
};

let component = ReasonReact.statelessComponent("WorkoutScreen");

let make = _children => {
  ...component,
  render: _self => <Provider component=baseMake />
};

let default = ReasonReact.wrapReasonForJs(~component, _jsProps => make([||]));