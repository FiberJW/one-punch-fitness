// Generated by BUCKLESCRIPT VERSION 2.1.0, PLEASE EDIT WITH CARE
"use strict";

var Assets = require("Assets");
var Colors = require("../../../../config/Colors.bs.js");
var ReasonReact = require("reason-react/src/ReasonReact.js");
var Title = require("./styled/Title");
var Js_null_undefined = require("bs-platform/lib/js/js_null_undefined.js");
var Container = require("./styled/Container");
var View$BsReactNative = require("bs-react-native/src/components/view.js");
var CoverImage = require("./styled/CoverImage");
var Description = require("./styled/Description");
var ImageGradient = require("./styled/ImageGradient");
var TouchableOpacity$BsReactNative = require("bs-react-native/src/components/touchableOpacity.js");

function make(children) {
  return ReasonReact.wrapJsForReason(Container.default, {}, children);
}

var Container$1 = /* module */ [/* make */ make];

function make$1(children) {
  return ReasonReact.wrapJsForReason(Description.default, {}, children);
}

var Description$1 = /* module */ [/* make */ make$1];

function make$2(source, resizeMode, children) {
  return ReasonReact.wrapJsForReason(
    CoverImage.default,
    {
      source: Js_null_undefined.from_opt(source),
      resizeMode: Js_null_undefined.from_opt(resizeMode),
    },
    children
  );
}

var CoverImage$1 = /* module */ [/* make */ make$2];

function make$3(colors, children) {
  return ReasonReact.wrapJsForReason(
    ImageGradient.default,
    {
      colors: colors,
    },
    children
  );
}

var ImageGradient$1 = /* module */ [/* make */ make$3];

function make$4(children) {
  return ReasonReact.wrapJsForReason(Title.default, {}, children);
}

var Title$1 = /* module */ [/* make */ make$4];

var Styled = /* module */ [
  /* Container */ Container$1,
  /* Description */ Description$1,
  /* CoverImage */ CoverImage$1,
  /* ImageGradient */ ImageGradient$1,
  /* Title */ Title$1,
];

var component = ReasonReact.statelessComponent("InfoCard");

function make$5(navigation, title, shortDescription, content, _) {
  var newrecord = component.slice();
  newrecord[/* render */ 9] = function() {
    return ReasonReact.element(
      /* None */ 0,
      /* None */ 0,
      TouchableOpacity$BsReactNative.make(
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
        /* None */ 0,
        /* Some */ [
          function() {
            return navigation.navigate("Info", {
              title: title,
              content: content,
            });
          },
        ],
        /* None */ 0,
        /* None */ 0,
        /* None */ 0,
        /* Some */ [0.9],
        /* None */ 0,
        /* None */ 0
      )(
        /* array */ [
          ReasonReact.element(
            /* None */ 0,
            /* None */ 0,
            make(
              /* array */ [
                ReasonReact.element(
                  /* None */ 0,
                  /* None */ 0,
                  View$BsReactNative.make(
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
                    /* None */ 0,
                    /* None */ 0,
                    /* None */ 0,
                    /* None */ 0,
                    /* None */ 0,
                    /* None */ 0,
                    /* None */ 0,
                    /* None */ 0,
                    /* None */ 0,
                    /* None */ 0
                  )(
                    /* array */ [
                      ReasonReact.element(
                        /* None */ 0,
                        /* None */ 0,
                        make$2(
                          /* Some */ [Assets.Illustrations.theSecretSauce],
                          /* Some */ ["cover"],
                          /* array */ []
                        )
                      ),
                      ReasonReact.element(
                        /* None */ 0,
                        /* None */ 0,
                        make$3(
                          /* array */ ["rgba(0,0,0,0)", Colors.spotiBlack],
                          /* array */ []
                        )
                      ),
                      ReasonReact.element(
                        /* None */ 0,
                        /* None */ 0,
                        make$4(/* array */ [title])
                      ),
                    ]
                  )
                ),
                ReasonReact.element(
                  /* None */ 0,
                  /* None */ 0,
                  make$1(/* array */ [shortDescription])
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

exports.Styled = Styled;
exports.component = component;
exports.make = make$5;
/* component Not a pure module */
