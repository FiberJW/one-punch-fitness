// Inter TTFs are embedded at build time via the expo-font config plugin (app.json),
// so no runtime Font.loadAsync is needed. The files are named after their internal
// PostScript names (InterUI-*) so the same fontFamily string resolves on iOS
// (PostScript name) and Android (file basename).
export const fonts = {
  regular: 'InterUI-Regular',
  medium: 'InterUI-Medium',
  bold: 'InterUI-Bold',
  black: 'InterUI-Black',
  // Anton condensed display face — numerals, timer, big counts, GO/COMPLETE.
  display: 'Anton-Regular',
} as const;
