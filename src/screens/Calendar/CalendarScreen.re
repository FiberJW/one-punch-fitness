open BsReactNative;

open NPMBindings;

let baseComponent = ReasonReact.statelessComponent("CalendarScreenBase");

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

let baseMake = (~state as reductiveState: Progenitor.state, ~dispatch, _children) => {
  ...baseComponent,
  render: (_self) => {
    let hist = Array.append([|reductiveState.currentWorkout|], reductiveState.history);
    let markedDates = Js.Dict.empty();
    Js.Array.forEach(
      (w: Progenitor.workout) => {
        let progress = percComplete(w);
        if (progress > 0.) {
          let color = Chroma.scale([|Colors.bRED, "orangered", "yellow", Colors.start|])##mode(
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
              "textColor": Chroma.make(color)##luminance() > 0.5 ? Colors.spotiBlack : "white"
            }
          )
        } else {
          ()
        }
      },
      hist
    );
    <ScrollView
      showsVerticalScrollIndicator=false
      contentContainerStyle=Style.(
                              style([flexGrow(1.), paddingVertical(Pt(16.)), alignItems(Center)])
                            )>
      <RNCalendars.Calendar
        markedDates
        markingType="period"
        style=Style.(style([width(Pt(float(Dimensions.get(`window)##width - 32))), flex(0.)]))
      />
      <DailyProgress
        workout=reductiveState.currentWorkout
        percComplete=(percComplete(reductiveState.currentWorkout))
      />
    </ScrollView>
  }
};

module Provider = {
  let make = Reductive.Provider.createMake(Progenitor.store);
};

let component = ReasonReact.statelessComponent("WorkoutScreen");

let make = (_children) => {...component, render: (_self) => <Provider component=baseMake />};

let default = ReasonReact.wrapReasonForJs(~component, (_jsProps) => make([||]));