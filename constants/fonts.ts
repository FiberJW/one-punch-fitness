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

// Anton's font box is much taller than its glyph ink (ascent 1.176em vs cap
// height 0.859em), so tight lineHeights crop the top of large numerals.
// Ratios from the TTF metrics (unitsPerEm 2048, ascent 2409, descent -674,
// capHeight 1760); used by DisplayText and the rolling timer to clip the
// dead space instead.
export const ANTON = {
  line: 1.506, // full font box, (ascent - descent) / em
  inkTop: 0.3174, // (ascent - capHeight) / em — dead space above cap glyphs
  inkHeight: 0.8594, // capHeight / em — digit/uppercase ink height
} as const;
