// Generated by BUCKLESCRIPT VERSION 2.1.0, PLEASE EDIT WITH CARE
"use strict";

var Curry = require("bs-platform/lib/js/curry.js");
var StyleRe = require("bs-react-native/src/styleRe.js");
var ReactNative = require("bs-react-native/src/reactNative.js");
var ReasonReact = require("reason-react/src/reasonReact.js");

var component = ReasonReact.statelessComponent("CalendarScreen");

function make() {
  var newrecord = component.slice();
  newrecord[/* render */ 9] = function() {
    return ReasonReact.element(
      /* None */ 0,
      /* None */ 0,
      Curry.app(ReactNative.View[/* make */ 0], [
        /* None */ 0,
        /* None */ 0,
        /* None */ 0,
        /* None */ 0,
        /* None */ 0,
        /* None */ 0,
        /* None */ 0,
        /* None */ 0,
        /* None */ 0,
        /* Some */ [
          StyleRe.style(
            /* :: */ [
              StyleRe.flex(1),
              /* :: */ [
                StyleRe.justifyContent(/* center */ 98248149),
                /* :: */ [
                  StyleRe.alignItems(/* center */ 98248149),
                  /* :: */ [StyleRe.backgroundColor("#db7093"), /* [] */ 0],
                ],
              ],
            ]
          ),
        ],
        /* None */ 0,
        /* None */ 0,
        /* None */ 0,
        /* None */ 0,
        /* None */ 0,
        /* None */ 0,
        /* None */ 0,
        /* None */ 0,
        /* None */ 0,
        /* None */ 0,
        /* array */ [],
      ])
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
