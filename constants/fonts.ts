// Inter TTFs are embedded at build time via the expo-font config plugin (app.json),
// so no runtime Font.loadAsync is needed. These are the fontFamily strings to use in
// StyleSheet. Only the weights actually used by the app are embedded.
//
// NOTE for later PRs: the embedded family name on iOS is the font's internal PostScript
// name while Android uses the file basename. Verify these on-device when the screens
// start rendering text and adjust if a weight renders as the system font.
export const fonts = {
  regular: 'Inter-UI-Regular',
  medium: 'Inter-UI-Medium',
  bold: 'Inter-UI-Bold',
  black: 'Inter-UI-Black',
} as const;

export type FontWeightName = keyof typeof fonts;
