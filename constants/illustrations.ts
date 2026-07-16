import type { ImageSourcePropType } from 'react-native';

// Ported from the legacy assets/illustrations/index.js.
export const illustrations = {
  saitamaLevel0: require('../assets/illustrations/level-0.png'),
  workoutLevel1: require('../assets/illustrations/level-1.png'),
  workoutLevel2: require('../assets/illustrations/level-2.png'),
  workoutLevel3: require('../assets/illustrations/level-3.png'),
  workoutLevel4: require('../assets/illustrations/level-4.png'),
  workoutLevel5: require('../assets/illustrations/level-5.png'),
  workoutPrep: require('../assets/illustrations/prep.png'),
  theSecretSauce: require('../assets/illustrations/saitamas-secret.png'),
  pushups: require('../assets/illustrations/pushups.png'),
  situps: require('../assets/illustrations/situps.png'),
  squats: require('../assets/illustrations/squats.png'),
  run: require('../assets/illustrations/run.png'),
  properPushups: require('../assets/illustrations/proper_pushups.png'),
  wristsHurtPushup: require('../assets/illustrations/WristsHurtPushup.png'),
} satisfies Record<string, ImageSourcePropType>;

export type IllustrationName = keyof typeof illustrations;

// Expert-mode imagery: the ExpertCard header cover plus one banner per section.
export const expertIllustrations = {
  cover: require('../assets/illustrations/expert/expert-cover.png'),
  upperBody: require('../assets/illustrations/expert/upper-body.png'),
  lowerBody: require('../assets/illustrations/expert/lower-body.png'),
  core: require('../assets/illustrations/expert/core.png'),
} satisfies Record<string, ImageSourcePropType>;

export type ExpertIllustrationName = keyof typeof expertIllustrations;
