// @flow
import React from "react";
import Amount from "./styled/Amount";
import Type from "./styled/Type";
import Container from "./styled/Container";

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
