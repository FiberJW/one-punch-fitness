// Generated by BUCKLESCRIPT VERSION 2.1.0, PLEASE EDIT WITH CARE
"use strict";

var Assets = require("Assets");
var ReasonReact = require("reason-react/src/reasonReact.js");
var InfoScreenStyled = require("./styled/InfoScreenStyled.bs.js");

var component = ReasonReact.statelessComponent("InfoScreen");

function make() {
  var newrecord = component.slice();
  newrecord[/* render */ 9] = function() {
    return ReasonReact.element(
      /* None */ 0,
      /* None */ 0,
      InfoScreenStyled.Container[/* make */ 0](
        /* array */ [
          ReasonReact.element(
            /* None */ 0,
            /* None */ 0,
            InfoScreenStyled.HeroImage[/* make */ 0](
              Assets.Illustrations.theSecretSauce,
              "cover",
              /* array */ []
            )
          ),
          ReasonReact.element(
            /* None */ 0,
            /* None */ 0,
            InfoScreenStyled.TextContentContainer[/* make */ 0](
              /* array */ [
                ReasonReact.element(
                  /* None */ 0,
                  /* None */ 0,
                  InfoScreenStyled.Title[/* make */ 0](
                    /* array */ ["What is Saitama's secret?"]
                  )
                ),
              ]
            )
          ),
        ]
      )
    );
  };
  return newrecord;
}

var $$default = ReasonReact.wrapReasonForJs(component, function() {
  return make(/* array */ []);
});

exports.component = component;
exports.make = make;
exports.$$default = $$default;
exports.default = $$default;
exports.__esModule = true;
/* component Not a pure module */
