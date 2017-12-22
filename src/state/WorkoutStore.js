// @flow
import { observable, action } from "mobx";
import { AsyncStorage } from "react-native";

class WorkoutStore {
  constructor() {
    this.rehydrate();
  }

  bool: boolean;
  bool = observable(false);

  persistAction = (a: *) => (...argz: mixed[]) => {
    a(...argz);
    this.persist();
  };

  toggleBool = this.persistAction(
    action(() => {
      this.bool = !this.bool;
    })
  );

  persist = () => AsyncStorage.setItem("WorkoutStore", JSON.stringify(this));

  rehydrate = action(() => {
    AsyncStorage.getItem("WorkoutStore").then(s => {
      const o = JSON.parse(s);

      if (o !== undefined && o !== null) {
        Object.keys(o).forEach(k => {
          const w: {} = this;
          w[k] = o[k];
        });
      }
    });
  });
}

export default new WorkoutStore();
