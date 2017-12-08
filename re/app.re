open ReactNative;

let app = () =>
  <View
    style=Style.(
            style([
              flex(1.),
              justifyContent(`center),
              alignItems(`center),
              backgroundColor("white")
            ])
          )>
    <Text value="Reason is awesome!" />
  </View>;