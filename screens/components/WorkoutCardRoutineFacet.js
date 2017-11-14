// @flow
import React from "react";
import Amount from "./styled/WorkoutCardRoutineFacetAmount";
import Type from "./styled/WorkoutCardRoutineFacetType";
import Container from "./styled/WorkoutCardRoutineFacetContainer";

export default ({
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
  <Container>
    <Amount>
      {type === "active"
        ? `${sets}${name === "run" ? "" : "x"}${reps} `
        : `${reps}${sets} `}
    </Amount>
    <Type>{name}</Type>
  </Container>
);
