/**
 * @providesModule ReducerComponent
 */

import { Component } from "react";

export default class ReducerComponent extends Component {
  reducer = (state, action) => state;
  dispatch = action => {
    this.setState(state => this.reducer(state, action));
  };
}
