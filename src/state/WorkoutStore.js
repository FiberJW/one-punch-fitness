// @flow
import { observable, action } from "mobx";

class WorkoutStore {
  bool: boolean;
  bool = observable(false);

  toggleBool = action(() => {
    this.bool = !this.bool;
  });
}

export default new WorkoutStore();
