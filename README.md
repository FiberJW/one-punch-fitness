<p align="center">
  <img alt="OPF App Icon" src="./assets/expo-icon.png" width="256">
</p>

<h3 align="center" style="font-weight:600">
  One Punch Fitness
</h3>

<p align="center">
  A "One Punch Man"-inspired workout app: 100 push-ups, 100 sit-ups, 100 squats,
  and a 10km run — every single day. Pick one of five intensity levels, work
  through each exercise on a timer, and track your streak on the calendar.
</p>

## Screenshots

<p align="center">
  <img style="display:inline-block" alt="Home Screen" src="./docs/images/home.png" width="170">
  <img style="display:inline-block" alt="Workout Screen" src="./docs/images/workout.png" width="170">
  <img style="display:inline-block" alt="Workout Timer" src="./docs/images/timer.png" width="170">
  <img style="display:inline-block" alt="Calendar Screen" src="./docs/images/calendar.png" width="170">
  <img style="display:inline-block" alt="Settings Screen" src="./docs/images/settings.png" width="170">
</p>

## Development

This app relies on native modules (WebView, splash screen, etc.), so it needs a
[development build](https://docs.expo.dev/develop/development-builds/introduction/)
— it will not run in Expo Go.

```sh
npm install       # install dependencies
npx expo run:ios  # build and run the iOS development build (use run:android for Android)
```

Once a development build is installed, `npx expo start` starts the dev server;
press `i` / `a` to open it in the iOS simulator or Android emulator.

### Scripts

```sh
npm run lint       # eslint (eslint-config-expo), zero warnings tolerated
npm run typecheck  # tsc --noEmit (strict)
```

## Built with

- [Expo SDK 57](https://expo.dev/) + [React Native](https://reactnative.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/) (typed routes, native tabs)
- [TypeScript](https://www.typescriptlang.org/) (strict)
- [Zustand](https://github.com/pmndrs/zustand) + AsyncStorage for persistence
